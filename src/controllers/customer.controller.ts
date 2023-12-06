import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import customerModel from '../models/customer.model';
import Queries from '../interfaces/queries.interface';
import {
    fieldNames,
    caseInsensitiveFieldNames,
} from '../utils/query-fields.util';
import CustomAPIError from '../errors/custom-error-class.error';
import BadRequestError from '../errors/bad-request.error';

export const getAllCustomers = async (_: Request, res: Response) => {
    try {
        const { sort, fields } = _.query;

        let fieldsList;
        if (fields) {
            fieldsList = (fields as string).split(',').join(' ');

            if (fieldsList.includes('password')) {
                throw new BadRequestError('Password access denied');
            }
        }

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

        const count = await customerModel.countDocuments();
        if (count === 0) {
            return res.status(StatusCodes.OK).json({});
        }

        let result = customerModel.find(queryObject);

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
        if (error instanceof CustomAPIError) {
            res.status(error.statusCode).json({
                message: error.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Unknown error',
            });
        }
    }
};
import { Request, Response } from 'express';
import Customer from '../models/customer.model';
import axios from 'axios';
import BadRequestError from '../errors/bad-request.error';
import CustomAPIError from '../errors/custom-error-class.error';
import { StatusCodes } from 'http-status-codes';

function formatViaCep(address: string) {
    if (address.length !== 8) {
        throw new BadRequestError('Invalid CEP format');
    }
}

export const createClient = async (req: Request, res: Response) => {
    try {
        const client = req.body;
        const cep = req.body.cep.replace(/[^0-9]/, '');
        formatViaCep(cep);
        const addressUrl = `https://viacep.com.br/ws/${cep}/json`;
        const viaCepResponse = (await axios.get(addressUrl)).data;
        const { logradouro, complemento, bairro, localidade, uf } =
            viaCepResponse;

        if (
            JSON.stringify(viaCepResponse) ===
            JSON.stringify({ erro: true })
        ) {
            throw new BadRequestError('CEP does not exist');
        }

        const address = {
            uf: uf,
            city: localidade,
            address: logradouro || 'Not informed',
            complement: complemento || 'Not informed',
            neighborhood: bairro || 'Not informed',
        };

        const customer = { ...client, ...address };

        const newCustomer = await Customer.create(customer);

        res.status(StatusCodes.OK).json(newCustomer);
    } catch (error) {
        if (error instanceof CustomAPIError) {
            res.status(error.statusCode).json({
                message: error.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Unknown error',
            });
        }
    }
};
