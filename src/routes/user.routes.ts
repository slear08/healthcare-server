import express from 'express';

import { getTotalUsersController } from '../controllers/dashboard/get_total_users.controller';
import { getUserListController } from '../controllers/user/get_user_list.controller';

const router = express.Router();

router.get('/list', getUserListController);
router.get('/total', getTotalUsersController);

export default router;
