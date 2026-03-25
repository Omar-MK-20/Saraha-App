import { Buffer } from "node:buffer";
import crypto from "node:crypto";
import { ResponseError } from "../Res/ResponseError.js";
import { ENCRYPTION_SECRET_KEY } from "../../../config/app.config.js";


const algorithm = "aes-256-gcm";
const secretKey = Buffer.from(ENCRYPTION_SECRET_KEY, "hex");
if (secretKey.length !== 32)
{
    throw new Error("SECRET_KEY must be 32 bytes (64 hex characters)");
}

/**
 * A function that takes the data wanted to encrypted and encrypt it using `aes-256-gcm` algorithm
 * @param {string} data The data wanted to be encrypted
 * @returns {string} The encrypted data as string
 */
export function encrypt(data)
{
    try
    {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

        let encryptedData = cipher.update(data, "utf-8", "hex");

        encryptedData += cipher.final("hex");

        const authTag = cipher.getAuthTag();

        return [encryptedData, iv.toString("hex"), authTag.toString("hex")].join(":");
    }
    catch (error)
    {
        throw new ResponseError("error encrypting user's phone", 500, { error });
    }
}

/**
 * A function that restores the data before encryption
 * @param {string} data The encrypted data wanted to be decrypted
 * @returns {string} The original data before encryption
 */
export function decrypt(data)
{
    try
    {
        const [encryptedData, iv, authTag] = data.split(":");

        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, "hex"));

        decipher.setAuthTag(Buffer.from(authTag, "hex"));

        let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
        decryptedData += decipher.final("utf-8");

        return decryptedData;
    }
    catch (error)
    {
        throw new ResponseError("error decrypting user's phone", 500, { error });
    }
}
