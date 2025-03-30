"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = void 0;
const change_password_service_1 = require("../../services/auth/change_password.service");
const changePasswordController = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.admin?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const result = await (0, change_password_service_1.changePasswordService)({
            userId: userId.toString(),
            currentPassword,
            newPassword,
        });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.changePasswordController = changePasswordController;
