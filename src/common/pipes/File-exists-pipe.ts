import { PipeTransform, BadRequestException } from '@nestjs/common';

export class FileExistsPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided')
    }
    return file;
  }
}
