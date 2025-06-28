export interface IResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
  method: string;
}