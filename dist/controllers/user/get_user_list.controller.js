"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserListController = getUserListController;
const get_user_list_service_1 = require("../../services/user/get_user_list.service");
async function getUserListController(req, res, next) {
    try {
        const users = await (0, get_user_list_service_1.getUserListService)();
        res.json({ message: 'User list fetched', data: users });
    }
    catch (error) {
        next(error);
    }
}
