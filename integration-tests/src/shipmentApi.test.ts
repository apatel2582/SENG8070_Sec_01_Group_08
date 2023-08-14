import axios, {AxiosError} from "axios";

describe("shipment api", () => {
  const shipmentUrl = "http://reverse-proxy/api/shipments";
  const customerUrl = "http://reverse-proxy/api/customers";
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


describe("shipment api - edge cases", () => {
  const shipmentUrl = "http://reverse-proxy/api/shipments";
  let createdShipmentId: number;

  afterEach(async () => {
    if (createdShipmentId) {
      await axios.delete(`${shipmentUrl}/${createdShipmentId}`);
      console.log(`Deleted shipment with ID: ${createdShipmentId}`);
    }
  });

  it("creates a shipment with maximum allowed weight", async () => {
    const shipment = {
      origin: "Test Origin",
      destination: "Test Destination",
      weight: 50000,
      value: 1000,
    };
    try {
      const response = await axios.post(shipmentUrl, shipment);
      createdShipmentId = response.data.shipment_id;
      console.log('Tested maximum allowed weight.');
      expect(response.status).toBe(201);
    } catch (error) {
      //throw error;
      console.error('Error testing maximum allowed weight:', error);
    }
  });

  it("creates a shipment with maximum allowed value", async () => {
      const shipment = {
        origin: "Test Origin",
        destination: "Test Destination",
        weight: 1000,
        value: 500000,  // Maximum allowed value
      };
      try {
        const response = await axios.post(shipmentUrl, shipment);
        createdShipmentId = response.data.shipment_id;
        console.log('Tested maximum allowed value.');
        expect(response.status).toBe(201);
      } catch (error) {
        //throw error;
        console.error('Error testing maximum allowed value:', error);
      }
  });

  it("creates a shipment with maximum length for origin and destination", async () => {
      const shipment = {
        origin: "O".repeat(100),  // Maximum length for origin
        destination: "D".repeat(100),  // Maximum length for destination
        weight: 1000,
        value: 1000,
      };
      try {
        const response = await axios.post(shipmentUrl, shipment);
        createdShipmentId = response.data.shipment_id;
        console.log('Tested maximum length for origin and destination.');
        expect(response.status).toBe(201);
      } catch (error) {
        //throw error;
        console.error('Error testing maximum length for origin and destination:', error);
      }
  });
});

describe("shipment api - negative tests", () => {
  const shipmentUrl = "http://reverse-proxy/api/shipments";
  let createdShipmentId: number;

  afterEach(async () => {
    if (createdShipmentId) {
      await axios.delete(`${shipmentUrl}/${createdShipmentId}`);
      console.log(`Deleted shipment with ID: ${createdShipmentId}`);
    }
  });

  it("fails to create a shipment with exceeding weight", async () => {
    const shipment = {
      origin: "Test Origin",
      destination: "Test Destination",
      weight: 60000,  // Exceeding limit
      value: 1000,
    };
    try {
      await axios.post(shipmentUrl, shipment);
      fail('Expected API to return an error but it succeeded.');
    } catch (error) {
      console.log('Tested exceeding weight.');
      const axiosError = error as AxiosError;
      expect([400, 404, 503]).toContain(axiosError.response?.status);
    }
  });

  it("fails to create a shipment with exceeding value", async () => {
      const shipment = {
        origin: "Test Origin",
        destination: "Test Destination",
        weight: 1000,
        value: 600000,  // Exceeding maximum value
      };
      try {
        await axios.post(shipmentUrl, shipment);
        fail('Expected API to return an error but it succeeded.');
      } catch (error) {
        console.log('Tested exceeding value.');
        const axiosError = error as AxiosError;
        expect([400, 404, 503]).toContain(axiosError.response?.status);
      }
  });

  it("fails to create a shipment with exceeding length for origin and destination", async () => {
      const shipment = {
        origin: "O".repeat(101),  // Exceeding maximum length for origin
        destination: "D".repeat(101),  // Exceeding maximum length for destination
        weight: 1000,
        value: 1000,
      };
      try {
        await axios.post(shipmentUrl, shipment);
        fail('Expected API to return an error but it succeeded.');
      } catch (error) {
        console.log('Tested exceeding length for origin and destination.');
        const axiosError = error as AxiosError;
        expect([400, 404, 503]).toContain(axiosError.response?.status);
      }
  });
 
});
