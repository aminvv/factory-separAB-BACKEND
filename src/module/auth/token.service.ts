import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload, PhoneTokenPayload } from './enums/payload';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  // ===== Access Token =====
  generateAccessToken(payload: JwtTokenPayload, expiresIn = '15m'): string {
    const secret = process.env.JWT_SECRET || 'default_access_secret';
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  // ===== Refresh Token =====
  generateRefreshToken(payload: JwtTokenPayload, expiresIn = '7d'): string {
    const secret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  // ===== OTP / Phone Token =====
  generateOtpToken(payload: PhoneTokenPayload, expiresIn = '2m'): string {
    const secret = process.env.OTP_TOKEN_SECRET || 'default_otp_secret';
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  // ===== Verify Tokens =====
 verifyToken<T extends JwtTokenPayload | PhoneTokenPayload>(
  token: string,
  type: 'access' | 'refresh' | 'otp'
): T {
  let secret: string;

  switch (type) {
    case 'access':
      secret = process.env.JWT_SECRET || 'default_access_secret'
      break;
    case 'refresh':
      secret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret'
      break;
    case 'otp':
      secret = process.env.OTP_TOKEN_SECRET || 'default_otp_secret'
      break;
    default:
      throw new Error('Invalid token type')
  }

  return this.jwtService.verify<T>(token, { secret });
}

}
