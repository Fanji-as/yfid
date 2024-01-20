import { request } from "../../../TestCase.js";
import { StatusCodes } from "http-status-codes";

it("should return 200", async () => {
  const response = await request.get("/v1/app-version");

  expect(response.statusCode).toEqual(StatusCodes.OK);
  expect(response.body).toMatchObject({
    ["app-version"]: process.env.npm_package_version,
  });
});
