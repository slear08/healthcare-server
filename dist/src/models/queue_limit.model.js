"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MedicalQueueLimitSchema = new mongoose_1.default.Schema({
    status: {
        type: String,
        enum: ['ON', 'OFF'],
        required: true,
        default: 'ON',
    },
    limit: {
        type: Number,
        required: true,
        default: 30,
        min: 1,
    },
}, { timestamps: true });
const MedicalQueueLimit = mongoose_1.default.model('MedicalQueueLimit', MedicalQueueLimitSchema);
exports.default = MedicalQueueLimit;
