"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCallback = void 0;
const passport_1 = __importDefault(require("passport"));
const GoogleCallback = (req, res) => {
    passport_1.default.authenticate('google', {
        failureRedirect: '/login',
    })(req, res, () => {
        res.redirect(process.env.CLIENT_URL);
    });
};
exports.GoogleCallback = GoogleCallback;
