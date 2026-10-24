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
