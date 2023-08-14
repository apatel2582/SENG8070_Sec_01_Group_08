// interfaces/ICustomerApi.ts
import { Request, Response } from "express";

export interface ICustomerApi {
  getAllCustomersHTML(req: Request, res: Response): Promise<Response>;
  getAllCustomers(req: Request, res: Response): Promise<Response>;
  getCustomerById(req: Request, res: Response): Promise<Response>;
  createCustomer(req: Request, res: Response): Promise<Response>;
  updateCustomer(req: Request, res: Response): Promise<Response>;
  deleteCustomer(req: Request, res: Response): Promise<Response>;
}
