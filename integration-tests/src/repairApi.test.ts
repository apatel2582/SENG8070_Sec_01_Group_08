import axios, { AxiosError } from "axios";

describe("repair api", () => {
  const repairUrl = "http://reverse-proxy/api/repairs";
  const employeeUrl = "http://reverse-proxy/api/employees";
  const truckUrl = "http://reverse-proxy/api/trucks";
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


describe("repair api - edge cases", () => {
  const repairUrl = "http://reverse-proxy/api/repairs";
  const employeeUrl = "http://reverse-proxy/api/employees";
  const truckUrl = "http://reverse-proxy/api/trucks";
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
      
      try {
          const response = await axios.post(employeeUrl, newEmployee);
          console.log(`Created mechanic with ID: ${response.data.id}`);
          mechanic_id = response.data.id;
          return response.data.id;
      } catch (error) {
          console.error('Error creating mechanic:', error);
      }
  };

  const createTruck = async () => {
      const newTruck = {
          brand: "Volvo",
          load: 5000,
          capacity: 10000,
          year: 2020,
          number_of_repairs: 2,
      };

      try {
          const response = await axios.post(truckUrl, newTruck);
          console.log(`Created truck with ID: ${response.data.id}`);
          truck_id = response.data.id;
          return response.data.id;
      } catch (error) {
          console.error('Error creating truck:', error);
      }
  };


  it("creates a repair with minimum estimated time", async () => {
    const newRepair = {
      mechanic_id: await createMechanic(),
      truck_id: await createTruck(),
      estimated_time: 0,
    };
    const response = await axios.post(repairUrl, newRepair);
    createdRepairId = response.data.id;
    console.log('Tested repair with minimum estimated time.');
    expect(response.status).toBe(201);
  });

  it("creates a repair with maximum estimated time", async () => {
    const newRepair = {
      mechanic_id: await createMechanic(),
      truck_id: await createTruck(),
      estimated_time: 30,
    };
    const response = await axios.post(repairUrl, newRepair);
    createdRepairId = response.data.id;
    console.log('Tested repair with maximum estimated time.');
    expect(response.status).toBe(201);
  });

  afterAll(async () => {
    if (createdRepairId) {
      await axios.delete(`${repairUrl}/${createdRepairId}`);
      console.log(`Deleted repair with ID: ${createdRepairId}`);
    }
  });
});

describe("repair api - negative tests", () => {
  const repairUrl = "http://reverse-proxy/api/repairs";
  const employeeUrl = "http://reverse-proxy/api/employees";
  const truckUrl = "http://reverse-proxy/api/trucks";
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

      try {
          const response = await axios.post(employeeUrl, newEmployee);
          console.log(`Created mechanic with ID: ${response.data.id}`);
          return response.data.id;
      } catch (error) {
          console.error('Error creating mechanic:', error);
      }
  };

  const createTruck = async () => {
      const newTruck = {
          brand: "Volvo",
          load: 5000,
          capacity: 10000,
          year: 2020,
          number_of_repairs: 2,
      };

      try {
          const response = await axios.post(truckUrl, newTruck);
          console.log(`Created truck with ID: ${response.data.id}`);
          return response.data.id;
      } catch (error) {
          console.error('Error creating truck:', error);
      }
  };

  it("fails to create a repair with exceeding estimated time", async () => {
    const newRepair = {
      mechanic_id: await createMechanic(),
      truck_id: await createTruck(),
      estimated_time: 31,
    };
    try {
      await axios.post(repairUrl, newRepair);
    } catch (error) {
      console.log('Tested exceeding estimated time.');
      const axiosError = error as AxiosError;
      expect([400, 404, 503]).toContain(axiosError.response?.status);
    }
  });

  it("fails to create a repair with negative estimated time", async () => {
    const newRepair = {
      mechanic_id: await createMechanic(),
      truck_id: await createTruck(),
      estimated_time: -5,
    };
    try {
      await axios.post(repairUrl, newRepair);
    } catch (error) {
      console.log('Tested negative estimated time.');
      const axiosError = error as AxiosError;
      expect([400, 404, 503]).toContain(axiosError.response?.status);
    }
  });

  it("fails to create a repair without mechanic or truck", async () => {
    const newRepair = {
      estimated_time: 5,
    };
    try {
      await axios.post(repairUrl, newRepair);
    } catch (error) {
      console.log('Tested creating repair without mechanic or truck.');
      const axiosError = error as AxiosError;
      expect([400, 404, 503]).toContain(axiosError.response?.status);
    }
  });

  afterAll(async () => {
    // Optionally, clean up created mechanics and trucks
    if (mechanic_id) {
      await axios.delete(`${employeeUrl}/${mechanic_id}`);
    }
    if (truck_id) {
      await axios.delete(`${truckUrl}/${truck_id}`);
    }
  });
});
