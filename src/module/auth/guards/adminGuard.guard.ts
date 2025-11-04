import { Repository } from "typeorm";
import { BaseAuthGuard } from "./BaseAuth.guard";
import { AdminEntity } from "src/module/admin/entities/admin.entity";
import { TokenService } from "../token.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";




@Injectable()
export class AdminGuard extends BaseAuthGuard {
  constructor(
    @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
    private tokenService: TokenService 
  ) {
    super();
  }
   protected async verifyToken(token: string) {
        return this.tokenService.verifyToken(token,'access')
   }

   protected async findUser(userId:number){
     return this.adminRepository.findOneBy({id:userId})
   }


}