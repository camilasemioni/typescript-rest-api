import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import customerModel from '../models/customer.model';

export const getAllCustomers = async (_: Request, res: Response) => {
    const customerList = await customerModel
        .find({})
        .select('-password');

    if (customerList.length === 0) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ code: 404, message: 'Not Found' });
    }

    res.status(StatusCodes.OK).json(customerList);
};

export const getSingleCustomer = async (
    _: Request,
    res: Response,
) => {
    res.send('Get single customer');
};
