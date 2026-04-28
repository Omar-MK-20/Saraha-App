import jwt from "jsonwebtoken";
import { TOKEN_SIGNATURE_ADMIN_ACCESS, TOKEN_SIGNATURE_ADMIN_REFRESH, TOKEN_SIGNATURE_USER_ACCESS, TOKEN_SIGNATURE_USER_REFRESH } from "../../../config/app.config.js";
import { TokenType } from "../Enums/token.enums.js";
import { UserRole } from "../Enums/user.enums.js";
import { ContentError, UnauthorizedError } from "../Res/ResponseError.js";


/**
 * @param { {id: string, email: string, role: string}} userData
 * @param {string} tokenType
 * @param {string} uuid
 * @returns {string} 
 */
export function tokenGenerator(userData, tokenType, uuid)
{
    // const data = { id, email, role, tokenType };

    const { refreshSignature, accessSignature } = getSignature(userData.role);

    const signature = tokenType == TokenType.access ? accessSignature : refreshSignature;
    const expiresIn = tokenType == TokenType.access ? "10m" : "1y";

    const token = jwt.sign({ ...userData, tokenType }, signature, { expiresIn: expiresIn, jwtid: uuid });

    return token;
}


/**
 * 
 * @param {string} authorization The JsonWebToken string
 * @param {string} desiredTokenType The desired token type to check the validity of token upon it.
 * @returns {{
 * header: { alg: string, typ: string }, 
 * payload: {id: string, email: string, iat: string, exp: string}, 
 * signature: string} 
 * | null}
 */
export function verifyToken(desiredAuthType, authorization, desiredTokenType)
{
    try
    {
        const [authType, token] = authorization.split(" ");

        if (desiredAuthType != authType)
        {
            throw new UnauthorizedError({ message: "you are not authorized", info: { authorization } });
        }

        const decoded = jwt.decode(token);

        const { accessSignature, refreshSignature } = getSignature(decoded.role);

        const signature = desiredTokenType == TokenType.access ? accessSignature : refreshSignature;

        const data = jwt.verify(token, signature, { complete: true });
        return data;
    }
    catch (error)
    {
        if (error.name === "TokenExpiredError")
        {
            throw new UnauthorizedError({ message: "token expired", info: { error } });
        }
        if (error.name === "JsonWebTokenError")
        {
            throw new ContentError({ message: error.message, info: { error } });
        }

        throw error;
    }
}


// const token = tokenGenerator({ id: 1234, name: "omar", email: "omar@email.com" });
// console.log(token);

// const data = checkToken(token);
// console.log(data);



export function getSignature(userRole)
{
    let refreshSignature;
    let accessSignature;

    switch (userRole)
    {
        case UserRole.admin:
            accessSignature = Buffer.from(TOKEN_SIGNATURE_ADMIN_ACCESS, "hex");
            refreshSignature = Buffer.from(TOKEN_SIGNATURE_ADMIN_REFRESH, "hex");
            break;

        case UserRole.user:
            accessSignature = Buffer.from(TOKEN_SIGNATURE_USER_ACCESS, "hex");
            refreshSignature = Buffer.from(TOKEN_SIGNATURE_USER_REFRESH, "hex");
            break;

        default:
            break;
    }

    return { refreshSignature, accessSignature };
}