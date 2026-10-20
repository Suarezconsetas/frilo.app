import type { Metadata } from 'next';
import Link from 'next/link';
import { Icono } from '../_ui/Icono';
import { Logo } from '../_ui/Logo';

export const metadata: Metadata = {
  title: 'Agrega Frilo al inicio de tu iPhone',
  description: 'Guía paso a paso para dejar Frilo como una app en la pantalla de inicio de tu iPhone, sin descargar nada.',
};

const PASOS: { titulo: string; detalle: string; imagen: string; alt: string }[] = [
  {
    titulo: 'Abre frilo.dev en Safari y toca el menú',
    detalle: 'Es el botón con tres puntos (⋯) en la barra de abajo. En iPhones con versiones anteriores de iOS es el botón de compartir (un cuadrado con una flecha hacia arriba). Elige “Compartir”.',
    imagen: '/guia/ios-paso-1.jpg',
    alt: 'Menú de Safari abierto, con las opciones Compartir, Agregar a Marcadores y Nueva pestaña.',
  },
  {
    titulo: 'Busca “Agregar a Inicio”',
    detalle: 'En la lista que se abre, baja hasta encontrar “Agregar a Inicio” (el ícono con un signo más dentro de un cuadrado). Si no la ves, toca “Ver más”.',
    imagen: '/guia/ios-paso-2.jpg',
    alt: 'Hoja de compartir de iOS con la opción Agregar a Inicio resaltada.',
  },
  {
    titulo: 'Deja activado “Abrir como app web” y toca Agregar',
    detalle: 'Puedes cambiar el nombre si quieres. Con “Abrir como app web” activado, Frilo se abre a pantalla completa, como una app. Toca “Agregar” y listo: el ícono de Frilo queda en tu pantalla de inicio.',
    imagen: '/guia/ios-paso-3.jpg',
    alt: 'Pantalla Agregar a Inicio con el nombre Frilo, el ícono verde y el interruptor Abrir como app web activado.',
  },
];

export default function Instalar() {
  return (
    <main className="pantalla ancha">
      <header className="encabezado">
        <Link href="/" className="volver" aria-label="Volver al inicio">
          <Icono nombre="volver" />
        </Link>
        <Logo alto={28} className="logo" />
        <h1 className="titulo-pantalla">Frilo en el inicio de tu iPhone</h1>
        <p className="subtitulo">Ábrela con un toque, como cualquier app, sin descargar nada de la App Store.</p>
      </header>

      <div className="contenido">
        {PASOS.map((p, i) => (
          <section key={p.titulo} className="tarjeta" aria-labelledby={`paso-${i + 1}`}>
            <p className="ayuda" style={{ fontWeight: 600 }}>
              Paso {i + 1} de {PASOS.length}
            </p>
            <h2 id={`paso-${i + 1}`} className="titulo-tarjeta" style={{ marginTop: 4 }}>
              {p.titulo}
            </h2>
            <p className="texto-suave" style={{ margin: '8px 0 14px', fontSize: 15, lineHeight: '22px' }}>
              {p.detalle}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.imagen} alt={p.alt} width={380} loading="lazy" style={{ width: '100%', maxWidth: 380, height: 'auto', borderRadius: 16, display: 'block', margin: '0 auto', border: '1px solid var(--linea)' }} />
          </section>
        ))}

        <section className="tarjeta">
          <h2 className="titulo-tarjeta">Cosas que conviene saber</h2>
          <ul className="texto-suave" style={{ margin: '10px 0 0', paddingLeft: 20, fontSize: 15, lineHeight: '24px' }}>
            <li>Hazlo desde <strong>Safari</strong>: es el navegador con el que iPhone permite agregar apps web al inicio.</li>
            <li>La primera vez en la app del inicio tendrás que iniciar sesión (es un espacio aparte del de Safari). Después queda guardada tu sesión.</li>
            <li>Si cambias de celular, repite estos pasos.</li>
            <li>¿Usas Android? En Chrome toca el menú (⋮) y elige “Instalar app” o “Agregar a la pantalla de inicio”.</li>
          </ul>
        </section>

        <Link href="/" className="btn btn-primario">
          Ir a Frilo
        </Link>
      </div>
    </main>
  );
}
