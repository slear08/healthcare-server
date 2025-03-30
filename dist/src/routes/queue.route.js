"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_queue_limit_controller_1 = require("../controllers/queue/get_queue_limit.controller");
const auth_middleware_1 = require("../middlewares/auth/auth.middleware");
const router = (0, express_1.Router)();
router.get('/settings', auth_middleware_1.AuthMiddleware, get_queue_limit_controller_1.getQueueLimitController);
exports.default = router;
