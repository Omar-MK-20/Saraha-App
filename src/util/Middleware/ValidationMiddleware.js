import joi from "joi";
import { UserGender } from "../Enums/user.enums.js";
import { ContentError } from "../Res/ResponseError.js";

/**
 * @param {{body?: import("joi").ObjectSchema}} schema 
 */
export function validation(schema)
{
    return (req, res, next) =>
    {
        const validationErrors = [];
        req.valid = {};

        for (const schemaKey in schema)
        {
            const validationResult = schema[schemaKey].validate(req[schemaKey], { abortEarly: false });

            if (validationResult.error?.details.length > 0)
            {
                validationErrors.push(validationResult.error);
            }

            req.valid[schemaKey] = validationResult.value;
        }

        if (validationErrors.length > 0)
        {
            throw new ContentError({ message: "validation error", info: validationErrors });
        }


        next();
    };
}


const usernameRegExp = /^([A-Z]{1}[a-z]{1,24}|[A-Z]{1}[a-z]{1}(-|\s)[A-Z]{1}[a-z]{1,21})\s([A-Z]{1}[a-z]{1,24}|[A-Z]{1}[a-z]{1}(-|\s)[A-Z]{1}[a-z]{1,21})$/;
const phoneRegExp = /^01[0125][0-9]{8}$/;
const passwordRegExp = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;


export const ValidationType = {
    userName: joi.string().min(3).max(50).pattern(usernameRegExp).messages({
        "any.required": "username is required",
        "string.pattern.base": "Username must contain two words, each starting with a capital letter, and may include a space or hyphen (e.g., 'Omar Ahmed' or 'Omar El-Sayed')"
    }),
    email: joi.string().email().trim().messages({
        "any.required": "email is required"
    }),
    password: joi.string().pattern(passwordRegExp).messages({
        "any.required": "password is required",
        "string.pattern.base": "Password must be 8-16 chars contains uppercase letter, lowercase letter, number, and symbol"
    }),
    confirmPassword: joi.string().valid(joi.ref("password")).messages({
        "any.required": "confirmPassword is required",
        "any.only": "Confirm password doesn't match password"
    }),
    DOB()
    {
        const currentDate = new Date();
        const eighteenYearsAgo = new Date(currentDate.setFullYear(currentDate.getFullYear() - 18)).toLocaleDateString();

        return joi.date().max(eighteenYearsAgo).messages({
            "date.max": "you must be older than 18",
            "any.required": "date of birth is required"
        });
    },
    gender: joi.string().valid(...Object.values(UserGender)).default(UserGender.male).messages({
        "any.required": "gender is required"
    }),
    phone: joi.string().pattern(phoneRegExp).messages({
        "any.required": "phone is required",
        "string.pattern.base": "Phone number must be a valid Egyptian mobile number"
    }),
    authorization: joi.string(),
};



export const FileValidationType = joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    finalPath: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().required(),
}).messages({ "any.required": "uploading media is required" })

