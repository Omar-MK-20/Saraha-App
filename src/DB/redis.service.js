import { redisClient } from "./redis.connection.js";

export async function set({ key, value, exType = "EX", exValue })
{
    return await redisClient.set(key, value, { expiration: { type: exType, value: exValue } });
}