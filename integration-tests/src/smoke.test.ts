import axios from "axios";

const TARGET_URL = "http://127.0.0.1:8000";

describe("smoke", () => {
  it("persistence-service status is 200", async () => {
    console.log(TARGET_URL);
    const health = await axios.get(`${TARGET_URL}`);

    console.log(health.status);
    expect(health.status).toBe(200);
  });
});


