type StatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;
export const apiResponse = (statusCode: StatusCode, data: any) => {
  console.log('DATA:', data);
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  };
};
