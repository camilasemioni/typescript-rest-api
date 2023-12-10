import { Request, Response } from 'express';
import CustomerModel from '../models/customer.model';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../errors/not-found.error';
import BadRequestError from '../errors/bad-request.error';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { formatViaCep } from '../utils/viacep.util';

export const updateCustomer = async (req: Request, res: Response) => {
    const customerId = req.params.id;
    const payload = req.body;

    const { name, cep, password, complement, cpf, email } = payload;

    const existingCustomer = await CustomerModel.findById(customerId);

    if (!existingCustomer) {
        throw new NotFoundError('Customer not found');
    }

    existingCustomer.name = name || existingCustomer.name;

    if (cpf && cpf !== existingCustomer.cpf) {
        throw new BadRequestError('Not allowed to update CPF');
    }

    if (email && email !== existingCustomer.email) {
        throw new BadRequestError('Not allowed to update email');
    }

    if (cep && existingCustomer.cep !== cep) {
        const cepPayload = cep.replace(/[^0-9]/g, '');

        formatViaCep(cepPayload);
        const addressUrl = `https://viacep.com.br/ws/${cepPayload}/json`;
        const viaCepResponse = (await axios.get(addressUrl)).data;

        if (
            JSON.stringify(viaCepResponse) ===
            JSON.stringify({ erro: true })
        ) {
            throw new BadRequestError('CEP does not exist');
        }

        const { uf, localidade, bairro, logradouro } = viaCepResponse;

        existingCustomer.cep = cep;
        existingCustomer.uf = uf || '';
        existingCustomer.city = localidade || '';
        existingCustomer.neighborhood = bairro || '';
        existingCustomer.address = logradouro || '';
    }

    const validationError = existingCustomer.validateSync();
    if (validationError) {
        throw validationError;
    }

    existingCustomer.number =
        payload.number || existingCustomer.number;
    existingCustomer.complement = complement || 'Not informed';

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingCustomer.password = hashedPassword;
    }

    await existingCustomer.save();

    res.status(StatusCodes.OK).json({
        message: 'Customer updated successfully',
    });
};
