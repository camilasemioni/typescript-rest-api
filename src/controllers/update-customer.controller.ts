import { Request, Response } from 'express';
import customerModel from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../errors/not-found.error';
import errorHandler from '../utils/error-handler.util';
import { updateCustomerSchemaValitation } from '../middlewares/validation.middleware';

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const customerId = req.params.id;
        const payload = req.body;
        console.log(payload)

        await updateCustomerSchemaValitation.validateAsync(payload);

        const {
            name,
            cep,
            uf,
            city,
            address,
            number,
            complement,
            neighborhood,
        } = payload;

        const existingCustomer =
            await customerModel.findById(customerId);
        console.log(existingCustomer);

        if (!existingCustomer) {
            throw new NotFoundError('Customer not found');
        }

        existingCustomer.name = name || existingCustomer.name;
        existingCustomer.cep = cep || existingCustomer.cep;
        existingCustomer.uf = uf || existingCustomer.uf;
        existingCustomer.city = city || existingCustomer.city;
        existingCustomer.address =
            address || existingCustomer.address;
        existingCustomer.number = number || existingCustomer.number;
        existingCustomer.complement =
            complement || existingCustomer.complement;
        existingCustomer.neighborhood =
            neighborhood || existingCustomer.neighborhood;

        await existingCustomer.save();

        res.status(StatusCodes.OK).json({
            message: 'Customer updated successfully',
        });
    } catch (error) {
        errorHandler(error, res);
    }
};
