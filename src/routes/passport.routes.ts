import { Router } from 'express';

import { GoogleCallback } from '../passport/service/google_callback.service';
import { GoogleLogin } from '../passport/service/google_login.service';

const router = Router();

// Route to initiate Google login
router.get('/auth/google', GoogleLogin);

// Route to handle the callback after Google authentication
router.get('/auth/google/callback', GoogleCallback);

export default router;
