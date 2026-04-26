import cors from "cors";
import express from 'express';
import path from "node:path";
import { SEVER_PORT } from '../config/app.config.js';
import { testDBConnection } from './DB/Connection.js';
import { redisClient, testRedisConnection } from './DB/redis.connection.js';
import { authRouter } from './Modules/Auth/auth.controller.js';
import { userRouter } from './Modules/User/user.controller.js';
import { errorMiddleware } from './util/Middleware/ErrorMiddleware.js';
import { notFoundRoute } from './util/Middleware/NotFoundRoute.js';

export async function bootstrap()
{

    await testDBConnection();
    await testRedisConnection();

    // const result  = await redisClient.get("name")
    // console.log(result)

    const server = express();

    server.use(cors());

    server.use(express.json());

    server.get("/", (req, res) => { res.json({ message: "Hello from Saraha App" }); });
    server.use("/uploads", express.static(path.resolve("./uploads")));

    server.use("/auth", authRouter);
    server.use("/users", userRouter);


    server.use(errorMiddleware);

    server.use(notFoundRoute);

    if (!process.env.VERCEL)
    {
        server.listen(SEVER_PORT, "0.0.0.0", () =>
        {
            console.log(`Server is running on port :: ${SEVER_PORT}`);
        });
    }

    return server;
}