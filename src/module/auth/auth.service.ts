import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/create-auth.dto';
import { UserEntity } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

constructor(@InjectRepository(UserEntity) private userRepository:Repository<UserEntity>){}

  async signup(signupDto:SignUpDto){  
    const{firstName,username,email,lastName,password}=signupDto

    const salt=await bcrypt.genSalt(10)
    const hashPassword=await bcrypt.hash(password,salt)

    const user=await this.userRepository.create({
      firstName,
      lastName,
      email,
      username,
      password:hashPassword,
    })

     await this.userRepository.save(user)
     return{
      message :"signup successfully"
     }
  }




}
