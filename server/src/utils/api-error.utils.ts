class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message = "Something went wrong!",
    errors: any[] = [],
    stack = ""
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // 🔽 Static default errors
  static badRequest(message = "Bad Request", errors: any[] = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized", errors: any[] = []) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = "Forbidden", errors: any[] = []) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = "Not Found", errors: any[] = []) {
    return new ApiError(404, message, errors);
  }

  static conflict(message = "Conflict", errors: any[] = []) {
    return new ApiError(409, message, errors);
  }

  static internal(message = "Internal Server Error", errors: any[] = []) {
    return new ApiError(500, message, errors);
  }
}

export default ApiError;
