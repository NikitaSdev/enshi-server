import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"

import * as process from "process"
import { TopDto } from "./dto/top.dto"
import { TopModel } from "./top.model"

@Injectable()
export class TopService {
  constructor(
    @InjectModel(TopModel) private readonly TopModel: ModelType<TopModel>
  ) {}

  async createTop(password: { [key: string]: string }) {
    if (password.password !== process.env.PASSWORD || !password) {
      throw new BadRequestException("неправильный пароль")
    }
    const findHome = await this.TopModel.findOne()
    if (findHome) {
      throw new BadRequestException("Уже существует коллекция главной страницы")
    }
    const home = new this.TopModel({
      list: [""]
    })
    await home.save()

    return ["Теперь нужно обновить коллекцию до актуального состояния", home]
  }
  async updateTopPage(dto: TopDto) {
    if (dto.password !== process.env.PASSWORD || !dto.password) {
      throw new BadRequestException("неправильный пароль")
    }
    const top = await this.TopModel.findOne()
    if (!top) {
      throw new BadRequestException(
        "Нечего изменять, сначала создай коллекцию главной страницы"
      )
    }
    top.list = dto.list
    await top.save()
    return top
  }
  async getAll() {
    return this.TopModel.findOne()
  }
}