import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getAllCustomers } from '../../controllers/customer.controller';
import customerModel from '../../models/customer.model';

jest.mock('../../models/customer.model');

describe('getAllCustomers', () => {
    it('should return customers when they exist', async () => {
        const mockCustomerList = [
            { name: 'Customer1' },
            { name: 'Customer2' },
        ];
        (customerModel.find as jest.Mock).mockImplementation(() => ({
            select: jest.fn().mockResolvedValueOnce(mockCustomerList),
        }));

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await getAllCustomers({} as Request, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(
            StatusCodes.OK,
        );
        expect(mockResponse.json).toHaveBeenCalledWith(
            mockCustomerList,
        );
    });

    it('should return a 404 error when no customers are found', async () => {
        (customerModel.find as jest.Mock).mockImplementation(() => ({
            select: jest.fn().mockResolvedValueOnce([]),
        }));

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await getAllCustomers({} as Request, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(
            StatusCodes.NOT_FOUND,
        );
        expect(mockResponse.json).toHaveBeenCalledWith({
            code: 404,
            message: 'Not Found',
        });
    });
});
