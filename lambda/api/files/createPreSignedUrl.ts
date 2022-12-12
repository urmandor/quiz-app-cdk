import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { S3Repository } from "../../../repository/s3";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const { fileName } = event.body && JSON.parse(event.body);
  try {
    const presignedUrl = await S3Repository.createPresignedPost(
      fileName,
      process.env.BUCKET_NAME as string
    );
    return apiResponse(200, presignedUrl);
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
