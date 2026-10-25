# Normativa

Esta guía dice dónde va cada cosa en %%APP_NAME%% y cómo se escribe el código.
Los nombres tienen su propia guía, [Nomenclatura](./naming.md), y el
diseño, la suya, [Normas de UX/UI](./ux-ui/rules.md).

Los dominios, los temas de negocio que usan varias familias, están en la última
parte.

**En esta página:**

- [Organización de src](#organización-de-src)
- [La forma de una feature](#la-forma-de-una-feature)
- [Dónde va cada cosa](#dónde-va-cada-cosa)
- [Independencia de las features](#independencia-de-las-features)
- [Sencillez y tamaño](#sencillez-y-tamaño)
- [Comprobar la estructura](#comprobar-la-estructura)
- [Qué se revisa](#qué-se-revisa), [La revisión visual](#la-revisión-visual)
- **Código:** [TypeScript](#typescript), [Componentes](#componentes), [Datos](#datos), [Textos](#textos), [Estilos](#estilos), [Comentarios](#comentarios)
- [Rutas, permisos y navegación](#rutas-permisos-y-navegación)
- **Dominios:** [Dónde va lo compartido](#dónde-va-lo-compartido), [Normas de un dominio](#normas-de-un-dominio), [Añadir una pieza a un dominio](#añadir-una-pieza-a-un-dominio), [Índice de dominios](#índice-de-dominios)
<!-- kit:if existing -->
- [Traer un proyecto que ya existe](#traer-un-proyecto-que-ya-existe)
<!-- kit:end -->

## Organización de src

```text
src/
<!-- kit:if backend -->
    main.tsx               el arranque: monta la app con su QueryClient y su router
    queryClient.config.ts  la configuración del QueryClient
<!-- kit:if mocks -->
    services/<entidad>/    el service de una entidad, sus schemas y su JSON de mocks
<!-- kit:else -->
    services/<entidad>/    el service de una entidad y sus schemas
<!-- kit:end -->
    schemas/               los schemas que comparten varias entidades
<!-- kit:else -->
    main.tsx               el arranque: monta la app con su router
<!-- kit:end -->
    features/              las pantallas: las features, por familia
    domains/               los temas de negocio que usan varias familias, sin pantallas
    router/                las rutas (rootRoutes.tsx, appRoutes.tsx) y el menú
    layouts/               las rutas con Outlet
    components/            las piezas compartidas sin dominio
    hooks/                 los hooks genéricos
<!-- kit:if backend -->
    utils/                 las funciones puras, en un objeto por tema, y el transporte
    types/                 los tipos compartidos de la raíz (api.ts, los del transporte)
    constants/             las constantes compartidas (appLanguages.ts)
<!-- kit:else -->
    utils/                 las funciones puras, en un objeto por tema
    types/                 los tipos compartidos de la raíz
    constants/             las constantes compartidas (appLanguages.ts) y los datos fijos de la app
<!-- kit:end -->
    i18n/                  la configuración y los textos comunes
    pages/                 las páginas genéricas: la que no existe y el error
    tests/                 la comprobación de la estructura, la configuración de Vitest y testUtils
```

Solo existen las carpetas que hacen falta:

<!-- kit:if backend -->
- **Lo instala el kit:** `main.tsx`, `queryClient.config.ts`, el transporte
  (`utils/apiUtils.ts`, `utils/apiErrorUtils.ts`, `utils/apiSessionUtils.ts`
  y `types/api.ts`), `router/rootRoutes.tsx`, `constants/appLanguages.ts`,
  la comprobación de la estructura (`tests/structure.test.ts`) y lo que usan
  los tests (`tests/setup.ts` y `tests/testUtils.tsx`).
<!-- kit:else -->
- **Lo instala el kit:** `main.tsx`, `router/rootRoutes.tsx`,
  `constants/appLanguages.ts`, la comprobación de la estructura
  (`tests/structure.test.ts`) y lo que usan los tests (`tests/setup.ts` y
  `tests/testUtils.tsx`).
<!-- kit:end -->
<!-- kit:if mocks -->
- **Con mocks,** también `utils/apiMockUtils.ts`.
<!-- kit:end -->
- **Los textos:** `i18n/i18n.ts`, con los textos comunes en su catálogo,
  aunque haya un solo idioma, y `utils/languageUtils.ts`.
- **Nace con el proyecto,** con la primera pieza que lo necesita, nunca
  antes:
<!-- kit:if backend -->
  - `services/`, con el primer endpoint;
<!-- kit:end -->
  - `features/`, `router/appRoutes.tsx`, el marco de la app (`AppLayout`) y
    las páginas genéricas, con la primera pantalla;
  - lo que solo sirve para ir de una pantalla a otra, con la segunda: el
    layout raíz (`RootLayout`), con el scroll y el foco al cambiar de
    pantalla, y la carga de cada pantalla con `lazy`, con la recarga de la
    página de error;
  - el menú (`router/navigation.config.ts`), cuando hay dos pantallas que se
    abren desde él;
  - la miga de pan, con la primera pantalla que la pinta
    ([La miga de pan](#rutas-permisos-y-navegación));
<!-- kit:if backend -->
  - el dominio `session`, con el login;
  - `schemas/commonSchema.ts`, con el primer schema que comparten dos
    entidades;
<!-- kit:end -->
  - y `formatUtils`, con la primera pantalla que formatea un dato.

Qué va en cada una:

<!-- kit:if backend -->
- **`main.tsx` y `queryClient.config.ts`** van sueltos en `src/`: el arranque
  de la app y la configuración del `QueryClient`. La configuración va junto
  al arranque, que es quien la usa.
- **El transporte** es lo único que habla con la API, y son utils de la
  raíz ([Nomenclatura](./naming.md#el-transporte)).
  `apiUtils.request`, `apiUtils.upload` y `apiUtils.download` añaden el
  token, validan la respuesta con el schema que les pasa el service y, si
  algo falla, lanzan un fallo de la API (`ApiError`), que se lee con
  `apiErrorUtils`. Sus tipos están en `types/api.ts`.
<!-- kit:if mocks -->
  - **Cada llamada elige entre los mocks y el servidor.** Con
    `VITE_USE_MOCKS=true`, `apiUtils` carga `apiMockUtils` con un import
    dinámico, que responde con los `*Mocks.json` de `services/`; si no, pide
    al servidor. El build de producción no lleva los mocks.
<!-- kit:end -->
  - **La sesión se conecta al transporte,** no al revés: el transporte no
    importa `session`. El dominio llama a `apiSessionUtils.connect` con
    `getToken` (de dónde sale el token) y `onEnd` (qué hace cuando la API la
    cierra). Un `401` llega a `onEnd` como `expired`; sin sesión conectada, no
    hay token y nadie recibe el aviso.
<!-- kit:if mocks -->
  - **El modo de Vite elige los mocks o la API.** Las variables van en
    `.env.<modo>`: `VITE_API_URL`, la base de la API, y `VITE_USE_MOCKS`.

    | Modo | Se arranca con | `VITE_USE_MOCKS` | Responde |
    |---|---|---|---|
    | `development` | `%%PM%% run dev` | `true` | Los mocks: la app funciona sin backend. |
    | `production` | `%%PM%% run build` | `false` | La API de `VITE_API_URL`. |
    | `test` | `%%PM%% run test` | `true` | Los mocks, sin esperar; un test da otra respuesta simulando su service con `vi.spyOn`. |

    Para trabajar contra la API en desarrollo, `VITE_USE_MOCKS=false` en
    `.env.development.local`, que no se versiona.
<!-- kit:else -->
  - **El modo de Vite** dice contra qué API se trabaja. La variable va en
    `.env.<modo>`: `VITE_API_URL`, la base de la API.

    | Modo | Se arranca con | Responde |
    |---|---|---|
    | `development` | `%%PM%% run dev` | La API de `VITE_API_URL`. |
    | `production` | `%%PM%% run build` | La API de `VITE_API_URL`. |
    | `test` | `%%PM%% run test` | Nadie: cada test simula su service con `vi.mock`. |
<!-- kit:end -->
<!-- kit:if mocks -->
- **`services/<entidad>/`** tiene un service por entidad (`ordersService.ts`),
  los schemas de sus respuestas agrupados por zona (`ordersDashboardSchema.ts`)
  y, a su lado, sus mocks, un JSON con la respuesta de cada endpoint
  (`ordersMocks.json`, [Nomenclatura](./naming.md#mocks)). Un service no
  importa nada de `features/`, `hooks/` ni `components/`.
<!-- kit:else -->
- **`services/<entidad>/`** tiene un service por entidad (`ordersService.ts`)
  y los schemas de sus respuestas, agrupados por zona
  (`ordersDashboardSchema.ts`). Un service no importa nada de `features/`,
  `hooks/` ni `components/`.
<!-- kit:end -->
<!-- kit:else -->
- **`main.tsx`** va suelto en `src/`: el arranque de la app, que monta su
  router.
<!-- kit:end -->
<!-- kit:if backend -->
- **`features/`** guarda todo lo que tiene pantallas: las features de cada
  familia, en su carpeta (`features/orders/ordersEdit/`), con lo que comparte
  la familia (`features/orders/common/`), y las que no tienen familia,
  directas (`features/profile/`). También la entrada, si hay login: la
  familia `auth` (`features/auth/authLogin/`), como cualquier otra.
- **`router/`** junta las pantallas: `rootRoutes.tsx` compone los layouts, las
  guardas y las rutas de la entrada; `appRoutes.tsx`, las rutas de la app,
  junta las de las demás features; y `navigation.config.ts` es el menú.
- **`domains/`** guarda los temas de negocio que usan varias familias
  (`session`, `warehouses`, `products`…). Un dominio no tiene
  pantallas; se organiza como una feature sin páginas ni rutas. Cuáles son:
<!-- kit:else -->
- **`features/`** guarda todo lo que tiene pantallas: las features de cada
  familia, en su carpeta (`features/orders/ordersEdit/`), con lo que comparte
  la familia (`features/orders/common/`), y las que no tienen familia,
  directas (`features/profile/`).
- **`router/`** junta las pantallas: `rootRoutes.tsx` compone los layouts;
  `appRoutes.tsx`, las rutas de la app, junta las de las features; y
  `navigation.config.ts` es el menú.
- **`domains/`** guarda los temas de negocio que usan varias familias
  (`warehouses`, `products`…). Un dominio no tiene pantallas; se organiza
  como una feature sin páginas ni rutas. Cuáles son:
<!-- kit:end -->
  [Dominios](#dominios).
- **La raíz** (`components/`, `hooks/`, `utils/`, `types/`, `constants/`) es
  lo que no pertenece a ningún dominio.

## La forma de una feature

```text
ordersEdit/
    pages/
        OrdersEditPage.tsx
    components/
        documents/
            OrdersEditDocumentsTab.tsx
            OrdersEditDocumentViewer.tsx
            OrdersEditDocumentViewer.module.css
        lines/
            OrdersEditLinesTab.tsx
            OrdersEditLineRemoveModal.tsx
        OrdersEditReopenModal.tsx
    hooks/
        useOrdersEdit.ts
        useOrdersEditDocumentsUpload.ts
    utils/
        ordersEditDeadlineUtils.ts
    constants/
        ordersEditTabs.ts
    schemas/
        ordersEditFormSchema.ts
    i18n/
        <idioma>.json
<!-- kit:if backend -->
    ordersEditPermissions.ts
<!-- kit:end -->
    ordersEditRoutes.tsx
```

- **`pages/`**: una página por ruta. Monta la pantalla y reparte los datos.
- **`components/`**: los componentes de la feature. Si una zona de la pantalla
  tiene varias piezas, van en `components/<zona>/`; si no, directos en
  `components/`.
<!-- kit:if backend -->
- **`hooks/`**: un hook por fichero. Aquí se piden y se guardan los datos.
- **`utils/`**: funciones puras, en un objeto por tema, como un service
  (`ordersEditDeadlineUtils.ts`, que exporta `ordersEditDeadlineUtils`, con
  `buildOrdersEditDeadlineSummary`), sueltos, sin carpetas de tema
  ([Nomenclatura](./naming.md#ficheros)).
<!-- kit:else -->
- **`hooks/`**: un hook por fichero. Aquí va lo que tiene estado o efectos y
  lo que prepara los datos de la pantalla.
- **`utils/`**: funciones puras, en un objeto por tema
  (`ordersEditDeadlineUtils.ts`, que exporta `ordersEditDeadlineUtils`, con
  `buildOrdersEditDeadlineSummary`), sueltos, sin carpetas de tema
  ([Nomenclatura](./naming.md#ficheros)).
<!-- kit:end -->
- **`constants/`**: las constantes que exporta la feature, agrupadas por tema
  (`ordersEditTabs.ts`, con `ORDERS_EDIT_TABS`), sin test. También las
  columnas de una tabla y de su CSV, si solo declaran
  (`orders/constants/ordersColumns.ts`).
- **`types/`**: solo si varios ficheros de la feature usan un tipo que no sale
  de un schema.
- **`schemas/`**: los schemas de los formularios y del estado que viaja entre
  rutas.
- **`stores/`**: solo si la feature guarda estado que sobrevive a la pantalla.
- **`i18n/`**: los textos de la feature, un fichero por idioma (%%LANGUAGES%%).
<!-- kit:if backend -->
- **`<feature>Routes.tsx`**: sus rutas, sus permisos y, si la app la pinta,
  su miga de pan.
- **`<feature>Permissions.ts`**: la regla de permisos de la feature
  (`ordersEditPermissions`), al lado de sus rutas, porque decide la ruta y los
  botones. No es un util. Solo existe si la regla la usa algo más que la ruta.
<!-- kit:else -->
- **`<feature>Routes.tsx`**: sus rutas y, si la app la pinta, su miga de
  pan.
<!-- kit:end -->

Solo existen las carpetas que hacen falta. Una feature pequeña puede ser solo
su página y sus rutas.

## Dónde va cada cosa

<!-- kit:if backend -->
- **Un hook vive con lo que importa.** Si usa el service, los tipos o los
  schemas de una feature, va en esa feature; si solo usa APIs genéricas (React,
  el router, el navegador) o un service que no es de ninguna feature ni de
  ningún dominio (`useAuditLog`, con `auditService`), va en `hooks/` de la
  raíz. Se decide por sus imports, no por quién lo usa.
- **`utils/`** es para funciones puras, sin JSX ni estado, aunque las use una
  sola pieza. Lo que tiene estado, efectos o red va en un hook. Las funciones
  de un tema van en un objeto (`formatUtils.ts`, con
<!-- kit:else -->
- **Un hook vive con lo que importa.** Si usa los tipos, los schemas o los
  stores de una feature, va en esa feature; si solo usa lo genérico (React,
  el router, el navegador), va en `hooks/` de la raíz. Se decide por sus
  imports, no por quién lo usa.
- **`utils/`** es para funciones puras, sin JSX ni estado, aunque las use una
  sola pieza. Lo que tiene estado o efectos va en un hook. Las funciones de
  un tema van en un objeto (`formatUtils.ts`, con
<!-- kit:end -->
  `formatUtils.formatDate`), suelto en su `utils/`, sin carpetas de tema: en
  la raíz, en una feature, en un `common` o en un dominio
  ([Nomenclatura](./naming.md#ficheros)). Las constantes que exporta van
  a `constants/` y sus tipos compartidos, a `types/`.
<!-- kit:if backend -->
  La única excepción es el transporte (`apiUtils` y los suyos), que habla con
  la red ([Nomenclatura](./naming.md#el-transporte)).
- **`types/`** de la raíz es para tipos que no tienen dueño, uno por tema
  (`navigation.ts`, `tableQuery.ts`). Un tipo de una feature o de un service
  vive con su código y sale de su schema.
<!-- kit:else -->
- **`types/`** de la raíz es para tipos que no tienen dueño, uno por tema
  (`navigation.ts`, `tableQuery.ts`). Un tipo de una feature vive con su
  código y, si tiene schema, sale de él.
<!-- kit:end -->
- **`components/`** de la raíz es para piezas sin dominio que conocen la app:
  el marco (la navegación y la barra superior), el buscador de una tabla o el
  aviso de cambios sin guardar, cuando el sistema de diseño no las da tal cual
  ([D1](./ux-ui/rules.md#d1-el-sistema-de-diseño-primero)). Un componente que
  es la interfaz de un dominio vive en su dominio (el menú de las
  notificaciones, en `notifications`).
- **`layouts/`** solo tiene rutas con `Outlet`: el marco de la app; el layout
  raíz, que envuelve todas y lleva el scroll y el foco al cambiar de
<!-- kit:if backend -->
  pantalla, desde la segunda; y, si hay login, el de la entrada.
<!-- kit:else -->
  pantalla, desde la segunda.
<!-- kit:end -->
- **Compartir:**
  - lo que comparten las features de una familia va en
    `features/<familia>/common/` (los componentes, los hooks, los utils y los
    stores): la cabecera con la barra de filtros y los filtros aplicados de
    `orders` y `ordersDashboard` están en `orders/common`;
  - lo de negocio que comparten varias familias va en un dominio,
    `domains/<dominio>/`;
  - lo genérico, sin negocio, va a la raíz.
<!-- kit:if backend -->
- **La raíz no importa nunca de una feature.** Solo usa los dominios del marco
  y del transporte, los de `SHELL_DOMAINS`, arriba de
  `src/tests/structure.test.ts` ([Normas de un dominio](#normas-de-un-dominio)).
<!-- kit:else -->
- **La raíz no importa nunca de una feature.** Solo usa los dominios del
  marco, los de `SHELL_DOMAINS`, arriba de `src/tests/structure.test.ts`
  ([Normas de un dominio](#normas-de-un-dominio)).
<!-- kit:end -->

## Independencia de las features

Cada feature es un miniproyecto dentro de la app. Si se borra su carpeta no se
rompe nada, salvo su línea en las rutas de `router/` y su entrada en el menú.

- Una feature no importa de otra feature ni de otra familia.
- Nada de fuera importa del interior de una feature. La única excepción es su
<!-- kit:if backend -->
  `<feature>Routes.tsx`, que importan las rutas de `router/`: las de la app
  (`appRoutes.tsx`) y, las de la entrada, `rootRoutes.tsx`.
<!-- kit:else -->
  `<feature>Routes.tsx`, que importan las rutas de la app
  (`router/appRoutes.tsx`).
<!-- kit:end -->
<!-- kit:if backend -->
- Una feature puede importar de la raíz, de `services/`, de `schemas/`, de
  `domains/` y del `common` de su propia familia.
<!-- kit:else -->
- Una feature puede importar de la raíz, de `domains/` y del `common` de su
  propia familia.
<!-- kit:end -->
- Cuando dos features necesitan lo mismo:
  - si es igual y de la misma familia, sube a su `common`;
  - si es igual, de negocio y de familias distintas, sube a un dominio;
  - si es igual y genérico, sube a la raíz;
<!-- kit:if backend -->
  - si solo se parece, cada una tiene lo suyo;
  - si es un dato del servidor, las dos lo piden con la misma clave de consulta
    y comparten la caché.
<!-- kit:else -->
  - si solo se parece, cada una tiene lo suyo.
<!-- kit:end -->

  Lo que sube recibe por props lo que depende de la pantalla y no sabe qué
  feature lo usa.
<!-- kit:if backend -->
- Un ejemplo son `orders` y `ordersDashboard`, dos features con la misma
  cabecera. La cabecera (`OrderFiltersHeader`), el catálogo de filtros
  (`useOrderFilters`, que pide `getOrdersFilters`) y los filtros aplicados
  (`useOrderFiltersStore`) son de `orders/common`, y las dos features los
  usan; el recuento de la cabecera es de cada una, que se lo pasa por props
  (el listado, el total de su página; el análisis, el de `getOrdersStatus`);
  y la regla de permisos que las dos necesitan se repite en
  `ordersPermissions` y en `ordersDashboardPermissions`.
  `shipmentsPlanning`, de otra familia, pide el catálogo de tipos de pedido
  (`getOrderTypesCatalog`) con la misma clave de consulta que ellas y comparte
  su caché, sin importar nada de `orders/common`.
<!-- kit:else -->
- Un ejemplo son `orders` y `ordersDashboard`, dos features con la misma
  cabecera. La cabecera (`OrderFiltersHeader`), el catálogo de filtros
  (`useOrderFilters`) y los filtros aplicados (`useOrderFiltersStore`) son
  de `orders/common`, y las dos features los usan; y el recuento de la
  cabecera es de cada una, que se lo pasa por props (el listado, el total de
  su página; el análisis, el de su resumen).
<!-- kit:end -->
- Un dominio puede usar otro dominio, sin ciclos, pero nunca una feature ni el
  `common` de una familia.
- La comprobación de la estructura recorre los imports y falla si alguna de
  estas reglas se rompe ([Comprobar la estructura](#comprobar-la-estructura)).

## Sencillez y tamaño

La app tiene que ser lo más sencilla y entendible posible, sin un montón de
ficheros.

- Un componente es un fichero, no una carpeta. Su `.module.css` y su
  `.test.tsx` van al lado, con el mismo nombre. En VS Code,
  `.vscode/settings.json` los pliega bajo su fichero en el explorador (y el
  `.test` de un `.ts`, bajo el suyo).
- Un fichero de componente tiene una sola función: el componente. Cada
  subpieza (una fila, un pie, un campo de un tipo) es otro componente, en su
  propio fichero al lado; si son varias de una zona, van juntas
  en su carpeta (`components/lines/`). Lo que no pinta (un cálculo, un
  ayudante) va a `utils/` o a un hook. Un hook va en su fichero; los utils, en
<!-- kit:if backend -->
  un objeto por tema, como un service (`filterUtils.buildFilterChipLabel`),
<!-- kit:else -->
  un objeto por tema (`filterUtils.buildFilterChipLabel`),
<!-- kit:end -->
  con sus ayudantes privados dentro
  ([Nomenclatura](./naming.md#ficheros)). Las constantes y los tipos
  privados sí pueden ir junto al componente o dentro del fichero de utils.
- Todo fichero con código tiene su `.test` al lado, con el mismo nombre; solo
  se libran los que únicamente declaran (tipos, constantes, configuración y
  rutas) y el código base que trae el kit, que lo prueba el propio kit. Lo
  mira la [comprobación de la estructura](#comprobar-la-estructura), y cómo
  se escribe cada uno está en [Escribir tests](./guides/write-tests.md).
- Las carpetas solo agrupan varias piezas de una zona. Una carpeta con una sola
  pieza sobra, y no hay carpetas por tipo de fichero.
- Un hook por fichero, que se llama como el hook.
- Lo que solo arma etiquetas con `t()` no es un hook: va en el componente.
- Se extrae solo lo que es igual, y cuando aparece la segunda copia o el
  documento de la feature ya dice que la habrá, no antes. Nada de componentes
  genéricos llenos de huecos que cuesten más de leer que la copia.
- Nada «por si acaso»: lo que hoy no usa nada no se escribe, ni un fichero,
  ni una prop, ni una variante, ni un estado, ni una dependencia. Una pieza
  del sistema de diseño nace con lo que pide la historia que la crea, y
  crece con la que pide más (el `loading` de un botón, con la primera acción
  que espera). Y cada mecanismo de la app, con el primer caso que lo pide
  ([Nace con el proyecto](#organización-de-src)).
- Tamaño orientativo: unas 150 líneas por fichero y unas 100 por componente.
  Si se pasa, se divide por significado (una zona, un grupo de campos, un tipo
<!-- kit:if backend -->
  de respuesta), nunca por tipo técnico. Si dividirlo lo hace menos
<!-- kit:else -->
  de dato), nunca por tipo técnico. Si dividirlo lo hace menos
<!-- kit:end -->
  entendible, no se divide.

## Comprobar la estructura

`src/tests/structure.test.ts` comprueba las reglas de esta normativa que se
pueden mirar sin ejecutar la app. Lo instala el kit, va con
`%%PM%% run test` y, si algo no las cumple, falla con la lista, fichero a
fichero:

- **La independencia:** nada importa del interior de una feature que no es la
  suya, salvo su `<feature>Routes.tsx` desde las rutas de `router/`; la raíz
  (`components/`, `hooks/`, `utils/`, `types/` y `constants/`) solo usa los
  dominios del marco, los de `SHELL_DOMAINS`; y no hay ciclos entre dominios
  ([Independencia de las features](#independencia-de-las-features)).
- **Los nombres:** cada fichero de una feature empieza por el nombre de la
  feature, también sus hooks detrás de `use` (`OrdersEditDocumentsTab.tsx`,
<!-- kit:if backend -->
  `useOrdersEditStore.ts`, `ordersEditPermissions.ts`); lo del `common` de
<!-- kit:else -->
  `useOrdersEditStore.ts`, `ordersEditRoutes.tsx`); lo del `common` de
<!-- kit:end -->
  una familia, con su entidad, no lo mira
  ([Prefijo de origen](./naming.md#prefijo-de-origen)). Para alinear lo que
  ya hay: `zaius-rename`.
- **Los utils:** cada fichero de `utils/` exporta un solo objeto, que se llama
  como el fichero y acaba en `Utils` ([Nomenclatura](./naming.md#ficheros)).
- **Un test por fichero:** cada fichero con código tiene su `.test` al lado,
  salvo los que solo declaran y el código base del kit
  ([Sencillez y tamaño](#sencillez-y-tamaño)).
- **La paridad de idiomas:** cada carpeta `i18n/` tiene un catálogo por
  idioma de la app, y todos con las mismas claves ([Textos](#textos)).

Lo encuentra todo solo, con `import.meta.glob`: no hay que apuntar en él
ninguna feature ni ningún fichero.

- **Cada regla es un solo `it`** que espera vacía la lista de lo que la rompe:
  si falla, enseña de una vez todos los ficheros que la rompen.
- **La caché de módulos de Vitest va apagada** (`fsModuleCache: false`, en
  `vite.config.ts`): con ella, vería el `src/` de la vez anterior y pasaría
  aunque se rompiera una regla.

- **`SHELL_DOMAINS`,** la lista de los dominios que puede usar la raíz, está
  arriba del fichero. Añadir uno es una decisión de arquitectura: la raíz pasa
  a depender de él ([Normas de un dominio](#normas-de-un-dominio)).
- **Una regla nueva** de esta normativa que se pueda comprobar leyendo el
  código se añade aquí, con su `describe`.

## Qué se revisa

Lo que mira `zaius-review` en una historia, en un refactor o en el cambio en
curso, con las comprobaciones ya en verde
([Comprobar un cambio](../AGENTS.md#comprobar-un-cambio)). El agente que
revisa sin el contexto de la conversación lee cada fichero entero, con la
historia y el documento de sus pantallas, y lo mira en este orden, que es
también el de sus hallazgos, de lo más grave a lo menos:

1. **El sitio y la independencia:** la carpeta de cada fichero, lo que
   importa y quién lo importa ([Dónde va cada cosa](#dónde-va-cada-cosa) e
   [Independencia de las features](#independencia-de-las-features)).
<!-- kit:if backend -->
2. **Los nombres:** el prefijo de origen, el tipo final, el verbo, el
   singular o el plural, los métodos de service y las claves de consulta
   ([Nomenclatura](./naming.md)).
<!-- kit:else -->
2. **Los nombres:** el prefijo de origen, el tipo final, el verbo y el
   singular o el plural ([Nomenclatura](./naming.md)).
<!-- kit:end -->
3. **El código:** un solo `return`, las condiciones en constantes con `? :` y
   `null`, ningún `&&` en el JSX, sin `any`, `import type`, el JSDoc y los
   tamaños ([Código](#código) y [Sencillez y tamaño](#sencillez-y-tamaño)).
   Y nada «por si acaso»: lo que no usa nada de la historia es un hallazgo,
   sea un fichero, una prop, una variante, una dependencia o un mecanismo
   (la miga de pan en una app que no la pinta, una redirección de `/` a la
   única pantalla, el `loading` de un botón que nadie pone).
4. **Los textos:** ninguno de usuario en el código ni en los tests, que los
   piden a `testUtils.translate`; el namespace de cada `t()`, las claves de
   la nomenclatura y las mismas claves en todos los idiomas
   ([Textos](#textos)). Ni en ellos ni en los documentos, los signos ni las
   frases de la IA
   ([Escribir como una persona](./process.md#escribir-como-una-persona)).
5. **El diseño:** las normas, la pieza de cada papel y los tokens
   ([Normas de UX/UI](./ux-ui/rules.md) y
   [Piezas por papel](./ux-ui/design-system.md#piezas-por-papel)).
6. **Los tests:** uno al lado de cada fichero con código; cada test de la
   lista de la historia, marcado y en verde; cada criterio, con su test o en
   la verificación a mano; y ninguno manipulado para que pase
   ([Escribir tests](./guides/write-tests.md) y
   [Un test no se manipula](./guides/write-tests.md#un-test-no-se-manipula)).
7. **El documento dice lo que hace el código:** la historia, con lo decidido
   al construirla; el documento de cada pantalla que toca
   ([Features](./features/README.md));
<!-- kit:if api -->
   `docs/api/` y `docs/api-requests.md`, si toca la API;
<!-- kit:end -->
   y lo que dependa de ellos.

Cada hallazgo va en una línea, con `fichero:línea`, la regla que rompe, con
su enlace, y la corrección propuesta:

```text
src/features/orders/orders/components/ListTable.tsx:3: falta el prefijo de la feature (docs/naming.md#componentes); se renombra a OrdersTable.
```

<!-- kit:if existing -->
Mientras el proyecto se trae a estas reglas, la comprobación de la estructura
aún no está: lo que comprueba
([Comprobar la estructura](#comprobar-la-estructura)) se mira a mano, con lo
demás.

<!-- kit:end -->
### La revisión visual

Si la historia se ve, cada pantalla que toca se mira en el navegador, en el
puerto %%REVIEW_PORT%%, con su propio servidor (`%%PM%% run dev:review`), y
nunca en el %%HUMAN_PORT%%, que es el de la persona:

- **con los estados que toca:** carga, recarga, error, vacío y edición
  ([D3](./ux-ui/rules.md#d3-estados-de-carga-error-y-vacío));
- **en los anchos del sistema de diseño**
  ([Anchos](./ux-ui/design-system.md#anchos)), sin scroll horizontal de la
  página;
- **la jerarquía, los espacios y las columnas,** en cada ancho: se ve
  primero lo que más importa; lo que va junto, cerca, y lo que no, separado;
  y todo en la misma rejilla
  ([D14](./ux-ui/rules.md#d14-jerarquía-espacios-y-columnas)), sin
  nada de lo que no se hace
  ([D15](./ux-ui/rules.md#d15-lo-que-no-se-hace));
- **con el ratón y el teclado:** lo que se pulsa responde al pasar por
  encima y con el foco ([D13](./ux-ui/rules.md#d13-movimiento));
- **con el teclado, con un lector de pantalla y con el zoom al 200 %**
  ([D12](./ux-ui/rules.md#d12-accesibilidad));
- **con «reducir movimiento»,** si algo se mueve
  ([D13](./ux-ui/rules.md#d13-movimiento)).

<!-- kit:if backend -->
Lo que no se puede mirar así (un móvil de verdad, los datos reales de la API)
va a la verificación a mano de la persona. En el resumen, su línea:
<!-- kit:else -->
Lo que no se puede mirar así (un móvil de verdad) va a la verificación a mano
de la persona. En el resumen, su línea:
<!-- kit:end -->
«Revisión visual: <pantallas>, con sus estados, en <anchos>, con la
jerarquía, los espacios y las columnas repasados, con teclado, lector de
pantalla y zoom al 200 %».

**Al terminar, se para el servidor de revisión:** el `%%PM%% run dev:review`
que se arrancó, con Ctrl+C en su terminal o parando su tarea si va en segundo
plano. El de la persona, en el %%HUMAN_PORT%%, no se toca.

## Código

### TypeScript

- Estricto, sin `any` y sin casts innecesarios. Se prefiere la inferencia.
- Los imports de solo tipos usan `import type`.
<!-- kit:if backend -->
- Sin `enum` ni `namespace`. Un enumerado de la API es un objeto `as const`
  con nombres de la app (`ORDER_STATUS = { pending: 0, … }`).
- Los tipos de los datos salen de los schemas de zod con `z.infer`; no se
  escriben a mano.
<!-- kit:else -->
- Sin `enum` ni `namespace`. Un enumerado es un objeto `as const`
  (`ORDER_STATUS = { pending: 0, … }`).
- Los tipos de los formularios salen de sus schemas de zod con `z.infer`; no
  se escriben a mano.
<!-- kit:end -->

```ts
// mal
enum OrderStatus { Pending, Shipped, Delivered, Cancelled }
// bien
export const ORDER_STATUS = { pending: 0, shipped: 1, delivered: 2, cancelled: 3 } as const
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]
```

### Componentes

- Un componente tiene un solo `return`. Los estados se resuelven con
  ternarios.
- **Renderizado condicional:** cada condición va en una constante con nombre,
  dentro del componente, antes del `return` (`const hasNote = order.note !==
  null`, `const isDraft = order.status === ORDER_STATUS.pending`), y en el JSX
  se aplica siempre con `? :`, con `null` en la rama que no pinta; nunca con
  `&&`. Un ternario anidado vale si cada condición es una de esas constantes.
<!-- kit:if backend -->
  Un booleano que ya tiene nombre (una prop como `collapsed`, un `canExport`
  del permiso, un `isError` del hook) ya es esa constante. Las condiciones de
  una prop que no es JSX (`disabled={lines.length === 0}`, un texto) no son
<!-- kit:else -->
  Un booleano que ya tiene nombre (una prop como `collapsed`, un `isOpen` de
  un `useState`) ya es esa constante. Las condiciones de una prop que no es
  JSX (`disabled={lines.length === 0}`, un texto) no son
<!-- kit:end -->
  renderizado condicional y pueden ir en línea; las de una prop que recibe JSX
  (`hint`, `actions`), sí lo son.
- Un componente pinta: recibe el dato listo. Las transformaciones van en
  `utils/` si son puras, o en un hook si necesitan `t` o el locale, y ese hook
  devuelve justo las props de la pieza que pinta (la tarjeta de un gráfico, la
  tabla; [Crear una feature](./guides/create-a-feature.md)). En el cuerpo
  solo se arman las etiquetas con `t()`.
- Dentro del componente solo van sus handlers y las flechas en línea. Una
  función que devuelve JSX es otro componente, en su fichero; una que arma una
  lista de acciones va en el hook de la pieza (`useOrdersTable`).
- Las props de función se llaman `onX` (`onSent`). Un handler local que hace
  algo más que relanzar la prop se llama `handleX` (`handleRemove`). Una flecha
  en línea solo relanza una llamada.

```tsx
// mal: dos return
if (order === undefined) return null
return <OrdersEditHeader order={order} />

// bien: un solo return
const hasOrder = order !== undefined

return hasOrder ? <OrdersEditHeader order={order} /> : null
```

```tsx
// mal: la condición en el JSX y `&&`
return <>{order.note !== null && <OrdersEditNoteCard note={order.note} />}</>

// bien: la condición en una constante, y `? :` con `null`
const hasNote = order.note !== null

return <>{hasNote ? <OrdersEditNoteCard note={order.note} /> : null}</>
```

```tsx
// mal: el cuerpo calcula
const { data } = useOrdersDashboardDeadlines()
const total = data.onTimeCount + data.lateCount
return <OrdersDashboardDeadlinesCard title={title} value={`${Math.round((data.onTimeCount / total) * 100)} %`} />

// bien: el hook devuelve las props de la tarjeta
const { card } = useOrdersDashboardDeadlines()
return <OrdersDashboardDeadlinesCard {...card} title={title} />
```

### Datos

<!-- kit:if backend -->
- Los datos del servidor se piden en hooks con `useQuery` y se guardan con
  `useMutation`. Un componente nunca llama a un service. El detalle está en
  [Cargar y guardar datos](./guides/load-and-save-data.md).
- Zod valida los formularios, los parámetros de ruta y las respuestas de la
  API. Un campo que llega `null` y se usa como recuento, lista o texto se
  normaliza en el propio schema con `.transform`.
- Zustand solo guarda lo que sobrevive a salir de la pantalla: la sesión, los
  filtros aplicados, la página y el orden de una lista y los ajustes de vista
<!-- kit:else -->
- Los datos fijos de la app (los tipos de un pedido, las opciones de un
  selector) van en `constants/`, por tema y sin test.
- Lo que la app guarda sin API se decide en `/zaius-init`, con el sitio donde
  se guarda (por ejemplo, el navegador), y queda en el [brief](./brief.md).
  El kit no trae código para ello: se monta con la primera historia que lo
  necesita, con el OK de la persona.
- Zod valida los formularios y los parámetros de ruta.
- Zustand solo guarda lo que sobrevive a salir de la pantalla: los filtros
  aplicados, la página y el orden de una lista y los ajustes de vista
<!-- kit:end -->
  (la escala de un planning, un interruptor). Lo demás es `useState`, también
  lo que es de una pestaña de la gestión de un registro (el buscador de
  Documentos), que no se conserva al salir de la gestión.
  - Cada store vive cerca de lo que lo usa: su feature, su familia o su
    dominio.
  - Los filtros, la página, el orden y los ajustes de vista sobreviven también
    a recargar: su store se guarda en el `sessionStorage` de la pestaña del
    navegador, con el `persist` de Zustand
    ([D8](./ux-ui/rules.md#d8-listados-y-tablas)). La búsqueda no se guarda
    (`partialize` la deja fuera), porque puede ser un nombre o un dato
    personal. Nada de esto va en la URL.
  - Si un store se vacía cuando cambia otro, se suscribe a él en su propio
<!-- kit:if backend -->
    fichero. Puede ser un store del `common` de su familia: el de la consulta
    del listado de pedidos (`useOrdersStore`) vuelve a la página 1 cuando
    cambian los filtros aplicados (`useOrderFiltersStore`, de `orders/common`).
  - Al cerrar la sesión no queda nada del usuario anterior. `SessionGuard`
    (dominio `session`) vacía la caché de TanStack Query, y cada store vuelve
    a su estado inicial y vacía su `sessionStorage` porque se suscribe a
    `useSessionStore`.

```ts
// mal: el schema deja el null y cada uso lo comprueba
customerName: z.string().nullable(),
// bien: el schema lo normaliza una vez
customerName: z.string().nullable().transform((value) => value ?? ''),
```

```ts
useSessionStore.subscribe((state) => {
  if (state.session !== null) return
  useOrderFiltersStore.setState(useOrderFiltersStore.getInitialState())
  useOrderFiltersStore.persist.clearStorage()
})
```
<!-- kit:else -->
    fichero. Puede ser un store del `common` de su familia: el de la página y
    el orden del listado de pedidos (`useOrdersStore`) vuelve a la página 1
    cuando cambian los filtros aplicados (`useOrderFiltersStore`, de
    `orders/common`).
<!-- kit:end -->

### Textos

- Ningún texto de usuario va en el código: todo sale de i18n, también con un
  solo idioma, para que añadir otro sea solo traducir.
- Cada `t()` lleva su namespace (`t('ordersEdit:documents.table.title')`). El
  namespace es el de quien tiene el texto: la feature (`ordersEdit:`), la
  familia para lo de su `common` (`orders:filters.subtitle`), el dominio
  (`products:`) o, solo para la raíz, `common:`.
- **La configuración** está en `src/i18n/i18n.ts`, que importa `main.tsx`.
  En los tests, la importa `src/tests/setup.ts`.
  Junta solos todos los `i18n/<idioma>.json` de `src/`:
  el namespace es la carpeta que los tiene (la feature, el dominio), la
  familia si es su `common` (`orders`) y `common` en `src/i18n/`. Los idiomas
  son los de `APP_LANGUAGES` (%%LANGUAGES%%), en `src/constants/appLanguages.ts`.
  La app arranca en el idioma del navegador si es uno de ellos, y si no, en
  el de por defecto, `APP_DEFAULT_LANGUAGE` (`%%DEFAULT_LANGUAGE%%`), con
  `languageUtils.resolveAppLanguage`.
- Un número que concuerda va en `count`, y la clave tiene sus formas en
  singular y plural (`_one` y `_other`): «1 pedido», «2 pedidos», «Hay 1
  campo por revisar» ([D11](./ux-ui/rules.md#d11-textos-y-formato)).
- Las piezas del sistema de diseño reciben siempre sus textos desde i18n,
  aunque traigan los suyos; los de los campos salen de `common:fields`
  ([D1](./ux-ui/rules.md#d1-el-sistema-de-diseño-primero)).
<!-- kit:if backend -->
- Las claves que manda la API se resuelven contra claves propias, con el texto
  de la API como valor por defecto.
<!-- kit:end -->
<!-- kit:if i18n -->
- **Para cambiar el idioma** fuera de un componente o en un efecto se usa la
  instancia de `src/i18n/i18n.ts` (`i18n.changeLanguage`): la que da
  `useTranslation()` es otro objeto en cada idioma, y en las dependencias de
  un efecto lo vuelve a lanzar con cada cambio.
<!-- kit:end -->
- `<html lang>` sigue al idioma de la app, y cambiar de idioma deja la misma
<!-- kit:if backend -->
  pantalla, con sus filtros y lo escrito. Si la API devuelve textos
  traducidos, el idioma va en su clave de consulta, y solo se vuelve a pedir
  eso.
<!-- kit:else -->
  pantalla, con sus filtros y lo escrito.
<!-- kit:end -->
- Cómo se nombran las claves: [Nomenclatura](./naming.md#textos-i18n).
- La [comprobación de la estructura](#comprobar-la-estructura) mira que todos
  los idiomas tengan las mismas claves.
- **Un idioma nuevo** se añade con la skill `zaius-languages`: lo apunta y
  traduce los catálogos.
- **Las fechas, los números y los porcentajes se formatean con las funciones
  de la raíz,** en `formatUtils`, que nace con la primera pantalla que
  formatea un dato. Ninguna pantalla formatea a mano, y todas dan «-» si falta
  el dato ([D11](./ux-ui/rules.md#d11-textos-y-formato)):

  | Función | Recibe | Da |
  |---|---|---|
<!-- kit:if backend -->
  | `formatUtils.formatDate(value)` | Una fecha de la API | La fecha, sin moverse por la zona horaria |
  | `formatUtils.formatDateTime(value)` | Un momento de la API | La fecha y la hora locales |
<!-- kit:else -->
  | `formatUtils.formatDate(value)` | Una fecha, sin hora | La fecha, sin moverse por la zona horaria |
  | `formatUtils.formatDateTime(value)` | Un momento, con su hora | La fecha y la hora locales |
<!-- kit:end -->
  | `formatUtils.formatNumber(value, decimals = 0)` | Una cifra y sus decimales | «1.500»; una media, con `1`: «3,8» |
  | `formatUtils.formatPercent(value)` | Un porcentaje de 0 a 100 | «65 %», entero |

  Una función nueva de formato se añade a este objeto y a esta tabla.

### Estilos

- CSS Modules, junto al componente. Nunca la prop `style` ni `!important`.
- Siempre los tokens del sistema de diseño
  ([Tokens](./ux-ui/design-system.md#tokens)), nunca un color suelto.
- Los estilos globales solo tienen lo que no puede ir en un módulo.

### Comentarios

- Toda función que no es componente lleva un JSDoc corto, siempre con la misma
  forma: [Nomenclatura](./naming.md#jsdoc).
- Sin comentarios en el cuerpo de las funciones ni en los componentes.
- Sin comentarios en las constantes, los schemas ni la configuración: su
  nombre dice lo que son.
- El código está en inglés y el JSDoc en castellano. Describe el proyecto por
  sí mismo, sin referencias a otros proyectos.

## Rutas, permisos y navegación

Esta parte es la técnica. Cómo se ve y cómo se comporta la navegación está en
[D10](./ux-ui/rules.md#d10-navegación).

- **URLs.** Las pantallas cuelgan de la raíz (`/orders`,
<!-- kit:if backend -->
  `/orders/:id/edit`, `/admin/users`), y la entrada, si la hay, tampoco lleva
  prefijo (`/login`).
<!-- kit:else -->
  `/orders/:id/edit`, `/admin/products`).
<!-- kit:end -->
  `/<familia>/:id` no es una ruta: un registro tiene una sola pantalla, su
  gestión ([D7](./ux-ui/rules.md#d7-un-registro-una-pantalla)).
- **`/`, sin redirección.** La pantalla con la que se abre la app está en
  `/` si no es de una familia: la portada (`home`) o, en una app de una sola
  pantalla, esa pantalla. Solo si se abre en una de una familia (`/orders`),
  `/` lleva a ella, con `replace`.
<!-- kit:if backend -->
  Sin sesión, la guarda de la app lleva al login, como en cualquier otra.
<!-- kit:end -->
- **Rutas de una feature.** Cada feature declara las suyas en
  `<feature>Routes.tsx`. Con una sola pantalla en la app, su página va en
  `/`, directa (`{ index: true, Component: OrdersPage }`): no hay otra que
  descargar aparte. Desde
  la segunda, cada página se carga con `lazy`, también las que ya había, en
  forma de función (`lazy: () => import('./pages/OrdersPage').then((m) => ({
  Component: m.OrdersPage }))`), nunca en la de objeto (`lazy: {
  Component }`): con la de objeto, si no llega el código de la página, el
  router no lo pasa al `errorElement` y la pantalla se queda vacía.
  - Las rutas de la app (`router/appRoutes.tsx`) las juntan bajo el segmento de
    su familia, que lleva la miga de pan de la familia. `orders` declara el
    índice de la familia; `ordersDashboard`, `dashboard`; y `ordersEdit`,
    `:id/edit`. Un segmento fijo gana a un parámetro hermano: en
    `invoicesUpload`, `new` gana a `:id`.
<!-- kit:if backend -->
  - `router/rootRoutes.tsx` compone los layouts, las guardas y las rutas: el
    layout raíz, si lo hay, envuelve todo; dentro, si hay login, la entrada
    (las rutas de las features de `auth`, bajo `SessionGuestGuard` y con el
    layout de la entrada, `AuthLayout`, sin menú) y, bajo `SessionGuard`, el
    layout de la app, con el menú si lo hay, y dentro una ruta sin `path` con
    el `errorElement`, para que el error se pinte con el marco, con las rutas
    de la app y `*`, la página que no existe.
  - Un ejemplo, con su guarda y su miga de pan:
    [Crear una feature](./guides/create-a-feature.md).
<!-- kit:else -->
  - `router/rootRoutes.tsx` compone los layouts y las rutas: el layout raíz,
    si lo hay, envuelve todo; dentro, el layout de la app, con el menú si lo
    hay, y dentro una ruta sin `path` con el `errorElement`, para que el
    error se pinte con el marco, con las rutas de la app y `*`, la página
    que no existe.
  - Un ejemplo, con su miga de pan:
    [Crear una feature](./guides/create-a-feature.md).
<!-- kit:end -->
<!-- kit:if backend -->
- **Guardas.** Son del dominio `session`, que crea el proyecto con su login;
  sin login no hay guardas.
  - `SessionGuard` protege la app. Sin sesión, lleva al login con la ruta
    pedida (y su `?tab=`), y al entrar se vuelve a ella, con `replace`, si la
    persona tiene permiso; si no, a la portada.
  - `SessionGuestGuard` protege la entrada: con sesión, lleva a la ruta pedida
    o, si no la hay, a la portada. Así, al entrar, la vuelta la hace solo
    ella, y el login solo guarda la sesión.
  - Una pantalla que necesita un permiso cuelga de `SessionPermissionGuard`,
    con una regla `allowed` sobre los permisos de la sesión. Sin permiso,
    pinta el mensaje de que no se tiene acceso dentro de la app, sin montar la
    página; una familia entera con su permiso (`admin`) la lleva en su
    segmento.
  - Un `401` cierra la sesión: `apiSessionUtils.endOnError` lo pasa a `onEnd`
    como `expired`, y la guarda lleva al login con el aviso de que ha caducado
    y, al entrar, a la misma pantalla.
<!-- kit:end -->
- **Páginas de error.** La página que no existe y el error inesperado al
  pintar una pantalla se pintan dentro de la app, con su marco. Con las
  pantallas en `lazy`, si falla la descarga del código de una (pasa tras
  publicar una versión nueva), la página de error recarga sola una vez; si
  vuelve a fallar en menos de 10 segundos, se queda en el error.
- **Lo que aún no está hecho no tiene ruta ni entrada en el menú.** Una
  feature entra en las rutas y en el menú cuando se hace.
<!-- kit:if backend -->
- **Reglas de permisos.** Si la misma regla decide la ruta y los botones de la
  pantalla, es una función pura `<feature>Permissions`, en
  `<feature>Permissions.ts`, en la raíz de la feature, junto a
  `<feature>Routes.tsx`. Si solo la usa la ruta, va en línea en `allowed`.
  Una regla que otra feature necesita igual se repite en cada una: por
  independencia, ninguna importa la de la otra. Cómo se aplica a una ruta, un
  botón, una pestaña o una petición: [Permisos](./guides/apply-permissions.md).
<!-- kit:end -->
- **Menú.** Nace cuando hay dos pantallas que se abren desde él; con una, no
  hay menú. `navigation.config.ts` (`navigationConfig`) es su única fuente:
  añadir una sección es añadir su entrada ahí y sus rutas.
  `rootRoutes.tsx` se lo pasa al layout de la app por props: el layout no
<!-- kit:if backend -->
  sabe qué menú pinta. Sus
  tipos (`NavEntry`, `NavGroup` y `NavMenu`) están en `types/navigation.ts`,
  y `navigationUtils.filterNavMenu` deja lo que ve la persona.
<!-- kit:else -->
  sabe qué menú pinta. Sus tipos (`NavEntry`, `NavGroup` y `NavMenu`) están
  en `types/navigation.ts`.
<!-- kit:end -->
  - Es una lista de entradas sueltas («Inicio», la de `/`, que se marca solo
    en ella, con `end` en el enlace del router) y de grupos, uno por familia.
    La cabecera de un grupo es solo el nombre de su familia («Pedidos»), sin
    enlace, y sus entradas son sus pantallas: «Añadir pedido»
    (`/orders/new`), «Análisis de pedidos» (`/orders/dashboard`) y «Gestión de
    pedidos» (`/orders`).
<!-- kit:if backend -->
  - Cada entrada lleva una regla `allowed` con los permisos que pide su ruta,
    y no se ve sin ellos. El grupo no lleva regla propia: se ve si se ve
    alguna de sus entradas.
<!-- kit:end -->
- **La pestaña del navegador** la pone cada pantalla, con el `<title>` de
  React, que lo lleva al `<head>`: «<título> - %%APP_NAME%%», con un solo
  texto (`t('common:documentTitle', { title })`). La pone su cabecera, junto
  al `h1` y con su mismo título; la gestión de un registro le pasa el del
  registro, «Pedido #1287», más corto que su título («Gestiona el pedido
  #1287»). La página que no existe y la de error, igual.
- **La miga de pan,** solo si la app la pinta: cuando hay una familia con
  varias pantallas o una pantalla que cuelga de otra (la gestión de un
  registro). Con un solo nivel, el título ya dice dónde se está: no hay
  miga, ni `handle.crumb`, ni el hook que la junta. Nace con la primera
  pantalla que la pinta:
  - Cada ruta declara su segmento en `handle.crumb`, una función que recibe
    los parámetros de la URL y devuelve la clave de su texto (`labelKey`),
    sus valores y, si enlaza, su ruta (`NavHandle` y `NavCrumb`, en
    `types/navigation.ts`).
  - Un hook de la raíz junta los segmentos de las rutas de la URL, y el marco
    los pinta. El primero es el de la familia, que es texto, sin enlace,
    porque la familia no tiene página; lo pone el segmento de la familia en
    las rutas de la app. Detrás va el de la pantalla: «Pedidos / Gestión de
    pedidos».
  - Una ruta que no está en el menú pero cuelga de una entrada (la gestión de
    un registro) lo dice con `handle.navTo: '/orders'`: esa entrada sigue
    marcada, y de ella sale el segundo nivel de la miga: «Pedidos / Gestión
    de pedidos / Pedido #1287».
- **Pestañas.** Las de la gestión de un registro van en `?tab=`
  (`/orders/1287/edit?tab=documents`): la pestaña por defecto no lleva
<!-- kit:if backend -->
  parámetro y cambiar de pestaña usa `replace`. Una `?tab=` que no existe, o
  que la persona no puede ver, abre la pestaña por defecto y corrige la URL
  con `replace`. Así, un enlace a un registro abre la pestaña que toca. Las de
  un asistente no se comparten por URL y van en un `useState`.
<!-- kit:else -->
  parámetro y cambiar de pestaña usa `replace`. Una `?tab=` que no existe
  abre la pestaña por defecto y corrige la URL con `replace`. Así, un enlace
  a un registro abre la pestaña que toca. Las de un asistente no se
  comparten por URL y van en un `useState`.
<!-- kit:end -->
- **Enlaces.** Lo que lleva a otra pantalla es un enlace (`<a href>` con el
  enlace del router), con aspecto de botón donde toque, nunca un `onClick`
  con `navigate`. El componente de la raíz que adapta el enlace del router
  (`RouterLink`) lo reciben las piezas del sistema de diseño con `href` de su
  proveedor, que monta `main.tsx`
  ([Librería y cómo se monta](./ux-ui/design-system.md#librería-y-cómo-se-monta)).
  Lo que hace algo sin cambiar de pantalla (abrir un modal, guardar) es un
  botón. Un enlace externo se abre en una pestaña nueva y lo dice en su
  nombre accesible.
- **Volver.** Volver lleva a donde se estaba, y de una sola forma en toda la
  app: el enlace de la pantalla de origen pasa en el estado de navegación su
  vuelta, `back`, con el texto y la ruta (`{ back: { label, to } }`). La
  salida de la gestión de un registro usa los dos («Vuelve al envío #12»); la
  de un alta, solo la ruta. Sin origen (un enlace directo, una recarga), se
<!-- kit:if backend -->
  vuelve a la lista de la familia, y si la persona no puede verla, a la
  portada. Solo tienen salida la gestión de un registro, las páginas que
  cuelgan de una feature (el detalle de una carga) y las altas: a un listado
  o a un análisis se vuelve con el menú.
- **Historial.** `replace` cuando lo que se deja ya no tiene sentido: una
  baja, un formulario enviado, una redirección de una guarda y un cambio de
  pestaña. En el resto, cada paso añade una entrada, también cada paso de un
  asistente. El estado de navegación solo lleva el origen y los avisos de
  llegada, nunca datos que la pantalla necesite para pintarse; un aviso de
  llegada se consume con `replace` en cuanto se pinta.
<!-- kit:else -->
  vuelve a la lista de la familia. Solo tienen salida la gestión de un
  registro, las páginas que cuelgan de una feature (el detalle de una carga)
  y las altas: a un listado o a un análisis se vuelve con el menú.
- **Historial.** `replace` cuando lo que se deja ya no tiene sentido: una
  baja, un formulario enviado y un cambio de pestaña. En el resto, cada paso
  añade una entrada, también cada paso de un asistente. El estado de
  navegación solo lleva el origen y los avisos de llegada, nunca datos que la
  pantalla necesite para pintarse; un aviso de llegada se consume con
  `replace` en cuanto se pinta.
<!-- kit:end -->
- **Lo que se conserva.** Los filtros, la página, el orden y los ajustes de
  vista sobreviven a abrir un registro y volver, y a recargar, en el store de
  la pantalla guardado en el `sessionStorage` ([Datos](#datos)).
- **Scroll y foco.** Al entrar en una pantalla nueva, el scroll va arriba y el
  foco a su `h1`; atrás y adelante del navegador recuperan el scroll de antes.
  Cambiar de pestaña, plegar una sección o cambiar de página en una tabla no
  mueve el scroll. Lo hace el layout raíz, que nace con la segunda pantalla
  (con una sola, no hay cambios de pantalla que cuidar):
  - **el scroll,** con `ScrollRestoration` del router, que lo lleva arriba en
    cada navegación y lo recupera al ir atrás y adelante; si el marco de la
    app tiene su propia zona con scroll, su layout hace lo mismo con ella, y
    no lo mueve si solo cambia la query string (un cambio de pestaña);
  - **el foco,** al cambiar de ruta (no de query string), al `h1` de la
    pantalla nueva, pero solo si antes la persona ha hecho algo (un clic, una
    tecla): al abrir la app se queda donde está, para que lo primero del
    tabulador sea el enlace para saltar al contenido.

## Dominios

<!-- kit:if backend -->
Un dominio es un tema de negocio que usan features de varias familias: la
sesión, los almacenes, los productos. Vive en
`src/domains/<dominio>/` y no tiene pantallas. Las pantallas de su tema son
<!-- kit:else -->
Un dominio es un tema de negocio que usan features de varias familias: los
almacenes, los productos. Vive en `src/domains/<dominio>/` y no tiene
pantallas. Las pantallas de su tema son
<!-- kit:end -->
features normales que lo usan, como cualquier otra: `adminProducts` usa
`products`, e `incidents` usa `incidents`.

Este documento es el índice de los dominios: qué es cada uno, sus piezas,
quién las usa y qué pantallas tiene su tema.

### Dónde va lo compartido

Lo decide quién lo usa:

| Quién lo usa | Dónde va | Nombre |
|---|---|---|
| Una feature | La feature | Su prefijo: `OrdersDashboardStatusSection` |
| Varias features de una familia | `features/<familia>/common/` | La entidad delante: `OrderStatusBadge`, `OrderFiltersHeader` |
| Varias familias, si es de negocio | `domains/<dominio>/` | La entidad delante: `ProductStatsSection` |
| Cualquiera, si no es de negocio | La raíz | Lo que es: `UnsavedChangesModal` |

No hay copias entre familias: si dos familias necesitan lo mismo y es de
negocio, es un dominio. Si solo se parece, cada feature tiene lo suyo.

Una familia que se llama como un dominio (`customers`, `incidents`) no tiene
`common`: lo que comparten sus features va al dominio, que ya es de su
entidad.
Así no hay dos namespaces de textos con el mismo nombre.

### Normas de un dominio

- **No tiene páginas, rutas ni entrada en el menú.** Lo que tiene pantallas
  son features.
- **Se organiza como una feature, sin `pages/` ni rutas:** `components/`,
  `hooks/`, `utils/` (un objeto por tema), `constants/`, `schemas/`,
  `stores/` e `i18n/`, solo las que hacen falta.
- **Se llama por su entidad**, en camelCase: en plural si es una colección
  (`products`, `warehouses`, `notifications`), en singular si es una sola cosa
<!-- kit:if backend -->
  (`session`, `company`).
- **Sus piezas llevan la entidad delante**, igual que el `common` de una
  familia: `ProductStatsSection`, `IncidentStatusBadge`, `SessionGuard`.
<!-- kit:else -->
  (`company`).
- **Sus piezas llevan la entidad delante**, igual que el `common` de una
  familia: `ProductStatsSection`, `IncidentStatusBadge`.
<!-- kit:end -->
- **Una zona de pantalla (una sección, una tarjeta) solo sube a un dominio si
  es idéntica y de negocio y la usan varias familias** (`ProductStatsSection`).
  Las demás zonas son de su feature, aunque otra tenga una parecida; de ellas
  sube la pieza genérica que usan por dentro.
- **Sus textos van en su propio namespace**, con el nombre del dominio
  (`products:stats.title`).
- **Recibe por props lo que depende de la pantalla.** No sabe qué feature lo
  usa: `ProductStatsSection` recibe las cifras, no las pide.
- **Puede usar otro dominio**, sin ciclos: `incidents` usa `products`. Nunca
  usa una feature ni el `common` de una familia.
<!-- kit:if backend -->
- **La raíz solo usa los dominios del marco y del transporte,** los de
  `SHELL_DOMAINS`, arriba de `src/tests/structure.test.ts`: `session` (el
  transporte, el router y la barra superior) y, si los hay, los que pinta el
  marco (`notifications`, en la barra superior). Un dominio que la raíz
  necesita se añade ahí.
<!-- kit:else -->
- **La raíz solo usa los dominios del marco,** los de `SHELL_DOMAINS`,
  arriba de `src/tests/structure.test.ts`. Al instalar, la lista está vacía:
  la raíz no usa ningún dominio hasta que el marco pinta uno. Un dominio que
  la raíz necesita se añade ahí.
<!-- kit:end -->
- **Un dominio nuevo necesita el OK de la persona,** y se apunta aquí, en el
  [Índice de dominios](#índice-de-dominios), igual que cada pieza nueva de uno
  ([Añadir una pieza a un dominio](#añadir-una-pieza-a-un-dominio)).

### Añadir una pieza a un dominio

Una pieza nueva va a un dominio solo si es de negocio y la usan varias familias
([Dónde va lo compartido](#dónde-va-lo-compartido)). El dominio se
<!-- kit:if backend -->
organiza como una feature, sin `pages/` ni rutas, y el service de su dato no
vive en él, sino en `src/services/<entidad>/`
([Añadir un servicio](./guides/add-a-service.md)). Así estaría
`products`:
<!-- kit:else -->
organiza como una feature, sin `pages/` ni rutas. Así estaría `products`:
<!-- kit:end -->

```text
src/
    domains/products/
        components/
            ProductStatsSection.tsx
            ProductStatsTopCard.tsx
            ProductNameValue.tsx
        hooks/
            useProductsCatalog.ts
            useProductStatsTop.ts
        utils/
            productStatsUtils.ts
        i18n/
            <idioma>.json
        constants/
            productStats.ts
<!-- kit:if backend -->
    services/products/
        productsService.ts
        productsSchema.ts
        productsOrdersDashboardSchema.ts
<!-- kit:end -->
```

Cada fichero con código lleva su `.test` al lado, y cada componente con
estilos, su `.module.css`. Para añadir una pieza:

1. **El fichero,** en la carpeta que toca (`components/`, `hooks/`, `utils/`,
   `constants/`, `schemas/` o `stores/`), con la entidad delante del nombre;
   en `utils/`, un objeto por tema (`productStatsUtils`).
2. **Sus textos,** en los `i18n/<idioma>.json` del dominio.
<!-- kit:if backend -->
3. **Su dato,** si es nuevo: el método va en el service de su entidad, no en el
   dominio.
4. **Su fila,** en la tabla de su dominio de este documento, con quién la usa.
<!-- kit:else -->
3. **Su fila,** en la tabla de su dominio de este documento, con quién la usa.
<!-- kit:end -->

### Índice de dominios

| Dominio | Qué tiene | Lo usan |
|---|---|---|

Todavía no hay ningún dominio. Cada dominio nuevo, con el OK, añade su
fila a esta tabla y su sección debajo, `### <dominio>`, con:

- una frase de qué es;
- la tabla de sus piezas, `| Pieza | Qué es | La usan |`;
<!-- kit:if backend -->
- sus datos (los métodos de los services que piden sus piezas), los dominios
  que usa y las pantallas de su tema.
<!-- kit:else -->
- sus datos (de dónde salen los que usan sus piezas), los dominios que usa y
  las pantallas de su tema.
<!-- kit:end -->
<!-- kit:if existing -->

## Traer un proyecto que ya existe

Lo que mira `zaius-adopt` en el código que ya había, sin mover nada, para
escribir el plan que lo trae a esta normativa. Cada punto, con cuántos casos
hay y un par de ejemplos, con `fichero:línea`, en este orden:

1. **La estructura de `src`** y dónde va cada cosa
   ([Organización de src](#organización-de-src) y
   [Dónde va cada cosa](#dónde-va-cada-cosa)).
2. **Las pantallas:** todas van en `src/features/`, por familia, también la
   entrada (la familia `auth`) y la administración (`admin`)
   ([Familias y features](./naming.md#familias-y-features)).
<!-- kit:if backend -->
3. **Los nombres:** features, componentes, hooks, services y utils
   ([Revisar los nombres](./naming.md#revisar-los-nombres)).
<!-- kit:else -->
3. **Los nombres:** features, componentes, hooks y utils
   ([Revisar los nombres](./naming.md#revisar-los-nombres)).
<!-- kit:end -->
4. **Las features y su independencia:** quién importa de quién
   ([Independencia de las features](#independencia-de-las-features)).
<!-- kit:if backend -->
5. **Los datos:** services, schemas, consultas y estado ([Datos](#datos)).
<!-- kit:else -->
5. **Los datos:** de dónde salen, lo que se guarda, los schemas y el estado
   ([Datos](#datos)).
<!-- kit:end -->
6. **Los tests que faltan,** al lado de cada fichero con código
   ([Sencillez y tamaño](#sencillez-y-tamaño)).
7. **El stack:** lo que falta o sobra respecto a
   [Stack y comandos](../AGENTS.md#stack-y-comandos).

Lo que ya hay entra en el backlog: una historia por cada cosa que se puede
hacer hoy, agrupadas en épicas, «hecha» si funciona como dice su fichero o
«pendiente» si le falta algo; y cada pantalla, con su documento en
[Features](./features/README.md), que dice lo que hace hoy. Los bloques del
plan van del más seguro al más grande: los documentos de las pantallas, los
nombres (con `/zaius-rename`), la estructura de las features, los datos y los
tests; el último, el código base del kit, con `%%KIT_RUN%% change`.
<!-- kit:end -->
