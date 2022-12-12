import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DriverRepository, UpdateDriver } from "../../../repository/driver";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const body: UpdateDriver = event.body && JSON.parse(event.body);
  if (!body?.clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  if (!body?.newDriverName) {
    return apiResponse(400, "Please provide the new driver's name");
  }
  try {
    await DriverRepository.updateDriver(body);
    return apiResponse(200, "Driver updated successfully");
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
