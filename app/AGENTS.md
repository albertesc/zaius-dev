# AGENTS.md

Guía para los agentes de IA que trabajan en %%APP_NAME%%: las reglas
imprescindibles del proyecto, resumidas. Los documentos de `docs/` las
desarrollan, con ejemplos.

Cómo se trabaja con la IA está en
[Cómo se trabaja con la IA](./docs/process.md), y no se repite aquí: el flujo
de cada historia, lo que decide la persona y lo que necesita su OK, cómo se le
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
se puede apuntar, especificar ni construir ninguna historia. Si te piden otra
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

- React 19 + TypeScript (estricto), Vite y React Router.
<!-- kit:if backend -->
- TanStack Query para los datos del servidor; Zustand solo para el estado que
  sobrevive a la pantalla.
<!-- kit:else -->
- Zustand solo para el estado que sobrevive a la pantalla.
<!-- kit:end -->
- Zod para validar; react-hook-form para los formularios.
- i18next: los textos van siempre en su catálogo, aunque la app tenga un
  solo idioma. Los idiomas, %%LANGUAGES%%; el primero, `%%DEFAULT_LANGUAGE%%`,
  es el de por defecto.
- El sistema de diseño, en `docs/ux-ui/design-system.md`.
- CSS Modules; Vitest + Testing Library; ESLint.

| Comando | Qué hace |
|---|---|
<!-- kit:if mocks -->
| `%%PM%% run dev` | Arranca Vite con los mocks (`VITE_USE_MOCKS=true`, en `.env.development`). |
<!-- kit:else -->
<!-- kit:if backend -->
| `%%PM%% run dev` | Arranca Vite contra la API de `VITE_API_URL` (`.env.development`). |
<!-- kit:else -->
| `%%PM%% run dev` | Arranca Vite en el %%HUMAN_PORT%%. |
<!-- kit:end -->
<!-- kit:end -->
| `%%PM%% run dev:review` | Arranca otro servidor en el %%REVIEW_PORT%%, para la revisión visual de la IA. |
| `%%PM%% run typecheck` | Type-check (`tsc -b`). |
| `%%PM%% run build` | Type-check (`tsc -b`) y build. |
| `%%PM%% run lint` | ESLint. |
| `%%PM%% run test` | Vitest. |
| `%%KIT_RUN%% <orden>` | El kit, con la versión de este proyecto: cambia una respuesta (`change`) o enseña su estado (`status`). Para pasar a una versión nueva, `%%KIT_UPDATE%%`. |

Para el type-check, `%%PM%% run typecheck` (`tsc -b`), nunca `tsc -p .`:
`tsconfig.json` es un fichero de solución y `tsc -p .` termina sin mirar el
código.
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
<!-- kit:if backend -->
| `main.tsx`, `queryClient.config.ts` | Sueltos en `src/`: el arranque de la app y la configuración del `QueryClient`, junto al arranque, que es quien la usa. |
<!-- kit:if mocks -->
| `services/<entidad>/` | El service de la entidad, los schemas de sus respuestas y sus mocks: un JSON al lado del service, `<entidad>Mocks.json`, con la respuesta de cada endpoint. |
<!-- kit:else -->
| `services/<entidad>/` | El service de la entidad y los schemas de sus respuestas. |
<!-- kit:end -->
| `schemas/` | Los schemas que comparten varias entidades o features. |
| `features/` | Todas las pantallas: las features de cada familia, en su carpeta (`features/<familia>/<feature>/`, con lo que comparten en `features/<familia>/common/`), y las que no tienen familia, directas (`features/profile/`). Si hay login, la entrada es la familia `auth` (`authLogin`, `authRecover`, `authRestore`), fuera del marco de la app. |
<!-- kit:else -->
| `main.tsx` | Suelto en `src/`: el arranque de la app. |
| `schemas/` | Los schemas que comparten varias features. |
| `features/` | Todas las pantallas: las features de cada familia, en su carpeta (`features/<familia>/<feature>/`, con lo que comparten en `features/<familia>/common/`), y las que no tienen familia, directas (`features/profile/`). |
<!-- kit:end -->
| `domains/` | Los temas de negocio que usan varias familias, sin pantallas (`docs/standards.md#dominios`). Cada dominio nuevo añade su fila al índice de dominios de la normativa. La raíz solo usa los del marco de la app, los de `SHELL_DOMAINS` (arriba de `src/tests/structure.test.ts`). |
<!-- kit:if backend -->
| `router/` | La composición de rutas, guardas y layouts, con las rutas de la entrada (`rootRoutes.tsx`), las rutas de la app, que juntan las de sus features (`appRoutes.tsx`), y el menú, cuando hay dos pantallas que se abren desde él (`navigation.config.ts`: entradas sueltas y un grupo por familia, sin enlace, con sus entradas en este orden: añadir, análisis, gestión y lo propio de la familia; una familia de una sola pantalla, como `incidents` con `incidents`, es una entrada directa). |
| `layouts/` | Las rutas con `Outlet` (`AppLayout`, el marco de la app; `RootLayout`, la raíz de todas, desde la segunda pantalla; y, si hay login, `AuthLayout`, el de la entrada). |
| `components/`, `hooks/`, `utils/`, `types/`, `constants/` | Lo compartido de la raíz: piezas sin dominio, hooks genéricos, funciones puras (en un objeto por tema, como un service: `formatUtils.formatDate`), tipos y constantes (`appLanguages.ts`, los idiomas de la app). |
<!-- kit:if mocks -->
| `utils/api*Utils.ts`, `types/api.ts` | El transporte, lo único que habla con la API: `apiUtils.request`, `upload` y `download`; el fallo de una llamada (`apiErrorUtils`: `isNotFound`, `getRequestFailure`…); su conexión con la sesión (`apiSessionUtils.connect`); y `apiMockUtils`, que responde con los `*Mocks.json` cuando `VITE_USE_MOCKS=true`. |
<!-- kit:else -->
| `utils/api*Utils.ts`, `types/api.ts` | El transporte, lo único que habla con la API: `apiUtils.request`, `upload` y `download`; el fallo de una llamada (`apiErrorUtils`: `isNotFound`, `getRequestFailure`…); y su conexión con la sesión (`apiSessionUtils.connect`). |
<!-- kit:end -->
<!-- kit:else -->
| `router/` | La composición de rutas y layouts, con las rutas de la entrada (`rootRoutes.tsx`), las rutas de la app, que juntan las de sus features (`appRoutes.tsx`), y el menú, cuando hay dos pantallas que se abren desde él (`navigation.config.ts`: entradas sueltas y un grupo por familia, sin enlace, con sus entradas en este orden: añadir, análisis, gestión y lo propio de la familia; una familia de una sola pantalla, como `incidents` con `incidents`, es una entrada directa). |
| `layouts/` | Las rutas con `Outlet` (`AppLayout`, el marco de la app, y, desde la segunda pantalla, `RootLayout`, la raíz de todas). |
| `components/`, `hooks/`, `utils/`, `types/`, `constants/` | Lo compartido de la raíz: piezas sin dominio, hooks genéricos, funciones puras (en un objeto por tema: `formatUtils.formatDate`), tipos y constantes: `appLanguages.ts`, los idiomas de la app, y los datos fijos que usan varias features. |
<!-- kit:end -->
| `styles/` | Los tokens propios del sistema de diseño (`tokens.css`), si los tiene, importados en `main.tsx`. |
| `i18n/` | La configuración de i18next y los textos de la raíz (`common`). |
| `pages/` | Las páginas genéricas: 404 y error. |
| `tests/` | La comprobación de la estructura (`structure.test.ts`, `docs/standards.md#comprobar-la-estructura`), la configuración de Vitest (`setup.ts`) y los ayudantes de los tests (`testUtils.tsx`: `renderPage`, `renderWithProviders`, `setViewportWidth` y, con varios idiomas, `translate`). |

Una feature por dentro: `pages/`, `components/<zona>/`, `hooks/`, `utils/`,
`constants/`, `types/`, `schemas/`, `stores/`,
<!-- kit:if backend -->
`i18n/<idioma>.json` (uno por idioma),
`<feature>Routes.tsx` y, a su lado, `<feature>Permissions.ts`, la regla de
permisos que decide la ruta y los botones (no es un util). Las columnas de una
tabla, si solo declaran, van en `constants/<feature>Columns.ts`. Solo existen
las carpetas que hacen falta.
<!-- kit:else -->
`i18n/<idioma>.json` (uno por idioma) y `<feature>Routes.tsx`. Las columnas
de una tabla, si solo declaran, van en `constants/<feature>Columns.ts`. Solo
existen las carpetas que hacen falta.
<!-- kit:end -->

## Imprescindible: cada feature es un miniproyecto

- Si se borra la carpeta de una feature no se rompe nada, salvo su línea en las
  rutas de `router/` y su entrada en el menú.
- Una feature no importa de otra feature ni de otra familia. Nada de fuera
  importa de su interior, salvo su `<feature>Routes.tsx` desde las rutas de
  `router/` (`appRoutes.tsx` y, las de la entrada, `rootRoutes.tsx`).
- Lo que es igual en varias features sube: al `common` de su familia; a un
  dominio de `domains/` si es de negocio y lo usan varias familias; a la raíz si
  es genérico. Recibe por props lo que necesita y no sabe nada de ellas. Lo que
  solo se parece no se comparte. Una familia que se llama como un dominio
  (`customers`, `incidents`) no tiene `common`: lo suyo va al dominio.
<!-- kit:if backend -->
- Dos features que piden el mismo dato comparten la caché usando la misma clave
  de consulta, sin importarse.
<!-- kit:end -->
- La comprobación de la estructura (`src/tests/structure.test.ts`) lo mira.

## Nomenclatura

Es lo más importante del proyecto. Los listados completos están en
`docs/naming.md`.

- **Ficheros y carpetas, en inglés,** también los documentos y las skills
  (`docs/standards.md`, `docs/guides/create-a-feature.md`,
  `.claude/skills/zaius-spec/`), aunque su contenido vaya en
  castellano: el contenido puede cambiar de idioma sin romper enlaces ni
  órdenes.

- **Features:** su nombre es su URL en camelCase, sin tipo de pantalla
  obligatorio: el índice de una familia se llama como ella (`orders`,
  `admin`), los demás segmentos van detrás en PascalCase (`ordersDashboard`,
  `ordersNew`, `invoicesUpload`, `shipmentsPlanning`) y `:id/edit` es `Edit`,
  la gestión de un registro (`ordersEdit`, `adminUsersEdit`). `/:id` no
  es una ruta: un registro tiene una sola pantalla. Lo que cuelga de una
  feature son páginas suyas (`InvoicesUploadNewPage`), salvo la gestión, que
  siempre es su propia feature. Una pantalla sin familia se llama como su
  segmento (`home`, la portada; `profile`). Las pestañas, paneles y modales
  no son features.
- **El fichero se llama como lo que exporta.** Si agrupa varias piezas del mismo
  tipo: `<prefijo><Zona><Tipo>` (`ordersEditFormSchema.ts`). La configuración
  estática es `<qué configura>.config.ts`.
- **Prefijo de origen:** dentro de una feature, su nombre (`OrdersEdit…`,
  `useOrdersEdit…`, `ordersEdit…`); en el `common` de una familia o en un
  dominio, su entidad (`OrderStatusBadge`, `OrderFiltersHeader`,
  `ProductStatsSection`); en la raíz, ninguno: se nombra por lo que es
  (`TableSearch`). Las zonas de una pantalla (pestañas, secciones, pasos,
  pantalla final) son de su feature (`OrdersDashboardStatusSection`,
  `OrdersNewDoneScreen`); solo sube a un dominio una zona idéntica, de negocio
  y usada por varias familias (`ProductStatsSection`). No se repite lo que ya
  dice el prefijo.
- **Componentes:** `<Prefijo><Zona?><Objeto><Acción?><Tipo>`, con un solo tipo
  final de esta lista: `Page`, `Layout`, `Tabs`, `Tab`, `Wizard`, `Step`,
  `Section`, `Card`, `Modal`, `Form`, `Fields`, `Field`, `Table`, `Cell`,
  `List`, `Badge`, `Value`, `Menu`, `Select`, `Search`, `Actions`, `Bar`,
  `Header`, `Footer`, `Viewer`, `Image`, `Panel`, `Screen`, `Guard`. Un tipo
  nuevo necesita el OK de la persona.
- **Verbos:** `Create` (dar de alta), `Add` (añadir a una lista), `Remove`
  (quitar o borrar), `Merge` (unificar varios en uno), `Reset` (volver a la
  propuesta inicial), `Edit`, `Close`, `Cancel`, `Reopen`, `Upload`,
  `Download`, `Export`. Un verbo nuevo necesita el OK de la persona. `New` no
  se usa en componentes, salvo en la página de una subruta `/new`
  (`InvoicesUploadNewPage`).
- **Singular o plural:** singular si es un elemento, plural si son varios. Una
  `List` va en plural (`OrderLinesList`) y la pieza que repite, en singular.
- **Funciones:** empiezan por un verbo. Hooks: `use` + prefijo + qué hacen, uno
  por fichero. Utils: un objeto por tema, `<prefijo><Tema>Utils`
  (`orderCloseUtils`), con los métodos con su nombre entero. Props de función
  `onX`; handlers locales `handleX`.
<!-- kit:if backend -->
- **Services:** uno por entidad, con métodos `<verbo><Entidad><Zona?><Qué>`:
  la entidad del service va siempre detrás del verbo, en singular si el método
  trata un registro (su gestión, una acción sobre él, las opciones de uno de
  sus campos: `getOrderDetail`, `closeOrder`, `getOrderCloseReasonsCatalog`)
  y en plural si trata varios (`getOrdersListPage`, `exportOrdersListCsv`);
  la zona es la pantalla que lo usa (`getOrdersDashboardStatusByMonth`). Un
  método que usan varias features no lleva el nombre de ninguna
  (`getOrdersFilters`, `getOrdersStatus`, que piden el análisis y la portada,
  `getOrderTypesCatalog`). Dar de alta un registro es `create<Entidad>`
  (`createOrder`; varios a la vez, `createOrders`). Un catálogo es una lista
  de opciones de un selector (`…/select`) y su método termina en `Catalog`; el
  de otra entidad sin service propio vive en el de la familia que lo usó
  primero, con la entidad de ese service (`getOrderAssignableUsersCatalog`).
  El schema y el tipo de la respuesta se llaman como el método
  (`ordersFiltersSchema`, `OrdersFilters`).
- **Claves de consulta:** `[service, método, ...parámetros]`.
<!-- kit:end -->
<!-- kit:if mocks -->
- **Mocks:** un JSON al lado de su service, `<entidad>Mocks.json`
  (`ordersMocks.json`), con una clave `"<MÉTODO> /ruta"` por endpoint
  (`"GET /order/detail/:id"`) y su respuesta, con la forma real de la API;
  si crece, uno por zona (`ordersEditMocks.json`). Son respuestas fijas:
  `docs/naming.md#mocks`.
<!-- kit:end -->
- Nombres largos sí; abreviaturas y nombres genéricos (`data`, `items`,
<!-- kit:if backend -->
  `handlers`), no. Tampoco las palabras del backend cuando la app llama a la
  entidad de otra forma: si la API dice `purchase` y la app «pedido», el código
  dice `order`.
<!-- kit:else -->
  `handlers`), no.
<!-- kit:end -->

## Sencillez y tamaño

- Un componente es un fichero, no una carpeta: su `.module.css` y su `.test.tsx`
  van al lado.
- Un fichero de componente tiene una sola función: el componente. Cada subpieza
  es otro componente, en su propio fichero, al lado; lo que no
  pinta (un cálculo, un ayudante) va a `utils/` o a un hook. Dentro del
  componente solo van sus handlers (`handleX`) y las flechas en línea: una
  función que devuelve JSX es otro componente.
- Los utils de un tema van en un objeto: `utils/dateUtils.ts` exporta solo
  `dateUtils`, que se usa con él delante (`dateUtils.getToday()`). Cada función
  se declara suelta, con su JSDoc, y el objeto del final las reúne; lo que no
  está en él es privado. Se llama `<prefijo><Tema>Utils`, sin carpetas de
  tema, y lo mira la comprobación de la estructura. Las constantes que se
  exportan van a `constants/`, y los tipos compartidos, a `types/`.
<!-- kit:if backend -->
  Solo el transporte (`apiUtils` y los suyos) habla con la red.
<!-- kit:end -->
- Todo fichero con código lleva su `.test` al lado, con el mismo nombre. Solo se
  libran los que únicamente declaran (tipos, constantes, configuración y rutas)
  y el código base que trae el kit, que lo prueba el propio kit. Lo mira la
  comprobación de la estructura.
- Un test no se manipula para que pase: si falla, se arregla el código, y si
  el test está mal, se pregunta
  (`docs/guides/write-tests.md#un-test-no-se-manipula`).
  Sus textos salen del catálogo, con `testUtils.translate`, nunca escritos a
  mano.
- Las carpetas solo agrupan varias piezas de una zona (`components/lines/`);
  no hay carpetas por tipo de fichero.
- Una feature pequeña puede ser solo su página, sus rutas y su i18n.
- Se extrae solo lo que es igual, y cuando aparece la segunda copia o el
  documento de la feature ya dice que la habrá. Nada de componentes genéricos
  llenos de huecos.
- Nada «por si acaso»: ni dependencias, ni abstracciones, ni ficheros, ni
  props, variantes o estados que la historia no use. Lo que una norma
  describe para un caso (el menú, la miga de pan, la carga con `lazy`) nace
  con el primer caso que lo pide, nunca antes
  (`docs/standards.md#organización-de-src`).
- Tamaño orientativo: ~150 líneas por fichero y ~100 por componente. Si se pasa,
  se divide por significado, nunca por tipo técnico.

## Código

- TypeScript estricto: sin `any`, sin casts innecesarios, `import type` para
  los tipos, sin `enum` ni `namespace`.
- Un componente tiene un solo `return`; los estados se resuelven con ternarios.
- Renderizado condicional: cada condición va en una constante con nombre dentro
  del componente (`const hasLines = lines.length > 0`), y en el JSX siempre
  `? :`, con `null` en la rama que no pinta; nunca `&&`. Un ternario anidado
  vale si cada condición es una de esas constantes. Un booleano que ya tiene
  nombre (una prop, un `canX`, un `isError`) ya lo es.
- Un componente pinta: recibe el dato listo. Las transformaciones van en
<!-- kit:if backend -->
  `utils/` si son puras, o en un hook si necesitan otro hook (un dato del
  servidor, un store).
<!-- kit:else -->
  `utils/` si son puras, o en un hook si necesitan otro hook (un store).
<!-- kit:end -->
  Las que necesitan `t` o el locale también van en un hook; en el cuerpo del
  componente solo se arman las etiquetas con `t()`.
<!-- kit:if backend -->
- Los datos del servidor se piden en hooks con `useQuery` y se guardan con
  `useMutation`; un componente nunca llama a un service.
- Las respuestas de la API se validan con zod en el transporte; los tipos salen
  de los schemas con `z.infer`.
- Zustand solo para lo que sobrevive a salir de la pantalla (sesión, filtros
  aplicados, página de una lista); lo demás es `useState`.
<!-- kit:else -->
- Los datos fijos (las opciones de un selector, unas tarifas) van en
  `constants/`. Lo que la app guarda sin API se decide en `/zaius-init` y se
  monta con la primera historia que lo necesita, con el OK de la persona.
- Zustand solo para lo que sobrevive a salir de la pantalla (filtros
  aplicados, página de una lista); lo demás es `useState`.
<!-- kit:end -->
- i18n: ningún texto de usuario en el código; cada `t()` lleva su namespace
  (`t('ordersEdit:tabs.lines')`): el de la feature, el de la familia para lo
  de su `common` (`orders:`), el del dominio o, solo en la raíz, `common:`;
  las claves se agrupan por zona. Todos los idiomas llevan las mismas claves.
- JSDoc en toda función que no es componente, siempre con la misma forma: qué
  hace (una o dos líneas), un `@param` por parámetro, `@returns` y `@throws` si
  tocan, cada uno en una línea; de 6 a 8 líneas como mucho.
<!-- kit:if backend -->
  En los services, la descripción empieza por el endpoint.
<!-- kit:end -->
  Las funciones internas de un hook o componente y los objetos sin
  comportamiento (schemas, configuración, constantes) no llevan JSDoc ni otro
  comentario.
- Sin comentarios en el cuerpo ni en los componentes. El código está en inglés y
  el JSDoc en castellano, y describe el proyecto por sí mismo, sin referencias a
  otros proyectos.

## Diseño y UX

Las normas, desarrolladas y con ejemplos, están en `docs/ux-ui/rules.md`; aquí
va una frase por norma. Las piezas se nombran por su papel (el aviso de página,
la tabla), y cuál es cada una en este proyecto lo dice
`docs/ux-ui/design-system.md#piezas-por-papel`.

- **D1. El sistema de diseño primero.** Se usan sus piezas y sus tokens: nada
  de colores sueltos, `!important` ni estilos en línea. Lo que falta y es
  genérico se pide al sistema de diseño, no se rehace en la app.
- **D2. Sin textos explicativos.** Cada pantalla, sección o tarjeta muestra solo
  su título; lo que necesita explicación lleva el icono de información. Se
  quedan las ayudas de los campos, los mensajes de estado y las confirmaciones.
- **D3. Estados de carga, error y vacío.** Un esqueleto con la forma del
  contenido al cargar y lo anterior atenuado al recargar; «No se ha podido …»
  con reintentar; «Todavía no hay …» o «Ningún … con estos filtros»; y un
  estado propio para el registro que no existe.
- **D4. Avisos y fallos.** Cada fallo va donde se ve (encima de la barra al
  guardar, al final del cuerpo de un modal, bajo su campo) y nunca en un aviso
  efímero, que solo confirma lo que el control no enseña.
<!-- kit:if backend -->
- **D5. Acciones.** En cada zona, la salida a la izquierda y el primario el
  último, uno por zona. Lo que el permiso o el estado no deja hacer no se
  ofrece. Mientras actúa, `loading` sin cambiar el texto, y nada se pinta como
  hecho antes de que el servidor lo confirme.
<!-- kit:else -->
- **D5. Acciones.** En cada zona, la salida a la izquierda y el primario el
  último, uno por zona. Lo que el estado no deja hacer no se ofrece. Mientras
  actúa, `loading` sin cambiar el texto.
<!-- kit:end -->
- **D6. Formularios.** El alta y la edición de un registro son el mismo
  formulario. Se valida a partir del primer intento, la barra dice «Hay N
  campos por revisar» y salir con cambios sin guardar avisa antes.
<!-- kit:if backend -->
- **D7. Un registro, una pantalla.** Cada registro tiene una sola pantalla, su
  gestión (`/orders/:id/edit`), con un solo botón para guardar; sin permiso
  para editar, la misma pantalla se abre en lectura.
<!-- kit:else -->
- **D7. Un registro, una pantalla.** Cada registro tiene una sola pantalla, su
  gestión (`/orders/:id/edit`), con un solo botón para guardar.
<!-- kit:end -->
- **D8. Listados y tablas.** Solo las columnas imprescindibles; las acciones de
  la tabla, en su cabecera; paginación de 10, 25 o 50 filas; el buscador
  espera 400 ms. Filtros, página y orden sobreviven a navegar y a recargar,
  pero no van en la URL.
- **D9. Modales.** Deciden o piden lo mínimo y nunca sirven para leer. Su botón
  dice lo que hace, y solo se confirma lo que no se puede deshacer.
- **D10. Navegación.** Lo que lleva a otra pantalla es un enlace; volver lleva a
  donde se estaba; al entrar en una pantalla, el scroll va arriba y el foco a
  su título.
- **D11. Textos y formato.** Las acciones, en imperativo, con verbo y objeto
  («Cierra el pedido»). Fechas, cifras y porcentajes, siempre con las
  funciones de formato de la raíz; lo que falta es «-». Sin los signos ni las
  frases de la IA («·», «→», «—», «✓», emojis).
- **D12. Accesibilidad.** Los botones de icono llevan `aria-label`, el foco
  siempre se ve, todo se hace con teclado, nada que se pulse mide menos de
  24 px y el contraste sale de los tokens. Cada pantalla se prueba con el
  teclado, con un lector de pantalla y con el zoom al 200 %.
- **D13. Movimiento.** Lo que se mueve explica qué ha cambiado, corto y con
  los tokens de «Movimiento»; lo que se pulsa responde al pasar por encima y
  con el foco; con «reducir movimiento», como mucho un fundido; nada se
  queda escondido esperando una animación, y lo que se mueve solo se puede
  parar.
- **D14. Jerarquía, espacios y columnas.** Lo que más importa, primero y
  más grande, con pocos niveles bien distintos. Lo que va junto, cerca, y lo
  que no, separado, con el mismo token para la misma relación. Una rejilla
  para toda la pantalla: el título y el contenido, en la misma línea; los
  formularios en columnas, alineados; las cifras de una tabla, a la
  derecha.
- **D15. Lo que no se hace.** Salvo que la persona lo pida, ni un borde de
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
- `zaius-backlog`: las épicas y las historias (`docs/backlog.md`), con el
  fichero de cada una en `docs/specs/`; también para añadir, cambiar, partir,
  ordenar o quitar.
- `zaius-spec`: refina una historia (`/zaius-spec ORD001`): sus criterios,
  lo que no incluye, el plan, la lista de tests, el documento de sus
  pantallas y su boceto. Espera el OK.
- `zaius-build`: construye en pareja una historia aprobada, test a test,
  parando tras cada uno.
- `zaius-review`: comprueba y revisa una historia sin el contexto de la
  conversación y, con el OK, la da por hecha y pone al día sus documentos.
  Sin historia, revisa el cambio en curso.
- `zaius-publish`: publica en internet, con el OK, y apunta cómo se vuelve a
  publicar.
- `zaius-refactor`: propone mejorar lo que ya está hecho, sin cambiar lo que
  se puede hacer; con el OK, se construye y se cierra como una historia.
- `zaius-brand`: la identidad de la app (su idea, su logo, sus colores, su
  letra y su firma), en tres direcciones para elegir una.
- `zaius-sketch`: un boceto en HTML de una pantalla o de una idea, con la
  identidad de la app, para verlo antes de construirlo.
- `zaius-design`: una propuesta de diseño, sin tocar el código.
- `zaius-rename`: alinea los nombres del proyecto con la nomenclatura, por
  bloques y con el OK.
- `zaius-merge`: fusiona los `.kit-new` del kit, con el OK.
<!-- kit:if git -->
- `zaius-git`: el repositorio git: conecta el remoto, apunta cómo se trabaja
  con ramas, monta el CI y, si se le pide, hace el commit, el push o el pull
  request.
<!-- kit:end -->
- `zaius-languages`: añade un idioma a la app: lo apunta, traduce su
  catálogo y le da sus direcciones.
<!-- kit:if api -->
- `zaius-api`: escribe `docs/api/<zona>.md` y marca lo «Sin verificar».
<!-- kit:end -->

**Las que usa la IA** dentro de las anteriores (quien programa también las
puede lanzar sueltas):

<!-- kit:if backend -->
- `zaius-service`: un endpoint, del schema a la consulta que lo pide.
<!-- kit:end -->
- `zaius-form`: un formulario, las filas de una tabla o un asistente.
<!-- kit:if backend -->
- `zaius-permissions`: la regla de la feature, la guarda, los botones y el
  menú.
<!-- kit:end -->
<!-- kit:if existing -->
- `zaius-adopt`: trae a estas reglas el código que ya había, por bloques; la
  lanza `zaius-init`.
<!-- kit:end -->

## Qué leer

Índice de todos los documentos: `README.md`, en la raíz. Las guías paso a paso
están en `docs/guides/`.

| Tarea | Documento |
|---|---|
| Cómo se trabaja con la IA: el flujo, lo que decide la persona y los estados de una historia | `docs/process.md` |
| Dónde se está y qué viene después | `docs/next-steps.md#dónde-estamos` |
| Para qué es la app, quién la usa, qué entra y qué no | `docs/brief.md` |
| Las épicas y las historias, con su estado | `docs/backlog.md` |
| Una historia: sus criterios, su plan y su lista de tests | `docs/specs/<código>-<tema>.md` (`docs/specs/ORD001-list-orders.md`) |
| Qué hace hoy una pantalla | `docs/features/<familia>/<feature>.md` |
| Instalar y arrancar la app | `README.md#arrancar-la-app` |
| Publicar la app y volver a publicarla | `README.md#publicar` y la skill `zaius-publish` |
| Dónde va cada cosa, y usar o ampliar un dominio | `docs/standards.md` |
| Cómo llamar a algo | `docs/naming.md` |
| Montar una pantalla nueva o añadirle una página | `docs/guides/create-a-feature.md` |
<!-- kit:if backend -->
| Añadir un endpoint | `docs/guides/add-a-service.md` |
| Cargar o guardar datos | `docs/guides/load-and-save-data.md` |
<!-- kit:end -->
| Un formulario, las filas de una tabla o un asistente | `docs/guides/create-a-form.md` |
| Una pantalla o un cambio visual | `docs/ux-ui/rules.md`, `docs/ux-ui/design-system.md` y `docs/ux-ui/proposals/` |
| El sistema de diseño: la librería, los tokens y la pieza de cada papel | `docs/ux-ui/design-system.md` |
| Las normas de diseño | `docs/ux-ui/rules.md` |
| Proponer un cambio de diseño | `docs/ux-ui/README.md` |
| Ver algo antes de construirlo: un boceto | `docs/ux-ui/README.md#bocetos` |
<!-- kit:if backend -->
| Permisos de una pantalla, un botón o el menú | `docs/guides/apply-permissions.md` |
<!-- kit:end -->
| Tests | `docs/guides/write-tests.md` |
| Lo que mira la comprobación de la estructura | `docs/standards.md#comprobar-la-estructura` |
| Lo que se mira al revisar un cambio | `docs/standards.md#qué-se-revisa` |
<!-- kit:if existing -->
| Lo que se mira al traer el código que ya había | `docs/standards.md#traer-un-proyecto-que-ya-existe` |
<!-- kit:end -->
| Alinear los nombres con la nomenclatura | `docs/naming.md#revisar-los-nombres` |
<!-- kit:if api -->
| Cómo es hoy un endpoint de la API (permiso, cuerpo, respuesta, errores) | `docs/api/README.md` y el documento de su zona |
| Qué se le pide a la API | `docs/api-requests.md` |
<!-- kit:end -->
| Las respuestas del kit, su versión y cómo se actualiza | `README.md#el-kit-zaius-dev` |

## Comprobar un cambio

- `%%PM%% run typecheck`, `%%PM%% run lint`, `%%PM%% run test` y
  `%%PM%% run build`, en verde. En Windows, desde PowerShell: con Git Bash,
  Vitest no encuentra el runner.
<!-- kit:if !existing -->
  `%%PM%% run test` pasa también la comprobación de la estructura.
<!-- kit:end -->
- Si el cambio se ve, la revisión visual de las pantallas que toca, en el
  puerto `%%REVIEW_PORT%%`, con su propio servidor (`%%PM%% run dev:review`),
  nunca en el `%%HUMAN_PORT%%`, que es el de la persona: sus estados, los
  anchos del sistema de diseño, el teclado, el lector de pantalla y el zoom
  al 200 %. Qué se mira, en su orden, y cómo se para el servidor:
  [Qué se revisa](./docs/standards.md#qué-se-revisa).
- Los documentos que describen el cambio dicen lo que hace el código:
  - la historia, en `docs/specs/`, con lo decidido al construirla y su lista
    de tests marcada;
  - el documento de cada pantalla que toca, en `docs/features/`;
<!-- kit:if api -->
  - `docs/api/` y `docs/api-requests.md`, si toca la API;
<!-- kit:end -->
  - y lo que dependa de ellos: las normas, las guías y este fichero.
- El estado de la historia, en su fichero y en el backlog, y
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
