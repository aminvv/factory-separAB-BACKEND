import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class AddDetailDto {
    @ApiProperty()
    productId:number
    @ApiPropertyOptional()
    key:string
    @ApiPropertyOptional()
    value:string

}


export class UpdateAddDetailDto extends PartialType(AddDetailDto){}