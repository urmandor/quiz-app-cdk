import { APIGatewayEvent, Context } from "aws-lambda";
import { DriverRepository } from "../../../repository/driver";
import { ResultRepository } from "../../../repository/result";
import { apiResponse } from "../../../utils";

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const client = event.queryStringParameters?.client;
  if (!client) {
    return apiResponse(400, "Please provide a client");
  }

  const driverCnic = event.pathParameters?.driver;
  if (!driverCnic) {
    return apiResponse(400, "Please provide a driver");
  }

  const assessmentName = event.pathParameters?.assessmentType;
  if (!assessmentName) {
    return apiResponse(400, "Please provide an assessment");
  }

  const driver = await DriverRepository.getDriver(client, driverCnic);
  if (!driver) {
    return apiResponse(404, "Driver does not exists");
  }

  const decodedClient = decodeURI(client);
  const decodedDriverCnic = decodeURI(driverCnic);
  const decodedAssessment = decodeURI(assessmentName);
  const result = await ResultRepository.getDriverResult(
    decodedClient,
    decodedDriverCnic,
    decodedAssessment
  );

  return apiResponse(200, {
    ...result,
    clientName: decodedClient,
    driverCnic: decodedDriverCnic,
    driverName: driver.driverName,
  });
};
