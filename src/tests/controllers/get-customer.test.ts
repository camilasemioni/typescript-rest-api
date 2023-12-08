import request from 'supertest';
import { app, server } from '../../app';
import CustomerModel from '../../models/customer.model';
import mongoose from 'mongoose';

jest.mock('../../models/customer.model', () => {
    return {
        countDocuments: jest.fn(),
        find: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
        }),
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

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual({});
    });

    test('should return correct format if the collection is not empty', async () => {
        const customerList = [
            { name: 'Customer 1' },
            { name: 'Customer 2' },
        ];

        (CustomerModel.find as jest.Mock).mockReturnValue({
            ...CustomerModel.find(),
            limit: jest.fn().mockImplementation(() => customerList),
        });

        const result = await request(app).get('/api/v1/client');

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual({
            nbHits: customerList.length,
            customerList,
        });
    });

    test('should throw an error when queried for password', async () => {
        const result = await request(app).get(
            '/api/v1/client?fields=password',
        );

        expect(result.statusCode).toEqual(400);
        expect(result.body.message).toEqual('Password access denied');
    });

    test('should throw an error when fields query is not valid', async () => {
        const result = await request(app).get(
            '/api/v1/client?fields=cbf',
        );

        expect(result.statusCode).toEqual(400);
        expect(result.body.message).toEqual('Invalid query');
    });

    test('should throw an error when query name is not valid', async () => {
        const result = await request(app).get(
            '/api/v1/client?invalid=yes',
        );

        expect(result.statusCode).toEqual(400);
        expect(result.body.message).toEqual('Invalid query');
    });

    afterAll((done) => {
        mongoose.connection.close().then(() => {
            if (server) {
                server.close(() => {
                    done();
                });
            } else {
                done();
            }
        });
    });
});
