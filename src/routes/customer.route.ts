import { Router } from 'express';

import {
    getAllCustomers,
    getSingleCustomer,
} from '../controllers/customer.controller';

const router = Router();

router.route('/').get(getAllCustomers);
router.route('/:id').get(getSingleCustomer);

export default router;
