import express from 'express';
import cors from "cors";
import { SEVER_PORT } from '../config/app.config.js';
import { testDBConnection } from './DB/Connection.js';
import { authRouter } from './Modules/Auth/auth.controller.js';
import { userRouter } from './Modules/User/user.controller.js';
import { errorMiddleware } from './util/Middleware/ErrorMiddleware.js';
import { notFoundRoute } from './util/Middleware/NotFoundRoute.js';


export async function bootstrap()
{

    await testDBConnection();

    const server = express();

    server.use(cors());

    server.use(express.json());


    server.use("/auth", authRouter);
    server.use("/users", userRouter);


    server.use(errorMiddleware);

    server.use(notFoundRoute);

    server.listen(SEVER_PORT, () =>
    {
        console.log(`Server is running on port :: ${SEVER_PORT}`);
    });

}