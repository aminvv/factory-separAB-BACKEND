import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { CreateAdminDto, UpdateProfileDto, UpdateRoleDto } from './dto/create-admin.dto';
import { AdminGuard } from '../auth/guards/adminGuard.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles as RoleEnum, Roles } from 'src/common/enums/roles.enum';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { UpdateAdminDto } from './dto/update-admin.dto';


@ApiTags("Admin")
@ApiBearerAuth("Authorization")
@Controller('Admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,

  ) { }



  @Post("/create-admin-bySuperAdmin")
  @CanAccess(Roles.SuperAdmin)
  @UseGuards(AdminGuard, RolesGuard)
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async signIn(@Body() createAdminDto: CreateAdminDto) {
    return await this.adminService.createAdminBySuperAdmin(createAdminDto)
  }



  @Get('me')
  @UseGuards(AdminGuard)
  me(@Request() req) {
    return req.user;
  }

  @Get('')
  @UseGuards(AdminGuard)
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }







  @Post(':userId/promote')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async promoteToAdmin(@Param('userId', ParseIntPipe) userId: number, @Body() dto: CreateAdminDto) {
    return this.adminService.promoteToAdmin(userId, dto);
  }





  @Post(':userId/demote')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async demoteFromAdmin(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.demoteFromAdmin(userId);
  }











  // 1. تغییر نقش یک ادمین توسط سوپر ادمین
  @Patch('role/:id')
  @CanAccess(Roles.SuperAdmin)
  @UseGuards(AdminGuard, RolesGuard)
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.adminService.updateRole(+id, updateRoleDto.role);
  }

  // 2. ویرایش اطلاعات یک ادمین توسط سوپر ادمین
  @Patch(':id')
  @UseGuards(AdminGuard, RolesGuard)
  @CanAccess(Roles.SuperAdmin)
  async updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  // 3. حذف (soft delete) یک ادمین توسط سوپر ادمین
  @Delete(':id')
  @CanAccess(Roles.SuperAdmin)
  async deleteAdmin(@Param('id') id: string) {
    await this.adminService.softDelete(+id);
    return { message: 'ادمین با موفقیت حذف شد' };
  }

  // 4. ویرایش پروفایل شخصی توسط هر ادمین (شامل سوپر ادمین)
  @Patch('profile')
  @CanAccess(Roles.Admin) // ادمین معمولی و سوپر ادمین هر دو مجازند
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const admin = req.user || req.admin; // موجودیت احراز هویت شده
    return this.adminService.updateProfile(admin.id, updateProfileDto);
  }









}
