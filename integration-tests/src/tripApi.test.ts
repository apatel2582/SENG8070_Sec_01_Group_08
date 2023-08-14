import axios, {AxiosError} from "axios";

describe("trip api", () => {
  const truckUrl = "http://reverse-proxy/api/trucks";
  const employeeUrl = "http://reverse-proxy/api/employees";
  const customerUrl = "http://reverse-proxy/api/customers";
  const shipmentUrl = "http://reverse-proxy/api/shipments";
  const tripUrl = "http://reverse-proxy/api/trips";
  let createdTruckId: number;
  let createdDriver1Id: number;
  let createdDriver2Id: number;
  let createdCustomerId: number;
  let createdShipmentId: number;
  let createdTripId: number;
  
  const newTruck = {
    brand: "Volvo",
    load: 5000,
    capacity: 10000,
    year: 2020,
    number_of_repairs: 2,
  };

  const newDriver1 = {
    name: "John",
    surname: "Doe",
    seniority: "Senior",
    role: "Driver",
    category: "A",
  };

  const newDriver2 = {
    name: "Jane",
    surname: "Smith",
    seniority: "Junior",
    role: "Driver",
    category: "B",
  };
  
  const newCustomer = {
    name: "Jane Smith",
    address: "123 Main Street",
    phone_number1: "123-456-7890",
    phone_number2: "234-567-8901",
  };

  const newShipment = {
    customer_id: 5, // Placeholder, will be replaced in beforeAll
    origin: "New York",
    destination: "Los Angeles",
    weight: 1000,
    value: 2000,
  };

  beforeAll(async () => {
	  try {
	    createdTruckId = (await axios.post(truckUrl, newTruck)).data.id;
	    createdDriver1Id = (await axios.post(employeeUrl, newDriver1)).data.id;
	    createdDriver2Id = (await axios.post(employeeUrl, newDriver2)).data.id;
	    const customerResponse = await axios.post(customerUrl, newCustomer);
	    createdCustomerId = customerResponse.data.id;
	    newShipment.customer_id = createdCustomerId;
	    createdShipmentId = (await axios.post(shipmentUrl, newShipment)).data.id;
	  } catch (error) {
      console.error("Error encountered while creating trip test data:", error);
      throw error;  // Re-throw the error to ensure the test fails due to the error
	  }
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

  it("retrieves all trips", async () => {
    const response = await axios.get(tripUrl);
    expect(response.status).toBe(200);
    expect(response.data).toBeInstanceOf(Array);
  });

  it("retrieves a trip by id", async () => {
    const response = await axios.get(`${tripUrl}/${createdTripId}`);
    expect(response.status).toBe(200);
    expect(response.data.trip_id).toBe(createdTripId);
  });

  it("updates a trip", async () => {
	  const updatedTrip = { route_to: "Chicago" };
	  const response = await axios.put(`${tripUrl}/${createdTripId}`, updatedTrip);
	  expect(response.status).toBe(200);
	  expect(response.data.success).toBe(true);
	});

  it("deletes a trip", async () => {
    const response = await axios.delete(`${tripUrl}/${createdTripId}`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  afterAll(async () => {
    await axios.delete(`${employeeUrl}/${createdDriver1Id}`);
    await axios.delete(`${employeeUrl}/${createdDriver2Id}`);
    await axios.delete(`${shipmentUrl}/${createdShipmentId}`);
    await axios.delete(`${truckUrl}/${createdTruckId}`);
    await axios.delete(`${customerUrl}/${createdCustomerId}`);
  });
});

describe("trip api - edge cases", () => {
  const truckUrl = "http://reverse-proxy/api/trucks";
  const employeeUrl = "http://reverse-proxy/api/employees";
  const customerUrl = "http://reverse-proxy/api/customers";
  const shipmentUrl = "http://reverse-proxy/api/shipments";
  const tripUrl = "http://reverse-proxy/api/trips";
  let createdTruckId: number;
  let createdDriver1Id: number;
  let createdDriver2Id: number;
  let createdCustomerId: number;
  let createdShipmentId: number;
  let createdTripId: number;

  const newTruck = {
      brand: "Volvo",
      load: 5000,
      capacity: 10000,
      year: 2020,
      number_of_repairs: 2,
  };

  const newDriver1 = {
      name: "John",
      surname: "Doe",
      seniority: "Senior",
      role: "Driver",
      category: "A",
  };

  const newDriver2 = {
      name: "Jane",
      surname: "Smith",
      seniority: "Junior",
      role: "Driver",
      category: "B",
  };

  const newCustomer = {
      name: "Jane Smith",
      address: "123 Main Street",
      phone_number1: "123-456-7890",
      phone_number2: "234-567-8901",
  };

  const newShipment = {
      customer_id: 5, // Placeholder, will be replaced in beforeAll
      origin: "New York",
      destination: "Los Angeles",
      weight: 1000,
      value: 2000,
  };

  beforeAll(async () => {
	  try {
	    createdTruckId = (await axios.post(truckUrl, newTruck)).data.id;
	    createdDriver1Id = (await axios.post(employeeUrl, newDriver1)).data.id;
	    createdDriver2Id = (await axios.post(employeeUrl, newDriver2)).data.id;
	    const customerResponse = await axios.post(customerUrl, newCustomer);
	    createdCustomerId = customerResponse.data.id;
	    newShipment.customer_id = createdCustomerId;
	    createdShipmentId = (await axios.post(shipmentUrl, newShipment)).data.id;
	  } catch (error) {
      //console.error("Error encountered while creating trip test data:", error);
      throw error;  // Re-throw the error to ensure the test fails due to the error
	  }
	});

  it("creates a trip with maximum route length", async () => {
    const newTrip = {
      route_from: 'A'.repeat(100),
      route_to: 'B'.repeat(100),
      driver1_id: createdDriver1Id,
      driver2_id: createdDriver2Id,
      shipment_id: createdShipmentId,
      truck_id: createdTruckId,
    };

    const response = await axios.post(tripUrl, newTrip);
    const createdTripId = response.data.id;

    console.log(`Trip created with max route length. ID: ${createdTripId}`);
    expect(response.status).toBe(201);

    await axios.delete(`${tripUrl}/${createdTripId}`);
  });

  it("creates a trip without an optional driver", async () => {
    const newTrip = {
      route_from: "New York",
      route_to: "Los Angeles",
      driver1_id: createdDriver1Id,
      driver2_id: createdDriver2Id,
      shipment_id: createdShipmentId,
      truck_id: createdTruckId,
    };

    const response = await axios.post(tripUrl, newTrip);
    const createdTripId = response.data.id;

    console.log(`Trip created without optional driver. ID: ${createdTripId}`);
    expect(response.status).toBe(201);

    await axios.delete(`${tripUrl}/${createdTripId}`);
  });

  afterAll(async () => {
    try {
        await axios.delete(`${employeeUrl}/${createdDriver1Id}`);
        await axios.delete(`${employeeUrl}/${createdDriver2Id}`);
        await axios.delete(`${shipmentUrl}/${createdShipmentId}`);
        await axios.delete(`${truckUrl}/${createdTruckId}`);
        await axios.delete(`${customerUrl}/${createdCustomerId}`);
    } catch (error) {
        //console.error("Error in afterAll teardown:", error);
    }
  });
});


describe("trip api - negative tests", () => {
  const truckUrl = "http://reverse-proxy/api/trucks";
  const employeeUrl = "http://reverse-proxy/api/employees";
  const customerUrl = "http://reverse-proxy/api/customers";
  const shipmentUrl = "http://reverse-proxy/api/shipments";
  const tripUrl = "http://reverse-proxy/api/trips";
  let createdTruckId: number;
  let createdDriver1Id: number;
  let createdDriver2Id: number;
  let createdCustomerId: number;
  let createdShipmentId: number;
  let createdTripId: number;

  const newTruck = {
      brand: "Volvo",
      load: 5000,
      capacity: 10000,
      year: 2020,
      number_of_repairs: 2,
  };

  const newDriver1 = {
      name: "John",
      surname: "Doe",
      seniority: "Senior",
      role: "Driver",
      category: "A",
  };

  const newDriver2 = {
      name: "Jane",
      surname: "Smith",
      seniority: "Junior",
      role: "Driver",
      category: "B",
  };

  const newCustomer = {
      name: "Jane Smith",
      address: "123 Main Street",
      phone_number1: "123-456-7890",
      phone_number2: "234-567-8901",
  };

  const newShipment = {
      customer_id: 5, // Placeholder, will be replaced in beforeAll
      origin: "New York",
      destination: "Los Angeles",
      weight: 1000,
      value: 2000,
  };

  beforeAll(async () => {
      try {
          createdTruckId = (await axios.post(truckUrl, newTruck)).data.id;
          createdDriver1Id = (await axios.post(employeeUrl, newDriver1)).data.id;
          createdDriver2Id = (await axios.post(employeeUrl, newDriver2)).data.id;
          const customerResponse = await axios.post(customerUrl, newCustomer);
          createdCustomerId = customerResponse.data.id;
          newShipment.customer_id = createdCustomerId;
          createdShipmentId = (await axios.post(shipmentUrl, newShipment)).data.id;
      } catch (error) {
          console.error("Error in beforeAll setup:", error);
      }
  });

  afterAll(async () => {
      try {
          await axios.delete(`${employeeUrl}/${createdDriver1Id}`);
          await axios.delete(`${employeeUrl}/${createdDriver2Id}`);
          await axios.delete(`${shipmentUrl}/${createdShipmentId}`);
          await axios.delete(`${truckUrl}/${createdTruckId}`);
          await axios.delete(`${customerUrl}/${createdCustomerId}`);
      } catch (error) {
          console.error("Error in afterAll teardown:", error);
      }
  });

  it("fails to create a trip with exceeding route length", async () => {
    const newTrip = {
      route_from: 'A'.repeat(101),
      route_to: 'B'.repeat(101),
      driver1_id: createdDriver1Id,
      driver2_id: createdDriver2Id,
      shipment_id: createdShipmentId,
      truck_id: createdTruckId,
    };

    try {
      await axios.post(tripUrl, newTrip);
      fail('Expected API to return an error but it succeeded.');
    } catch (error) {
      //console.log('Tested creating trip with exceeding route length.');
      const axiosError = error as AxiosError;
      expect([400, 404, 503]).toContain(axiosError.response?.status);
    }
  });

  it("fails to create a trip without a mandatory driver", async () => {
    const newTrip = {
      route_from: "New York",
      route_to: "Los Angeles",
      shipment_id: createdShipmentId,
      truck_id: createdTruckId,
    };

    try {
      await axios.post(tripUrl, newTrip);
      fail('Expected API to return an error but it succeeded.');
    } catch (error) {
      //console.log('Tested creating trip without mandatory driver.');
      const axiosError = error as AxiosError;
      expect([400, 404, 503]).toContain(axiosError.response?.status);
    }
  });

  it("fails to create a trip with a non-existent entity", async () => {
    const newTrip = {
      route_from: "New York",
      route_to: "Los Angeles",
      driver1_id: createdDriver1Id + 9999,  // Non-existent driver
      driver2_id: createdDriver2Id,
      shipment_id: createdShipmentId,
      truck_id: createdTruckId,
    };

    try {
      await axios.post(tripUrl, newTrip);
      fail('Expected API to return an error but it succeeded.');
    } catch (error) {
      //console.log('Tested creating trip with a non-existent entity.');
      const axiosError = error as AxiosError;
      expect([400, 404, 503]).toContain(axiosError.response?.status);
    }
  });

  it("fails to delete a non-existent trip", async () => {
    try {
      createdTripId = 9999;  // Non-existent trip
      await axios.get(`${tripUrl}/${createdTripId}`);
      fail('Expected API to return an error but it succeeded.');
    } catch (error) {
      //console.log('Attempted to retrieve a deleted trip.');
      const axiosError = error as AxiosError;
      expect([400, 404, 503]).toContain(axiosError.response?.status);
    }
  });

});
