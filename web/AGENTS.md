# AGENTS.md

Guía para los agentes de IA que trabajan en %%APP_NAME%%: las reglas
imprescindibles del proyecto, resumidas. Los documentos de `docs/` las
desarrollan, con ejemplos.

Cómo se trabaja con la IA está en
[Cómo se trabaja con la IA](./docs/process.md), y no se repite aquí: el flujo
de cada página, lo que decide la persona y lo que necesita su OK, cómo se le
habla, cómo se itera y cómo se sigue en una sesión nueva. Un cambio de diseño,
también del sistema de diseño, va como propuesta y no se aplica en el código
hasta que se acepta
([Cómo se cambia el diseño](./docs/ux-ui/README.md#cómo-se-cambia-el-diseño)).

## Antes de nada

Cualquier sesión, con cualquier IA o persona, empieza igual, sin dar nada por
sabido de una conversación anterior
([Empezar de cero](./docs/process.md#empezar-de-cero-en-cualquier-punto)):

1. Lee este fichero y [Dónde estamos](./docs/next-steps.md#dónde-estamos).
2. Cuenta a la persona dónde se está y propón el comando que sigue, sin
   lanzarlo: cada etapa la lanza ella.

<!-- kit:if git -->
Todo lo que se escribe (a la persona, en los documentos, en los commits y en
la %%KIND%%) va
<!-- kit:else -->
Todo lo que se escribe (a la persona, en los documentos y en la %%KIND%%) va
<!-- kit:end -->
[como lo escribiría una persona](./docs/process.md#escribir-como-una-persona):
sin «·», «→», «—», «✓» ni emojis, sin las aperturas de un chatbot ni las
frases de la IA.

Mientras el [brief](./docs/brief.md) no esté aprobado (su cabecera dice
«Estado: pendiente» o «por aprobar»), lo que sigue es `/zaius-init` (en
opencode, «usa la skill zaius-init»): sin el brief y el sistema de diseño no
se puede apuntar, especificar ni construir ninguna página. Si te piden otra
cosa, contesta que primero toca `zaius-init`.
<!-- kit:if existing -->
En este proyecto, que ya existía, `zaius-init` sigue con `zaius-adopt`: el
análisis del código y el plan para traerlo a estas reglas, por bloques.
<!-- kit:end -->

## Qué es %%APP_NAME%%

Pendiente: lo escribe `zaius-init`, con lo esencial del
[brief](./docs/brief.md).

<!-- kit:if existing -->
El kit zaius-dev se ha aplicado sobre un proyecto que ya existía. El código
se trae a estas reglas por bloques, con la skill `zaius-adopt`, y lo que se
escribe nuevo ya las cumple. El código base y la comprobación de la
estructura del kit llegan al terminar, con `%%KIT_RUN%% change`, porque hasta
entonces fallarían. Los ficheros `.kit-new` son las versiones del kit de
ficheros que el proyecto ya tenía: se revisan con la persona y se fusionan o
se descartan.

<!-- kit:end -->
## Stack y comandos

<!-- kit:if server -->
- Astro 7 + TypeScript (estricto): las páginas se generan al compilar, salvo
  las que necesitan el servidor (`prerender = false`), que se pintan en cada
  petición, en Node hasta que se elige la plataforma al publicar.
- Zod para validar; las actions de Astro para lo que envían los formularios
<!-- kit:if privateArea -->
  y el middleware para la sesión.
<!-- kit:else -->
  y el middleware para responderlos.
<!-- kit:end -->
<!-- kit:else -->
- Astro 7 + TypeScript (estricto), sin servidor: todas las páginas se generan
  al compilar.
<!-- kit:end -->
<!-- kit:if backend -->
- Los datos de otro sistema, de su API, con un service por entidad y sus
  mocks.
<!-- kit:end -->
<!-- kit:if content -->
- Las colecciones de contenido de Astro, en Markdown o MDX.
<!-- kit:end -->
- i18next: los textos van siempre en su catálogo, aunque la web tenga un
  solo idioma. Los idiomas, %%LANGUAGES%%; el primero, `%%DEFAULT_LANGUAGE%%`,
  es el de por defecto.
- Sin islas al empezar: la primera, con React, llega cuando hace falta
  ([Islas](./docs/standards.md#islas)).
- El sistema de diseño, en `docs/ux-ui/design-system.md`.
- `<style>` con ámbito; Vitest + Testing Library; ESLint; el mapa del sitio,
  con `@astrojs/sitemap`.

| Comando | Qué hace |
|---|---|
<!-- kit:if backend -->
| `%%PM%% run dev` | Arranca Astro con los mocks (`USE_MOCKS=true`, en `.env.development`). |
<!-- kit:else -->
| `%%PM%% run dev` | Arranca Astro en el %%HUMAN_PORT%%. |
<!-- kit:end -->
| `%%PM%% run dev:review` | Arranca otro servidor en el %%REVIEW_PORT%%, para la revisión visual de la IA. |
| `%%PM%% run typecheck` | Type-check (`astro check`). |
| `%%PM%% run build` | Type-check y build. |
| `%%PM%% run lint` | ESLint. |
| `%%PM%% run test` | Vitest. |
| `%%KIT_RUN%% <orden>` | El kit, con la versión de este proyecto: cambia una respuesta (`change`) o enseña su estado (`status`). Para pasar a una versión nueva, `%%KIT_UPDATE%%`. |

Desde un agente, `%%PM%% run dev` se va solo a segundo plano y se para con
`%%PM_EXEC%% astro dev stop`; la revisión visual va en su propio servidor,
`%%PM%% run dev:review`, que arranca en primer plano junto al de la persona.
<!-- kit:if yarn -->

Los binarios del proyecto se lanzan con `yarn run` (`yarn run vitest`): en
yarn 1, `yarn exec` no lanza nada y termina bien.
<!-- kit:end -->
<!-- kit:if bun -->

Los tests son `bun run test`: `bun test` lanza el runner de bun, no Vitest, y
falla.
<!-- kit:end -->

## Mapa de `src/`

| Carpeta | Qué va |
|---|---|
<!-- kit:if server -->
| `pages/` | Las rutas: una página por URL (`rooms.astro` es `/rooms`; `legal/notice.astro`, `/legal/notice`), y las genéricas, `404.astro` y `500.astro`. |
| `pages/api/` | Los endpoints: solo lo que es HTTP de verdad (un fichero que se descarga, un webhook). |
<!-- kit:else -->
| `pages/` | Las rutas: una página por URL (`rooms.astro` es `/rooms`; `legal/notice.astro`, `/legal/notice`), y la genérica, `404.astro`. |
<!-- kit:end -->
| `layouts/` | Los layouts, generales: `BaseLayout.astro`, el documento HTML (el título, la descripción y la imagen para compartir), y `AppLayout.astro`, el marco de la web (la cabecera del sitio, el menú y el pie), que nace con la primera página. |
| `components/` | Los componentes, planos, sin subcarpetas (`HomeHeader.astro`, `RoomCard.astro`, `AppFooter.astro`), y las islas, si las hay. Solo pintan: reciben los datos por props. |
<!-- kit:if server -->
| `actions/` | Lo que envían o guardan los formularios, en el fichero de su página o su sección (`contactActions.ts`), con los schemas de sus formularios (`contactFormSchema.ts`); `index.ts` las compone. |
<!-- kit:if privateArea -->
| `middleware.ts`, `env.d.ts` | Sueltos en `src/`: el post/redirect/get de los formularios y la sesión de cada petición, y el tipo de `Astro.locals`. |
<!-- kit:else -->
| `middleware.ts` | Suelto en `src/`: el post/redirect/get de los formularios. Nace con el primero. |
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if content -->
| `content.config.ts`, `content/` | Las colecciones de contenido, con su schema, y sus entradas, en `content/<colección>/` (`content/blogPosts/`). Nacen con la primera colección. |
<!-- kit:end -->
<!-- kit:if backend -->
| `services/<entidad>/` | El service de la entidad, los schemas de sus respuestas y sus mocks: un JSON al lado del service, `<entidad>Mocks.json`, con la respuesta de cada endpoint. |
| `schemas/` | Los schemas que comparten varias entidades (`commonSchema.ts`). |
<!-- kit:end -->
| `utils/`, `types/`, `constants/` | Funciones puras (en un objeto por tema: `formatUtils.formatDate`), tipos y constantes: `appLanguages.ts`, los idiomas de la web; `appNavigation.ts`, el menú y el pie; y los datos que se escriben en la propia web y cambian a menudo, como las habitaciones y sus precios (`rooms.ts`). |
<!-- kit:if backend -->
| `utils/api*Utils.ts`, `types/api.ts` | El transporte, lo único que habla con la API, nunca desde el navegador: `apiUtils.request`, `upload` y `download`; el fallo de una llamada (`apiErrorUtils`: `isNotFound`, `getRequestFailure`…); y `apiMockUtils`, que responde con los `*Mocks.json` cuando `USE_MOCKS=true`. |
<!-- kit:end -->
<!-- kit:if privateArea -->
| `utils/apiSessionUtils.ts` | El token de cada petición: el middleware la corre con su sesión (`apiSessionUtils.run`). |
<!-- kit:end -->
| `styles/` | Los tokens propios del sistema de diseño (`tokens.css`), si los tiene, y los estilos globales, que importa una vez `BaseLayout.astro`. |
| `assets/` | Las imágenes que optimiza Astro (`<Image>`), con el prefijo de su página (`homeHeader.jpg`). Lo que se sirve tal cual (el icono de la pestaña, las imágenes para compartir) va en `public/`, fuera de `src/`. |
| `i18n/` | La configuración de i18next (`i18n.ts`, con `getI18nT`) y un catálogo por idioma (`<idioma>.json`). |
<!-- kit:if server -->
| `tests/` | La comprobación de la estructura (`structure.test.ts`, `docs/standards.md#comprobar-la-estructura`), la configuración de Vitest (`setup.ts`), los ayudantes de los tests (`testUtils.ts`: `renderAstro`, `callAction` y, con varios idiomas, `translate`) y los tests de las páginas, en `tests/pages/`, con la ruta de su página. |
<!-- kit:else -->
| `tests/` | La comprobación de la estructura (`structure.test.ts`, `docs/standards.md#comprobar-la-estructura`), la configuración de Vitest (`setup.ts`), los ayudantes de los tests (`testUtils.ts`: `renderAstro` y, con varios idiomas, `translate`) y los tests de las páginas, en `tests/pages/`, con la ruta de su página. |
<!-- kit:end -->

Solo existen las carpetas que hacen falta: ninguna se crea hasta que una pieza
la necesita.

## Imprescindible: la página manda

<!-- kit:if backend -->
<!-- kit:if server -->
- Una página por URL, en `src/pages/`. Su frontmatter lee los datos (los de
  `constants/` y los de la API, con los services),
<!-- kit:if privateArea -->
  aplica los permisos,
<!-- kit:end -->
  elige el estado (error, vacío, no existe) y pinta un layout y los
  componentes.
- Solo las páginas, los endpoints, las actions, el middleware y las islas de
  servidor llaman a los services y al transporte. Un componente solo pinta:
  recibe los datos por props.
<!-- kit:else -->
- Una página por URL, en `src/pages/`. Su frontmatter lee los datos (los de
  `constants/` y los de la API, con los services, al compilar) y pinta un
  layout y los componentes.
- Solo las páginas llaman a los services y al transporte. Un componente solo
  pinta: recibe los datos por props.
<!-- kit:end -->
- La comprobación de la estructura (`src/tests/structure.test.ts`) lo mira.
<!-- kit:else -->
<!-- kit:if content -->
- Una página por URL, en `src/pages/`. Su frontmatter lee los datos (los de
  `constants/` y los de sus colecciones) y pinta un layout y los
  componentes.
<!-- kit:else -->
- Una página por URL, en `src/pages/`. Su frontmatter lee los datos (los de
  `constants/`) y pinta un layout y los componentes.
<!-- kit:end -->
- Un componente solo pinta: recibe los datos por props.
<!-- kit:end -->
- Cada página da al layout su título, su descripción y su imagen para
  compartir; lo demás de los buscadores lo pone `BaseLayout.astro`.
- Una isla solo donde un `<script>` no basta, y nunca importa código que solo
  funciona en el servidor.

## Nomenclatura

Es lo más importante del proyecto. Los listados completos están en
`docs/naming.md`.

- **Ficheros y carpetas, en inglés,** también los documentos y las skills
  (`docs/standards.md`, `docs/guides/create-a-page.md`,
  `.claude/skills/zaius-page/`), aunque su contenido vaya en castellano: el
  contenido puede cambiar de idioma sin romper enlaces ni órdenes.

- **Páginas:** una por URL, en `src/pages/`, en la ruta de su URL, con su
  prefijo, que es su URL en camelCase: `/` es `home`, `/rooms` es `rooms`
  (`rooms.astro`), `/legal/notice` es `legalNotice`
<!-- kit:if content -->
  (`legal/notice.astro`) y `/blog/[...slug]`, `blogPost`.
<!-- kit:else -->
  (`legal/notice.astro`).
<!-- kit:end -->
<!-- kit:if privateArea -->
  `/account/bookings/[id]/edit` es `accountBookingsEdit`, la gestión de un
  registro: `/account/bookings/[id]` no es una ruta.
<!-- kit:end -->
  Su nombre, en el backlog y en su documento, es el prefijo en mayúsculas,
  con un guion entre palabras: HOME, ROOMS, LEGAL-NOTICE
  (`docs/pages/LEGAL-NOTICE.md`). Las secciones, las pestañas y los modales
  no son páginas.
- **El fichero se llama como lo que exporta.** Si agrupa varias piezas del mismo
  tipo: `<prefijo><Zona><Tipo>`. La configuración estática es
  `<qué configura>.config.ts`.
- **Prefijo de origen:** lo de una sola página lleva su prefijo
  (`HomeRoomsSection.astro`); lo de varias páginas, si es de negocio, su
  entidad (`RoomCard.astro`); lo genérico, ninguno: se nombra por lo que es
  (`AppHeader.astro`, `formatUtils`). Las carpetas son planas: el prefijo es
  lo único que dice de quién es cada pieza. No se repite lo que ya dice el
  prefijo.
- **Componentes:** `<Prefijo><Zona?><Objeto><Acción?><Tipo>`, con un solo tipo
  final de la lista de `docs/naming.md#componentes` (`Layout`, `Header`,
  `Footer`, `Section`, `Card`, `List`, `Gallery`, `Viewer`, `Form`,
  `Modal`…). La portada de una página es su `Header` (`HomeHeader`). Las
  páginas no llevan tipo: son las rutas. Un tipo nuevo necesita el OK de la
  persona.
- **Verbos:** los de `docs/naming.md#componentes` (`Send`, `Add`, `Remove`,
  `Edit`, `Cancel`, `Download`…). Un verbo nuevo necesita el OK de la
  persona.
- **Singular o plural:** singular si es un elemento, plural si son varios. Una
  `List` va en plural (`RoomsList`) y la pieza que repite, en singular.
- **Funciones:** empiezan por un verbo. Utils: un objeto por tema,
  `<prefijo><Tema>Utils` (`roomPriceUtils`), con los métodos con su nombre
  entero (`roomPriceUtils.buildRoomStayPrice`).
<!-- kit:if server -->
- **Actions:** un fichero por página o sección (`contactActions.ts`), con
  cada action con su verbo y su objeto (`actions.contact.sendContactMessage`)
  y el schema de su formulario al lado (`contactFormSchema.ts`).
<!-- kit:end -->
<!-- kit:if backend -->
- **Services:** uno por entidad, con métodos `<verbo><Entidad><Zona?><Qué>`:
  la entidad del service va siempre detrás del verbo, en singular si el método
  trata un registro (`getBookingDetail`, `cancelBooking`,
  `getBookingCancelReasonsCatalog`) y en plural si trata varios
  (`getBookingsAvailability`, `getBookingsListPage`). El schema y el tipo de
  la respuesta se llaman como el método (`bookingsAvailabilitySchema`,
  `BookingsAvailability`).
- **Mocks:** un JSON al lado de su service, `<entidad>Mocks.json`
  (`bookingsMocks.json`), con una clave `"<MÉTODO> /ruta"` por endpoint
  (`"GET /booking/availability"`) y su respuesta, con la forma real de la
  API: `docs/naming.md#mocks`.
<!-- kit:end -->
- Nombres largos sí; abreviaturas y nombres genéricos (`data`, `items`,
  `handlers`), no.
<!-- kit:if backend -->
  Tampoco las palabras del backend cuando la web llama a la entidad de otra
  forma: si la API dice `reservation` y la web «reserva», el código dice
  `booking`.
<!-- kit:end -->

## Sencillez y tamaño

- Un componente es un fichero, no una carpeta: su test va al lado.
- Un componente solo pinta. Cada subpieza es otro componente, en su propio
  fichero; lo que no pinta (un cálculo, un ayudante) va a `utils/`.
- Los utils de un tema van en un objeto: `utils/dateUtils.ts` exporta solo
  `dateUtils`, que se usa con él delante (`dateUtils.getToday()`). Cada función
  se declara suelta, con su JSDoc, y el objeto del final las reúne; lo que no
  está en él es privado. Se llama `<prefijo><Tema>Utils`, sin carpetas de
  tema, y lo mira la comprobación de la estructura. Las constantes que se
  exportan van a `constants/`, y los tipos compartidos, a `types/`.
<!-- kit:if backend -->
  Solo el transporte (`apiUtils` y los suyos) habla con la red.
<!-- kit:end -->
- Todo fichero con código lleva su test al lado, con el mismo nombre (el de
  `RoomCard.astro` es `RoomCard.test.ts`). Solo se libran los que únicamente
  declaran (tipos, constantes y configuración) y el código base que trae el kit,
  que lo prueba el propio kit. Las páginas
<!-- kit:if server -->
  y los endpoints
<!-- kit:end -->
  llevan el suyo en `src/tests/pages/`, con su misma ruta: Astro convierte en
  ruta cualquier fichero de `src/pages/`. Lo mira la comprobación de la
  estructura.
- Un test no se manipula para que pase: si falla, se arregla el código, y si
  el test está mal, se pregunta
  (`docs/guides/write-tests.md#un-test-no-se-manipula`).
  Sus textos salen del catálogo, con `testUtils.translate`, nunca escritos a
  mano.
- `components/` es plana, sin subcarpetas: el prefijo ya agrupa las piezas. No
  hay carpetas por tipo de fichero.
- Se extrae solo lo que es igual, y cuando aparece la segunda copia o el
  documento de la página ya dice que la habrá. Nada de componentes genéricos
  llenos de huecos.
- Nada «por si acaso»: ni dependencias, ni abstracciones, ni ficheros, ni
  props, variantes o estados que la página no use.
- Tamaño orientativo: ~150 líneas por fichero y ~100 por componente. Si se pasa,
  se divide por significado, nunca por tipo técnico.

## Código

- TypeScript estricto: sin `any`, sin casts innecesarios, `import type` para
  los tipos, sin `enum` ni `namespace`.
- Renderizado condicional: cada condición va en una constante con nombre antes
  del HTML (`const hasPhotos = room.photos.length > 0`), y en el HTML siempre
  `{hasPhotos ? <RoomPhotosGallery photos={room.photos} /> : null}`; nunca
  `&&`. Un ternario anidado vale si cada condición es una de esas
  constantes. Un booleano que ya tiene nombre (una prop, un `canX`) ya lo es.
- Un componente pinta: recibe los datos por props (`interface Props`). Lo que
  pasa de unas líneas de cálculo va a un util puro.
<!-- kit:if backend -->
- Los datos se leen en el frontmatter de la página: los de la web, de
  `constants/`, y los de la API, con los services (a la vez si son varios);
  un componente nunca llama a un service.
- Las respuestas de la API se validan con zod en el transporte; los tipos salen
  de los schemas con `z.infer`.
<!-- kit:else -->
- Los datos se leen en el frontmatter de la página, de `constants/`; un
  componente los recibe por props.
<!-- kit:end -->
<!-- kit:if server -->
- Un formulario es un `<form>` que envía a su action y funciona sin
  JavaScript; la action valida lo que llega con su schema.
<!-- kit:if privateArea -->
  En la zona privada, comprueba además la sesión y el permiso.
<!-- kit:end -->
<!-- kit:end -->
- Lo que tiene que durar (la página de una lista, una pestaña) va en la URL,
  nunca en el `sessionStorage`.
- i18n: ningún texto de usuario en el código; los textos salen de
  `const t = getI18nT(Astro.currentLocale)`, en el frontmatter, con las claves
  de un solo catálogo por idioma, agrupadas por página (`rooms.title`,
  `common.actions.send`). Todos los idiomas llevan las mismas claves.
- JSDoc en toda función que no es componente, siempre con la misma forma: qué
  hace (una o dos líneas), un `@param` por parámetro, `@returns` y `@throws` si
  tocan, cada uno en una línea; de 6 a 8 líneas como mucho.
<!-- kit:if backend -->
  En los services, la descripción empieza por el endpoint.
<!-- kit:end -->
  Las funciones internas de un componente y los objetos sin comportamiento
  (schemas, configuración, constantes) no llevan JSDoc ni otro comentario.
- Sin comentarios en el cuerpo ni en los componentes. El código está en inglés y
  el JSDoc en castellano, y describe el proyecto por sí mismo, sin referencias a
  otros proyectos.

## Diseño y UX

Las normas, desarrolladas y con ejemplos, están en `docs/ux-ui/rules.md`; aquí
va una frase por norma. Las piezas se nombran por su papel (la portada de una
página, la tarjeta de contenido), y cuál es cada una en este proyecto lo dice
`docs/ux-ui/design-system.md#piezas-por-papel`.

- **D1. El sistema de diseño primero.** Se usan sus piezas y sus tokens: nada
  de colores sueltos, `!important` ni estilos en línea. Lo que falta y es
  genérico se pide al sistema de diseño, no se rehace en una página.
- **D2. Sin textos explicativos.** Lo que se usa (un formulario, una sección
  de datos) muestra solo su título; lo que necesita explicación lleva el icono
  de información. El contenido de la web (lo que cuenta) no es un texto
  explicativo: va entero.
- **D3. Estados de carga, error y vacío.** La página llega con sus datos, y
  solo lo que se carga después lleva un esqueleto con la forma del contenido;
  «Todavía no hay ninguna …» o «Ninguna … con estos filtros»; y la página que
  no existe, dentro de la web, con una salida.
- **D4. Avisos y fallos.** Cada fallo dice «No se ha podido …» y va donde se
  ve (encima del botón de un formulario, bajo su campo), nunca en un aviso
  efímero, que solo confirma lo que el control no enseña.
- **D5. Acciones.** En cada zona, la salida a la izquierda y el primario el
  último, uno por zona. Lo que no se puede hacer no se ofrece. Mientras actúa,
  `loading` sin cambiar el texto, y nada se pinta como hecho antes de que el
  servidor lo confirme.
- **D6. Formularios.** Se valida a partir del primer intento, sale «Hay N
  campos por revisar», cada campo lleva su etiqueta a la vista, la casilla de
  la privacidad va sin marcar y salir con algo escrito avisa antes.
<!-- kit:if privateArea -->
- **D7. Un registro, una pantalla.** En la zona privada, cada registro tiene
  una sola página, su gestión (`/account/bookings/[id]/edit`), con un solo
  botón para guardar; sin permiso para editar, la misma página se abre en
  lectura.
- **D8. Listados y tablas.** Solo las columnas imprescindibles; las acciones de
  la tabla, en su cabecera; paginación de 10, 25 o 50 filas; el buscador
  espera 400 ms. Filtros, página y orden van en la URL.
- **D9. Modales.** Deciden o piden lo mínimo y nunca sirven para leer. Su botón
  dice lo que hace, y solo se confirma lo que no se puede deshacer.
<!-- kit:end -->
- **D10. Navegación.** Lo que lleva a otra página es un enlace; el menú y el
  pie son los mismos en toda la web y marcan dónde se está; la pestaña dice
  «<título> - %%APP_NAME%%».
- **D11. Textos y formato.** Se trata de tú; las acciones, en imperativo, con
  verbo y objeto («Pide disponibilidad»). Fechas, cifras y precios, siempre
  con las funciones de formato de la raíz; lo que falta es «-». Sin los
  signos ni las frases de la IA («·», «→», «—», «✓», emojis).
- **D12. Accesibilidad.** Los botones de icono llevan `aria-label`, cada imagen
  su `alt`, el foco siempre se ve, todo se hace con teclado, nada que se pulse
  mide menos de 24 px y el contraste sale de los tokens. Cada página se prueba
  con el teclado, con un lector de pantalla y con el zoom al 200 %.
- **D13. Movimiento.** Lo que se mueve explica qué ha cambiado, corto y con
  los tokens de «Movimiento»; lo que se pulsa responde al pasar por encima y
  con el foco; con «reducir movimiento», como mucho un fundido; nada se
  queda escondido esperando una animación, y lo que se mueve solo se puede
  parar.
- **D14. Buscadores y compartir.** Cada página pública tiene su título, su
  descripción y su imagen para compartir (por las props de `BaseLayout`); la
  web, su dirección final (`site`), su mapa y su `robots.txt`; lo que no es
  público lleva `noindex`. Se aplica siempre, como la accesibilidad: solo se
  pregunta el contenido.
- **D15. Jerarquía, espacios y columnas.** Lo que más importa, primero y
  más grande, con pocos niveles bien distintos. Lo que va junto, cerca, y lo
  que no, separado, con el mismo token para la misma relación. Una rejilla
  para toda la página: la cabecera, las secciones y el pie, con el mismo
  ancho y los mismos márgenes; el pie, en columnas; en el móvil, una
  columna.
- **D16. Lo que no se hace.** Salvo que la persona lo pida, ni un borde de
  color a la izquierda ni lo que delata un diseño hecho por IA (la etiqueta
  en mayúsculas sobre cada título, la flecha en los enlaces, las tarjetas
  iguales con sombra gris…).

- **Sistema de diseño:** pendiente de definir (lo escribe `zaius-init`).

Una norma nueva o cambiada llega por una propuesta aceptada, con
`zaius-design`, y añade aquí su frase, con el número siguiente.

## Skills del proyecto

Están en `.claude/skills/<nombre>/SKILL.md`. Las del kit llevan el prefijo
`zaius-`, para encontrarlas juntas, y detrás una palabra; una del proyecto
(como una skill de diseño propia) va con su nombre, y con su línea al final
de esta lista. En Claude Code se lanzan con `/<nombre>`; en opencode, con
«usa la skill <nombre>». Cada etapa la lanza la persona, y ninguna skill
lanza la siguiente ([El flujo](./docs/process.md#el-flujo)).

**Las que lanza la persona,** en el orden del trabajo:

- `zaius-init`: la primera; el brief (`docs/brief.md`) y el sistema de
  diseño, con su guía visual. Se vuelve a lanzar para cambiar el brief.
- `zaius-backlog`: las páginas, cada una con su historia, y el mapa del
  sitio (`docs/backlog.md`), con el fichero de cada página en `docs/pages/`;
  también para añadir, cambiar, partir, ordenar o quitar.
- `zaius-page`: especifica una página (`/zaius-page ROOMS`): su documento,
  sus secciones, su contenido, sus datos, su lista de tests y su boceto.
  Espera el OK. También cambia una que aún no está hecha.
- `zaius-build`: construye en pareja una página aprobada, test a test,
  parando tras cada uno.
- `zaius-review`: comprueba y revisa una página sin el contexto de la
  conversación y, con el OK, la da por hecha y pone al día su documento. Sin
  página, revisa el cambio en curso.
- `zaius-publish`: publica en internet, con el OK (la plataforma, el
  dominio, la analítica y el mapa del sitio), y apunta cómo se vuelve a
  publicar.
- `zaius-refactor`: propone mejorar lo que ya está hecho, sin cambiar lo que
  se puede hacer; con el OK, se construye y se cierra como una página.
- `zaius-brand`: la identidad de la web (su idea, su logo, sus colores, su
  letra, sus fotos y su firma), en tres direcciones para elegir una.
- `zaius-sketch`: un boceto en HTML de una página o de una idea, con la
  identidad de la web, para verlo antes de construirlo.
- `zaius-design`: una propuesta de diseño, sin tocar el código.
- `zaius-rename`: alinea los nombres del proyecto con la nomenclatura, por
  bloques y con el OK.
- `zaius-merge`: fusiona los `.kit-new` del kit, con el OK.
<!-- kit:if git -->
- `zaius-git`: el repositorio git: conecta el remoto, apunta cómo se trabaja
  con ramas, monta el CI y, si se le pide, hace el commit, el push o el pull
  request.
<!-- kit:end -->
- `zaius-languages`: añade un idioma a la web: lo apunta, traduce su
  catálogo y le da sus direcciones.
<!-- kit:if server -->

**Las que usa la IA** dentro de las anteriores (quien programa también las
puede lanzar sueltas):

- `zaius-form`: un formulario con su action, sus campos y adónde llega lo
  que se envía.
<!-- kit:if backend -->
- `zaius-service`: un endpoint de la API, del schema a la página que lo lee.
<!-- kit:end -->
<!-- kit:if privateArea -->
- `zaius-permissions`: la regla, la página, los botones, las actions y el
  menú de la zona privada.
<!-- kit:end -->
<!-- kit:if existing -->
- `zaius-adopt`: trae a estas reglas el código que ya había, por bloques; la
  lanza `zaius-init`.
<!-- kit:end -->
<!-- kit:else -->
<!-- kit:if backend -->

**Las que usa la IA** dentro de las anteriores (quien programa también las
puede lanzar sueltas):

- `zaius-service`: un endpoint de la API, del schema a la página que lo lee.
<!-- kit:if existing -->
- `zaius-adopt`: trae a estas reglas el código que ya había, por bloques; la
  lanza `zaius-init`.
<!-- kit:end -->
<!-- kit:else -->
<!-- kit:if existing -->

**La que usa la IA** dentro de las anteriores:

- `zaius-adopt`: trae a estas reglas el código que ya había, por bloques; la
  lanza `zaius-init`.
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:end -->

## Qué leer

Índice de todos los documentos: `README.md`, en la raíz. Las guías paso a paso
están en `docs/guides/`.

| Tarea | Documento |
|---|---|
| Cómo se trabaja con la IA: el flujo, lo que decide la persona y los estados de una página | `docs/process.md` |
| Dónde se está y qué viene después | `docs/next-steps.md#dónde-estamos` |
| Para qué es la web, para quién, su tono, su contenido y sus objetivos | `docs/brief.md` |
| Las páginas y el mapa del sitio, con su estado | `docs/backlog.md` |
| Una página: para qué es, sus secciones, sus datos y su lista de tests | `docs/pages/<NOMBRE>.md` (`docs/pages/ROOMS.md`) y la plantilla, en `docs/pages/README.md` |
| Instalar y arrancar la web | `README.md#arrancar-la-web` |
| Publicar la web y volver a publicarla | `README.md#publicar` y la skill `zaius-publish` |
| Dónde va cada cosa | `docs/standards.md` |
| Cómo llamar a algo | `docs/naming.md` |
| Montar una página nueva | `docs/guides/create-a-page.md` |
| Los datos de la web: dónde van y cómo se cambian | `docs/standards.md#los-datos-de-la-web` |
<!-- kit:if server -->
| Un formulario y adónde llega lo que se envía | `docs/guides/create-a-form.md` |
<!-- kit:end -->
<!-- kit:if content -->
| Contenido en Markdown o MDX: una colección | `docs/guides/add-content.md` |
<!-- kit:end -->
<!-- kit:if backend -->
| Añadir un endpoint de la API | `docs/guides/add-a-service.md` |
| Cargar datos de la API | `docs/guides/load-and-save-data.md` |
<!-- kit:end -->
<!-- kit:if privateArea -->
| Permisos de una página, un botón o el menú de la zona privada | `docs/guides/apply-permissions.md` |
<!-- kit:end -->
| Una zona con JavaScript: una isla | `docs/guides/add-an-island.md` |
| Una página o un cambio visual | `docs/ux-ui/rules.md`, `docs/ux-ui/design-system.md` y `docs/ux-ui/proposals/` |
| El sistema de diseño: la librería, los tokens y la pieza de cada papel | `docs/ux-ui/design-system.md` |
| Las normas de diseño | `docs/ux-ui/rules.md` |
| Proponer un cambio de diseño | `docs/ux-ui/README.md` |
| Ver algo antes de construirlo: un boceto | `docs/ux-ui/README.md#bocetos` |
| Tests | `docs/guides/write-tests.md` |
| Lo que mira la comprobación de la estructura | `docs/standards.md#comprobar-la-estructura` |
| Lo que se mira al revisar un cambio | `docs/standards.md#qué-se-revisa` |
<!-- kit:if existing -->
| Lo que se mira al traer el código que ya había | `docs/standards.md#traer-un-proyecto-que-ya-existe` |
<!-- kit:end -->
| Alinear los nombres con la nomenclatura | `docs/naming.md#revisar-los-nombres` |
| Las respuestas del kit, su versión y cómo se actualiza | `README.md#el-kit-zaius-dev` |

## Comprobar un cambio

- `%%PM%% run typecheck`, `%%PM%% run lint`, `%%PM%% run test` y
  `%%PM%% run build`, en verde. En Windows, desde PowerShell: con Git Bash,
  Vitest no encuentra el runner.
<!-- kit:if !existing -->
  `%%PM%% run test` pasa también la comprobación de la estructura.
<!-- kit:end -->
- Si el cambio se ve, la revisión visual de las páginas que toca, en el
  puerto `%%REVIEW_PORT%%`, con su propio servidor (`%%PM%% run dev:review`),
  nunca en el `%%HUMAN_PORT%%`, que es el de la persona: los anchos del
  sistema de diseño desde el móvil, el teclado, el lector de pantalla, el
  zoom al 200 %, «reducir movimiento», lo que piden los buscadores y las
  imágenes. Qué se mira, en su orden, y cómo se para el servidor:
  [Qué se revisa](./docs/standards.md#qué-se-revisa).
- Los documentos que describen el cambio dicen lo que hace el código:
  - el de la página, en `docs/pages/`, con lo decidido al construirla y su
    lista de tests marcada;
  - el backlog y su mapa del sitio, si cambia el menú o el pie;
  - y lo que dependa de ellos: las normas, las guías y este fichero.
- El estado de la página, en su fichero y en el backlog, y
  [Dónde estamos](./docs/next-steps.md#dónde-estamos), al día.

Los dos puertos, `%%HUMAN_PORT%%` y `%%REVIEW_PORT%%`, se cambian aquí.
<!-- kit:if git -->

## Git

El historial de %%APP_NAME%% se guarda con git.

- **Los commits y los push los hace la persona.** Al cerrar cada %%UNIT%%,
  `zaius-review` le propone el mensaje. La IA lee lo que necesita
  (`git status`, `git diff`, `git log`), pero no hace un commit, un push, una
  rama ni un pull request si la persona no se lo pide expresamente, y lo
  pedido vale para esa vez. Cuando se lo pide, lo hace como dice
  `zaius-git`, y contesta con lo que ha hecho.
- **Nunca** reescribe el historial (`--force`, `rebase`, `reset --hard`, un
  `--amend` de algo ya subido) ni sube contraseñas o claves (`.env*.local`).
- **El mensaje del commit:** una primera línea, de hasta 72 caracteres, con
  lo que cambia para quien usa la %%KIND%%, y el código de la %%UNIT%%
  delante si es una (`%%UNIT_EXAMPLE%% <título>: <lo que cambia>`); si hace
  falta, una línea en blanco y el detalle, en puntos.
- **La IA no firma:** ni un commit ni un pull request lleva líneas suyas
  (`Co-Authored-By`, «Generated with…», un enlace a la sesión). En Claude
  Code lo apaga `.claude/settings.json` (`attribution`), y la regla vale
  igual con cualquier IA.
- **Cómo trabaja este proyecto,** lo apunta `zaius-git` con lo que decide la
  persona:
  - el repositorio remoto: ninguno todavía;
  - las ramas: sin decidir; mientras, todo en la rama en la que se está;
  - el CI: ninguno.
<!-- kit:end -->
