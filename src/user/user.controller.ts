import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UsePipes,
  ValidationPipe
} from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "./decorators/user.decorator"
import { UpdateUserDto } from "./dto/updateUser.dto"
import { IdValidationPipe } from "../pipes/id.validation.pipe"
import { Types } from "mongoose"
import { UserModel } from "./user.model"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("profile")
  async getProfile(@User("_id") _id: string) {
    return this.userService.byId(_id)
  }
  @UsePipes(new ValidationPipe())
  @Put("profile")
  @HttpCode(200)
  async updateProfile(@User("_id") _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto)
  }
  @UsePipes(new ValidationPipe())
  @Put(":id")
  @HttpCode(200)
  async updateUser(
    @Param("id", IdValidationPipe) id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.userService.updateProfile(id, dto)
  }

  @Delete(":id")
  @HttpCode(200)
  async deleteUser(@Param("id", IdValidationPipe) id: string) {
    return this.userService.delete(id)
  }

  @Get(":id")
  async getUser(@Param("id", IdValidationPipe) id: string) {
    return this.userService.byId(id)
  }
  @Get("profile/favourites")
  async getFavourites(@User("_id") _id: Types.ObjectId) {
    return this.userService.getFavouriteMovies(_id)
  }
  @Put("profile/favourites")
  @HttpCode(200)
  async toggleFavourites(
    @Body("movieId", IdValidationPipe) movieId: string,
    @User() user: UserModel
  ) {
    return this.userService.toggleFavourite(movieId, user)
  }
}
