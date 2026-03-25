import { Router } from "express";
import * as authService from "./auth.service.js";
import { successResponse } from "../../util/Res/ResponseObject.js";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) =>
{
    const result = await authService.signup(req.body);

    return successResponse(res, result);
});


authRouter.post("/login", async (req, res) =>
{
    const result = await authService.login(req.body);

    return successResponse(res, result);
});


authRouter.post("/signup/gmail", async (req, res) =>
{
    const result = await authService.signupWithGoogle(req.body);

    return successResponse(res, result);
});

authRouter.post("/login/gmail", async (req, res) =>
{
    const result = await authService.loginWithGoogle(req.body);

    return successResponse(res, result);
});