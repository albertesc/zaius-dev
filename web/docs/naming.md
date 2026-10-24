# Nomenclatura

La nomenclatura es lo más importante de %%APP_NAME%%. Cada nombre dice qué hace
la pieza y de dónde sale, aunque salga largo: al leer
`HomeRoomsSection.astro` se sabe que es un componente, que es de la portada y
que es la sección de las habitaciones, sin abrir el fichero.

Cada nombre sale de una regla de esta página. Si una pieza no encaja en
ninguna, se escribe la regla aquí, con su «mal y bien», y se renombra lo que no
la cumple.

**En esta página:**

- [Páginas y rutas](#páginas-y-rutas) · [Ficheros](#ficheros) · [Prefijo de origen](#prefijo-de-origen)
<!-- kit:if server -->
- [Componentes](#componentes) · [Funciones, tipos y constantes](#funciones-tipos-y-constantes) · [Actions y endpoints](#actions-y-endpoints)
<!-- kit:else -->
- [Componentes](#componentes) · [Funciones, tipos y constantes](#funciones-tipos-y-constantes)
<!-- kit:end -->
<!-- kit:if backend -->
- [Services, schemas y caché](#services-schemas-y-caché) · [Mocks](#mocks) · [El transporte](#el-transporte)
<!-- kit:end -->
<!-- kit:if i18n -->
- [Textos (i18n)](#textos-i18n) · [JSDoc](#jsdoc)
<!-- kit:else -->
- [Textos](#textos) · [JSDoc](#jsdoc)
<!-- kit:end -->
- [Revisar los nombres](#revisar-los-nombres)

## Páginas y rutas

- **P1. Sección.** Un grupo de páginas con una URL base común. Se llama como
  esa URL, en camelCase: `blog` (`/blog`), `legal` (`/legal`),
  `account` (`/account`). Su carpeta es la de su URL (`src/pages/legal/`).
- **P2. El fichero de una página es su URL.** `src/pages/` repite la URL,
  segmento a segmento, en inglés y en kebab-case; un parámetro va entre
  corchetes, en camelCase (`[id]`, `[...slug]`):

  | URL | Fichero | Prefijo | Nombre |
  |---|---|---|---|
  | `/` | `src/pages/index.astro` | `home` | HOME |
  | `/rooms` | `src/pages/rooms.astro` | `rooms` | ROOMS |
  | `/contact` | `src/pages/contact.astro` | `contact` | CONTACT |
  | `/legal/notice` | `src/pages/legal/notice.astro` | `legalNotice` | LEGAL-NOTICE |
<!-- kit:if content -->
  | `/blog` | `src/pages/blog/index.astro` | `blog` | BLOG |
  | `/blog/autumn-routes` | `src/pages/blog/[...slug].astro` | `blogPost` | BLOG-POST |
<!-- kit:end -->
<!-- kit:if privateArea -->
  | `/account/bookings` | `src/pages/account/bookings/index.astro` | `accountBookings` | ACCOUNT-BOOKINGS |
  | `/account/bookings/1287/edit` | `src/pages/account/bookings/[id]/edit.astro` | `accountBookingsEdit` | ACCOUNT-BOOKINGS-EDIT |
<!-- kit:end -->

  Una página no se llama como lo que exporta, como los demás ficheros: se
  llama como su URL ([Ficheros](#ficheros)). Una página sin páginas debajo es
  un fichero (`rooms.astro`); con páginas debajo, una carpeta con su
  `index.astro`.
- **P3. El prefijo de una página es su URL** en camelCase, segmento a
  segmento, sin los parámetros. No hay un tipo de página obligatorio: el
  nombre dice dónde está la página, no qué es.
  - la portada (`/`) es `home`, y el índice de una sección se llama como
    ella: `blog` (`/blog`);
  - los demás segmentos van detrás, en PascalCase, juntando los guiones:
    `legalNotice` (`/legal/notice`), `roomsFamilyStays`
    (`/rooms/family-stays`);
  - una página que enseña una entrada (un parámetro al final, sin `edit`)
    lleva lo que enseña: `/blog/[...slug]` es `blogPost`;
<!-- kit:if privateArea -->
  - `[id]/edit` es `Edit`, la gestión de un registro, su única página, donde
    se ve y se edita: `accountBookingsEdit` (`/account/bookings/[id]/edit`).
    `/account/bookings/[id]` no es una ruta.
<!-- kit:end -->

<!-- kit:if i18n -->
  El prefijo es el de todo lo que solo usa esa página, y da el grupo de sus
  textos: `legalNotice`, `legal.notice.*` ([Textos (i18n)](#textos-i18n)).
<!-- kit:else -->
  El prefijo es el de todo lo que solo usa esa página.
<!-- kit:end -->
- **P4. El nombre de una página,** en el backlog y en su documento, es su
  prefijo en mayúsculas, con un guion entre palabras: `legalNotice` es
  LEGAL-NOTICE, y su documento, `docs/pages/LEGAL-NOTICE.md`
  ([Páginas](./pages/README.md#el-nombre-y-el-fichero)).
<!-- kit:if server -->
- **P5. No son páginas** las pestañas, los paneles y los modales, que son
  componentes de la página que los tiene, ni las páginas de error
  (`404.astro` y `500.astro`).
<!-- kit:else -->
- **P5. No son páginas** las pestañas, los paneles y los modales, que son
  componentes de la página que los tiene, ni la página de error
  (`404.astro`).
<!-- kit:end -->
- **P6. Donde se importa una página** (en su test), se llama con su prefijo y
  `Page`: `import RoomsPage from '@/pages/rooms.astro'`.

El listado de las páginas, con su URL y su estado, está en el
[backlog](./backlog.md), y cada una tiene su documento en
[Páginas](./pages/README.md). Estas piezas no son una página y ya tienen
nombre:

| Pieza | Dónde va | Nombre |
|---|---|---|
| Las fotos de una habitación | En su tarjeta, en ROOMS | `RoomPhotosGallery.astro` |
<!-- kit:if privateArea -->
| Los huéspedes de una reserva | Pestaña de `accountBookingsEdit` | `AccountBookingsEditGuestsTab.astro` |
| Sin permisos | Aviso dentro del marco, que pinta la propia página | No hay página `/403` |
<!-- kit:end -->
<!-- kit:if server -->
| La página que no existe y el error inesperado | `src/pages/404.astro` y `src/pages/500.astro`, con el marco | No son páginas del backlog (P5) |
<!-- kit:else -->
| La página que no existe | `src/pages/404.astro`, con el marco | No es una página del backlog (P5) |
<!-- kit:end -->

## Ficheros

- **Los ficheros y las carpetas se nombran en inglés**, también los documentos,
  las guías, las propuestas y las skills (`docs/standards.md`,
  `docs/guides/create-a-page.md`,
  `docs/ux-ui/proposals/2026-11-03-header-menu.md`,
  `.claude/skills/zaius-page/`), aunque su contenido vaya en castellano. Así
  el contenido puede pasar a otro idioma sin romper enlaces ni órdenes. Los
  documentos y las skills van en kebab-case; los de las páginas, con su
  nombre (`docs/pages/ROOMS.md`); el código, con las reglas de abajo.
- **El fichero se llama como lo que exporta**: `RoomCard.astro` es el
  componente `RoomCard`, y se importa con ese nombre; `roomPriceUtils.ts`
  exporta `roomPriceUtils`.
<!-- kit:if server -->
  Solo se libran las páginas, que se llaman como su URL
  ([Páginas y rutas](#páginas-y-rutas)), y los nombres que pide Astro
  (`index.astro`, `src/actions/index.ts`, `src/middleware.ts`).
<!-- kit:else -->
  Solo se libran las páginas, que se llaman como su URL
  ([Páginas y rutas](#páginas-y-rutas)), y los nombres que pide Astro
  (`index.astro`).
<!-- kit:end -->
<!-- kit:if server -->
- **Un fichero que agrupa varias piezas del mismo tipo** se llama
  `<prefijo><Zona><Tipo>`: `contactFormSchema.ts` (los schemas del
  formulario de contacto)
<!-- kit:if backend -->
  o `bookingsAvailabilitySchema.ts` (las respuestas de la disponibilidad).
<!-- kit:else -->
  o, si un día hay una tabla, `<prefijo>Columns.ts` (sus columnas).
<!-- kit:end -->
<!-- kit:else -->
- **Un fichero que agrupa varias piezas del mismo tipo** se llama
  `<prefijo><Zona><Tipo>`: `roomsFilterOptions.ts`, las opciones con las que
  se filtran las habitaciones.
<!-- kit:end -->
- **Un fichero de utils es un objeto con las funciones de un tema:**
  `utils/dateUtils.ts` exporta `dateUtils`, con `getUtcDayMs`,
  `readUtcDay` y `getToday`, y se usa con el objeto delante:
  `dateUtils.getToday()`, `formatUtils.formatDate(value)`. El objeto es lo
  único que exporta el fichero, y el fichero se llama como él.
  - **El nombre** es `<prefijo><Tema>Utils`, con el prefijo de origen
    ([Prefijo de origen](#prefijo-de-origen)): si es de toda la web, ninguno
    (`formatUtils`); si lo usan varias páginas, la entidad en singular
    (`roomPriceUtils`, `roomFilterUtils`); si es de una página, su prefijo
    (`homeHighlightUtils`). Un tema nuevo es un objeto nuevo, y uno que pasa
    de ~150 líneas se parte en dos temas.
  - **Por dentro,** cada función se declara suelta, con su JSDoc, y el objeto
    del final las reúne. Lo que no está en el objeto es privado: un ayudante
    que solo usan las funciones del tema (`getSeasonPrice`, en
    `roomPriceUtils`), y las constantes y los tipos que solo usan ellas.

    ```ts
    /**
     * Da el día de hoy, en la zona horaria de la máquina que pinta.
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
    aunque repitan el tema (`formatUtils.formatDate`,
    `roomPriceUtils.buildRoomStayPrice`): así se encuentran buscando su
    nombre.
  - **Van sueltos en `src/utils/`,** sin carpetas de tema:
    `src/utils/formatUtils.ts`, `src/utils/roomPriceUtils.ts`.
  - **Un test por objeto,** al lado (`dateUtils.test.ts`), con un `describe`
    por función pública; las privadas se prueban a través de ellas.
  - **Las constantes que se exportan** van a `src/constants/`, agrupadas por
    tema y sin test, porque solo declaran: `constants/rooms.ts`, con
    `ROOMS`. **Los tipos que usan otros ficheros** van a `src/types/`:
    `types/room.ts`, con `Room`; `types/navigation.ts`, con `NavEntry`.
  - **Lo mira la comprobación de la estructura**
    ([Normativa](./standards.md#comprobar-la-estructura)): cada fichero de
    `utils/` exporta un solo objeto, que se llama como el fichero y acaba en
    `Utils`.
<!-- kit:if backend -->
  - **El transporte también son utils,** aunque hable con la red: `apiUtils`
    y `apiErrorUtils`, en `src/utils/`
    ([El transporte](#el-transporte)). Es la única excepción a que un util
    sea una función pura.
<!-- kit:end -->
<!-- kit:if content -->
- **La configuración** es la de cada herramienta, con su nombre:
  `astro.config.ts`, `vitest.config.ts`, `content.config.ts`. Lo que declara
  la web (el menú, las habitaciones) son constantes.
<!-- kit:else -->
- **La configuración** es la de cada herramienta, con su nombre:
  `astro.config.ts`, `vitest.config.ts`. Lo que declara la web (el menú, las
  habitaciones) son constantes.
<!-- kit:end -->
- **Los tests** van al lado, con el mismo nombre y `.test.ts`:
  `RoomCard.test.ts` (de `RoomCard.astro`), `roomPriceUtils.test.ts`. Lo de
  `src/pages/` tiene su test en `src/tests/pages/`, con la misma ruta:
  `src/tests/pages/rooms.test.ts`, `src/tests/pages/legal/notice.test.ts`.
<!-- kit:if i18n -->
- **Los textos** van en `src/i18n/<idioma>.json`, uno por idioma (%%LANGUAGES%%).
<!-- kit:end -->
<!-- kit:if content -->
- **Las colecciones de contenido** llevan el prefijo de quién las usa, y su
  carpeta se llama igual: `blogPosts`, en `src/content/blogPosts/`. Cada
  entrada, en inglés y en kebab-case, es el final de su URL:
  `autumn-routes.md` es `/blog/autumn-routes`.
<!-- kit:end -->
<!-- kit:if backend -->
- **Los mocks de un service** van en un JSON a su lado, sin carpeta:
  `services/bookings/bookingsMocks.json` ([Mocks](#mocks)).
<!-- kit:end -->
- **Las imágenes** van en `src/assets/`, con el prefijo de su página y lo que
  enseñan: `homeHeader.jpg`, `roomsEncina1.jpg`. Las que se sirven tal cual,
  en `public/`: `public/share/rooms.png`, la imagen para compartir de ROOMS.
- **No hay carpetas de zona:** `components/` es plano, y la zona va en el
  nombre, que junta lo suyo al ordenar: `HomeHeader.astro`,
  `HomeRoomsSection.astro`, `HomeAreaSection.astro`.

Todas las carpetas, con lo que va en cada una, están en
[Normativa](./standards.md#organización-de-src).

Los objetos de `src/utils/`, uno por tema; cada uno nuevo se apunta aquí:

<!-- kit:if backend -->
| Objeto | Qué reúne | Funciones |
|---|---|---|
| `apiUtils` | Las llamadas a la API ([El transporte](#el-transporte)) | `request`, `upload`, `download` |
| `apiErrorUtils` | El fallo de una llamada a la API | `buildError`, `isApiError`, `readErrorCode`, `isNotFound`, `getRequestFailure` |
<!-- kit:if privateArea -->
| `apiSessionUtils` | La sesión de cada petición, para el transporte | `run`, `getToken`, `endOnError` |
<!-- kit:end -->
| `apiMockUtils` | Las respuestas de los mocks, con los `*Mocks.json` | `respond`, `upload`, `download` |
<!-- kit:if i18n -->
| `languageUtils` | El idioma de la web | `resolveAppLanguage` |
<!-- kit:end -->
<!-- kit:else -->
<!-- kit:if i18n -->
| Objeto | Qué reúne | Funciones |
|---|---|---|
| `languageUtils` | El idioma de la web | `resolveAppLanguage` |
<!-- kit:else -->
Todavía no hay ninguno: cada uno nuevo entra en una tabla con lo que reúne y
sus funciones.
<!-- kit:end -->
<!-- kit:end -->

`formatUtils`, el formato de los datos en pantalla
([D11](./ux-ui/rules.md#d11-textos-y-formato)), nace con la primera página
que formatea un dato.

| Mal | Bien | Por qué |
|---|---|---|
| `utils/formats/formatDate.ts`, con una función | `utils/formatUtils.ts`, con `formatUtils.formatDate` | Un fichero de utils reúne en un objeto las funciones de un tema. |
| `import { formatDate } from '@/utils/formats/formatDate'` | `import { formatUtils } from '@/utils/formatUtils'` y `formatUtils.formatDate(value)` | Se importa el objeto y se usa con él delante. |
| `export function getToday ()` en un fichero de utils | `function getToday ()` y, al final, `export const dateUtils = { …, getToday }` | El fichero solo exporta su objeto. |
| `utils/dates/`, una carpeta por tema | `utils/dateUtils.ts` | Los utils van sueltos en `src/utils/`: el tema es el objeto. |
| `utils/rooms/priceUtils.ts` | `utils/roomPriceUtils.ts` | Sin carpetas: el objeto lleva el prefijo de su origen (la entidad en singular) y su tema. |
| `utils/rooms.ts`, con las habitaciones y una función | `constants/rooms.ts` y `roomPriceUtils.buildRoomStayPrice` | Lo que solo declara va a `constants/`. |
| `getSeasonPrice.ts`, un ayudante con su fichero | `getSeasonPrice`, privado en `roomPriceUtils.ts` | Un ayudante que solo usan las funciones del tema no sale del objeto. |
| `formatUtils.price` | `formatUtils.formatPrice` | El método conserva su nombre entero. |
| `src/utils/room.ts`, con el tipo de una habitación | `src/types/room.ts` | Los tipos que usan otros ficheros van a `types/`. |

## Prefijo de origen

Todo nombre empieza por el sitio del que sale. Como las carpetas son planas,
el prefijo es lo único que dice de quién es cada pieza:

| Quién la usa | Prefijo | Ejemplos |
|---|---|---|
| Una página | El de la página, de su URL | `HomeHeader`, `RoomsList`, `homeHighlightUtils` |
| Varias páginas, si es de negocio | La entidad en singular | `RoomCard`, `BlogPostCard`, `roomPriceUtils` |
| Toda la web, sin negocio | Ninguno: dice qué es | `AppHeader`, `AppFooter`, `AppLayout`, `formatUtils` |

- **Lo global se nombra por lo que es, no por dónde se usa.** Una pieza de
  toda la web no lleva el nombre de una página ni de una sección (`Home`,
  `Rooms`): la cabecera del sitio es `AppHeader`, aunque la portada la pinte
  distinta. Solo lo lleva si la pieza no tiene sentido fuera de ahí.
- **Lo de varias páginas lleva su entidad delante** (`RoomCard`,
  `BlogPostCard`): el nombre dice de qué es la pieza, y al ordenar por nombre
  queda junto todo lo de la misma entidad.
- **Las zonas de una página son de su página:** secciones, tarjetas y
  pestañas llevan su prefijo (`HomeRoomsSection`, `AreaPlacesSection`),
  aunque otra página tenga una parecida. Solo sube una zona idéntica y de
  negocio que usan varias páginas, con su entidad delante. De las demás sube
  la pieza genérica que usan por dentro (la tarjeta de contenido del sistema
  de diseño).
- **Una pieza cambia de nombre cuando cambia quién la usa.** Si la portada
  empieza a usar `RoomsCard`, la tarjeta de ROOMS, pasa a ser `RoomCard`, en
  el mismo commit.
- **No se repite lo que ya dice el prefijo.** En ROOMS, «Room» va implícito:
  `RoomsList`, no `RoomsRoomList`.
- **Los nombres largos están bien.** Lo que no vale:
  - abreviar (`HomeRmsSection` por `HomeRoomsSection`);
  - usar un nombre genérico (`data`, `items`, `handlers`, `utils`,
    `schemas.ts`, `Card.astro`) como nombre de fichero o de export: es
    `roomPriceUtils.ts`, `RoomCard.astro`;
<!-- kit:if backend -->
  - usar las palabras del backend cuando la web tiene las suyas: si la API
    llama `reservation` a la reserva, en la web sigue siendo `booking`
    (`getBookingDetail`, para `GET /reservation/{id}`).
<!-- kit:end -->

## Componentes

**Fórmula:** `<Prefijo><Zona?><Objeto><Acción?><Tipo>`, de lo general a lo
concreto. Así, al ordenar por nombre, todo lo de un mismo objeto queda junto:
`HomeRoomsSection`, `HomeAreaSection`, `HomeHeader`. Un nombre, partido en
sus piezas:

| Nombre | Prefijo | Zona | Objeto | Acción | Tipo |
|---|---|---|---|---|---|
| `HomeRoomsSection` | `Home` | - | `Rooms` | - | `Section` |
| `RoomPhotosGallery` | `Room` (entidad) | - | `Photos` | - | `Gallery` |
| `RoomsList` | `Rooms` | - | - | - | `List` |
<!-- kit:if privateArea -->
| `AccountBookingsEditGuestRemoveModal` | `AccountBookingsEdit` | - | `Guest` | `Remove` | `Modal` |
<!-- kit:end -->

**Tipos.** Cada componente termina en exactamente uno. Las páginas no son
componentes: son rutas, y no hay tipo `Page`. Añadir un tipo nuevo necesita
el OK de la persona.

| Tipo | Qué es |
|---|---|
| `Layout` | Un layout general de `src/layouts/`: `BaseLayout`, `AppLayout`. |
| `Header` | Una cabecera: la del sitio (`AppHeader`) o la portada de una página, con su título, su frase, su llamada a la acción y su imagen (`HomeHeader`). |
| `Footer` | Un pie: el del sitio (`AppFooter`). |
| `Section` | Una zona de una página, con su título: `HomeRoomsSection`. |
| `Card` | Una tarjeta: `RoomCard`, `BlogPostCard`. |
| `List` | Elementos repetidos: `RoomsList`. |
| `Gallery` | Una galería de imágenes: `RoomPhotosGallery`. |
| `Viewer` | Un visor de un contenido: un vídeo (`HomeVideoViewer`), un mapa, un PDF. |
| `Image` | Una imagen o un dibujo de la web: el logo. |
| `Menu` | Un menú: el del móvil, `AppMenu`. |
| `Bar` | Una franja: la del aviso de cookies, `CookiesBar`. |
| `Tabs` | El juego de pestañas. |
| `Tab` | El contenido de una pestaña. |
| `Form` | Un formulario. |
| `Fields` | Un grupo de campos. |
| `Field` | Un campo propio. |
| `Select` | Un selector. |
| `Search` | Un buscador. |
| `Actions` | Un grupo de botones. |
| `Badge` | Una insignia. |
| `Value` | Un valor en línea con color o icono. |
| `Modal` | Un diálogo. |
<!-- kit:if privateArea -->
| `Table` | Una tabla. |
| `Cell` | Una celda de tabla. |
| `Panel` | Una zona de trabajo con varias partes. |
| `Wizard` | Un asistente entero. |
| `Step` | Un paso de un asistente. |
<!-- kit:end -->

<!-- kit:if privateArea -->
**Verbos.** `Create` (dar de alta), `Add` (añadir a una lista), `Remove`
(quitar o borrar), `Edit`, `Cancel`, `Send` (enviar algo a alguien),
`Upload`, `Download` y `Export`. Un verbo nuevo necesita el OK de la persona.
`New` no es un verbo: solo aparece en el prefijo de una página `/new`, nunca
como la acción de un componente.
<!-- kit:else -->
**Verbos.** `Send` (enviar algo a alguien), `Add` (añadir a una lista),
`Remove` (quitar), `Edit`, `Cancel` y `Download`. Un verbo nuevo necesita el
OK de la persona.
<!-- kit:end -->

**Singular o plural.** Singular si la pieza es un elemento (`RoomCard`),
plural si son varios (`RoomsList`, `RoomPhotosGallery`). Una `List` son
siempre varios, así que va en plural, y la pieza que repite, en singular.

**Ejemplos.**

| Mal | Bien | Por qué |
|---|---|---|
| `Hero.astro` en la portada | `HomeHeader.astro` | La portada de una página es su `Header`, con el prefijo de la página. |
| `RoomsSection` en la portada | `HomeRoomsSection` | Las zonas de una página llevan su prefijo. |
| `RoomTile`, en la portada y en ROOMS | `RoomCard` | Una tarjeta es `Card`, y la usan dos páginas: la entidad delante. |
| `PhotoSlider` | `RoomPhotosGallery` | Le faltaba la entidad y el tipo de la lista: `Gallery`. |
| `Header.astro`, la del sitio | `AppHeader.astro` | Lo de toda la web dice qué es, sin un nombre genérico. |
| `components/home/HomeHeader.astro` | `components/HomeHeader.astro` | Los componentes van planos: el prefijo ya los junta al ordenar. |
| `components/RoomsPage.astro` | `src/pages/rooms.astro` | Una página es su ruta, no un componente. |
| `layouts/RoomsLayout.astro` | `AppLayout.astro` y los componentes de la página | Los layouts son generales: lo de una página es un componente. |
<!-- kit:if privateArea -->
| `CancelBookingModal` | `BookingCancelModal` | Lo abren la gestión de la reserva y el listado: la entidad delante, y el objeto antes que la acción. |
<!-- kit:end -->

## Funciones, tipos y constantes

- **Funciones:** empiezan por un verbo y llevan el prefijo de origen:
  `buildRoomStayPrice`, `formatDate` (de toda la web). Las de utils lo
  llevan también dentro de su objeto (`roomPriceUtils.buildRoomStayPrice`).
<!-- kit:if backend -->
  `build` arma un objeto con lo que recibe (`apiErrorUtils.buildError`);
  `create` es solo dar de alta en la API.
<!-- kit:else -->
  `build` arma un objeto con lo que recibe (`buildRoomStayPrice`).
<!-- kit:end -->
- **Formato de los datos:** cada tipo de dato tiene su función, en
  `formatUtils`: `formatUtils.formatDate`, `formatDateTime`, `formatNumber`,
  `formatPercent` y `formatPrice` ([D11](./ux-ui/rules.md#d11-textos-y-formato)).
  Una página no escribe las suyas ni formatea a mano.
- **Props:** en un `.astro`, `interface Props`, siempre con ese nombre, que
  Astro lee para tipar a quien usa el componente.
- **Tipos:** PascalCase con prefijo: `Room`, `RoomStayPrice`, `NavEntry`.
- **Constantes:** `SCREAMING_SNAKE_CASE` con prefijo: `HOME_HIGHLIGHTS`; las
  de toda la web, `APP_`: `APP_NAVIGATION`, `APP_LANGUAGES`; las de una
  entidad, la entidad: `ROOMS`, `ROOM_TYPE`. Las que se exportan van en
  `src/constants/`, en un fichero por tema ([Ficheros](#ficheros)), también
  los datos de la web ([Los datos de la web](./standards.md#los-datos-de-la-web)).
<!-- kit:if backend -->
  En un service, junto a su schema: `BOOKING_STATUS`.
<!-- kit:end -->
<!-- kit:if privateArea -->
- **Reglas de permisos:** un objeto de utils por entidad,
  `<entidad>PermissionUtils` (`bookingPermissionUtils`), con una función por
  página, `get<Prefijo>Permissions` (`getAccountBookingsEditPermissions`),
  que recibe los permisos de la sesión y devuelve `canX` (`canView`,
  `canEdit`, `canCancel`). Lo usan la página y sus actions.
- **Columnas de una tabla:** las que solo declaran (la propiedad de la API,
  su texto y cuáles vienen marcadas) van en
  `src/constants/<prefijo>Columns.ts` (`accountBookingsColumns.ts`, con
  `ACCOUNT_BOOKINGS_COLUMNS`), sin test.
<!-- kit:end -->

| Mal | Bien | Por qué |
|---|---|---|
| `stayPrice` | `buildRoomStayPrice` | Una función empieza por un verbo y lleva el prefijo de origen. |
| `ROOMS_LIST` en `utils/` | `ROOMS`, en `constants/rooms.ts` | Las constantes que se exportan van a `constants/`, con el prefijo de su origen. |
| `interface RoomCardProps` en un `.astro` | `interface Props` | Astro solo tipa a quien usa el componente con `Props`. |
<!-- kit:if privateArea -->
| `src/pages/account/bookings/[id]/accountBookingsEditPermissions.ts` | `bookingPermissionUtils.getAccountBookingsEditPermissions`, en `src/utils/` | La regla es una función pura, de la página y de sus actions; y en `src/pages/` solo van rutas. |
<!-- kit:end -->

<!-- kit:if server -->
## Actions y endpoints

Las actions guardan o envían; los endpoints responden lo que es HTTP de verdad
([Guardar](./standards.md#guardar)).

| Pieza | Regla | Ejemplos |
|---|---|---|
| Fichero de actions | `<sección>Actions.ts`, uno por página o sección, en `src/actions/`; exporta `<sección>Actions` | `contactActions.ts`, `contactActions` |
| Composición | `src/actions/index.ts` exporta `server`, con una clave por fichero | `export const server = { contact: contactActions }` |
<!-- kit:if backend -->
| Action | `<verbo><Entidad><Zona?><Qué>`: lo que hace, con su verbo y su objeto; si llama a un service, como su método | `sendContactMessage` |
<!-- kit:else -->
| Action | `<verbo><Entidad><Zona?><Qué>`: lo que hace, con su verbo y su objeto | `sendContactMessage` |
<!-- kit:end -->
| Llamada | `actions.<sección>.<action>` | `actions.contact.sendContactMessage` |
| Schema de un formulario | `<prefijo><Qué>FormSchema`, al lado de la action que lo usa, en `src/actions/` | `contactFormSchema` |
| Tipo de un formulario | `<Prefijo><Qué>FormValues` | `ContactFormValues` |
| Fichero de schemas de formulario | `<prefijo>FormSchema.ts`, con los de los formularios de esa página | `contactFormSchema.ts` |
<!-- kit:if privateArea -->
| Endpoint | `src/pages/api/<sección>/<qué>.<extensión>.ts`, con un `GET` o un `POST` | `src/pages/api/account/bookings/[id]/invoice.pdf.ts`, en `/api/account/bookings/1287/invoice.pdf` |
<!-- kit:else -->
| Endpoint | `src/pages/api/<sección>/<qué>.<extensión>.ts`, con un `GET` o un `POST` | `src/pages/api/rooms/prices.csv.ts`, en `/api/rooms/prices.csv`, las tarifas en CSV |
<!-- kit:end -->

- **Los códigos de `ActionError`** son los de Astro (`BAD_REQUEST`,
<!-- kit:if privateArea -->
  `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`), nunca unos propios.
<!-- kit:else -->
  `NOT_FOUND`, `INTERNAL_SERVER_ERROR`), nunca unos propios.
<!-- kit:end -->
- **El test de un endpoint** va en `src/tests/pages/`, con su ruta
<!-- kit:if privateArea -->
  (`src/tests/pages/api/account/bookings/[id]/invoice.pdf.test.ts`).
<!-- kit:else -->
  (`src/tests/pages/api/rooms/prices.csv.test.ts`).
<!-- kit:end -->
<!-- kit:if privateArea -->
- **Del registro al formulario y del formulario a la petición:**
  `build<Prefijo><Qué>FormValues` y `build<Prefijo><Qué>Request`, en el
  objeto de utils del formulario
  (`accountBookingsEditFormUtils.buildAccountBookingsEditFormValues`,
  `accountBookingsEditFormUtils.buildAccountBookingsEditRequest`).
<!-- kit:end -->

| Mal | Bien | Por qué |
|---|---|---|
| `src/actions/sendContactMessage.ts`, con una action | `sendContactMessage`, en `contactActions.ts` | Las actions de una página o una sección van juntas, en su fichero. |
| `actions.sendContactMessage` | `actions.contact.sendContactMessage` | `index.ts` las compone por fichero. |
| `actions.contact.send` | `actions.contact.sendContactMessage` | Una action dice lo que hace, con su verbo y su objeto. |
| `contactSchema` para el formulario | `contactFormSchema` | El schema de un formulario acaba en `FormSchema`. |
| `ContactFormData` | `ContactFormValues` | El tipo de un formulario acaba en `FormValues`. |
| `POST /api/contact`, un endpoint para enviar el formulario | `actions.contact.sendContactMessage` | Enviar un formulario es una action; un endpoint es para lo que es HTTP de verdad. |

<!-- kit:end -->
<!-- kit:if backend -->
## Services, schemas y caché

Todo lo de `services/<entidad>/`, pieza a pieza. La entidad es el nombre del
service en camelCase (`bookings`); su singular, el de un registro
(`booking`).

| Pieza | Regla | Ejemplos |
|---|---|---|
| Service | `<entidad>Service`, uno por entidad, en `services/<entidad>/<entidad>Service.ts` | `bookingsService` |
| Método | `<verbo><Entidad><Zona?><Qué>`: siempre empieza por un verbo y lleva la entidad del service justo detrás, también en un catálogo de otra entidad que viva en él | `getBookingsAvailability`, `getBookingDetail`, `cancelBooking` |
| Catálogo | `get<Entidad><Zona?><Qué>Catalog`: en singular si son las opciones de un campo de un registro; en plural si son los registros de la propia entidad | `getBookingCancelReasonsCatalog`, `getBookingRoomsCatalog` |
| Alta | `create<Entidad>`: en singular si da de alta un registro; en plural si da de alta varios en una petición | `createBooking` |
| Tipo de la respuesta | El método sin `get`, en PascalCase; si no es un `get`, con `Response` detrás | `BookingsAvailability`, `CancelBookingResponse` |
| Schema de la respuesta | El tipo en camelCase, con `Schema` detrás | `bookingsAvailabilitySchema`, `bookingDetailSchema` |
| Tipo del cuerpo | El método sin `get`, en PascalCase, con `Request` detrás | `CancelBookingRequest`, `UpdateBookingArrivalRequest` |
| Schema del cuerpo | El tipo en camelCase, con `Schema` detrás; solo si alguien lo lee | `cancelBookingRequestSchema` |
| Enumerado de la API | `<ENTIDAD>_<QUÉ>`, un objeto `as const` con nombres de la web; su schema y su tipo, como la pieza | `BOOKING_STATUS`, `bookingStatusSchema`, `BookingStatus` |
| Códigos de error | `<ENTIDAD>_ERROR_CODE`, con una clave en camelCase por código que trata la web | `BOOKING_ERROR_CODE.cancelTooLate` |
| Fichero de schemas | `<entidad><Zona>Schema.ts`, por la zona de sus métodos; sin zona, `<entidad>Schema.ts`, lo que comparten las zonas (enumerados y códigos de error) | `bookingsAvailabilitySchema.ts`, `bookingsSchema.ts` |

- **Singular o plural.** La entidad va en singular cuando el método trata un
  solo registro: su detalle (`getBookingDetail`), una acción sobre él
  (`cancelBooking`) o las opciones de uno de sus campos
  (`getBookingCancelReasonsCatalog`). Va en plural cuando trata varios: una
  página de una lista, la disponibilidad de todas las habitaciones
  (`getBookingsListPage`, `getBookingsAvailability`).
- **La zona.** Un método que solo usa una página lleva su prefijo detrás de
  la entidad, aunque otra enseñe algo parecido: `getBookingsHomeWeekend`,
  las noches libres del próximo fin de semana, que solo enseña la portada.
  Uno que usan varias no lleva ninguna (`getBookingsAvailability`, que piden
  la portada y ROOMS).
- **Un catálogo de otra entidad** sin service propio vive en el service que
  lo usó primero y lleva su entidad, como todos sus métodos: las habitaciones
  para elegir en una reserva son `getBookingRoomsCatalog`, en
  `bookingsService`.
- **`Catalog`** solo lo lleva una lista de opciones de un selector
  (`…/select`).
- **Las palabras de la web,** no las de la ruta:
  `GET /reservationCancelReason/select` es `getBookingCancelReasonsCatalog`.
- **JSDoc:** la primera línea es el endpoint ([JSDoc](#jsdoc)).

| Mal | Bien | Por qué |
|---|---|---|
| `getAvailability` | `getBookingsAvailability` | La entidad del service va justo detrás del verbo. |
| `getBookingAvailability` | `getBookingsAvailability` | Trata las noches de todas las habitaciones: plural. |
| `getBookingsCancelReasonsCatalog` | `getBookingCancelReasonsCatalog` | Un catálogo son las opciones de un campo de una reserva: singular. |
| `getReservationDetail` | `getBookingDetail` | Las palabras de la web, no las de la ruta. |

| Método | Endpoint |
|---|---|
| `getBookingsAvailability` | `GET /booking/availability` |
<!-- kit:if privateArea -->
| `getBookingsListPage` | `POST /booking/list` |
| `getBookingDetail` | `GET /booking/detail/{id}` |
| `updateBookingArrival` | `PUT /booking/arrival/{id}` |
| `cancelBooking` | `PUT /booking/cancel/{id}` |
| `getBookingCancelReasonsCatalog` | `GET /bookingCancelReason/select` |
| `downloadBookingInvoice` | `GET /booking/invoice/{id}` |
<!-- kit:end -->

Lo que pide cada página está en el apartado «Datos» de su documento
([Páginas](./pages/README.md)). Lo que comparten varias entidades va en
`src/schemas/commonSchema.ts`, que nace con el primero que se comparte.

<!-- kit:if server -->
- **Caché:** no hay claves de consulta. Cada petición pide lo suyo, y dos
  páginas que piden lo mismo llaman al mismo método. Lo que se guarda se
  decide por ruta, en el documento de su página: `Astro.cache.set` en la
  página o una regla de `routeRules` en `astro.config.ts`, con la ruta de la
  página (`'/rooms'`). Solo se cachea lo que es igual para todas las
  personas ([Datos](./standards.md#datos)).
<!-- kit:else -->
- **Caché:** no hay. Cada página pide sus datos una vez, en el build, y dos
  páginas que piden lo mismo llaman al mismo método. Un cambio en la API se
  ve en el siguiente build ([Datos](./standards.md#datos)).
<!-- kit:end -->

## Mocks

Los mocks imitan la API para trabajar sin ella. Cada service tiene los suyos
en un JSON a su lado, sin carpeta, con la respuesta de cada endpoint que usa
la web. Los lee el transporte, en el servidor, con `USE_MOCKS=true`:

```text
services/bookings/
├── bookingsService.ts
├── bookingsAvailabilitySchema.ts
├── bookingsSchema.ts
├── bookingsMocks.json          "GET /booking/availability", "GET /booking/detail/:id"…
└── bookingsListMocks.json      si el de la entidad crece, los de una zona, aparte
```

| Pieza | Nombre | Ejemplos |
|---|---|---|
| Los mocks de un service | `<entidad>Mocks.json`, al lado de su service | `bookingsMocks.json` |
| Los de una zona, si los del service crecen | `<entidad><Zona>Mocks.json`, como los schemas | `bookingsListMocks.json` |
| Una respuesta | Su clave es `"<MÉTODO> /ruta"`, como la pide el service, con `:` en lo variable; una ruta concreta gana a la de su `:param` | `"GET /booking/availability"`, `"GET /booking/detail/:id"`, `"GET /booking/detail/1287"` |

- **El JSON no lleva test:** lo valida el test del schema de su método, que
  lo lee como la respuesta real.
- **Los ids que se cruzan casan:** los mocks son un solo mundo; el
  `roomSlug` `encina` de la disponibilidad es la habitación de `ROOMS`
  ([Añadir un servicio](./guides/add-a-service.md#4-el-mock)).

| Mal | Bien | Por qué |
|---|---|---|
| `services/bookings/mocks/availability.json` | La clave `"GET /booking/availability"` de `bookingsMocks.json` | Los mocks de un service van en su JSON, sin carpeta. |
| `"GET /booking/detail/{id}"` | `"GET /booking/detail/:id"` | Lo variable va con `:`. |
| `bookingsMock.json` | `bookingsMocks.json` | Reúne las respuestas de varios endpoints. |

## El transporte

El transporte es lo único que habla con la API. Son utils de la raíz, en
`src/utils/`, un objeto por tema como cualquier util, y los únicos que no
son funciones puras. Nunca corren en el navegador: leen `API_URL` de
`astro:env/server`.

| Objeto | Qué reúne |
|---|---|
| `apiUtils` | Las tres llamadas: `request`, `upload` y `download`, cada una con su petición a la API real, privada (`callServer`) |
| `apiErrorUtils` | El fallo de una llamada: `buildError`, `isApiError`, `readErrorCode`, `isNotFound` y `getRequestFailure` |
<!-- kit:if privateArea -->
| `apiSessionUtils` | La sesión de cada petición: `run` (la abre el middleware), `getToken` y `endOnError` |
<!-- kit:end -->
| `apiMockUtils` | Las gemelas de las llamadas con los `*Mocks.json`: `respond`, `upload` y `download`. Solo lo carga `apiUtils`, con `USE_MOCKS=true` |

<!-- kit:if privateArea -->
Sus tipos (`ApiMethod`, `ApiError`, `RequestFailure`, `ApiSession`,
`ApiSessionEnd` y `UploadOptions`) están en `src/types/api.ts`.
<!-- kit:else -->
Sus tipos (`ApiMethod`, `ApiError`, `RequestFailure` y `UploadOptions`) están
en `src/types/api.ts`.
<!-- kit:end -->

| Mal | Bien | Por qué |
|---|---|---|
| `apiUtils.fetchApi` | `apiUtils.request` | El objeto ya dice `api`, y `fetch` es la función de la plataforma. |
| `new ApiError(404)` | `apiErrorUtils.buildError(404)` | El fallo es un tipo, no una clase: se arma con su util. |
| `error instanceof ApiError` | `apiErrorUtils.isApiError(error)` | Y se reconoce con su util. |
| `src/api/apiCalls.ts` | `src/utils/apiUtils.ts` | El transporte va en `utils/`, sin carpeta propia. |
| ``fetch(`${API_URL}/booking/availability`)`` en una página | `bookingsService.getBookingsAvailability()` | La página llama al service, y solo el transporte habla con la API. |
<!-- kit:if privateArea -->
| `bookingsService.getBookingDetail(id, token)` | `bookingsService.getBookingDetail(id)` | El token lo pone el transporte, con la sesión de la petición: los services no lo reciben. |
<!-- kit:end -->

<!-- kit:end -->
<!-- kit:if i18n -->
## Textos (i18n)

- **Un catálogo por idioma,** `src/i18n/<idioma>.json`, sin namespaces: las
  claves van agrupadas por página. El primer nivel es la sección (`blog`,
  `legal`), la página sin sección por su prefijo (`home`, `rooms`,
  `contact`) o `common`, lo de toda la web; en una sección, el segundo es la
  página, por lo que la distingue en su prefijo (`legal/notice.astro` es
  `legal.notice`; el índice, `blog.index`; `blog/[...slug].astro`,
  `blogPost`, es `blog.post`).
- **Claves:** en camelCase y agrupadas por zona (`header`, `rooms`, `form`):
  `home.header.title`, `contact.form.email`. Una página de una sola zona
  cuelga sus claves de su página.
- **Dentro de una zona:**
  - `title` es el título;
  - `info` es el texto del icono de información;
  - `subtitle` solo lleva datos (un recuento, una fecha).
- **Un número que concuerda va en `count`,** con sus dos formas, `_one` y
  `_other`: `nights_one` («{{count}} noche») y `nights_other` («{{count}}
  noches»), que i18next elige solas
  ([D11](./ux-ui/rules.md#d11-textos-y-formato)). Nunca `{{value}}` para un
  número que concuerda; `{{value}}` queda para un valor ya formateado que no
  concuerda con nada («desde {{value}} la noche», con «85 €»).
- **Un aviso o un estado vacío:** `title` y `description`, nunca `message`.
- **`failure` y `errors`:** `failure` es una acción que ha fallado y `errors`,
  una validación. `failure` es el título del aviso («No se ha podido enviar
  el mensaje», sin punto); su descripción es una de `common.failure`.
- **Buscadores y compartir:** el título y la descripción de cada página van
  arriba de su grupo, `title` y `description`: `rooms.title`,
  `rooms.description` ([D14](./ux-ui/rules.md#d14-buscadores-y-compartir)).
  El título es también el de su `h1` y, si está en el menú, el de su
  entrada.
- **Menú y pie:** sus etiquetas son `common.nav.*` y no se reutilizan como
  títulos de página. La clave de cada entrada es el prefijo de su página:
  `common.nav.rooms` («Habitaciones»), `common.nav.legalNotice` («Aviso
  legal»).
- **El vocabulario de una pieza compartida va con ella:** al grupo de su
  entidad si es de negocio (`room.*`, los textos de `RoomCard`), y a `common`
  si es de toda la web (el botón del menú, el pie). El contenido de una
  página se queda en su grupo.

Así quedan las claves de dos páginas, de una pieza compartida y de `common`:

```text
home
├── title, description                       «Inicio», «Una casa de piedra entre robles…»
├── header.{title, lead, action}             «Casa del Roble», «Pide disponibilidad»
└── rooms.title                              «Las habitaciones»
rooms
├── title, description                       «Habitaciones», «Tres habitaciones de piedra y madera…»
├── cta                                      «Pide disponibilidad»
└── search.{arrival, departure, guests, empty}  los textos de RoomsSearch, si la página la lleva
room
├── capacity_one, capacity_other             «{{count}} persona», «{{count}} personas»
└── pricePerNight                            «{{value}} la noche»
common
├── actions.{send, close}                    «Envía», «Cierra»
├── failure.{network, generic}
├── formErrors.{required, email}
├── nav.{home, rooms, area, contact, legalNotice, privacy, cookies}
└── errorPages.{notFound, …}
```

**Las claves de `common`** son las de toda la web, cada una en el bloque de
su pieza o de su tema:

- **Lo que repite toda la web** va una sola vez, en `common`, y una página no
  lo copia en su grupo: las acciones (`common.actions.send`, «Envía»), la
  descripción de un fallo (`common.failure.network`), los errores de
  validación (`common.formErrors.required`) y el aviso de cambios sin enviar
  (`common.unsavedChanges.*`).
- **Los textos de las piezas del sistema de diseño** salen de
  `common.fields` ([D1](./ux-ui/rules.md#d1-el-sistema-de-diseño-primero)).
- **El marco y las páginas de error:** el menú y el pie (`common.nav.*`) y
  la página que no existe (`common.errorPages.*`).
- **Una clave nueva de `common`** se crea solo si la usa una pieza de toda la
  web o la repiten varias páginas igual.
<!-- kit:else -->
## Textos

Sin i18n no hay claves: los textos van escritos en el componente que los pinta
([Textos](./standards.md#textos)). Lo que sí se mantiene:

- **El texto de una pieza compartida va con ella:** en `RoomCard`, «85 € la
  noche». El contenido de una página se queda en sus componentes.
- **Lo que repite toda la web** (las acciones «Envía» y «Cierra», la
  descripción de un fallo, el aviso de cambios sin enviar) lo escribe una
  sola pieza de toda la web, y las páginas la usan en lugar de copiarlo.
- **Las formas no cambian:** un número que concuerda tiene su forma en
  singular y en plural; un fallo es «No se ha podido …»; un vacío,
  «Todavía no hay …» ([D11](./ux-ui/rules.md#d11-textos-y-formato)).
- **Para pasar a varios idiomas,** la skill `zaius-languages` lleva los
  textos a catálogos, con sus claves.
<!-- kit:end -->

## JSDoc

Toda función que no es un componente lleva un JSDoc corto, siempre con la
misma forma:

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
<!-- kit:if server -->
- **En las actions**, la descripción dice qué guarda o envía y desde dónde, y
  `@throws`, los códigos de `ActionError` que da.
<!-- kit:end -->
- **No llevan JSDoc** el frontmatter ni las funciones internas de un
  componente, ni los objetos sin comportamiento (schemas, configuración,
  constantes), que tampoco llevan otro comentario: su nombre dice lo que son.
- **Idioma:** castellano, y sin referencias a otros proyectos.
<!-- kit:if backend -->

Un método de un service:

```ts
/**
 * GET /booking/availability. Las noches libres de cada habitación, de hoy a 30 días.
 * @returns Las fechas libres de cada habitación, por su `roomSlug`.
 */
getBookingsAvailability: () => apiUtils.request('GET', '/booking/availability', bookingsAvailabilitySchema),
```
<!-- kit:end -->

Las funciones de un objeto de utils, sueltas y reunidas al final:

```ts
/**
 * Dice si una habitación cabe para las personas que vienen.
 * @param room La habitación, como la da `ROOMS`.
 * @param guests Las personas.
 * @returns `true` si caben.
 */
function isRoomForGuests (room: Room, guests: number): boolean { … }

/**
 * Calcula el precio de una estancia en una habitación.
 * @param room La habitación.
 * @param nights Las noches.
 * @returns El total, en euros.
 */
function buildRoomStayPrice (room: Room, nights: number): number { … }

export const roomPriceUtils = {
  isRoomForGuests,
  buildRoomStayPrice,
}
```
<!-- kit:if server -->

Una action:

```ts
/**
 * Envía el mensaje del formulario de contacto al correo de la casa.
 * @throws {ActionError} `INTERNAL_SERVER_ERROR` si el servicio de correo no responde.
 */
sendContactMessage: defineAction({ … }),
```
<!-- kit:end -->

## Revisar los nombres

Lo que mira `zaius-rename` para alinear los nombres del proyecto con esta
página, y cómo se mueve cada cosa en esta web sin romper nada.

**Qué se mira,** en este orden:

1. **Las páginas:** su fichero es su URL, y su prefijo, su URL en camelCase
   (`/legal/notice` es `legal/notice.astro`, `legalNotice`); su documento,
   `docs/pages/<NOMBRE>.md` ([Páginas y rutas](#páginas-y-rutas)).
2. **Los componentes:** el prefijo de origen (la página, la entidad o
   ninguno), el tipo final y el fichero, que se llama como lo que exporta
   ([Prefijo de origen](#prefijo-de-origen), [Componentes](#componentes) y
   [Ficheros](#ficheros)).
3. **Utils, constantes y tipos**
   ([Funciones, tipos y constantes](#funciones-tipos-y-constantes)),
<!-- kit:if server -->
   las actions y sus schemas de formulario
   ([Actions y endpoints](#actions-y-endpoints)),
<!-- kit:end -->
<!-- kit:if backend -->
   los services, sus métodos, sus schemas y sus mocks
   ([Services, schemas y caché](#services-schemas-y-caché) y
   [Mocks](#mocks)),
<!-- kit:end -->
   cada uno con su prefijo.
4. **Las imágenes y las colecciones,** con el prefijo de quién las usa.
<!-- kit:if i18n -->
5. **Los textos:** las claves de cada página y las del menú
   ([Textos (i18n)](#textos-i18n)).
6. **Los tests,** que se llaman como su fichero, y los de las páginas, en
   `src/tests/pages/` con su misma ruta.
<!-- kit:else -->
5. **Los tests,** que se llaman como su fichero, y los de las páginas, en
   `src/tests/pages/` con su misma ruta.
<!-- kit:end -->

**Cómo se mueve cada cosa:**

- **Con `git mv`,** cada fichero, para conservar su historia; y con él, lo
  que exporta y cada import que lo usa, en todo `src/`, también en los
  tests.
- **Una página solo se mueve si cambia su URL,** y eso nunca sin el OK de la
  persona (abajo). Si solo cambia el nombre de sus piezas, la página se
  queda y cambian sus imports.
- **El menú y el pie:** la entrada de la página en
  `src/constants/appNavigation.ts`, con su `href`.
<!-- kit:if i18n -->
- **Los textos:** las claves de la página en cada catálogo, y cada `t()` que
  las usa; y las del menú (`common.nav.*`), en cada idioma.
<!-- kit:end -->
- **Sus documentos:** el de la página, en `docs/pages/`, su línea en el
  [backlog](./backlog.md) y su fila en el
  [índice de páginas](./pages/README.md#índice).

**Con cuidado:**

- **Una URL no se renombra nunca sin el OK de la persona:** rompe los enlaces
  que la gente ha guardado y lo que han aprendido los buscadores. Si una URL
  no cumple su regla, se decide con ella y es su propio bloque; si se
  cambia, la vieja redirige a la nueva (`redirects`, en `astro.config.ts`).
- **Una imagen de `public/`** puede estar enlazada desde fuera (la imagen para
  compartir): se renombra con la página, nunca sola.
