import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsPositive, IsDecimal, MaxLength, IsJSON, IsArray, } from 'class-validator';

export class ProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productCode: string

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    rollWeight?: number

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    thickness?: number

    @ApiProperty()
    @IsOptional()
    @IsString()
    dimensions?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    lifespan?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    bitumenType?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    warranty?: string

    @ApiProperty({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    image?: string[]

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    price: number

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    quantity?: number

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    discountPercent?: number

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    discountAmount?: number

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    productName?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    nationalProductCode?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    fiberBaseType?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    internationalCode?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    brandRegistrationNumber?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    coatingType?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    productBenefits?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    applicationType?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    isogumType?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    technicalSpecifications?: string
}


