import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Repair } from "./Repair";
import { Truck } from "./Truck";
import { Employee } from "./Employee";

export default class RepairApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/repairs", this.getAllRepairs);
    this.#express.get("/repairs/:id", this.getRepairById);
    this.#express.post("/repairs", this.createRepair);
    this.#express.put("/repairs/:id", this.updateRepair);
    this.#express.delete("/repairs/:id", this.deleteRepair);
  }

  private getAllRepairs = async (_: Request, res: Response) => {
    const repairs = await this.#dataSource.manager.find(Repair);
    return res.json(repairs);
  };

	private getRepairById = async (req: Request, res: Response) => {
	  const id = parseInt(req.params.id);
	  const repair = await this.#dataSource.manager.findOne(Repair, { where: { repair_id: id } });

	  if (!repair) {
	    res.status(404);
	    return res.json({ error: "Repair not found." });
	  }
	  return res.json(repair);
	};

  private createRepair = async (req: Request, res: Response) => {
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

  private updateRepair = async (req: Request, res: Response) => {
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

  private deleteRepair = async (req: Request, res: Response) => {
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

