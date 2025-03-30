"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportSuccessController = void 0;
const http_error_1 = require("../../utils/http-error");
const passportSuccessController = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new http_error_1.HttpError(403, 'Unauthorized Access');
        }
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.passportSuccessController = passportSuccessController;
