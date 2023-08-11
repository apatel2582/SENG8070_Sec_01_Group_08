import axios from "axios";

describe("employee api", () => {
  const employeeUrl = "http://localhost:8000/employees";
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

