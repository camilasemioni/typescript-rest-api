import request from 'supertest';
import app from '../../app';
import { CustomerModel } from '../../models/customer.model';

jest.mock('../../models/customer.model', () => ({
    findByIdAndDelete: jest.fn(),
}));

describe('deleteCustomer()', () => {
    test('should delete a customer when a valid ID is provided', async () => {
        
        (CustomerModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});

        const validCustomerId = 'valid_id';

        const response = await request(app).delete(`/api/v1/client/${validCustomerId}`);

        expect(response.status).toEqual(204);
        expect(response.body).toEqual({});
    });

    test('should return a 404 error when the record does not exist', async () => {

        (CustomerModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        const nonExistentCustomerId = 'nonexistent_id';

        const response = await request(app).delete(`/api/v1/client/${nonExistentCustomerId}`);

        expect(response.status).toEqual(404);
        expect(response.body).toEqual({
            error: 'Customer not found',
        });
    });

    test('should return a 400 error when an invalid ID is provided', async () => {
        const invalidCustomerId = 'invalid_id';

        const response = await request(app).delete(`/api/v1/client/${invalidCustomerId}`);

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            error: 'Invalid customer ID',
        });
    });
});
