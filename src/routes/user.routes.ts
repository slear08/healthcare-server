import express from 'express';

import { getUserListController } from '../controllers/user/get_user_list.controller';

const router = express.Router();

router.get('/list', getUserListController); // Get all users with role USER

export default router;
