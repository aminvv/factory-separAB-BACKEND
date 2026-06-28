import { BaseEntityCustom } from "src/common/abstracts/EntityBasecustom";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntityName.SiteSettings)
export class SiteSettingsEntity extends BaseEntityCustom {

  // اطلاعات شرکت
  @Column({ nullable: true }) siteName: string;
  @Column({ nullable: true }) siteDescription: string;
  @Column({ nullable: true }) logo: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) address: string;

  // شبکه اجتماعی
  @Column({ nullable: true }) instagram: string;
  @Column({ nullable: true }) telegram: string;
  @Column({ nullable: true }) whatsapp: string;
  @Column({ nullable: true }) linkedin: string;

  // نماد اعتماد
  @Column({ nullable: true }) enamad: string;      // کد HTML نماد اعتماد
  @Column({ nullable: true }) samandehi: string;   // کد HTML ساماندهی

  // درگاه پرداخت
  @Column({ type: 'simple-array', nullable: true }) paymentGateways: string[];

  // لینک‌های فوتر
  @Column({ type: 'simple-json', nullable: true }) footerLinks: {
    title: string;
    links: { label: string; url: string }[];
  }[];

  // خبرنامه
  @Column({ default: true }) newsletterEnabled: boolean;
  @Column({ nullable: true }) newsletterText: string;
}