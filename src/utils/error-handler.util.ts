import mongoose from 'mongoose';
import { Response } from 'express';
import CustomAPIError from '../errors/custom-error-class.error';
import { StatusCodes } from 'http-status-codes';

export default function errorHandler(
    error:
        | CustomAPIError
        | mongoose.Error.CastError
        | mongoose.mongo.MongoServerError
        | Error
        | unknown,
    res: Response,
) {
    if (error instanceof CustomAPIError) {
        res.status(error.statusCode).json({
            message: error.message,
        });
    } else if (error instanceof mongoose.Error.CastError) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: `'${error.value}' is not a valid id`,
        });
    } else if (error instanceof mongoose.mongo.MongoServerError) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: `'${Object.keys(
                error.keyValue,
            )}' cannot be duplicated`,
        });
    } else if (error instanceof Error) {
        const message = error.message.replace(/"/g, "'");
        res.status(StatusCodes.BAD_REQUEST).json({ message });
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Unknown error',
        });
        console.log(error);
    }
}
