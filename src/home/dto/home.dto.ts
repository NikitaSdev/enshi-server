export class HomeDto {
  password: string
  main: Array<IMain>
  popular: Array<string>
  announced: Array<IAnnounce>
  ratings: Array<string>
  recommended: Array<string>
}
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
