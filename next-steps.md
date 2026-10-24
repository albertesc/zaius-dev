# Próximos pasos

## Dónde estamos

Al día el 2026-10-24. El kit empieza de cero. La versión anterior está en
`../zaius-dev-old`, con sus cambios sin publicar, y es la referencia. Lo que el
kit deja en un proyecto está decidido y escrito en
[AGENTS.md](./AGENTS.md#lo-que-deja-en-un-proyecto); la propuesta de la fase 1,
con sus ejemplos (Casa del Roble y Aforo), está en una página privada de la
persona.

- **Hecho:** el bloque 0. El plan, aprobado el 2026-10-24, con un commit al
  cerrar cada bloque.
- **Lo siguiente:** el bloque 1.

## Decidido al empezar (2026-10-24)

- La primera versión que se publica es la `0.1.0`; la `1.0.0`, después del
  bloque 8.
- Los ejemplos de la plantilla, uno en cada camino: en las apps, el dominio
  `orders` (como en la 0.x); en las webs, otro negocio, que se elige en el
  bloque 4.

## Bloques

- [x] **0. La carpeta y el repo.** `zaius-dev-old` es la versión anterior, y
  `zaius-dev`, un repo vacío con `AGENTS.md`, `CLAUDE.md`, `README.md`,
  `CHANGELOG.md`, este fichero y los de raíz (licencia, `.gitignore`,
  `.gitattributes`, `.yarnrc.yml`).
  *Está cuando:* una sesión nueva, sin contexto, sabe qué es el kit, qué está
  decidido y qué toca después, solo con estos ficheros.
- [ ] **1. El instalador.** `bin/` y `cli/` desde `zaius-dev-old`, con sus
  tests, adaptados:
  - la plantilla en `shared/`, `web/` y `app/` (las capas, por tipo);
  - las respuestas: `type` (web o app), `name`, `packageManager`, `i18n` y
    `languages`, `tests`; en web, `server` («¿recibe mensajes?») y `content`
    («¿blog o noticias?»); en app, `api` y `mocks`; `privateArea`, solo con
    `change`, en una web;
  - fuera `stack`, `rendering`, `adapter`, `backend`, `islands` y `po`;
  - `existing` se queda: los proyectos existentes, desde la primera versión.

  *Está cuando:* `npm test` en verde, y `init --yes` deja una web y una app con
  una plantilla mínima de prueba.
- [ ] **2. Lo común (`shared/`).** La configuración base (TypeScript, ESLint,
  Vitest), su `package.fragment.json`, los documentos comunes (sistema de
  diseño, normas D1–D6 y D10–D13, propuestas de diseño, bocetos), la semilla de
  `docs/next-steps.md` con los estados y la regla de empezar de cero, y las
  skills comunes (`build`, `review`, `refactor`, `sketch`, `design`, `rename`,
  `languages`, `merge`, `api`, `adopt`).
  *Está cuando:* `verify --docs` no encuentra marcadores sueltos ni ningún «si
  es una web» en `shared/`.
- [ ] **3. El camino Apps (`app/`).** El código base de React desde
  `stack-react` (transporte, mocks, sesión, i18n, comprobación de la
  estructura), su `AGENTS.md`, la normativa, la nomenclatura, las guías y las
  normas D7–D9; las plantillas del brief, del backlog, de la spec (`XXX999`) y
  de la pantalla; las skills `init`, `backlog`, `spec`, `publish`, `service`,
  `form` y `permissions`.
  *Está cuando:* las combinaciones de app pasan tipos, lint, tests y build.
- [ ] **4. El camino Webs (`web/`).** El código base de Astro desde
  `stack-astro`, más simple (estático; servidor en Node solo con formulario;
  islas con React; contenido), su `AGENTS.md`, la normativa, la nomenclatura,
  las guías, D14 y el rendimiento; las plantillas del brief, del backlog con el
  mapa del sitio y de la página (`NOMBRE`); las skills `init`, `backlog`,
  `page`, `publish`, `form` y `service`.
  *Está cuando:* las combinaciones de web pasan tipos, lint, tests y build.
- [ ] **5. La zona privada de una web.** `change` le añade el servidor, la
  sesión, los permisos, el middleware y `zaius-permissions`.
  *Está cuando:* una web instalada pasa a tener zona privada con `change` y
  sigue en verde.
- [ ] **6. Proyectos existentes.** La detección por tipo y `zaius-adopt`.
  *Está cuando:* `verify` trae un proyecto existente de cada tipo hasta el
  final.
- [ ] **7. `verify` entero y los documentos del kit.** Todas las combinaciones,
  el README (instalar, usar, publicar una versión), `CLAUDE.md`, el
  `CHANGELOG` y la skill `contribute-to-kit`.
  *Está cuando:* todas las combinaciones en verde.
- [ ] **8. De principio a fin, con la IA.** Casa del Roble y Aforo en carpetas
  de prueba: `init` → `backlog` → `page`/`spec` → `build` → `review` con
  Claude Code, cortando la sesión a mitad para retomarla sin contexto.
  *Está cuando:* las dos llegan a una unidad «hecha».
- [ ] **9. Publicar.** La persona borra el repo viejo de GitHub; el nuevo se
  sube con su etiqueta.
  *Está cuando:* `npx github:albertesc/zaius-dev#v<versión> init` funciona
  desde otra carpeta.

## Pendiente de decidir

- El negocio de los ejemplos de las webs (bloque 4).
