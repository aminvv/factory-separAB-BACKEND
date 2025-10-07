import { UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenService } from "../token.service";

export class TokenUtils {


  constructor(private readonly tokenService: TokenService) { }



  getRefreshTokenFromCookie(req: Request) {
    const token = req.cookies?.['refreshToken']
    if (!token) throw new UnauthorizedException('Refresh token missing');
    return token;
  }




  setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  }





  refreshToken( refreshToken:string) {
    const payload=this.tokenService.verifyToken<{userId:number}>(refreshToken,"refresh")
    if (!payload) throw new UnauthorizedException('Invalid or expired refresh token');
     const accessToken=this.tokenService.generateAccessToken({userId:payload.userId})
     const newRefreshToken=this.tokenService.generateRefreshToken({userId:payload.userId})
      return {
        accessToken,
        newRefreshToken
      }
  }
}