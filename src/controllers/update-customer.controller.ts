import { Request, Response } from 'express';
import mongoose from 'mongoose';
import customerModel from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const customerId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Invalid client ID',
            });
            return;
        }

        const {
            name,
            cep,
            uf,
            city,
            address,
            number,
            complement,
            neighborhood,
        } = req.body;

        const existingCustomer =
            await customerModel.findById(customerId);
        console.log(existingCustomer);

        if (!existingCustomer) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: 'Customer not found',
            });
            return;
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
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Internal Server Error',
        });
    }
};
