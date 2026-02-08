import { ApiProperty } from "@nestjs/swagger"

export class BasketDto {
        @ApiProperty()
        productId:number


        @ApiProperty({default:1})
        quantity:number
        

}


