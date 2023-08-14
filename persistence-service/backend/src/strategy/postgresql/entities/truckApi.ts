//entities/truckApi.ts
import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Truck } from "./Truck";
import { ITruckApi } from "../interfaces";  // Step 1: Import the ITruckApi interface

export default class TruckApi implements ITruckApi { // Step 2: Implement the ITruckApi interface
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/trucks", this.getAllTrucksHTML);
    this.#express.get("/api/trucks", this.getAllTrucks);
    this.#express.get("/api/trucks/:id", this.getTruckById);
    this.#express.post("/api/trucks", this.createTruck);
    this.#express.put("/api/trucks/:id", this.updateTruck);
    this.#express.delete("/api/trucks/:id", this.deleteTruck);
  }

  getAllTrucksHTML = async (_: Request, res: Response) => {
      const trucks = await this.#dataSource.manager.find(Truck);
      let html = `<table border="1">
                    <thead>
                      <tr>
                        <th>Truck ID</th>
                        <th>Brand</th>
                        <th>Load</th>
                        <th>Capacity</th>
                        <th>Year</th>
                        <th>Number of Repairs</th>
                      </tr>
                    </thead>
                    <tbody>`;
      for (const truck of trucks) {
          html += `<tr>
                    <td>${truck.truck_id}</td>
                    <td>${truck.brand}</td>
                    <td>${truck.load}</td>
                    <td>${truck.capacity}</td>
                    <td>${truck.year}</td>
                    <td>${truck.number_of_repairs}</td>
                  </tr>`;
      }
      html += `</tbody></table>`;
      return res.send(html);
  };

  getAllTrucks = async (_: Request, res: Response) => {
    const trucks = await this.#dataSource.manager.find(Truck);
    return res.json(trucks);
  };

  getTruckById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const truck = await this.#dataSource.manager.findOne(Truck, { where: { truck_id: id } });
    if (!truck) {
      res.status(404);
      return res.json({ error: "Truck not found." });
    }
    return res.json(truck);
  };

  createTruck = async (req: Request, res: Response) => {
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

  updateTruck = async (req: Request, res: Response) => {
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

  deleteTruck = async (req: Request, res: Response) => {
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