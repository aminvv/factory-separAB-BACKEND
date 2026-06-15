import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional,  IsNumber, IsBoolean, IsEnum, Min } from 'class-validator';
import { SaleType } from '../enums/SaleType.enum';



export class ProductDto {
  @ApiProperty()
  productCode: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  status: boolean;


  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ type: [Object] })
  @IsOptional()
  image?: { url: string; publicId: string }[];

  // فیلدهای جدید
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lifespan?: string;

  @ApiPropertyOptional()
  @IsOptional()

  weight?: string;

  @ApiPropertyOptional()
  @IsOptional()
  thickness?: string;

  @ApiPropertyOptional({ enum: SaleType })
  @IsOptional()
  @IsEnum(SaleType)
  saleType?: SaleType;

  @ApiPropertyOptional()
  @IsOptional()
  deliveryTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  deliveryCost?:string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  returnable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  insurance?: boolean;
}