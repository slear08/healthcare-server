"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueValidatorUtil = queueValidatorUtil;
const get_queue_limit_helper_1 = require("../../helper/get_queue_limit.helper");
const medical_queue_model_1 = __importDefault(require("../../models/medical_queue.model"));
async function queueValidatorUtil() {
    const queueLimit = await (0, get_queue_limit_helper_1.getQueueLimitHelper)();
    const activeQueues = await medical_queue_model_1.default.countDocuments({ status: 'waiting' });
    return queueLimit.status === 'ON' && activeQueues < queueLimit.limit;
}
