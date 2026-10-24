# Próximos pasos

## Dónde estamos

Al día el 2026-10-24. Lo que el kit deja en un proyecto está decidido y
escrito en
[AGENTS.md](./AGENTS.md#lo-que-deja-en-un-proyecto); la propuesta de la fase 1,
con sus ejemplos (Casa del Roble y Aforo), está en una página privada de la
persona.

- **Hecho:** los bloques 0 a 5. El plan, aprobado el 2026-10-24, con un commit
  al cerrar cada bloque.
- **Lo siguiente:** el bloque 6.

## Decidido al empezar (2026-10-24)

- La primera versión que se publica es la `0.1.0`; la `1.0.0`, después del
  bloque 8.
- Los ejemplos de la plantilla, uno en cada camino: en las apps, el dominio
  `orders`; en las webs, una casa rural, Casa del Roble
  (inicio, habitaciones, entorno, blog, contacto y, si crece, la zona de
  clientes con sus reservas).
- Una web no pregunta por la API ni por la zona privada al instalar: las añade
  `change` cuando hacen falta, y la zona privada trae el servidor y la API.
- La plataforma de una web con servidor (Node, Vercel, Netlify o Cloudflare) es
  una respuesta del kit, que solo se pregunta con `change`: la elige
  `zaius-publish`, que manda lanzarlo, y así el kit pone su adaptador y no lo
  pisa al actualizar. Mientras no se elige, Node.
- Todo proyecto lleva tests: no se pregunta, porque `zaius-build` trabaja test a
  test.
- El kit no cita la fuente del método de las apps.

## Bloques

- [x] **0. La carpeta y el repo.** Un repo con `AGENTS.md`, `CLAUDE.md`, `README.md`,
  `CHANGELOG.md`, este fichero y los de raíz (licencia, `.gitignore`,
  `.gitattributes`, `.yarnrc.yml`).
  *Está cuando:* una sesión nueva, sin contexto, sabe qué es el kit, qué está
  decidido y qué toca después, solo con estos ficheros.
- [x] **1. El instalador.** `bin/` y `cli/`, con sus tests:
  - la plantilla en `shared/`, `web/` y `app/` (las capas, por tipo);
  - las respuestas: `type` (web o app), `name`, `packageManager`, `i18n` y
    `languages`; en web, `server` («¿recibe mensajes?») y `content`
    («¿blog o noticias?»); en app, `api` y `mocks`; `privateArea`, solo con
    `change`, en una web;
  - `existing`: los proyectos existentes, desde la primera versión.

  *Está cuando:* `npm test` en verde, y `init --yes` deja una web y una app con
  una plantilla mínima de prueba.
  *Hecho (2026-10-24):* 193 tests en verde, sin la pregunta de los tests. Probado con la plantilla mínima
  (`web/` y `app/` con un `AGENTS.md` y un `.gitignore`): `init` de una web y
  de una app, `change` que añade la zona privada (y con ella el servidor) y que
  no deja cambiar el tipo, `status`, y un proyecto Astro existente detectado
  como web, con su servidor, su contenido y pnpm. Dos arreglos:
  al elegir una app, la API y los mocks salen marcados con su valor por defecto;
  y un cambio de respuestas que no cambia ningún fichero también se apunta en
  `zaius-dev.json`.
- [x] **2. Lo común (`shared/`).** La configuración base (TypeScript, ESLint,
  Vitest), su `package.fragment.json`, los documentos comunes (sistema de
  diseño, normas D1–D6 y D10–D13, propuestas de diseño, bocetos), la semilla de
  `docs/next-steps.md` con los estados y la regla de empezar de cero, y las
  skills comunes (`build`, `review`, `refactor`, `sketch`, `design`, `rename`,
  `merge`, `adopt`).
  *Está cuando:* `verify --docs` no encuentra marcadores sueltos ni ningún «si
  es una web» en `shared/`.
  *Hecho (2026-10-24):* `docs/process.md` (el flujo, la persona decide, hablar
  con la persona, iterar, empezar de cero y los estados), la semilla de
  `docs/next-steps.md`, `docs/ux-ui/README.md` y las ocho skills comunes, con
  la plantilla del boceto en cada camino. Sin `verify` todavía (bloque 7): una
  web y una app instaladas sin marcadores ni valores sueltos, y `shared/` sin
  nada de un camino. Lo que cambia según el tipo va en valores nuevos
  (`%%KIND%%`, `%%UNIT%%`, `%%UNITS%%`, `%%UNIT_EXAMPLE%%`, `%%UNIT_DOCS%%`,
  `%%SPEC_SKILL%%`), y lo propio de cada camino, en los apartados con el mismo
  nombre que lista `AGENTS.md` («Lo común y cada camino»). La configuración
  (TypeScript, ESLint, Vitest) cambia entera por stack: va en cada camino.
  `zaius-languages` y `zaius-api` dependen del stack: van en su camino.
- [x] **3. El camino Apps (`app/`).** El código base de React desde
  `stack-react` (transporte, mocks, sesión, i18n, comprobación de la
  estructura), su `AGENTS.md`, la normativa, la nomenclatura, las guías y las
  normas D7–D9; las plantillas del brief, del backlog, de la spec (`XXX999`) y
  de la pantalla; las skills `init`, `backlog`, `spec`, `publish`, `service`,
  `form`, `permissions`, `languages` y `api`; y los apartados que piden los
  ficheros de `shared/`.
  *Está cuando:* las combinaciones de app pasan tipos, lint, tests y build.
  *Hecho (2026-10-24):* el código base y la configuración de React, con sus
  tests en `templateTests/app/`; los documentos (`AGENTS.md`,
  el README, la normativa con «Qué se revisa» y «Traer un proyecto que ya
  existe», la nomenclatura con «Revisar los nombres», las guías, las normas
  D1–D13, el sistema de diseño, la API y las semillas del brief y del
  backlog) y las skills (`init`, `backlog`, `spec`, `publish`, `service`,
  `form`, `permissions`, `languages` y `api`). Probado: con npm (multiidioma
  y mocks; sin mocks ni API) y con pnpm, tipos, lint, tests y build en verde,
  y los tests del código base dentro del proyecto; cinco combinaciones y un
  proyecto existente, sin enlaces rotos, anclas que falten ni nada sin
  resolver. Sin yarn ni bun en este equipo.
- [x] **4. El camino Webs (`web/`).** El código base de Astro desde
  `stack-astro`, más simple (estático; servidor en Node solo con formulario;
  islas con React; contenido), su `AGENTS.md`, la normativa, la nomenclatura,
  las guías, D14 y el rendimiento; las plantillas del brief, del backlog con el
  mapa del sitio y de la página (`NOMBRE`); las skills `init`, `backlog`,
  `page`, `publish`, `form`, `service` y `languages`; y los apartados que piden
  los ficheros de `shared/`.
  *Está cuando:* las combinaciones de web pasan tipos, lint, tests y build.
  *Hecho (2026-10-24):* el código base de Astro, con su configuración y sus
  tests en `templateTests/web/`, separado en `server` (formularios), `backend`
  (la API) y `privateArea` (la sesión y los permisos); los documentos
  (`AGENTS.md`, el README, la normativa con «Qué se revisa», la nomenclatura
  con «Revisar los nombres», las nueve guías, las normas D1–D6 y D10–D14, con
  D7–D9 en la zona privada, el sistema de diseño con las piezas de web, y las
  semillas del brief, del backlog y de `docs/pages/`), con Casa del Roble de
  ejemplo; y las skills (`init`, `backlog`, `page`, `publish`, `form`,
  `service`, `permissions` y `languages`). En el instalador: las respuestas
  `backend` y `platform` de una web, solo con `change`; las condiciones con la
  carpeta delante (`web/…`); zod solo donde se usa; y el `.gitignore` solo en
  proyectos nuevos. Probado: seis combinaciones de web con npm y pnpm
  (estática, con servidor, con blog y multiidioma, con API, con zona privada y
  con Cloudflare) con tipos, lint, tests, build y los tests del código base en
  verde; nueve instalaciones de web y de app sin enlaces rotos ni nada sin
  resolver.
- [x] **5. La zona privada de una web.** `change` le añade el servidor, la
  sesión, los permisos, el middleware y `zaius-permissions`.
  *Está cuando:* una web instalada pasa a tener zona privada con `change` y
  sigue en verde.
  *Hecho (2026-10-24):* con el código base del bloque 4: una web con servidor
  recibe con `change` la zona privada (la sesión, la API, sus datos de ejemplo
  y los `.env`), sin `.kit-new`, y pasa tipos, lint, tests, build y los tests
  del código base. Y una web con servidor cambia de plataforma (de Node a
  Vercel) con `change`, sin `.kit-new` y en verde.
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
- [ ] **9. Publicar.** El repo, en GitHub (`albertesc/zaius-dev`), con su
  etiqueta.
  *Está cuando:* `npx github:albertesc/zaius-dev#v<versión> init` funciona
  desde otra carpeta.

## Pendiente de decidir

Nada por ahora.
