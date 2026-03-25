import bcrypt from "bcrypt";
import { ResponseError } from "../Res/ResponseError.js";


/**
 * 
 * @param {string} password 
 * @returns {Promise<string>}
 */
export async function hashingPassword(password)
{
    try
    {
        const saltRounds = 12;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    }
    catch (error)
    {
        throw new ResponseError("error hashing user's password", 500, { error });
    }
}

/**
 * 
 * @param {string | Buffer} password 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>}
 */
export async function compareHashes(password, hashedPassword)
{
    try
    {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch (error)
    {
        throw new ResponseError("Password comparison failed", 500, { error });
    }
}

// const hashedPassword = await hashingPassword("password");

// console.log(await compareHashes("password", hashedPassword));
