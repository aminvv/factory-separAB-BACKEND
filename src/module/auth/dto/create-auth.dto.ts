import { ApiProperty } from "@nestjs/swagger"

export class AuthDto {
        @ApiProperty()
        mobile:string

}




export class VerifyOtpCodeDto {
        @ApiProperty()
        mobile:string
    
        @ApiProperty()
        code:string
        
        @ApiProperty()
        otpToken:string
        
}



export class OtpCodeDto {
        @ApiProperty()
        mobile:string
    

        
}
