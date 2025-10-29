import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthAdminDto, AuthDto, CreateAdminDto, OtpCodeDto, VerifyOtpCodeDto } from './dto/create-auth.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { TokenUtils } from './utils/token.utils';
import { Request, Response } from 'express';
import { TokenService } from './token.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthAdminService } from './AuthAdmin.service';

@ApiTags("Auth")
@ApiBearerAuth("Authorization")
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authAdminService: AuthAdminService,

  ) { }

  @Post("/login-admin")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async loginAdmin(@Body() authAdminDto: AuthAdminDto) {
    const { accessToken, message } = await this.authAdminService.loginAdmin(authAdminDto)
    return { message, accessToken }

  }
  @Post("/create-admin-bySuperAdmin")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async signIn(@Body() createAdminDto: CreateAdminDto) {
    const  message  = await this.authAdminService.createAdminBySuperAdmin(createAdminDto)
    return { message }
  }


}
