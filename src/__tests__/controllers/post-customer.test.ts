import request from 'supertest';
import app from '../../app';
import axios from 'axios';
import { hash } from 'bcrypt';
import CustomerModel from '../../models/customer.model';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../models/customer.model', () => {
    return {
        create: jest.fn((customer) => {
            return {
                _id: '6570ba4e2c13eb5171d4fa3e',
                ...customer,
            };
        }),
    };
});
jest.mock('bcrypt', () => {
    return {
        hash: jest.fn(),
    };
});
jest.mock('axios');

describe('createCustomer()', () => {
    const mockData = {
        name: 'John Doe',
        cpf: '123.456.789-00',
        birthday: '01/01/2000',
        email: 'john.doe@example.com',
        password: 'Password123',
        cep: '01001-000',
        number: '123',
    };

    test('should create a new customer with correct data', async () => {
        const mockViaCepResponse = {
            data: {
                cep: '01001-000',
                logradouro: 'Praça da Sé',
                complemento: 'lado ímpar',
                bairro: 'Sé',
                localidade: 'São Paulo',
                uf: 'SP',
                ibge: '3550308',
                gia: '1004',
                ddd: '11',
                siafi: '7107',
            },
        };

        const completeCustomer = {
            name: 'John Doe',
            cpf: '123.456.789-00',
            birthday: '01/01/2000',
            email: 'john.doe@example.com',
            password: 'Password123',
            cep: '01001-000',
            number: '123',
            uf: 'SP',
            city: 'São Paulo',
            address: 'Praça da Sé',
            complement: 'lado ímpar',
            neighborhood: 'Sé',
        };

        (axios.get as jest.Mock).mockReturnValue(mockViaCepResponse);

        (hash as jest.Mock).mockResolvedValueOnce('mocked-hash');

        CustomerModel.create(completeCustomer);

        const res = await request(app)
            .post('/api/v1/client')
            .send(mockData)
            .set('Accept', 'application/json');

        expect(res.body).not.toHaveProperty('password');
        expect(res.body).toHaveProperty('_id');
        expect(res.statusCode).toEqual(StatusCodes.CREATED);
    });
});
