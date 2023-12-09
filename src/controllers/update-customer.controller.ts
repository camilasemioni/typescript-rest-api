import { Request, Response } from 'express';
import { CustomerModel } from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../errors/not-found.error';
import errorHandler from '../utils/error-handler.util';
import { validateMiddleware } from '../middlewares/validation.middleware';
import { updateCustomerSchemaValitation } from '../validations/joi.validation';
import bcrypt from 'bcrypt';
import axios from 'axios';

const validateUpdateCustomer = validateMiddleware(
    updateCustomerSchemaValitation,
);

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const customerId = req.params.id;
        const payload = req.body;

        await validateUpdateCustomer(req, res, () => {});

        const { name, cep, password, complement } = payload;

        const existingCustomer =
            await CustomerModel.findById(customerId);

        if (!existingCustomer) {
            throw new NotFoundError('Customer not found');
        }

        existingCustomer.name = name || existingCustomer.name;

        if (cep && existingCustomer.cep !== cep) {
            const viaCepResponse = await axios.get(
                `https://viacep.com.br/ws/${cep}/json`,
            );

            const { uf, localidade, bairro, logradouro } =
                viaCepResponse.data;

            existingCustomer.cep = cep;
            existingCustomer.uf = uf || '';
            existingCustomer.city = localidade || '';
            existingCustomer.neighborhood = bairro || '';
            existingCustomer.address = logradouro || '';
        }

        const validationError = existingCustomer.validateSync();
        if (validationError) {
            throw validationError;
        }

        existingCustomer.number =
            payload.number || existingCustomer.number;
        existingCustomer.complement = complement || 'Not informed';

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
