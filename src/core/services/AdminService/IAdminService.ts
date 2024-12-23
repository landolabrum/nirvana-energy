import IAuthenticatedUser from "~/src/models/ICustomer";
import { IAccountsResponse } from "./adminModels/iAdminAccounts";

export default interface IAdminService {
  // CUSTOMERS
  getCustomer(customerId: string): Promise<any>;
  getPrice(priceId: string): Promise<any>;
  createCustomer(customer: any): Promise<any>;
  listCustomers(): Promise<any>;
  deleteCustomer(customerId: string): Promise<any>;
  updateCustomer(customer: IAuthenticatedUser): Promise<any>;
  // PRODUCTS
  deleteProduct(productId: string, price_id?:string): Promise<any>;
  deletePrice(priceId: string): Promise<any>;
  createProduct(productData: any): Promise<any>;
  
  listAccounts(): Promise<IAccountsResponse>;
  getAccount(accountId:string): Promise<any>;
  // SYSTEM
  getSystemInfo():Promise<any>;
}