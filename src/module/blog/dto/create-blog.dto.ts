import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional } from "class-validator"

export class CreateBlogDto {




    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    content: string

    @ApiProperty()
    status: string

    @ApiPropertyOptional()
    slug:string


    @ApiProperty()
    category: string

    @ApiPropertyOptional({ type: [Object] })
    @IsOptional()
    thumbnail: { url: string; publicId: string }[];

}
