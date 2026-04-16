import type { AppError } from '../../../application/errors.js';
import { getErrorMessage } from '../../../application/errors.js';

/**
 * Mapeo de errores de dominio a códigos HTTP
 */
export interface HttpErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details?: Record<string, unknown> | undefined;
}

/**
 * Mapea errores de aplicación a respuestas HTTP
 */
export function mapErrorToHttp(error: AppError): HttpErrorResponse {
  switch (error.type) {
    case 'VALIDATION_ERROR':
      return {
        statusCode: 400,
        error: 'Bad Request',
        message: getErrorMessage(error),
        details: { field: error.field },
      };

    case 'NOT_FOUND_ERROR':
      return {
        statusCode: 404,
        error: 'Not Found',
        message: getErrorMessage(error),
        details: { resource: error.resource, id: error.id },
      };

    case 'CONFLICT_ERROR':
      return {
        statusCode: 409,
        error: 'Conflict',
        message: getErrorMessage(error),
        details: error.details,
      };

    case 'INFRA_ERROR':
      return {
        statusCode: 503,
        error: 'Service Unavailable',
        message: getErrorMessage(error),
        details: {
          service: error.service,
          operation: error.operation,
        },
      };

    default:
      const _exhaustive: never = error;
      return _exhaustive;
  }
}
