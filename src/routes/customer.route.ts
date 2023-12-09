import { deleteCustomer } from '../controllers/delete-customer.controller';
import {
    getAllCustomers,
    getSingleCustomer,
} from '../controllers/get-customer.controller';
import { createCustomer } from '../controllers/post-customer.controller';
import { Router } from 'express';
import { updateCustomer } from '../controllers/update-customer.controller';
import {
    createCustomerSchemaValidation,
    updateCustomerSchemaValitation,
} from '../validations/joi.validation';
import { validateMiddleware } from '../middlewares/validation.middleware';

const router = Router();

router
    .route('/client')
    .get(getAllCustomers)
    .post(
        validateMiddleware(createCustomerSchemaValidation),
        createCustomer,
    );

router
    .route('/client/:id')
    .get(getSingleCustomer)
    .delete(deleteCustomer)
    .put(
        validateMiddleware(updateCustomerSchemaValitation),
        updateCustomer,
    );

export default router;
