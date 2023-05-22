import { Body, Controller, Get, HttpCode, Post, Put } from "@nestjs/common"
import { TopService } from "./top.service"
import { TopDto } from "./dto/top.dto"

@Controller("topPage")
export class TopController {
  constructor(private readonly topService: TopService) {}

  @Post("create")
  @HttpCode(200)
  async create(@Body() password: { [key: string]: string }) {
    return this.topService.createTop(password)
  }
  @Put("update")
  @HttpCode(200)
  async update(@Body() dto: TopDto) {
    return this.topService.updateTopPage(dto)
  }
  @Get("")
  @HttpCode(200)
  async getAll() {
    return this.topService.getAll()
  }
}
