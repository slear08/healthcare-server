"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserController = void 0;
const verify_user_service_1 = require("../../services/user/verify_user.service");
const verifyUserController = async (req, res, next) => {
    try {
        const { name, mobileNumber } = req.body;
        const { _id } = req.user;
        const userId = _id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const result = await (0, verify_user_service_1.verifyUserService)({
            userId: userId.toString(),
            name,
            mobileNumber,
        });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.verifyUserController = verifyUserController;
