"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelUserQueueStatusService = cancelUserQueueStatusService;
const medical_queue_model_1 = __importDefault(require("../../models/medical_queue.model"));
const http_error_1 = require("../../utils/http-error");
const logger_1 = __importDefault(require("../../utils/logger"));
async function cancelUserQueueStatusService(userId, queueId, io // Socket.IO instance
) {
    const updatedQueue = (await medical_queue_model_1.default.findOneAndUpdate({ _id: queueId, userId }, { status: 'cancelled' }, { new: true, runValidators: true }).populate('userId', 'name email profile'));
    if (!updatedQueue) {
        throw new http_error_1.HttpError(404, 'Queue not found or unauthorized');
    }
    try {
        // Emit socket event for real-time updates
        io.emit('handleCancelQueue', {
            queueId: updatedQueue._id,
            userId: updatedQueue.userId._id,
            status: 'cancelled',
            name: updatedQueue.userId.name,
            profile: updatedQueue.userId.profile,
            purpose: updatedQueue.purpose,
            timeSchedule: updatedQueue.timeSchedule,
        });
        logger_1.default.info(`Emitted handleCancelQueue event for queue ${updatedQueue._id}`);
    }
    catch (error) {
        logger_1.default.error('Error emitting handleCancelQueue event:', error);
    }
    return updatedQueue;
}
