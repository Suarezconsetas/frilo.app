# Frilo

Tus finanzas, mejor con Frilo. Ver `CLAUDE.md` para el contexto completo.

```bash
npm install
cp .env.example .env.local   # completa las claves
npm test                     # pruebas de la lógica de cálculo (deben pasar siempre)
npm run dev
```

- `lib/calculos/`: lógica pura (no reescribir). Documentación en `docs/calculos-README.md`.
- `supabase/migrations/`: esquema con RLS. Se aplica con el CLI de Supabase o pegándolo en el SQL Editor.
