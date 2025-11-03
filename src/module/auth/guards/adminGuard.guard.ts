import { Repository } from "typeorm";
import { BaseAuthGuard } from "./BaseAuth.guard";
import { AdminEntity } from "src/module/admin/entities/admin.entity";
import { TokenService } from "../token.service";

export class AdminGuard extends BaseAuthGuard {
  constructor(
    private adminRepository: Repository<AdminEntity>,
    private tokenService: TokenService 
  ) {
    super();
  }
   protected verifyToken(token: string) {
        return this.tokenService.verifyToken(token,'access')
   }

   protected findUser(userId:number){
     return this.adminRepository.findOneBy({id:userId})
   }


}