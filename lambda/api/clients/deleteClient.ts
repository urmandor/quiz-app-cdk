import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { AssessmentRepository } from "../../../repository/assessment";
import { ClientRepository, DeleteClient } from "../../../repository/client";
import { DriverRepository } from "../../../repository/driver";
import { S3Repository } from "../../../repository/s3";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const clientName = event.pathParameters?.clientName;
  if (!clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  try {
    const decodedClientName = decodeURI(clientName);
    const client = await ClientRepository.getClientByName(decodedClientName);
    if (!client) {
      return apiResponse(404, "Client not found!");
    }

    const requests = [];

    requests.push(AssessmentRepository.deleteAllAssessments(decodedClientName));
    requests.push(DriverRepository.deleteAllDrivers(decodedClientName));
    requests.push(
      ClientRepository.deleteClient({ clientName: decodedClientName })
    );
    if (client.imageUrl) {
      console.log('deleting', client.imageUrl);
      requests.push(S3Repository.deleteObject(client.imageUrl));
    }

    await Promise.all(requests);

    return apiResponse(200, "Client deleted successfully");
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
