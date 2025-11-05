import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { AuthMessage } from "src/common/enums/message.enum";
import { AuthService } from "../auth.service";



@Injectable()
export abstract class BaseAuthGuard implements CanActivate {

    protected abstract roleKey: 'user' | 'admin'
    constructor() { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.executionToken(request);

        try {
            const payload = await this.verifyToken(token)
            const user = await this.findUser(payload.userId)
            if (!user) throw new UnauthorizedException(AuthMessage.loginAgain);

            request [this.roleKey]=user

            return true;

        } catch (err) {
            throw new UnauthorizedException(AuthMessage.loginAgain);
        }
    }

    protected abstract verifyToken(token: string)



     protected abstract findUser(userId: number)




    protected executionToken(request: Request) {
        const { authorization } = request.headers
        if (!authorization || authorization.trim() == "") {
            throw new UnauthorizedException(AuthMessage.loginAgain)
        }
        const [bearer, token] = authorization.split(" ")
        if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
            throw new UnauthorizedException(AuthMessage.loginRequired)
        }
        return token
    }

}