import mongoose from "mongoose";
import { decrypt } from "../../util/Security/encryption.js";
import { ResponseError } from "../../util/Res/ResponseError.js";
import { UserGender, UserProvider, UserRole } from "../../util/Enums/user.enums.js";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: function () { return this.provider == UserProvider.system; },
        select: false,
    },
    DOB: {
        type: Date,
        required: function () { return this.provider == UserProvider.system; },
    },
    gender: {
        type: String,
        enum: Object.values(UserGender),
        default: UserGender.male
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        get: function (value)
        {
            if (!value) { return; }
            try
            {
                return decrypt(value);
            }
            catch (error)
            {
                throw new ResponseError("error decrypting user's phone", 500, { error });
            }
        },
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.user
    },
    profilePic: String,
    coverPics: [String],
    provider: {
        type: String,
        enum: Object.values(UserProvider),
        default: UserProvider.system
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true
});


export const UserModel = mongoose.model("users", UserSchema);