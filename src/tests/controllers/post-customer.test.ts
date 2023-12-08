import request from 'supertest';
import app from '../../app';
//import { StatusCodes } from 'http-status-codes';
// import formatCPF from '../../utils/format-cpf';

import { createCustomer } from '../../controllers/post-customer.controller';

describe('createCustomer()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Given the customer's data", () => {
        it('Should respond with a 200 status code', async () => {
            (createCustomer as jest.Mock).mockImplementation(
                (req, res) => {
                    res.status(201).json(req.body);
                },
            );

            const res = await request(app)
                .post('/api/v1/client')
                .send({
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
    });
});

// const axios = {
//     get: jest.fn(() =>
//         Promise.resolve({
//             data: {
//                 uf: 'UF',
//                 localidade: 'City',
//                 logradouro: 'address',
//                 complemento: 'address',
//                 bairro: 'address',
//             },
//         }),
//     ),
// };

// jest.mock('../utils/customer.util');
// jest.mock('../utils/viacep.util');
// jest.mock('../models/customer.model');
// jest.mock('bcrypt');
// jest.mock('../utils/format-cpf');
