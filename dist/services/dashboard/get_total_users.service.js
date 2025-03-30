"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalUsersService = getTotalUsersService;
const user_type_constant_1 = __importDefault(require("../../constant/user_type.constant"));
const user_model_1 = __importDefault(require("../../models/user.model"));
async function getTotalUsersService() {
    const totalUsers = await user_model_1.default.countDocuments({ role: user_type_constant_1.default.USER });
    return { totalUsers };
}
