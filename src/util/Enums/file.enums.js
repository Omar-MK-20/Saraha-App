/**
 * @typedef {"image/jpeg" | "image/jpg" | "image/png" | "image/webp" | "image/gif" | "video/mp4" | "video/mpeg" | "video/webm" | "audio/mpeg" | "audio/ogg" | "audio/webm" | "application/pdf"} MimeType
 */



export const FileFormats = {
    image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    gif: ["image/gif"],
    video: ["video/mp4", "video/mpeg", "video/webm"],
    audio: ["audio/mpeg", "audio/ogg", "audio/webm"],
    pdf: ["application/pdf"]
};


export const FolderName = {
    profilePics: "profilePics",
    coverPics: "coverPics"
};