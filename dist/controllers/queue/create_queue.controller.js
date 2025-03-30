"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueueController = void 0;
const get_queue_limit_helper_1 = require("../../helper/get_queue_limit.helper");
const create_queue_service_1 = require("../../services/queue/create_queue.service");
const http_error_1 = require("../../utils/http-error");
const createQueueController = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const purpose = req.body.purpose;
        const userId = _id;
        const io = req.app.get('io');
        const queueLimitStatus = await (0, get_queue_limit_helper_1.getQueueLimitHelper)();
        if (queueLimitStatus.status === 'OFF') {
            throw new http_error_1.HttpError(400, 'The operation is not allowed right now. Please try again later.');
        }
        const response = await (0, create_queue_service_1.createQueueService)(userId, purpose, io);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.createQueueController = createQueueController;
