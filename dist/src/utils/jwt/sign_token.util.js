"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_constant_1 = require("./constant/secrets.constant");
const SignJWT = (payload, options = {}) => {
    return jsonwebtoken_1.default.sign(payload, secrets_constant_1.JWT_SECRET, {
        expiresIn: secrets_constant_1.JWT_EXPIRES_IN,
        ...options,
    });
};
exports.SignJWT = SignJWT;
