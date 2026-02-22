import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminGuard } from '../auth/guards/adminGuard.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles as RoleEnum } from 'src/common/enums/roles.enum';
import { CanAccess } from 'src/common/decorators/role.decorator';


@ApiTags("Admin")
@ApiBearerAuth("Authorization")
@Controller('Admin')
export class AdminController {
  constructor(
    private readonly AdminService: AdminService,

  ) { }



  @Post("/create-admin-bySuperAdmin")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async signIn(@Body() createAdminDto: CreateAdminDto) {
    const message = await this.AdminService.createAdminBySuperAdmin(createAdminDto)
    return { message }
  }



  @Get('me')
  @UseGuards(AdminGuard)
  me(@Request() req) {
    return req.user;
  }




  @Get('')
  @UseGuards(AdminGuard)
  async getAllAdmins() {
    return this.AdminService.getAllAdmins();
  }







  @Post(':userId/promote')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async promoteToAdmin(@Param('userId', ParseIntPipe) userId: number, @Body() dto: CreateAdminDto) {
    return this.AdminService.promoteToAdmin(userId, dto);
  }




  @Patch(':id')
  @UseGuards(AdminGuard, RolesGuard)
  @CanAccess(RoleEnum.SuperAdmin)
  async updateAdmin(@Param('id', ParseIntPipe) id: number,@Body() dto: Partial<CreateAdminDto>,  @Request() req,) {
    const currentAdminId=req
    return this.AdminService.updateAdmin(id, dto, currentAdminId);
  }




  @Post(':userId/demote')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  async demoteFromAdmin(@Param('userId', ParseIntPipe) userId: number) {
    return this.AdminService.demoteFromAdmin(userId);
  }

}
  