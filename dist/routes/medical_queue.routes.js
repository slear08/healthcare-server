"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queue_1 = require("../controllers/queue");
const auth_middleware_1 = require("../middlewares/auth/auth.middleware");
const passport_auth_middleware_1 = require("../middlewares/auth/passport_auth.middleware");
const router = express_1.default.Router();
// USER
router.post('/create', passport_auth_middleware_1.PassportAuthMiddleware, queue_1.createQueueController);
router.get('/active-queue', passport_auth_middleware_1.PassportAuthMiddleware, queue_1.getActiveQueueByUserIdController);
router.get('/user/history-list', passport_auth_middleware_1.PassportAuthMiddleware, queue_1.getQueueHistoryByUserController);
router.put('/user/update/queue/:queueId', passport_auth_middleware_1.PassportAuthMiddleware, queue_1.cancelUserQueueStatusController);
// ADMIN
// SAMPLE request for list
// GET /list?status=pending&sort=createdAt:desc
// GET /list?status=in-progress
// GET /list?sort=priority:asc
// GET /queue?page=1&limit=20
// GET /queue?status=pending&sort=createdAt:desc&page=2&limit=15
router.get('/list', auth_middleware_1.AuthMiddleware, queue_1.getQueueListController);
router.put('/update-queue', auth_middleware_1.AuthMiddleware, queue_1.updateQueueLimitController);
router.put('/user-list/update/:userId/:queueId', auth_middleware_1.AuthMiddleware, queue_1.updateUserQueueStatusController);
exports.default = router;
