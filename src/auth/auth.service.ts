import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { UserModel } from "src/user/user.model"
import { AuthDto, LoginDto, UpdateDto } from "./dto/auth.dto"
import { compare, genSalt, hash } from "bcryptjs"
import { JwtService } from "@nestjs/jwt"
import { RefreshTokenDto } from "./dto/refreshToken.dto"
import { MailService } from "../service/mail.service"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto)
    if (user.activated === false)
      throw new UnauthorizedException("Подтвердите почту")
    const tokens = await this.issueTokenPair(String(user._id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
  async updateUser(dto: UpdateDto) {
    if (!dto.refreshToken) {
      throw new UnauthorizedException("Sign in")
    }
    const result = await this.jwtService.verifyAsync(dto.refreshToken)
    if (!result) {
      throw new UnauthorizedException("Invalid token or expired")
    }
    const user = await this.UserModel.findById(result._id)
    console.log(user)
  }
  async register(dto: AuthDto) {
    const mailService = new MailService()
    const emailMatch = await this.UserModel.findOne({
      email: dto.email
    })
    const loginMatch = await this.UserModel.findOne({
      login: dto.login
    })
    if (loginMatch) {
      throw new BadRequestException("Логин занят")
    }
    if (emailMatch) {
      throw new BadRequestException("Email занят")
    }
    const salt = await genSalt()
    const newUser = new this.UserModel({
      email: dto.email,
      login: dto.login,
      pseudonim: dto.pseudonim,
      activationLink: uuidv4(),
      password: await hash(dto.password, salt)
    })

    const tokens = await this.issueTokenPair(String(newUser._id))
    await mailService.sendActivationMail(
      dto.email,
      `${process.env.DOMAIN}auth/activate/${newUser.activationLink}`
    )

    const user = await newUser.save()
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
  async changePassword(emailOrLogin: string) {
    const user = await this.UserModel.findOne({
      $or: [{ email: emailOrLogin }, { login: emailOrLogin }]
    })
    console.log(user)
    if (!user) {
      throw new UnauthorizedException("Пользователь не найден")
    }
    const mailService = new MailService()
    const passwordLink = uuidv4()
    user.passwordLink = passwordLink
    await mailService.changePassword(user.email, passwordLink)
    user.save()
    return user
  }
  async getPassword(passwordLink: string) {
    const user = await this.UserModel.findOne({ passwordLink })
    if (!user) {
      throw new Error("Неккоректная ссылка")
    }
    const newPassword = uuidv4().slice(0, 7)
    const salt = await genSalt()
    user.password = await hash(newPassword, salt)
    await user.save()
    return newPassword
  }
  async activate(activationLink: string) {
    const user = await this.UserModel.findOne({ activationLink })
    if (!user) {
      throw new Error("Неккоректная ссылка")
    }
    user.activated = true
    await user.save()
    return
  }

  async validateUser(dto: LoginDto): Promise<UserModel> {
    const User = await this.UserModel.findOne({
      $or: [{ email: dto.emailOrLogin }, { login: dto.emailOrLogin }]
    })
    if (!User) {
      throw new UnauthorizedException("Пользователь не найден")
    }
    const isValidPassword = await compare(dto.password, User.password)
    if (!isValidPassword) {
      throw new UnauthorizedException("Неверный пароль")
    }
    return User
  }
  async issueTokenPair(userId: string) {
    const data = { _id: userId }
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: "15d"
    })

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: "1h"
    })
    return { refreshToken, accessToken }
  }
  returnUserFields(user: UserModel) {
    console.log(user)
    return {
      _id: user._id,
      pseudonim: user.pseudonim,
      avatarUrl: user.avatarURL,
      wrapperURL: user.wrapperURL,
      login: user.login,
      favourites: user.favourites,
      email: user.email,
      count: user.count
    }
  }
  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException("Sign in")
    }
    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException("Invalid token or expired")
    }
    const user = await this.UserModel.findById(result._id)
    const tokens = await this.issueTokenPair(String(user._id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
}
