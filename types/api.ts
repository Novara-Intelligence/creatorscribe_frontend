export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export class AppError extends Error {
  code: string;
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, code: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
