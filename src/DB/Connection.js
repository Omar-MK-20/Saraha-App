import mongoose from 'mongoose';
import { DB_URI, DB_URI_FALLBACK } from '../../config/app.config.js';

export async function testDBConnection()
{
    try
    {
        await mongoose.connect(DB_URI);
        console.log("Primary DB connected");
    }
    catch (error)
    {
        console.log("Primary DB connection failed", error);

        if (!DB_URI_FALLBACK)
        {
            throw new Error("No fallback DB URI provided");
        }

        try
        {
            await mongoose.disconnect();
            await mongoose.connect(DB_URI_FALLBACK);
            console.log("Fallback DB connected");
        }
        catch (fallbackError)
        {
            console.log("Fallback DB connection failed", fallbackError);
            process.exit(0);
        }
    }

}

mongoose.connection.on('error', err =>
{
    console.log(err);
});