import { ResponseError } from "../Res/ResponseError.js";

export function errorMiddleware(err, req, res, next)
{
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