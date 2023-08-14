//entitites/tripApi.ts
import { Express, Request, Response } from "express";
import { DataSource } from "typeorm";
import { Trip } from "./Trip";
import { Employee } from "./Employee";
import { Shipment } from "./Shipment";
import { Truck } from "./Truck";
import { Customer } from "./Customer";
import { ITripApi } from "../interfaces";

export default class TripApi implements ITripApi{
  #dataSource: DataSource;
  #express: Express;

  constructor(dataSource: DataSource, express: Express) {
    this.#dataSource = dataSource;
    this.#express = express;

	this.#express.get("/trips", this.getAllTripsHTML);
    this.#express.get("/api/trips", this.getAllTrips);
    this.#express.get("/api/trips/:id", this.getTripById);
    this.#express.post("/api/trips", this.createTrip);
    this.#express.put("/api/trips/:id", this.updateTrip);
    this.#express.delete("/api/trips/:id", this.deleteTrip);
  }

  getAllTripsHTML = async (_: Request, res: Response) => {
    const trips = await this.#dataSource.manager.find(Trip, { 
        relations: ["driver1", "driver2", "shipment", "truck", "shipment.customer"] 
    });
    let html = `<table border="1">
                  <thead>
                    <tr>
                      <th>Trip ID</th>
                      <th>Route From</th>
                      <th>Route To</th>
                      <th>Driver 1</th>
                      <th>Driver 2</th>
                      <th>Shipment Details</th>
                      <th>Truck Details</th>
                    </tr>
                  </thead>
                  <tbody>`;
    for (const trip of trips) {
        html += `<tr>
                  <td>${trip.trip_id}</td>
                  <td>${trip.route_from}</td>
                  <td>${trip.route_to}</td>
                  <td>${trip.driver1.name} ${trip.driver1.surname}</td>
                  <td>${trip.driver2.name} ${trip.driver2.surname}</td>
                  <td>
                    <table border="1">
                      <thead>
                        <tr>
                          <th>Shipment ID</th>
                          <th>Origin</th>
                          <th>Destination</th>
                          <th>Customer Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>${trip.shipment.shipment_id}</td>
                          <td>${trip.shipment.origin}</td>
                          <td>${trip.shipment.destination}</td>
                          <td>
                            <table border="1">
                              <thead>
                                <tr>
                                  <th>Customer ID</th>
                                  <th>Name</th>
                                  <th>Address</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>${trip.shipment.customer.customer_id}</td>
                                  <td>${trip.shipment.customer.name}</td>
                                  <td>${trip.shipment.customer.address}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td>
                    <table border="1">
                      <thead>
                        <tr>
                          <th>Truck ID</th>
                          <th>Brand</th>
                          <th>Load</th>
                          <th>Capacity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>${trip.truck.truck_id}</td>
                          <td>${trip.truck.brand}</td>
                          <td>${trip.truck.load}</td>
                          <td>${trip.truck.capacity}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>`;
    }
    html += `</tbody></table>`;
    return res.send(html);
  };


	getAllTrips = async (_: Request, res: Response) => {
	  const trips = await this.#dataSource.manager.find(Trip, {
	    relations: ["driver1", "driver2", "shipment", "truck"] // Specify the relations you want to include
	  });
	  return res.json(trips);
	};


	getTripById = async (req: Request, res: Response) => {
	  const id = parseInt(req.params.id);
	  const trip = await this.#dataSource.manager.findOne(Trip, {
	    where: { trip_id: id },
	    relations: ["driver1", "driver2", "shipment", "truck"] // Specify the relations you want to include
	  });

	  if (!trip) {
	    res.status(404);
	    return res.json({ error: "Trip not found." });
	  }
	  return res.json(trip);
	};


	createTrip = async (req: Request, res: Response) => {
	  const { route_from, route_to, driver1_id, driver2_id, shipment_id, truck_id } = req.body;


	  const driverIds = [driver1_id, driver2_id];
	  const drivers = await this.#dataSource.manager.findByIds(Employee, driverIds);

	  //const driver1 = await this.#dataSource.manager.findOne(Employee, driver1_id);
	  const driver1 = drivers[0];


	  //const driver2 = await this.#dataSource.manager.findOne(Employee, driver2_id);
	  const driver2 = drivers[1];


	  const shipment = await this.#dataSource.manager.findOne(Shipment, { where: { shipment_id } } );
	 

	  const truck = await this.#dataSource.manager.findOne(Truck,{ where: { truck_id } } );
	

	  if (!driver1 || !driver2 || !shipment || !truck) {
	    res.status(400);
	    return res.json({ error: "Referenced entities not found." });
	  }

	  const trip = new Trip();
	  trip.route_from = route_from;
	  trip.route_to = route_to;
	  trip.driver1 = driver1;
	  trip.driver2 = driver2;
	  trip.shipment = shipment;
	  trip.truck = truck;

	  try {
	    await this.#dataSource.manager.save(trip);
	  } catch (err) {
	    console.error("Error while saving trip to the database:", err);
	    res.status(503);
	    return res.json({ error: "Trip creation failed in db." });
	  }

	  res.status(201);
	  return res.json({ id: trip.trip_id });
	};


    updateTrip = async (req: Request, res: Response) => {
	  const id = parseInt(req.params.id);
	  const { route_from, route_to, driver1_id, driver2_id } = req.body;

	  const trip = await this.#dataSource.manager.findOne(Trip, { where: { trip_id: id } });
	  if (!trip) {
	    res.status(404);
	    return res.json({ error: "Trip not found." });
	  }

	  if (route_from) trip.route_from = route_from;
	  if (route_to) trip.route_to = route_to;

	  // If driver IDs are provided, fetch the new driver entities
	  if (driver1_id) {
	    const driver1 = await this.#dataSource.manager.findOne(Employee, driver1_id);
	    if (!driver1) {
	      res.status(400);
	      return res.json({ error: "Driver 1 not found." });
	    }
	    trip.driver1 = driver1;
	  }

	  if (driver2_id) {
	    const driver2 = await this.#dataSource.manager.findOne(Employee, driver2_id);
	    if (!driver2) {
	      res.status(400);
	      return res.json({ error: "Driver 2 not found." });
	    }
	    trip.driver2 = driver2;
	  }

	  try {
	    await this.#dataSource.manager.save(trip);
	  } catch (err) {
	    console.error("Error while saving trip to the database:", err);
	    res.status(503);
	    return res.json({ error: "Trip update failed in db." });
	  }

	  res.status(200);
	  return res.json({ success: true });
	};


  deleteTrip = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      await this.#dataSource.manager.delete(Trip, id);
    } catch (err) {
      res.status(503);
      return res.json({ error: "Trip deletion failed in db." });
    }

    res.status(200);
    return res.json({ success: true });
  }
}

