
/**
 * The ResponseError class is a custom Error class in JavaScript that includes additional properties
 * like statusCode and info.
 * @extends Error
 */

export class ResponseError extends Error
{
    constructor(message, statusCode = 500, info = null)
    {
        super(message);
        this.name = 'Response Error';
        this.statusCode = statusCode;
        this.info = info;

        Error.captureStackTrace(this, this.constructor);
    }
}


/**
 * Error class indicates The server cannot find the requested data user is looking for
 * @extends ResponseError
 */
export class NotFoundError extends ResponseError
{
    /**
     * @param {{message: string, info: object|undefined}} param0 
     */
    constructor({ message, info })
    {
        super(message, 404, info);
        this.name = 'Not Found Error';
    }
}

/**
 * Error class indicates The client is unauthenticated to get response.
 * @extends ResponseError
 */
export class UnauthorizedError extends ResponseError
{
    /**
     * @param {{message: string, info: object|undefined}} param0 
     */
    constructor({ message, info })
    {
        super(message, 401, info);
        this.name = 'Unauthorized Error';
    }
}

/**
 * Error class indicates The client is unauthorized to get response.
 * @extends ResponseError
 */
export class ForbiddenError extends ResponseError
{
    /**
     * @param {{message: string, info: object|undefined}} param0 
     */
    constructor({ message, info })
    {
        super(message, 403, info);
        this.name = 'Forbidden Error';
    }
}

/**
 * Error class indicates The client has sent a duplicated data.
 * @extends ResponseError
 */
export class ConflictError extends ResponseError
{
    /**
     * @param {{message: string, info: object|undefined}} param0 
     */
    constructor({ message, info })
    {
        super(message, 409, info);
        this.name = 'Conflict Error';
    }
}

/**
 * Error class indicates The client has sent invalid or missing required data.
 * @extends ResponseError
 */
export class ContentError extends ResponseError
{
    /**
     * @param {{message: string, info: object|undefined}} param0 
     */
    constructor({ message, info })
    {
        super(message, 422, info);
        this.name = 'Unprocessable Content Error';
    }
}