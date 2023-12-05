import { Request, Response } from 'express';
import mongoose from 'mongoose';
import CustomerModel from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';

export const deleteCustomer = async (
    req: Request,
    res: Response,
) => {
    try {
        const customerId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: 'invalid client ID' });
        }

        await CustomerModel.findByIdAndDelete(customerId);

        res.status(StatusCodes.NO_CONTENT).json({ message: 'success' });
    } catch (error) {
        console.log(error);
    }
};
