import express from 'express';

import { loginAdminController } from '../controllers/auth/login.controller';
import { logoutController } from '../controllers/auth/logout.controller';
import { registerAdminController } from '../controllers/auth/register.controller';

const router = express.Router();

router.post('/login', loginAdminController);
router.post('/register', registerAdminController);
router.get('/logout', logoutController);

export default router;
