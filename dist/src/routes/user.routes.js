"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_data_analytics_controller_1 = require("../controllers/dashboard/get_data_analytics.controller");
const get_total_users_controller_1 = require("../controllers/dashboard/get_total_users.controller");
const get_user_list_controller_1 = require("../controllers/user/get_user_list.controller");
const router = express_1.default.Router();
router.get('/list', get_user_list_controller_1.getUserListController);
router.get('/total', get_total_users_controller_1.getTotalUsersController);
router.get('/dashboard', get_data_analytics_controller_1.getDataAnalyticsController);
exports.default = router;
