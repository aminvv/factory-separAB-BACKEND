
import { UploadApiResponse } from "cloudinary";
import { getCloudinary } from "src/config/cloudinary.config"
import * as streamifier from 'streamifier';

export const uploadBufferToCloudinary = async (buffer: Buffer, folder: string ) : Promise<UploadApiResponse>=> {
    const cloud = getCloudinary()


    return new Promise((resolve, reject) => {
        const uploadStream = cloud.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result as UploadApiResponse);
            }
        )
        streamifier.createReadStream(buffer).pipe(uploadStream)
    })

}