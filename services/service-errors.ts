export type ServiceErrorCode =
  | "NOT_CONFIGURED"
  | "PERMISSION_DENIED"
  | "NETWORK_UNAVAILABLE"
  | "REFERENCE_VERIFICATION_FAILED"
  | "LOW_CONFIDENCE"
  | "SERVICE_UNAVAILABLE"
  | "CANCELLED";

export class HifzServiceError extends Error {
  constructor(
    public readonly code: ServiceErrorCode,
    message: string,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = "HifzServiceError";
  }
}
