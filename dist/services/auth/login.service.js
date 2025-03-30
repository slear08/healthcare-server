"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const http_error_1 = require("../../utils/http-error");
const sign_refresh_token_util_1 = require("../../utils/jwt/sign_refresh_token.util");
const sign_token_util_1 = require("../../utils/jwt/sign_token.util");
const loginUserService = async (email, password) => {
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        throw new http_error_1.HttpError(400, 'Account does not exist');
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new http_error_1.HttpError(400, 'Invalid email or password');
    }
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const token = (0, sign_token_util_1.SignJWT)(payload);
    const refreshToken = (0, sign_refresh_token_util_1.SignRefreshToken)(payload);
    return {
        message: 'Logged in successfully',
        user: { name: user.name, role: user.role },
        auth: { token, refreshToken },
    };
};
exports.loginUserService = loginUserService;
