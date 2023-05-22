import { prop } from "@typegoose/typegoose"

export class TopModel {
  @prop({ default: [""] })
  list: Array<string>
}
