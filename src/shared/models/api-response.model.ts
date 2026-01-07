export class ApiResponse<T> {
  private constructor(
    public readonly message: string,
    public readonly content: T | null,
    public readonly timestamp: Date,
  ) {}

  static success<T>(message: string, content: T | null = null): ApiResponse<T> {
    return new ApiResponse<T>(message, content, new Date());
  }

  static error<T>(message: string, content: T | null = null): ApiResponse<T> {
    return new ApiResponse<T>(message, content, new Date());
  }
}
