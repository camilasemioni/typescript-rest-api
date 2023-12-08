import request from 'supertest';
import app from '../../app';
import { CustomerModel } from '../../models/customer.model';

jest.mock('../../models/customer.model');

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

    it('should create a new customer with correct data', async () => {
        const mockViaCepResponse = {
            uf: 'SP',
            city: 'São Paulo',
            address: 'Praça da Sé',
            complement: 'lado ímpar',
            neighborhood: 'Sé',
        };

        (CustomerModel.create as jest.Mock).mockResolvedValue(
            mockViaCepResponse,
        );

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

        const res = await request(app)
            .post('/api/v1/client')
            .send(mockData);

        res.body = { ...mockData, ...mockViaCepResponse };

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(completeCustomer);
    });
});
