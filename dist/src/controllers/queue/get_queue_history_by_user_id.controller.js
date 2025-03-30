"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueHistoryByUserController = getQueueHistoryByUserController;
const get_queue_history_by_user_id_service_1 = require("../../services/queue/get_queue_history_by_user_id.service");
async function getQueueHistoryByUserController(req, res, next) {
    try {
        const { _id } = req.user;
        const queues = await (0, get_queue_history_by_user_id_service_1.getQueueHistoryByUserService)(_id);
        res.json({ message: 'User queue history', data: queues });
    }
    catch (error) {
        next(error);
    }
}
