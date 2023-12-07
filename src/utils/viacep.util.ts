import BadRequestError from "../errors/bad-request.error";

export function formatViaCep(address: string) {
    if (address.length !== 8) {
        throw new BadRequestError('Invalid CEP format');
    }
}
