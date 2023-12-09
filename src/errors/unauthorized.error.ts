import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-error-class.error';

class UnauthorizedError extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

export default UnauthorizedError;
