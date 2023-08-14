// interfaces/IEmployeeApi.ts
import { Request, Response } from "express";

export interface IEmployeeApi {
  getAllEmployeesHTML(req: Request, res: Response): Promise<Response>;
  getAllEmployees(req: Request, res: Response): Promise<Response>;
  getEmployeeById(req: Request, res: Response): Promise<Response>;
  createEmployee(req: Request, res: Response): Promise<Response>;
  updateEmployee(req: Request, res: Response): Promise<Response>;
  deleteEmployee(req: Request, res: Response): Promise<Response>;
}
