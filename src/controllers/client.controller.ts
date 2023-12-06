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

        res.status(200).json({ data: newCustomer });
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
