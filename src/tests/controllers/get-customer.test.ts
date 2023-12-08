import request from 'supertest';
import app from '../../app';
import { CustomerModel } from '../../models/customer.model';

jest.mock('../../models/customer.model', () => ({
    countDocuments: jest.fn(),
    select: jest.fn(),
    find: jest.fn(),
}));

describe('getAllCustomers()', () => {
    test('should return an empty json if there is no items inside the array', async () => {
        (
            CustomerModel.countDocuments as jest.Mock
        ).mockResolvedValueOnce(0);

        const result = await request(app).get('/api/v1/client');

        expect(result.statusCode).toEqual(200);
    });
});
