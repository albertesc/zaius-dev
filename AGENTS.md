# AGENTS.md

Guía para los agentes de IA que trabajan en el kit zaius-dev.

## Qué es

zaius-dev es un kit con un instalador de consola (`zaius-dev`) que deja un
proyecto de uno de dos tipos, cada uno con su stack y su metodología:

- **Una web** (Astro): páginas, contenido y buscadores. La unidad de trabajo es
  la página.
- **Una app** (React + Vite): usuarios, datos y gestión. La unidad de trabajo es
  la historia de usuario, con el método de
  [hola-ai](https://github.com/nschurmann/hola-ai) (backlog → historia →
  pareja).

Los dos comparten los estándares de código, el sistema de diseño, los comandos
y la forma de trabajar con la IA.

El kit se rehace desde cero. La versión anterior (la 0.x, con React y Astro como
capas de una misma plantilla) está en `../zaius-dev-old`: es la referencia de
la que se trae lo que sirve, y no se toca. Dónde va el trabajo, por bloques:
[next-steps.md](./next-steps.md).

## Mapa

| Carpeta o fichero | Qué va |
|---|---|
| `AGENTS.md` | Esta guía: lo que el kit deja en un proyecto y las reglas para editarlo. |
| `CLAUDE.md` | Para Claude Code: remite aquí y a `next-steps.md`. |
| `next-steps.md` | Dónde está el trabajo del kit, los bloques y lo pendiente de decidir. |
| `CHANGELOG.md` | Qué cambia en cada versión del kit. |
| `README.md` | Qué es el kit y cómo se usa. |
| `LICENSE` | La licencia, MIT. |
| `.gitignore`, `.gitattributes` | Lo que no se versiona (también `scripts/forbiddenNames.local.json`, los nombres del proyecto de origen) y LF en todos los clones. |
| `.yarnrc.yml` | Pide `node_modules` a yarn 4, para que la orden encuentre sus dependencias. |

Llegan con sus bloques: `bin/` y `cli/` (el instalador), `shared/` (lo común
de la plantilla), `web/` y `app/` (cada camino), `templateFiles.json`,
`templateTests/` y `scripts/verifyKit.mjs`.

## Lo que deja en un proyecto

### La entrada

La primera pregunta es «¿Qué vas a construir?»: una web o una app. Si lo
principal es entrar con una cuenta (usuarios, permisos, pantallas de gestión),
es una app. Una web nace sin login; si un día necesita una zona privada
pequeña, la orden `change` del kit le añade el servidor, la sesión y los
permisos, y sigue siendo una web.

Después, las preguntas comunes (nombre, gestor de paquetes, idiomas, tests) y
las del camino:

- **Web:** «¿La web recibe mensajes o datos?» (con servidor, en Node hasta que
  se elige la plataforma al publicar) y «¿Lleva blog o noticias?» (colecciones
  de contenido). Las islas, con React, sin pregunta: llegan con la primera que
  hace falta.
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
  camino (idiomas, tests, API, servidor, contenido).
- Un proyecto lleva lo común y su camino, y nada del otro.

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
- **Ningún nombre de un proyecto real** entra en la plantilla. Los del proyecto
  de origen van en `scripts/forbiddenNames.local.json`, que no se versiona (el
  repo es público).
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
- **Por bloques, con el OK.** El trabajo va por los bloques de
  `next-steps.md`, cada uno con su «Está cuando», y se para al terminar cada
  bloque.
