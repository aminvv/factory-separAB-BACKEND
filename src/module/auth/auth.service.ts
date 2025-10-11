import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { AuthDto, OtpCodeDto, VerifyOtpCodeDto } from './dto/create-auth.dto';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './token.service';
import { JwtTokenPayload, PhoneTokenPayload } from './enums/payload';
import { AuthMessage } from 'src/common/enums/message.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private tokenService: TokenService
  ) { }


  async signup(signupDto: AuthDto) {
    const { mobile } = signupDto
    const userExist = await this.userRepository.findOne({ where: { mobile } })
    if (userExist) throw new ConflictException('کاربر با این شماره موبایل وجود دارد')

    const user = this.userRepository.create({ mobile })
    await this.userRepository.save(user)

    const accessToken = this.tokenService.generateAccessToken({ userId: user.id })
    const refreshToken = this.tokenService.generateRefreshToken({ userId: user.id })

    return { message: 'ثبت‌نام موفق', accessToken, refreshToken }
  }

  async signIn(signInDto: AuthDto) {
    const { mobile } = signInDto;
    const user = await this.userRepository.findOne({ where: { mobile } })
    if (!user) throw new UnauthorizedException('کاربر با این شماره ثبت نشده است')

    const accessToken = this.tokenService.generateAccessToken({ userId: user.id })
    const refreshToken = this.tokenService.generateRefreshToken({ userId: user.id })

    return { message: 'ورود موفق', accessToken, refreshToken }
  }


  async createOtpCode(otpCodeDto: OtpCodeDto) {
    const { mobile } = otpCodeDto
    const code = randomInt(10000, 99999).toString()
    const expiresIn = new Date(Date.now() + 2 * 60 * 1000)

    let otp = await this.otpRepository.findOne({ where: { mobile } })
    if (otp) {
      otp.code = code
      otp.expiresIn = expiresIn
    } else {
      otp = this.otpRepository.create({ mobile, code, expiresIn })
    }

    otp = await this.otpRepository.save(otp)


    const otpToken = this.tokenService.generateOtpToken({ mobile })
    return { otp, otpToken };
  }






  async verifyOtpCode(verifyOtpCodeDto: VerifyOtpCodeDto) {
    const { mobile, code, otpToken } = verifyOtpCodeDto;

    if (!otpToken) {
      throw new UnauthorizedException('توکن OTP موجود نیست یا منقضی شده است.');
    }
    const payload = this.tokenService.verifyToken<{ mobile: string }>(otpToken, 'otp');
    if (!payload || payload.mobile !== mobile) {
      throw new UnauthorizedException('توکن معتبر نیست یا منقضی شده');
    }

    const otp = await this.otpRepository.findOne({ where: { mobile } })
    if (!otp) {
      throw new UnauthorizedException('کدی برای این شماره ارسال نشده است.')
    }

    if (otp.code !== code) {
      throw new UnauthorizedException('کد واردشده نادرست است.')
    }

    const now = new Date();
    const expiresIn = new Date(otp.expiresIn)
    if (expiresIn.getTime() < now.getTime()) {
      await this.otpRepository.delete({ mobile })
      throw new UnauthorizedException('کد منقضی شده است.')
    }

    await this.otpRepository.delete({ mobile })

    const otpPayload: PhoneTokenPayload = { mobile }

    return {
      message: 'کد OTP تایید شد.',
    };
  }


  async checkMobileExists(mobile: string) {
    const user = await this.userRepository.findOne({ where: { mobile } })
    return { exists: !!user }
  }



  async validationAccessToken(accessToken:string) {
    const payload =this.tokenService.verifyToken<{userId:number}>(accessToken,'access')
    const user=await this.userRepository.findOneBy({id:payload?.userId})
    if(!user ){
      throw new UnauthorizedException(AuthMessage.loginAgain)
    }
    return user
  }
}
