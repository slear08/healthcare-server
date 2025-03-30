"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const router = express_1.default.Router();
router.get('/vapid-public-key', notificationController_1.getVapidPublicKey);
router.post('/subscribe', notificationController_1.subscribe);
router.post('/send', notificationController_1.sendNotification);
exports.default = router;
