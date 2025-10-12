import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "src/common/enums/roles.enum";
import { ROLE_KEY } from "src/common/decorators/role.decorator";



@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        if (!requiredRoles || requiredRoles.length == 0) return true


        const request = context.switchToHttp().getRequest()
        const user = request.user
        const userRole = user?.role as Roles ?? Roles.User
        if (user.role === Roles.Admin) return true
        if (requiredRoles.includes(userRole)) return true
        throw new ForbiddenException()
    
        

    }



}