import path from "node:path";
import fs from "node:fs/promises";

export async function removeFile(filePath)
{
    try
    {
        const fullPath = path.resolve(`.${filePath}`);
        await fs.unlink(fullPath);
    } catch (error)
    {
        throw new ResponseError("Error removing file", 500, { error });
    }
}