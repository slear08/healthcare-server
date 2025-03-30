"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./passport/config/passport.config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = require("http");
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const database_config_1 = require("./config/database.config");
const errors_1 = require("./middlewares/errors");
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const cron_service_1 = require("./services/cron.service");
const http_error_1 = require("./utils/http-error");
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Socket.IO setup with CORS
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? false // Disable CORS in production since we're serving from the same origin
            : process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
});
const port = process.env.PORT || 3000;
// Socket.IO connection handling
io.on('connection', (socket) => {
    logger_1.default.info('Client connected:', socket.id);
    socket.on('disconnect', () => {
        logger_1.default.info('Client disconnected:', socket.id);
    });
    // Handle any errors
    socket.on('error', (error) => {
        logger_1.default.error('Socket error:', error);
    });
});
// Make io accessible to our routes
app.set('io', io);
// CORS
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? false // Disable CORS in production since we're serving from the same origin
        : process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Session configuration
app.use((0, express_session_1.default)({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));
// Initialize Passport and restore authentication state from session
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Middleware to parse cookies
app.use((0, cookie_parser_1.default)());
// Middleware to parse JSON requests
app.use(express_1.default.json());
// Middleware to parse URL-encoded requests (for form data)
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
(0, index_routes_1.default)(app);
app.use('/api/notifications', notification_routes_1.default);
// Serve static files from the React build directory in production
if (process.env.NODE_ENV === 'production') {
    const buildPath = path_1.default.join(__dirname, '../app/dist');
    app.use(express_1.default.static(buildPath));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(buildPath, 'index.html'));
    });
}
// Start the server
httpServer.listen(port, async () => {
    logger_1.default.info(`Server is running on http://localhost:${port}`);
    await (0, database_config_1.DatabaseConnection)(process.env.MONGO_URI);
    // Start the cron job after server and database are initialized
    (0, cron_service_1.startCronJob)();
});
// Fallback route for handling 404 (Not Found) errors
app.use((req, res, next) => {
    const error = new http_error_1.HttpError(404, 'Resource Not Found');
    next(error);
});
// Error handling middleware
app.use(errors_1.ErrorHandler);
