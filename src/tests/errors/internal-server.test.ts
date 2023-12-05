import { expect, test } from 'vitest';
import InternalServerError from '../../errors/internal-server.error';
import { StatusCodes } from 'http-status-codes';

test('should have the correct properties', () => {
    const errorMessage = 'Internal Server Error Message';
    const error = new InternalServerError(errorMessage);

    expect(error.message).toEqual(errorMessage);
    expect(error.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
});
