import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
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

    @IsEnum(Roles)
    @IsNotEmpty()
    role: Roles;




}


export class UpdateRoleDto {
    @ApiProperty({ enum: Roles })
    @IsEnum(Roles)
    @IsNotEmpty()
    role: Roles;
}




export class UpdateProfileDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    password?: string;
}