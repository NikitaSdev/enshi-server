import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { HomeModel } from "./home.model"
import * as process from "process"
import { HomeDto } from "./dto/home.dto"

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(HomeModel) private readonly HomeModel: ModelType<HomeModel>
  ) {}

  async createHome(password: { [key: string]: string }) {
    if (password.password !== process.env.PASSWORD || !password) {
      throw new BadRequestException("неправильный пароль")
    }
    const findHome = await this.HomeModel.findOne()
    if (findHome) {
      throw new BadRequestException("Уже существует коллекция главной страницы")
    }
    const home = new this.HomeModel({
      main: {
        list: [
          {
            id: "428",
            photo: "dummyPhoto",
            description: "dummyDescription",
            link: "dummyLink",
            rating: 5,
            season: 1
          }
        ]
      },
      popular: ["7433", "6826", "9217", "8659"],
      announced: [
        {
          title: "Магическая битва 2",
          img: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/b17b8e66-4f09-4456-b67e-fefa2aa8b8cf/1920x",
          type: "Фильм",
          genres: ["Комедия", "Экшен"]
        },
        {
          title: "Магическая битва 2",
          img: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/b17b8e66-4f09-4456-b67e-fefa2aa8b8cf/1920x",
          type: "Фильм",
          genres: ["Комедия", "Экшен"]
        },
        {
          title: "Магическая битва 2",
          img: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/b17b8e66-4f09-4456-b67e-fefa2aa8b8cf/1920x",
          type: "Фильм",
          genres: ["Комедия", "Экшен"]
        }
      ],
      ratings: ["7433", "6826", "9217", "8659"],
      recommended: ["7433", "6826", "9217", "8659"]
    })
    await home.save()

    return ["Теперь нужно обновить коллекцию до актуального состояния", home]
  }
  async updateHomePage(dto: HomeDto) {
    if (dto.password !== process.env.PASSWORD || !dto.password) {
      throw new BadRequestException("неправильный пароль")
    }
    const home = await this.HomeModel.findOne()
    if (!home) {
      throw new BadRequestException(
        "Нечего изменять, сначала создай коллекцию главной страницы"
      )
    }
    home.main = dto.main
    home.popular = dto.popular
    home.announced = dto.announced
    home.trending = dto.trending
    home.ratings = dto.ratings
    home.recommended = dto.recommended
    await home.save()
    return home
  }
  async getAll() {
    return this.HomeModel.findOne()
  }
}
