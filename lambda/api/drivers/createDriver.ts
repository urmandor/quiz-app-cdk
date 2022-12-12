import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DriverRepository } from "../../../repository/driver";
import { IDriver } from "../../../entities/Driver";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  console.log('HERE');
  const body: IDriver = event.body && JSON.parse(event.body);
  console.log(body);
  if (!body?.clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  if (!body?.cnic) {
    return apiResponse(400, "Please provide driver's CNIC number");
  }
  if (!body?.driverName) {
    return apiResponse(400, "Please provide driver's name");
  }
  try {
    console.log("getting driver");
    const driver = await DriverRepository.getDriver(body.clientName, body.cnic);
    console.log("driver", driver);
    if (driver) {
      return apiResponse(400, "Driver already exists!");
    }
    console.log("saving new driver");
    await DriverRepository.saveDriver(body);
    console.log("driver saved");
    return apiResponse(200, "Driver created successfully");
  } catch (error) {
    console.log(error);
    return apiResponse(400, (error as Error).message);
  }
};
