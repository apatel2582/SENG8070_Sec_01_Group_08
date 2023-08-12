import axios from "axios";

describe("customer api", () => {
  const customerUrl = "http://localhost:8000/customers";
  let createdCustomerId: number;

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

  it("retrieves all customers", async () => {


    const response = await axios.get(customerUrl);



    expect(response.status).toBe(200);
    expect(response.data).toBeInstanceOf(Array);
  });

  it("retrieves a customer by id", async () => {


    const response = await axios.get(`${customerUrl}/${createdCustomerId}`);



    expect(response.status).toBe(200);
    expect(response.data.customer_id).toBe(createdCustomerId);
  });

  it("updates a customer", async () => {
    const updatedCustomer = {
      address: "456 New Street",
    };



    const response = await axios.put(`${customerUrl}/${createdCustomerId}`, updatedCustomer);



    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  it("deletes a customer", async () => {


    const response = await axios.delete(`${customerUrl}/${createdCustomerId}`);



    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });
});

