import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpCodeDto, SignUpDto, VerifyOtpCodeDto } from './dto/create-auth.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/signup")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto)
  }


  @Post("/createOtp")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  createOtpCode(@Body() otpCodeDto: OtpCodeDto) {
    return this.authService.createOtpCode(otpCodeDto)
  }

  @Post("/verifyOtp")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  verifyOtpCode(@Body() verifyOtpCodeDto: VerifyOtpCodeDto) {
    return this.authService.verifyOtpCode(verifyOtpCodeDto)
  }

  @Get('check-mobile/:mobile')
async checkMobile(@Param('mobile') mobile: string) {
  return this.authService.checkMobileExists(mobile);
}

}
