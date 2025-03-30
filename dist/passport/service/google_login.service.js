"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLogin = void 0;
const passport_1 = __importDefault(require("passport"));
const GoogleLogin = (req, res, next) => {
    passport_1.default.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};
exports.GoogleLogin = GoogleLogin;
