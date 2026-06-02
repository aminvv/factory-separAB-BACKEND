import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator"

export class CreateProductCommentDto {

    @ApiProperty()
    @IsNotEmpty()
    text: string

    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @Type(() => Number)
    parentId?: number

    @ApiProperty()
    @IsNumberString()
    productId: number

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()          // <-- به جای IsNumberString
  @Type(() => Number)
  rating?: number;        
}