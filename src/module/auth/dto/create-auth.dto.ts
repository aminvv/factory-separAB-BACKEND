import { ApiProperty } from "@nestjs/swagger"

export class SignUpDto {
        @ApiProperty()
        firstName:string
    
        @ApiProperty()
        lastName:string
    
        @ApiProperty()
        username:string
    
        @ApiProperty()
        email:string
    
        @ApiProperty()
        password:string
}




export class SignInDto {
        @ApiProperty()
        username:string
    
        @ApiProperty()
        password:string
        
}
