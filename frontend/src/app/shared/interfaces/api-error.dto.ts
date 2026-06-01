export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  debugMessage?: string;
  path: string;
  fieldErrors?: Record<string, string>;
}
