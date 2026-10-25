# Cargar y guardar datos

<!-- kit:if privateArea -->
Esta guía lee los datos de la API en una página y los guarda: cómo los pide
el frontmatter, qué estado pinta en cada caso, cómo se leen los catálogos y
varios datos a la vez, cómo va el estado de la pantalla en la URL, cómo se
pagina y se filtra una lista, cómo se guarda con una action, qué pasa si falla
y cómo se descarga un fichero. Es la técnica: qué se pinta en cada estado y
dónde va cada aviso lo dicen las normas
[D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío),
[D4](../ux-ui/rules.md#d4-avisos-y-fallos),
[D8](../ux-ui/rules.md#d8-listados-y-tablas) y
[D11](../ux-ui/rules.md#d11-textos-y-formato). Sirve para quien ya tiene el
método en el service; si el endpoint no está, se añade primero con
[Añadir un servicio](./add-a-service.md). Los ejemplos son las noches libres
de las habitaciones, en ROOMS (`/rooms`), y, en la zona privada, «Mis
reservas», ACCOUNT-BOOKINGS (`/account/bookings`), y la gestión de una
reserva, ACCOUNT-BOOKINGS-EDIT (`/account/bookings/[id]/edit`).

Tiene dos partes. «Cargar» va del dato suelto a la lista con filtros;
«Guardar», del guardado a su fallo y a la descarga.
<!-- kit:else -->
<!-- kit:if server -->
Esta guía lee los datos de la API en una página: cómo los pide el
frontmatter, qué estado pinta en cada caso, cómo se leen los catálogos y
varios datos a la vez. Es la técnica: qué se pinta en cada estado lo dicen las
normas [D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío) y
[D11](../ux-ui/rules.md#d11-textos-y-formato). Sirve para quien ya tiene el
método en el service; si el endpoint no está, se añade primero con
[Añadir un servicio](./add-a-service.md). El ejemplo son las noches libres de
las habitaciones, en ROOMS (`/rooms`).

La web no guarda nada en la API: eso llega con la zona privada, con
`%%KIT_RUN%% change`. El formulario de contacto no guarda en la API, envía un
mensaje ([Crear un formulario](./create-a-form.md)).
<!-- kit:else -->
Esta guía lee los datos de la API en una página, al compilar: cómo los pide
el frontmatter, qué pasa en cada caso y cómo se leen los catálogos y varios
datos a la vez. Es la técnica: qué se pinta en cada estado lo dicen las
normas [D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío) y
[D11](../ux-ui/rules.md#d11-textos-y-formato). Sirve para quien ya tiene el
método en el service; si el endpoint no está, se añade primero con
[Añadir un servicio](./add-a-service.md). El ejemplo son las noches libres de
las habitaciones, en ROOMS (`/rooms`).

Una web sin servidor no guarda nada: después del build no hay quien reciba un
formulario. Los formularios llegan con el servidor, con `%%KIT_RUN%% change`.
<!-- kit:end -->
<!-- kit:end -->

En los ejemplos, las piezas visuales llevan el nombre de su papel
(`EmptyState`, `ErrorState`, `PageAlert`) y no se importan; las del proyecto
están en [Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

<!-- kit:if privateArea -->
- **Cargar:** [1. La página y sus datos](#1-la-página-y-sus-datos), [2. Un dato](#2-un-dato), [3. Carga, error y vacío](#3-carga-error-y-vacío), [4. Los catálogos](#4-los-catálogos), [5. Varios datos a la vez](#5-varios-datos-a-la-vez), [6. El estado de la pantalla en la URL](#6-el-estado-de-la-pantalla-en-la-url), [7. Listas paginadas y filtros](#7-listas-paginadas-y-filtros)
- **Guardar:** [1. El guardado](#1-el-guardado), [2. El fallo del guardado](#2-el-fallo-del-guardado), [3. La exportación](#3-la-exportación)
<!-- kit:else -->
- **Cargar:** [1. La página y sus datos](#1-la-página-y-sus-datos), [2. Un dato](#2-un-dato), [3. Carga, error y vacío](#3-carga-error-y-vacío), [4. Los catálogos](#4-los-catálogos), [5. Varios datos a la vez](#5-varios-datos-a-la-vez)
<!-- kit:end -->
- [Errores comunes](#errores-comunes)

## Cargar

<!-- kit:if privateArea -->
Pedir un dato a la API y pintarlo con sus estados. Los pasos 1 a 3 valen para
toda página que lee de la API; del 4 al 7, cada uno cuando la página lo
necesita.
<!-- kit:else -->
Pedir un dato a la API y pintarlo con sus estados. Los pasos 1 a 3 valen para
toda página que lee de la API; el 4 y el 5, cuando la página lo necesita.
<!-- kit:end -->

### 1. La página y sus datos

- **Los datos los pide la página,** en su frontmatter, con los métodos de los
  services. Un componente nunca llama a un service: recibe lo que pinta por
  props. Lo vigila la comprobación de la estructura
  ([Normativa](../standards.md#datos)).
<!-- kit:if server -->
- **El frontmatter corre en el servidor,** en cada petición, si la página
  lleva `export const prerender = false`; sin él, una sola vez, al compilar.
  Una página que se pinta en cada petición lee los datos de ese momento: no
  hay caché en el navegador que invalidar ni datos viejos que esconder.
<!-- kit:else -->
- **El frontmatter corre al compilar:** `%%PM%% run build` lee la API de
  `API_URL` y deja cada página hecha, con los datos de ese momento; para que
  cambien, se compila otra vez. El build necesita la API, o los mocks
  (`USE_MOCKS=true` en `.env.production.local`) para una demo.
<!-- kit:end -->
<!-- kit:if privateArea -->
- **La página no pasa el token:** el middleware abre la sesión de cada
  petición, y el transporte toma de ella el token de la persona. Los services
  tienen las mismas firmas en las páginas públicas y en las privadas.
- **Sin permiso, no se pide nada:** la página mira su regla antes de pedir
  ([Aplicar permisos](./apply-permissions.md#2-la-página)).
<!-- kit:end -->
- **Si el endpoint no está en el service,** se añade primero:
  [Añadir un servicio](./add-a-service.md).

### 2. Un dato

<!-- kit:if server -->
Las noches libres de cada habitación, en ROOMS (`src/pages/rooms.astro`):

```astro
---
import { bookingsService } from '@/services/bookings/bookingsService'

export const prerender = false

const [result] = await Promise.allSettled([bookingsService.getBookingsAvailability()])
---
```

- **`prerender = false`:** las noches libres cambian con cada reserva, así que
  la página las pide al abrirla, no al compilar. Si el resto de la página
  puede generarse al compilar, solo la disponibilidad va en una isla de
  servidor ([Carga, error y vacío](#3-carga-error-y-vacío)).
- **`Promise.allSettled` no lanza:** da el dato
  (`{ status: 'fulfilled', value }`) o su fallo
  (`{ status: 'rejected', reason }`), y con él la página elige qué pinta
  ([Carga, error y vacío](#3-carga-error-y-vacío)). Con un `await` suelto del
  service, cualquier fallo de la API acabaría en la página de error
  (`src/pages/500.astro`), sin el estado de la zona ni su reintento.
<!-- kit:if privateArea -->

**Un registro, por su parámetro.** La reserva de su gestión
(`src/pages/account/bookings/[id]/edit.astro`):

```astro
---
import { bookingsService } from '@/services/bookings/bookingsService'

export const prerender = false

const id = Number(Astro.params.id)
if (!Number.isInteger(id)) return Astro.rewrite('/404')
const [booking] = await Promise.allSettled([bookingsService.getBookingDetail(id)])
---
```

- **`Astro.params` da texto:** el `[id]` se pasa a número, y uno que no es un
  entero no es una URL de la web: `Astro.rewrite('/404')` pinta la página que
  no existe, con su 404, sin cambiar la URL.
- **El parámetro y la query pasan por zod** si son más que un id: un valor
  que no vale vuelve a su valor por defecto
  ([El estado de la pantalla en la URL](#6-el-estado-de-la-pantalla-en-la-url)).
<!-- kit:end -->
<!-- kit:else -->
Las noches libres de cada habitación, en ROOMS (`src/pages/rooms.astro`):

```astro
---
import { bookingsService } from '@/services/bookings/bookingsService'

const availability = await bookingsService.getBookingsAvailability()
---
```

- **Un `await` suelto:** si la API falla, falla `%%PM%% run build`, y no se
  publica una página rota.
- **Las noches libres son las del último build.** Para tenerlas al día, se
  compila y se publica otra vez (cada noche, por ejemplo); si tienen que ser
  las de cada momento, la web necesita el servidor, que llega con
  `%%KIT_RUN%% change`.
- **Una ruta con parámetro que sale de la API** (`[slug]`) dice con
  `getStaticPaths` qué páginas genera, con lo que da la API al compilar, y
  declara `type Props = Record<string, never>`: sin esa línea, Astro da a sus
  props el tipo `never`, porque `getStaticPaths` solo da `params`. La URL de
  un registro que no estaba al compilar no existe, y sale la página que no
  existe (`src/pages/404.astro`).
<!-- kit:end -->

### 3. Carga, error y vacío

Qué se pinta en cada estado lo dice
[D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío); aquí, de dónde
sale cada uno:

<!-- kit:if server -->
| Estado | En el frontmatter | Qué se pinta |
|---|---|---|
| Primera carga | No hay: la página llega con sus datos. Una zona lenta va en una isla de servidor (abajo) | Nada; en la isla de servidor, su esqueleto |
| Fallo al cargar | `result.status === 'rejected'` | El estado de error de la zona, con «Vuelve a intentarlo» |
| Nada que enseñar | El dato llega vacío (una habitación sin noches libres) | El estado vacío de la zona |
<!-- kit:if privateArea -->
| Recarga por un filtro, la página o el orden | No hay: es otra petición, y la página llega entera | La página nueva |
| El registro no existe | `apiErrorUtils.isNotFound(result.reason)`, con `Astro.response.status = 404` | Su propio estado, con el enlace a su lista |
| Sin acceso | La regla da `canView: false`: no se pide nada, y `Astro.response.status = 403` | El aviso de que no se tiene acceso, dentro del marco |
<!-- kit:end -->

La página pasa a cada zona su dato, o `null` si no ha llegado, y cada zona
lleva dentro su error y su vacío. ROOMS, con el dato del paso anterior:

```astro
---
import RoomsAvailabilitySection from '@/components/RoomsAvailabilitySection.astro'
import RoomsList from '@/components/RoomsList.astro'
import { ROOMS } from '@/constants/rooms'
import { getI18nT } from '@/i18n/i18n'
import AppLayout from '@/layouts/AppLayout.astro'
import { bookingsService } from '@/services/bookings/bookingsService'

export const prerender = false

const t = getI18nT(Astro.currentLocale)
const [result] = await Promise.allSettled([bookingsService.getBookingsAvailability()])
const availability = result.status === 'fulfilled' ? result.value : null
---

<AppLayout title={t('rooms.title')}>
  <h1>{t('rooms.title')}</h1>
  <RoomsList rooms={ROOMS} />
  <RoomsAvailabilitySection rooms={ROOMS} availability={availability} />
</AppLayout>
```

- **Si la API falla, las habitaciones se siguen viendo:** salen de
  `constants/`, y solo la zona de la disponibilidad pinta su error,
  «No se ha podido cargar la disponibilidad», con «Vuelve a intentarlo».
- **«Vuelve a intentarlo» es un enlace a la misma URL** (`Astro.url.href`):
  pide otra vez la página entera, con su query.
- **El vacío es de cada habitación:** sin noches libres, «No quedan noches
  libres en estos 30 días», sin punto
  ([D11](../ux-ui/rules.md#d11-textos-y-formato)).
- **Desde el servidor no hay «sin conexión»:** si la persona no tiene
  conexión, la página no llega. Un fallo de red al llamar a la API es la API,
  que no responde, y lleva la descripción de cualquier otro fallo.
- **Lo que solo ayuda** (un dato de contexto) falla sin avisar ni bloquear.
<!-- kit:if privateArea -->

**Un registro que no existe.** La página decide el estado con constantes con
nombre y lo resuelve con ternarios, del caso más concreto al más general. La
gestión de una reserva, con el dato del paso anterior:

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n'
import AccountBookingsEditForm from '@/components/AccountBookingsEditForm.astro'
import { APP_DEFAULT_LANGUAGE } from '@/constants/appLanguages'
import { getI18nT } from '@/i18n/i18n'
import AppLayout from '@/layouts/AppLayout.astro'
import { bookingsService } from '@/services/bookings/bookingsService'
import { apiErrorUtils } from '@/utils/apiErrorUtils'

export const prerender = false

const t = getI18nT(Astro.currentLocale)
const locale = Astro.currentLocale ?? APP_DEFAULT_LANGUAGE
const id = Number(Astro.params.id)
if (!Number.isInteger(id)) return Astro.rewrite('/404')
const [booking] = await Promise.allSettled([bookingsService.getBookingDetail(id)])

const isNotFound = booking.status === 'rejected' && apiErrorUtils.isNotFound(booking.reason)
const isLoaded = booking.status === 'fulfilled'

if (isNotFound) Astro.response.status = 404
---

<AppLayout title={t('account.bookingsEdit.documentTitle', { id })} noindex>
  {isNotFound
    ? <EmptyState title={t('account.bookingsEdit.notFound.title')} action={{ label: t('account.bookingsEdit.notFound.action'), href: getRelativeLocaleUrl(locale, '/account/bookings') }} />
    : isLoaded
      ? <AccountBookingsEditForm booking={booking.value} />
      : <ErrorState title={t('common.errorState.title')} retryLabel={t('common.errorState.retry')} retryHref={Astro.url.href} />}
</AppLayout>
```

- **Solo la rama de `isLoaded` lee `booking.value`:** ahí TypeScript sabe
  que el dato ha llegado.
- **El estado de la respuesta va con el de la pantalla:** un registro que no
  existe responde con un 404, y una página sin acceso, con un 403, aunque los
  dos se pinten dentro del marco.
- **La acción de volver del vacío es un enlace** a la lista, porque lleva a
  otra pantalla ([D10](../ux-ui/rules.md#d10-navegación)). Si la persona no
  puede ver la lista, lleva al inicio.
- **Una tabla lleva su vacío y su error dentro,** con su cabecera siempre a la
  vista: recibe la página del listado, o `null` si no ha llegado. Con
  filtros, su vacío es «Ninguna reserva con estos filtros», con «Quita los
  filtros» ([Listas paginadas y filtros](#7-listas-paginadas-y-filtros)).
<!-- kit:end -->

**Lo lento, o lo único que cambia, en una isla de servidor.** Una zona que
tarda, o la única de la página que tiene que ser de este momento, no hace
esperar a la página: es un componente con `server:defer`. Así ROOMS se genera
al compilar, sin `prerender = false`, y solo la disponibilidad se pide al
abrirla, en una petición aparte, con su esqueleto en `slot="fallback"`
mientras llega:

```astro
<RoomsAvailabilitySection server:defer>
  <LoadingSkeleton slot='fallback' />
</RoomsAvailabilitySection>
```

- **Lee su dato él mismo,** con el service, porque la página no lo espera: es
  el único caso en que un componente llama a un service. Lleva su error y su
  vacío dentro, como una zona.
- **Sus props viajan en la URL de esa petición:** datos pequeños (un id, una
  fecha), nunca un registro entero.
- **Solo lo que de verdad lo necesita:** cada isla de servidor es una
  petición más.
<!-- kit:else -->
| Estado | Al compilar | Qué se pinta |
|---|---|---|
| Primera carga y recarga | No hay: la página ya está hecha | La página |
| Fallo al cargar | Falla `%%PM%% run build`: no se publica nada roto | Nada |
| Nada que enseñar | El dato llega vacío (una habitación sin noches libres) | El estado vacío de la zona |
| Un registro que ya no está | No tiene página: `getStaticPaths` solo genera los que da la API | La página que no existe (`src/pages/404.astro`) |

- **Sin fallo al cargar,** la página no lleva estado de error: una página
  generada con un error se quedaría así hasta el siguiente build.
- **El vacío es de cada habitación:** sin noches libres, «No quedan noches
  libres en estos 30 días», sin punto
  ([D11](../ux-ui/rules.md#d11-textos-y-formato)).
<!-- kit:end -->

### 4. Los catálogos

<!-- kit:if privateArea -->
Un catálogo es la lista de opciones de un selector (los motivos de
cancelación de una reserva; los endpoints `…/select`), y su método termina en
`Catalog`: `getBookingCancelReasonsCatalog`.
<!-- kit:else -->
Un catálogo es la lista de opciones de un selector (los endpoints
`…/select`), y su método termina en `Catalog`.
<!-- kit:end -->

<!-- kit:if server -->
- **Lo pide cada página que lo usa,** en su frontmatter y a la vez que sus
  otros datos ([Varios datos a la vez](#5-varios-datos-a-la-vez)), y se lo
  pasa a la pieza que lo pinta. No hay caché en el navegador que compartir, y
  ninguna página importa de otra: las que lo usan llaman al mismo método.
<!-- kit:if privateArea -->
- **Un catálogo que falla** deja el formulario sin opciones: la página pinta
  su error, como si fallara el registro.
<!-- kit:end -->
- **La caché, si hace falta, es de la ruta,** y se decide en el documento de
  la página: solo se cachea lo que es igual para todas las personas
  ([Normativa](../standards.md#datos)).
<!-- kit:if privateArea -->
  Una página con sesión no se cachea, así que su catálogo se pide en cada
  petición.
<!-- kit:end -->
<!-- kit:else -->
- **Se lee al compilar,** como cualquier otro dato, y queda en la página tal
  como estaba entonces.
- **Lo pide cada página que lo usa,** con el mismo método: ninguna página
  importa de otra.
<!-- kit:end -->
<!-- kit:if i18n -->
- **El idioma, si la API traduce.** Por defecto la web no manda su idioma a
  la API. Si la API traduce un catálogo, se le manda como dicen los
  [Puntos de adaptación a la API](./add-a-service.md#puntos-de-adaptación-a-la-api);
  lo que la API no traduce (el nombre de una habitación) va sin él.
<!-- kit:end -->

### 5. Varios datos a la vez

<!-- kit:if privateArea -->
Si una página necesita varios datos (la reserva y el catálogo de su
selector), los pide a la vez, con `Promise.allSettled`: el `Promise.all` que
no lanza, que espera a todos y da el resultado de cada uno. La gestión de la
reserva, ya con su regla de permisos:

```ts
const { canView, canEdit } = bookingPermissionUtils.getAccountBookingsEditPermissions(Astro.locals.session?.permissions ?? [])
const [booking, cancelReasons] = canView ? await Promise.allSettled([bookingsService.getBookingDetail(id), bookingsService.getBookingCancelReasonsCatalog()]) : []

const isNotFound = booking?.status === 'rejected' && apiErrorUtils.isNotFound(booking.reason)
const isLoaded = booking?.status === 'fulfilled' && cancelReasons?.status === 'fulfilled'

if (!canView) Astro.response.status = 403
if (isNotFound) Astro.response.status = 404
```

```astro
{!canView
  ? <EmptyState title={t('common.errorPages.forbidden.title')} />
  : isNotFound
    ? <EmptyState title={t('account.bookingsEdit.notFound.title')} action={{ label: t('account.bookingsEdit.notFound.action'), href: getRelativeLocaleUrl(locale, '/account/bookings') }} />
    : isLoaded
      ? <AccountBookingsEditForm booking={booking.value} cancelReasons={cancelReasons.value} readOnly={!canEdit} />
      : <ErrorState title={t('common.errorState.title')} retryLabel={t('common.errorState.retry')} retryHref={Astro.url.href} />}
```

- **A la vez, nunca uno detrás de otro:** dos `await` seguidos esperan al
  primero para pedir el segundo.
- **Sin permiso de ver, no se pide nada:** el `[]` deja los dos sin definir,
  y la página pinta el aviso de que no se tiene acceso.
- **Lo que necesita todos espera a todos:** el formulario necesita la reserva
  y los motivos, así que `isLoaded` mira los dos, y el fallo de cualquiera
  pinta el error de la página.
- **Las zonas que se pintan solas** reciben cada una su dato, o `null` si ha
  fallado, como la disponibilidad de ROOMS: si una falla, pinta su error y
  las demás se siguen viendo.
- **Una zona lenta** no entra en la espera: va en una isla de servidor
  ([Carga, error y vacío](#3-carga-error-y-vacío)).
<!-- kit:else -->
<!-- kit:if server -->
Si una página necesita varios datos de la API, los pide a la vez, con
`Promise.allSettled`: el `Promise.all` que no lanza, que espera a todos y da
el resultado de cada uno, en el mismo orden en que se piden.

- **A la vez, nunca uno detrás de otro:** dos `await` seguidos esperan al
  primero para pedir el segundo.
- **Cada zona recibe su dato,** o `null` si ha fallado, como la
  disponibilidad de ROOMS: si una falla, pinta su error y las demás se siguen
  viendo.
- **Lo que necesita todos espera a todos:** si una pieza necesita dos datos,
  mira los dos, y el fallo de cualquiera pinta su error.
- **Una zona lenta** no entra en la espera: va en una isla de servidor
  ([Carga, error y vacío](#3-carga-error-y-vacío)).
<!-- kit:else -->
Si una página necesita varios datos de la API, los pide a la vez, con
`Promise.all`, que da el resultado de cada uno en el mismo orden en que se
piden.

- **A la vez, nunca uno detrás de otro:** dos `await` seguidos esperan al
  primero para pedir el segundo, y alargan el build.
- **Si falla uno, falla el build:** al compilar no hay estado de error que
  pintar.
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if privateArea -->

### 6. El estado de la pantalla en la URL

Lo que tiene que sobrevivir a abrir un registro y volver, a recargar y a
compartir el enlace va en la query de la URL, que lee la página: la página,
el tamaño y la búsqueda de una lista (`/account/bookings?search=encina&page=2`)
y la pestaña de la gestión de un registro
(`/account/bookings/1287/edit?tab=guests`). Nada va en el `sessionStorage`
([Normativa](../standards.md#datos)).

La página lee la query con un schema de zod, en el util de su petición,
`src/utils/accountBookingsRequestUtils.ts`:

```ts
import { z } from 'zod'
import type { PageRequest } from '@/schemas/commonSchema'

const accountBookingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().pipe(z.literal([10, 25, 50])).catch(10),
  search: z.string().trim().catch(''),
})

/**
 * Lee de la query de la URL la petición de «Mis reservas»: la página, su tamaño y la búsqueda.
 * @param query La query de la URL (`Astro.url.searchParams`).
 * @returns El cuerpo de la página (`PageRequest`); lo que falta o no vale, con su valor por defecto.
 */
function buildAccountBookingsRequest (query: URLSearchParams): PageRequest {
  return accountBookingsQuerySchema.parse(Object.fromEntries(query))
}

export const accountBookingsRequestUtils = {
  buildAccountBookingsRequest,
}
```

- **Lo que no vale vuelve a su valor por defecto** (`.catch`): una URL
  tocada a mano (`?page=abc`) no da un error.
- **El valor por defecto no se escribe en la URL:** `/account/bookings` es la
  página 1, de 10 filas, sin búsqueda.
- **Los enlaces que cambian el estado conservan el resto:** se arman con la
  query de la página (`Astro.url`), cambiando solo lo suyo
  ([Listas paginadas y filtros](#7-listas-paginadas-y-filtros)).
- **Abrir un registro y volver** deja la lista como estaba: el enlace que lo
  abre le pasa la URL de la lista en `?back=`
  ([Normativa](../standards.md#rutas-y-navegación)).
- **Las pestañas se pintan todas,** y un `<script>` del componente cambia de
  una a otra y pone `?tab=` con `history.replaceState`; la página solo lee la
  que se abre al entrar.
<!-- kit:if i18n -->
- **El idioma va en la ruta** (`/en/account/bookings`), no en la query.
<!-- kit:end -->

### 7. Listas paginadas y filtros

Un listado pide una página cada vez, con la petición que sale de la query
([El estado de la pantalla en la URL](#6-el-estado-de-la-pantalla-en-la-url)).
Así lo pide «Mis reservas» (`src/pages/account/bookings/index.astro`), que
además lleva a la última página si la pedida ya no existe:

```ts
const { canView } = bookingPermissionUtils.getAccountBookingsPermissions(Astro.locals.session?.permissions ?? [])
const request = accountBookingsRequestUtils.buildAccountBookingsRequest(Astro.url.searchParams)
const [list] = canView ? await Promise.allSettled([bookingsService.getBookingsListPage(request)]) : []
const page = list?.status === 'fulfilled' ? list.value : null
const lastPage = page === null ? null : Math.max(1, page.totalPages)

if (lastPage !== null && request.page > lastPage) return Astro.redirect(paginationUtils.buildPageHref(Astro.url, lastPage))
```

- **La búsqueda va en un formulario `GET`** de la cabecera de la tabla, que
  funciona sin JavaScript: al enviarlo, sus campos pasan a la query y la
  página se pide otra vez. No lleva `page`, así que buscar vuelve a la
  página 1; el tamaño va en un campo oculto, para conservarlo
  ([D8](../ux-ui/rules.md#d8-listados-y-tablas)):

  ```astro
  <form method='get' role='search'>
    <input type='search' name='search' value={request.search} aria-label={t('account.bookings.search.label')} />
    <input type='hidden' name='pageSize' value={request.pageSize} />
  </form>
  ```

- **La búsqueda se lanza con Enter,** al enviar el formulario.
- **La paginación son enlaces,** con la misma query y otra `page`, y ofrece
  10, 25 o 50 filas. Los arma `paginationUtils.buildPageHref`
  (`src/utils/paginationUtils.ts`), que nace con la primera lista paginada:

  ```ts
  /**
   * Arma el enlace a otra página de una lista, con la misma query.
   * @param url La URL de la lista (`Astro.url`).
   * @param page La página, desde 1.
   * @returns La ruta, con su query y la página nueva.
   */
  function buildPageHref (url: URL, page: number): string {
    const query = new URLSearchParams(url.search)
    query.set('page', String(page))
    return `${url.pathname}?${query}`
  }

  export const paginationUtils = {
    buildPageHref,
  }
  ```

- **Una página que ya no existe** (se ha cancelado la última reserva de la
  última página, o la URL es vieja) lleva a la última que queda, con
  `Astro.redirect`: solo una página puede redirigir.
- **El orden** va en un enlace de la cabecera de cada columna, con la misma
  query, su `orderByField` y su `orderDirection`, y sin `page`.
- **«Quita los filtros»** es un enlace a la lista sin query
  (`Astro.url.pathname`).
- **Mientras llega la página nueva,** el navegador enseña su progreso y deja
  la anterior a la vista: no hay estado de recarga que pintar.

## Guardar

Guardar es una action; descargar un fichero, un endpoint. Los dos corren en el
servidor, con la sesión de la petición.

### 1. El guardado

Guardar la hora de llegada de una reserva, desde su gestión. La action va en
el fichero de su sección, `src/actions/accountActions.ts`:

```ts
import { ActionError, defineAction } from 'astro:actions'
import { bookingsService } from '@/services/bookings/bookingsService'
import { bookingPermissionUtils } from '@/utils/bookingPermissionUtils'
import { accountBookingsEditFormSchema } from './accountBookingsEditFormSchema'

export const accountActions = {
  /**
   * Guarda la hora de llegada y la nota de una reserva, desde el formulario de su gestión.
   * @throws {ActionError} `UNAUTHORIZED` sin sesión; `FORBIDDEN` sin permiso de editar.
   */
  updateBookingArrival: defineAction({
    accept: 'form',
    input: accountBookingsEditFormSchema,
    handler: async ({ id, arrivalTime, note }, context) => {
      const session = context.locals.session
      if (session === null) throw new ActionError({ code: 'UNAUTHORIZED' })
      if (!bookingPermissionUtils.getAccountBookingsEditPermissions(session.permissions).canEdit) throw new ActionError({ code: 'FORBIDDEN' })
      await bookingsService.updateBookingArrival(id, { arrivalTime, note })
    },
  }),
}
```

Y `src/actions/index.ts` la compone con las de las demás secciones:

```ts
import { accountActions } from './accountActions'
import { contactActions } from './contactActions'

export const server = {
  account: accountActions,
  contact: contactActions,
}
```

- **El formulario la llama sin JavaScript:** un `<form method='POST'>` en un
  componente `.astro`, cuya `action` es la de la action con la query de la
  página. Su schema, sus campos y sus errores:
  [Crear un formulario](./create-a-form.md#1-el-schema).
- **El middleware la ejecuta y hace el post/redirect/get,** como con
  cualquier formulario ([Enviar el formulario](./create-a-form.md#4-enviar-el-formulario)):
  si sale bien, responde con un 303 a la misma URL, con su query (`?tab=`,
  `?back=`); si falla, la página se pinta otra vez con el resultado
  (`Astro.getActionResult`). En la zona privada va después del de la sesión:
  `export const onRequest = sequence(session, actionForms)`.
- **Después de guardar, se lee de nuevo:** tras el 303, la página vuelve a
  pedir la reserva guardada. No hay caché que invalidar: «Mis reservas» se
  lee en cada petición, así que ya sale al día.
- **El aviso de que se ha guardado,** cuándo sale y cómo llega después del
  303: [Enviar el formulario](./create-a-form.md#4-enviar-el-formulario).
- **Nada se pinta como hecho antes de que el servidor lo confirme**
  ([D5](../ux-ui/rules.md#d5-acciones)): lo que se ve después de guardar es
  la respuesta.
- **Dos sesiones en la misma reserva:** gana la última que guarda, sin aviso
  ni bloqueo.
- **Su test** la llama como Astro, con `testUtils.callAction`
  ([Escribir tests](./write-tests.md#una-action)).

### 2. El fallo del guardado

Un aviso de fallo tiene dos partes ([D4](../ux-ui/rules.md#d4-avisos-y-fallos)):

- **El título** es «No se ha podido <verbo> <objeto>», sin punto, y es fijo:
  es de la zona («No se ha podido guardar la reserva»).
- **La descripción** dice el motivo y qué hacer, con punto: «Vuelve a
  intentarlo dentro de un rato.». Un código conocido de la API cambia la
  descripción, nunca el título
  ([Errores de la API](./add-a-service.md#errores-de-la-api)).
- **Lo escrito se queda:** la página se pinta otra vez con lo que se envió, y
  el formulario no se vacía ni se cierra.

La action convierte en un `ActionError` los fallos de la API que la pantalla
trata aparte, con el código de Astro que les toca (`NOT_FOUND` para un 404,
`CONFLICT` para un código conocido de la API), y deja pasar los demás, que
Astro da como `INTERNAL_SERVER_ERROR`. En el handler, después de comprobar
la sesión y el permiso:

```ts
try {
  await bookingsService.updateBookingArrival(id, { arrivalTime, note })
} catch (error) {
  if (apiErrorUtils.isNotFound(error)) throw new ActionError({ code: 'NOT_FOUND' })
  throw error
}
```

La página lee el resultado
(`Astro.getActionResult(actions.account.updateBookingArrival)`) y pasa su
`error` al formulario, que pinta el aviso encima de la barra de acciones:

```astro
---
const hasFailure = error !== undefined && !isInputError(error)
const isNotFound = error?.code === 'NOT_FOUND'
---

{hasFailure ? <PageAlert tone='error' title={t('account.bookingsEdit.failure')}>{isNotFound ? t('account.bookingsEdit.failureNotFound') : t('common.failure.generic')}</PageAlert> : null}
```

- **El error de un campo** (`isInputError(error)`) no va en el aviso: va bajo
  su campo ([Crear un formulario](./create-a-form.md#4-enviar-el-formulario)).
- **Si el registro ya no existe** al guardar o al actuar (`NOT_FOUND`), el
  aviso dice «Esta reserva ya no existe.», sin reintento y con el enlace a
  «Mis reservas»; lo escrito se sigue viendo hasta salir.
- **Desde el servidor no hay «sin conexión»:** un fallo de red es la API, que
  no responde, y lleva la descripción de cualquier otro fallo.
- **Dónde va cada fallo** (encima de la barra, al final de un modal, bajo un
  campo, bajo la cabecera) lo dice [D4](../ux-ui/rules.md#d4-avisos-y-fallos).
  Un fallo nunca va en el aviso efímero: se va solo, y un fallo hay que poder
  releerlo.

### 3. La exportación

La factura de una reserva la genera la API. La descarga un endpoint,
`src/pages/api/account/bookings/[id]/invoice.pdf.ts`, que comprueba la sesión
y el permiso y responde con el fichero:

```ts
import type { APIRoute } from 'astro'
import { bookingsService } from '@/services/bookings/bookingsService'
import { apiErrorUtils } from '@/utils/apiErrorUtils'
import { bookingPermissionUtils } from '@/utils/bookingPermissionUtils'

export const prerender = false

/**
 * GET /api/account/bookings/{id}/invoice.pdf. La factura de una reserva, en PDF.
 * @param context La petición: su parámetro y la sesión.
 * @returns El PDF, como descarga; sin permiso, un 403; si la reserva no existe, un 404.
 */
export const GET: APIRoute = async ({ params, locals }) => {
  if (!bookingPermissionUtils.getAccountBookingsEditPermissions(locals.session?.permissions ?? []).canView) return new Response(null, { status: 403 })
  const id = Number(params.id)
  if (!Number.isInteger(id)) return new Response(null, { status: 404 })
  try {
    const invoice = await bookingsService.downloadBookingInvoice(id)
    return new Response(invoice, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="reserva-${id}.pdf"` } })
  } catch (error) {
    if (apiErrorUtils.isNotFound(error)) return new Response(null, { status: 404 })
    throw error
  }
}
```

- **«Descarga la factura» es un enlace** al endpoint, con `download`
  (`` href={`/api/account/bookings/${id}/invoice.pdf`} ``): lleva a un
  fichero, no hace nada en la pantalla.
- **Si la reserva aún no tiene factura** (está pendiente), el enlace no se
  ofrece ([D5](../ux-ui/rules.md#d5-acciones)).
- **El endpoint aplica la regla otra vez:** esconder el enlace no protege la
  URL.
- **Si falla,** el endpoint responde con el estado del fallo y el navegador da
  la descarga por fallida; la página no cambia. La descarga es el aviso de
  que ha ido bien, sin aviso efímero.
- **Si el fichero lo genera la web** (un CSV), el endpoint monta las filas con
  una función de la raíz que escribe el fichero, una sola para toda la web,
  que nace con la primera: así todos los ficheros tienen el mismo formato.
- **Su test** va en
  `src/tests/pages/api/account/bookings/[id]/invoice.pdf.test.ts`, con la
  misma ruta que el endpoint.
<!-- kit:end -->

## Errores comunes

| Síntoma | Causa |
|---|---|
<!-- kit:if server -->
| La página enseña los datos de cuando se compiló | Le falta `export const prerender = false`, o la zona que cambia no va en una isla de servidor. |
| Un fallo de la API pinta la página de error entera | La página espera el service con un `await` suelto: con `Promise.allSettled`, elige el estado de la zona. |
| Si la API falla, desaparecen también las habitaciones | La página no pasa `null` a la zona que falla: decide el estado de toda la página con el resultado de una sola zona. |
| La página tarda lo que suman todas sus peticiones | Las pide con `await` seguidos, en lugar de a la vez. |
| Una página entera espera a una zona lenta | La zona no va en una isla de servidor (`server:defer`). |
<!-- kit:end -->
<!-- kit:if privateArea -->
| TypeScript dice que `value` no existe | Se lee `.value` fuera de la rama de `isLoaded`, donde el dato puede no haber llegado. |
| Un registro que no existe responde con un 200 | Falta `Astro.response.status = 404` con su estado. |
| Al volver de un registro, la lista ha perdido su búsqueda | El enlace no le pasa la URL de la lista en `?back=`, o la búsqueda no está en la query. |
| Buscar deja la lista en la página 5 | El formulario de la búsqueda lleva el campo `page`. |
| Una URL con `?page=abc` da un error | La query no pasa por el schema, con su `.catch`. |
| Al recargar después de guardar, el navegador pide reenviar el formulario | La respuesta no es el 303 del middleware. |
| Un fallo del guardado no se ve | La página no lee `Astro.getActionResult`, o no pasa su `error` al componente. |
| «Descarga la factura» descarga la de otra persona | El endpoint no aplica la regla, o la API no mira el token de la sesión. |
<!-- kit:end -->
<!-- kit:if !server -->
| `%%PM%% run build` falla al leer los datos | La API de `API_URL` no responde al compilar: el build la necesita. |
| Las noches libres no son las de hoy | Son las del último build: hay que compilar y publicar otra vez. |
| La URL de un registro nuevo no existe | `getStaticPaths` solo genera los que daba la API al compilar. |
| El build tarda lo que suman todas sus peticiones | Las pide con `await` seguidos, en lugar de a la vez. |
<!-- kit:end -->
| Un componente pide sus datos y falla la comprobación de la estructura | Los datos los pide la página y se los pasa por props. |
