export const apiRoutes: {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  lambda: string;
}[] = [
  {
    path: "hello",
    method: "GET",
    lambda: "helloFunction",
  },
];
