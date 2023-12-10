import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationResult } from 'joi';
import errorHandler from '../utils/error-handler.util';
import formatCep from '../utils/format-cep';
import formatCpf from '../utils/format-cpf';

export function validateMiddleware(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        req.body.cep = req.body.cep ? formatCep(req) : undefined;
        req.body.cpf = req.body.cpf ? formatCpf(req) : undefined;

        const result: ValidationResult = schema.validate(req.body);

        if (result.error) {
            errorHandler(result.error, res);
        } else {
            next();
        }
    };
}
