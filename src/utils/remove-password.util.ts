import ICustomer from '../interfaces/customer.interface';

export function removePassword(Customer: ICustomer) {
    return {
        id: Customer.id,
        name: Customer.name,
        cpf: Customer.cpf,
        birthday: Customer.birthday,
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
