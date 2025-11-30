import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminGuard } from './adminGuard.guard';
import { UserGuard } from './userGuard.guard';

@Injectable()
export class AnyAuthGuard implements CanActivate {
  constructor(
    private adminGuard: AdminGuard,
    private userGuard: UserGuard,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const adminResult = await this.adminGuard.canActivate(context);
      if (adminResult) return true;
    } catch (e) {
      // ignore
    }

    try {
      const userResult = await this.userGuard.canActivate(context);
      if (userResult) return true;
    } catch (e) {
      // ignore
    }

    return false;
  }
}
