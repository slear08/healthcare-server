"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveQueueByUserIdService = void 0;
const medical_queue_model_1 = __importDefault(require("../../models/medical_queue.model"));
const getActiveQueueByUserIdService = async (userId) => {
    // Get all queues with 'waiting' status, sorted by timeSchedule (FIFO order)
    const waitingQueue = await medical_queue_model_1.default.find({
        status: { $in: ['waiting', 'in-progress'] },
    })
        .sort({ timeSchedule: 1 })
        .select('_id userId timeSchedule');
    // Find the position of the user's queue
    const userQueue = waitingQueue.findIndex((queue) => queue.userId === userId);
    return {
        position: userQueue !== -1 ? userQueue + 1 : null,
        totalWaiting: waitingQueue.length,
        userQueue: await medical_queue_model_1.default.find({
            userId,
            status: { $in: ['waiting', 'in-progress'] },
        }),
    };
};
exports.getActiveQueueByUserIdService = getActiveQueueByUserIdService;
