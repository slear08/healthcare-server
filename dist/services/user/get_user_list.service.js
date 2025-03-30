"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserListService = getUserListService;
const user_type_constant_1 = __importDefault(require("../../constant/user_type.constant"));
const user_model_1 = __importDefault(require("../../models/user.model"));
async function getUserListService() {
    return await user_model_1.default.find({ role: user_type_constant_1.default.USER }).select('-password'); // Exclude password
}
