import fs from "node:fs/promises";

export async function moveFile(src, dist)
{
    try
    {
        await fs.access(src);
        const data = await fs.readFile(src);
        await fs.writeFile(dist, data);
        await fs.unlink(src);
    }
    catch (error)
    {
        throw new ResponseError("Error moving file", 500, { error });
    }
}