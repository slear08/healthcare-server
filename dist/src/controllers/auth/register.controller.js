"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdminController = void 0;
const regiter_service_1 = require("../../services/auth/regiter.service");
const registerAdminController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const result = await (0, regiter_service_1.registerUserService)({ name, email, password });
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.registerAdminController = registerAdminController;
