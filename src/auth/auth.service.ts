import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { UserModel } from "src/user/user.model"
import { AuthDto, LoginDto } from "./dto/auth.dto"
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
    const tokens = await this.issueTokenPair(String(user._id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
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
      throw new BadRequestException("This login is already taken")
    }
    if (emailMatch) {
      throw new BadRequestException("This email is already taken")
    }
    const salt = await genSalt()
    const newUser = new this.UserModel({
      email: dto.email,
      login: dto.login,
      activationLink: uuidv4(),
      password: await hash(dto.password, salt)
    })

    const tokens = await this.issueTokenPair(String(newUser._id))
    await mailService.sendActivationMail(
      dto.email,
      `${process.env.API_URL}/api/auth/activate/${newUser.activationLink}`
    )

    const user = await newUser.save()
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
  async activate(activationLink: string) {
    const user = await this.UserModel.findOne({ activationLink })
    if (!user) {
      throw new Error("Неккоректная ссылка")
    }
    user.activated = true
    await user.save()
  }

  async validateUser(dto: LoginDto): Promise<UserModel> {
    const User = await this.UserModel.findOne({
      $or: [{ email: dto.emailOrLogin }, { login: dto.emailOrLogin }]
    })
    if (!User) {
      throw new UnauthorizedException("User not found")
    }
    const isValidPassword = await compare(dto.password, User.password)
    if (!isValidPassword) {
      throw new UnauthorizedException("Wrong password")
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
    return {
      _id: user._id,
      login: user.login,
      email: user.email
    }
  }
  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException("Sign in, bastard")
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
