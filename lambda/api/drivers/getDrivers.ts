import { APIGatewayEvent, Context } from "aws-lambda";
import { DriverRepository } from "../../../repository/driver";
import { apiResponse } from "../../../utils";

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const client = event.queryStringParameters?.client;
  const limit =
    (event.queryStringParameters?.limit &&
      Number(event.queryStringParameters?.limit)) ||
    undefined;
  const offset =
    event.queryStringParameters?.offset &&
    JSON.parse(
      Buffer.from(event.queryStringParameters?.offset, "base64").toString()
    );
  if (!client) {
    return apiResponse(400, "Please provide a client");
  }
  try {
    const drivers = await DriverRepository.getAllDrivers(client, limit, offset);
    return apiResponse(200, drivers);
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
