import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class ProductDto {
  0
  @ApiProperty()
  productCode: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  status: boolean;

  @ApiPropertyOptional()
  discountPercent?: number;

  @ApiPropertyOptional()
  discountAmount?: number;

  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  image?: string[];

}



 