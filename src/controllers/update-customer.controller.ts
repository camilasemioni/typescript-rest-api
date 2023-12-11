import { Request, Response } from 'express';
import CustomerModel from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../errors/not-found.error';
import BadRequestError from '../errors/bad-request.error';
import bcrypt from 'bcrypt';
import axios from 'axios';
import UnauthorizedError from '../errors/unauthorized.error';
import { removePassword } from '../utils/customer.util';

export const updateCustomer = async (req: Request, res: Response) => {
    const customerId = req.params.id;
    const payload = req.body;

    const { name, cpf, email, cep, password, birthday } = payload;

    if (cpf || email) {
        throw new UnauthorizedError(
            `${cpf ? 'CPF' : 'Email'} cannot be changed`,
        );
    }

    const existingCustomer = await CustomerModel.findById(customerId);

    if (!existingCustomer) {
        throw new NotFoundError('Customer not found');
    }

    existingCustomer.name = name || existingCustomer.name;

    if (cep && existingCustomer.cep !== cep) {
        const addressUrl = `https://viacep.com.br/ws/${cep}/json`;
        const viaCepResponse = (await axios.get(addressUrl)).data;

        if (
            JSON.stringify(viaCepResponse) ===
            JSON.stringify({ erro: true })
        ) {
            throw new BadRequestError('CEP does not exist');
        }

        const { uf, localidade, bairro, logradouro, complemento } =
            viaCepResponse;

        existingCustomer.cep = cep;
        existingCustomer.uf = uf;
        existingCustomer.city = localidade || 'Not informed';
        existingCustomer.neighborhood = bairro || 'Not informed';
        existingCustomer.address = logradouro || 'Not informed';
        existingCustomer.complement = complemento || 'Not informed';
    }

    existingCustomer.number =
        payload.number || existingCustomer.number;

    existingCustomer.birthday = birthday || existingCustomer.birthday;

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingCustomer.password = hashedPassword;
    }

    await existingCustomer.save();

    const noPasswordCustomer = removePassword(existingCustomer);
    res.status(StatusCodes.OK).json(noPasswordCustomer);
};
