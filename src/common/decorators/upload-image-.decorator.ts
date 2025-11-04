import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { uploadBufferToCloudinary } from 'src/common/utils/cloudinary.util';

export const UploadedImageParam = (folder: string) =>
  createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const file: Express.Multer.File = req.file;
    const files: Express.Multer.File[] = req.files;

    if (!file && (!files || files.length === 0)) {
      throw new BadRequestException('No file(s) provided');
    }


    if (files && files.length > 0) {
      const results = await Promise.all(
        files.map((f) => uploadBufferToCloudinary(f.buffer, folder))
      )
      return results.map((r) => r.secure_url)
    } else {

      const result = await uploadBufferToCloudinary(file.buffer, folder);
      return result.secure_url;
    }

  })();
