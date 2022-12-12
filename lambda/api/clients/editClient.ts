import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { IClient } from "../../../entities/Client";
import { AssessmentRepository } from "../../../repository/assessment";
import { ClientRepository } from "../../../repository/client";
import { DriverRepository } from "../../../repository/driver";
import { S3Repository } from "../../../repository/s3";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const body: IClient = event.body && JSON.parse(event.body);
  const clientName = event.pathParameters?.clientName;
  if (!body?.clientName || !clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  try {
    const decodedClientName = decodeURI(clientName);
    const client = await ClientRepository.getClientByName(decodedClientName);
    if (!client) {
      return apiResponse(404, "Client not found!");
    }

    const newClient = await ClientRepository.getClientByName(body.clientName);
    if (newClient) {
      return apiResponse(400, "Client already exists!");
    }

    if (body.imageUrl && client.imageUrl) {
      await S3Repository.deleteObject(client.imageUrl);
    }

    await ClientRepository.updateClient({
      clientName: decodedClientName,
      newClientName: body.clientName,
      ...(body.imageUrl && { imageUrl: body.imageUrl }),
    });

    {
      const { data: drivers } = await DriverRepository.getAllDrivers(
        decodedClientName
      );
      const requests = drivers.map((driver) =>
        DriverRepository.updateDriver({
          ...driver,
          newDriverName: driver.driverName,
          newClientName: decodedClientName,
        })
      );
      await Promise.all(requests);
    }

    {
      const { data: assessments } =
        await AssessmentRepository.getAllAssessments(decodedClientName);
      const requests = assessments.map((assessment) =>
        AssessmentRepository.updateAssessment({
          ...assessment,
          newClientName: decodedClientName,
        })
      );
      await Promise.all(requests);
    }

    return apiResponse(200, "Client update successfully");
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
