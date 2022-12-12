import { APIGatewayEvent, Context } from "aws-lambda";
import { ResultRepository } from "../../repository/result";
import { apiResponse } from "../../utils";

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const clientName = event.queryStringParameters?.client || "";
  const driverCnic = event.queryStringParameters?.driver || "";
  const assessmentName = event.queryStringParameters?.assessment || "";
  try {
    const result = await ResultRepository.getDriverResult(
      clientName,
      driverCnic,
      assessmentName
    );
    console.log("RESULT: ", result);
  } catch (err) {
    console.log("ERROR: ", err);
  }
  try {
    const result = await ResultRepository.getDriverResult2(
      clientName,
      driverCnic,
      assessmentName
    );
    console.log("RESULT2: ", result);
  } catch (error) {
    console.log('ERROR: ', error)
  }
  try {
    const result = await ResultRepository.getDriverResult3(
      clientName,
      driverCnic,
      assessmentName
    );
    console.log("RESULT3: ", result);
  } catch (error) {
    console.log('ERROR: ', error)
  }
  try {
    const result = await ResultRepository.getDriverResult4(
      clientName,
      driverCnic,
      assessmentName
    );
    console.log("RESULT4: ", result);
  } catch (error) {
    console.log('ERROR: ', error)
  }

  return apiResponse(200, "success");
};
