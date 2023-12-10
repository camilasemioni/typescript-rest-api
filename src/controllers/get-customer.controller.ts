import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomerModel from '../models/customer.model';
import IQueries from '../interfaces/queries.interface';
import {
    fieldNames,
    caseInsensitiveFieldNames,
    allowedQueries,
    validateQueries,
} from '../utils/query-fields.util';
import BadRequestError from '../errors/bad-request.error';
import NotFoundError from '../errors/not-found.error';

export const getAllCustomers = async (_: Request, res: Response) => {
    const count = await CustomerModel.countDocuments();
    if (count === 0) {
        return res.status(StatusCodes.OK).json({});
    }

    const queryKeys: string[] = Object.keys(_.query);
    if (
        !queryKeys.every((key: string) =>
            allowedQueries.includes(key),
        )
    ) {
        throw new BadRequestError('Invalid query');
    }

    const queryObject: IQueries = {};

    fieldNames.map((field) => {
        if (_.query[field]) {
            queryObject[field] = {
                $regex: _.query[field] as string,
            };
            if (caseInsensitiveFieldNames.includes(field)) {
                queryObject[field].$options = 'i';
            }
        }
    });
    let result = CustomerModel.find(queryObject);

    const { sort, fields } = _.query;

    if (sort) {
        result = result.sort(
            validateQueries(sort as string | string[]),
        );
    } else {
        result = result.sort('name');
    }

    if (fields) {
        result = result.select(
            validateQueries(fields as string | string[]),
        );
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
};

export const getSingleCustomer = async (
    _: Request,
    res: Response,
) => {
    const customer = await CustomerModel.findById(_.params.id);

    if (!customer) {
        throw new NotFoundError(
            `No customer with id '${_.params.id}'`,
        );
    }

    res.status(StatusCodes.OK).json(customer);
};
