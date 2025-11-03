// src/types/express.d.ts
import { AdminEntity } from 'src/module/admin/entities/admin.entity';
import { UserEntity } from 'src/module/user/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserEntity;
    admin?: AdminEntity;
  }
}
