# AGENTS.md

Guía para los agentes de IA que trabajan en el kit zaius-dev.

## Qué es

zaius-dev es un kit con un instalador de consola (`zaius-dev`) que deja un
proyecto de uno de dos tipos, cada uno con su stack y su metodología:

- **Una web** (Astro): páginas, contenido y buscadores. La unidad de trabajo es
  la página.
- **Una app** (React + Vite): usuarios, datos y gestión. La unidad de trabajo es
  la historia de usuario: el backlog, la historia refinada y la construcción en
  pareja.

Los dos comparten los estándares de código, el sistema de diseño, los comandos
y la forma de trabajar con la IA.

Dónde va el trabajo, por bloques: [next-steps.md](./next-steps.md).

## Mapa

| Carpeta o fichero | Qué va |
|---|---|
| `AGENTS.md` | Esta guía: lo que el kit deja en un proyecto y las reglas para editarlo. |
| `CLAUDE.md` | Para Claude Code: remite aquí y a `next-steps.md`. |
| `next-steps.md` | Dónde está el trabajo del kit, los bloques y lo pendiente de decidir. |
| `CHANGELOG.md` | Qué cambia en cada versión del kit. |
| `README.md` | Qué es el kit y cómo se usa. |
| `LICENSE` | La licencia, MIT. |
| `.gitignore`, `.gitattributes` | Lo que no se versiona y LF en todos los clones. |
| `.yarnrc.yml` | Pide `node_modules` a yarn 4, para que la orden encuentre sus dependencias. |
| `bin/zaiusDev.mjs` | La entrada de la orden `zaius-dev`. |
| `cli/` | El instalador: las órdenes (`init`, `change`, `update`, `status`), las preguntas, el render de la plantilla, el manifiesto del proyecto, la fusión de `package.json` y las órdenes de cada gestor de paquetes. JavaScript (`.mjs`) con JSDoc, cada fichero con su `.test.mjs` (`node:test`). |
| `shared/` | Lo común de la plantilla, que llega a todos los proyectos. |
| `web/`, `app/` | Lo de cada camino, que solo llega a los proyectos de su tipo. |
| `templateFiles.json` | Las carpetas de la plantilla y qué ficheros dependen de una respuesta. |
| `templateTests/` | Los tests del código base de la plantilla, con las mismas carpetas (`web/`, `app/`). No llegan a los proyectos: `verify` los copia en cada uno, los pasa y los quita. |
| `scripts/verifyKit.mjs` | Instala cada combinación de respuestas en una carpeta temporal y pasa sus comprobaciones (`npm run verify`). |
| `.claude/skills/contribute-to-kit/` | La skill para traer al kit una regla nacida en un proyecto. |

## La plantilla

### Las carpetas

`templateFiles.json` dice cuál es la base (`"base": "shared"`) y qué carpeta es
la de cada tipo (`"overlays": { "web": "web", "app": "app" }`). Un proyecto
recibe la base y la carpeta de su tipo, cada una copiada sin su nombre:
`web/src/pages/index.astro` llega como `src/pages/index.astro`. Las condiciones
y las semillas se comparan con esa ruta, sin la carpeta. Cada carpeta puede
tener su `package.fragment.json`, y se suman en ese orden.

- **Dos ficheros no pueden dar el mismo del proyecto:** si están en `shared/` y
  en la carpeta de un tipo, la instalación para con un error. Un fichero que
  cambia según el tipo va entero en `web/` y en `app/`, nunca en `shared/` con
  ramas.
- **Un enlace de un fichero de `shared/`** a un documento de un camino apunta a
  uno que existe en los dos, en la misma ruta.

### Ficheros con punto

Lo que en el proyecto empieza por punto lleva en la plantilla el prefijo `dot-`
(`dot-claude/`, `dot-gitignore`): así el kit no carga como suyas las skills del
proyecto, y `npm pack` no deja fuera ficheros como `.gitignore`. El instalador
cambia el prefijo por el punto al copiar.

### Las respuestas

| Condición | Pregunta | Verdadera si |
|---|---|---|
| `existing` | ¿Es un proyecto nuevo o uno que ya existe? | Existente: el kit se aplica sobre un proyecto con código. |
| `web`, `app` | ¿Qué vas a construir? | La del tipo elegido. Cada una activa su carpeta. |
| `server` | Web: ¿la web recibe mensajes o datos de quien la visita? | Sí: con servidor, en Node hasta que se elige la plataforma al publicar. También con zona privada. |
| `content` | Web: ¿lleva blog, noticias o artículos? | Sí: las colecciones de contenido. |
| `adapterNode`, `adapterVercel`, `adapterNetlify`, `adapterCloudflare` | Web con servidor, solo con `change`: ¿dónde se va a publicar la web? | La de la plataforma elegida; Node mientras no se elige otra. La elige `zaius-publish`, que manda lanzar `change`: así el kit pone su adaptador y no lo pisa al actualizar. |
| `backend` | Web, solo con `change`: ¿la web muestra datos de otro sistema (una API)? | Sí: el transporte, los services y sus datos de ejemplo. Siempre verdadera en una app y con la zona privada. |
| `privateArea` | Web, solo con `change`: ¿la web tiene una zona privada? | Sí: el servidor, la API, la sesión y los permisos. |
| `api` | App: ¿quieres apuntar cómo es la API? | Sí: `docs/api/` y `docs/api-requests.md`. |
| `mocks` | App: ¿quieres datos de ejemplo para avanzar sin la API? | Sí: las respuestas inventadas de cada service. En una web, va con la API. |
| `i18n` | ¿Va a estar en más de un idioma? | Sí: i18next y un catálogo por idioma. |
| `npm`, `pnpm`, `yarn`, `bun` | ¿Con qué gestor de paquetes? | La del gestor elegido; las otras tres, falsas. |

Las condiciones de una web son falsas en una app, y las de una app, en una web,
salvo `backend` y `mocks`, que valen para las dos.
Los tests no se preguntan: todo proyecto los lleva, cada fichero con código con
el suyo, porque `zaius-build` trabaja test a test.
Las órdenes no se escriben nunca con un gestor concreto: van con `%%PM%%` y
`%%PM_EXEC%%` (`%%PM%% run test`). Los scripts, siempre con `run` (`bun test`
es el runner de bun), y los binarios, con `%%PM_EXEC%%` (`yarn exec` no lanza
nada en yarn 1).

### Bloques condicionales

Dentro de un fichero, un bloque se escribe entre líneas marcadoras. La línea
del marcador desaparece entera al instalar; los bloques se pueden anidar y la
condición se niega con `!`.

```md
<!-- kit:if i18n -->
Los textos salen de los catálogos con `t()`.
<!-- kit:else -->
Los textos van escritos en el componente.
<!-- kit:end -->
```

En código y en `.env`, con el comentario de cada lenguaje (`// kit:if mocks`,
`# kit:if mocks`). Un marcador ocupa siempre su línea, sin nada más.

### Ficheros enteros

`conditions`, en `templateFiles.json`, dice qué rutas solo se copian con unas
condiciones (todas a la vez si es una lista), y `seeds`, qué ficheros son
semillas: se crean una vez y son del proyecto, que los rellena.

```json
{ "conditions": { "src/utils/apiMockUtils*": "mocks" }, "seeds": ["docs/next-steps.md"] }
```

Las condiciones valen para las tres carpetas, porque se comparan con la ruta
sin la carpeta. Un patrón que empieza por la carpeta solo cuenta en ella:
`"web/docs/guides/create-a-form.md": "server"` deja la guía de una app como
está.

### Los valores

| Placeholder | Qué pone |
|---|---|
| `%%APP_NAME%%` | El nombre del proyecto, tal cual (`Gestión de pedidos`). En markdown. |
| `%%APP_NAME_JSON%%` | El nombre como cadena JSON, con sus comillas. |
| `%%APP_NAME_HTML%%` | El nombre escapado para HTML. |
| `%%APP_SLUG%%` | El nombre del paquete npm (`gestion-de-pedidos`). |
| `%%PM%%` | El gestor de paquetes (`npm`, `pnpm`, `yarn` o `bun`). |
| `%%PM_EXEC%%` | La orden que lanza un binario del proyecto: `npx`, `pnpm exec`, `yarn run` o `bunx`. |
| `%%PM_DLX%%` | La orden que lanza un programa sin instalarlo: `npx`, `pnpm dlx`, `npx` con yarn o `bunx`. |
| `%%DEFAULT_LANGUAGE%%` | El idioma por defecto (`es`). |
| `%%LANGUAGES%%` | Los idiomas, para la prosa (`es, ca`). |
| `%%LANGUAGES_TS%%` | Los idiomas como lista de TypeScript (`'es', 'ca'`). |
| `%%LANGUAGE%%` | Solo en el nombre de un fichero: el fichero se copia una vez por idioma. |
| `%%TEST_TIMEZONE%%` | La zona horaria de los tests (la del sistema al instalar). |
| `%%KIND%%` | El tipo, para la prosa: `web` o `app` («la %%KIND%%»). |
| `%%UNIT%%`, `%%UNITS%%` | La unidad de trabajo: `página` y `páginas`, o `historia` e `historias`. |
| `%%UNIT_EXAMPLE%%` | El nombre de una unidad de ejemplo: `HOME` en una web, `ORD001` en una app. |
| `%%UNIT_DOCS%%` | La carpeta de los ficheros de las unidades: `docs/pages` o `docs/specs`. |
| `%%SPEC_SKILL%%` | La skill que especifica una unidad: `zaius-page` o `zaius-spec`. |
| `%%HUMAN_PORT%%` | El puerto del servidor de la persona (`4321` en una web, `5173` en una app). |
| `%%REVIEW_PORT%%` | El puerto de la revisión visual de la IA (`4323` en una web, `5175` en una app). |
| `%%KIT_VERSION%%` | La versión del kit. |
| `%%KIT_RUN%%` | La orden que lanza el kit con esa versión (`npx github:albertesc/zaius-dev#v0.1.0`). |
| `%%KIT_UPDATE%%` | La orden de actualizar, con la versión por poner. |
| `%%DATE%%` | La fecha de la instalación (`aaaa-mm-dd`). |

Un `%%X%%` sin valor, o una condición que no existe, paran la instalación con
un error. `{{…}}` no es un placeholder: es la interpolación de i18next y se deja
tal cual.

## Lo que deja en un proyecto

### La entrada

La primera pregunta es «¿Qué vas a construir?»: una web o una app. Si lo
principal es entrar con una cuenta (usuarios, permisos, pantallas de gestión),
es una app. Una web nace sin login; si un día necesita una zona privada
pequeña, la orden `change` del kit le añade el servidor, la sesión y los
permisos, y sigue siendo una web.

Después, las preguntas comunes (nombre, gestor de paquetes, idiomas) y
las del camino:

- **Web:** «¿La web recibe mensajes o datos?» (con servidor, en Node hasta que
  se elige la plataforma al publicar) y «¿Lleva blog o noticias?» (colecciones
  de contenido). Las islas, con React, sin pregunta: llegan con la primera que
  hace falta. La API y la zona privada no se preguntan al instalar: las añade
  `change` cuando hacen falta, y la zona privada trae la API.
- **App:** «¿Hay una API?» (sus documentos) y los mocks.

Un proyecto existente se detecta y se trae por bloques con `zaius-adopt`.
Antes de escribir nada, el instalador enseña lo que va a crear y las órdenes que
va a lanzar, y espera el sí.

### El flujo

Los mismos comandos en los dos caminos. Cada uno se llama con una palabra en
inglés, casi siempre lo que sale de él:

| Etapa | Comando | En una web | En una app |
|---|---|---|---|
| 1 | `/zaius-init` | El brief y el sistema de diseño | La visión, el alcance, las decisiones caras y el sistema de diseño |
| 2 | `/zaius-backlog` | Las páginas y el mapa del sitio | Las épicas y las historias |
| 3 | `/zaius-page ROOMS` · `/zaius-spec RES001` | El documento de una página, su boceto y su lista de tests | La historia refinada (criterios Dado / Cuando / Entonces, no incluye, plan, lista de tests), sus pantallas y su boceto |
| 4 | `/zaius-build <unidad>` | En pareja, test a test, parando tras cada ciclo | Igual |
| 5 | `/zaius-review <unidad>` | Comprueba, revisa sin el contexto de la conversación, resume y, con el OK, la da por hecha | Igual |
| 6 | `/zaius-publish` | Plataforma, dominio, analítica, sitemap | Plataforma, API de producción, build sin mocks |

Las etapas 3 a 5 se repiten por unidad. Cuando hace falta:
`zaius-refactor`, `zaius-sketch`, `zaius-design`, `zaius-rename`,
`zaius-languages`, `zaius-merge` y `zaius-api`. Los usa la IA dentro de otros:
`zaius-adopt`, `zaius-service`, `zaius-form` y `zaius-permissions` (apps, y
webs con zona privada). `/zaius-review` sin unidad revisa el cambio en curso.

Una skill que hace algo distinto en cada camino tiene un fichero en `web/` y
otro en `app/`, con el mismo nombre y sin ramas dentro; las demás viven en
`shared/`.

### Las unidades

| | Nombre | Fichero |
|---|---|---|
| Web | La página, en mayúsculas: `HOME`, `ROOMS`; con dos palabras, con guion: `LEGAL-NOTICE` | `docs/pages/ROOMS.md` |
| App | Tres letras de la épica y tres cifras: `RES001`, `RES002`; las letras no cambian y los números no se reutilizan | `docs/specs/RES001-book-class.md` |

El fichero empieza por el nombre, para que el `@` de Claude Code o de opencode
las liste (`/zaius-build @RES`); los comandos aceptan el nombre o la ruta.
`zaius-backlog` crea el fichero de cada unidad al apuntarla, en «pendiente».
En una app, cada pantalla tiene además su documento en `docs/features/`, que
dice lo que hace hoy; las épicas no son las familias de pantallas.

Cada unidad dice su estado, en su fichero y en `docs/backlog.md`, igual en los
dos caminos: pendiente → por aprobar → aprobada → en curso → por cerrar →
hecha.

### La persona decide

- Cada etapa la lanza la persona, y ninguna skill lanza la siguiente: la IA
  termina, dice qué viene después y para. Los comandos de la persona llevan
  `disable-model-invocation: true`.
- La IA para y pregunta ante algo que no estaba en el plan o no se ha pedido,
  una dependencia nueva, un tipo de componente o un verbo nuevo, una norma de
  diseño, cambiar o saltar un test, dos intentos sin verde, un paso de más de
  unas 50 líneas o 3 ficheros, un contenido que falta o un permiso que la
  especificación no dice.
- La IA nunca inventa un requisito, da algo por hecho sin el OK, hace un commit
  o un push, publica sin el OK, pisa lo que la persona ha cambiado ni lanza la
  etapa siguiente.
- No necesita OK un cambio de datos o de textos que pide la persona: lo que
  pide ya es el OK.

### Iterar

Cada parada se ajusta hasta el OK. Lo que se decide construyendo se apunta en
la especificación, con su test, antes de seguir. Lo que `review` encuentra
vuelve a `build`, o antes a la especificación si cambia lo que se pidió. Lo que
se parte o aparece va al backlog. `zaius-init` y `zaius-backlog` se vuelven a
lanzar sobre lo que hay.

`zaius-refactor <unidad>` (sin unidad, el proyecto entero) mejora lo hecho con
la forma de una especificación: la propuesta, con su señal en el código; un
boceto de antes y después si toca piezas que se ven; y la lista de tests. Con el
OK, `build` y `review`; la unidad sigue «hecha». La propuesta se queda en
`docs/refactors/AAAA-MM-DD-<tema>.md`. No cambia lo que se puede hacer: eso es
una página o una historia.

### Empezar de cero en cualquier punto

La conversación no guarda nada: una sesión nueva, con otra IA o con otra
persona, sigue solo con lo que hay en el repo.

- Lo que se decide o se aprueba se escribe en su fichero en el momento, con la
  fecha del OK.
- La lista de tests marca los que están en verde.
- Antes de parar, cada paso pone al día «Dónde estamos» en
  `docs/next-steps.md`, con la pregunta abierta si la hay.
- Al empezar, cualquier sesión lee `AGENTS.md` y «Dónde estamos», cuenta dónde
  se está y propone el comando que sigue, sin lanzarlo.
- Nada del proyecto se guarda en la memoria del asistente.

### Lo común y cada camino

- `web/` y `app/` no se nombran entre sí: lo que necesitan los dos sube a
  `shared/`.
- `shared/` no tiene ningún «si es una web…»: si un párrafo cambia según el
  camino, ese párrafo vive en el camino.
- Las condiciones de la plantilla son solo para las opciones de dentro de un
  camino (idiomas, API, servidor, contenido).
- Un proyecto lleva lo común y su camino, y nada del otro.

Lo que cada camino da con el mismo nombre, porque lo usan los ficheros de
`shared/`, que lo enlazan:

- `AGENTS.md`, con «Skills del proyecto», «Diseño y UX» y «Comprobar un
  cambio»;
- `docs/standards.md`, con «Qué se revisa» (lo que se mira, en su orden, la
  revisión visual y cómo se para el servidor de revisión), «Comprobar la
  estructura» y «Traer un proyecto que ya existe»;
- `docs/naming.md`, con «Revisar los nombres» (lo que se mira y cómo se mueve
  cada cosa);
- `docs/ux-ui/design-system.md`, con «Anchos», «Tema», «Bocetos» y «Piezas por
  papel», y `docs/ux-ui/rules.md`;
- `docs/brief.md`, `docs/backlog.md` y `docs/guides/`;
- `.claude/skills/zaius-sketch/mockup.html`, la plantilla de los bocetos;
- los scripts `dev`, `dev:review`, `typecheck`, `lint`, `test` y `build`.

Lo que cambia según el tipo dentro de un fichero de `shared/` va en sus valores
(`%%UNIT%%`, `%%SPEC_SKILL%%`…), nunca en un bloque `kit:if web`.

## Reglas para editar el kit

- **Documentación y JSDoc en castellano; código en inglés.** Los textos de
  interfaz de los ejemplos, en castellano y entre «».
- **Ficheros y carpetas, siempre en inglés**, también los documentos y las
  skills, aunque su contenido vaya en castellano.
- **Las skills del proyecto llevan el prefijo `zaius-`**, en su carpeta y en su
  `name`, y detrás una palabra. Cada una es de la persona, que la lanza, o de
  la IA, que la usa dentro de otra.
- **Para quien programa y para quien no.** Lo que pregunta el instalador y lo
  que la plantilla manda preguntar a la IA se entiende sin programar: por la
  app, no por el código; sin jerga, o explicada en la misma frase; con la
  opción recomendada primero.
- **Siempre lo mínimo.** El kit instala lo que hace falta para empezar, y cada
  carpeta nace con la primera pieza que la necesita.
- **Nada que dependa de una librería de diseño.** Las piezas se nombran por su
  papel y remiten a `docs/ux-ui/design-system.md`, que cada proyecto rellena.
- **Ningún nombre de un proyecto real** entra en la plantilla: los ejemplos son
  inventados (el repo es público).
- **En cualquier sistema.** El kit y los proyectos funcionan en Windows, macOS
  y Linux: rutas con `node:path` y pasadas a `/` para compararlas; nada que dé
  por hecho LF o CRLF; órdenes válidas en `cmd`, PowerShell y `sh`; las
  mayúsculas exactas en los imports y en los enlaces.
- **Con cualquier gestor de paquetes:** npm, pnpm, yarn (1 y 4, también con
  Plug'n'Play) y bun. Cada paquete que el código importa, declarado, también
  los peers.
- **Las órdenes del kit, siempre con su versión** (`npx
  github:albertesc/zaius-dev#vX.Y.Z`).
- **El código sigue el estilo de standard** (sin punto y coma, espacio antes
  del paréntesis al declarar una función), y cada función lleva su JSDoc.
- **Cada cambio lleva su entrada en `CHANGELOG.md`**, y `next-steps.md` se pone
  al día en cada paso.
- **Comprobar:** `npm test` y `npm run verify` en verde (en Windows, desde
  PowerShell).
- **Por bloques, con el OK.** El trabajo va por los bloques de
  `next-steps.md`, cada uno con su «Está cuando», y se para al terminar cada
  bloque.
