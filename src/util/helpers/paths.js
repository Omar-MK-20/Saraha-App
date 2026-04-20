/**
 * @param {string?} folderName 
 * @param {string?} filename 
 * @returns {string}
 */
export function generalUploadPath(folderName, filename)
{
    if (!folderName && !filename) return `/uploads/`;
    if (!filename) return `/uploads/${folderName}/`;
    if (!folderName) return `/uploads/${filename}`;
    return `/uploads/${folderName}/${filename}`;
}


/**
 * @param {string?} filename 
 * @returns {string}
 */
export function galleryUploadPath(filename)
{
    if (!filename) return `/uploads/profilePics/galleries/`;
    return `/uploads/profilePics/galleries/${filename}`;
}