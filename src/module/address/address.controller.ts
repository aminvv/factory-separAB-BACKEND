import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { UserGuard } from "../auth/guards/userGuard.guard";
import { swaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@ApiTags("UserAddress")
@ApiBearerAuth("Authorization")
@UseGuards(UserGuard)
@Controller("user/address")
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  create(@Body() dto: CreateAddressDto) {
    return this.addressService.create(dto);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(":id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findOne() {
    return this.addressService.findOne();
  }

  @Patch(":id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  update(@Param("id") id: number,@Body() dto: UpdateAddressDto,){
    return this.addressService.update(id, dto);
  }

  @Delete(":id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  remove(@Param("id") id: number) {
    return this.addressService.remove(id);
  }
}
