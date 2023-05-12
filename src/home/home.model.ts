import { prop } from "@typegoose/typegoose"

interface IAnnounce {
  title: string
  img: string
  type: "Фильм" | "Сериал"
  genres: Array<string>
}
interface IMain {
  id: string
  photo: string
  description: string
}
export class HomeModel {
  @prop({ default: [{ id: "428", photo: "", description: "" }] })
  main: Array<IMain>
  @prop({ default: [] })
  popular: Array<string>
  @prop({ default: [] })
  announced: Array<IAnnounce>
  @prop({ default: [] })
  ratings: Array<string>
  @prop({ default: [] })
  recommended: Array<string>
}
