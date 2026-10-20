import type { ReactNode } from 'react';

/** Landing de pauta: sin navegación (un solo objetivo). Su header y su pie propios vienen del wireframe. */
export default function LayoutLanding({ children }: { children: ReactNode }) {
  return <main id="contenido">{children}</main>;
}
