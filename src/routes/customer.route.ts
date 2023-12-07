import express from 'express';
import { createClient } from '../controllers/customer.controller';

const router = express.Router();

router.route('/client').post(createClient);

export default router;
