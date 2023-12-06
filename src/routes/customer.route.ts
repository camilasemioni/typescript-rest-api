import { Router } from 'express';

import { getAllCustomers } from '../controllers/customer.controller';

const router = Router();

router.route('/').get(getAllCustomers);

export default router;
