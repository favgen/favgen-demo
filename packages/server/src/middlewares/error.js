// eslint-disable-next-line no-unused-vars
function errorMiddleware(error, _request, response, _next) {
  const status = error?.status || 500;
  const message = error?.message || "Something went wrong.";
  response.status(status).send({ status, message });
}

export default errorMiddleware;
