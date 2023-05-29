import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Redirect,
  Res,
  UsePipes,
  ValidationPipe
} from "@nestjs/common"

import { AuthService } from "./auth.service"
import { AuthDto, LoginDto } from "./dto/auth.dto"
import { RefreshTokenDto } from "./dto/refreshToken.dto"
import * as process from "process"

@Controller("auth")
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get("activate/:link")
  @Redirect(`${process.env.CLIENT}activate`)
  async activate(@Param("link") link: string) {
    await this.AuthService.activate(link)
  }
  redirect(@Res() res) {
    return res.redirect("/books/greet")
  }

  @Get("getNewPassword/:link")
  @UsePipes(new ValidationPipe())
  async getPassword(@Param("link") link: string, @Res() response) {
    const password = await this.AuthService.getPassword(link)
    console.log(password)
    response.redirect(`${process.env.CLIENT}newPassword/${password}`)
  }
  @Post("register")
  async register(@Body() dto: AuthDto) {
    return this.AuthService.register(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.AuthService.login(dto)
  }
  @Post("changePassword")
  async changePassword(@Body("emailOrLogin") emailOrLogin: string) {
    return this.AuthService.changePassword(emailOrLogin)
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login/access-token")
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.AuthService.getNewTokens(dto)
  }
}
