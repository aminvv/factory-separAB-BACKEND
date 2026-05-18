import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";
import { ImageEntity } from "./entities/image.entity";
import { UserEntity } from "../user/entities/user.entity";
import { AuthModule } from "../auth/auth.module";
import { AdminEntity } from "../admin/entities/admin.entity";

@Module({
imports:[TypeOrmModule.forFeature([ImageEntity,UserEntity,AdminEntity]),AuthModule,],
controllers:[ImageController],
providers:[ImageService],
exports:[]
})

export class ImageModule{}