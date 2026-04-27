import { createClient } from "redis";
import { REDIS_URL } from "../../config/app.config.js";

export const redisClient = createClient({
    url: REDIS_URL,
    socket: {
        keepAlive: true,
        reconnectStrategy: (retries) =>
        {
            console.log("Retry attempt:", retries);
            return Math.min(retries * 100, 3000);
        }
    }
});


redisClient.on("error", (err) => { console.log(err); });
redisClient.on("end", () => { console.log("Redis ended from event "); });
redisClient.on("reconnecting", () => { console.log("Redis reconnecting from event "); });


export async function testRedisConnection()
{
    try
    {
        await redisClient.connect();
        console.log("Redis DB connected");
    }
    catch (error)
    {
        console.log("Redis DB connection failed", error);
    }

}
