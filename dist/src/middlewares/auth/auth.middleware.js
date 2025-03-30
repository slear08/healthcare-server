"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const user_type_constant_1 = __importDefault(require("../../constant/user_type.constant"));
const http_error_1 = require("../../utils/http-error");
const verify_token_util_1 = require("../../utils/jwt/verify_token.util");
const AuthMiddleware = (req, _, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(new http_error_1.HttpError(401, 'Authorization token is required'));
    }
    const decoded = (0, verify_token_util_1.VerifyJWT)(token);
    if (decoded?.role !== user_type_constant_1.default.ADMIN) {
        return next(new http_error_1.HttpError(401, 'Unauthorized access'));
    }
    if (!decoded) {
        return next(new http_error_1.HttpError(403, 'Invalid or expired token'));
    }
    req.admin = {
        ...decoded,
        id: decoded.id,
    };
    next();
};
exports.AuthMiddleware = AuthMiddleware;
