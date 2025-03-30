"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logout_controller_1 = require("../controllers/auth/logout.controller");
const passport_success_controller_1 = require("../controllers/auth/passport_success.controller");
const google_callback_service_1 = require("../passport/service/google_callback.service");
const google_login_service_1 = require("../passport/service/google_login.service");
const router = (0, express_1.Router)();
// Route to initiate Google login
router.get('/auth/google', google_login_service_1.GoogleLogin);
// Route to handle the callback after Google authentication
router.get('/auth/google/callback', google_callback_service_1.GoogleCallback);
router.get('/login/success', passport_success_controller_1.passportSuccessController);
router.get('/auth/logout', logout_controller_1.logoutController);
exports.default = router;
