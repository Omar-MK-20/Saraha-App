// import { Router } from "express";
// import { bulkCreate, createUser, deleteUser, getAllUsers, getSingleUser, login, updateUser } from "./user.service.js";

import { Router } from "express";
import session from "express-session";
import { EXPRESS_SESSION_KEY } from "../../../config/app.config.js";
import { FileFormats, FolderName } from "../../util/Enums/file.enums.js";
import { AuthType, TokenType } from "../../util/Enums/token.enums.js";
import { UserRole } from "../../util/Enums/user.enums.js";
import { authentication, authorization } from "../../util/Middleware/AuthMiddleware.js";
import { validation } from "../../util/Middleware/ValidationMiddleware.js";
import { upload } from "../../util/Multer/multer.config.js";
import { getSuccessObject, successResponse } from "../../util/Res/ResponseObject.js";
import * as userService from "./user.service.js";
import { coverPicSchema, profilePicSchema, shareProfileSchema } from "./user.validation.js";

export const userRouter = Router();

userRouter.get("/",
    authentication(TokenType.access, AuthType.bearer),
    authorization(UserRole.user, UserRole.admin),
    async (req, res) =>
    {
        const result = getSuccessObject(req.user);

        return successResponse(res, result);
    });


userRouter.post("/renew-token",
    authentication(TokenType.refresh, AuthType.bearer),
    authorization(UserRole.user, UserRole.admin),
    async (req, res) =>
    {
        const result = await userService.renewToken(req.user);

        return successResponse(res, result);
    });


userRouter.post("/profile-pic",
    authentication(TokenType.access, AuthType.bearer),
    authorization(UserRole.user),
    upload({
        folderName: FolderName.profilePics,
        allowedFormats: [...FileFormats.image],
        fileSize: 10
    }).single("profilePic"),
    validation(profilePicSchema),
    async (req, res) =>
    {
        const result = await userService.uploadProfilePic(req.file, req.user);
        return successResponse(res, result);
    });

userRouter.post("/cover-pics",
    authentication(TokenType.access, AuthType.bearer),
    authorization(UserRole.user),
    upload({
        folderName: FolderName.coverPics,
        allowedFormats: [...FileFormats.image, ...FileFormats.gif],
        fileSize: 1,
        filesCount: 3
    }).array("coverPics"),
    validation(coverPicSchema),
    async (req, res) =>
    {
        const result = await userService.uploadCoverPic(req.files, req.user);
        return successResponse(res, result);
    });

userRouter.get("/share-profile/:id",
    authentication(TokenType.access, AuthType.bearer, true),
    session({
        secret: EXPRESS_SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 1, // milliseconds * seconds * minutes = 1 min
            sameSite: true
        }
    }),
    validation(shareProfileSchema),
    async (req, res) =>
    {
        const result = await userService.getSharedProfile(req);
        return successResponse(res, result);
    });


userRouter.delete("/remove-profile-pic",
    authentication(TokenType.access, AuthType.bearer),
    authorization(UserRole.user, UserRole.admin),
    async (req, res) =>
    {
        const result = await userService.removeProfileImage(req.user);
        return successResponse(res, result);
    }
);



// userRouter.post("/signup", async (req, res) =>
// {
//     const result = await createUser(req.body);
//     res.status(200).json(result);
// });


// userRouter.post("/login", async (req, res) =>
// {
//     const result = await login(req.body);
//     res.status(200).json(result);
// });


// userRouter.patch("/", async (req, res) =>
// {
//     const result = await updateUser(req.headers, req.body);
//     res.status(201).json(result);
// });

// userRouter.delete("/", async (req, res) =>
// {
//     const result = await deleteUser(req.headers);

//     res.status(200).json(result);
// });





// userRouter.post("/bulk-create", async (req, res) =>
// {
//     const result = await bulkCreate(req.body);

//     res.status(201).json(result);
// });