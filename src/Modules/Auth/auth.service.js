import { UserModel } from "../../DB/Models/user.model.js";
import { TokenType } from "../../util/Enums/token.enums.js";
import { UserProvider } from "../../util/Enums/user.enums.js";
import { ConflictError, UnauthorizedError } from "../../util/Res/ResponseError.js";
import { createSuccessObject, successObject } from "../../util/Res/ResponseObject.js";
import { encrypt } from "../../util/Security/encryption.js";
import { verifyGoogleAuth } from "../../util/Security/googleOAuth.js";
import { compareHashes, hashingPassword } from "../../util/Security/hashing.js";
import { tokenGenerator } from "../../util/Security/token.js";


export async function signup(bodyData)
{
    const { email } = bodyData;

    const existUser = await UserModel.findOne({ email });
    if (existUser)
    {
        throw new ConflictError({ message: "email already exist", info: { email } });
    }

    bodyData.password = await hashingPassword(bodyData.password);

    bodyData.phone = encrypt(bodyData.phone);

    const { password, ...result } = (await UserModel.create(bodyData)).toObject();

    return createSuccessObject("user", result);
}

export async function login(bodyData)
{
    const existUser = await UserModel.findOne({ email: bodyData.email }).select('+password');
    if (!existUser)
    {
        throw new UnauthorizedError({ message: "invalid email or password", info: { email: bodyData.email, password: bodyData.password } });
    }

    const isPasswordCorrect = await compareHashes(bodyData.password, existUser.password);
    if (!isPasswordCorrect)
    {
        throw new UnauthorizedError({ message: "invalid email or password", info: { email: bodyData.email, password: bodyData.password } });
    }

    let { password, ...user } = existUser.toObject();

    user.accessToken = tokenGenerator({ id: user.id, email: user.email, role: user.role }, TokenType.access);
    user.refreshToken = tokenGenerator({ id: user.id, email: user.email, role: user.role }, TokenType.refresh);

    return successObject(200, "login successful", user);
}

export async function signupWithGoogle(bodyData)
{
    const { idToken } = bodyData;

    const googleTokenPayload = await verifyGoogleAuth(idToken);

    if (!googleTokenPayload.email_verified)
    {
        throw new UnauthorizedError({ message: "email must be verified", info: { email: googleTokenPayload.email, isVerified: googleTokenPayload.email_verified } });
    }

    const existUser = await UserModel.findOne({ email: googleTokenPayload.email });

    if (existUser)
    {
        if (existUser.provider == UserProvider.system)
        {
            throw new ConflictError({ message: "account already exist, login with your email and password", info: { email: googleTokenPayload.email } });
        }
        return loginWithGoogle(bodyData);
    }

    const userObject = {
        email: googleTokenPayload.email,
        userName: googleTokenPayload.name,
        confirmEmail: googleTokenPayload.email_verified,
        profilePic: googleTokenPayload.picture,
        provider: UserProvider.google,
    };

    const newUser = new UserModel(userObject);
    console.log(newUser);

    await newUser.save();

    return loginWithGoogle(bodyData);

}

export async function loginWithGoogle(bodyData)
{
    const { idToken } = bodyData;

    const googleTokenPayload = await verifyGoogleAuth(idToken);

    if (!googleTokenPayload.email_verified)
    {
        throw new UnauthorizedError({ message: "email must be verified", info: { email: googleTokenPayload.email, isVerified: googleTokenPayload.email_verified } });
    }

    const existUser = await UserModel.findOne({ email: googleTokenPayload.email });

    if (existUser.provider == UserProvider.system)
    {
        throw new ConflictError({ message: "account already exist, login with your email and password", info: { email: googleTokenPayload.email } });
    }
    if (!existUser)
    {
        return signupWithGoogle(bodyData);
    }


    let { password, ...user } = existUser.toObject();

    user.accessToken = tokenGenerator({ id: user.id, email: user.email, role: user.role }, TokenType.access);
    user.refreshToken = tokenGenerator({ id: user.id, email: user.email, role: user.role }, TokenType.refresh);

    return successObject(200, "login successful", user);

}