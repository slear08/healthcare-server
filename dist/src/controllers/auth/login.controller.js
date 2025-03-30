"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdminController = void 0;
const login_service_1 = require("../../services/auth/login.service");
const loginAdminController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await (0, login_service_1.loginUserService)(email, password);
        const maxAge = process.env.JWT_MAX_AGE
            ? parseInt(process.env.JWT_MAX_AGE, 10)
            : 60 * 60 * 1000;
        res.cookie('token', result.auth.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge,
        });
        res.cookie('refreshToken', result.auth.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.loginAdminController = loginAdminController;
