import { removePassword } from '../utils/remove-password.util';
import CustomerModel from '../models/customer.model';
import axios from 'axios';
import BadRequestError from '../errors/bad-request.error';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { hash } from 'bcrypt';

export const createCustomer = async (req: Request, res: Response) => {
    const payload = req.body;
    const addressUrl = `https://viacep.com.br/ws/${payload.cep}/json`;
    const viaCepResponse = (await axios.get(addressUrl)).data;

    const { cep, logradouro, complemento, bairro, localidade, uf } =
        viaCepResponse;

    const { password } = payload;
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    if (
        JSON.stringify(viaCepResponse) ===
        JSON.stringify({ erro: true })
    ) {
        throw new BadRequestError('CEP does not exist');
    }

    payload.cep = cep;

    const address = {
        uf: uf,
        city: localidade,
        address: logradouro || 'Not informed',
        complement: complemento || 'Not informed',
        neighborhood: bairro || 'Not informed',
    };

    payload.password = hashedPassword;

    const customer = { ...payload, ...address };
    const newCustomer = await CustomerModel.create(customer);
    const noPasswordCustomer = removePassword(newCustomer);

    res.status(StatusCodes.CREATED).json(noPasswordCustomer);
};
