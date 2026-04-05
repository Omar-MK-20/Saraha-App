import { Router } from "express";
import * as authService from "./auth.service.js";
import { successResponse } from "../../util/Res/ResponseObject.js";
import { validation } from "../../util/Middleware/ValidationMiddleware.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

export const authRouter = Router();

authRouter.post("/signup",
    validation(signupSchema),
    async (req, res) =>
    {
        const result = await authService.signup(req.valid.body);

        return successResponse(res, result);
    });


authRouter.post("/login",
    validation(loginSchema),
    async (req, res) =>
    {
        const result = await authService.login(req.valid.body);

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