import {IsString,IsNumber,IsOptional,IsNotEmpty,IsPositive,IsDecimal,MaxLength,IsJSON,} from 'class-validator';

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    productCode: string

    @IsOptional()
    @IsNumber()
    rollWeight?: number

    @IsOptional()
    @IsNumber()
    thickness?: number

    @IsOptional()
    @IsString()
    dimensions?: string

    @IsOptional()
    @IsString()
    lifespan?: string

    @IsOptional()
    @IsString()
    bitumenType?: string

    @IsOptional()
    @IsString()
    warranty?: string

    @IsOptional()
    @IsString()
    image?: string

    @IsNumber()
    @IsPositive()
    price: number

    @IsOptional()
    @IsNumber()
    quantity?: number

    @IsOptional()
    @IsNumber()
    discountPercent?: number

    @IsOptional()
    @IsNumber()
    discountAmount?: number

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    productName?: string

    @IsOptional()
    @IsString()
    nationalProductCode?: string

    @IsOptional()
    @IsString()
    fiberBaseType?: string

    @IsOptional()
    @IsString()
    internationalCode?: string

    @IsOptional()
    @IsString()
    brandRegistrationNumber?: string

    @IsOptional()
    @IsString()
    coatingType?: string

    @IsOptional()
    @IsString()
    productBenefits?: string

    @IsOptional()
    @IsString()
    applicationType?: string

    @IsOptional()
    @IsString()
    isogumType?: string

    @IsOptional()
    @IsString()
    technicalSpecifications?: string
}


