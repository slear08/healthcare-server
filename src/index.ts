import 'dotenv/config';
import './passport/config/passport.config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import { createServer } from 'http';
import passport from 'passport';
import { Server } from 'socket.io';

import { DatabaseConnection } from './config/database.config';
import { ErrorHandler } from './middlewares/errors';
import Routes from './routes/index.routes';
import { HttpError } from './utils/http-error';
import log from './utils/logger';

const app = express();
const httpServer = createServer(app);

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

const port = process.env.PORT || 3000;

// Socket.IO connection handling
io.on('connection', (socket) => {
  log.info('Client connected:', socket.id);

  socket.on('disconnect', () => {
    log.info('Client disconnected:', socket.id);
  });

  // Handle any errors
  socket.on('error', (error) => {
    log.error('Socket error:', error);
  });
});

// Make io accessible to our routes
app.set('io', io);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded requests (for form data)
app.use(express.urlencoded({ extended: true }));
Routes(app);

// Fallback route for handling 404 (Not Found) errors
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(404, 'Resource Not Found');
  next(error);
});

// Error handling middleware
app.use(ErrorHandler);

// Start the server
httpServer.listen(port, async () => {
  log.info(`Server is running on http://localhost:${port}`);
  await DatabaseConnection(process.env.MONGO_URI as string);
});
