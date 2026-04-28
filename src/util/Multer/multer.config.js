import multer from "multer";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { ContentError } from "../Res/ResponseError.js";
import { generalUploadPath } from "../helpers/paths.js";

/**
 * @param {{ folderName:string, 
 * allowedFormats:import("../Enums/file.enums.js").MimeType[], 
 * fileSize: number, 
 * filesCount: number}} uploadOptions 
 * @returns 
 */
export function upload(uploadOptions)
{
    const { folderName, allowedFormats, fileSize = 5, filesCount = 1 } = uploadOptions;

    const storage = multer.diskStorage({
        destination(req, file, callback)
        {
            const fullPath = path.resolve(`uploads/${folderName}`);
            fs.mkdirSync(fullPath, { recursive: true });

            return callback(null, fullPath);
        },

        filename(req, file, callback)
        {
            const filename = randomUUID() + "_" + file.originalname.split(" ").join("-");
            file.finalPath = generalUploadPath(folderName, filename);

            return callback(null, filename);
        }
    });

    /**
     * 
     * @param {import("express").Request} req 
     * @param {Express.Multer.File} file 
     * @param {multer.FileFilterCallback} callback 
     */
    function fileFilter(req, file, callback)
    {
        if (!allowedFormats.includes(file.mimetype))
        {
            return callback(new ContentError({ message: "invalid file format", info: { "allowed file formats": allowedFormats } }), false);
        }

        return callback(null, true);
    }


    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: (fileSize * 1024 * 1024),
            files: filesCount
        }
    });
}
