"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueLimitController = void 0;
const get_queue_limit_service_1 = require("../../services/queue/get_queue_limit.service");
const getQueueLimitController = async (_req, res) => {
    try {
        const queueLimit = await (0, get_queue_limit_service_1.getQueueLimitService)();
        res.status(200).json({
            success: true,
            data: queueLimit,
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
};
exports.getQueueLimitController = getQueueLimitController;
