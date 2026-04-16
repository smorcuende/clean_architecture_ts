export type Result<T, E>
  = { success: true; data: T; isSuccess: true; isFailure: false }
  | { success: false; error: E; isSuccess: false; isFailure: true }

/** Crea un Result exitoso */
export const ok = <T>(value: T): Result<T, never> => ({
  success: true,
  data: value,
  isSuccess: true,
  isFailure: false,
})

/** Crea un Result fallido */
export const fail = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
  isSuccess: false,
  isFailure: true,
})

/** Type guard para verificar si un Result es exitoso */
export const isSuccess = <T, E>(result: Result<T, E>): result is { success: true; data: T; isSuccess: true; isFailure: false } => result.success

/** Type guard para verificar si un Result es fallido */
export const isFailure = <T, E>(result: Result<T, E>): result is { success: false; error: E; isSuccess: false; isFailure: true } => !result.success

/** Transforma el valor de un Result exitoso */
export const map = <T, E, U>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> => {
  if (isSuccess(result)) {
    return ok(fn(result.data))
  } 
  return fail(result.error)
}

/** Encadena operaciones que retornan Result */
export const flatMap = <T, E, U>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> => {
  if (isSuccess(result)) {
    return fn(result.data)
  } 
  return fail(result.error)
}

/** Mapea el error de un Result fallido */
export const mapError = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> => {
  if (isFailure(result)) {
    return fail(fn(result.error))
  } 
  return ok(result.data)
}

/** Extrae el valor o retorna un valor por defecto */
export const getOrElse = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return isSuccess(result) ? result.data : defaultValue
}

/** Ejecuta una función si el Result es exitoso */
export const fold = <T, E, U>(result: Result<T, E>, onSuccess: (value: T) => U, onFailure: (error: E) => U): U => {
  return isSuccess(result) ? onSuccess(result.data) : onFailure(result.error)
}
