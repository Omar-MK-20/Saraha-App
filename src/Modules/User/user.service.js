import { UserModel } from "../../DB/Models/user.model.js";
import { TokenType } from "../../util/Enums/token.enums.js";
import { getSuccessObject, successObject, updateSuccessObject } from "../../util/Res/ResponseObject.js";
import { tokenGenerator } from "../../util/Security/token.js";

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
    const result = await UserModel.updateOne({ _id: userData.id }, { profilePic: pictureData.finalPath });

    return updateSuccessObject("profile picture", { result, pictureData });
}

export async function uploadCoverPic(pictureData, userData)
{
    const coverPicsPaths = pictureData.map(file => file.finalPath);
    const result = await UserModel.updateOne({ _id: userData.id }, { coverPics: coverPicsPaths });

    return successObject(201, "profile uploaded successfully", { result, pictureData });
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