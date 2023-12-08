import { removePassword } from '../utils/customer.util';
import { formatViaCep } from '../utils/viacep.util';
import { CustomerModel } from '../models/customer.model';
import axios from 'axios';
import BadRequestError from '../errors/bad-request.error';
import { StatusCodes } from 'http-status-codes';
import errorHandler from '../utils/error-handler.util';
import { Request, Response } from 'express';
import { hash } from 'bcrypt';
import formatCPF from '../utils/format-cpf';

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const cepPayload = payload.cep.replace(/[^0-9]/g, '');
        const cpfPayload = payload.cpf.replace(/[^0-9]/g, '');
        const formattedCPF = formatCPF(cpfPayload);
        payload.cpf = formattedCPF;
        formatViaCep(cepPayload);
        const addressUrl = `https://viacep.com.br/ws/${cepPayload}/json`;
        const viaCepResponse = (await axios.get(addressUrl)).data;

        const {
            cep,
            logradouro,
            complemento,
            bairro,
            localidade,
            uf,
        } = viaCepResponse;

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
        res.status(StatusCodes.OK).json(noPasswordCustomer);
    } catch (error) {
        errorHandler(error, res);
    }
};
