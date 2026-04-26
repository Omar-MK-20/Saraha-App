import { createClient } from "redis";
import { REDIS_URL } from "../../config/app.config.js";


console.log(REDIS_URL);

export const redisClient = createClient({
    url: REDIS_URL,
});


export async function testRedisConnection()
{
    try
    {
        // await mongoose.connect(DB_URI);
        await redisClient.connect()
        console.log("Redis DB connected");
    }
    catch (error)
    {
        console.log("Redis DB connection failed", error);

        // if (!DB_URI_FALLBACK)
        // {
        //     throw new Error("No fallback DB URI provided");
        // }

        // try
        // {
        //     await mongoose.disconnect();
        //     await mongoose.connect(DB_URI_FALLBACK);
        //     console.log("Fallback DB connected");
        // }
        // catch (fallbackError)
        // {
        //     console.log("Fallback DB connection failed", fallbackError);
        //     process.exit(0);
        // }
    }

}
redisClient.on("error", function (err)
{
    console.log(err);
});

