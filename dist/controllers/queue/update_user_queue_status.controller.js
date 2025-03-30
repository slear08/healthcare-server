"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserQueueStatusController = updateUserQueueStatusController;
const update_user_queue_status_service_1 = require("../../services/queue/update_user_queue_status.service");
const http_error_1 = require("../../utils/http-error");
async function updateUserQueueStatusController(req, res, next) {
    try {
        const { userId, queueId } = req.params;
        const { status } = req.body;
        const io = req.app.get('io');
        if (!['waiting', 'in-progress', 'completed', 'cancelled'].includes(status)) {
            throw new http_error_1.HttpError(400, 'Invalid status value');
        }
        const updatedQueue = await (0, update_user_queue_status_service_1.updateUserQueueStatusService)(userId, queueId, status, io);
        res.json({ message: 'Queue status updated', data: updatedQueue });
    }
    catch (error) {
        next(error);
    }
}
