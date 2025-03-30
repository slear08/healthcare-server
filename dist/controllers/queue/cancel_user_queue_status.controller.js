"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelUserQueueStatusController = cancelUserQueueStatusController;
const cancel_user_queue_status_service_1 = require("../../services/queue/cancel_user_queue_status.service");
async function cancelUserQueueStatusController(req, res, next) {
    try {
        const { queueId } = req.params;
        const { _id } = req.user;
        const userId = _id;
        const io = req.app.get('io');
        const updatedQueue = await (0, cancel_user_queue_status_service_1.cancelUserQueueStatusService)(userId, queueId, io);
        res.json({ message: 'Queue status updated', data: updatedQueue });
    }
    catch (error) {
        next(error);
    }
}
