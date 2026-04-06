import multer from "multer";
import { ResponseError } from "../Res/ResponseError.js";

export function errorMiddleware(err, req, res, next)
{
    if (err instanceof multer.MulterError)
    {
        // if (err.code == "LIMIT_FILE_SIZE")
        // {
        //     return res.status(422).json({ error: "allowed files size exceeded", statusCode: 422, info: err });
        // }
        // if (err.code == "LIMIT_FILE_COUNT")
        // {
        //     return res.status(422).json({ error: "files were uploaded than the maximum allowed", statusCode: 422, info: err });
        // }
        // if (err.code == "LIMIT_UNEXPECTED_FILE")
        // {
        //     return res.status(422).json({ error: "allowed files count exceeded", statusCode: 422, info: err });
        // }
        return res.status(422).json({ error: err.message, statusCode: 422, info: err });
    }

    if (err instanceof ResponseError)
    {
        return res.status(err.statusCode).json({ error: err.message, statusCode: err.statusCode, info: err.info });
    }

    if (err.message.includes("required"))
    {
        return res.status(422).json(err);
    }

    res.status(500).json({ error: 'Server Error', message: err.message, stack: err.stack, name: err.name, err });
}