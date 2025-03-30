"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../logger"));
const secrets_constant_1 = require("./constant/secrets.constant");
const VerifyJWT = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secrets_constant_1.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        logger_1.default.error(`JWT verification error: ${error.message}`);
        return null;
    }
};
exports.VerifyJWT = VerifyJWT;
