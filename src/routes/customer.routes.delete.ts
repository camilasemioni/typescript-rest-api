import express from 'express';
import { deleteCustomerById } from '../controllers/customer.controller.delete';

const router = express.Router();

router.delete('/:id', deleteCustomerById);

export default router;
