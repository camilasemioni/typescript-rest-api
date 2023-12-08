import { model } from 'mongoose';
import ICustomer from '../interfaces/customer.interface';
import CustomerSchema from '../schemas/customer.schema';

export default model<ICustomer>('Customer', CustomerSchema);
