"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueueService = void 0;
const medical_queue_model_1 = __importDefault(require("../../models/medical_queue.model"));
const http_error_1 = require("../../utils/http-error");
const logger_1 = __importDefault(require("../../utils/logger"));
const queue_validator_util_1 = require("../../utils/queue_validator/queue_validator.util");
const createQueueService = async (userId, purpose, io // Socket.IO instance
) => {
    const existingQueue = await medical_queue_model_1.default.findOne({
        userId,
        status: 'waiting',
    });
    if (existingQueue) {
        return 'Queue entry already exists for this user';
    }
    if (!(await (0, queue_validator_util_1.queueValidatorUtil)())) {
        throw new http_error_1.HttpError(400, 'Queue limit reached');
    }
    const queueEntry = new medical_queue_model_1.default({
        userId,
        status: 'waiting',
        purpose,
        timeSchedule: new Date(),
    });
    await queueEntry.save();
    try {
        // Emit socket event for new queue entry
        io.emit('newQueueEntry', {
            queueId: queueEntry._id,
            userId,
            purpose,
            timeSchedule: queueEntry.timeSchedule,
            status: queueEntry.status,
        });
        logger_1.default.info(`Emitted newQueueEntry event for queue ${queueEntry._id}`);
    }
    catch (error) {
        logger_1.default.error('Error emitting newQueueEntry event:', error);
    }
    return {
        message: 'Queue created successfully',
        queue: queueEntry,
    };
};
exports.createQueueService = createQueueService;
