import request from 'supertest';
import { app, server } from '../../app';
import CustomerModel from '../../models/customer.model';
import mongoose from 'mongoose';

jest.mock('../../models/customer.model', () => ({
    countDocuments: jest.fn(),
    select: jest.fn(),
    find: jest.fn(),
}));

describe('getAllCustomers()', () => {
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
            skip: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockImplementation(() => customerList),
        });

        const result = await request(app).get('/api/v1/client');

        console.log(result.body);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual({
            nbHits: customerList.length,
            customerList,
        });
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
