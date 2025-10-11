import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { AuthMessage } from "src/common/enums/message.enum";
import { AuthService } from "../auth.service";



@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService:AuthService){}

    async canActivate(context: ExecutionContext) : Promise<boolean>{
        const request = context.switchToHttp().getRequest<Request>()
        const token=this.executionToken(request)
        request.user= await this.authService.validationAccessToken(token)

        return true
    }

    protected executionToken(request: Request) {
        const { authorization } = request.headers
        if (!authorization || authorization.trim() == "") {
            throw new UnauthorizedException(AuthMessage.loginAgain)
        }
        const[bearer,token]=authorization.split(" ")
        if(bearer?.toLowerCase()!=="bearer" || ! token || !isJWT(token)){
            throw new UnauthorizedException(AuthMessage.loginRequired)
        }
                return token
    }

}