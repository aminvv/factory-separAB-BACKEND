import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class ProductDto {
  @ApiProperty({ description: 'کد محصول', example: 'PRD001' })
  productCode: string;

  @ApiProperty({ description: 'نام محصول', example: 'ایزوگام پشم شیشه' })
  productName: string;

  @ApiProperty({ description: 'قیمت محصول', example: 120000 })
  price: number;

  @ApiProperty({ description: 'تعداد محصول در انبار', example: 50 })
  quantity: number;

  @ApiPropertyOptional({ description: 'درصد تخفیف', example: 10 })
  discountPercent?: number;

  @ApiPropertyOptional({ description: 'مبلغ تخفیف', example: 10000 })
  discountAmount?: number;

  @ApiProperty({ type: [String], format: 'binary' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image?: string[];

}
