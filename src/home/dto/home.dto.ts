export class HomeDto {
  password: string
  main: IMain
  popular: Array<string>
  announced: { list: IAnnounce }
  ratings: Array<string>
  recommended: Array<string>
  trending: Array<string>
}
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
