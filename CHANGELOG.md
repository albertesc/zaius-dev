# Changelog

## Sin publicar

- El kit empieza de cero, con dos caminos: webs (Astro) y apps (React + Vite).
  Lo que deja en un proyecto está en `AGENTS.md`; el plan, por bloques, en
  `next-steps.md`. La versión anterior, la 0.x, no se puede actualizar a esta:
  un proyecto de la 0.x se trae como proyecto existente.
- El instalador (`bin/`, `cli/`), traído de la 0.x: la primera pregunta es el
  tipo, web o app, y el stack va con él; las respuestas de una web (`server`,
  `content` y, con `change`, `privateArea`) y las de una app (`api`, `mocks`);
  la plantilla en `shared/`, `web/` y `app/`, con su `package.fragment.json`
  cada una. Fuera las respuestas de la 0.x que ya no hacen falta (`stack`,
  `rendering`, `adapter`, `backend`, `islands`, `po`) y la de los tests, que
  todo proyecto lleva. Un cambio de respuestas
  que no cambia ningún fichero también se apunta en `zaius-dev.json`.
- Lo común de la plantilla (`shared/`): `docs/process.md`, con cómo se trabaja
  con la IA (el flujo, quién decide, iterar, empezar de cero y los estados de
  una unidad); las semillas de `docs/next-steps.md` y `docs/ux-ui/README.md`;
  y las skills `zaius-build` (la pareja, test a test), `zaius-review` (que
  también cierra, sin `zaius-close`), `zaius-refactor`, `zaius-sketch`,
  `zaius-design`, `zaius-rename`, `zaius-merge` y `zaius-adopt`. Valores nuevos
  para lo que cambia según el tipo: `%%KIND%%`, `%%UNIT%%`, `%%UNITS%%`,
  `%%UNIT_EXAMPLE%%`, `%%UNIT_DOCS%%` y `%%SPEC_SKILL%%`.
