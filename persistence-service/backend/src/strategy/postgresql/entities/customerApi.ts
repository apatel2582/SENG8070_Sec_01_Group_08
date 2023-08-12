import { Express, Request, Response } from "express";
import { DataSource } from "typeorm"; // Make sure to import DataSource from the correct location
import { Customer } from "./Customer";

export default class CustomerApi {
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/customers", this.getAllCustomers);
    this.#express.get("/customers/:id", this.getCustomerById);
    this.#express.post("/customers", this.createCustomer);
    this.#express.put("/customers/:id", this.updateCustomer);
    this.#express.delete("/customers/:id", this.deleteCustomer);
  }

  private getAllCustomers = async (_: Request, res: Response) => {
    const customers = await this.#dataSource.manager.find(Customer);
    return res.json(customers);
  };

  private getCustomerById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const customer = await this.#dataSource.manager.findOne(Customer, { where: { customer_id: id } });

    if (!customer) {
      res.status(404);
      return res.json({ error: "Customer not found." });
    }
    return res.json(customer);
  };

  private createCustomer = async (req: Request, res: Response) => {
    const { name, address, phone_number1, phone_number2 } = req.body;
    const customer = new Customer();
    customer.name = name;
    customer.address = address;
    customer.phone_number1 = phone_number1;
    customer.phone_number2 = phone_number2;

    try {
      await this.#dataSource.manager.save(customer);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Customer creation failed in db." });
    }

    res.status(201);
    return res.json({ id: customer.customer_id });
  };

  private updateCustomer = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const customer = await this.#dataSource.manager.findOne(Customer, { where: { customer_id: id } });

    if (!customer) {
      res.status(404);
      return res.json({ error: "Customer not found." });
    }

    Object.assign(customer, req.body);

    try {
      await this.#dataSource.manager.save(customer);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Customer update failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  };

  private deleteCustomer = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await this.#dataSource.manager.delete(Customer, id);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Customer deletion failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  }
}

