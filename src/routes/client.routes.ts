import express from 'express';
import { createClient } from '../controllers/client.controller';

const router = express.Router();

router.route('/client').post(createClient);

export default router;
