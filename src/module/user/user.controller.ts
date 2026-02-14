import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { swaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@ApiTags("User")
@Controller("user")
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findOne(@Param("id") id: number) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  update(@Param("id") id: number,@Body() dto: UpdateUserDto,) {
    return this.userService.update(+id, dto);
  }

  @Delete(":id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  remove(@Param("id") id: number) {
    return this.userService.remove(+id);
  }
}
