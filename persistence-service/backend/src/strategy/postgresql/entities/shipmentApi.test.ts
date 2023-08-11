import axios from "axios";

describe("shipment api", () => {
  const shipmentUrl = "http://localhost:8000/shipments";
  const customerUrl = "http://localhost:8000/customers";
  let createdShipmentId: number;
  let createdCustomerId: number;

  beforeAll(async () => {
    const newCustomer = {
      name: "Jane Smith",
      address: "123 Main Street",
      phone_number1: "123-456-7890",
      phone_number2: "234-567-8901",
    };

    const response = await axios.post(customerUrl, newCustomer);
    createdCustomerId = response.data.id;
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

  it("retrieves all shipments", async () => {


    const response = await axios.get(shipmentUrl);


    expect(response.status).toBe(200);
    expect(response.data).toBeInstanceOf(Array);
  });

  it("retrieves a shipment by id", async () => {

    const response = await axios.get(`${shipmentUrl}/${createdShipmentId}`);

    expect(response.status).toBe(200);
    expect(response.data.shipment_id).toBe(createdShipmentId);
  });

  it("updates a shipment", async () => {
    const updatedShipment = {
      weight: 1200,
    };
    const response = await axios.put(`${shipmentUrl}/${createdShipmentId}`, updatedShipment);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  it("deletes a shipment", async () => {

    const response = await axios.delete(`${shipmentUrl}/${createdShipmentId}`);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  afterAll(async () => {
    // Optionally, clean up the created customer
    await axios.delete(`${customerUrl}/${createdCustomerId}`);
  });
});

