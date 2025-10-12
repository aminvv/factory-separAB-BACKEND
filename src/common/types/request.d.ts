// src/types/express.d.ts
import { UserEntity } from 'src/module/user/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserEntity;
  }
}
