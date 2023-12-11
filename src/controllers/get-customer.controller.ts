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

export const getAllCustomers = async (req: Request, res: Response) => {
    const count = await CustomerModel.countDocuments();
    if (count === 0) {
        return res.status(StatusCodes.OK).json({});
    }

    const queryKeys: string[] = Object.keys(req.query);
    if (
        !queryKeys.every((key: string) =>
            allowedQueries.includes(key),
        )
    ) {
        throw new BadRequestError('Invalid query');
    }

    const queryObject: IQueries = {};

    fieldNames.map((field) => {
        if (req.query[field]) {
            queryObject[field] = {
                $regex: req.query[field] as string,
            };
            if (caseInsensitiveFieldNames.includes(field)) {
                queryObject[field].$options = 'i';
            }
        }
    });
    let result = CustomerModel.find(queryObject);

    const { sort, fields } = req.query;

    if (sort) {
        result = result.sort(
            validateQueries(sort as string | string[]),
        );
    } else {
        result = result.sort('name');
    }

    if (fields) {
        result = result.select(
            validateQueries(fields as string | string[])!,
        );
    }
    if (req.query.page && req.query.limit) {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 5;
        const skip = (page - 1) * limit;

        result = result.skip(skip).limit(limit);
    }

    const clients = await result;

    const transformedClients = clients.map((client) => {
        const transformedClient = client.toObject();
        return {
            id: transformedClient._id,
            ...transformedClient,
        };
    });

    res.status(StatusCodes.OK).json({
        numberOfClients: clients.length,
        clients: transformedClients,
    });
};

export const getSingleCustomer = async (
    req: Request,
    res: Response,
) => {
    const customer = await CustomerModel.findById(req.params.id);

    if (!customer) {
        throw new NotFoundError(
            `No customer with id '${req.params.id}'`,
        );
    }

    const transformedClient = customer.toObject();
    const responseCustomer = {
        id: transformedClient._id,
        ...transformedClient,
    };

    res.status(StatusCodes.OK).json(responseCustomer);
};
