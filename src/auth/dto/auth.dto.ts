import { IsEmail, IsString } from "class-validator"

export class AuthDto {
  @IsEmail()
  email: string
  @IsString()
  login: string
  @IsString()
  password: string
}
export class LoginDto {
  @IsString()
  emailOrLogin: string
  @IsString()
  password: string
}
