import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomerModel from '../models/customer.model';
import IQueries from '../interfaces/queries.interface';
import {
    fieldNames,
    caseInsensitiveFieldNames,
} from '../utils/query-fields.util';
import BadRequestError from '../errors/bad-request.error';
import NotFoundError from '../errors/not-found.error';
import errorHandler from '../utils/error-handler.util';

export const getAllCustomers = async (_: Request, res: Response) => {
    try {
        const { sort, fields } = _.query;

        let fieldsList;
        if (fields) {
            fieldsList = (fields as string).split(',').join(' ');

            if (fieldsList.includes('password')) {
                throw new BadRequestError('Password access denied');
            }
            if (!fieldNames.includes(fieldsList)) {
                throw new BadRequestError('Invalid query');
            }
        }

        const queryObject: IQueries = {};

        fieldNames.forEach((field) => {
            if (_.query[field]) {
                queryObject[field] = {
                    $regex: _.query[field] as string,
                };
                if (caseInsensitiveFieldNames.includes(field)) {
                    queryObject[field].$options = 'i';
                }
            }
        });

        const count = await CustomerModel.countDocuments();
        if (count === 0) {
            return res.status(StatusCodes.OK).json({});
        }

        let result = CustomerModel.find(queryObject);

        if (sort) {
            const sortList = (sort as string).split(',').join(' ');
            result = result.sort(sortList);
        } else {
            result = result.sort('name');
        }

        if (fieldsList) {
            result = result.select(fieldsList);
        }

        const page = +_.query.page! || 1;
        const limit = +_.query.limit! || 5;
        const skip = (page - 1) * limit;

        result = result.skip(skip).limit(limit);

        const customerList = await result;

        res.status(StatusCodes.OK).json({
            nbHits: customerList.length,
            customerList,
        });
    } catch (error) {
        errorHandler(error, res);
    }
};

export const getSingleCustomer = async (
    _: Request,
    res: Response,
) => {
    try {
        const customer = await CustomerModel.findById(_.params.id);

        if (!customer) {
            throw new NotFoundError(
                `No customer with id '${_.params.id}'`,
            );
        }

        res.status(StatusCodes.OK).json(customer);
    } catch (error) {
        errorHandler(error, res);
    }
};
