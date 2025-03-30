"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalUsersController = getTotalUsersController;
const get_total_users_service_1 = require("../../services/dashboard/get_total_users.service");
async function getTotalUsersController(req, res, next) {
    try {
        const result = await (0, get_total_users_service_1.getTotalUsersService)();
        res.json({ message: 'Total users fetched', data: result });
    }
    catch (error) {
        next(error);
    }
}
