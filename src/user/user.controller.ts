import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put
} from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "./decorators/user.decorator"

import { IdValidationPipe } from "../pipes/id.validation.pipe"
import { UpdateDto } from "../auth/dto/auth.dto"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("profile")
  async getProfile(@User("_id") _id: string) {
    return this.userService.byId(_id)
  }

  @Put("profile")
  @HttpCode(200)
  async updateUser(@Body() dto: UpdateDto) {
    return this.userService.updateProfile(dto)
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
  @Post("profile/favourites")
  async getFavourites(@Body("_id") _id: string) {
    return this.userService.getFavouriteMovies(_id)
  }
  @Get("count")
  async getCount(@Body("refreshToken") refreshToken: string) {
    return this.userService.getCount(refreshToken)
  }
  @Post("count")
  async postCount(
    @Body("refreshToken") refreshToken: string,
    @Body("movieId") movieId: string
  ) {
    return this.userService.count(movieId, refreshToken)
  }
  @Put("profile/favourites")
  @HttpCode(200)
  async toggleFavourites(
    @Body("movieId") movieId: string,
    @Body("refreshToken") refreshToken: string
  ) {
    return this.userService.toggleFavourite(movieId, refreshToken)
  }
}
