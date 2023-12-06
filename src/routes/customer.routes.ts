import express from 'express';
import { updateCustomer } from '../controllers/customer.controller';

const router = express.Router();

router
    .route('/client/:id')
    .put(updateCustomer)
    .patch(updateCustomer);

export default router;
