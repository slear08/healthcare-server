"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueLimitService = void 0;
const queue_limit_model_1 = __importDefault(require("../../models/queue_limit.model"));
const getQueueLimitService = async () => {
    const queueLimit = await queue_limit_model_1.default.findOne();
    if (!queueLimit) {
        const defaultSettings = new queue_limit_model_1.default({
            status: 'ON',
            limit: 30,
        });
        await defaultSettings.save();
        return defaultSettings;
    }
    return queueLimit;
};
exports.getQueueLimitService = getQueueLimitService;
