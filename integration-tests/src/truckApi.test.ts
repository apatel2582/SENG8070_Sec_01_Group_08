//entities/truckApi.test.ts
import axios, { AxiosError } from "axios";

describe("truck api", () => {
  const truckUrl = "http://reverse-proxy/api/trucks";
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

describe("negative tests for createTruck", () => {
  const truckUrl = "http://reverse-proxy/api/trucks";

  it("fails to create a truck with missing fields", async () => {
    const newTruck = {
      // brand and other fields are missing
      load: 5000,
    };

    try {
      await axios.post(truckUrl, newTruck);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('Error response:', axiosError.response?.data);
      expect(axiosError.response?.status).toBe(503);
      return;
    }
    fail('Expected API to return an error but it succeeded.');
  });

  it("fails to create a truck with invalid data types for fields", async () => {
    const newTruck = {
      brand: 12345, // number instead of string
      load: "invalidLoad", // string instead of number
      capacity: 10000,
      year: "2020", // string instead of number
      number_of_repairs: "two", // string instead of number
    };

    try {
      await axios.post(truckUrl, newTruck);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('Error response:', axiosError.response?.data);
      expect(axiosError.response?.status).toBe(503);
      return;
    }
    fail('Expected API to return an error but it succeeded.');
  });

});

describe("edge cases for createTruck", () => {
  const truckUrl = "http://reverse-proxy/api/trucks";
  let createdTruckId: number;

  it("creates a truck with edge values", async () => {
    const truck = {
      brand: 'A'.repeat(100),
      load: 16000,
      capacity: 16000,
      year: 1950,
      number_of_repairs: 0
    };

    try {
      const response = await axios.post(truckUrl, truck);
      createdTruckId = response.data.id;  // Storing the created truck's ID
      console.log('Edge case response:', response.data);
      expect(response.status).toBe(201);
    } catch (error) {
      console.error('Unexpected error:', error);
      fail('Unexpected error for edge case.');
    }
  });

  // Cleanup after all tests in this describe block have run
  afterAll(async () => {
    if (createdTruckId) {
      try {
        const response = await axios.delete(`${truckUrl}/${createdTruckId}`);
        console.log('Truck cleanup response:', response.data);
      } catch (error) {
        console.error('Error during truck cleanup:', error);
      }
    }
  });
});


describe("negative tests for createTruck", () => {
  const truckUrl = "http://reverse-proxy/api/trucks";

  it("fails to create a truck with invalid values", async () => {
    const truck = {
      brand: 'A'.repeat(101),
      load: -5000,
      capacity: 20001,
      year: 1949,
      number_of_repairs: 200
    };

    try {
      await axios.post(truckUrl, truck);
      fail('Expected API to return an error but it succeeded.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('Expected error response:', axiosError.response?.data);
      expect(axiosError.response?.status).toBe(503);
    }
  });
});
