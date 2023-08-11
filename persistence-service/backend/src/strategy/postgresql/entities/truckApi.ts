import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Truck } from "./Truck"; // Assuming this is the correct import path for your Truck entity

export default class TruckApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/trucks", this.getAllTrucks);
    this.#express.get("/trucks/:id", this.getTruckById);
    this.#express.post("/trucks", this.createTruck);
    this.#express.put("/trucks/:id", this.updateTruck);
    this.#express.delete("/trucks/:id", this.deleteTruck);
  }

  private getAllTrucks = async (_: Request, res: Response) => {
    const trucks = await this.#dataSource.manager.find(Truck);
    return res.json(trucks);
  };

  private getTruckById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const truck = await this.#dataSource.manager.findOne(Truck, { where: { truck_id: id } });
    if (!truck) {
      res.status(404);
      return res.json({ error: "Truck not found." });
    }
    return res.json(truck);
  };

  private createTruck = async (req: Request, res: Response) => {
    const { body } = req;
    const truck = new Truck();

    // Assuming all the fields are provided in the request body
    Object.assign(truck, body);

    try {
      await this.#dataSource.manager.save(truck);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Truck creation failed in db." });
    }

    res.status(201);
    return res.json({ id: truck.truck_id });
  };

  private updateTruck = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const truck = await this.#dataSource.manager.findOne(Truck, { where: { truck_id: id } }); // Corrected line
    if (!truck) {
      res.status(404);
      return res.json({ error: "Truck not found." });
    }

    Object.assign(truck, req.body);

    try {
      await this.#dataSource.manager.save(truck);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Truck update failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  };

  private deleteTruck = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const truck = await this.#dataSource.manager.findOne(Truck, { where: { truck_id: id } }); // Corrected line
    if (!truck) {
      res.status(404);
      return res.json({ error: "Truck not found." });
    }

    try {
      await this.#dataSource.manager.delete(Truck, { truck_id: id });
    } catch (err) {
      res.status(503);
      return res.json({ error: "Truck deletion failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  };
}

