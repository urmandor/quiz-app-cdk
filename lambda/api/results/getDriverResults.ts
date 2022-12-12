import { APIGatewayEvent, Context } from "aws-lambda";
import { DriverRepository } from "../../../repository/driver";
import { ResultRepository } from "../../../repository/result";
import { apiResponse } from "../../../utils";

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const limit =
    (event.queryStringParameters?.limit &&
      Number(event.queryStringParameters?.limit)) ||
    undefined;
  const offset =
    event.queryStringParameters?.offset &&
    JSON.parse(
      Buffer.from(event.queryStringParameters?.offset, "base64").toString()
    );

  const client = event.queryStringParameters?.client;
  if (!client) {
    return apiResponse(400, "Please provide a client");
  }

  const driverCnic = event.pathParameters?.driver;
  if (!driverCnic) {
    return apiResponse(400, "Please provide a driver");
  }

  const driver = await DriverRepository.getDriver(client, driverCnic);
  if (!driver) {
    return apiResponse(404, "Driver does not exists");
  }

  const decodedClient = decodeURI(client);
  const decodedDriverCnic = decodeURI(driverCnic);
  const results = await ResultRepository.getDriverResults(
    decodedClient,
    decodedDriverCnic,
    limit,
    offset
  );

  return apiResponse(200, {
    ...results,
    clientName: decodedClient,
    driverCnic: decodedDriverCnic,
    driverName: driver.driverName,
  });
};
