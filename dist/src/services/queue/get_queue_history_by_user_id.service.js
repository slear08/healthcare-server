"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueHistoryByUserService = void 0;
const medical_queue_model_1 = __importDefault(require("../../models/medical_queue.model"));
const getQueueHistoryByUserService = async (userId) => {
    return await medical_queue_model_1.default.find({ userId });
};
exports.getQueueHistoryByUserService = getQueueHistoryByUserService;
