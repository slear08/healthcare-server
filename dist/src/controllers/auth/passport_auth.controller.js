"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallback = exports.googleLogin = void 0;
const passport_1 = __importDefault(require("passport"));
const googleLogin = (req, res, next) => {
    passport_1.default.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};
exports.googleLogin = googleLogin;
const googleCallback = (req, res) => {
    passport_1.default.authenticate('google', {
        failureRedirect: '/login',
    })(req, res, () => {
        res.redirect('/profile');
    });
};
exports.googleCallback = googleCallback;
