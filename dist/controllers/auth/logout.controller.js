"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = void 0;
// Logout Controller
const logoutController = async (_req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutController = logoutController;
