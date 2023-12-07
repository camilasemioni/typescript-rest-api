import { Schema } from 'mongoose';
import ICustomer from '../interfaces/customer.interface';

const CustomerSchema = new Schema<ICustomer>({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) =>
                /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{3,50}$/.test(value),
            message: `The name provided is not valid. Please provide a valid name.`,
        },
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) =>
                /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value),
            message: `The CPF provided is not valid. Please provide a valid CPF.`,
        },
    },
    birthday: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) =>
                /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(value),
            message: `Invalid date format. Please provide a date in DD/MM/YYYY format.`,
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    cep: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => /^\d{5}-\d{3}$/.test(value),
            message: `The CEP provided is not valid. Please provide a valid CEP.`,
        },
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) =>
                /^[0-9]{1,6}[A-Za-z]{0,3}$/.test(value),
            message: `The number provided is not valid. Please provide a valid number.`,
        },
    },
    uf: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => /^[A-Z]{2}$/.test(value),
            message: `The UF provided is not valid. Please provide a valid number.`,
        },
    },
    city: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) =>
                /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,50}$/.test(value),
            message: `The city provided is not valid. Please provide a valid city.`,
        },
    },
    address: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) =>
                /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{3,70}$/.test(value),
            message: `The address provided is not valid. Please provide a valid address.`,
        },
    },
    complement: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) =>
                /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{3,70}$/.test(value),
            message: `The complement provided is not valid. Please provide a valid complement.`,
        },
    },
    neighborhood: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) =>
                /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,70}$/.test(value),
            message: `The neighborhood provided is not valid. Please provide a valid neighborhood.`,
        },
    },
});

export default CustomerSchema;
