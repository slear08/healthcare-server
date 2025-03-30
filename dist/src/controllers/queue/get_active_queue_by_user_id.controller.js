"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveQueueByUserIdController = getActiveQueueByUserIdController;
const get_active_queue_by_user_id_service_1 = require("../../services/queue/get_active_queue_by_user_id.service");
async function getActiveQueueByUserIdController(req, res, next) {
    try {
        const { _id } = req.user;
        const queues = await (0, get_active_queue_by_user_id_service_1.getActiveQueueByUserIdService)(_id);
        res.json({ message: 'Queue list fetched', data: queues });
    }
    catch (error) {
        next(error);
    }
}
