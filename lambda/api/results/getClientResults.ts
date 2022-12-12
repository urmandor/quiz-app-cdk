import { APIGatewayEvent, Context } from "aws-lambda";
import { IAssessmentGroup, IClientResult } from "../../../entities/Result";
import { AggregateResultRepository } from "../../../repository/aggregateResult";
import { ResultRepository } from "../../../repository/result";
import { apiResponse } from "../../../utils";

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const client = event.queryStringParameters?.client;
  if (!client) {
    return apiResponse(400, "Please provide a client");
  }

  const decodedClient = decodeURI(client);
  const result = await AggregateResultRepository.getAggregateResult(
    decodedClient
  );

  console.log("RESSULT", result);

  return apiResponse(200, result);
};
