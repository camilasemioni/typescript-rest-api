import {
    getAllCustomers,
    getSingleCustomer,
} from '../controllers/get-customer.controller';
import { createCustomer } from '../controllers/post-customer.controller';
import { Router } from 'express';
import { updateCustomer } from '../controllers/update-customer.controller';

const router = Router();

router.route('/client').get(getAllCustomers).post(createCustomer);
router
    .route('/client/:id')
    .get(getSingleCustomer)
    .put(updateCustomer);

export default router;
