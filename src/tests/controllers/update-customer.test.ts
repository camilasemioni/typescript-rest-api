import request from 'supertest';
import app from '../../app';
import CustomerModel from '../../models/customer.model';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import Joi from 'joi';
import { updateCustomerSchemaValitation } from '../../validations/joi.validation';

jest.mock('../../models/customer.model');

describe('updateCustomer()', () => {
    const validCustomerId = new ObjectId('65722fe08539f8a9ec3877a8');
    const updateEndpoint = `/api/v1/client/${validCustomerId}`;

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should respond with 200 OK for a valid update', async () => {
        const updatedData = {
            name: 'Novo nome',
            birthday: '23/04/1997',
            password: 'NovaSenha123',
            cep: '87030-110',
            number: '13',
        };

        const existingCustomer = new CustomerModel({
            _id: validCustomerId,
            cpf: '123.456.789-01',
            email: 'troy.bolton@email.com',
        });

        jest.spyOn(CustomerModel, 'findById').mockResolvedValue(
            existingCustomer,
        );

        jest.spyOn(axios, 'get').mockResolvedValue({
            data: {
                uf: 'PR',
                localidade: 'Maringá',
                bairro: 'Zona 7',
                logradouro: 'Rua Clementina Basseto',
                complemento: 'Not informed',
            },
        });

        const response = await request(app)
            .put(updateEndpoint)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Novo nome');
    });

    test('should not update email or cpf', async () => {
        const updatedData = {
            email: 'new.email@example.com',
        };

        const existingCustomer = new CustomerModel({
            _id: validCustomerId,
            cpf: '123.456.789-01',
            email: 'troy.bolton@email.com',
        });

        jest.spyOn(CustomerModel, 'findById').mockResolvedValue(
            existingCustomer,
        );

        const response = await request(app)
            .put(updateEndpoint)
            .send(updatedData);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 401);
        expect(response.body).toHaveProperty(
            'message',
            'Email cannot be changed',
        );
    });

    test('should handle invalid CEP correctly', async () => {
        const updatedData = {
            cep: '12345-678',
        };

        const existingCustomer = new CustomerModel({
            _id: validCustomerId,
            cpf: '123.456.789-01',
            email: 'troy.bolton@email.com',
        });

        jest.spyOn(CustomerModel, 'findById').mockResolvedValue(
            existingCustomer,
        );
        jest.spyOn(axios, 'get').mockResolvedValue({
            data: { erro: true },
        });

        const response = await request(app)
            .put(updateEndpoint)
            .send(updatedData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 400);
        expect(response.body).toHaveProperty(
            'message',
            'CEP does not exist',
        );
    });

    test('should update name only', async () => {
        const updatedData = {
            name: 'New Name',
        };

        const existingCustomer = new CustomerModel({
            _id: validCustomerId,
            cpf: '123.456.789-01',
            email: 'troy.bolton@email.com',
        });

        jest.spyOn(CustomerModel, 'findById').mockResolvedValue(
            existingCustomer,
        );

        const response = await request(app)
            .put(updateEndpoint)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'New Name');
    });

    test('should update address only', async () => {
        const updatedData = {
            cep: '01310-930',
            number: '500',
        };

        const existingCustomer = new CustomerModel({
            _id: validCustomerId,
            cpf: '123.456.789-01',
            email: 'troy.bolton@email.com',
        });

        jest.spyOn(CustomerModel, 'findById').mockResolvedValue(
            existingCustomer,
        );

        jest.spyOn(axios, 'get').mockResolvedValue({
            data: {
                uf: 'SP',
                localidade: 'São Paulo',
                bairro: 'Bela Vista',
                logradouro: 'Avenida Paulista',
                complemento: '2100',
            },
        });

        const response = await request(app)
            .put(updateEndpoint)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('cep', '01310-930');
        expect(response.body).toHaveProperty('number', '500');
        expect(response.body).toHaveProperty('uf', 'SP');
        expect(response.body).toHaveProperty('city', 'São Paulo');
        expect(response.body).toHaveProperty(
            'neighborhood',
            'Bela Vista',
        );
        expect(response.body).toHaveProperty(
            'address',
            'Avenida Paulista',
        );
        expect(response.body).toHaveProperty('complement', '2100');
    });

    test('should return error for invalid password format', async () => {
        const updatedData = {
            password: 'weakpassword',
        };

        const existingCustomer = new CustomerModel({
            _id: validCustomerId,
            cpf: '123.456.789-01',
            email: 'troy.bolton@email.com',
        });

        jest.spyOn(CustomerModel, 'findById').mockResolvedValue(
            existingCustomer,
        );

        jest.spyOn(axios, 'get').mockResolvedValue({
            data: {
                uf: 'PR',
                localidade: 'Maringá',
                bairro: 'Zona 7',
                logradouro: 'Rua Clementina Basseto',
                complemento: 'Not informed',
            },
        });

        const response = await request(app)
            .put(updateEndpoint)
            .send(updatedData);

        const { error } = Joi.object({
            password:
                updateCustomerSchemaValitation.extract('password'),
        }).validate({
            password: updatedData.password,
        });

        const passwordValidationError = error?.details[0].message;

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 400);
        expect(response.body).toHaveProperty(
            'message',
            passwordValidationError,
        );
    });

});
