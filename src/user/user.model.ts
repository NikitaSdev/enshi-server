import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { prop } from "@typegoose/typegoose"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  @prop({ unique: true })
  login: string
  @prop()
  pseudonim: string
  @prop()
  email: string
  @prop()
  emailOrLogin?: string
  @prop()
  password: string
  @prop({ default: false })
  activated: boolean
  @prop()
  activationLink: string
  @prop()
  passwordLink: string
  @prop({ default: [] })
  count: Array<string>
  @prop({ default: [] })
  favourites: Array<string>
  @prop({ default: "/uploads/avatars/default.jpg" })
  avatarURL: string
  @prop({ default: "/uploads/wrappers/default.png" })
  wrapperURL: string
}
