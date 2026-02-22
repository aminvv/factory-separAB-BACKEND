import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Roles } from "src/common/enums/roles.enum";

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
    role: Roles;




}