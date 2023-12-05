import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-error-class.error';

class InternalServerError extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default InternalServerError;
