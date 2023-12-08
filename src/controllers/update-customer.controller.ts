import { Request, Response } from 'express';
import { CustomerModel } from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../errors/not-found.error';
import errorHandler from '../utils/error-handler.util';
import { validateMiddleware } from '../middlewares/validation.middleware';
import { updateCustomerSchemaValitation } from '../validations/joi.validation';
import bcrypt from 'bcrypt';

const validateUpdateCustomer = validateMiddleware(
    updateCustomerSchemaValitation,
);

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const customerId = req.params.id;
        const payload = req.body;
        console.log(payload);

        await validateUpdateCustomer(req, res, () => {});

        const {
            name,
            cep,
            uf,
            city,
            address,
            number,
            complement,
            neighborhood,
            password,
        } = payload;

        const existingCustomer =
            await CustomerModel.findById(customerId);
        console.log(existingCustomer);

        if (!existingCustomer) {
            throw new NotFoundError('Customer not found');
        }

        existingCustomer.name = name || existingCustomer.name;
        existingCustomer.cep = cep || existingCustomer.cep;
        existingCustomer.uf = uf || existingCustomer.uf;
        existingCustomer.city = city || existingCustomer.city;
        existingCustomer.address = address || existingCustomer.address;
        existingCustomer.number = number || existingCustomer.number;
        existingCustomer.complement = complement || existingCustomer.complement;
        existingCustomer.neighborhood = neighborhood || existingCustomer.neighborhood;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingCustomer.password = hashedPassword;
        }

        await existingCustomer.save();

        res.status(StatusCodes.OK).json({
            message: 'Customer updated successfully',
        });
    } catch (error) {
        errorHandler(error, res);
    }
};
