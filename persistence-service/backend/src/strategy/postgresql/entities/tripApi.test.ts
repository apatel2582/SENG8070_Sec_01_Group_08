import axios from "axios";

describe("trip api", () => {
  const truckUrl = "http://localhost:8000/trucks";
  const employeeUrl = "http://localhost:8000/employees";
  const customerUrl = "http://localhost:8000/customers";
  const shipmentUrl = "http://localhost:8000/shipments";
  const tripUrl = "http://localhost:8000/trips";
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

	    // Handle error as needed
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

