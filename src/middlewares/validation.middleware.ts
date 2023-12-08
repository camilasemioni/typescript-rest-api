import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationResult } from 'joi';
import errorHandler from '../utils/error-handler.util';

export function validateMiddleware(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result: ValidationResult = schema.validate(req.body);

        if (result.error) {
            errorHandler(result.error, res);
        } else {
            next();
        }
    };
}
