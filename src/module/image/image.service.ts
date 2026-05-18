import { Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageEntity } from "./entities/image.entity";
import { Repository } from "typeorm";
import { ImageDto } from "./dto/image.dto";
import { multerFile } from "src/common/utils/multer.util";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { AuthMessage, NotFoundMessage, publicMessage } from "src/common/enums/message.enum";
import { AdminEntity } from "../admin/entities/admin.entity";
import * as fs from 'fs';
import * as path from 'path';


@Injectable({ scope: Scope.REQUEST })
export class ImageService {

    constructor(
        @InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity>,
        @InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>,
        @Inject(REQUEST) private request: Request
    ) { }




    private deleteFileFromDisk(location: string) {
        try {
            if (!location) {
                console.log('آدرس فایل وجود ندارد');
                return false;
            }

            // تبدیل بک‌اسلش به اسلش معمولی
            let cleanPath = location.replace(/\\/g, '/');

            // اضافه کردن public به مسیر
            const fullPath = path.join(process.cwd(), 'public', cleanPath);

            console.log('مسیر کامل فایل برای حذف:', fullPath);

            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                console.log('فایل با موفقیت حذف شد:', fullPath);
                return true;
            } else {
                console.log('فایل وجود ندارد:', fullPath);
                return false;
            }
        } catch (error) {
            console.error('خطا در حذف فایل:', error.message);
            return false;
        }
    }


    async create(imageDto: ImageDto, imageProfile: multerFile) {
        const adminId = this.request.admin?.id
        if (!adminId) {
            throw new UnauthorizedException('ادمین یافت نشد');
        }


        const oldImage = await this.imageRepository.findOne({
            where: { adminId }
        });

        if (oldImage) {
            this.deleteFileFromDisk(oldImage.location);
            await this.imageRepository.remove(oldImage);
        }

        const { alt, name } = imageDto
        let location = imageProfile.path.slice(7).replace(/\\/g, '/');
        await this.imageRepository.insert({
            alt: alt || name,
            name,
            location,
            adminId
        })
        const avatarUrl = location
        await this.adminRepository.update(adminId, { avatar: avatarUrl });

        return {
            message: publicMessage.created
        }
    }



    async find() {
        const adminId = this.request.admin?.id
        return this.imageRepository.find({
            where: { adminId },
            order: { id: "DESC" }
        })
    }





    async findOne(id: number) {
        const adminId = this.request.admin?.id
        const image = this.imageRepository.findOne({
            where: { adminId, id },
            order: { id: "DESC" }
        })


        if (!image) {
            throw new NotFoundException(NotFoundMessage.NotFoundCategory)
        }
        return image
    }


    async updateAdminProfile(imageId: number, imageProfile: multerFile, imageDto: ImageDto) {
        const admin = this.request.admin;
        if (!admin) {
            throw new UnauthorizedException('ادمین یافت نشد');
        }


        // پیدا کردن عکس قبلی ادمین
        const oldImage = await this.imageRepository.findOne({
            where: { adminId: admin.id }
        });

        // حذف فایل قبلی از دیسک (اگر وجود داشت)
        if (oldImage) {
            this.deleteFileFromDisk(oldImage.location);
            await this.imageRepository.remove(oldImage);
        }



        const newImage = await this.imageRepository.findOne({
            where: { adminId: admin.id }
        });

        if (newImage) {
            await this.imageRepository.remove(newImage);
        }

        const { alt, name } = imageDto;
        let location = imageProfile.path.slice(7).replace(/\\/g, '/');

        await this.imageRepository.update(imageId, {
            alt: alt || name,
            name,
            location,
            adminId: admin.id
        });
        const avatarUrl = location
        await this.adminRepository.update(admin.id, { avatar: avatarUrl });

        return {
            message: 'پروفایل با موفقیت به‌روزرسانی شد'
        };
    }



    async remove(id: number) {
        const image = await this.findOne(id)
        if (!image) {
            throw new NotFoundException(NotFoundMessage.NotFoundCategory)
        }
        await this.imageRepository.remove(image)
        return {
            message: publicMessage.Delete
        }
    }







}