"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_EXPIRES_IN = exports.REFRESH_SECRET = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
exports.REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret-key';
exports.REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '30d';
