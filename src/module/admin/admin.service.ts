import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { TokenService } from '../auth/token.service';
import { Repository } from 'typeorm';
import { Request, request } from 'express';
import { REQUEST } from '@nestjs/core';
import { UserEntity } from '../user/entities/user.entity';
import { Roles } from 'src/common/enums/roles.enum';
@Injectable({ scope: Scope.REQUEST })
export class AdminService {


  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private tokenService: TokenService,
  ) { }


  async createAdminBySuperAdmin(createAdminDto: CreateAdminDto) {
    const { email, fullName, password, avatar, } = createAdminDto
    const existsAdmin = await this.findAdminByEmail(email)
    if (existsAdmin) {
      throw new ConflictException('ادمینی با این ایمیل وجود دارد')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = this.adminRepository.create({
      email,
      password: hashedPassword,
      fullName,
      role: Roles.Admin,
      isActive: true,
      avatar
    })

    await this.adminRepository.save(admin)

    return {
      message: "حساب ادمین جدید ایجاد شد"
    }
  }






  async findAdminByEmail(email: string) {
    const admin = await this.adminRepository.findOneBy({ email })
    return admin
  }





  async getAllAdmins() {
    return this.adminRepository.find({
      order: { createdAt: 'DESC' }
    });
  }






 async updateAdmin(id: number, dto: Partial<CreateAdminDto>, currentAdminId: number) {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException('ادمین یافت نشد');
    }

    if (id === currentAdminId && dto.role && dto.role !== 'superAdmin') {
      throw new ForbiddenException('نمی‌توانید نقش خود را تغییر دهید');
    }

    if (dto.email && dto.email !== admin.email) {
      const exists = await this.adminRepository.findOneBy({ email: dto.email });
      if (exists) {
        throw new ConflictException('این ایمیل قبلاً استفاده شده است');
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(admin, dto);
    await this.adminRepository.save(admin);

    return {
      message: 'ادمین با موفقیت به‌روزرسانی شد',
    };
  }









  async promoteToAdmin(userId: number, dto: CreateAdminDto) {
    // بررسی وجود کاربر
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['admin']
    });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    // بررسی اینکه آیا کاربر قبلاً ادمین شده است
    if (user.admin) {
      throw new ConflictException('این کاربر قبلاً به عنوان ادمین ثبت شده است');
    }


    const existingAdmin = await this.adminRepository.findOne({
      where: { email: dto.email }
    });
    if (existingAdmin) {
      throw new ConflictException('این ایمیل قبلاً برای یک ادمین استفاده شده است');
    }


    const hashedPassword = await bcrypt.hash(dto.password, 10);


    const admin = this.adminRepository.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      avatar: dto.avatar,
      user: user,
    });

    await this.adminRepository.save(admin);

    // (اختیاری) بروزرسانی نقش کاربر
    user.role = Roles.Admin
    await this.userRepository.save(user);

    return {
      message: 'کاربر با موفقیت به ادمین ارتقا یافت'
    };
  }

  async demoteFromAdmin(userId: number) {
    // بررسی وجود کاربر
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['admin']
    });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    // بررسی اینکه کاربر ادمین است یا خیر
    if (!user.admin) {
      throw new BadRequestException('این کاربر ادمین نیست');
    }

    // حذف رکورد ادمین (نه کاربر اصلی)
    await this.adminRepository.remove(user.admin);

    // (اختیاری) تغییر نقش کاربر به عادی
    user.role = Roles.User;
    await this.userRepository.save(user);

    return {
      message: 'دسترسی ادمین از کاربر گرفته شد'
    };
  }




}
