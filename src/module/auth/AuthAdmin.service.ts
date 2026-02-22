import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "../admin/entities/admin.entity";
import { Repository } from "typeorm";
import { AuthAdminDto } from "./dto/create-auth.dto";
import { TokenService } from "./token.service";
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthAdminService {


    constructor(
        @InjectRepository(AdminEntity) private AdminRepository: Repository<AdminEntity>,
        private tokenService: TokenService,
    ) { }


    async loginAdmin(authAdminDto: AuthAdminDto) {
        const { email ,password} = authAdminDto

        const admin = await this.findAdminByEmail(email)
        if (!admin) {
            throw new UnauthorizedException('ادمینی با این ایمیل وجود ندارد')
        }
         const isMatch= await bcrypt.compare(password,admin.password)
         if(!isMatch){
            throw new UnauthorizedException(" ایمیل یا نام کاربری نادرست میباشد")
         }

        

        const accessToken = this.tokenService.generateAccessToken({ userId: admin.id })

        return {
            message: "ورود موفق",
            accessToken,
        }


    }








    async findAdminByEmail(email: string) {
        const admin = await this.AdminRepository.findOneBy({ email })
        return admin
    }

}