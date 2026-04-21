import fs from "node:fs/promises";
import path from "node:path";
import { UserModel } from "../../DB/Models/user.model.js";
import { TokenType } from "../../util/Enums/token.enums.js";
import { UserRole } from "../../util/Enums/user.enums.js";
import { NotFoundError, ResponseError } from "../../util/Res/ResponseError.js";
import { deleteSuccessObject, getSuccessObject, successObject, updateSuccessObject } from "../../util/Res/ResponseObject.js";
import { tokenGenerator } from "../../util/Security/token.js";
import { moveFile } from "../../util/helpers/moveFile.js";
import { galleryUploadPath } from "../../util/helpers/paths.js";
import { removeFile } from "../../util/helpers/removeFile.js";


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


export async function getSharedProfile(profileId, session, userData)
{
    const existUser = await UserModel.findById(profileId).select("-role -confirmEmail -createdAt -updatedAt -__v -provider -galleries");

    if (!existUser)
    {
        throw new NotFoundError({ message: "user not found", info: { id: profileId } });
    }

    if (session.firstTry == undefined) session.firstTry = true;

    if (session.firstTry)
    {
        if (existUser.views == undefined)
        {
            existUser.views = 0;
        }
        existUser.views++;
        await existUser.save();

        session.firstTry = false;
    }

    if (userData?.role == UserRole.admin)
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

