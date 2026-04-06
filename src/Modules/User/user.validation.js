import { FileValidationType } from "../../util/Middleware/ValidationMiddleware.js";

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
