import { Request } from 'express';
import BadRequestError from '../errors/bad-request.error';

export default function formatCpf(req: Request): string {
    const cpfPayload = req.body.cpf.replace(/[^0-9]/g, '');

    const match = cpfPayload.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

    if (match) {
        const formattedCPF = `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
        return formattedCPF;
    } else {
        throw new BadRequestError('Invalid CPF format');
    }
}
