import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { UserModel } from "./user.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { UpdateUserDto } from "./dto/updateUser.dto"
import { genSalt, hash } from "bcryptjs"
import { Types } from "mongoose"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
  ) {}
  async byId(_id: string) {
    const user = await this.UserModel.findById(_id).exec()
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }
  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.byId(_id)

    const isSameUser = await this.UserModel.findOne({ email: dto.email })
    if (isSameUser && String(_id) !== String(isSameUser._id)) {
      throw new NotFoundException("Email is busy")
    }
    if (dto.password) {
      const salt = await genSalt(10)
      user.password = await hash(dto.password, salt)
    }
    user.email = dto.email
    await user.save()
    return
  }

  async delete(id: string) {
    return this.UserModel.findByIdAndDelete(id).exec()
  }
  async toggleFavourite(movieId: string, user: UserModel) {
    const { _id, favourites } = user
    await this.UserModel.findByIdAndUpdate(_id, {
      favourites: favourites.includes(movieId)
        ? favourites.filter((id) => String(id) !== String(movieId))
        : [...favourites, movieId]
    })
  }
  async getFavouriteMovies(_id: Types.ObjectId) {
    return this.UserModel.findById(_id, "favourites")
      .populate({
        path: "favourites"
      })
      .exec()
      .then((data) => data.favourites)
  }
}
