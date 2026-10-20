import Link from 'next/link';
import { RUTA_CUENTAS, URL_APP } from '../lib/config';
import { LogoFrilo } from './Logo';
import { NavLink } from './NavLink';

/** Header de todas las páginas (sobre oliva). El CTA lleva a la app. */
export function Header() {
  return (
    <header className="header">
      <div className="header-fila">
        <Link href="/" aria-label="Frilo, ir al inicio" className="header-logo">
          <LogoFrilo tono="manzana" alto={34} />
        </Link>
        <nav aria-label="Principal" className="header-nav">
          <NavLink href="/calculadoras">Calculadoras</NavLink>
          <NavLink href="/dolar-hoy">Dólar hoy</NavLink>
          <NavLink href="/guias" coincide="exacta">
            Guías
          </NavLink>
          <NavLink href={RUTA_CUENTAS}>Cuentas que rinden</NavLink>
        </nav>
        <div className="header-acciones">
          <a href={`${URL_APP}/entrar`} className="enlace-claro">
            Entrar
          </a>
          <a href={URL_APP} className="boton-degradado">
            Probar la app gratis
          </a>
        </div>
      </div>
    </header>
  );
}
