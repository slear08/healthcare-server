"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportAuthMiddleware = void 0;
const http_error_1 = require("../../utils/http-error");
const PassportAuthMiddleware = (req, _, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return next(new http_error_1.HttpError(401, 'User is not authenticated'));
};
exports.PassportAuthMiddleware = PassportAuthMiddleware;
