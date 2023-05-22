import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypegooseModule } from "nestjs-typegoose"
import { getMongoDbConfig } from "./config/mongo.config"
import { AuthModule } from "./auth/auth.module"
import { UserModule } from "./user/user.module"
import { FileModule } from "./file/file.module"
import { HomeModule } from "./home/home.module"
import { TopModule } from "./top/top.module"

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDbConfig
    }),
    AuthModule,
    UserModule,
    HomeModule,
    TopModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
