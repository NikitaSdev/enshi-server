import { Module } from "@nestjs/common"
import { HomeService } from "./home.service"
import { HomeController } from "./home.controller"
import { TypegooseModule } from "nestjs-typegoose"
import { HomeModel } from "./home.model"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: HomeModel,
        schemaOptions: {
          collection: "HomePage"
        }
      }
    ]),
    ConfigModule
  ],
  providers: [HomeService],
  controllers: [HomeController]
})
export class HomeModule {}
