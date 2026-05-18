import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

  export class ImageDto{
    @ApiPropertyOptional()
    alt:string
    @ApiProperty({format:"binary"})
    image:string
    @ApiProperty()
    name:string

  }