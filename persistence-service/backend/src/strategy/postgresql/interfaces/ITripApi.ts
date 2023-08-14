// interfaces/ITripApi.ts
import { Request, Response } from "express";

export interface ITripApi {
  getAllTripsHTML(req: Request, res: Response): Promise<Response>;
  getAllTrips(req: Request, res: Response): Promise<Response>;
  getTripById(req: Request, res: Response): Promise<Response>;
  createTrip(req: Request, res: Response): Promise<Response>;
  updateTrip(req: Request, res: Response): Promise<Response>;
  deleteTrip(req: Request, res: Response): Promise<Response>;
}
