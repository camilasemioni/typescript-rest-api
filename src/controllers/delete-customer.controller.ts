import { Request, Response } from 'express';
import CustomerModel from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../errors/not-found.error';
import mongoose from 'mongoose';

export const deleteCustomer = async (req: Request, res: Response) => {
    const customerId = mongoose.Types.ObjectId.isValid(req.params.id) ? req.params.id : null;

    if(!customerId) {
        throw new mongoose.Error.CastError('ObjectId', `${req.params.id}`, '_id');
    }

    const deletedCustomer =
        await CustomerModel.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
        throw new NotFoundError('Customer not found');
    }
    res.status(StatusCodes.NO_CONTENT).json({
        message: 'success',
    });  
};
