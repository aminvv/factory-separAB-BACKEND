import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, OtpCodeDto, VerifyOtpCodeDto } from './dto/create-auth.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { TokenUtils } from './utils/token.utils';
import { Request, Response } from 'express';
import { TokenService } from './token.service';
import { AuthGuard } from './guards/auth.guard';

@ApiTags("Auth")
@ApiBearerAuth("Authorization")
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly tokenUtils: TokenUtils

  ) { }

  @Post("/signup")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async signUp(@Body() signUpDto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, message } = await this.authService.signup(signUpDto)
    this.tokenUtils.setRefreshTokenCookie(res, refreshToken)
    return { message, accessToken }

  }
  @Post("/signin")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async signIn(@Body() signUpDto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, message } = await this.authService.signIn(signUpDto)
    this.tokenUtils.setRefreshTokenCookie(res, refreshToken)
    return { message, accessToken }
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


  @Post('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.tokenUtils.getRefreshTokenFromCookie(req)
    const { newRefreshToken, accessToken } = this.tokenUtils.refreshToken(refreshToken)
    this.tokenUtils.setRefreshTokenCookie(res, newRefreshToken)
    return accessToken
  }

}
