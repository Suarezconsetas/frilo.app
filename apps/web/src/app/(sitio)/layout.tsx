import type { ReactNode } from 'react';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

/** Páginas del sitio: header y footer completos. La landing de pauta (`(lp)`) no los lleva. */
export default function LayoutSitio({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#contenido" className="saltar">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
}
