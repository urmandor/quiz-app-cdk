export const apiRoutes: {
  [lambda: string]: {
    urlPath: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    handlerPath: string;
  };
} = {
  helloFunction: {
    urlPath: "hello",
    method: "GET",
    handlerPath: "hello",
  },
  
  getClientsFunction: {
    urlPath: "clients",
    method: "GET",
    handlerPath: "clients/getClients",
  },
  editClientFunction: {
    urlPath: "{clientName}",
    method: "PUT",
    handlerPath: "clients/editClient",
  },
  deleteClientFunction: {
    urlPath: "{clientName}",
    method: "DELETE",
    handlerPath: "clients/deleteClient",
  },
  createClientFunction: {
    urlPath: "clients",
    method: "POST",
    handlerPath: "clients/createClient",
  },

  getDriversFunction: {
    urlPath: "drivers",
    method: "GET",
    handlerPath: "drivers/getDrivers",
  },
  editDriverFunction: {
    urlPath: "{cnic}",
    method: "PUT",
    handlerPath: "drivers/editDriver",
  },
  deleteDriverFunction: {
    urlPath: "{cnic}",
    method: "DELETE",
    handlerPath: "drivers/deleteDriver",
  },
  createDriverFunction: {
    urlPath: "drivers",
    method: "POST",
    handlerPath: "drivers/createDriver",
  },

  getAssessmentsFunction: {
    urlPath: "assessments",
    method: "GET",
    handlerPath: "assessments/getAssessments",
  },
  editAssessmentFunction: {
    urlPath: "{assessmentType}",
    method: "PUT",
    handlerPath: "assessments/editAssessment",
  },
  deleteAssessmentFunction: {
    urlPath: "{assessmentType}",
    method: "DELETE",
    handlerPath: "assessments/deleteAssessment",
  },
  createAssessmentFunction: {
    urlPath: "assessments",
    method: "POST",
    handlerPath: "assessments/createAssessment",
  },
  getAllAssessmentQuestionFunction: {
    urlPath: "questions",
    method: "GET",
    handlerPath: "assessments/getQuestions",
  },
  createPreSignedUrlFunction: {
    urlPath: "files",
    method: "POST",
    handlerPath: "files/createPreSignedUrl",
  },

  getClientResultsFunction: {
    urlPath: "results",
    method: "GET",
    handlerPath: "results/getClientResults",
  },
  getDriverResultsFunction: {
    urlPath: "{driver}",
    method: "GET",
    handlerPath: "results/getDriverResults",
  },
  createResultFunction: {
    urlPath: "results",
    method: "POST",
    handlerPath: "results/createResult",
  },
  getDriverResultFunction: {
    urlPath: "{assessmentType}",
    method: "GET",
    handlerPath: "results/getDriverResult",
  },
};
