import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Employee } from "./Employee"; // Adjust the import path if needed

export default class EmployeeApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/employees", this.getAllEmployees);
    this.#express.get("/employees/:id", this.getEmployeeById);
    this.#express.post("/employees", this.createEmployee);
    this.#express.put("/employees/:id", this.updateEmployee);
    this.#express.delete("/employees/:id", this.deleteEmployee);
  }

  private getAllEmployees = async (_: Request, res: Response) => {
    const employees = await this.#dataSource.manager.find(Employee);
    return res.json(employees);
  };

  private getEmployeeById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const employee = await this.#dataSource.manager.findOne(Employee, { where: { employee_id: id } });
    if (!employee) {
      res.status(404);
      return res.json({ error: "Employee not found." });
    }
    return res.json(employee);
  };

  private createEmployee = async (req: Request, res: Response) => {
    const { body } = req;
    const employee = new Employee();

    // Assuming all the fields are provided in the request body
    Object.assign(employee, body);

    try {
      await this.#dataSource.manager.save(employee);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Employee creation failed in db." });
    }

    res.status(201);
    return res.json({ id: employee.employee_id });
  };

  private updateEmployee = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const employee = await this.#dataSource.manager.findOne(Employee, { where: { employee_id: id } });
    if (!employee) {
      res.status(404);
      return res.json({ error: "Employee not found." });
    }

    Object.assign(employee, req.body);

    try {
      await this.#dataSource.manager.save(employee);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Employee update failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  };

  private deleteEmployee = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const employee = await this.#dataSource.manager.findOne(Employee, { where: { employee_id: id } });
    if (!employee) {
      res.status(404);
      return res.json({ error: "Employee not found." });
    }

    try {
      await this.#dataSource.manager.delete(Employee, { employee_id: id });
    } catch (err) {
      res.status(503);
      return res.json({ error: "Employee deletion failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  };
}

