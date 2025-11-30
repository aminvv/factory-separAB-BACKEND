import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumberString, IsOptional } from "class-validator"

export class CreateBlogCommentDto {

    @ApiProperty()
    @IsNotEmpty()
    text: string



    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @Type(() => Number)
    parentId?: number;



    @ApiProperty()
    @IsNumberString()
    blogId: number


}
