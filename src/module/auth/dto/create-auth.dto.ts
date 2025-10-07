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
        
}



export class OtpCodeDto {
        @ApiProperty()
        mobile:string
    

        
}
