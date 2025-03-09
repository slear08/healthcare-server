import { Router } from 'express';

import { logoutController } from '../controllers/auth/logout.controller';
import { passportSuccessController } from '../controllers/auth/passport_success.controller';
import { GoogleCallback } from '../passport/service/google_callback.service';
import { GoogleLogin } from '../passport/service/google_login.service';

const router = Router();

// Route to initiate Google login
router.get('/auth/google', GoogleLogin);

// Route to handle the callback after Google authentication
router.get('/auth/google/callback', GoogleCallback);

router.get('/login/success', passportSuccessController);

router.get('/auth/logout', logoutController);

export default router;
