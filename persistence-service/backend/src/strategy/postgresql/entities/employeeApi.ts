//entities/employeeApi.ts
import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Employee } from "./Employee"; // Adjust the import path if needed
import { IEmployeeApi } from "../interfaces"; 

export default class EmployeeApi implements IEmployeeApi{
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/employees", this.getAllEmployeesHTML);
    this.#express.get("/api/employees", this.getAllEmployees);
    this.#express.get("/api/employees/:id", this.getEmployeeById);
    this.#express.post("/api/employees", this.createEmployee);
    this.#express.put("/api/employees/:id", this.updateEmployee);
    this.#express.delete("/api/employees/:id", this.deleteEmployee);
  }

  getAllEmployeesHTML = async (_: Request, res: Response) => {
    const employees = await this.#dataSource.manager.find(Employee);
    let html = `<table border="1">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Surname</th>
                      <th>Seniority</th>
                      <th>Role</th>
                      <th>Category</th>
                      <th>Specialized Brand</th>
                    </tr>
                  </thead>
                  <tbody>`;
    for (const employee of employees) {
        html += `<tr>
                  <td>${employee.employee_id}</td>
                  <td>${employee.name}</td>
                  <td>${employee.surname}</td>
                  <td>${employee.seniority}</td>
                  <td>${employee.role}</td>
                  <td>${employee.category || 'N/A'}</td>
                  <td>${employee.specialized_brand || 'N/A'}</td>
                </tr>`;
    }
    html += `</tbody></table>`;
    return res.send(html);
  };

  getAllEmployees = async (_: Request, res: Response) => {
    const employees = await this.#dataSource.manager.find(Employee);
    return res.json(employees);
  };

  getEmployeeById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const employee = await this.#dataSource.manager.findOne(Employee, { where: { employee_id: id } });
    if (!employee) {
      res.status(404);
      return res.json({ error: "Employee not found." });
    }
    return res.json(employee);
  };

  createEmployee = async (req: Request, res: Response) => {
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

  updateEmployee = async (req: Request, res: Response) => {
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

  deleteEmployee = async (req: Request, res: Response) => {
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

