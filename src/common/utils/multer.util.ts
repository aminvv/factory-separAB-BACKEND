import { Request } from "express";
import { mkdirSync } from "fs";
import { diskStorage } from "Multer";
import { extname, join } from "path";






export type callbackFileName = (error: Error | null, destination: string ) => void;
export type callbackDestination = (error: Error | null, destination: string) => void;
export type multerFile = Express.Multer.File;


export function multerDestination(fieldname: string) {
    return function (req: Request, file: multerFile, callback: callbackDestination): void {
        let path = join("public", "uploads", fieldname)
        mkdirSync(path, { recursive: true })
        callback(null, path)
    }
}



export function multerFilename(req: Request, file: multerFile, callback: callbackFileName) {
    const ext = extname(file.originalname)
    if (!isValidImageFormat(ext)) {
        callback(new Error("فرمت عکس نادرست است"),'')
    } else {
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
        callback(null, filename)
    }
}




function isValidImageFormat(ext: string) {
    return [".jpeg", ".png", ".jpg"].includes(ext)
}





export function multerStorage(foldername: string) {
    return diskStorage({
        destination: multerDestination(foldername),
        filename: multerFilename
    })
}