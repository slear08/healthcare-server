"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MedicalQueueSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: () => `QUEUE_${Date.now().toString().slice(-5)}_${Math.random().toString(36).slice(2, 8)}`,
    },
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['waiting', 'in-progress', 'completed', 'cancelled'],
        default: 'waiting',
    },
    purpose: {
        type: String,
        enum: ['checkup', 'medicine-request'],
    },
    timeSchedule: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
const MedicalQueue = mongoose_1.default.model('MedicalQueue', MedicalQueueSchema);
exports.default = MedicalQueue;
