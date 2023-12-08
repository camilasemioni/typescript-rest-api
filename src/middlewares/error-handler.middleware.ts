import { Request, Response, NextFunction } from 'express';
import errorHandler from '../utils/error-handler.util';

function errorMiddleware(
    errorObj: unknown,
    _: Request,
    res: Response,
    __: NextFunction,
): void {
    errorHandler(errorObj, res);
}

export default errorMiddleware;
