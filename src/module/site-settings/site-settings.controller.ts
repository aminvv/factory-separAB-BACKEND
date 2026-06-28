import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { AdminGuard } from '../auth/guards/adminGuard.guard';
import { swaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@ApiTags('SiteSettings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  get() {
    return this.siteSettingsService.get();
  }

  @Patch()
  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @ApiConsumes(swaggerConsumes.Json)
  update(@Body() dto: any) {
    return this.siteSettingsService.update(dto);
  }
}