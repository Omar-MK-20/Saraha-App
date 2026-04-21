import fs from "node:fs/promises";
import path from "node:path";
import { UserModel } from "../../DB/Models/user.model.js";
import { TokenType } from "../../util/Enums/token.enums.js";
import { NotFoundError, ResponseError } from "../../util/Res/ResponseError.js";
import { deleteSuccessObject, getSuccessObject, successObject, updateSuccessObject } from "../../util/Res/ResponseObject.js";
import { tokenGenerator } from "../../util/Security/token.js";
import { moveFile } from "../../util/helpers/moveFile.js";
import { galleryUploadPath } from "../../util/helpers/paths.js";
import { removeFile } from "../../util/helpers/removeFile.js";
import { UserRole } from "../../util/Enums/user.enums.js";

// export async function getSingleUser(headers)
// {
//     const { authorization } = headers;

//     if (!authorization)
//     {
//         throw new ContentError({ message: "token is required", info: { authorization } });
//     }

//     const { payload } = verifyToken(AuthType.bearer, authorization, TokenType.access);

//     const result = await UserModel.findById(payload.id);
//     if (!result)
//     {
//         throw new UnauthorizedError({ message: "user not found, signup first" });
//     }

//     return getSuccessObject(result);
// }


export async function renewToken(userData)
{

    const accessToken = tokenGenerator(
        {
            id: userData.id,
            email: userData.email,
            role: userData.role
        }, TokenType.access);

    return getSuccessObject({ ...userData.toObject(), accessToken });
}

export async function uploadProfilePic(pictureData, userData)
{

    if (userData.profilePic)
    {
        const newUploadPath = await moveToGallery(pictureData, userData);

        userData.galleries.push(newUploadPath);
        await userData.save();
    }

    const result = await UserModel.updateOne({ _id: userData.id }, { profilePic: pictureData.finalPath });

    return updateSuccessObject("profile picture", { result, pictureData });
}

async function moveToGallery(pictureData, userData)
{
    try
    {
        const oldPicPath = path.resolve(`./${userData.profilePic}`);
        const picName = path.basename(oldPicPath);

        const galleryPath = path.resolve("." + galleryUploadPath());
        const newPicPath = path.resolve(galleryPath, picName);

        await fs.mkdir(galleryPath, { recursive: true });
        await moveFile(oldPicPath, newPicPath);

        return galleryUploadPath(picName);
    }
    catch (error)
    {
        console.log(error);
        fs.unlink(pictureData.path);
        throw new ResponseError("Error moving old Profile Picture to gallery", 500, { error });
    }

}

export async function uploadCoverPic(pictureData, userData)
{
    const coverPicsPaths = pictureData.map(file => file.finalPath);

    if (userData.coverPics.length > 0)
    {
        for (const pic of userData.coverPics)
        {
            const picPath = path.resolve(`.${pic}`);
            await fs.unlink(picPath);
        }
    }

    const result = await UserModel.updateOne({ _id: userData.id }, { coverPics: coverPicsPaths });

    return successObject(201, "profile uploaded successfully", { result, pictureData });
}

export async function getSharedProfile(req)
{
    const profileId = req.params.id;

    const existUser = await UserModel.findById(profileId).select("-role -confirmEmail -createdAt -updatedAt -__v -provider -galleries");

    if (!existUser)
    {
        throw new NotFoundError({ message: "user not found", info: { id: profileId } });
    }

    if (req.session.firstTry == undefined) req.session.firstTry = true;

    if (req.session.firstTry)
    {
        if (existUser.views == undefined)
        {
            existUser.views = 0;
        }
        existUser.views++;
        await existUser.save();

        req.session.firstTry = false;
    }

    if (req.user?.role == UserRole.admin)
    {
        return getSuccessObject(existUser);
    }

    const { views, ...restData } = existUser.toObject();
    return getSuccessObject(restData);
}

export async function removeProfileImage(userData)
{
    if (!userData.profilePic)
    {
        throw new NotFoundError({ message: "Profile Picture not found", info: { ProfilePic: userData.profilePic } });
    }
    await removeFile(userData.profilePic);
    userData.profilePic = null;
    await userData.save();
    return deleteSuccessObject("Profile Picture");
}


// export async function createUser(bodyData)
// {
//     const { email } = bodyData;

//     const existUser = await UserModel.findOne({ email: email });

//     if (existUser)
//     {
//         throw new ResponseError("email already exist", 409, { email });
//     }

//     bodyData.password = await hashingPassword(bodyData.password);

//     bodyData.phone = encrypt(bodyData.phone);

//     const { password, ...result } = (await UserModel.create(bodyData)).toObject();

//     return { message: "user created successfully", result };
// }


// export async function login(bodyData)
// {
//     const existUser = await UserModel.findOne({ email: bodyData.email }).select('+password');
//     if (!existUser)
//     {
//         throw new ResponseError("invalid email or password", 401, { email: bodyData.email, password: bodyData.password });
//     }

//     const isPasswordCorrect = await compareHashes(bodyData.password, existUser.password);
//     if (!isPasswordCorrect)
//     {
//         throw new ResponseError("invalid email or password", 401, { email: bodyData.email, password: bodyData.password });
//     }

//     let { password, ...userData } = existUser.toObject();

//     userData.token = tokenGenerator({ name: userData.name, email: userData.email, id: userData.id });

//     return { message: "login successful", user: userData };

// }


// export async function updateUser(headers, bodyData)
// {
//     const { token } = headers;

//     const { payload } = verifyToken(token);

//     const existUser = await UserModel.findById(payload.id);
//     console.log(existUser);

//     if (!existUser)
//     {
//         throw new ResponseError("user not found", 404, { id: payload.id });
//     }

//     const updatedData = [];

//     // console.log(bodyData.email && bodyData.email !== existUser.email);
//     if (bodyData.email && bodyData.email !== existUser.email)
//     {
//         const existEmail = await UserModel.findOne({ email: bodyData.email, _id: { $nin: payload.id } });

//         if (existEmail)
//         {
//             throw new ResponseError("email already exist", 409, { email: bodyData.email });
//         }
//         existUser.email = bodyData.email;
//         updatedData.push("email");
//     }

//     if (bodyData.name && bodyData.name !== existUser.name)
//     {
//         existUser.name = bodyData.name;
//         updatedData.push("name");
//     }

//     if (bodyData.phone && bodyData.phone !== existUser.phone)
//     {
//         existUser.phone = encrypt(bodyData.phone);
//         updatedData.push("phone");
//     }

//     if (bodyData.age && bodyData.age !== existUser.age)
//     {
//         existUser.age = bodyData.age;
//         updatedData.push("age");
//     }

//     if (updatedData.length) await existUser.save();

//     return updatedData.length
//         ? { message: `User ${updatedData.join(", ")} updated successfully`, user: existUser }
//         : { message: `Data didn't change`, user: existUser };
// }



// export async function deleteUser(headers)
// {
//     const { token } = headers;
//     const { payload } = verifyToken(token);

//     const result = await UserModel.deleteOne({ _id: payload.id });

//     if (!result.deletedCount)
//     {
//         throw new ResponseError("user not found", 404, { id: payload.id });
//     }

//     return { message: "user deleted successfully" };
// }



// export async function getAllUsers()
// {
//     const result = await UserModel.find();

//     if (result.length == 0)
//     {
//         throw new ResponseError("no users found", 404, { result });
//     }

//     return { message: "success", users: result };
// }

// export async function bulkCreate(bodyData)
// {
//     const data = [];
//     for (const user of bodyData)
//     {
//         const { email } = user;

//         const existUser = await UserModel.findOne({ email: email });

//         if (existUser)
//         {
//             throw new ResponseError("email already exist", 409, { email });
//         }

//         user.password = await hashingPassword(user.password);

//         user.phone = encrypt(user.phone);

//         const { password, ...result } = (await UserModel.create(user)).toObject();

//         data.push(result);
//     }

//     return { message: "success", data };
// }