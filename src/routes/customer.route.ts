import { deleteCustomer } from '../controllers/delete-customer.controller';
import {
    getAllCustomers,
    getSingleCustomer,
} from '../controllers/get-customer.controller';
import { createCustomer } from '../controllers/post-customer.controller';
import { Router } from 'express';

const router = Router();

router.route('/client').get(getAllCustomers).post(createCustomer);
router.route('/client/:id').get(getSingleCustomer).delete(deleteCustomer);

export default router;
