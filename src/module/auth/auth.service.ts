import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { OtpCodeDto, SignUpDto, VerifyOtpCodeDto } from './dto/create-auth.dto';
import { UserEntity } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomInt, sign } from 'crypto';
import { OtpEntity } from '../user/entities/otp.entity';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>
  ) { }

  async signup(signupDto: SignUpDto) {
    const { firstName, lastName, mobile } = signupDto

    const userExist = await this.userRepository.findOneBy({ mobile })
    if (userExist) {
      throw new ConflictException('کاربر با این شماره موبایل وجود دارد')
    }

    
    const user = await this.userRepository.create({
      firstName,
      lastName,
      mobile,
      
      
    })
    
    await this.userRepository.save(user)
    return {
      message: "signup successfully"
    }
  }





async createOtpCode(otpCodeDto: OtpCodeDto) {
  const{mobile}=otpCodeDto
  const code = randomInt(10000, 99999).toString()
  const expiresIn = new Date(Date.now() + 1000 * 60 * 2)

  const user = await this.userRepository.findOne({ where: { mobile}  })

  let otp = await this.otpRepository.findOne({ where: { mobile } })

  if (otp) {
    otp.code = code,
    otp.expiresIn = expiresIn
  
  } else {
    otp = this.otpRepository.create({
      mobile,
      code,
      expiresIn,
  
    });
  }

  otp = await this.otpRepository.save(otp);
  return otp;
}






async verifyOtpCode(verifyOtpCodeDto: VerifyOtpCodeDto) {
  const { mobile, code } = verifyOtpCodeDto


  const otp = await this.otpRepository.findOne({ where: { mobile } })

  if (!otp) {
    throw new UnauthorizedException('کدی برای این شماره ارسال نشده است.')
  }


  if (otp.code !== code) {
    throw new UnauthorizedException('کد واردشده نادرست است.')
  }

  const now = new Date()
  const expiresIn = new Date(otp.expiresIn)

  if (expiresIn.getTime() < now.getTime()) {
    throw new UnauthorizedException('کد منقضی شده است.')
  }

  await this.otpRepository.delete({ mobile })

  return {
    message: 'شماره موبایل تأیید شد.',
  };
}



async checkMobileExists(mobile: string) {
  const user = await this.userRepository.findOne({ where: { mobile } });
  return { exists: !!user };
}



} 
