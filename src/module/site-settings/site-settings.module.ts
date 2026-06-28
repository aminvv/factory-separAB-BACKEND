import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsController } from './site-settings.controller';
import { SiteSettingsEntity } from './entities/site-setting.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { AdminEntity } from '../admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettingsEntity,AdminEntity]),AuthModule],
  controllers: [SiteSettingsController],
  providers: [SiteSettingsService],
  exports: [SiteSettingsService],
})
export class SiteSettingsModule {}