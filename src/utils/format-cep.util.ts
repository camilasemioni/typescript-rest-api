import { Request } from 'express';
import BadRequestError from '../errors/bad-request.error';

export default function formatCep(req: Request) {
    const payload = req.body;
    if (payload.cep) {
        const cepPayload = payload.cep.replace(/[^0-9]/g, '');

        const match = cepPayload.match(/^(\d{5})(\d{3})$/);

        if (match) {
            const formattedCep = `${match[1]}-${match[2]}`;
            return formattedCep;
        } else {
            throw new BadRequestError('Invalid CEP format');
        }
    }
}
