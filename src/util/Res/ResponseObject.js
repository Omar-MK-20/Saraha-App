export function getSuccessObject(data)
{
    return { status: 200, message: "success", data };
}

/**
 * @param {string} createdName 
 * @param {object} result 
 * @returns {{message: string, result: object}}
 */
export function createSuccessObject(createdName, result)
{
    return { status: 201, message: `${createdName} created successfully`, result: result };
}

export function updateSuccessObject(updatedData, result)
{
    return { status: 200, message: `${updatedData} updated successfully`, result: result };
}

export function deleteSuccessObject(DeletedName)
{
    return { status: 200, message: `${DeletedName} deleted successfully` };
}

export function successObject(status, message, result)
{
    return { status, message, result };
}

/**
 * @param {Response} res 
 * @param {{status: number, message: string, result: object}} result 
 * @returns {void}
 */
export function successResponse(res, result)
{
    const { status, ...restData } = result;

    return res.status(status).json(restData);
}