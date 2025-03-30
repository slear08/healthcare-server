"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQueueLimitController = updateQueueLimitController;
const update_queue_limit_service_1 = require("../../services/queue/update_queue_limit.service");
const http_error_1 = require("../../utils/http-error");
async function updateQueueLimitController(req, res, next) {
    try {
        const { status, limit } = req.body;
        if (!['ON', 'OFF'].includes(status) || typeof limit !== 'number') {
            throw new http_error_1.HttpError(400, 'Invalid request parameters');
        }
        const updatedLimit = await (0, update_queue_limit_service_1.updateQueueLimitService)(status, limit);
        res.json({ message: 'Queue limit updated', data: updatedLimit });
    }
    catch (error) {
        next(error);
    }
}
