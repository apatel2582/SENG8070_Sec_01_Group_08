// integration.test.ts
// This file integrates all the individual test functionalities for a comprehensive test flow.

import axios, { AxiosError } from "axios";

describe("Integrated Test Flow", () => {
  // API URLs
  const truckUrl = "http://reverse-proxy/api/trucks";  
  const customerUrl = "http://reverse-proxy/api/customers";  
  const employeeUrl = "http://reverse-proxy/api/employees";  
  const repairUrl = "http://reverse-proxy/api/repairs";  
  const shipmentUrl = "http://reverse-proxy/api/shipments";  
  const tripUrl = "http://reverse-proxy/api/trips";  

  // Variables to store created entity IDs
  let createdTruckId: number;
  let createdCustomerId: number;
  let createdEmployeeId: number;
  let createdRepairId: number;
  let createdShipmentId: number;
  let createdTripId: number;
  let createdDriver1Id: number;
  let createdDriver2Id: number;
  // Tests
  it("creates a new truck", async () => {
    const newTruck = {
      brand: "Volvo",
      load: 5000,
      capacity: 10000,
      year: 2020,
      number_of_repairs: 2,
    };
    const response = await axios.post(truckUrl, newTruck);
    createdTruckId = response.data.id;
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("creates a new customer", async () => {
    const newCustomer = {
      name: "Jane Smith",
      address: "123 Main Street",
      phone_number1: "123-456-7890",
      phone_number2: "234-567-8901",
    };
    const response = await axios.post(customerUrl, newCustomer);
    createdCustomerId = response.data.id;
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("creates a 1st employee", async () => {
    const newEmployee = {
      name: "John1",
      surname: "Doe1",
      seniority: "Senior1",
      role: "Driver1",
      category: "A1",
    };
    const response = await axios.post(employeeUrl, newEmployee);
    createdEmployeeId = response.data.id;
    createdDriver1Id = response.data.id;
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("creates a 2nd employee", async () => {
    const newEmployee = {
      name: "John2",
      surname: "Doe2",
      seniority: "Senior2",
      role: "Driver2",
      category: "A2",
    };
    const response = await axios.post(employeeUrl, newEmployee);
    //createdEmployeeId = response.data.id;
    createdDriver2Id = response.data.id;
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("creates a new repair", async () => {
    const newRepair = {
      mechanic_id: createdEmployeeId,  
      truck_id: createdTruckId,  
      estimated_time: 3,
    };
    const response = await axios.post(repairUrl, newRepair);
    createdRepairId = response.data.id;
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("creates a new shipment", async () => {
    const newShipment = {
      customer_id: createdCustomerId,
      origin: "New York",
      destination: "Los Angeles",
      weight: 1000,
      value: 2000,
    };
    const response = await axios.post(shipmentUrl, newShipment);
    createdShipmentId = response.data.id;
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("creates a new trip", async () => {
    const newTrip = {
      route_from: "New York",
      route_to: "Los Angeles",
      driver1_id: createdDriver1Id,
      driver2_id: createdDriver2Id,
      shipment_id: createdShipmentId,
      truck_id: createdTruckId,
    };
    const response = await axios.post(tripUrl, newTrip);
    createdTripId = response.data.id;
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  afterAll(async () => {
    try {
      await axios.delete(`${tripUrl}/${createdTripId}`);
      await axios.delete(`${shipmentUrl}/${createdShipmentId}`);
      await axios.delete(`${repairUrl}/${createdRepairId}`);
      await axios.delete(`${employeeUrl}/${createdDriver1Id}`);
      await axios.delete(`${employeeUrl}/${createdDriver2Id}`);
      await axios.delete(`${customerUrl}/${createdCustomerId}`);
      await axios.delete(`${truckUrl}/${createdTruckId}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error during cleanup: ", axiosError.message);
    }
  });
});