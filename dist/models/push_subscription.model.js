"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PushSubscriptionSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        ref: 'User',
    },
    subscription: {
        type: Object,
        required: true,
    },
}, { timestamps: true });
const PushSubscription = mongoose_1.default.model('PushSubscription', PushSubscriptionSchema);
exports.default = PushSubscription;
