"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueLimitHelper = getQueueLimitHelper;
const queue_limit_model_1 = __importDefault(require("../models/queue_limit.model"));
async function getQueueLimitHelper() {
    const queueLimit = await queue_limit_model_1.default.findOne();
    return queueLimit ?? { status: 'ON', limit: 10 };
}
