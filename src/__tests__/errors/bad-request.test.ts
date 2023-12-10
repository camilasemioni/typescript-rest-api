import BadRequestError from '../../errors/bad-request.error';
import { StatusCodes } from 'http-status-codes';

test('should have the correct properties', () => {
    const errorMessage = 'Bad Request Message';
    const error = new BadRequestError(errorMessage);

    expect(error.message).toEqual(errorMessage);
    expect(error.statusCode).toEqual(StatusCodes.BAD_REQUEST);
});
