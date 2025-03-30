"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_type_constant_1 = __importDefault(require("../constant/user_type.constant"));
const UserSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: () => `AD_${Date.now().toString().slice(-5)}_${Math.random().toString(36).slice(2, 8)}`,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    profile: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return this.role !== user_type_constant_1.default.USER || !!value;
            },
            message: 'Password is required for admin users',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        enum: [user_type_constant_1.default.ADMIN, user_type_constant_1.default.USER],
    },
    password: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return this.role !== user_type_constant_1.default.ADMIN || !!value;
            },
            message: 'Password is required for admin users',
        },
    },
    mobileNumber: {
        type: String,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)('User', UserSchema);
UserSchema.pre('save', function (next) {
    if (this.role !== user_type_constant_1.default.ADMIN) {
        delete this.password;
    }
    next();
});
exports.default = User;
