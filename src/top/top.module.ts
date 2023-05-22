import { Module } from "@nestjs/common"
import { TopService } from "./top.service"
import { TopController } from "./top.controller"
import { TypegooseModule } from "nestjs-typegoose"

import { ConfigModule } from "@nestjs/config"
import { TopModel } from "./top.model"

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TopModel,
        schemaOptions: {
          collection: "TopPage"
        }
      }
    ]),
    ConfigModule
  ],
  providers: [TopService],
  controllers: [TopController]
})
export class TopModule {}
