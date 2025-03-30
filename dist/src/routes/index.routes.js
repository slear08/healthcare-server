"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verify_user_controller_1 = require("../controllers/user/verify_user.controller");
const auth_middleware_1 = require("../middlewares/auth/auth.middleware");
const passport_auth_middleware_1 = require("../middlewares/auth/passport_auth.middleware");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const data_analytics_routes_1 = __importDefault(require("./data_analytics.routes"));
const medical_queue_routes_1 = __importDefault(require("./medical_queue.routes"));
const medicine_reminder_routes_1 = __importDefault(require("./medicine_reminder.routes"));
const passport_routes_1 = __importDefault(require("./passport.routes"));
const queue_route_1 = __importDefault(require("./queue.route"));
const user_routes_1 = __importDefault(require("./user.routes"));
const Routes = (app) => {
    // PASSPORT AUTHENTICATION
    app.use('/api', passport_routes_1.default);
    // ADMIN AUTHENTICATION
    app.use('/api/auth', auth_routes_1.default);
    // FEATURES
    app.use('/api/queue', medical_queue_routes_1.default);
    app.put('/api/user/verify', passport_auth_middleware_1.PassportAuthMiddleware, verify_user_controller_1.verifyUserController);
    app.use('/api/queue-limit', queue_route_1.default);
    app.use('/api/reminder', passport_auth_middleware_1.PassportAuthMiddleware, medicine_reminder_routes_1.default);
    app.use('/api/user', auth_middleware_1.AuthMiddleware, user_routes_1.default);
    app.use('/api/data-analytics', auth_middleware_1.AuthMiddleware, data_analytics_routes_1.default);
};
exports.default = Routes;
