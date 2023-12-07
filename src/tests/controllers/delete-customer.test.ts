import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { deleteCustomer } from '../../controllers/delete-customer.controller';
import CustomerModel from '../../models/customer.model';

jest.mock('../../models/customer.model');

describe('deleteCustomer', () => {
    it('should delete a customer when a valid ID is provided', async () => {
        const mockRequest = {
            params: {
                id: 'valid_id',
            },
        } as unknown as Request;

        (
            CustomerModel.findByIdAndDelete as jest.Mock
        ).mockResolvedValueOnce({});

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await deleteCustomer(mockRequest, mockResponse);

        expect(CustomerModel.findByIdAndDelete).toHaveBeenCalledWith(
            'valid_id',
        );
        expect(mockResponse.status).toHaveBeenCalledWith(
            StatusCodes.NO_CONTENT,
        );
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'success',
        });
    });

    it('should return a 400 error when an invalid ID is provided', async () => {
        const mockRequest = {
            params: {
                id: 'invalid_id',
            },
        } as unknown as Request;

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await deleteCustomer(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(
            StatusCodes.BAD_REQUEST,
        );
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'invalid client ID',
        });
    });
});
