import { ApiProperty } from "@nestjs/swagger"

export class SignUpDto {
        @ApiProperty()
        firstName:string
    
        @ApiProperty()
        lastName:string
    
        @ApiProperty()
        mobile:string

}




export class SignInDto {
        @ApiProperty()
        mobile:string
    
        @ApiProperty()
        code:string
        
}
export class VerifyOtpCodeDto {
        @ApiProperty()
        mobile:string
    
        @ApiProperty()
        code:string
        
}



export class OtpCodeDto {
        @ApiProperty()
        mobile:string
    

        
}
