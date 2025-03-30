"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const change_password_controller_1 = require("../controllers/auth/change_password.controller");
const login_controller_1 = require("../controllers/auth/login.controller");
const logout_controller_1 = require("../controllers/auth/logout.controller");
const register_controller_1 = require("../controllers/auth/register.controller");
const auth_middleware_1 = require("../middlewares/auth/auth.middleware");
const router = express_1.default.Router();
router.post('/login', login_controller_1.loginAdminController);
router.post('/register', register_controller_1.registerAdminController);
router.post('/logout', logout_controller_1.logoutController);
router.put('/change-password', auth_middleware_1.AuthMiddleware, change_password_controller_1.changePasswordController);
exports.default = router;
