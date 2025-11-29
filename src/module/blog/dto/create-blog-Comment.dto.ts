import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateBlogCommentDto {

    @ApiProperty()
    text: string


}
