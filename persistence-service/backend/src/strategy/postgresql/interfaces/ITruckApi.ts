// interfaces/ITruckApi.ts
import { Request, Response } from "express";

export interface ITruckApi {
  getAllTrucksHTML(req: Request, res: Response): Promise<Response>;
  getAllTrucks(req: Request, res: Response): Promise<Response>;
  getTruckById(req: Request, res: Response): Promise<Response>;
  createTruck(req: Request, res: Response): Promise<Response>;
  updateTruck(req: Request, res: Response): Promise<Response>;
  deleteTruck(req: Request, res: Response): Promise<Response>;
}
