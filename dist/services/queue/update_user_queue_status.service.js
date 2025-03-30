"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserQueueStatusService = updateUserQueueStatusService;
const medical_queue_model_1 = __importDefault(require("../../models/medical_queue.model"));
const http_error_1 = require("../../utils/http-error");
const logger_1 = __importDefault(require("../../utils/logger"));
async function updateUserQueueStatusService(userId, queueId, status, io // Socket.IO instance
) {
    const updatedQueue = await medical_queue_model_1.default.findOneAndUpdate({ _id: queueId, userId }, { status }, { new: true, runValidators: true });
    if (!updatedQueue) {
        throw new http_error_1.HttpError(404, 'Queue not found or unauthorized');
    }
    try {
        // Emit socket event for real-time updates
        io.emit('queueStatusUpdate', {
            queueId,
            userId,
            status,
            updatedQueue,
        });
        logger_1.default.info(`Emitted queueStatusUpdate event for queue ${queueId}`);
    }
    catch (error) {
        logger_1.default.error('Error emitting queueStatusUpdate event:', error);
    }
    return updatedQueue;
}
