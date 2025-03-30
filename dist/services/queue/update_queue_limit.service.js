"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQueueLimitService = updateQueueLimitService;
const medical_queue_model_1 = __importDefault(require("../../models/medical_queue.model"));
const queue_limit_model_1 = __importDefault(require("../../models/queue_limit.model"));
const http_error_1 = require("../../utils/http-error");
async function updateQueueLimitService(status, limit) {
    if (limit < 1) {
        throw new http_error_1.HttpError(400, 'Queue limit must be at least 1');
    }
    // Count active queues (waiting and in-progress)
    const activeQueueCount = await medical_queue_model_1.default.countDocuments({
        status: { $in: ['waiting', 'in-progress'] },
        deletedAt: null,
    });
    if (limit < activeQueueCount) {
        throw new http_error_1.HttpError(400, `Cannot set limit below current active queue count (${activeQueueCount} active queues)`);
    }
    const updatedQueueLimit = await queue_limit_model_1.default.findOneAndUpdate({}, { $set: { status, limit } }, { new: true, runValidators: true });
    return updatedQueueLimit;
}
