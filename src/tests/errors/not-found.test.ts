import NotFoundError from '../../errors/not-found.error';
import { StatusCodes } from 'http-status-codes';

test('should have the correct properties', () => {
    const errorMessage = 'Not Found Message';
    const error = new NotFoundError(errorMessage);

    expect(error.message).toEqual(errorMessage);
    expect(error.statusCode).toEqual(StatusCodes.NOT_FOUND);
});