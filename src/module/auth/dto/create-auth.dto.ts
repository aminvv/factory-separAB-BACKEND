import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AuthDto {
    @ApiProperty()
    @IsMobilePhone('fa-IR')
    @IsNotEmpty()
    mobile: string
}

export class VerifyOtpCodeDto {
    @ApiProperty()
    @IsMobilePhone('fa-IR')
    @IsNotEmpty()
    mobile: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    otpToken: string
}

export class OtpCodeDto {
    @ApiProperty()
    @IsMobilePhone('fa-IR')
    @IsNotEmpty()
    mobile: string
}




export class AuthAdminDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    password: string
}




export class CreateAdminDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    @IsOptional()
    fullName: string

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsString()
    @IsOptional()
    role?: 'admin' | 'super-admin'


}