//entities/shipmentApi.ts
import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Shipment } from "./Shipment";
import { Customer } from "./Customer";
import { IShipmentApi } from "../interfaces";

export default class ShipmentApi implements IShipmentApi{
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

    this.#express.get("/shipments", this.getAllShipmentsHTML);
    this.#express.get("/api/shipments", this.getAllShipments);
    this.#express.get("/api/shipments/:id", this.getShipmentById);
    this.#express.post("/api/shipments", this.createShipment);
    this.#express.put("/api/shipments/:id", this.updateShipment);
    this.#express.delete("/api/shipments/:id", this.deleteShipment);
  }

  getAllShipmentsHTML = async (_: Request, res: Response) => {
    const shipments = await this.#dataSource.manager.find(Shipment, { relations: ["customer"] });
    let html = `<table border="1">
                  <thead>
                    <tr>
                      <th>Shipment ID</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Weight</th>
                      <th>Value</th>
                      <th>Customer Details</th>
                    </tr>
                  </thead>
                  <tbody>`;
    for (const shipment of shipments) {
        html += `<tr>
                  <td>${shipment.shipment_id}</td>
                  <td>${shipment.origin}</td>
                  <td>${shipment.destination}</td>
                  <td>${shipment.weight}</td>
                  <td>${shipment.value}</td>
                  <td>
                    <table border="1">
                      <thead>
                        <tr>
                          <th>Customer ID</th>
                          <th>Customer Name</th>
                          <th>Address</th>
                          <th>Phone Number 1</th>
                          <th>Phone Number 2</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>${shipment.customer.customer_id}</td>
                          <td>${shipment.customer.name}</td>
                          <td>${shipment.customer.address}</td>
                          <td>${shipment.customer.phone_number1}</td>
                          <td>${shipment.customer.phone_number2 || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>`;
    }
    html += `</tbody></table>`;
    return res.send(html);
  };

  getAllShipments = async (_: Request, res: Response) => {
    const shipments = await this.#dataSource.manager.find(Shipment, { relations: ["customer"] });
    return res.json(shipments);
  };

  getShipmentById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const shipment = await this.#dataSource.manager.findOne(Shipment, { where: { shipment_id: id }, relations: ["customer"] });

    if (!shipment) {
      res.status(404);
      return res.json({ error: "Shipment not found." });
    }
    return res.json(shipment);
  };

  createShipment = async (req: Request, res: Response) => {
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

  updateShipment = async (req: Request, res: Response) => {
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

  deleteShipment = async (req: Request, res: Response) => {
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

