export class ApiException extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: Record<string, string[]> | null;

  constructor(
    status: number,
    code: string,
    message: string,
    fieldErrors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }

  isValidation(): boolean {
    return this.fieldErrors !== null;
  }
}
