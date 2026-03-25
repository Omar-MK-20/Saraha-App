import { OAuth2Client } from 'google-auth-library';
import { UnauthorizedError } from '../Res/ResponseError.js';
import { GOOGLE_CLIENT_ID } from '../../../config/app.config.js';

const client = new OAuth2Client();

export async function verifyGoogleAuth(idToken)
{
    try
    {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: GOOGLE_CLIENT_ID,
        });

        return ticket.getPayload();
    } catch (error)
    {
        throw new UnauthorizedError({ message: error.message, info: error });
    }
}