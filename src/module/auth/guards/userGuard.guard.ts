import { Repository } from "typeorm";
import { BaseAuthGuard } from "./BaseAuth.guard";
import { TokenService } from "../token.service";
import { UserEntity } from "src/module/user/entities/user.entity";

export class AdminGuard extends BaseAuthGuard {
  constructor(
    private userRepository: Repository<UserEntity>,
    private tokenService: TokenService 
  ) {
    super();
  }
   protected verifyToken(token: string) {
        return this.tokenService.verifyToken(token,'access')
   }

   protected findUser(userId:number){
     return this.userRepository.findOneBy({id:userId})
   }


}