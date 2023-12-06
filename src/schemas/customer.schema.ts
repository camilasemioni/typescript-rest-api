import { Schema } from 'mongoose';
import ICustomer from '../interfaces/customer.interface';

const CustomerSchema = new Schema<ICustomer>({
    name: { type: String, required: true },
    cpf: { type: String, required: true },
    birthday: { type: String, required: true },
    password: { type: String, required: true, select: false },
    email: { type: String, required: true },
    cep: { type: String, required: true },
    uf: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    neighborhood: { type: String, required: true },
});

export default CustomerSchema;
