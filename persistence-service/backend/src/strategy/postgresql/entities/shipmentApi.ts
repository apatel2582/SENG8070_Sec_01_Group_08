import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Shipment } from "./Shipment";
import { Customer } from "./Customer";

export default class ShipmentApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/shipments", this.getAllShipments);
    this.#express.get("/shipments/:id", this.getShipmentById);
    this.#express.post("/shipments", this.createShipment);
    this.#express.put("/shipments/:id", this.updateShipment);
    this.#express.delete("/shipments/:id", this.deleteShipment);
  }

  private getAllShipments = async (_: Request, res: Response) => {
    const shipments = await this.#dataSource.manager.find(Shipment, { relations: ["customer"] });
    return res.json(shipments);
  };

  private getShipmentById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const shipment = await this.#dataSource.manager.findOne(Shipment, { where: { shipment_id: id }, relations: ["customer"] });

    if (!shipment) {
      res.status(404);
      return res.json({ error: "Shipment not found." });
    }
    return res.json(shipment);
  };

  private createShipment = async (req: Request, res: Response) => {
    const { customer_id, origin, destination, weight, value } = req.body;
    const customer = await this.#dataSource.manager.findOne(Customer, { where: { customer_id } });

    if (!customer) {
      res.status(400);
      return res.json({ error: "Customer not found." });
    }

    const shipment = new Shipment();
    shipment.customer = customer;
    shipment.origin = origin;
    shipment.destination = destination;
    shipment.weight = weight;
    shipment.value = value;

    try {
      await this.#dataSource.manager.save(shipment);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Shipment creation failed in db." });
    }

    res.status(201);
    return res.json({ id: shipment.shipment_id });
  };

  private updateShipment = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const shipment = await this.#dataSource.manager.findOne(Shipment, { where: { shipment_id: id } });

    if (!shipment) {
      res.status(404);
      return res.json({ error: "Shipment not found." });
    }

    Object.assign(shipment, req.body);

    try {
      await this.#dataSource.manager.save(shipment);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Shipment update failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  };

  private deleteShipment = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await this.#dataSource.manager.delete(Shipment, id);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Shipment deletion failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  }
}

