import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '@/shared/interfaces/api-error.dto';

export function extractApiError(err: unknown): { message: string; description?: string } {
  if (!(err instanceof HttpErrorResponse)) {
    return { message: 'Erro inesperado. Tente novamente.' };
  }

  const body = err.error as ApiErrorResponse | null;
  const message = body?.message || 'Erro ao processar o pedido.';

  if (body?.fieldErrors && Object.keys(body.fieldErrors).length > 0) {
    const description = Object.entries(body.fieldErrors)
      .map(([field, msg]) => `• ${field}: ${msg}`)
      .join('\n');
    return { message, description };
  }

  return { message };
}
