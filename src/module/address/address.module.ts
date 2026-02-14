import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([AddressEntity,UserEntity]),AuthModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
