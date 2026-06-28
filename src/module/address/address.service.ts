
import { Injectable, Scope, Inject, NotFoundException, ForbiddenException, UnauthorizedException, } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { request, Request } from "express";
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











  async CheckIsDefault(dto, user) {
    if (!user) throw new UnauthorizedException(' وارد حساب کاربری خود شوید');
    if (dto.isDefault) {
      await this.addressRepository
        .createQueryBuilder()
        .update()
        .set({ isDefault: false })
        .where("userId = :userId AND isDefault = :isDefault", {
          userId: user.id,
          isDefault: true,
        })
        .execute();
    }
  }











  async create(dto: CreateAddressDto) {
    try {
      const user = this.request.user;
      this.CheckIsDefault(dto, user)
      const address = this.addressRepository.create({
        ...dto,
        user: user,
      });

      return this.addressRepository.save(address);

    } catch (err) {

    }
  }











  async findAll() {
    const user = this.request.user;
    if (!user || !user.id) {
      return [];
    }
    return this.addressRepository.find({
      where: {
        user: {
          id: user.id
        }
      },
      order: { 
        isDefault: 'DESC',
        created_at: 'DESC'
      }
    });
  }




 





  async findOne() {
    const user = this.request.user
    const address = await this.addressRepository.findOne({
      where: { user: { id: user?.id } },
    });

    if (!address) throw new NotFoundException("Address not found");

    return address;
  }






  async findOneById(id: number) {
  const user = this.request.user;
  const address = await this.addressRepository.findOne({
    where: { id, user: { id: user?.id } },
  });
  if (!address) throw new NotFoundException('آدرس یافت نشد');
  return address;
}








async update(id: number, dto: UpdateAddressDto) {
  const user = this.request.user
  await this.CheckIsDefault(dto, user)
  const address = await this.findOneById(id)
  Object.assign(address, dto)
  return this.addressRepository.save(address)
}










async remove(id: number) {
  const address = await this.findOneById(id)
  await this.addressRepository.remove(address)
  return { message: 'Address removed successfully' }
}
}
