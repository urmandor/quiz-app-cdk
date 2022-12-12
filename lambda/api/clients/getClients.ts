import { APIGatewayEvent, Context } from "aws-lambda";
import { ClientRepository } from "../../../repository/client";
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
  const clients = await ClientRepository.getAllClients(limit, offset);
  return apiResponse(200, clients);
};
