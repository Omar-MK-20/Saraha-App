import mongoose from 'mongoose';
import { DB_URI } from '../../config/app.config.js';

export async function testDBConnection()
{
    try
    {
        await mongoose.connect(DB_URI);
        console.log("DB connected");
    }
    catch (error)
    {
        console.log("DB connection failed", error);
    }
    finally
    {
        mongoose.connection.on('error', err =>
        {
            console.log(err);
        });
    }
}