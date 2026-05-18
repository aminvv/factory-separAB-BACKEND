import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enums/roles.enum';

export const ROLE_KEY = 'roles';
export const CanAccess = (...roles: Roles[]) => SetMetadata(ROLE_KEY, roles);