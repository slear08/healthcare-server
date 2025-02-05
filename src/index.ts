import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';

import { DatabaseConnection } from './config/database.config';
import session from 'express-session';
import passport from 'passport';
import './passport/config/passport.config';
import { ErrorHandler } from './middlewares/errors';
import { HttpError } from './utils/http-error';
import log from './utils/logger';
import Routes from './routes/index.routes';
const app = express();
const port = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: 'http://localhost:4000', // Specify allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
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
app.listen(port, async () => {
  log.info(`Server is running on http://localhost:${port}`);
  await DatabaseConnection(process.env.MONGO_URI as string);
});
