import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { UserModel } from "./user.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { Types } from "mongoose"
import { UpdateDto } from "../auth/dto/auth.dto"
import { JwtService } from "@nestjs/jwt"
import { compare, genSalt, hash } from "bcryptjs"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) {}
  async byId(_id: string) {
    const user = await this.UserModel.findById(_id).exec()
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }
  async updateProfile(dto: UpdateDto) {
    if (!dto.refreshToken) {
      throw new UnauthorizedException("Sign in")
    }
    const result = await this.jwtService.verifyAsync(dto.refreshToken)
    if (!result) {
      throw new UnauthorizedException("Invalid token or expired")
    }
    const user = await this.UserModel.findById(result._id)
    if (dto.data.email && dto.data.email !== "") user.email = dto.data.email
    if (dto.data.pseudonim && dto.data.pseudonim !== "")
      user.pseudonim = dto.data.pseudonim
    if (dto.data.avatarURL && dto.data.avatarURL !== "")
      user.avatarURL = dto.data.avatarURL
    if (dto.data.wrapperURL && dto.data.wrapperURL !== "")
      user.wrapperURL = dto.data.wrapperURL
    if (
      dto.data.password &&
      dto.data.password !== "" &&
      dto.data.newPassword &&
      dto.data.newPassword !== ""
    ) {
      const isValidPassword = await compare(dto.data.password, user.password)
      if (isValidPassword) {
        const salt = await genSalt()
        user.password = await hash(dto.data.newPassword, salt)
      } else {
        return "Пароли не совпадают"
      }
    }
    await user.save()
    return user
  }

  async delete(id: string) {
    return this.UserModel.findByIdAndDelete(id).exec()
  }
  async count(movieId: string, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("Sign in")
    }
    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException("Invalid token or expired")
    }
    const user = await this.UserModel.findById(result._id)

    const count = user.count || []

    await user.count.filter((id) => String(id) == String(movieId))

    const updatedCount = user.count.includes(movieId)
      ? [...count]
      : [...count, movieId]

    const updatedUser = await this.UserModel.findByIdAndUpdate(
      result._id,
      {
        count: updatedCount
      },
      { new: true }
    )

    return updatedUser
  }
  async getCount(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("Sign in")
    }
    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException("Invalid token or expired")
    }
    const user = await this.UserModel.findById(result._id)
    return user.count.length
  }
  async toggleFavourite(movieId: string, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("Sign in")
    }
    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException("Invalid token or expired")
    }

    const user = await this.UserModel.findById(result._id)

    const favourites = user.favourites || []

    const updatedFavourites = favourites.includes(movieId)
      ? favourites.filter((id) => String(id) !== String(movieId))
      : [...favourites, movieId]

    const updatedUser = await this.UserModel.findByIdAndUpdate(
      result._id,
      {
        favourites: updatedFavourites
      },
      { new: true }
    )

    return updatedUser
  }
  async getFavouriteMovies(_id: string) {
    console.log(this.UserModel.findById(_id))
    return this.UserModel.findById(_id, "favourites")
      .exec()
      .then((data) => data.favourites)
  }
}
