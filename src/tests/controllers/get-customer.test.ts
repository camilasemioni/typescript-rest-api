import request from 'supertest';
import { app, server } from '../../app';
import CustomerSchema from '../../models/customer.model';
import mongoose from 'mongoose';

jest.mock('../../models/customer.model', () => ({
    countDocuments: jest.fn(),
    select: jest.fn(),
    find: jest.fn(),
}));

describe('getAllCustomers()', () => {
    test('should return an empty json if there is no items inside the array', async () => {
        (
            CustomerSchema.countDocuments as jest.Mock
        ).mockResolvedValueOnce(0);

        const result = await request(app).get('/api/v1/client');

        expect(result.statusCode).toEqual(200);
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
