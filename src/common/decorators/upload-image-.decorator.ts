import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { uploadBufferToCloudinary } from 'src/common/utils/cloudinary.util'; 

export const UploadedImageParam = (folder: string) =>
  createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const file: Express.Multer.File = req.file;

    if (!file) throw new BadRequestException('No file provided');

    const result = await uploadBufferToCloudinary(file.buffer, folder);
    return result.secure_url;
  })();
