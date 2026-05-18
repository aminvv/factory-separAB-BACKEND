import { FileInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "../utils/multer.util";

  export function UploadImage(fieldname:string,foldername:string){
    return class UploadEntity extends FileInterceptor(fieldname,{
     storage:multerStorage(foldername)   
    }){}
  }