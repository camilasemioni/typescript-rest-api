import ICustomer from '../interfaces/customer.interface';

export function removePassword(Customer: ICustomer) {
    return {
        name: Customer.name,
        cpf: Customer.cpf,
        date_of_birth: Customer.date_of_birth,
        email: Customer.email,
        cep: Customer.cep,
        uf: Customer.uf,
        city: Customer.city,
        address: Customer.address,
        number: Customer.number,
        complement: Customer.complement,
        neighborhood: Customer.neighborhood,
    };
}
