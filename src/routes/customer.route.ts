import { createClient } from '../controllers/customer.controller';
import { Router } from 'express';
import { getAllCustomers } from '../controllers/customer.controller';

const router = Router();

router.route('/client').get(getAllCustomers).post(createClient);

export default router;
