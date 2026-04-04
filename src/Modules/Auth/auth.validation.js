import joi from "joi";
import { UserGender, UserRole } from "../../util/Enums/user.enums.js";
import { ValidationType } from "../../util/Middleware/ValidationMiddleware.js";

export const signupSchema = {
    body: joi.object({
        userName: ValidationType.userName.required(),
        email: ValidationType.email.required(),
        password: ValidationType.password.required(),
        confirmPassword: ValidationType.confirmPassword.required(),
        DOB: ValidationType.DOB().required(),
        gender: ValidationType.gender,
        phone: ValidationType.phone,
    }).required(),
};

export const loginSchema = {
    body: joi.object({
        email: ValidationType.email.required(),
        password: ValidationType.password.required()
    }).required()
};
