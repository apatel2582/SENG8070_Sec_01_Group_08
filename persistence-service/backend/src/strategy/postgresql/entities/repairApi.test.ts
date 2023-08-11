import axios from "axios";

describe("repair api", () => {
  const repairUrl = "http://localhost:8000/repairs";
  const employeeUrl = "http://localhost:8000/employees";
  const truckUrl = "http://localhost:8000/trucks";
  let createdRepairId: number;
  let mechanic_id: number;
  let truck_id: number;

  const createMechanic = async () => {
    const newEmployee = {
      name: "John",
      surname: "Doe",
      seniority: "Senior",
      role: "Mechanic",
      category: "A",
    };
    const response = await axios.post(employeeUrl, newEmployee);
    return response.data.id;
  };

  const createTruck = async () => {
    const newTruck = {
      brand: "Volvo",
      load: 5000,
      capacity: 10000,
      year: 2020,
      number_of_repairs: 2,
    };
    const response = await axios.post(truckUrl, newTruck);
    return response.data.id;
  };

  beforeAll(async () => {
    mechanic_id = await createMechanic();
    truck_id = await createTruck();
  });

  it("creates a new repair", async () => {
    const newRepair = {
      mechanic_id: mechanic_id,
      truck_id: truck_id,
      estimated_time: 3,
    };

    const response = await axios.post(repairUrl, newRepair);

    createdRepairId = response.data.id;


    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("retrieves all repairs", async () => {
    const response = await axios.get(repairUrl);

    expect(response.status).toBe(200);
    expect(response.data).toBeInstanceOf(Array);
  });

  it("retrieves a repair by id", async () => {
    const response = await axios.get(`${repairUrl}/${createdRepairId}`);

    expect(response.status).toBe(200);
    expect(response.data.repair_id).toBe(createdRepairId);
  });

  it("updates a repair", async () => {
    const updatedRepair = {
      estimated_time: 4,
    };

    const response = await axios.put(`${repairUrl}/${createdRepairId}`, updatedRepair);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  it("deletes a repair", async () => {
    const response = await axios.delete(`${repairUrl}/${createdRepairId}`);


    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  afterAll(async () => {
    // Optionally, clean up created mechanics and trucks
    await axios.delete(`${employeeUrl}/${mechanic_id}`);
    await axios.delete(`${truckUrl}/${truck_id}`);
  });
});

