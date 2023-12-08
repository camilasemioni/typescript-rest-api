import { model } from "mongoose";
import ICustomer from "../interfaces/customer.interface";
import CustomerSchema from "../schemas/customer.schema";

export const CustomerModel = model<ICustomer>('Customer', CustomerSchema);
