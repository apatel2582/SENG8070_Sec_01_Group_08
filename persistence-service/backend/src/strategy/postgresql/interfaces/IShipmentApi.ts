// interfaces/IShipmentApi.ts
import { Request, Response } from "express";

export interface IShipmentApi {
  getAllShipmentsHTML(req: Request, res: Response): Promise<Response>;
  getAllShipments(req: Request, res: Response): Promise<Response>;
  getShipmentById(req: Request, res: Response): Promise<Response>;
  createShipment(req: Request, res: Response): Promise<Response>;
  updateShipment(req: Request, res: Response): Promise<Response>;
  deleteShipment(req: Request, res: Response): Promise<Response>;
}
