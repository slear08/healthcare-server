"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const DatabaseConnection = async (url) => {
    try {
        await mongoose_1.default.connect(url);
        logger_1.default.info('Database connected successfully');
    }
    catch (error) {
        logger_1.default.error('Database connection error:', error);
        process.exit(1);
    }
};
exports.DatabaseConnection = DatabaseConnection;
