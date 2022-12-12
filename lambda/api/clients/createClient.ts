import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { ClientRepository, DeleteClient } from "../../../repository/client";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const body: DeleteClient = event.body && JSON.parse(event.body);
  if (!body?.clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  try {
    const client = await ClientRepository.getClientByName(body.clientName);
    if (client) {
      return apiResponse(400, "Client already exists!");
    }
    await ClientRepository.saveClient(body);
    return apiResponse(200, "Client created successfully");
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
