import { Request, Response } from 'express';
import Customer from '../models/customer.model';
import axios from 'axios';

export const createClient = async (req: Request, res: Response) => {
    try {
        const client = req.body;
        const cep = req.body.cep;
        const addressUrl = `https://viacep.com.br/ws/${cep}/json`;
        const address = (await axios.get(addressUrl)).data;
        const customer = { ...client, ...address };

        if (
            JSON.stringify(address) === JSON.stringify({ erro: true })
        ) {
            res.status(400).json({
                success: false,
                msg: 'Check your zipcode',
            });
        }

        const newCustomer = await Customer.create(customer);

        res.status(200).json({ data: newCustomer });
    } catch (error) {
        console.log(error);
    }
};
