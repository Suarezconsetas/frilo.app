/** Set de íconos de Frilo: trazo de 1,6px (2px activo), extremos redondeados, toman el color del texto. */
const RUTAS = {
  inicio: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  aportes: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  ahorro: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M16 13h2" />
      <path d="M3 10h18" />
      <path d="M7 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
    </>
  ),
  dolar: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  alerta: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </>
  ),
  volver: <path d="M15 18l-6-6 6-6" />,
  sube: (
    <>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </>
  ),
  baja: (
    <>
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </>
  ),
  'enlace-externo': (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  agregar: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
} as const;

export type NombreIcono = keyof typeof RUTAS;

export function Icono({ nombre, tamano = 22, activo = false, titulo }: { nombre: NombreIcono; tamano?: number; activo?: boolean; titulo?: string }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={activo ? 2 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
      role={titulo ? 'img' : undefined}
    >
      {RUTAS[nombre]}
    </svg>
  );
}
