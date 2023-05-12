import { Body, Controller, Get, HttpCode, Post, Put } from "@nestjs/common"
import { HomeService } from "./home.service"
import { HomeDto } from "./dto/home.dto"

@Controller("homePage")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post("create")
  @HttpCode(200)
  async create(@Body() password: { [key: string]: string }) {
    return this.homeService.createHome(password)
  }
  @Put("update")
  @HttpCode(200)
  async update(@Body() dto: HomeDto) {
    return this.homeService.updateHomePage(dto)
  }
  @Get("")
  @HttpCode(200)
  async getAll() {
    return this.homeService.getAll()
  }
}
