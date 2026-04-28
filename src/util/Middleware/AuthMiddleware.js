import { UserModel } from "../../DB/Models/user.model.js";
import * as redisServices from "../../DB/redis.service.js";
import { AuthType, TokenType } from "../Enums/token.enums.js";
import { blockedTokenTitle } from "../helpers/blockedTokens.js";
import { ContentError, ForbiddenError, UnauthorizedError } from "../Res/ResponseError.js";
import { verifyToken } from "../Security/token.js";

export function authentication(tokenType = TokenType.access, authType = AuthType.bearer, { notRequired = false } = {})
{
    return async (req, res, next) =>
    {
        const { authorization } = req.headers;

        if (!authorization)
        {
            if (notRequired == true)
            {
                return next();
            }
            throw new ContentError({ message: "token is required", info: { authorization } });
        }

        const { payload } = verifyToken(authType, authorization, tokenType);

        // logout from single device (by blocking the token)
        if (await redisServices.exists(blockedTokenTitle(payload.id, payload.jti)))
        {
            throw new UnauthorizedError({ message: "You need to login" });
        }


        const user = await UserModel.findById(payload.id);
        if (!user)
        {
            throw new UnauthorizedError({ message: "user not found, signup first" });
        }

        // logout from all devices (by changing the changeCreditTime property)
        if (user.changeCreditTime.getTime() > (payload.iat * 1000))
        {
            throw new UnauthorizedError({ message: "You need to login" });
        }

        req.payload = payload;
        req.user = user;
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