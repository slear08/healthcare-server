"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserService = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const http_error_1 = require("../../utils/http-error");
const verifyUserService = async ({ userId, name, mobileNumber, }) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new http_error_1.HttpError(404, 'User not found');
    }
    user.name = name;
    user.mobileNumber = mobileNumber;
    user.isVerified = true;
    await user.save();
    return {
        message: 'Setup completed successfully',
        user: {
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
            isVerified: user.isVerified,
        },
    };
};
exports.verifyUserService = verifyUserService;
