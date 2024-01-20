import { execSync } from "child_process";

describe("when run key:generate command", () => {
  it("displayed on terminal", () => {
    const result = execSync("npm run key:generate -- --show");

    expect(typeof result.toString()).toBe("string");
  });
});
