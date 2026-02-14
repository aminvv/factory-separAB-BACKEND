
import { Injectable, Scope, Inject, NotFoundException, ForbiddenException, } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddressEntity } from "./entities/address.entity";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Injectable({ scope: Scope.REQUEST })
export class AddressService {

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(AddressEntity) private readonly addressRepository: Repository<AddressEntity>,
  ) { }

  async create(dto: CreateAddressDto) {
    const user = this.request.user
    const address = this.addressRepository.create({
      ...dto,
      user: user,
    });
    
    return this.addressRepository.save(address);
  }
  
  async findAll() {
    const user = this.request.user
    return this.addressRepository.find({
      where: { user:{id:user?.id} },
    });
  }

  async findOne() {
    const user = this.request.user
    const address = await this.addressRepository.findOne({
      where: { user:{id:user?.id} },
    });

    if (!address) throw new NotFoundException("Address not found");

    return address;
  }

  async update(id: number, dto: UpdateAddressDto) {
    const address = await this.findOne();

    Object.assign(address, dto);

    return this.addressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.findOne();

    await this.addressRepository.remove(address);

    return { message: "Address removed successfully" };
  }
}
