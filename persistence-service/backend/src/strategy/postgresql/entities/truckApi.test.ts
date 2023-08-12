import axios from "axios";

describe("truck api", () => {
  const truckUrl = "http://localhost:8000/trucks";
  let createdTruckId: number; // Explicitly specify the type here

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

  it("retrieves all trucks", async () => {

    const response = await axios.get(truckUrl);

    expect(response.status).toBe(200);
    expect(response.data).toBeInstanceOf(Array);
  });

  it("retrieves a truck by id", async () => {

    const response = await axios.get(`${truckUrl}/${createdTruckId}`);

    expect(response.status).toBe(200);
    expect(response.data.truck_id).toBe(createdTruckId);
  });

  it("updates a truck", async () => {
    const updatedTruck = {
      brand: "Mercedes",
    };
    const response = await axios.put(`${truckUrl}/${createdTruckId}`, updatedTruck);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  it("deletes a truck", async () => {
    const response = await axios.delete(`${truckUrl}/${createdTruckId}`);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });
});

