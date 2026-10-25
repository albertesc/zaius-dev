# Nomenclatura

La nomenclatura es lo más importante de %%APP_NAME%%. Cada nombre dice qué hace
la pieza y de dónde sale, aunque salga largo: al leer
`useOrdersEditDocumentsUpload` se sabe que es un hook, que pertenece a la
gestión de un pedido y que sube documentos, sin abrir el fichero.

Cada nombre sale de una regla de esta página. Si una pieza no encaja en
ninguna, se escribe la regla aquí, con su «mal y bien», y se renombra lo que no
la cumple.

**En esta página:**

- [Familias y features](#familias-y-features), [Lo que no es feature](#lo-que-no-es-feature-pero-ya-tiene-nombre), [Ficheros](#ficheros), [Prefijo de origen](#prefijo-de-origen)
<!-- kit:if backend -->
- [Componentes](#componentes), [Funciones, hooks, tipos, constantes y stores](#funciones-hooks-tipos-constantes-y-stores), [Services, schemas y claves de consulta](#services-schemas-y-claves-de-consulta)
<!-- kit:if mocks -->
- [Mocks](#mocks), [El transporte](#el-transporte)
<!-- kit:else -->
- [El transporte](#el-transporte)
<!-- kit:end -->
<!-- kit:else -->
- [Componentes](#componentes), [Funciones, hooks, tipos, constantes y stores](#funciones-hooks-tipos-constantes-y-stores)
<!-- kit:end -->
- [Textos (i18n)](#textos-i18n), [JSDoc](#jsdoc), [Revisar los nombres](#revisar-los-nombres)

## Familias y features

- **F1. Familia.** Un grupo de pantallas de un mismo tema, con una URL base
  común. Se nombra en plural y en camelCase: `orders` (`/orders`), `invoices`,
<!-- kit:if backend -->
  `shipments`, `customers`, `incidents`, `admin` y `auth` (`/login` y
  `/recover`, que cuelgan de `/`).
<!-- kit:else -->
  `shipments`, `customers`, `incidents` y `admin`.
<!-- kit:end -->
- **F2. Feature.** Cada hija directa de la URL base de una familia es una
  feature, y su nombre es su URL en camelCase, segmento a segmento, sin los
  parámetros. No hay un tipo de pantalla obligatorio: el nombre dice dónde
  está la pantalla, no qué es.
  - el índice de una familia se llama como ella: `orders` (`/orders`),
    `incidents` (`/incidents`), `admin` (`/admin`);
  - los demás segmentos van detrás, en PascalCase, juntando los guiones:
    `ordersDashboard` (`/orders/dashboard`), `ordersNew` (`/orders/new`),
    `shipmentsPlanning` (`/shipments/planning`), `adminStockLevels`
    (`/admin/stock-levels`);
  - `:id/edit` es `Edit`, la gestión de un registro, su única pantalla, donde
    se ve y se edita: `ordersEdit` (`/orders/:id/edit`).
    `/<familia>/:id` no es una ruta. En admin, la gestión lleva `Edit` detrás
<!-- kit:if backend -->
    del nombre de la feature: `adminUsersEdit` (`/admin/users/:id/edit`).
<!-- kit:else -->
    del nombre de la feature: `adminProductsEdit` (`/admin/products/:id/edit`).
<!-- kit:end -->

  El nombre de la feature es su carpeta, su namespace de i18n y el prefijo de
  todo lo que contiene.
- **F3. Páginas.** Lo que cuelga de una feature son páginas suyas, no features
  nuevas. La página índice es `<Feature>Page` y las demás,
  `<Feature><Subruta>Page`: `InvoicesUploadPage` (`/invoices/upload`),
  `InvoicesUploadNewPage` (`/new`) e `InvoicesUploadDetailPage` (`/:id`). La
  gestión de un registro nunca es una página: es su propia feature (F2). Las
<!-- kit:if backend -->
  features de admin que gestionan un registro (`adminUsers`, `adminRoles`)
  tienen dos, `AdminUsersPage` y `AdminUsersNewPage`, y su gestión es otra
  feature (`adminUsersEdit`). Las demás, una sola.
<!-- kit:else -->
  features de admin que gestionan un registro (`adminProducts`,
  `adminWarehouses`) tienen dos, `AdminProductsPage` y `AdminProductsNewPage`,
  y su gestión es otra feature (`adminProductsEdit`). Las demás, una sola.
<!-- kit:end -->
- **F4. Pantalla sin familia.** Se llama como su segmento de URL: la portada,
  `home` (`/home`), `profile`, `terms`. Si un día tiene varias pantallas en el
  menú, pasa a ser familia.
- **F5. No son features** las pestañas, los paneles laterales y los modales,
  que son componentes de la feature que los contiene, ni las páginas genéricas
  de `src/pages/`.
- **F6.** El compartido de una familia se llama `common`
  (`features/orders/common/`).
- **F7. Dominio.** Un tema de negocio que usan varias familias vive en
  `domains/<dominio>/` y se llama por su entidad, en plural si es una
<!-- kit:if backend -->
  colección y en singular si es una sola cosa: `session`, `notifications`,
  `warehouses`, `company`, `products`. No es una feature: no tiene pantallas.
<!-- kit:else -->
  colección y en singular si es una sola cosa: `notifications`, `warehouses`,
  `company`, `products`. No es una feature: no tiene pantallas.
<!-- kit:end -->
  Las pantallas de su tema son features normales que lo usan
  (`adminProducts`, `incidents`). Una familia que se llama como un
  dominio (`customers`, `incidents`) no tiene `common`: lo que comparten sus
  features va al dominio. Ver [Dominios](./standards.md#dominios).
- **F8. La carpeta.** Todas las features van en `features/`: las de una
  familia, en su carpeta (`features/orders/ordersEdit/`), y las que no tienen
<!-- kit:if backend -->
  familia, directas (`features/profile/`). La entrada y la administración son
  familias como las demás: `features/auth/authLogin/`,
  `features/admin/adminUsers/`.
<!-- kit:else -->
  familia, directas (`features/profile/`). La administración es una familia
  como las demás: `features/admin/adminProducts/`.
<!-- kit:end -->

## Lo que no es feature, pero ya tiene nombre

El listado de las features, con su URL, está en
[Features](./features/README.md#índice). Estas piezas no son una feature y ya tienen
nombre:

| Pieza | Dónde va | Nombre |
|---|---|---|
| El historial de cambios de un pedido | Pestaña de `ordersEdit` | `OrdersEditChangesTab` |
| Las notificaciones | Desplegable del dominio `notifications` | `NotificationsMenu` |
<!-- kit:if backend -->
| Sin permisos | Mensaje dentro de la app, con su marco | Lo pinta `SessionPermissionGuard`; no hay página `/403` |
<!-- kit:end -->
| La página que no existe y el error inesperado | Páginas genéricas de `src/pages/`, dentro del layout de la app | `NotFoundPage` y `ErrorPage`; no son features (F5) |

## Ficheros

- **Los ficheros y las carpetas se nombran en inglés**, también los documentos,
  las guías, las propuestas y las skills (`docs/standards.md`,
  `docs/guides/create-a-feature.md`,
  `docs/ux-ui/proposals/2026-11-03-header-filters.md`,
  `.claude/skills/zaius-spec/`), aunque su contenido vaya en
  castellano. Así el contenido puede pasar a otro idioma sin romper enlaces ni
  órdenes. Los documentos y las skills van en kebab-case; el código, con las
  reglas de abajo.
- **El fichero se llama como lo que exporta**: `OrdersEditPage.tsx` exporta
  `OrdersEditPage`, y `ordersEditRoutes.tsx`, `ordersEditRoutes`.
- **Un fichero que agrupa varias piezas del mismo tipo** se llama
  `<prefijo><Zona><Tipo>`: `ordersEditFormSchema.ts` (los schemas de los
  formularios de la gestión), `ordersDashboardSchema.ts` (las respuestas del
  análisis).
<!-- kit:if backend -->
- **Un fichero de utils es un objeto con las funciones de un tema**, como un
  service: `utils/dateUtils.ts` exporta `dateUtils`, con `getUtcDayMs`,
<!-- kit:else -->
- **Un fichero de utils es un objeto con las funciones de un tema:**
  `utils/dateUtils.ts` exporta `dateUtils`, con `getUtcDayMs`,
<!-- kit:end -->
  `readUtcDay` y `getToday`, y se usa con el objeto delante:
  `dateUtils.getToday()`, `formatUtils.formatDate(value)`. El objeto es lo
  único que exporta el fichero, y el fichero se llama como él.
  - **El nombre** es `<prefijo><Tema>Utils`, con el prefijo de origen
    ([Prefijo de origen](#prefijo-de-origen)): en la raíz, ninguno
    (`formatUtils`); en el `common` de una familia o en un dominio, la entidad
    en singular (`orderCloseUtils`, `warehouseUtils`); en una feature, su
<!-- kit:if backend -->
    nombre (`authLoginFailureUtils`, `ordersEditDocumentUtils`). Un tema nuevo
<!-- kit:else -->
    nombre (`ordersNewDraftUtils`, `ordersEditDocumentUtils`). Un tema nuevo
<!-- kit:end -->
    es un objeto nuevo, y uno que pasa de ~150 líneas se parte en dos temas.
  - **Por dentro,** cada función se declara suelta, con su JSDoc, y el objeto
    del final las reúne. Lo que no está en el objeto es privado: un ayudante
    que solo usan las funciones del tema (`isNavHandle`, en
    `navigationUtils`; `buildOrderOptionsFilter`, en `orderFilterUtils`), y
    las constantes y los tipos que solo usan ellas.

    ```ts
    /**
     * Da el día de hoy de la persona, en su zona horaria.
     * @returns El día, en `yyyy-mm-dd`.
     */
    function getToday (): string { … }

    export const dateUtils = {
      getUtcDayMs,
      readUtcDay,
      getToday,
    }
    ```
  - **Los métodos conservan su nombre entero,** con su verbo y su prefijo,
<!-- kit:if backend -->
    aunque repitan el tema (`formatUtils.formatDate`,
    `orderRequestUtils.buildOrderRequest`), igual que `ordersService` repite
    la entidad en `getOrdersFilters`: así se encuentran buscando su nombre.
<!-- kit:else -->
    aunque repitan el tema (`formatUtils.formatDate`): así se encuentran
    buscando su nombre.
<!-- kit:end -->
  - **Van sueltos en su `utils/`,** sin carpetas de tema: en la raíz,
    `src/utils/formatUtils.ts`; en una familia,
    `orders/common/utils/orderCloseUtils.ts`.
  - **Un test por objeto,** al lado (`dateUtils.test.ts`), con un `describe`
    por función pública; las privadas se prueban a través de ellas.
  - **Las constantes que se exportan** van a `constants/` (de la raíz, de la
    feature, del `common` o del dominio), agrupadas por tema y sin test,
    porque solo declaran: `orders/common/constants/orderStatus.ts`, con
    `ORDER_STATUS_KEYS` y `ORDER_STATUS_TONES`. **Los tipos que usan otros
    ficheros** van a `types/`: `src/types/tableQuery.ts`, con `TableQuery`.
  - **Lo mira la comprobación de la estructura**
    ([Normativa](./standards.md#comprobar-la-estructura)): cada fichero de
    `utils/` exporta un solo objeto, que se llama como el fichero y acaba en
    `Utils`.
<!-- kit:if backend -->
  - **El transporte también son utils,** aunque hable con la red: `apiUtils`,
    `apiErrorUtils` y `apiSessionUtils`, en `src/utils/`
    ([El transporte](#el-transporte)). Es la única excepción a que un util
    sea una función pura. Los hooks (uno por fichero) y los componentes (una
    función por fichero) no cambian.
- **La configuración estática** se llama `<qué configura>.config.ts`:
  `navigation.config.ts`, `queryClient.config.ts`.
<!-- kit:else -->
- **La configuración estática** se llama `<qué configura>.config.ts`:
  `navigation.config.ts`.
<!-- kit:end -->
- **Los estilos y los tests** van al lado, con el mismo nombre:
  `OrdersEditDocumentViewer.module.css`, `OrdersEditDocumentViewer.test.tsx`,
  `ordersEditDeadlineUtils.test.ts`.
- **Los textos** van en `i18n/<idioma>.json`, uno por idioma (%%LANGUAGES%%).
<!-- kit:if mocks -->
- **Los mocks de un service** van en un JSON a su lado, sin carpeta:
  `services/orders/ordersMocks.json` ([Mocks](#mocks)).
<!-- kit:end -->
- **Las carpetas de zona** van en camelCase: `components/documents/`,
  `components/lines/`.

La carpeta entera, con todos sus nombres, está en
[Normativa](./standards.md#la-forma-de-una-feature).

Los objetos de `src/utils/`, uno por tema; cada uno nuevo se apunta aquí:

| Objeto | Qué reúne | Funciones |
|---|---|---|
<!-- kit:if backend -->
| `apiUtils` | Las llamadas a la API ([El transporte](#el-transporte)) | `request`, `upload`, `download` |
| `apiErrorUtils` | El fallo de una llamada a la API | `buildError`, `isApiError`, `readErrorCode`, `isNotFound`, `getRequestFailure` |
| `apiSessionUtils` | La conexión del transporte con la sesión | `connect`, `getToken`, `endOnError` |
<!-- kit:if mocks -->
| `apiMockUtils` | Las respuestas de los mocks, con los `*Mocks.json` | `respond`, `upload`, `download` |
<!-- kit:end -->
<!-- kit:end -->
| `languageUtils` | El idioma de la app | `resolveAppLanguage` |

`formatUtils`, el formato de los datos en pantalla
([D11](./ux-ui/rules.md#d11-textos-y-formato)), nace con la primera pantalla
que formatea un dato.

| Mal | Bien | Por qué |
|---|---|---|
| `utils/formats/formatDate.ts`, con una función | `utils/formatUtils.ts`, con `formatUtils.formatDate` | Un fichero de utils reúne en un objeto las funciones de un tema. |
| `import { formatDate } from '@/utils/formats/formatDate'` | `import { formatUtils } from '@/utils/formatUtils'` y `formatUtils.formatDate(value)` | Se importa el objeto y se usa con él delante. |
| `export function getToday ()` en un fichero de utils | `function getToday ()` y, al final, `export const dateUtils = { …, getToday }` | El fichero solo exporta su objeto. |
| `utils/dates/`, una carpeta por tema | `utils/dateUtils.ts` | Los utils van sueltos en su `utils/`: el tema es el objeto. |
<!-- kit:if backend -->
| `orders/common/utils/ordersQueries.ts` o `invalidateOrdersQueries.ts` | `orders/common/utils/orderQueryUtils.ts`, con `orderQueryUtils.invalidateOrdersQueries` | El objeto lleva el prefijo de su origen (la entidad en singular) y su tema. |
<!-- kit:else -->
| `orders/common/utils/ordersClose.ts` o `isOrderClosable.ts` | `orders/common/utils/orderCloseUtils.ts`, con `orderCloseUtils.isOrderClosable` | El objeto lleva el prefijo de su origen (la entidad en singular) y su tema. |
<!-- kit:end -->
| `orders/common/utils/orderStatus.ts`, con dos constantes y una función | `orders/common/constants/orderStatus.ts` y `orderStatusUtils.isOrderOngoing` | Lo que solo declara va a `constants/`. |
| `buildOrderOptionsFilter.ts`, un ayudante con su fichero | `buildOrderOptionsFilter`, privado en `orderFilterUtils.ts` | Un ayudante que solo usan las funciones del tema no sale del objeto. |
| `formatUtils.date` | `formatUtils.formatDate` | El método conserva su nombre entero. |
| `src/utils/tableQuery.ts`, con los tipos de una tabla paginada | `src/types/tableQuery.ts` | Los tipos que usan otros ficheros van a `types/`. |

## Prefijo de origen

Todo nombre empieza por el sitio del que sale:

| Dónde vive | Prefijo | Ejemplos |
|---|---|---|
<!-- kit:if backend -->
| Una feature | El nombre de la feature | `OrdersEditDocumentsTab`, `useOrdersEdit`, `ordersEditPermissions` |
| El `common` de una familia | La entidad en singular | `OrderStatusBadge`, `OrderTypeBadge`, `OrderFiltersHeader`, `useOrderFiltersStore` |
| Un dominio | Su entidad | `ProductStatsSection`, `IncidentStatusBadge`, `SessionGuard`, `WarehousesSelect` |
<!-- kit:else -->
| Una feature | El nombre de la feature | `OrdersEditDocumentsTab`, `useOrdersEdit`, `ordersEditRoutes` |
| El `common` de una familia | La entidad en singular | `OrderStatusBadge`, `OrderTypeBadge`, `OrderFiltersHeader`, `useOrderFiltersStore` |
| Un dominio | Su entidad | `ProductStatsSection`, `IncidentStatusBadge`, `WarehousesSelect` |
<!-- kit:end -->
<!-- kit:if backend -->
| La raíz | Ninguno: dice qué es | `TableSearch`, `UnsavedChangesModal`, `UserMenu`, `AppLogoImage` |
<!-- kit:else -->
| La raíz | Ninguno: dice qué es | `TableSearch`, `UnsavedChangesModal`, `AppLogoImage` |
<!-- kit:end -->

- **Lo global se nombra por lo que es, no por dónde se usa.** Una pieza de la
  raíz o de un dominio no lleva el nombre de una feature, de una familia ni de
  una pantalla (`Dashboard`, `List`, `Order`): el buscador de una tabla es
  `TableSearch`, aunque solo esté en los listados. Solo lo lleva si la pieza
  no tiene sentido fuera de ahí.
- **Lo de una familia o de un dominio lleva su entidad delante**
  (`OrderStatusBadge`, `IncidentStatusBadge`): el nombre dice de qué es la
  pieza, y al ordenar por nombre queda junto todo lo de la misma entidad.
- **Lo que comparten las dos features de una familia con dashboard** es de la
  familia, no de una de ellas: la cabecera con la barra de filtros de
  `orders` y `ordersDashboard` es `OrderFiltersHeader`, y los filtros
  aplicados que conservan al pasar de una a otra, `useOrderFiltersStore`.
- **Las zonas de una pantalla son de su feature:** pestañas, secciones,
  tarjetas, pasos y pantallas finales llevan su prefijo
  (`OrdersEditDocumentsTab`, `OrdersNewDoneScreen`), aunque otra feature
  tenga una parecida. Solo sube una zona idéntica, de negocio y usada por
  varias familias, a su dominio y con su entidad delante
  (`ProductStatsSection`). De las demás sube la pieza genérica que usan por
  dentro (`TableSearch`, el estado vacío del sistema de diseño).
- **No se repite lo que ya dice el prefijo.** Dentro de la gestión de un
  pedido, «Order» va implícito: `OrdersEditReopenModal`, no
  `OrdersEditReopenOrderModal`.
- **Los nombres largos están bien.** Lo que no vale:
  - abreviar (`useOrdersEditDocsUpload` por `useOrdersEditDocumentsUpload`);
  - usar un nombre genérico (`data`, `items`, `handlers`, `utils`, `index.tsx`,
    `routes.tsx`, `schemas.ts`) como nombre de fichero o de export: es
    `ordersEditRoutes.tsx`, `ordersEditFormSchema.ts`,
<!-- kit:if backend -->
    `ordersEditDeadlineUtils.ts`;
  - usar las palabras del backend cuando la app tiene las suyas: si la API
    llama `purchaseRequest` al pedido, en la app sigue siendo `order`
    (`getOrderCarriersCatalog`, no `getPurchaseRequestCarriersCatalog`, y
    `getOrdersListPage`, para `POST /purchaseRequests`).
<!-- kit:else -->
    `ordersEditDeadlineUtils.ts`.
<!-- kit:end -->

## Componentes

**Fórmula:** `<Prefijo><Zona?><Objeto><Acción?><Tipo>`, de lo general a lo
concreto. Así, al ordenar por nombre, todo lo de un mismo objeto queda junto:
`OrdersEditDocumentEditModal`, `OrdersEditDocumentRemoveModal`,
`OrdersEditDocumentViewer`. Un nombre, partido en sus piezas:

| Nombre | Prefijo | Zona | Objeto | Acción | Tipo |
|---|---|---|---|---|---|
| `OrdersEditLinesProductRemoveModal` | `OrdersEdit` | `Lines` | `Product` | `Remove` | `Modal` |
| `OrdersTable` | `Orders` | - | - | - | `Table` |
| `OrderStatusBadge` | `Order` (familia) | - | `Status` | - | `Badge` |
| `OrderFiltersHeader` | `Order` (familia) | - | `Filters` | - | `Header` |

**Tipos.** Cada componente termina en exactamente uno. Añadir un tipo nuevo
necesita el OK de la persona.

| Tipo | Qué es |
|---|---|
| `Page` | La página de una ruta. |
| `Layout` | Una ruta con `Outlet`. |
| `Tabs` | El juego de pestañas. |
| `Tab` | El contenido de una pestaña. |
| `Wizard` | Un asistente entero. |
| `Step` | Un paso de un asistente. |
| `Section` | Un grupo de tarjetas. |
| `Card` | Una tarjeta. |
| `Modal` | Un diálogo. |
| `Form` | Un formulario. |
| `Fields` | Un grupo de campos. |
| `Field` | Un campo propio. |
| `Table` | Una tabla. |
| `Cell` | Una celda de tabla. |
| `List` | Elementos repetidos que no forman una tabla. |
| `Badge` | Una insignia. |
| `Value` | Un valor en línea con color o icono. |
| `Menu` | Un desplegable de acciones. |
| `Select` | Un selector. |
| `Search` | Un buscador. |
| `Actions` | Un grupo de botones. |
| `Bar` | Una franja: horizontal, como la barra superior o la de acciones, o la barra lateral de navegación. |
| `Header` | Una cabecera. La que comparten `orders` y `ordersDashboard`, con el título, el recuento y la barra de filtros, es `OrderFiltersHeader`. |
| `Footer` | Un pie. |
| `Viewer` | Un visor de un fichero o de un contenido. |
| `Image` | Una imagen o un dibujo de la app: el logo. |
| `Panel` | Una zona de trabajo con varias partes. |
| `Screen` | La pantalla final de un flujo. |
| `Guard` | Algo que protege o avisa sin pintar contenido. |

**Verbos.** `Create` (dar de alta una entidad), `Add` (añadir a una lista),
`Remove` (quitar o borrar), `Merge` (unificar varios en uno:
`OrdersNewDraftsMergeModal`), `Reset` (volver a la propuesta inicial:
`OrdersNewDraftsResetModal`), `Edit`, `Close`, `Cancel`, `Reopen`, `Upload`,
`Download` y `Export`. Un verbo nuevo necesita el OK de la persona.

`New` no se usa en componentes; solo aparece en los nombres de feature que
salen de la URL `/new` y en la página de una subruta `/new`
(`InvoicesUploadNewPage`). Lo que hay dentro de esa página lleva su verbo:
`InvoicesUploadCreateForm`.

**Singular o plural.** Singular si la pieza es un elemento (`…DocumentViewer`),
plural si son varios (`…DocumentsTab`, `…LinesTable`). Una `List` son siempre
varios, así que va en plural (`ShipmentStopsList`), y la pieza que repite, en
singular.

**Ejemplos.**

| Mal | Bien | Por qué |
|---|---|---|
| `CancelOrderModal` | `OrderCancelModal` | Lo abren la gestión del pedido y el listado: es de la familia, con la entidad delante, y el objeto va antes que la acción. |
| `RemoveDocumentModal` | `OrdersEditDocumentRemoveModal` | Objeto antes que acción. |
| `NewProductModal` | `ProductAddModal` | `New` no es un verbo de la lista: añadir a una lista es `Add`. Y es del dominio: la entidad delante. |
| `SummaryCards` | `HomeSummarySection` | Un grupo de tarjetas es `Section`. |
| `ShipmentsEditShipmentMenu` | `ShipmentsEditMenu` | «Shipment» va implícito en la gestión de un envío. |
| `RelatedOrders` | `OrderRelatedOrdersList` | Le faltaba el tipo, y es de la familia: la entidad delante. |
| `UploadDocumentsModal` | `OrdersEditDocumentsUploadModal` | Le faltaba el prefijo de la feature, y el objeto va antes que la acción. |
| `StatusAnalysis` | `OrdersDashboardStatusSection` | Le faltaban el prefijo y el tipo. |
| `ListTable` (en tres features) | `OrdersTable`, `InvoicesListTable`, `ShipmentsListTable` | El prefijo dice de qué feature es. |
| `OrdersHeader` y `OrdersDashboardHeader` (iguales) | `OrderFiltersHeader` | Lo que es igual en las dos features de una familia sube a su `common`, con la entidad delante. |
| `OrdersNewLinesList` y `OrdersEditLinesTable` | `OrderLinesTable` | El alta y la gestión de un registro son el mismo formulario ([D6](./ux-ui/rules.md#d6-formularios)): la pieza que comparten es de la familia, con la entidad delante, y la lectura de la gestión es la misma pieza con `readOnly`. |
| `WizardDone` (en dos asistentes) | `OrdersNewDoneScreen`, `ShipmentsNewDoneScreen` | La pantalla final es una zona de su feature, y su tipo es `Screen`. |
| `ShipmentsEditStopModal` (un modal que solo enseña la parada) | `ShipmentsEditStopViewer` | Lo que se lee no va en un modal: se enseña en su sitio ([D9](./ux-ui/rules.md#d9-modales)), y una pieza que enseña un contenido es un `Viewer`. |

## Funciones, hooks, tipos, constantes y stores

- **Funciones:** empiezan por un verbo y llevan el prefijo de origen:
  `buildOrdersEditDeadlineSummary`, `formatDate` (de la raíz). Las de utils
  lo llevan también dentro de su objeto
  (`ordersEditDeadlineUtils.buildOrdersEditDeadlineSummary`).
<!-- kit:if backend -->
  `build` arma un objeto con lo que recibe (`buildBreadcrumbs`,
  `apiErrorUtils.buildError`); `create` es solo dar
  de alta en la API (`createOrder`).
<!-- kit:else -->
  `build` arma un objeto con lo que recibe (`buildBreadcrumbs`).
<!-- kit:end -->
- **Formato de los datos:** cada tipo de dato tiene su función de la raíz, en
  `formatUtils`: `formatUtils.formatDate`, `formatDateTime`, `formatNumber` y
  `formatPercent` ([D11](./ux-ui/rules.md#d11-textos-y-formato)). Una
  feature no escribe las suyas ni formatea a mano.
- **Hooks:** `use` + prefijo + objeto + qué hacen, uno por fichero:
  `useOrdersEditDocumentsUpload`, `useOrdersTable`. Llevan la misma zona
  que los componentes a los que sirven, para que al ordenar por nombre quede
  junto todo lo de una zona: `useOrdersEditNotesCommentCreate`, como
<!-- kit:if backend -->
  `OrdersEditNotesTab`. Lo que hacen es el verbo del service (`…Create`,
<!-- kit:else -->
  `OrdersEditNotesTab`. Lo que hacen es su verbo (`…Create`,
<!-- kit:end -->
  `…Update`, `…Remove`, `…Send`) o la pieza a la que sirven (`…Form`,
  `…Table`). El de la raíz que da a una pieza del sistema de diseño sus
  textos comunes (y lo que los acompaña, como el idioma) se llama como la
  pieza y acaba en `Texts`: `use<Pieza>Texts`.
- **Props de función:** `onX` (`onSent`, `onToggleCollapsed`). **Handlers
  locales** que hacen algo más que relanzar la prop: `handleX`.
- **Tipos:** PascalCase con prefijo: `OrdersEditDeadlineSummary`,
  `OrdersEditStatusOption`.
<!-- kit:if backend -->
- **Constantes:** `SCREAMING_SNAKE_CASE` con prefijo: `ORDERS_EDIT_TABS`; en
  un service, la entidad: `ORDER_STATUS`. Las que se exportan van en
  `constants/`, en un fichero por tema ([Ficheros](#ficheros)); en un service,
  junto a su schema.
<!-- kit:else -->
- **Constantes:** `SCREAMING_SNAKE_CASE` con prefijo: `ORDERS_EDIT_TABS`; en
  el `common` de una familia o en un dominio, la entidad: `ORDER_STATUS`. Las
  que se exportan van en `constants/`, en un fichero por tema
  ([Ficheros](#ficheros)).
<!-- kit:end -->
- **Stores:** `use<Feature>Store` (`useOrdersStore`) y, en el `common` de
  una familia, `use<Entidad><Qué>Store` (`useOrderFiltersStore`). Cada acción
  lleva el nombre de su dato, aunque solo haya una: `setListPage`,
  `setAppliedFilters`.
- **Formularios:** el schema es `<feature><Qué>FormSchema`
  (`ordersEditDocumentDescriptionFormSchema`) y su tipo,
<!-- kit:if backend -->
  `<Feature><Qué>FormValues` (`OrdersEditDocumentDescriptionFormValues`). Las
  funciones que pasan del registro al formulario y del formulario a la
  petición son `build<Feature><Qué>FormValues` y `build<Feature><Qué>Request`,
  en el objeto de utils del formulario
  (`ordersEditFormUtils.buildOrdersEditFormValues`,
  `ordersEditFormUtils.buildOrdersEditRequest`).
- **Reglas de permisos:** `<feature>Permissions` (`ordersPermissions`),
  que devuelve `canX` (`canView`, `canExport`). Vive en
  `<feature>Permissions.ts`, en la raíz de la feature, junto a
  `<feature>Routes.tsx`, porque decide la ruta y los botones: no es un util ni
  va en `utils/`.
- **Columnas de una tabla:** las que solo declaran (la propiedad de la API, la
<!-- kit:else -->
  `<Feature><Qué>FormValues` (`OrdersEditDocumentDescriptionFormValues`). Las
  funciones que pasan del registro al formulario y del formulario a lo que se
  guarda son `build<Feature><Qué>FormValues` y `build<Feature><Qué>Changes`,
  en el objeto de utils del formulario
  (`ordersEditFormUtils.buildOrdersEditFormValues`,
  `ordersEditFormUtils.buildOrdersEditChanges`).
- **Columnas de una tabla:** las que solo declaran (la propiedad del dato, la
<!-- kit:end -->
  clave de su texto, el grupo del CSV y cuáles vienen marcadas) van en
  `constants/<feature>Columns.ts` (`orders/constants/ordersColumns.ts`),
  sin test. Lo que pinta una celda o necesita el idioma está en el hook de la
  tabla (`useOrdersTable`); lo que se calcula igual para la tabla y el
<!-- kit:if backend -->
  CSV, en un objeto de utils del tema (`ordersColumnUtils`). La regla que
  decide «Gestiona» es `canManage` para los registros de la propia familia y
  `canManage<Entidad>` para los de otra (`canManageOrder`, en los pedidos de
  un envío).
<!-- kit:else -->
  CSV, en un objeto de utils del tema (`ordersColumnUtils`).
<!-- kit:end -->

| Mal | Bien | Por qué |
|---|---|---|
| `deadlineSummary` | `buildOrdersEditDeadlineSummary` | Una función empieza por un verbo y lleva el prefijo de origen. |
<!-- kit:if backend -->
| `utils/ordersPermissions.ts` | `ordersPermissions.ts`, junto a `ordersRoutes.tsx` | La regla de permisos decide la ruta y los botones: va en la raíz de la feature, al lado de sus rutas, y no es un util. |
<!-- kit:end -->
| `utils/ordersColumns.ts` | `constants/ordersColumns.ts` | Las columnas solo declaran: son constantes, sin test. |
| `useDocumentsUpload` | `useOrdersEditDocumentsUpload` | Le faltaba el prefijo de origen. |
| `useOrdersEditOrder` | `useOrdersEdit` | «Order» va implícito en la gestión de un pedido. |
| `useOrdersEditCreateNotesComment` | `useOrdersEditNotesCommentCreate` | De lo general a lo concreto: zona, objeto y, al final, qué hace. |
| `useCalendarLabels` | `useCalendarTexts` | El hook que da los textos a una pieza del sistema de diseño lleva el nombre de la pieza y acaba en `Texts`. |
| `useStore` y `setPage` | `useOrdersStore` y `setListPage` | El store lleva la feature, y la acción, el nombre de su dato. |
| `OrdersEditDocumentDescriptionFormData` | `OrdersEditDocumentDescriptionFormValues` | El tipo de un formulario acaba en `FormValues`. |

<!-- kit:if backend -->
## Services, schemas y claves de consulta

Todo lo de `services/<entidad>/`, pieza a pieza. La entidad es el nombre del
service en camelCase (`orders`, `shipments`, `notifications`); su singular, el
de un registro (`order`, `shipment`, `notification`).

| Pieza | Regla | Ejemplos |
|---|---|---|
| Service | `<entidad>Service`, uno por entidad, en `services/<entidad>/<entidad>Service.ts` | `ordersService`, `companyService` |
| Método | `<verbo><Entidad><Zona?><Qué>`: siempre empieza por un verbo y lleva la entidad del service justo detrás, también en un catálogo de otra entidad que viva en él | `getOrdersListPage`, `closeOrder`, `getOrderAssignableUsersCatalog` |
| Catálogo | `get<Entidad><Zona?><Qué>Catalog`: en singular si son las opciones de un campo de un registro; en plural si son los registros de la propia entidad, o si es de una sola feature de lista, con su nombre | `getOrderCloseReasonsCatalog`, `getProductsCatalog`, `getInvoicesUploadTemplatesCatalog` |
| Filtro que da la API | `get<Entidades><Qué>Filter`, o `…Filters` si son varios, en plural: los de la barra de una lista | `getOrdersFilters`, `getOrdersCarriersFilter` |
| Alta | `create<Entidad>`: en singular si da de alta un registro; en plural si da de alta varios en una petición | `createShipment`, `createOrders` |
| Tipo de la respuesta | El método sin `get`, en PascalCase; si no es un `get`, con `Response` detrás | `OrdersListPage`, `UpdateOrderDetailResponse` |
| Schema de la respuesta | El tipo en camelCase, con `Schema` detrás | `ordersListPageSchema`, `orderCloseReasonsCatalogSchema` |
| Tipo del cuerpo | El método sin `get`, en PascalCase, con `Request` detrás; el cuerpo común de una página es `PageRequest`, y si es la misma entidad que se recibió, su tipo | `CloseOrderRequest`, `ExportOrdersListCsvRequest` |
| Schema del cuerpo | El tipo en camelCase, con `Schema` detrás; solo si alguien lo lee | `closeOrderRequestSchema` |
| Enumerado de la API | `<ENTIDAD>_<QUÉ>`, un objeto `as const` con nombres de la app; su schema y su tipo, como la pieza | `ORDER_STATUS`, `orderStatusSchema`, `OrderStatus` |
| Códigos de error | `<ENTIDAD>_ERROR_CODE`, con una clave en camelCase por código que trata la app | `ORDER_ERROR_CODE.carrierMandatoryOnClose` |
| Fichero de schemas | `<entidad><Zona>Schema.ts`, por la zona de sus métodos; sin zona, `<entidad>Schema.ts`, lo que comparten las zonas (enumerados y códigos de error) | `ordersListSchema.ts`, `ordersCatalogSchema.ts`, `ordersSchema.ts` |

- **Singular o plural.** La entidad va en singular cuando el método trata un
  solo registro: su gestión (`getOrderDetail`, `uploadOrderEditDocument`),
  una acción sobre él (`closeOrder`, `cancelOrder`, `markNotificationRead`) o
  las opciones de uno de sus campos (`getOrderCloseReasonsCatalog`). Va en
  plural cuando trata varios: una página, un análisis, un filtro de la barra,
  un CSV, una acción sobre todos o el catálogo de los registros de la propia
  entidad (`getOrdersListPage`, `getOrdersStatus`, `exportOrdersListCsv`,
  `markNotificationsRead`, `getOrdersByCustomer`, `getWarehousesCatalog`).
- **La zona.** Un método que solo usa una feature lleva su pantalla detrás de
  la entidad (`getOrdersDashboardStatusByMonth`, `getOrderEditHistory`),
  aunque otra enseñe algo parecido. El índice de una familia no tiene
  pantalla en su nombre, así que lo suyo no lleva zona y el qué lo dice todo
  (`getOrdersListPage`, una página de la lista). Uno que usan
  varias no lleva ninguna (`getOrdersFilters`; `getOrdersStatus` y
  `getOrdersDeadlines`, que piden el análisis y la portada;
  `getOrderTypesCatalog`; `searchCustomers`).
- **Un catálogo de otra entidad** sin service propio vive en el de la familia
  que lo usó primero, lleva la entidad de ese service, como todos sus
  métodos, y las demás lo piden de ahí con la misma clave: las personas
  asignables y los transportistas están en `ordersService`
  (`getOrderAssignableUsersCatalog`, `getOrderCarriersCatalog`), y los usan
  también el tablero de incidencias y los envíos.
- **`Catalog`** solo lo lleva una lista de opciones de un selector
  (`…/select`). Lo que se pide una vez y no caduca, pero no es una lista de
  opciones (los filtros de la barra, las columnas del listado,
  `getCompanyConfig`), no lo lleva.
- **Las palabras de la app,** no las de la ruta:
  `GET /purchaseCloseReason/select` es `getOrderCloseReasonsCatalog`, y
  `GET /logisticsProviders/select`, `getOrderCarriersCatalog`.
- **JSDoc:** la primera línea es el endpoint ([JSDoc](#jsdoc)).

| Mal | Bien | Por qué |
|---|---|---|
| `getAssignableUsersCatalog` | `getOrderAssignableUsersCatalog` | Vive en `ordersService`: lleva su entidad detrás del verbo, aunque las personas sean de otra. |
| `getOrderListPage` | `getOrdersListPage` | Una página trata varios pedidos: plural. |
| `getOrdersCloseReasonsCatalog` | `getOrderCloseReasonsCatalog` | Un catálogo son las opciones de un campo de un pedido: singular. |
| `getPurchaseRequestCarriersCatalog` | `getOrderCarriersCatalog` | Las palabras de la app, no las de la ruta. |
| `markAllNotificationsRead` | `markNotificationsRead` | La entidad, justo detrás del verbo; el plural ya dice que son todas. |
| `getUserWarehousesCatalog` | `getWarehousesCatalog` | La entidad, justo detrás del verbo; de quién son lo dice el JSDoc. |
| `getCustomerRelatedOrders` | `getOrdersByCustomer` | La entidad, justo detrás del verbo, y en plural: son varios pedidos. |
| `getOrdersDashboardProductStats` | `getProductsOrdersDashboardStats` | Vive en `productsService`: su entidad, justo detrás del verbo, y después la zona, la pantalla que lo pide, aunque sea de otra familia. |

| Método | Endpoint |
|---|---|
| `getOrderDetail` | `GET /order/detail/{id}` |
| `updateOrderDetail` | `PUT /order/detail/{id}` |
| `closeOrder` | `PUT /order/close/{id}` |
| `getOrdersFilters` | `GET /order/filters` |
| `getOrdersStatus` | `POST /order/dashboard/status` |
| `getOrdersListPage` | `POST /order/list` |
| `exportOrdersListCsv` | `POST /order/exportCsv` |
| `getOrderCloseReasonsCatalog` | `GET /purchaseCloseReason/select` |
| `getOrderAssignableUsersCatalog` | `GET /users/select` |
| `getProductsOrdersDashboardStats` | `POST /products/byOrder` |

La tabla completa de cada feature está en su documento de
[features](./features/README.md). Lo que comparten varias entidades
(`selectItemSchema`, `pageRequestSchema` y `PageRequest`) va en
`src/schemas/commonSchema.ts`, que nace con el primero que se comparte. El
cuerpo de una página (`PageRequest`) es:

```ts
{ page, pageSize, orderByField, orderDirection, search, ...filtros }
```

<!-- kit:if i18n -->
- **Claves de consulta:** `[service, método, ...parámetros]`, por ejemplo
  `['ordersService', 'getOrderDetail', id]`. Si la API traduce lo que
  devuelve (los filtros, los catálogos), el idioma va en la clave
  (`['ordersService', 'getOrdersFilters', idioma]`), y en una lista con
  página, el cuerpo (`['invoicesService', 'getInvoicesUploadLinesPage', id,
  cuerpo]`). Dos features que piden lo mismo usan la misma clave y comparten
  la caché: `ordersEdit` y el cierre de `orders` con `getOrderDetail`. El
  hook que la usa: [Añadir un servicio](./guides/add-a-service.md).
<!-- kit:else -->
- **Claves de consulta:** `[service, método, ...parámetros]`, por ejemplo
  `['ordersService', 'getOrderDetail', id]`, y en una lista con página, el
  cuerpo (`['invoicesService', 'getInvoicesUploadLinesPage', id, cuerpo]`).
  Dos features que piden lo mismo usan la misma clave y comparten la caché:
  `ordersEdit` y el cierre de `orders` con `getOrderDetail`. El hook que
  la usa: [Añadir un servicio](./guides/add-a-service.md).
<!-- kit:end -->

<!-- kit:if mocks -->
## Mocks

Los mocks imitan la API para trabajar sin backend. Cada service tiene los
suyos en un JSON a su lado, sin carpeta, con la respuesta de cada endpoint
que usa la app:

```text
services/orders/
    ordersService.ts
    ordersFiltersSchema.ts
    ordersEditSchema.ts
    ordersMocks.json        "GET /order/filters", "POST /order/search", "GET /order/detail/:id"…
    ordersEditMocks.json    si el de la entidad crece, los de una zona, aparte
```

| Pieza | Nombre | Ejemplos |
|---|---|---|
| Los mocks de un service | `<entidad>Mocks.json`, al lado de su service | `ordersMocks.json`, `notificationsMocks.json` |
| Los de una zona, si los del service crecen | `<entidad><Zona>Mocks.json`, como los schemas | `ordersEditMocks.json` |
| Una respuesta | Su clave es `"<MÉTODO> /ruta"`, como la pide el service, con `:` en lo variable; una ruta concreta gana a la de su `:param` | `"GET /order/filters"`, `"GET /order/detail/:id"`, `"GET /order/detail/1287"` |

- **El JSON no lleva test:** lo valida el test del schema de su método, que
  lo lee como la respuesta real.
- **Los ids que se cruzan entre services casan:** los mocks son un solo
  mundo ([Añadir un servicio](./guides/add-a-service.md#4-el-mock)).

| Mal | Bien | Por qué |
|---|---|---|
| `services/orders/mocks/ordersFilters.json` | La clave `"GET /order/filters"` de `ordersMocks.json` | Los mocks de un service van en su JSON, sin carpeta. |
| `"GET /order/detail/{id}"` | `"GET /order/detail/:id"` | Lo variable va con `:`, como en las rutas de la app. |
| `ordersMock.json` | `ordersMocks.json` | Reúne las respuestas de varios endpoints. |

<!-- kit:end -->
## El transporte

El transporte es lo único que habla con la API. Son utils de la raíz, en
`src/utils/`, un objeto por tema como cualquier util, y los únicos que no
son funciones puras:

| Objeto | Qué reúne |
|---|---|
| `apiUtils` | Las tres llamadas: `request`, `upload` y `download`, cada una con su petición a la API real, privada (`callServer`, `uploadServer`) |
| `apiErrorUtils` | El fallo de una llamada: `buildError`, `isApiError`, `readErrorCode`, `isNotFound` y `getRequestFailure` |
| `apiSessionUtils` | La conexión con la sesión: `connect`, `getToken` y `endOnError` |
<!-- kit:if mocks -->
| `apiMockUtils` | Las gemelas de las llamadas con los `*Mocks.json`: `respond`, `upload` y `download`. Solo lo carga `apiUtils`, con `VITE_USE_MOCKS=true` |
<!-- kit:end -->

Sus tipos (`ApiMethod`, `ApiError`, `RequestFailure`, `ApiSession` y
`UploadOptions`) están en `src/types/api.ts`.

| Mal | Bien | Por qué |
|---|---|---|
| `apiUtils.fetchApi` | `apiUtils.request` | El objeto ya dice `api`, y `fetch` es la función del navegador. |
| `new ApiError(404)` | `apiErrorUtils.buildError(404)` | El fallo es un tipo, no una clase: se arma con su util. |
| `error instanceof ApiError` | `apiErrorUtils.isApiError(error)` | Y se reconoce con su util. |
| `src/api/apiCalls.ts` | `src/utils/apiUtils.ts` | El transporte va en `utils/`, sin carpeta propia. |

<!-- kit:end -->
## Textos (i18n)

- **Namespace:** el nombre de la feature (`ordersEdit:`), de la familia para
  las piezas de su `common` (`orders:`, `invoices:`, `shipments:`) o del
  dominio (`products:`, `warehouses:`, `customers:`, que es también el de su
  familia, porque no tiene `common`). Las piezas de la raíz usan `common:` con
  su propio bloque (`common:filters.*`, `common:pagination.*`); `common:` es
  solo de la raíz.
- **Un namespace, varias carpetas:** el índice de una familia se llama como
  ella, así que comparte el namespace con su `common` (`orders:`) o con el
  dominio que se llama como ella (`customers:`). Sus catálogos se suman, y
  ninguna clave se repite entre ellos: lo vigila la comprobación de la
  estructura. Lo del índice va en su zona (`orders:table.*`); lo compartido,
  en la del tema (`orders:filters.*`).
- **Claves:** en camelCase y agrupadas por zona (`data`, `documents`,
  `table`). Una feature de una sola zona cuelga sus claves de la raíz.
- **Dentro de una zona:**
  - `title` es el título;
  - `info` es el texto del icono de información;
  - `subtitle` solo lleva datos (un recuento, la última actualización).
- **Un número que concuerda va en `count`,** con sus dos formas, `_one` y
  `_other`: `subtitle_one` («{{count}} pedido») y `subtitle_other`
  («{{count}} pedidos»), que i18next elige solas
  ([D11](./ux-ui/rules.md#d11-textos-y-formato)). Nunca `{{value}}` para un
  número que concuerda; `{{value}}` queda para un valor ya formateado que no
  concuerda con nada («{{value}} a tiempo», con «65 %»).
- **Una tabla con cabecera propia:** `table.{title, info, columns, emptyTitle,
  emptyDescription, noResultsTitle, noResultsDescription, noMatchesTitle}`:
  «Todavía no hay ningún …», «Ningún … con estos filtros» y, si solo la acota
  la búsqueda, «Ningún … coincide con la búsqueda». El texto de información
  de un listado es, por tanto, `orders:table.info`.
- **Un aviso o un estado vacío:** `title` y `description`, nunca `message`.
- **Un modal:** un bloque con el nombre de su acción, `<acción>.{title, body,
  confirm, failure}`, más `action` si el botón que lo abre también es suyo, y
  `titleNamed` si también se abre desde una fila, con el número del registro
  («¿Quieres cancelar el pedido #{{id}}?»).
- **`failure` y `errors`:** `failure` es una acción que ha fallado y `errors`,
  una validación o una carga. `failure` es el título del aviso («No se ha
  podido cancelar el pedido», sin punto); su descripción es una de
<!-- kit:if backend -->
  `common:failure` o, si la API manda un código conocido, una clave propia que
  empieza por `failure` (`failureOutOfStock`).
<!-- kit:else -->
  `common:failure`.
<!-- kit:end -->
- **Menú:** sus etiquetas son `common:nav.*` y no se reutilizan como títulos de
  página. La clave
  de un grupo es el nombre de su familia, en `common:navGroups`
  (`common:navGroups.orders`, «Pedidos»), y la de cada entrada, el nombre de
  su feature: `common:nav.orders` («Gestión de pedidos»),
  `common:nav.ordersNew` («Añadir pedido»), `common:nav.ordersDashboard`
  («Análisis de pedidos»). Las claves del menú sirven también de miga de pan.
- **El vocabulario de una pieza compartida sube con ella:** al namespace de su
  familia si la pieza es del `common` de una familia (`orders:filters.*`, los
  textos de `OrderFiltersHeader`), y a `common:` si es de la raíz (los botones
  de la barra de filtros, la paginación). El contenido de una feature se queda
  en su namespace.

Así quedan las claves del `common` de la familia, de `orders` y de
`ordersEdit`:

```text
orders:
    status.{pending, shipped, delivered, cancelled}   «Pendiente», de OrderStatusBadge y del filtro Estado
    filters.subtitle                                 «{{count}} pedidos», de OrderFiltersHeader
<!-- kit:if backend -->
    filters.names.<filtro>                           «Estado»: el nombre de cada filtro, por su nombre en la API
<!-- kit:else -->
    filters.names.<filtro>                           «Estado»: el nombre de cada filtro
<!-- kit:end -->
    filters.all.<filtro>                             «Todos los estados»: el resumen sin nada elegido
    close.{title, titleNamed, confirm, failure, done, doneNamed}  «¿Quieres cerrar el pedido?», de OrderCloseModal
    cancel.{title, titleNamed, keep, confirm, failure, done, doneNamed}  «¿Quieres cancelar el pedido?», de OrderCancelModal
orders:
    title, create                                    «Gestión de pedidos», «Crea un pedido»
    search.{label, placeholder}                      «Busca pedidos», «Busca por número o cliente»
    table.{title, info, id, manage, manageAria, emptyTitle, noResultsTitle, noMatchesTitle}  «Gestiona», «Gestiona el pedido #{{id}}»
    columns.<field>                                  «Cliente»: cada columna, de la tabla y del CSV
ordersEdit:
    title                                            «Gestiona el pedido #{{id}}», el título
    breadcrumb                                       «Pedido #{{id}}», la miga y la pestaña del navegador
    documents.table.{title, info, …}
    reopen.{title, confirm, failure}                 «¿Quieres reabrir el pedido?»
```

**Las claves de `common:`** son las de la raíz, cada una en el bloque de su
pieza o de su tema:

- **Lo que repite toda la app** va una sola vez, en `common:`, y una feature no
  lo copia en su namespace: las acciones (`common:actions.save`, «Guarda»;
  `common:actions.cancel`, `common:actions.remove`), la descripción de un
<!-- kit:if backend -->
  fallo (`common:failure.network`, `common:failure.generic`), los errores de
<!-- kit:else -->
  fallo (`common:failure.generic`), los errores de
<!-- kit:end -->
  validación (`common:formErrors.required`, `common:formErrors.max`) y el
  aviso de cambios sin guardar (`common:unsavedChanges.*`).
- **Los textos de las piezas del sistema de diseño** salen de `common:fields`
  ([D1](./ux-ui/rules.md#d1-el-sistema-de-diseño-primero)).
- **El marco y las páginas genéricas:** el menú (`common:nav.*`), la pestaña
  del navegador (`common:documentTitle`, «{{title}} - %%APP_NAME%%»), la
<!-- kit:if backend -->
  página que no existe, la que no se puede ver y el error
  (`common:errorPages.*`).
<!-- kit:else -->
  página que no existe y el error (`common:errorPages.*`).
<!-- kit:end -->
- **Una clave nueva de `common:`** se crea solo si la usa una pieza de la raíz
  o la repiten varias features igual.

## JSDoc

Toda función que no es componente lleva un JSDoc corto, siempre con la misma
forma:

- **Qué hace:** 1 o 2 líneas, sin contar cómo funciona por dentro.
- **`@param`:** uno por parámetro, en una línea.
- **`@returns`:** si devuelve algo, en una línea. Los casos especiales (`null`,
  `''`) van aquí.
<!-- kit:if backend -->
- **`@throws`:** si lanza, con el código de la API, en una línea.
<!-- kit:else -->
- **`@throws`:** si lanza, en una línea.
<!-- kit:end -->

El bloque ocupa de 6 a 8 líneas como máximo. Si no cabe, la función hace
demasiado o su nombre no es claro.

<!-- kit:if backend -->
- **En los services**, la descripción empieza por el endpoint.
<!-- kit:end -->
- **No llevan JSDoc** las funciones internas de un hook o de un componente, ni
  los objetos sin comportamiento (schemas, configuración, constantes), que
  tampoco llevan otro comentario: su nombre dice lo que son.
- **Idioma:** castellano, y sin referencias a otros proyectos.

<!-- kit:if backend -->
Un método de un service:

```ts
/**
 * GET /order/detail/{id}. Pide un pedido completo.
 * @param id Id del pedido.
 * @returns El pedido con sus líneas, su cliente, sus documentos y su plazo.
 * @throws {ApiError} 404 si el pedido no existe.
 */
getOrderDetail: (id: number) => apiUtils.request('GET', `/order/detail/${id}`, orderDetailSchema),
```

Las funciones de un objeto de utils, sueltas y reunidas al final:

```ts
/**
 * Dice si un pedido se puede cerrar: está enviado y tiene transportista.
 * @param order El pedido, como lo da `getOrderDetail`.
 * @returns `true` si se puede cerrar.
 */
function isOrderClosable (order: OrderDetail): boolean { … }

/**
 * Arma el cuerpo con el que se cierra un pedido.
 * @param values Los valores del formulario de cierre.
 * @returns El cuerpo de `closeOrder`; el comentario, `null` si queda vacío.
 */
function buildOrderCloseRequest (values: OrderCloseFormValues): CloseOrderRequest { … }

export const orderCloseUtils = {
  isOrderClosable,
  buildOrderCloseRequest,
}
```
<!-- kit:else -->
Las funciones de un objeto de utils, sueltas y reunidas al final:

```ts
/**
 * Dice si un pedido se puede cerrar: está enviado y tiene transportista.
 * @param order El pedido.
 * @returns `true` si se puede cerrar.
 */
function isOrderClosable (order: Order): boolean { … }

/**
 * Arma los valores con los que empieza el formulario de cierre de un pedido.
 * @param order El pedido.
 * @returns Los valores del formulario; el comentario, vacío.
 */
function buildOrderCloseFormValues (order: Order): OrderCloseFormValues { … }

export const orderCloseUtils = {
  isOrderClosable,
  buildOrderCloseFormValues,
}
```
<!-- kit:end -->

## Revisar los nombres

Lo que mira `zaius-rename` para alinear los nombres del proyecto con esta
página, y cómo se mueve cada cosa en esta app sin romper nada.

**Qué se mira,** en este orden:

1. **Las features:** su nombre es su URL (`/orders` es `orders`,
   `/orders/:id/edit` es `ordersEdit`), y su carpeta, ese nombre
   ([Familias y features](#familias-y-features)).
2. **Cada fichero y lo que exporta:** el prefijo de origen (la feature, la
   entidad del `common` o del dominio, o ninguno en la raíz), el tipo final de
   un componente y el fichero, que se llama como lo que exporta
   ([Prefijo de origen](#prefijo-de-origen), [Componentes](#componentes) y
   [Ficheros](#ficheros)).
<!-- kit:if backend -->
3. **Hooks, stores, utils, constantes, schemas, services y sus métodos, y las
   claves de consulta**
   ([Funciones, hooks, tipos, constantes y stores](#funciones-hooks-tipos-constantes-y-stores)
   y [Services, schemas y claves de consulta](#services-schemas-y-claves-de-consulta)).
<!-- kit:else -->
3. **Hooks, stores, utils, constantes y schemas**
   ([Funciones, hooks, tipos, constantes y stores](#funciones-hooks-tipos-constantes-y-stores)).
<!-- kit:end -->
4. **Los textos:** el namespace de cada carpeta y las claves del menú
   ([Textos (i18n)](#textos-i18n)).
5. **Los tests,** que se llaman como su fichero.

**Cómo se mueve cada cosa:**

<!-- kit:if git -->
- **Con `git mv`,** la carpeta de la feature y cada fichero, para conservar
  su historia; y con ellos, lo que exporta cada fichero y cada import que lo
  usa, en todo `src/`, también en los tests.
<!-- kit:else -->
- **La carpeta de la feature y cada fichero,** y con ellos, lo que exporta
  cada fichero y cada import que lo usa, en todo `src/`, también en los
  tests.
<!-- kit:end -->
- **Las rutas:** su `<feature>Routes.tsx` y su import en
<!-- kit:if backend -->
  `router/appRoutes.tsx` o, las de la entrada, en `router/rootRoutes.tsx`; y
  su entrada en el menú, en `router/navigation.config.ts`.
<!-- kit:else -->
  `router/appRoutes.tsx`; y su entrada en el menú, en
  `router/navigation.config.ts`.
<!-- kit:end -->
- **Los textos:** el namespace es la carpeta, así que cada `t()` de la
  feature cambia de namespace; y las claves del menú (`common:nav.*`), en
  cada idioma.
- **Sus documentos:** el de la pantalla, en `docs/features/<familia>/`, su
  fila en el índice de [Features](./features/README.md#índice) y las
  historias de `docs/specs/` que la citan.

**Con cuidado:**

- **Una URL no se renombra nunca sin el OK de la persona:** rompe los enlaces
  que la gente ha guardado. Si una URL no cumple su regla, se decide con ella
  y es su propio bloque.
- **Un store que se guarda en `sessionStorage`:** su nombre es la clave con
  la que se guarda, así que al cambiarlo, quien tenga la app abierta pierde
  una vez sus filtros, su página y su orden. Se avisa en la tabla.
