// import { Router } from "express";
// import { bulkCreate, createUser, deleteUser, getAllUsers, getSingleUser, login, updateUser } from "./user.service.js";

import { Router } from "express";
import { AuthType, TokenType } from "../../util/Enums/token.enums.js";
import { authentication, authorization } from "../../util/Middleware/authMiddleware.js";
import { getSuccessObject, successResponse } from "../../util/Res/ResponseObject.js";
import * as userService from "./user.service.js";
import { UserRole } from "../../util/Enums/user.enums.js";

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