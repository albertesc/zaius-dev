# %%APP_NAME%%

Todo lo que hay que saber para construir esta app está en `docs/`: dónde va
cada cosa, cómo se llama, cómo se hace paso a paso y cómo tiene que verse. Las
reglas imprescindibles resumidas están en [AGENTS.md](./AGENTS.md); los
documentos las desarrollan, con ejemplos que se pueden copiar. Cada tema está
en un solo sitio.

**En esta página:** [Primeros pasos](#primeros-pasos), [Contar de qué va](#contar-de-qué-va), [Arrancar la app](#arrancar-la-app), [Comprobar](#comprobar), [Publicar](#publicar), [Documentación](#documentación), [El kit zaius-dev](#el-kit-zaius-dev)

## Primeros pasos

No hace falta saber programar: la IA pregunta por lo que hace la app y lo que
se ve, con una opción recomendada en cada pregunta, y al terminar cada
historia te dice cómo verla en el navegador. Cada paso lo lanzas tú, y la IA
para al terminarlo y te dice cuál sigue.

<!-- kit:if !existing -->
1. Abre la IA en esta carpeta (claude u opencode).
2. Escribe `/zaius-init` y, detrás, de qué va la app, con tus palabras
   ([Contar de qué va](#contar-de-qué-va)); en opencode, «usa la skill
   zaius-init» y lo mismo. La IA parte de lo que cuentes y te pregunta lo que
   falte: para qué es, quién la usa y qué entra y qué no. Después te propondrá
   tres identidades distintas (la idea, el logo, los colores y la letra), en un
   boceto que se abre en el navegador, para que elijas una, y lo dejará escrito
   en el brief y en el sistema de diseño, con una guía visual. Hasta que lo
   hagas, la IA no empezará ninguna otra tarea.
3. `/zaius-backlog`: la IA propone las épicas (los temas grandes de la app) y
   sus historias (cada cosa que alguien podrá hacer con ella), en orden, y las
   deja en el backlog con tu OK. Cada historia tiene su código: `ORD001`.
4. `/zaius-spec ORD001`: la IA detalla la historia (qué se podrá hacer, cómo
   se comprueba, qué se queda fuera y la lista de tests) con un boceto de la
   pantalla, para verla antes de construirla, y espera tu OK: nada se
   construye sin él.
5. `/zaius-build ORD001`: la IA la construye contigo, test a test, y para
   tras cada uno para que decidas si sigue.
6. `/zaius-review ORD001`: la IA la comprueba y la revisa, te dice cómo verla
   en el navegador y qué mirar tú, y con tu OK la da por hecha.
7. Los pasos 4 a 6, con cada historia. Para publicar la app en internet:
   `/zaius-publish`. Te pregunta dónde, comprueba que todo está en verde y
   espera tu OK antes de subir nada.
<!-- kit:else -->
1. Abre la IA en esta carpeta (claude u opencode).
2. Escribe `/zaius-init` y, detrás, de qué va la app, con tus palabras
   ([Contar de qué va](#contar-de-qué-va)); en opencode, «usa la skill
   zaius-init» y lo mismo. La IA te hará unas preguntas para escribir el brief
   de la app y definir el sistema de diseño, y después analizará el proyecto y
   propondrá cómo traerlo a las reglas del kit, por bloques. Hasta que lo hagas,
   la IA no empezará ninguna otra tarea.
3. Revisa con la IA los ficheros `.kit-new`: son las versiones del kit de
   ficheros que el proyecto ya tenía.
4. Al terminar de traerlo, `%%KIT_RUN%% change`, con Sí a «¿Ha terminado ya
   la migración?», instala el código base y las comprobaciones de
   arquitectura.
5. Lo nuevo sigue el mismo camino que en un proyecto nuevo: `/zaius-backlog`
   para apuntar las historias, y con cada una, `/zaius-spec`, `/zaius-build`
   y `/zaius-review`.
<!-- kit:end -->

En cualquier momento, mira `docs/next-steps.md`, en «Dónde estamos»: ahí
verás siempre por dónde va el trabajo, y por ahí empieza cualquier sesión
nueva de la IA. Lo demás (las llamadas a la API, los formularios, los
permisos) lo lanza la IA cuando hace falta. Cómo se trabaja con ella está en
[Cómo se trabaja con la IA](./docs/process.md), y todas las skills, las tuyas
y las suyas, en [AGENTS.md](./AGENTS.md#skills-del-proyecto).
<!-- kit:if git -->

**Guardar el trabajo:** el proyecto guarda su historial con git, y los commits
y los push los haces tú: al cerrar cada historia, la IA te propone el mensaje.
Si quieres que los haga ella, pídeselo («haz el commit y súbelo»): te dirá qué
ha entrado, en qué rama y dónde está. `/zaius-git` conecta el repositorio de
GitHub (o de GitLab, Bitbucket), apunta cómo se trabaja con ramas y, si lo
pides, monta el CI. Las reglas, en [Git](./AGENTS.md#git).
<!-- kit:end -->

## Contar de qué va

Lo primero que necesita la IA es que le cuentes de qué va la app, con tus
palabras. Copia esto detrás de `/zaius-init`, rellena lo que sepas y borra lo
que no:

```text
/zaius-init
Qué es: <la empresa o el proyecto, y el problema que resuelve la app>
Quién la usa: <cada tipo de persona y lo que hace con ella>
Lo que tiene que hacer: <lo primero que tiene que poder hacerse con ella>
Sus datos: <de dónde salen hoy y qué tiene que guardar la app>
Lo que ya hay: <logo, colores, la herramienta o la hoja de cálculo que se usa hoy>
Lo que no sé: <lo que quieres decidir con la IA>
```

Un ejemplo:

```text
/zaius-init
Qué es: una cooperativa de huertos que reparte cestas de verdura cada semana.
Quién la usa: quien prepara las cestas y quien las reparte.
Lo que tiene que hacer: ver las cestas de la semana y marcar las entregadas.
Sus datos: hoy están en una hoja de cálculo.
Lo que ya hay: el logo.
Lo que no sé: si quien reparte la usará sin conexión.
```

Lo que no cuentes, te lo pregunta. Si prefieres contarlo a tu manera, también
vale: lo importante es qué es, quién la usa y qué tiene que hacer.

## Arrancar la app

```sh
%%PM%% install
%%PM%% run dev
```

| Para… | Comando | Dónde |
|---|---|---|
<!-- kit:if mocks -->
| Trabajar con los mocks, sin la API | `%%PM%% run dev` | El puerto que diga Vite: el %%HUMAN_PORT%%, o el siguiente libre |
<!-- kit:else -->
<!-- kit:if backend -->
| Trabajar contra la API | `%%PM%% run dev` | El puerto que diga Vite: el %%HUMAN_PORT%%, o el siguiente libre |
<!-- kit:else -->
| Trabajar en la app | `%%PM%% run dev` | El puerto que diga Vite: el %%HUMAN_PORT%%, o el siguiente libre |
<!-- kit:end -->
<!-- kit:end -->
| El build de producción | `%%PM%% run build` | En `dist/` |

<!-- kit:if backend -->
Cada modo lee su `.env.<modo>` (`.env.development`, `.env.production` y
`.env.test`):

- **`VITE_API_URL`:** la dirección de la API.
<!-- kit:if mocks -->
- **`VITE_USE_MOCKS`:** con `true`, cada llamada la responde el JSON de
  mocks de su service (`src/services/<entidad>/<entidad>Mocks.json`), sin la
  API; con `false`, va a `VITE_API_URL`. `%%PM%% run dev` va con los mocks.
  Los tests, también.
<!-- kit:end -->
<!-- kit:end -->

Un `.env.<modo>.local`, que no se versiona, pisa lo de su modo en tu máquina
<!-- kit:if mocks -->
(por ejemplo, `VITE_USE_MOCKS=false` en `.env.development.local` para
trabajar contra la API).
<!-- kit:else -->
(por ejemplo, otra `VITE_API_URL` en `.env.development.local`).
<!-- kit:end -->

## Comprobar

Antes de dar algo por hecho, todo en verde:

```sh
%%PM%% run typecheck
%%PM%% run lint
%%PM%% run test
%%PM%% run build
```

- **El type-check** es `%%PM%% run typecheck` (`tsc -b`), nunca `tsc -p .`:
  `tsconfig.json` es un fichero de solución y `tsc -p .` termina sin mirar el
  código.
<!-- kit:if !existing -->
- **`%%PM%% run test`** pasa también la comprobación de la estructura
  (`src/tests/structure.test.ts`): que ninguna feature importa de otra, que
  cada fichero de utils exporta un solo objeto y lo demás que dice
  [Comprobar la estructura](./docs/standards.md#comprobar-la-estructura).
<!-- kit:else -->
- **`%%PM%% run test`** pasa los tests del proyecto. La comprobación de la
  estructura (que ninguna feature importa de otra, que cada fichero de utils
  exporta un solo objeto…) llega al terminar la migración.
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
- **Si el cambio se ve,** se revisan las pantallas afectadas en el navegador,
  y los documentos que lo describen quedan al día. La lista entera está en
  [Comprobar un cambio](./AGENTS.md#comprobar-un-cambio).

## Publicar

Todavía no se ha publicado. `/zaius-publish` (en opencode: «usa la skill
zaius-publish») pregunta dónde, lo prepara, espera tu OK, conecta el dominio
de la empresa si lo hay y apunta aquí la dirección y cómo se vuelve a
publicar.

## Documentación

### Un documento por tema

| Tema | Documento | Qué tiene |
|---|---|---|
| Las reglas imprescindibles | [AGENTS.md](./AGENTS.md) | El resumen de todo, para las personas y para la IA, y las skills del proyecto. |
| Cómo se trabaja con la IA | [Cómo se trabaja con la IA](./docs/process.md) | El flujo de cada historia, lo que decide la persona, cómo se itera, cómo se sigue en una sesión nueva y los estados de una historia. |
| Para qué es la app | [Brief](./docs/brief.md) | Para qué es, quién la usa, qué entra y qué no, las decisiones caras y los requisitos que no son pantallas. |
| Lo que hay que construir | [Backlog](./docs/backlog.md) | Las épicas y sus historias, en orden y con su estado; cada historia, con su fichero en `docs/specs/`. |
| Dónde va cada cosa | [Normativa](./docs/standards.md) | La organización de `src`, la forma de una feature, la independencia, el estilo del código, las rutas y los dominios compartidos. |
<!-- kit:if mocks -->
| Cómo se llama cada cosa | [Nomenclatura](./docs/naming.md) | Features, ficheros, componentes, funciones, services, mocks, textos y JSDoc. |
<!-- kit:else -->
<!-- kit:if backend -->
| Cómo se llama cada cosa | [Nomenclatura](./docs/naming.md) | Features, ficheros, componentes, funciones, services, textos y JSDoc. |
<!-- kit:else -->
| Cómo se llama cada cosa | [Nomenclatura](./docs/naming.md) | Features, ficheros, componentes, funciones, stores, textos y JSDoc. |
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if backend -->
| Cómo se construye | `docs/guides/` | Un paso a paso por tarea: [crear una feature](./docs/guides/create-a-feature.md), [añadir un servicio](./docs/guides/add-a-service.md), [cargar y guardar datos](./docs/guides/load-and-save-data.md), [crear un formulario](./docs/guides/create-a-form.md), [aplicar permisos](./docs/guides/apply-permissions.md) y [escribir tests](./docs/guides/write-tests.md). |
<!-- kit:else -->
| Cómo se construye | `docs/guides/` | Un paso a paso por tarea: [crear una feature](./docs/guides/create-a-feature.md), [crear un formulario](./docs/guides/create-a-form.md) y [escribir tests](./docs/guides/write-tests.md). |
<!-- kit:end -->
| El diseño | [ux-ui/](./docs/ux-ui/README.md) | [El sistema de diseño](./docs/ux-ui/design-system.md), [las normas](./docs/ux-ui/rules.md) y las propuestas de cambio. |
| Las pantallas | [features/](./docs/features/README.md) | El índice de las pantallas y un documento por cada una, que dice lo que hace hoy, en una carpeta por familia. |
| Por dónde va el trabajo | [Próximos pasos](./docs/next-steps.md) | «Dónde estamos»: lo hecho, lo que está en curso, lo siguiente y las decisiones pendientes. |
<!-- kit:if api -->
| La API tal como es hoy | [API](./docs/api/README.md) | Los endpoints que tiene la API hoy, por zona: permiso, lo que se envía, lo que devuelve, errores y rarezas, y las convenciones comunes. |
| Lo que se pide a la API | [Peticiones a la API](./docs/api-requests.md) | Lo que la app necesita que cambie la API, por feature. |
<!-- kit:end -->

### Por dónde empezar

1. **[Cómo se trabaja con la IA](./docs/process.md)** y
   **[Normativa](./docs/standards.md):** se leen una vez.
2. **[Nomenclatura](./docs/naming.md):** se consulta siempre que hay que
   poner un nombre.
3. **[Crear una feature](./docs/guides/create-a-feature.md):** una feature de
   principio a fin. A partir de ahí, la guía de la tarea que toque.
4. **La historia** que se va a construir, en `docs/specs/`, y el documento de
   sus pantallas, en [features/](./docs/features/README.md).

### Quiero…

| Quiero… | Dónde |
|---|---|
| Saber qué viene ahora | [Dónde estamos](./docs/next-steps.md#dónde-estamos) |
| Construir una historia, del backlog a «hecha» | [El flujo](./docs/process.md#el-flujo) |
| Ver qué queda por construir | [Backlog](./docs/backlog.md) |
| Arrancar la app | [Arrancar la app](#arrancar-la-app) |
| Comprobar un cambio antes de darlo por hecho | [Comprobar](#comprobar) |
| Montar una pantalla nueva | [Crear una feature](./docs/guides/create-a-feature.md) |
| Añadir una página, un componente o un hook a una feature | [La página](./docs/guides/create-a-feature.md#4-la-página) |
| Añadir un texto en todos los idiomas | [Los textos](./docs/guides/create-a-feature.md#5-los-textos) |
| Añadir una entrada al menú | [El menú](./docs/guides/create-a-feature.md#6-el-menú) |
<!-- kit:if backend -->
| Mostrar u ocultar algo según los permisos | [Aplicar permisos](./docs/guides/apply-permissions.md) |
| Añadir una llamada a la API | [Añadir un servicio](./docs/guides/add-a-service.md) |
<!-- kit:if mocks -->
| Hacer que una llamada responda con datos de prueba | [El mock](./docs/guides/add-a-service.md#4-el-mock) |
<!-- kit:end -->
| Pedir un dato del servidor | [Un dato](./docs/guides/load-and-save-data.md#2-un-dato) |
| Guardar un dato y recargar lo que cambia | [Guardar](./docs/guides/load-and-save-data.md#guardar) |
| Pintar la carga, el error y el vacío | [Carga, error y vacío](./docs/guides/load-and-save-data.md#3-carga-error-y-vacío) |
| Guardar lo que sobrevive a salir de la pantalla | [El store de una pantalla](./docs/guides/load-and-save-data.md#6-el-store-de-una-pantalla) |
<!-- kit:else -->
| Saber qué guarda la app y dónde | [Decisiones caras](./docs/brief.md#decisiones-caras), en el brief |
<!-- kit:end -->
| Hacer un formulario | [Crear un formulario](./docs/guides/create-a-form.md) |
| Corregir las filas de una tabla o hacer un asistente | [Formularios por partes](./docs/guides/create-a-form.md#formularios-por-partes) |
| Usar un dominio o añadirle una pieza | [Dominios](./docs/standards.md#dominios) |
| Saber dónde va un fichero | [Normativa](./docs/standards.md#dónde-va-cada-cosa) |
| Saber cómo se llama algo | [Nomenclatura](./docs/naming.md) |
| Saber qué pieza visual usar para algo | [Piezas por papel](./docs/ux-ui/design-system.md#piezas-por-papel) |
| Saber cómo tiene que verse algo | [Normas](./docs/ux-ui/rules.md) y [sistema de diseño](./docs/ux-ui/design-system.md) |
| Proponer un cambio de diseño | [UX/UI](./docs/ux-ui/README.md) |
| Ver una pantalla antes de construirla | [Bocetos](./docs/ux-ui/README.md#bocetos) |
| Escribir un test | [Escribir tests](./docs/guides/write-tests.md) |
<!-- kit:if api -->
| Saber cómo responde un endpoint de la API | [API](./docs/api/README.md) |
| Saber qué se le pide a la API | [Peticiones a la API](./docs/api-requests.md) |
<!-- kit:end -->
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
  cambia una de las respuestas de la instalación: añade los ficheros nuevos y
  vuelve a generar los documentos compartidos.
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
