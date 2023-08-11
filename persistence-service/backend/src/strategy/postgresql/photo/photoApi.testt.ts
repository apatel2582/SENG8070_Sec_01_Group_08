import axios from "axios";

describe("photo api", () => {
  it("returns hello world", async () => {
    const response = await axios.get("http://localhost:8000/photo");

    expect(response).toBe("hello world");
  });
});
