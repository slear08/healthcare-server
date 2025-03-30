"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MedicineReminderSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    numberToTake: {
        type: Number,
        required: true,
    },
    isEveryday: {
        type: Boolean,
        default: true,
    },
    time: {
        type: String,
        required: true,
    },
    reminderDate: {
        type: Date,
        required: function () {
            return !this.isEveryday;
        },
    },
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
}, { timestamps: true });
const MedicineReminder = mongoose_1.default.model('MedicineReminder', MedicineReminderSchema);
exports.default = MedicineReminder;
