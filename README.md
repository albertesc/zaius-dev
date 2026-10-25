# zaius-dev

Un instalador de consola que deja un proyecto listo para trabajar con la IA,
de uno de dos tipos, cada uno con su stack y su forma de trabajar:

- **Una web**, con Astro: páginas que se leen y se encuentran en los
  buscadores. Se construye página a página.
- **Una app**, con React y Vite: pantallas de trabajo con datos, para usuarios
  que entran con su cuenta. Se construye historia de usuario a historia.

Cada proyecto llega con TypeScript, una arquitectura, una nomenclatura, unas
reglas de código, unas comprobaciones en verde y sus documentos y skills para
la IA (Claude Code y opencode). Sirve a quien programa y a quien no: el
instalador y la IA preguntan por la web o la app, no por el código, con la
opción recomendada primero, y la IA no hace nada sin el OK de la persona.
Funciona con npm, pnpm, yarn y bun, en Windows, macOS y Linux.

**En esta página:** [Lanzarlo](#lanzarlo), [Usar](#usar),
[Las preguntas](#las-preguntas), [Después de instalar](#después-de-instalar),
[Actualizar un proyecto](#actualizar-un-proyecto), [Mejorar el kit](#mejorar-el-kit)

## Lanzarlo

No se instala. Con Node 22 o más, se lanza desde su repositorio con `npx`, que
viene con Node, y con la versión que se quiera:

```sh
npx github:albertesc/zaius-dev#v0.1.0
```

Las versiones son las etiquetas del repositorio, y lo que cambia en cada una
está en el [CHANGELOG.md](./CHANGELOG.md). El kit se lanza igual use el
proyecto el gestor de paquetes que use. Dentro de un proyecto, la orden va
siempre con la versión de su `zaius-dev.json`, y sus documentos ya la traen
escrita.

## Usar

La orden, sin nada más, mira la carpeta en la que está:

| Dónde | Qué hace |
|---|---|
| Carpeta sin `package.json` | Pregunta y crea el proyecto en una carpeta nueva con su nombre, dentro de la actual («Casa del Roble» va en `casa-del-roble/`): la plantilla, `package.json`, las dependencias y las comprobaciones (tipos, lint y tests). Si esa carpeta ya tiene ficheros, pide otro nombre. |
| Proyecto sin el kit | Mira si es una web (Astro) o una app (React), pregunta lo demás y lo aplica en su carpeta sin tocar el código: un fichero que ya existe recibe al lado la versión del kit (`<fichero>.kit-new`), y la IA propone cómo traerlo por bloques (`zaius-adopt`). |
| Proyecto con el kit | Un menú: ver el estado, cambiar una respuesta o actualizar el kit. |

Antes de escribir nada, enseña lo que va a hacer y espera el sí. Las órdenes,
una a una, detrás de `npx github:albertesc/zaius-dev#v0.1.0`:

| Orden | Qué hace |
|---|---|
| `init` | Instala el kit. Con `--config <json> --yes` no pregunta nada. |
| `change` | Cambia una respuesta (pasar a varios idiomas, añadir la API o la zona privada a una web, elegir dónde se publica, terminar de traer un proyecto…) y añade o quita lo que toque. |
| `update` | Pasa el proyecto a la versión con la que se lanza, con las mismas respuestas. |
| `status` | La versión, las respuestas, la carpeta del kit, los ficheros del kit que el proyecto ha cambiado y los `.kit-new` pendientes. |
| `help` | La ayuda. |

Opciones: `--cwd <carpeta>` (dónde se lanza; un proyecto nuevo se crea dentro),
`--config <fichero>`, `--yes` y `--skip-install` (sin instalar las
dependencias ni pasar las comprobaciones).

## Las preguntas

La primera es el tipo, y el stack va con él. Después, las comunes y las de su
camino. Lo que el código de un proyecto existente ya dice no se pregunta.

| Pregunta | Cuándo | Qué cambia |
|---|---|---|
| ¿Qué vas a construir? | Siempre | Una web (Astro) o una app (React). Si lo principal es entrar con una cuenta, es una app. |
| ¿Cómo se llama el proyecto? | Siempre | La carpeta, `AGENTS.md`, el README y la pestaña del navegador. |
| ¿Con qué gestor de paquetes? | Siempre | npm, pnpm, yarn o bun. |
| ¿Guardamos el historial de cambios con git? | Si la carpeta no está ya en un repositorio y git está instalado | Sí: `git init`, sin ningún commit, y la skill `zaius-git`. Los commits y los push los hace la persona; la IA propone el mensaje y solo los hace si se lo piden. Se añade después con `change`; no se quita. |
| ¿Va a estar en más de un idioma? | Siempre | Sus idiomas, cada uno con su catálogo y sus direcciones. Los textos van siempre en un catálogo, con i18next, también con un solo idioma. |
| ¿La web recibe mensajes o datos? | Web | Un servidor para los formularios, en Node hasta que se elige dónde se publica. |
| ¿Lleva blog, noticias o artículos? | Web | Las colecciones de contenido, en Markdown. |
| ¿Muestra datos de otro sistema (una API)? | Web, con `change` | El transporte, los services y sus datos de ejemplo. |
| ¿Tiene una zona privada? | Web, con `change` | El servidor, la API, la sesión y los permisos. |
| ¿Dónde se va a publicar? | Web con servidor, con `change` | El adaptador de Node, Vercel, Netlify o Cloudflare. Lo pide `zaius-publish`. |
| ¿La app saca sus datos de una API? | App | Sí: el transporte, los services, la sesión y los permisos, y la API documentada siempre (`docs/api/` y lo que la app necesita que cambie). No: nada de eso, y lo que guarde la app se decide en `zaius-init`. Se añade después con `change`. |
| ¿Quieres datos de ejemplo? | App con API | Respuestas inventadas para avanzar sin la API (mocks). |

Todo proyecto lleva tests: cada fichero con código, el suyo.

## Después de instalar

Se abre la IA en la carpeta del proyecto y se sigue el mismo flujo en los dos
tipos. Cada paso lo lanza la persona y termina esperando su OK:

| Comando | En una web | En una app |
|---|---|---|
| `/zaius-init` y de qué va | El brief, a partir de lo que cuenta la persona, y el sistema de diseño, con su identidad | La visión, el alcance (a partir de lo que cuenta la persona) y el sistema de diseño, con su identidad |
| `/zaius-backlog` | Las páginas y el mapa del sitio | Las épicas y las historias |
| `/zaius-page HOME` o `/zaius-spec ORD001` | El documento de una página, su boceto y sus tests | La historia refinada, sus pantallas, su boceto y sus tests |
| `/zaius-build <unidad>` | La construye en pareja, test a test | Igual |
| `/zaius-review <unidad>` | La revisa y, con el OK, la da por hecha | Igual |
| `/zaius-publish` | Plataforma, dominio, analítica y buscadores | Plataforma y la API de producción |

Lo hecho se mejora con `/zaius-refactor`. Cualquier sesión, con cualquier IA o
persona, sigue donde se quedó: lo que se decide se escribe en el momento, y
«Dónde estamos», en `docs/next-steps.md`, dice siempre lo que sigue. Cómo se
trabaja con la IA está en el `docs/process.md` de cada proyecto.

## Actualizar un proyecto

`npx github:albertesc/zaius-dev#v<versión> update`, con la versión nueva,
vuelve a generar cada fichero con ella:

- lo que el proyecto no ha tocado se sustituye;
- lo que el proyecto ha cambiado se queda, y la versión nueva va al lado como
  `.kit-new`; el kit lo apunta en `docs/next-steps.md` y la skill
  `zaius-merge` lo fusiona con el OK de la persona;
- las semillas (el brief, el backlog, `next-steps.md`, el sistema de diseño,
  los catálogos…) son del proyecto desde el primer día y no se tocan.

Con una versión más antigua que la del proyecto, `change` y `update` no siguen.

## Mejorar el kit

Las reglas para editar el kit están en [AGENTS.md](./AGENTS.md), y dónde va el
trabajo, en [next-steps.md](./next-steps.md).

### Trabajar en el kit

Se clona el repositorio (`git clone https://github.com/albertesc/zaius-dev.git`)
y, desde su carpeta, se instalan sus dependencias y se enlaza la orden
`zaius-dev`:

| Gestor | Órdenes |
|---|---|
| npm | `npm install` y `npm link` |
| pnpm | `pnpm install` y `pnpm add -g link:.` |
| yarn 1 | `yarn install` y `yarn link` |
| yarn 4 | `yarn install` y `npm link`: yarn 4 no instala órdenes en el equipo. El `.yarnrc.yml` del kit le pide `node_modules`, sin el que la orden no arranca. |
| bun | `bun install` y `bun link` |

Desde entonces, `zaius-dev` lanza la copia de esta carpeta, con sus cambios aún
sin publicar. Con pnpm, yarn y bun, su carpeta de órdenes tiene que estar en el
PATH (`pnpm setup`, `yarn global bin`, `~/.bun/bin`).

### Comprobar el kit

```sh
npm test                   # los tests del instalador
npm run verify             # instala cada combinación y pasa sus comprobaciones
npm run verify -- --docs   # solo los ficheros, sin instalar: en segundos
```

`verify` empaqueta el kit como lo baja `npx` desde git (`npm pack`, con el
`files` de `package.json`) y lo instala desde ese paquete. Las combinaciones
de las apps (`app-…`) cubren las respuestas, un proyecto existente y los
gestores; las de las webs (`web-…`), el servidor, el blog, la API, la zona
privada, una web que crece con `change`, las plataformas, un proyecto existente
y los gestores. En cada una pasa tipos, lint, tests, build y los tests del
código base (`templateTests/`), y mira los ficheros: nada sin resolver, ningún
enlace roto y nada que hable de lo que no se ha pedido. Las de un gestor que no
está instalado se saltan, avisando. `--keep` deja los proyectos de prueba;
`--only=web-todo-si` prueba una, `--only=app-todo-si,web-api` varias y
`--only=web-` las que empiezan así. En Windows, se lanza desde PowerShell: con
Git Bash, Vitest no arranca en los proyectos de prueba.

### Publicar una versión

1. La versión nueva en `package.json`, la misma que la de su entrada en el
   `CHANGELOG.md` (lo que estaba en «Sin publicar» pasa a ella, con la fecha).
2. `npm test` y `npm run verify`, en verde.
3. El commit, la etiqueta y la subida. La etiqueta, anotada (`-a`):
   `--follow-tags` no sube las ligeras.

   ```sh
   git commit -am "Versión 0.1.0"
   git tag -a v0.1.0 -m "Versión 0.1.0"
   git push --follow-tags
   ```

Desde ese momento, `npx github:albertesc/zaius-dev#v0.1.0` lanza la versión, y
los proyectos pasan a ella con su `update`.

## Licencia

[MIT](./LICENSE)
