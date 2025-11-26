import { Injectable } from '@nestjs/common';
import { getCloudinary } from 'src/config/cloudinary.config';

@Injectable()
export class CloudinaryService {
  private cloud: any;

  constructor() {
    this.cloud = getCloudinary();
  }

  async deleteImageUploaded(publicId: string): Promise<{ result: string }> {
    return new Promise((resolve, reject) => {
      this.cloud.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}





