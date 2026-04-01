export const otpTypes = {
    verifyEmail: "verify your email address",
    resetPassword: "reset your password"
};

export function objectKeyName(obj, value)
{
    return Object.keys(obj).find(key => obj[key] === value);
}