import multer from "multer";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";


export function upload({ folderName })
{
    const storage = multer.diskStorage({
        destination(req, file, callback)
        {
            const fullPath = path.resolve(`uploads/${folderName}`);
            fs.mkdirSync(fullPath, { recursive: true });

            callback(null, fullPath);
        },

        filename(req, file, callback)
        {
            const filename = randomUUID() + "" + file.originalname;
            file.finalPath = `uploads/${folderName}/${filename}`;

            callback(null, filename);
        }
    });


    return multer({ storage: storage, });
}
