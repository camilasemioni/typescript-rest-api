
import express from 'express';
import { updateCustomerById } from '../controllers/customer.controller';

const router = express.Router();

router.put('/client/:id', updateCustomerById);
router.patch('/client/:id', updateCustomerById);

export default router;


