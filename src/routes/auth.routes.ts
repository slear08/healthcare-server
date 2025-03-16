import express from 'express';

import { changePasswordController } from '../controllers/auth/change_password.controller';
import { loginAdminController } from '../controllers/auth/login.controller';
import { logoutController } from '../controllers/auth/logout.controller';
import { registerAdminController } from '../controllers/auth/register.controller';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';

const router = express.Router();

router.post('/login', loginAdminController);
router.post('/register', registerAdminController);
router.post('/logout', logoutController);
router.put('/change-password', AuthMiddleware, changePasswordController);

export default router;
