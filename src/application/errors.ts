/** Errores de validación - entrada inválida */
export type ValidationError = {
  type: 'VALIDATION_ERROR';
  field: string;
  message: string;
};

/** Errores de recurso no encontrado */
export type NotFoundError = {
  type: 'NOT_FOUND_ERROR';
  resource: string;
  id: string;
};

/** Errores de conflicto - estado inválido o duplicado */
export type ConflictError = {
  type: 'CONFLICT_ERROR';
  reason: string;
  details?: Record<string, unknown>;
};

/** Errores de infraestructura - persistencia, serviços externos etc */
export type InfraError = {
  type: 'INFRA_ERROR';
  service: string;
  operation: string;
  message: string;
};

/** Error genérico de aplicación */
export type AppError = 
  | ValidationError 
  | NotFoundError 
  | ConflictError 
  | InfraError;

/**
 * Factory functions para crear errores con type safety
 */
export const Errors = {
  validation: (field: string, message: string): ValidationError => ({
    type: 'VALIDATION_ERROR',
    field,
    message,
  }),

  notFound: (resource: string, id: string): NotFoundError => ({
    type: 'NOT_FOUND_ERROR',
    resource,
    id,
  }),

  conflict: (reason: string, details?: Record<string, unknown>): ConflictError => ({
    type: 'CONFLICT_ERROR',
    reason,
    ...(details ? { details } : {}), // Solo agrega la propiedad si existe
  }),

  infra: (service: string, operation: string, message: string): InfraError => ({
    type: 'INFRA_ERROR',
    service,
    operation,
    message,
  }),
};

/**
 * Helper para obtener mensaje legible de un error
 */
export const getErrorMessage = (error: AppError): string => {
  switch (error.type) {
    case 'VALIDATION_ERROR':
      return `Invalid ${error.field}: ${error.message}`;
    case 'NOT_FOUND_ERROR':
      return `${error.resource} with id ${error.id} not found`;
    case 'CONFLICT_ERROR':
      return `Conflict: ${error.reason}`;
    case 'INFRA_ERROR':
      return `${error.service} error during ${error.operation}: ${error.message}`;
    
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
};
