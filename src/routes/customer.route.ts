import express from 'express';
import { deleteCustomer } from '../controllers/delete-customer.controller';

const router = express.Router();

router.delete('/client/:id', deleteCustomer);

export default router;
