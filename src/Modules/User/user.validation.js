import joi from "joi";
import { FilesArrayValidationType, FileValidationType, ValidationType } from "../../util/Middleware/ValidationMiddleware.js";

// export const getUserProfileSchema = {
//     headers: joi.object({
//         authorization: ValidationType.authorization.required(),
//     })
// };

// export const renewTokenSchema = {
//     headers: joi.object({
//         authorization: ValidationType.authorization.required(),
//     })
// };


export const profilePicSchema = {
    file: FileValidationType.required()
};

export const coverPicSchema = {
    files: FilesArrayValidationType.required(),
};


export const shareProfileSchema = {
    params: joi.object({
        id: ValidationType.id.required()
    })
};

export const logoutSchema = {
    body: joi.object({
        fromAllDevices: ValidationType.fromAllDevices.required()
    }).required()
};