import request from 'supertest';
import app from '../../app';
import CustomerModel from '../../models/customer.model';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../models/customer.model', () => {
    return {
        countDocuments: jest.fn(),
        find: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
        }),
        findById: jest.fn(),
    };
});

describe('getAllCustomers()', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should return an empty json if the collection is empty', async () => {
        (
            CustomerModel.countDocuments as jest.Mock
        ).mockResolvedValueOnce(0);

        const result = await request(app).get('/api/v1/client');

        expect(result.statusCode).toEqual(StatusCodes.OK);
        expect(result.body).toEqual({});
    });

    test('should return correct format if the collection is not empty', async () => {
        const clients = [
            { name: 'Customer 1' },
            { name: 'Customer 2' },
        ];

        (CustomerModel.find as jest.Mock).mockReturnValue({
            ...CustomerModel.find(),
            limit: jest.fn().mockImplementation(() => clients),
        });

        const result = await request(app).get('/api/v1/client');

        expect(result.statusCode).toEqual(StatusCodes.OK);
        expect(result.body).toEqual({
            numberOfClients: clients.length,
            clients,
        });
    });

    test('should throw an error when fields query is not valid', async () => {
        const result = await request(app).get(
            '/api/v1/client?fields=cbf',
        );

        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(result.body.message).toEqual('Invalid query');
    });

    test('should throw an error when query name is not valid', async () => {
        const result = await request(app).get(
            '/api/v1/client?invalid=yes',
        );

        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(result.body.message).toEqual('Invalid query');
    });
});

describe('getSingleCustomer', () => {
    function validateId(result: request.Response, userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            result.statusCode = StatusCodes.BAD_REQUEST;
        }
    }

    test('should return the user if id is valid', async () => {
        const user = {
            id: '6570ba4e2c13eb5171d4fa3e',
            name: 'Customer 1',
        };

        (CustomerModel.findById as jest.Mock).mockImplementationOnce(
            () => user,
        );

        const result = await request(app).get(
            `/api/v1/client/${user.id}`,
        );

        expect(result.body).toEqual(user);
    });

    test('should return a status code of 404 if user valid but not found', async () => {
        const validUserId = '6570ba4e2c13eb5171d4fa3e';

        const result = await request(app).get(
            `/api/v1/client/${validUserId}`,
        );

        validateId(result, validUserId);

        expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });

    test('should return a status code of 400 if user is invalid', async () => {
        const invalidUserId = 'invalid';

        const result = await request(app).get(
            `/api/v1/client/${invalidUserId}`,
        );

        validateId(result, invalidUserId);

        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    test('should return a message if user is invalid', async () => {
        const invalidUserId = 'invalid';

        const result = await request(app).get(
            `/api/v1/client/${invalidUserId}`,
        );

        validateId(result, invalidUserId);

        expect(result.body.message).toEqual(
            `No customer with id '${invalidUserId}'`,
        );
    });
});
