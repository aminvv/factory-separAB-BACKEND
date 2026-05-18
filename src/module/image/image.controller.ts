import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ImageService } from "./image.service";
import { ImageDto } from "./dto/image.dto";
import { UploadImage } from "src/common/interceptor/upload-image.interceptor";
import { multerFile } from "src/common/utils/multer.util";
import { swaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { AdminGuard } from "../auth/guards/adminGuard.guard";


@ApiTags("image")
@Controller("image")
@ApiBearerAuth("Authorization")
export class ImageController {



    constructor(
        private readonly imageService: ImageService
    ) { }

    @Post("/create-image")
    @UseGuards(AdminGuard)
    @ApiConsumes(swaggerConsumes.MultiPartData)
    @UseInterceptors(UploadImage("image", "profile"))
    create(@Body() imageDto: ImageDto, @UploadedFile() imageProfile: multerFile) {
        return this.imageService.create(imageDto, imageProfile)
    }
    @Get("/find-image")
    find() {
        return this.imageService.find()
    }
    @Get("/findOne-image")
    findOne(id: number) {
        return this.imageService.findOne(id)

    }


    @Put("/update-image/:id")
    @UseGuards(AdminGuard)
    @ApiConsumes(swaggerConsumes.MultiPartData)
    @UseInterceptors(UploadImage("image", "profile"))
    async update(@Param('id', ParseIntPipe) id: number,@Body() imageDto: ImageDto,@UploadedFile() imageProfile: multerFile
    ) {
        return this.imageService.updateAdminProfile(id, imageProfile,imageDto);
    }


    @Delete("/delete-image")
    remove(id: number) {
        return this.imageService.remove(id)

    }

}


