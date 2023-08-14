import axios, { AxiosError } from "axios";

describe("employee api", () => {
  const employeeUrl = "http://reverse-proxy/api/employees";
  let createdEmployeeId: number;

  it("creates a new employee", async () => {
    const newEmployee = {
      name: "John",
      surname: "Doe",
      seniority: "Senior",
      role: "Driver",
      category: "A",
    };
    const response = await axios.post(employeeUrl, newEmployee);
    createdEmployeeId = response.data.id;
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("retrieves all employees", async () => {
    const response = await axios.get(employeeUrl);
    expect(response.status).toBe(200);
    expect(response.data).toBeInstanceOf(Array);
  });

  it("retrieves an employee by id", async () => {
    const response = await axios.get(`${employeeUrl}/${createdEmployeeId}`);
    expect(response.status).toBe(200);
    expect(response.data.employee_id).toBe(createdEmployeeId);
  });

  it("updates an employee", async () => {
    const updatedEmployee = {
      name: "Jane",
    };
    const response = await axios.put(`${employeeUrl}/${createdEmployeeId}`, updatedEmployee);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  it("deletes an employee", async () => {
    const response = await axios.delete(`${employeeUrl}/${createdEmployeeId}`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });
});


describe("employee api edge cases", () => {
  const employeeUrl = "http://reverse-proxy/api/employees";
  let createdEmployeeIds: number[] = []; // This array will store the IDs of the created employees

  it("creates an employee with maximum allowed field lengths", async () => {
    const edgeEmployee = {
      name: 'A'.repeat(100),
      surname: 'B'.repeat(100),
      seniority: 'C'.repeat(100),
      role: 'D'.repeat(100),
      category: 'E'.repeat(100),
      specialized_brand: 'F'.repeat(100)
    };
    const response = await axios.post(employeeUrl, edgeEmployee);
    createdEmployeeIds.push(response.data.id); // Storing the created employee's ID
    console.log('Employee with maximum allowed field lengths:', response.data);
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("creates an employee with minimum field lengths", async () => {
    const edgeEmployee = {
      name: 'A',
      surname: 'B',
      seniority: 'C',
      role: 'D',
      category: 'E',
    };
    const response = await axios.post(employeeUrl, edgeEmployee);
    createdEmployeeIds.push(response.data.id); // Storing the created employee's ID
    console.log('Employee with minimum field lengths:', response.data);
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
  });

  it("updates an employee to have maximum allowed field lengths", async () => {
    const updatedEmployee = {
      name: 'Z'.repeat(100),
      surname: 'Y'.repeat(100)
    };
    const response = await axios.put(`${employeeUrl}/${createdEmployeeIds[0]}`, updatedEmployee); // Using the ID of the first created employee
    console.log('Updated employee to maximum allowed field lengths:', response.data);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  // Cleanup after all tests in this describe block have run
  afterAll(async () => {
    for (const id of createdEmployeeIds) {
      try {
        const response = await axios.delete(`${employeeUrl}/${id}`);
        console.log('Employee cleanup response:', response.data);
      } catch (error) {
        console.error('Error during employee cleanup:', error);
      }
    }
  });
});


describe("employee api negative tests", () => {
  const employeeUrl = "http://reverse-proxy/api/employees";

  it("fails to create an employee with overlength fields", async () => {
    const invalidEmployee = {
      name: 'A'.repeat(101),
      surname: 'B'.repeat(101)
    };
    try {
      await axios.post(employeeUrl, invalidEmployee);
      fail('Expected API to return an error but it succeeded.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('Expected error response:', axiosError.response?.data);
      expect(axiosError.response?.status).toBe(503);
    }
  });

  it("fails to update a non-existent employee", async () => {
    const updatedEmployee = {
      name: "UpdatedName"
    };
    try {
      await axios.put(`${employeeUrl}/9999`, updatedEmployee); // Assuming 9999 is a non-existent ID
      fail('Expected API to return an error but it succeeded.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('Expected error response:', axiosError.response?.data);
      expect(axiosError.response?.status).toBe(404);
    }
  });

  it("fails to delete a non-existent employee", async () => {
    try {
      await axios.delete(`${employeeUrl}/9999`); // Assuming 9999 is a non-existent ID
      fail('Expected API to return an error but it succeeded.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('Expected error response:', axiosError.response?.data);
      expect(axiosError.response?.status).toBe(404);
    }
  });
});
