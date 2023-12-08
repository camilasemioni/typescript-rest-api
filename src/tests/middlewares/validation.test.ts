import request from 'supertest';
import app from '../../app';
import { createCustomer } from '../../controllers/post-customer.controller';

jest.mock('../../controllers/post-customer.controller');

describe('POST /client', () => {
    it('should validate the request body and create a new customer', async () => {
        (createCustomer as jest.Mock).mockImplementation(
            (req, res) => {
                res.status(201).json(req.body);
            },
        );

        const res = await request(app).post('/api/v1/client').send({
            name: 'John Doe',
            cpf: '123.456.789-00',
            password: 'Password123',
            birthday: '01/01/2000',
            email: 'john.doe@example.com',
            cep: '12345-678',
            number: '123',
        });

        expect(res.body).not.toHaveProperty('error');
        expect(res.body).toHaveProperty('name');
        expect(res.body.name).toEqual('John Doe');
    });

    it('should return 400 if the request body is invalid', async () => {
        const res = await request(app).post('/api/v1/client').send({
            name: 'John Doe',
            cpf: 'invalid cpf',
            password: 'Password123',
            birthday: '01/01/2000',
            email: 'john.doe@example.com',
            cep: '12345-678',
            number: '123',
        });

        expect(res.body).toHaveProperty('error');
        expect(res.statusCode).toEqual(400);
    });
});
