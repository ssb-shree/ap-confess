import type { HttpStatusCode } from "../constants/status-codes";

class ApiError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    override message: string,
    public errorCode?: 500
  ) {
    super(message);
  }
}

export default ApiError;
