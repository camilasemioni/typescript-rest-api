import BadRequestError from "../errors/bad-request.error";

export default function formatCPF(cpf: string): string {
    const match = cpf.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

    if (match) {
        const formattedCPF = `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
        return formattedCPF;
    } else {
        throw new BadRequestError('Invalid CPF format');
    }
}
