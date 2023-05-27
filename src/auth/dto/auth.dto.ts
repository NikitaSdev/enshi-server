import { IsEmail, IsOptional, IsString } from "class-validator"

export class AuthDto {
  @IsEmail()
  email: string
  @IsString()
  login: string
  @IsString()
  pseudonim: string
  @IsString()
  password: string
}
export class LoginDto {
  @IsString()
  emailOrLogin: string
  @IsString()
  password: string
}
class DataDto {
  @IsString()
  @IsOptional()
  email: string
  @IsString()
  @IsOptional()
  pseudonim: string
  @IsString()
  @IsOptional()
  password: string
  @IsString()
  @IsOptional()
  newPassword: string
  @IsString()
  @IsOptional()
  avatarURL: string
  @IsString()
  @IsOptional()
  wrapperURL: string
}
export class UpdateDto {
  @IsString()
  refreshToken: string
  data: DataDto
}
