
class CustomError {
  public message: string;
  public statusCode: number;
  public type: string;
  constructor(message: string, statusCode: number, type: string = 'custom_error') {
    this.message = message;
    this.statusCode = statusCode;
    this.type = type;
  }
}

export { CustomError };