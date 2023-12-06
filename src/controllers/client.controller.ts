import { Request, Response } from 'express';
import Customer from '../models/customer.model';

export const createClient = async (req: Request, res: Response) => {
    const client = await Customer.create(req.body);
    
    res.status(200).json({
        success: true,
        client: client,
    });
};
