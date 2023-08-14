import axios, { AxiosError } from "axios";

const gotourl = 'http://reverse-proxy/';

describe("smoke", () => {
  it("persistence-service status is 200", async () => {
    console.log(gotourl);
    let health;
    health = await axios.get(`${gotourl}`);
    console.log(health);
    console.log(health.status);
    expect(health.status).toBe(200);
  });
});
