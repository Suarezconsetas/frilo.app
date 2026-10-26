import Link from 'next/link';
import { RUTA_CUENTAS, URL_APP } from '../lib/config';
import { MENU_CALCULADORAS, MENU_GUIAS } from '../lib/enlaces';
import { LogoFrilo } from './Logo';
import { MenuDesplegable } from './MenuDesplegable';
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
          <MenuDesplegable {...MENU_CALCULADORAS} />
          <NavLink href="/dolar-hoy">Dólar hoy</NavLink>
          <MenuDesplegable {...MENU_GUIAS} />
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
