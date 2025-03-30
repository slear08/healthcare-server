"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendSMSUtil = SendSMSUtil;
const axios_1 = __importDefault(require("axios"));
const user_model_1 = __importDefault(require("../../models/user.model"));
async function SendSMSUtil(userId, message) {
    const user = await user_model_1.default.findById(userId);
    try {
        const response = await axios_1.default.post(process.env.SEMAPHORE_HOST, new URLSearchParams({
            apikey: process.env.SEMAPHORE_API_KEY,
            number: user?.mobileNumber || '',
            message: message,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}
