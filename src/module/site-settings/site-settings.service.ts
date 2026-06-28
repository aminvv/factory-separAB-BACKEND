import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettingsEntity } from './entities/site-setting.entity';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSettingsEntity)private settingsRepository: Repository<SiteSettingsEntity>,
  ) {}

  async get() {
    const settings = await this.settingsRepository.findOne({ where: {} });
    if (!settings) {
      // اگه رکوردی نبود، یه رکورد پیش‌فرض بساز
      return this.settingsRepository.save(
        this.settingsRepository.create({
          siteName: 'فروشگاه',
          phone: '021-00000000',
          email: 'info@example.com',
          address: 'تهران، ایران',
          newsletterEnabled: true,
          newsletterText: 'برای دریافت آخرین اخبار و تخفیف‌ها ایمیل خود را وارد کنید',
          paymentGateways: ['zarinpal'],
          footerLinks: [
            {
              title: 'دسترسی سریع',
              links: [
                { label: 'صفحه اصلی', url: '/' },
                { label: 'محصولات', url: '/products' },
                { label: 'مقالات', url: '/articles' },
                { label: 'تماس با ما', url: '/contact' },
              ],
            },
            {
              title: 'خدمات مشتریان',
              links: [
                { label: 'راهنمای خرید', url: '/guide' },
                { label: 'شرایط بازگشت کالا', url: '/return-policy' },
                { label: 'حریم خصوصی', url: '/privacy' },
                { label: 'درباره ما', url: '/about' },
              ],
            },
          ],
        }),
      );
    }
    return settings;
  }

  async update(dto: Partial<SiteSettingsEntity>) {
    const settings = await this.get();
    Object.assign(settings, dto);
    return this.settingsRepository.save(settings);
  }
}