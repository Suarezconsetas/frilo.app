import type { Intencion } from './medicion';

/**
 * Lo que la persona hizo en la página (por ejemplo, los dos dígitos de su documento). El banner de registro de la misma
 * página lo lee al continuar y lo deja en la cookie de intención. Vive en memoria: no se escribe en la URL ni en disco.
 */
let actual: Intencion | undefined;

export const fijarIntencion = (i: Intencion | undefined) => {
  actual = i;
};
export const intencionActual = (): Intencion | undefined => actual;
