# %%APP_NAME%%

Todo lo que hay que saber para construir esta web está en `docs/`: dónde va
cada cosa, cómo se llama, cómo se hace paso a paso y cómo tiene que verse. Las
reglas imprescindibles resumidas están en [AGENTS.md](./AGENTS.md); los
documentos las desarrollan, con ejemplos que se pueden copiar. Cada tema está
en un solo sitio.

**En esta página:** [Primeros pasos](#primeros-pasos), [Contar de qué va](#contar-de-qué-va), [Arrancar la web](#arrancar-la-web), [Comprobar](#comprobar), [Publicar](#publicar), [Documentación](#documentación), [El kit zaius-dev](#el-kit-zaius-dev)

## Primeros pasos

No hace falta saber programar: la IA pregunta por lo que hace la web y lo que
se ve, con una opción recomendada en cada pregunta, y al terminar cada página
te dice cómo verla en el navegador. Cada paso lo lanzas tú, y la IA para al
terminarlo y te dice cuál sigue.

<!-- kit:if !existing -->
1. Abre la IA en esta carpeta (claude u opencode).
2. Escribe `/zaius-init` y, detrás, de qué va la web, con tus palabras
   ([Contar de qué va](#contar-de-qué-va)); en opencode, «usa la skill
   zaius-init» y lo mismo. La IA parte de lo que cuentes y te pregunta lo que
   falte: para qué es la web, para quién, con qué tono y quién da los textos y
   las fotos. Después te propondrá tres identidades distintas (la idea, el logo,
   los colores, la letra y las fotos), en un boceto que se abre en el navegador,
   para que elijas una, y lo dejará escrito en el brief y en el sistema de
   diseño, con una guía visual. Hasta que lo hagas, la IA no empezará ninguna
   otra tarea.
3. `/zaius-backlog`: la IA propone las páginas de la web y el mapa del sitio
   (lo que lleva el menú y lo que lleva el pie), en orden, y los deja en el
   backlog con tu OK. Cada página tiene su nombre (`HOME`, `ROOMS`) y su
   historia: «Como pareja que busca una escapada, quiero ver cada habitación…,
   para elegir la mía».
4. `/zaius-page HOME`: la IA detalla la página (para qué es, sus secciones,
   su contenido y la lista de tests) con un boceto, para verla antes de
   construirla, y espera tu OK: nada se construye sin él.
5. `/zaius-build HOME`: la IA la construye contigo, test a test, y para tras
   cada uno para que decidas si sigue.
6. `/zaius-review HOME`: la IA la comprueba y la revisa, te dice cómo verla
   en el navegador y qué mirar tú, y con tu OK la da por hecha.
7. Los pasos 4 a 6, con cada página. Para publicar la web en internet:
   `/zaius-publish`. Te pregunta dónde, comprueba que todo está en verde y
   espera tu OK antes de subir nada.
<!-- kit:else -->
1. Abre la IA en esta carpeta (claude u opencode).
2. Escribe `/zaius-init` y, detrás, de qué va la web, con tus palabras
   ([Contar de qué va](#contar-de-qué-va)); en opencode, «usa la skill
   zaius-init» y lo mismo. La IA te hará unas preguntas para escribir el brief
   de la web y definir el sistema de diseño, y después analizará el proyecto y
   propondrá cómo traerlo a las reglas del kit, por bloques. Hasta que lo hagas,
   la IA no empezará ninguna otra tarea.
3. Revisa con la IA los ficheros `.kit-new`: son las versiones del kit de
   ficheros que el proyecto ya tenía.
4. Al terminar de traerlo, `%%KIT_RUN%% change`, con Sí a «¿Ha terminado ya
   la migración?», instala el código base y las comprobaciones de
   arquitectura.
5. Lo nuevo sigue el mismo camino que en un proyecto nuevo: `/zaius-backlog`
   para apuntar las páginas, y con cada una, `/zaius-page`, `/zaius-build` y
   `/zaius-review`.
<!-- kit:end -->

En cualquier momento, mira `docs/next-steps.md`, en «Dónde estamos»: ahí
verás siempre por dónde va el trabajo, y por ahí empieza cualquier sesión
nueva de la IA. Lo demás (los formularios, las llamadas a otros sistemas, los
permisos) lo lanza la IA cuando hace falta. Cómo se trabaja con ella está en
[Cómo se trabaja con la IA](./docs/process.md), y todas las skills, las tuyas
y las suyas, en [AGENTS.md](./AGENTS.md#skills-del-proyecto).
<!-- kit:if git -->

**Guardar el trabajo:** el proyecto guarda su historial con git, y los commits
y los push los haces tú: al cerrar cada página, la IA te propone el mensaje.
Si quieres que los haga ella, pídeselo («haz el commit y súbelo»): te dirá qué
ha entrado, en qué rama y dónde está. `/zaius-git` conecta el repositorio de
GitHub (o de GitLab, Bitbucket), apunta cómo se trabaja con ramas y, si lo
pides, monta el CI. Las reglas, en [Git](./AGENTS.md#git).
<!-- kit:end -->

## Contar de qué va

Lo primero que necesita la IA es que le cuentes de qué va la web, con tus
palabras. Copia esto detrás de `/zaius-init`, rellena lo que sepas y borra lo
que no:

```text
/zaius-init
Qué es: <el negocio o el proyecto, en una o dos frases>
Para qué es la web: <lo que tiene que conseguir: que llamen, que pidan una cita, que lean, que compren>
Quién la visita: <quién es, qué busca al llegar y si la abre sobre todo desde el móvil>
Lo que tiene que tener: <las páginas o las cosas que ya sabes que quieres>
Lo que ya hay: <logo, colores, fotos, textos, una web anterior o una que te guste>
Lo que no sé: <lo que quieres decidir con la IA>
```

Un ejemplo:

```text
/zaius-init
Qué es: un taller de bicicletas de barrio, que también alquila bicis por días.
Para qué es la web: que pidan cita para una reparación o reserven una bici por WhatsApp.
Quién la visita: gente del barrio y turistas, casi siempre desde el móvil.
Lo que tiene que tener: los precios de las reparaciones, las bicis de alquiler y cómo llegar.
Lo que ya hay: el logo y fotos del taller.
Lo que no sé: si poner un blog de rutas.
```

Lo que no cuentes, te lo pregunta. Si prefieres contarlo a tu manera, también
vale: lo importante es qué es, para qué es la web y quién la visita.

## Arrancar la web

```sh
%%PM%% install
%%PM%% run dev
```

| Para… | Comando | Dónde |
|---|---|---|
<!-- kit:if backend -->
| Trabajar con los mocks, sin la API | `%%PM%% run dev` | El puerto que diga Astro: el %%HUMAN_PORT%%, o el siguiente libre |
<!-- kit:else -->
| Ver la web mientras se trabaja | `%%PM%% run dev` | El puerto que diga Astro: el %%HUMAN_PORT%%, o el siguiente libre |
<!-- kit:end -->
| El build de producción | `%%PM%% run build` | En `dist/` |
<!-- kit:if backend -->

Cada modo lee su `.env.<modo>` (`.env.development`, `.env.production` y
`.env.test`):

- **`API_URL`:** la dirección de la API, que se fija al compilar.
- **`USE_MOCKS`:** con `true`, cada llamada la responde el JSON de mocks de
  su service (`src/services/<entidad>/<entidad>Mocks.json`), sin la API; con
  `false`, va a `API_URL`. `%%PM%% run dev` va con los mocks. Los tests,
  también.

Un `.env.<modo>.local`, que no se versiona, pisa lo de su modo en tu máquina
(por ejemplo, `USE_MOCKS=false` en `.env.development.local` para trabajar
contra la API).
<!-- kit:if !server -->

Las páginas se generan al compilar, con los datos de `API_URL`:
`%%PM%% run build` necesita la API (o, para una demo, `USE_MOCKS=true` en
`.env.production.local`).
<!-- kit:end -->
<!-- kit:end -->

## Comprobar

Antes de dar algo por hecho, todo en verde:

```sh
%%PM%% run typecheck
%%PM%% run lint
%%PM%% run test
%%PM%% run build
```

<!-- kit:if !existing -->
- **`%%PM%% run test`** pasa también la comprobación de la estructura
  (`src/tests/structure.test.ts`): que cada fichero con código tiene su test,
  que cada fichero de utils exporta un solo objeto y lo demás que dice
  [Comprobar la estructura](./docs/standards.md#comprobar-la-estructura).
<!-- kit:else -->
- **`%%PM%% run test`** pasa los tests del proyecto. La comprobación de la
  estructura (que cada fichero con código tiene su test, que cada fichero de
  utils exporta un solo objeto…) llega al terminar de traer el proyecto.
<!-- kit:end -->
- **En Windows,** desde PowerShell: con Git Bash, Vitest no encuentra el
  runner.
<!-- kit:if yarn -->
- **Con yarn,** los binarios se lanzan con `yarn run` (`yarn run vitest`): en
  yarn 1, `yarn exec` no lanza nada y termina bien.
<!-- kit:end -->
<!-- kit:if bun -->
- **Con bun,** los tests son `bun run test`: `bun test` lanza el runner de
  bun, no Vitest, y falla.
<!-- kit:end -->
- **Si el cambio se ve,** se revisan las páginas afectadas en el navegador,
  y los documentos que lo describen quedan al día. La lista entera está en
  [Comprobar un cambio](./AGENTS.md#comprobar-un-cambio).

## Publicar

Todavía no se ha publicado. `/zaius-publish` (en opencode: «usa la skill
zaius-publish») pregunta dónde, lo prepara (la dirección final de la web, el
mapa del sitio, el `robots.txt` y, si se pide, la analítica), espera tu OK,
conecta el dominio si lo hay y apunta aquí la dirección y cómo se vuelve a
publicar.

## Documentación

### Un documento por tema

| Tema | Documento | Qué tiene |
|---|---|---|
| Las reglas imprescindibles | [AGENTS.md](./AGENTS.md) | El resumen de todo, para las personas y para la IA, y las skills del proyecto. |
| Cómo se trabaja con la IA | [Cómo se trabaja con la IA](./docs/process.md) | El flujo de cada página, lo que decide la persona, cómo se itera, cómo se sigue en una sesión nueva y los estados de una página. |
| Para qué es la web | [Brief](./docs/brief.md) | Para qué es, para quién, su tono, su contenido, los idiomas y los textos legales, sus objetivos y lo que hace falta al publicar. |
| Lo que hay que construir | [Backlog](./docs/backlog.md) | El mapa del sitio y las páginas, en orden y con su estado; cada página, con su fichero en `docs/pages/`. |
| Las páginas | [Páginas](./docs/pages/README.md) | La plantilla del documento de una página, cómo se escribe y el índice: cada documento dice qué hará la página y, cuando está hecha, lo que hace. |
| Dónde va cada cosa | [Normativa](./docs/standards.md) | La organización de `src`, dónde va cada cosa, el estilo del código, lo que se revisa, las rutas y la navegación. |
<!-- kit:if backend -->
| Cómo se llama cada cosa | [Nomenclatura](./docs/naming.md) | Páginas, ficheros, componentes, funciones, services, mocks, textos y JSDoc. |
<!-- kit:else -->
| Cómo se llama cada cosa | [Nomenclatura](./docs/naming.md) | Páginas, ficheros, componentes, funciones, textos y JSDoc. |
<!-- kit:end -->
| Cómo se construye | [guides/](./docs/guides/README.md) | Un paso a paso por tarea, desde [crear una página](./docs/guides/create-a-page.md). |
| El diseño | [ux-ui/](./docs/ux-ui/README.md) | [El sistema de diseño](./docs/ux-ui/design-system.md), [las normas](./docs/ux-ui/rules.md) y las propuestas de cambio. |
| Por dónde va el trabajo | [Próximos pasos](./docs/next-steps.md) | «Dónde estamos»: lo hecho, lo que está en curso, lo siguiente y las decisiones pendientes. |

### Por dónde empezar

1. **[Cómo se trabaja con la IA](./docs/process.md)** y
   **[Normativa](./docs/standards.md):** se leen una vez.
2. **[Nomenclatura](./docs/naming.md):** se consulta siempre que hay que
   poner un nombre.
3. **[Crear una página](./docs/guides/create-a-page.md):** una página de
   principio a fin. A partir de ahí, la guía de la tarea que toque.
4. **El documento de la página** que se va a construir, en
   [docs/pages/](./docs/pages/README.md).

### Quiero…

| Quiero… | Dónde |
|---|---|
| Saber qué viene ahora | [Dónde estamos](./docs/next-steps.md#dónde-estamos) |
| Construir una página, del backlog a «hecha» | [El flujo](./docs/process.md#el-flujo) |
| Ver qué queda por construir | [Backlog](./docs/backlog.md) |
| Arrancar la web | [Arrancar la web](#arrancar-la-web) |
| Comprobar un cambio antes de darlo por hecho | [Comprobar](#comprobar) |
| Crear una página nueva | [Crear una página](./docs/guides/create-a-page.md) |
| Añadir un componente a una página | [Un componente](./docs/guides/create-a-page.md#un-componente) |
| Añadir un texto en todos los idiomas | [Los textos](./docs/guides/create-a-page.md#4-los-textos) |
| Añadir una entrada al menú o al pie | [El menú](./docs/guides/create-a-page.md#5-el-menú) |
| Cambiar un dato o un texto de la web | [Los datos de la web](./docs/standards.md#los-datos-de-la-web) |
| Que una página salga bien en Google y al compartirla | [Buscadores y compartir](./docs/guides/create-a-page.md#buscadores-y-compartir) |
| Poner imágenes o un vídeo sin hacer lenta la página | [Imágenes y vídeo](./docs/guides/create-a-page.md#imágenes-y-vídeo) |
| Animar algo | [Las animaciones](./docs/guides/create-a-page.md#las-animaciones) |
<!-- kit:if server -->
| Hacer un formulario | [Crear un formulario](./docs/guides/create-a-form.md) |
| Decidir adónde llegan los mensajes de un formulario | [Adónde llega el mensaje](./docs/guides/create-a-form.md#adónde-llega-el-mensaje) |
<!-- kit:end -->
<!-- kit:if content -->
| Publicar contenido en Markdown o MDX | [Añadir contenido](./docs/guides/add-content.md) |
<!-- kit:end -->
<!-- kit:if backend -->
| Añadir una llamada a la API | [Añadir un servicio](./docs/guides/add-a-service.md) |
| Hacer que una llamada responda con datos de prueba | [El mock](./docs/guides/add-a-service.md#4-el-mock) |
| Pedir un dato de la API | [Un dato](./docs/guides/load-and-save-data.md#2-un-dato) |
| Pintar el error y el vacío de un dato | [Carga, error y vacío](./docs/guides/load-and-save-data.md#3-carga-error-y-vacío) |
<!-- kit:end -->
<!-- kit:if privateArea -->
| Mostrar u ocultar algo según los permisos | [Aplicar permisos](./docs/guides/apply-permissions.md) |
| Guardar un dato de la zona privada | [Guardar](./docs/guides/load-and-save-data.md#guardar) |
| Guardar los filtros, la página o la pestaña | [El estado de la pantalla en la URL](./docs/guides/load-and-save-data.md#6-el-estado-de-la-pantalla-en-la-url) |
| Corregir las filas de una tabla o hacer un asistente | [Formularios por partes](./docs/guides/create-a-form.md#formularios-por-partes) |
<!-- kit:end -->
| Algo que cambia mientras se usa (una isla) | [Añadir una isla](./docs/guides/add-an-island.md) |
| Saber dónde va un fichero | [Normativa](./docs/standards.md#dónde-va-cada-cosa) |
| Saber cómo se llama algo | [Nomenclatura](./docs/naming.md) |
| Saber qué pieza visual usar para algo | [Piezas por papel](./docs/ux-ui/design-system.md#piezas-por-papel) |
| Saber cómo tiene que verse algo | [Normas](./docs/ux-ui/rules.md) y [sistema de diseño](./docs/ux-ui/design-system.md) |
| Proponer un cambio de diseño | [UX/UI](./docs/ux-ui/README.md) |
| Ver una página antes de construirla | [Bocetos](./docs/ux-ui/README.md#bocetos) |
| Escribir un test | [Escribir tests](./docs/guides/write-tests.md) |
<!-- kit:if git -->
| Guardar el trabajo o subirlo a GitHub | [Git](./AGENTS.md#git) |
<!-- kit:end -->
| Cambiar una respuesta del kit o actualizarlo | [El kit zaius-dev](#el-kit-zaius-dev) |

### Cómo se mantiene este índice

- **La columna «Dónde»** de la tabla «Quiero…» es el sitio de cada ejemplo: los
  demás documentos enlazan en vez de copiarlo.
- **Un documento nuevo, una guía nueva o un cambio de ancla** se refleja en esta
  página y en la tabla «Qué leer» de `AGENTS.md`.

## El kit zaius-dev

Este proyecto se instaló con el kit zaius-dev, versión %%KIT_VERSION%%, el
%%DATE%%. El kit trae la arquitectura, la nomenclatura, las reglas de código,
las comprobaciones, el proceso de trabajo con la IA y sus skills. Una vez
instalado, todo es del proyecto y se cambia según lo que necesite.

El kit no se instala: se lanza con `npx`, que viene con Node, siempre con la
versión del proyecto (`#v%%KIT_VERSION%%`). Con otra versión, `change`
generaría los ficheros con ella.

- **`zaius-dev.json`** guarda la versión del kit, las respuestas de la
  instalación y la huella de cada fichero tal como lo dejó el kit. Se cambia
  con las órdenes del kit, no a mano.
- **`%%KIT_RUN%% change`**
  cambia una de las respuestas de la instalación (que la web reciba
  mensajes, el blog, los idiomas, los datos de otro sistema o una zona
  privada): añade los ficheros nuevos y vuelve a generar los documentos
  compartidos.
- **`%%KIT_UPDATE%%`**
  pasa el proyecto a una versión nueva del kit, la que diga su
  `CHANGELOG.md`. Lo que el proyecto no ha tocado se sustituye y lo nuevo se
  crea.
- **`%%KIT_RUN%% status`**
  enseña la versión, las respuestas y lo que queda por fusionar.
- **La versión nueva de un fichero que el proyecto ha cambiado** no lo pisa:
  llega al lado, como `<fichero>.kit-new`, se apunta en
  `docs/next-steps.md` y la fusiona la skill `zaius-merge`, con
  tu OK.

Una regla nacida aquí que sirve para cualquier proyecto se lleva al kit desde
el propio kit, con su skill `contribute-to-kit`.

Dos notas:

- **Si el agente no carga `AGENTS.md`,** se crea `CLAUDE.md` en la raíz con una
  sola línea, `@AGENTS.md`.
- **Si se trabaja con un proyecto borrador,** se añade en «Qué es» de
  `AGENTS.md`: «El código se prueba primero en `<ruta del borrador>`, que es el
  borrador, y se pasa aquí solo cuando cumple `docs/`: nada se copia tal cual
  sin adaptarlo a la normativa y a la nomenclatura.».
