import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional } from "class-validator"

export class CreateBlogDto {




    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    content: string

    @ApiPropertyOptional()
    slug:string


    @ApiProperty()
    category: string

    @ApiPropertyOptional({ type: [Object] })
    @IsOptional()
    image: { url: string; publicId: string }[];

}
