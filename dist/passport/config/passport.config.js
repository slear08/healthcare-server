"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_type_constant_1 = __importDefault(require("../../constant/user_type.constant"));
const user_model_1 = __importDefault(require("../../models/user.model"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email'],
    passReqToCallback: true,
}, async (_req, _accessToken, _refreshToken, profile, cb) => {
    try {
        const existingUser = await user_model_1.default.findOne({ _id: profile.id });
        if (existingUser) {
            return cb(null, existingUser);
        }
        else {
            const newUser = new user_model_1.default({
                _id: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                role: user_type_constant_1.default.USER,
                isVerified: false,
                profile: profile.photos?.[0]?.value,
            });
            await newUser.save();
            return cb(null, newUser);
        }
    }
    catch (error) {
        return cb(error);
    }
}));
passport_1.default.serializeUser((serializeUser, done) => {
    const user = serializeUser;
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
exports.default = passport_1.default;
