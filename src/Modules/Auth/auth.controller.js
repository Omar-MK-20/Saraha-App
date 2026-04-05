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
    let idToken;
    if (req.body?.idToken)
    {
        idToken = req.body.idToken;
    }
    else
    {
        idToken = req.headers.authorization;
    }

    const result = await authService.signupWithGoogle(idToken);

    return successResponse(res, result);
});

authRouter.post("/login/gmail", async (req, res) =>
{
    let idToken;
    if (req.body?.idToken)
    {
        idToken = req.body.idToken;
    }
    else
    {
        idToken = req.headers.authorization;
    }
    
    const result = await authService.loginWithGoogle(idToken);

    return successResponse(res, result);
});