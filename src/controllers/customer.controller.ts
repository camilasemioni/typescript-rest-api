import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import customerModel from '../models/customer.model';
import Queries from '../interfaces/queries.interface';

export const getAllCustomers = async (_: Request, res: Response) => {
    const { sort, fields } = _.query;

    const fieldNames = [
        'name',
        'cpf',
        'birthday',
        'email',
        'cep',
        'uf',
        'city',
        'address',
        'number',
        'complement',
        'neighborhood',
    ];
    const caseInsensitiveFieldNames = [
        'name',
        'email',
        'city',
        'address',
        'complement',
        'neighborhood',
    ];

    const queryObject: Queries = {};

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

    let result = customerModel.find(queryObject);
    const count = await result.countDocuments();
    if (count === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({});
    }

    if (sort) {
        const sortList = (sort as string).split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('name');
    }

    if (fields) {
        const fieldsList = (fields as string).split(',').join(' ');

        if (fieldsList.includes('password')) {
            return res.status(StatusCodes.BAD_REQUEST).json({});
        }

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
};

export const getSingleCustomer = async (
    _: Request,
    res: Response,
) => {
    res.send('Get single customer');
};
