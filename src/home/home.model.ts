import { prop } from "@typegoose/typegoose"

interface IAnnounce {
  title: string
  img: string
  type: "Фильм" | "Сериал"
  genres: Array<string>
}
interface IMainItem {
  id: string
  photo: string
  rating: number
  season: number
  description: string
  link: string
}
interface IMain {
  list: Array<IMainItem>
}

export class HomeModel {
  @prop({
    default: [
      { id: "428", photo: "", description: "", link: "", season: 1, rating: 5 }
    ]
  })
  main: IMain
  @prop({ default: [] })
  popular: Array<string>
  @prop({ default: [] })
  announced: { list: IAnnounce }
  @prop({ default: [""] })
  trending: Array<string>
  @prop({ default: [] })
  ratings: Array<string>
  @prop({ default: [] })
  recommended: Array<string>
}
