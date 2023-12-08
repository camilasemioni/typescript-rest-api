import { Request, Response } from 'express';
import { CustomerModel } from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';
import errorHandler from '../utils/error-handler.util';
import BadRequestError from '../errors/bad-request.error';
import NotFoundError from '../errors/not-found.error';

export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        const customerId = req.params.id;

        if (!customerId) {
            throw new BadRequestError('Invalid customer ID');
        }
        const deletedCustomer =
            await CustomerModel.findByIdAndDelete(customerId);

        if (!deletedCustomer) {
            throw new NotFoundError('Customer not found');
        }
        res.status(StatusCodes.NO_CONTENT).json({
            message: 'success',
        });
    } catch (error) {
        errorHandler(error, res);
    }
};
