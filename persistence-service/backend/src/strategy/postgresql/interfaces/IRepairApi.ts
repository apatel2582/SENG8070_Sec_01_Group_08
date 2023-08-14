// interfaces/IRepairApi.ts
import { Request, Response } from "express";

export interface IRepairApi {
  getAllRepairsHTML(req: Request, res: Response): Promise<Response>;
  getAllRepairs(req: Request, res: Response): Promise<Response>;
  getRepairById(req: Request, res: Response): Promise<Response>;
  createRepair(req: Request, res: Response): Promise<Response>;
  updateRepair(req: Request, res: Response): Promise<Response>;
  deleteRepair(req: Request, res: Response): Promise<Response>;
}
