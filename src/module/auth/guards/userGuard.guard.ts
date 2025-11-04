import { Repository } from "typeorm";
import { BaseAuthGuard } from "./BaseAuth.guard";
import { TokenService } from "../token.service";
import { UserEntity } from "src/module/user/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class UserGuard extends BaseAuthGuard {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private tokenService: TokenService 
  ) {
    super();
  }
   protected async verifyToken(token: string) {
        return this.tokenService.verifyToken(token,'access')
   }

   protected async findUser(userId:number){
     return this.userRepository.findOneBy({id:userId})
   }


}