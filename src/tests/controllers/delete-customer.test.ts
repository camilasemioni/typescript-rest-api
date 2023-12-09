import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../app';
import CustomerModel from '../../models/customer.model';

jest.mock('../../models/customer.model', () => ({
    findByIdAndDelete: jest.fn(),
}));

describe('deleteCustomer', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should delete a customer when a valid ID is provided', async () => {
        const userId = '60d6c7e4873e3c9b2401b9b5';

        (
            CustomerModel.findByIdAndDelete as jest.Mock
        ).mockResolvedValue({});

        const response = await request(app)
            .delete(`/api/v1/client/${userId}`)
            .send();

        expect(response.status).toBe(StatusCodes.NO_CONTENT);
        expect(response.body).toEqual({});
    });

    test('should return a 404 error when the record does not exist', async () => {
        const userId = '60d6c7e4873e3c9b2401b9b5';
        
        (CustomerModel.findByIdAndDelete as jest.Mock
        ).mockResolvedValue(null);

        const response = await request(app)
            .delete(`/api/v1/client/${userId}`)
            .send();

        expect(CustomerModel.findByIdAndDelete).toHaveBeenCalledWith(
            userId,
        );
        expect(response.status).toBe(StatusCodes.NOT_FOUND);
        expect(response.body).toEqual({
            error: 404,
            message: 'Customer not found',
        });
    });

    test('should return a 400 error when an invalid ID is provided', async () => {
        const invalidId = 'invalid_id'
        
        const response = await request(app).delete(
            `/api/v1/client/${invalidId}`,
        ).send();

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toEqual({
            error: 400,
            message: `'${invalidId}' is not a valid id`,
        });
    });
});
