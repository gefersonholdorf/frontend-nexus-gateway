export interface ApiErrorShape {
  status: number;
  code?: string;
  message: string;
}

export class ApiError extends Error implements ApiErrorShape {
  public readonly status: number;
  public readonly code?: string;

  constructor({ status, code, message }: ApiErrorShape) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}