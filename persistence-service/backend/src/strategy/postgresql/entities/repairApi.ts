//entities/repairApi.ts
import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Repair } from "./Repair";
import { Truck } from "./Truck";
import { Employee } from "./Employee";
import { IRepairApi } from "../interfaces";

export default class RepairApi implements IRepairApi{
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/repairs", this.getAllRepairsHTML);
    this.#express.get("/api/repairs", this.getAllRepairs);
    this.#express.get("/api/repairs/:id", this.getRepairById);
    this.#express.post("/api/repairs", this.createRepair);
    this.#express.put("/api/repairs/:id", this.updateRepair);
    this.#express.delete("/api/repairs/:id", this.deleteRepair);
  }

  getAllRepairsHTML = async (_: Request, res: Response) => {
    const repairs = await this.#dataSource.manager.find(Repair, { relations: ["truck", "mechanic"] });
    let html = `<table border="1">
                  <thead>
                    <tr>
                      <th>Repair ID</th>
                      <th>Estimated Time</th>
                      <th>Truck & Mechanic Details</th>
                    </tr>
                  </thead>
                  <tbody>`;
    for (const repair of repairs) {
        html += `<tr>
                  <td>${repair.repair_id}</td>
                  <td>${repair.estimated_time}</td>
                  <td>
                    <table border="1">
                      <thead>
                        <tr>
                          <th>Truck ID</th>
                          <th>Truck Brand</th>
                          <th>Mechanic ID</th>
                          <th>Mechanic Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>${repair.truck.truck_id}</td>
                          <td>${repair.truck.brand}</td>
                          <td>${repair.mechanic.employee_id}</td>
                          <td>${repair.mechanic.name} ${repair.mechanic.surname}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>`;
    }
    html += `</tbody></table>`;
    return res.send(html);
  };

  getAllRepairs = async (_: Request, res: Response) => {
    const repairs = await this.#dataSource.manager.find(Repair);
    return res.json(repairs);
  };

	getRepairById = async (req: Request, res: Response) => {
	  const id = parseInt(req.params.id);
	  const repair = await this.#dataSource.manager.findOne(Repair, { where: { repair_id: id } });

	  if (!repair) {
	    res.status(404);
	    return res.json({ error: "Repair not found." });
	  }
	  return res.json(repair);
	};

  createRepair = async (req: Request, res: Response) => {
	  const { mechanic_id, truck_id, estimated_time } = req.body;

	  const mechanic = await this.#dataSource.manager.findOne(Employee, { where: { employee_id: mechanic_id } });
	  const truck = await this.#dataSource.manager.findOne(Truck, { where: { truck_id: truck_id } });

    if (!mechanic || !truck) {
      res.status(400);
      return res.json({ error: "Mechanic or Truck not found." });
    }

    const repair = new Repair();
    repair.mechanic = mechanic;
    repair.truck = truck;
    repair.estimated_time = estimated_time;

    try {
      await this.#dataSource.manager.save(repair);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Repair creation failed in db." });
    }

    res.status(201);
    return res.json({ id: repair.repair_id });
  };

  updateRepair = async (req: Request, res: Response) => {
	  const id = parseInt(req.params.id);
	  const repair = await this.#dataSource.manager.findOne(Repair, { where: { repair_id: id } });

    if (!repair) {
      res.status(404);
      return res.json({ error: "Repair not found." });
    }

    Object.assign(repair, req.body);

    try {
      await this.#dataSource.manager.save(repair);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Repair update failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  };

  deleteRepair = async (req: Request, res: Response) => {
	  const id = parseInt(req.params.id);
	  const repair = await this.#dataSource.manager.findOne(Repair, { where: { repair_id: id } });

    if (!repair) {
      res.status(404);
      return res.json({ error: "Repair not found." });
    }

    try {
      await this.#dataSource.manager.delete(Repair, id);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Repair deletion failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  }
}

