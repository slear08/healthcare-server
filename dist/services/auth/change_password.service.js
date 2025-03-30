"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const http_error_1 = require("../../utils/http-error");
const changePasswordService = async ({ userId, currentPassword, newPassword, }) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new http_error_1.HttpError(404, 'User not found');
    }
    const isPasswordValid = await bcrypt_1.default.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new http_error_1.HttpError(401, 'Current password is incorrect');
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return { message: 'Password changed successfully' };
};
exports.changePasswordService = changePasswordService;
