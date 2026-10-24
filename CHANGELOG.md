# Changelog

## Sin publicar

- El kit, con dos caminos: webs (Astro) y apps (React + Vite). Lo que deja en
  un proyecto está en `AGENTS.md`; el plan, por bloques, en `next-steps.md`.
- El instalador (`bin/`, `cli/`): la primera pregunta es el
  tipo, web o app, y el stack va con él; las respuestas de una web (`server`,
  `content` y, con `change`, `privateArea`) y las de una app (`api`, `mocks`);
  la plantilla en `shared/`, `web/` y `app/`, con su `package.fragment.json`
  cada una. Los tests no se preguntan: todo proyecto los lleva. Un cambio de
  respuestas
  que no cambia ningún fichero también se apunta en `zaius-dev.json`.
- Lo común de la plantilla (`shared/`): `docs/process.md`, con cómo se trabaja
  con la IA (el flujo, quién decide, iterar, empezar de cero y los estados de
  una unidad); las semillas de `docs/next-steps.md` y `docs/ux-ui/README.md`;
  y las skills `zaius-build` (la pareja, test a test), `zaius-review` (que
  también cierra, sin `zaius-close`), `zaius-refactor`, `zaius-sketch`,
  `zaius-design`, `zaius-rename`, `zaius-merge` y `zaius-adopt`. Valores nuevos
  para lo que cambia según el tipo: `%%KIND%%`, `%%UNIT%%`, `%%UNITS%%`,
  `%%UNIT_EXAMPLE%%`, `%%UNIT_DOCS%%` y `%%SPEC_SKILL%%`.
- El camino Apps (`app/`): el código base de React, su configuración y sus
  documentos, con las historias de usuario como unidad de trabajo; las
  semillas `docs/brief.md` y `docs/backlog.md`; y las skills `zaius-init`,
  `zaius-backlog` y `zaius-spec` (nuevas), `zaius-publish`, `zaius-service`,
  `zaius-form`, `zaius-permissions`, `zaius-languages` y `zaius-api`. Las
  historias se nombran `XXX999` (las tres letras de su épica), y su fichero va
  en `docs/specs/`.
- El camino Webs (`web/`): el código base de Astro, su configuración y sus
  documentos, con la página como unidad de trabajo y Casa del Roble de
  ejemplo; las semillas `docs/brief.md`, `docs/backlog.md` (con el mapa del
  sitio) y `docs/pages/`; y las skills `zaius-init`, `zaius-backlog` y
  `zaius-page` (nuevas), `zaius-publish`, `zaius-form`, `zaius-service`,
  `zaius-permissions` y `zaius-languages`. Las páginas se nombran por su
  prefijo en mayúsculas (`HOME`, `LEGAL-NOTICE`).
- Una web pide con `change`, cuando hacen falta, la API (`backend`), la zona
  privada (`privateArea`, que trae el servidor y la API) y la plataforma en la
  que se publica (`platform`: Node, Vercel, Netlify o Cloudflare), que cambia
  su adaptador sin `.kit-new`.
- Una condición de `templateFiles.json` que empieza por su carpeta
  (`web/docs/guides/create-a-form.md`) solo cuenta en ella. zod solo llega
  donde se usa, y el `.gitignore`, solo a los proyectos nuevos.
