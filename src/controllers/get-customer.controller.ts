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

export const getAllCustomers = async (_: Request, res: Response) => {
    const { sort, fields } = _.query;

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

    let fieldsList: string[] = [];

    if (fields) {
        fieldsList = (fields as string).split(',');

        if (fieldsList.includes('password')) {
            throw new BadRequestError('Password access denied');
        }

        if (
            !fieldsList.every((field: string) =>
                fieldNames.includes(field),
            )
        ) {
            throw new BadRequestError('Invalid query');
        }
    }

    const allowedQueries: string[] = [
        'limit',
        'page',
        'sort',
        'fields',
        ...fieldNames,
    ];
    const queryKeys: string[] = Object.keys(_.query);
    if (
        !queryKeys.every((key: string) =>
            allowedQueries.includes(key),
        )
    ) {
        throw new BadRequestError('Invalid query');
    }

    if (fieldsList.length) {
        result = result.select(fieldsList.join(' '));
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
