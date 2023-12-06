import { Request, Response } from 'express';
import mongoose from 'mongoose';
import CustomerModel from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';

export const updateCustomerById = async (req: Request, res: Response) => {
    try {
        const customerId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid client ID' });
        }

        const { name, cep, uf, city, address, number, complement, neighborhood } = req.body;

        const existingCustomer = await CustomerModel.findById(customerId);

        if (!existingCustomer) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Customer not found' });
        }

        existingCustomer.name = name || existingCustomer.name;
        existingCustomer.cep = cep || existingCustomer.cep;
        existingCustomer.uf = uf || existingCustomer.uf;
        existingCustomer.city = city || existingCustomer.city;
        existingCustomer.address = address || existingCustomer.address;
        existingCustomer.number = number || existingCustomer.number;
        existingCustomer.complement = complement || existingCustomer.complement;
        existingCustomer.neighborhood = neighborhood || existingCustomer.neighborhood;

        await existingCustomer.save();

        res.status(StatusCodes.OK).json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};
