import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto, UpdateProfileDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { TokenService } from '../auth/token.service';
import { Repository } from 'typeorm';
import { Request, request } from 'express';
import { REQUEST } from '@nestjs/core';
import { UserEntity } from '../user/entities/user.entity';
import { Roles } from 'src/common/enums/roles.enum';
import { UpdateAdminDto } from './dto/update-admin.dto';
@Injectable({ scope: Scope.REQUEST })
export class AdminService {


  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) { }







async createAdminBySuperAdmin(createAdminDto: CreateAdminDto) {
  const { email, fullName, password, avatar, role } = createAdminDto;

  // 1. جستجوی ادمین با این ایمیل (شامل رکوردهای حذف‌شده)
  const existingAdmin = await this.adminRepository.findOne({
    where: { email },
    withDeleted: true
  });

  if (existingAdmin) {
    // 2. اگر ادمین قبلاً حذف نرم شده است
    if (existingAdmin.deleted_at) {
      // به‌روزرسانی تمام فیلدها
      existingAdmin.fullName = fullName;
      existingAdmin.role = role;
      
      if (avatar !== undefined) {
        existingAdmin.avatar = avatar;
      }
      
      existingAdmin.password = await bcrypt.hash(password, 10);

      (existingAdmin as any).deleted_at = null;
      
      await this.adminRepository.save(existingAdmin);

      return {
        message: 'ادمین قبلی با موفقیت بازیابی و به‌روزرسانی شد'
      };
    } else {
      throw new ConflictException('ادمینی با این ایمیل وجود دارد');
    }
  }

  // 4. اگر ایمیلی وجود ندارد، ادمین جدید بساز
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = this.adminRepository.create({
    email,
    password: hashedPassword,
    fullName,
    role: role || Roles.Admin,
    isActive: true,
    avatar
  });

  await this.adminRepository.save(admin);

  return {
    message: 'حساب ادمین جدید ایجاد شد'
  };
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


    const existsAdmin = await this.adminRepository.findOne({
      where: { email: dto.email }
    });
    if (existsAdmin) {
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




  async findOneById(id: number): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('ادمین یافت نشد');
    return admin;
  }






  async updateRole(id: number, newRole: Roles): Promise<AdminEntity> {
    const AuthAdmin = this.request.admin?.id;

    const admin = await this.findOneById(id);
    if (admin.id === AuthAdmin) {
      throw new ForbiddenException('نمی‌توانید نقش خود را تغییر دهید');
    }
    admin.role = newRole;
    return this.adminRepository.save(admin);
  }



  async update(id: number, updateDto: UpdateAdminDto): Promise<AdminEntity> {
    const admin = await this.findOneById(id);

    const currentAdmin = this.request.admin;
    if (admin.id === currentAdmin?.id && updateDto.role && updateDto.role !== admin.role) {
      throw new ForbiddenException('نمی‌توانید نقش خود را تغییر دهید');
    }
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }
    Object.assign(admin, updateDto);
    return this.adminRepository.save(admin);
  }







  async softDelete(id: number): Promise<void> {
    const AuthAdmin = this.request.admin?.id
    const admin = await this.findOneById(id);
    if (admin.id === AuthAdmin) {
      throw new ForbiddenException('نمی‌توانید خودتان را حذف کنید');
    }
    await this.adminRepository.softRemove(admin);
  }







  async updateProfile(adminId: number, updateDto: UpdateProfileDto): Promise<AdminEntity> {
    const admin = await this.findOneById(adminId);
    if (updateDto.password) {
      // در صورت نیاز می‌توانید رمز فعلی را نیز بررسی کنید
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }
    Object.assign(admin, updateDto);
    return this.adminRepository.save(admin);
  }
}




