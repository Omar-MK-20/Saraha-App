import { UserModel } from "../../DB/Models/user.model.js";
import { AuthType, TokenType } from "../Enums/token.enums.js";
import { UserRole } from "../Enums/user.enums.js";
import { ContentError, ForbiddenError, UnauthorizedError } from "../Res/ResponseError.js";
import { verifyToken } from "../Security/token.js";


export function authentication(tokenType = TokenType.access, authType = AuthType.bearer)
{
    return async (req, res, next) =>
    {
        const { authorization } = req.headers;

        if (!authorization)
        {
            throw new ContentError({ message: "token is required", info: { authorization } });
        }

        const { payload } = verifyToken(authType, authorization, tokenType);

        const result = await UserModel.findById(payload.id);
        if (!result)
        {
            throw new UnauthorizedError({ message: "user not found, signup first" });
        }

        req.user = result;
        next();
    };
}


/**
 * @param  {...string} roles 
 * @returns 
 */
export function authorization(...roles)
{
    return (req, res, next) =>
    {
        if (!roles.includes(req.user.role))
        {
            throw new ForbiddenError({ message: "you don't have access to this API", info: { role: req.user.role } });
        }

        next();
    };
}