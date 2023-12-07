import { Document } from 'mongoose';

export default interface ICustomer extends Document {
    name: string;
    cpf: string;
    password: string;
    birthday: string;
    email: string;
    cep: string;
    uf: string;
    city: string;
    address: string;
    number: string;
    complement: string;
    neighborhood: string;
}
