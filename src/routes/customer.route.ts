import {
    getAllCustomers,
    getSingleCustomer,
    createClient,
} from '../controllers/customer.controller';
import { Router } from 'express';

const router = Router();

router.route('/client').get(getAllCustomers).post(createClient);
router.route('/client/:id').get(getSingleCustomer);

export default router;
