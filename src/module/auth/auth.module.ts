import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenUtils } from './utils/token.utils';

@Module({
  imports:[ TypeOrmModule.forFeature([UserEntity,OtpEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
],
  controllers: [AuthController],
  providers: [AuthService ,TokenService,TokenUtils],
    exports: [AuthService, TokenService, TokenUtils]
})
export class AuthModule {}
