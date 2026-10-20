'use client';

import { useEffect } from 'react';
import { guardarPrimerContacto } from '../lib/medicion';

/** Guarda el primer contacto del visitante (UTM, gclid, referrer, entrada) para atribuir el registro. No pinta nada. */
export function PrimerContacto() {
  useEffect(() => {
    try {
      guardarPrimerContacto();
    } catch {
      /* cookies bloqueadas: el sitio funciona igual */
    }
  }, []);
  return null;
}
