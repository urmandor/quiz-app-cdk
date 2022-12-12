import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DriverRepository } from "../../../repository/driver";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const clientName = event.queryStringParameters?.client;
  const cnic = event.pathParameters?.cnic;
  if (!cnic) {
    return apiResponse(400, "Please provide the driver's CNIC number");
  }
  if (!clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  try {
    await DriverRepository.deleteDriver(decodeURI(clientName), decodeURI(cnic));
    return apiResponse(200, "Driver deleted successfully");
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
