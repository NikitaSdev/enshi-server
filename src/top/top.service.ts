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
      throw new BadRequestException("Уже существует коллекция страницы топа")
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
        "Нечего изменять, сначала создай коллекцию страницы топа"
      )
    }
    top.list = dto.list
    await top.save()
    return top
  }
  async getAll(limit?: number, page?: number) {
    const data = await this.TopModel.findOne()
    console.log(data.list.slice(page, limit))
    return data.list.slice(page, limit)
  }
}
