"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_type_constant_1 = __importDefault(require("../../constant/user_type.constant"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const http_error_1 = require("../../utils/http-error");
const registerUserService = async ({ name, email, password, }) => {
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser) {
        throw new http_error_1.HttpError(400, 'Email already exists');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = new user_model_1.default({
        name,
        email,
        password: hashedPassword,
        role: user_type_constant_1.default.ADMIN,
    });
    await newUser.save();
    return { message: 'User registered successfully' };
};
exports.registerUserService = registerUserService;
