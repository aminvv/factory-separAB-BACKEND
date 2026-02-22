import { Controller, Get, Post, Body,  UseGuards, Request } from '@nestjs/common';
import { AuthAdminDto, } from './dto/create-auth.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { AuthAdminService } from './AuthAdmin.service';
import { AdminGuard } from './guards/adminGuard.guard';

@ApiTags("AuthAdmin")
@ApiBearerAuth("Authorization")
@Controller('authAdmin')
export class AuthAdminController {
  constructor(
    private readonly authAdminService: AuthAdminService,

  ) { }

  
  @Post("/login-admin")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async loginAdmin(@Body() authAdminDto: AuthAdminDto) {
    const { accessToken, message } = await this.authAdminService.loginAdmin(authAdminDto)
    return { message, accessToken }

  }



  @Get('me')
  @UseGuards(AdminGuard)
  me(@Request() req) {
    return req.user;
  }
}
