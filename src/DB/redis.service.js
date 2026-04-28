import { redisClient } from "./redis.connection.js";

export async function set({ key, value, exType = "EX", exValue = 120 })
{
    return await redisClient.set(key, value, { expiration: { type: exType, value: exValue } });
}

export async function get(key)
{
    return await redisClient.get(key);
}

export async function ttl(key)
{
    return await redisClient.ttl(key);
}

export async function exists(key)
{
    return await redisClient.exists(key);
}

export async function del(keys)
{
    return await redisClient.del(keys);
}

export async function update(key, value)
{
    if (!(exists(key))) return 0;

    await redisClient.set(key, value);
    return 1;
}
