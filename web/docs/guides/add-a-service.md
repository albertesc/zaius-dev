# Añadir un servicio

Esta guía añade una llamada a la API: el método del service, el schema de su
respuesta, el mock que la imita y la página que la pide. Sirve para quien
necesita un endpoint que el service aún no tiene. El ejemplo es
`getBookingsAvailability`, las noches libres de cada habitación, que pide
ROOMS (`/rooms`).
<!-- kit:if privateArea -->
El caso de un código de error concreto sale de la cancelación de una
reserva, en la zona privada.
<!-- kit:end -->
Al final están los puntos donde el transporte se adapta a la API del
proyecto.
<!-- kit:if privateArea -->
Una vez hecha la llamada, pedir el dato desde la página y guardarlo está en
<!-- kit:else -->
Una vez hecha la llamada, pedir el dato desde la página está en
<!-- kit:end -->
[Cargar y guardar datos](./load-and-save-data.md).

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- [1. El nombre](#1-el-nombre)
- [2. El schema de la respuesta](#2-el-schema-de-la-respuesta)
- [3. El método](#3-el-método)
- [4. El mock](#4-el-mock)
- [5. La página que lo pide](#5-la-página-que-lo-pide)
- [6. Los tests](#6-los-tests)
- [La llamada terminada](#la-llamada-terminada)
- **Casos especiales:** [Subir y descargar ficheros](#subir-y-descargar-ficheros) · [Errores de la API](#errores-de-la-api)
- [Puntos de adaptación a la API](#puntos-de-adaptación-a-la-api)
- [Errores comunes](#errores-comunes)

## 1. El nombre

El método va en el service de su entidad
(`services/bookings/bookingsService.ts`) y se llama
`<verbo><Entidad><Zona?><Qué>`
([Nomenclatura](../naming.md#services-schemas-y-caché)): un verbo, la entidad
del service justo detrás, la página que lo usa si es de una sola y lo que da.
El nombre dice qué hace con las palabras de la web, aunque el endpoint use
otras. Así se llaman los de `bookingsService`, con el tipo y el schema de lo
que devuelven:

| Endpoint | Método | Respuesta (tipo y schema) | Por qué se llama así |
|---|---|---|---|
| `GET /booking/availability` | `getBookingsAvailability` | `BookingsAvailability`, `bookingsAvailabilitySchema` | La piden ROOMS y, si la enseña, la portada: no lleva el nombre de ninguna. En plural, porque son las noches libres de todas las habitaciones. |
<!-- kit:if privateArea -->
| `POST /booking/list` | `getBookingsListPage` | `BookingsListPage`, `bookingsListPageSchema` | Una página de «Mis reservas», la única que la pide; es el índice de su sección, así que no lleva zona. En plural: son varias reservas. |
| `GET /booking/detail/{id}` | `getBookingDetail` | `BookingDetail`, `bookingDetailSchema` | Trata una sola reserva: la entidad, en singular. |
| `PUT /booking/cancel/{id}` | `cancelBooking` | Nada (`z.undefined()`) | Una acción sobre una reserva: el verbo y la entidad, en singular. |
| `GET /bookingCancelReason/select` | `getBookingCancelReasonsCatalog` | `BookingCancelReasonsCatalog`, `bookingCancelReasonsCatalogSchema` | Termina en `Catalog` porque es un `…/select`: las opciones de un campo de una reserva, en singular. |
<!-- kit:end -->

- **Singular o plural.** La entidad va en singular cuando el método trata un
  registro: su gestión, una acción sobre él o las opciones de uno de sus
<!-- kit:if privateArea -->
  campos (`getBookingDetail`, `cancelBooking`,
  `getBookingCancelReasonsCatalog`). Va en plural cuando trata varios: las
  noches libres de todas las habitaciones, una página de una lista, un CSV
  (`getBookingsAvailability`, `getBookingsListPage`).
<!-- kit:else -->
  campos. Va en plural cuando trata varios: las noches libres de todas las
  habitaciones (`getBookingsAvailability`), una página de una lista, un CSV.
<!-- kit:end -->
- **La zona.** Un método que solo usa una página lleva su prefijo detrás de
  la entidad. Uno que usan varias es **global**: no lleva ninguna
  (`getBookingsAvailability`) y su respuesta sirve para todas. El documento
  de cada página que lo pide lo dice, en su apartado «Datos»
  ([Páginas](../pages/README.md)).
- **Las palabras de la web, no las de la API:** si la API llama
  `reservation` a la reserva, el método sigue siendo de `booking`
  (`getBookingDetail`, para `GET /reservation/{id}`).
- **Un catálogo** es una lista de opciones de un selector (`…/select`) y su
  método termina en `Catalog`. Lo que se pide una vez pero no es una lista de
  opciones (las noches libres) no lo lleva. Un catálogo de otra entidad sin
  service propio vive en el de la sección que lo usó primero, con la entidad
  de ese service.
- **Dar de alta** es `create<Entidad>`: `createBooking` (varios a la vez,
  `createBookings`).

De ese nombre salen los demás, aquí con `getBookingsAvailability`:

| Pieza | Nombre |
|---|---|
| Tipo de la respuesta | `BookingsAvailability` |
| Schema de la respuesta | `bookingsAvailabilitySchema` |
| Tipo del cuerpo de la petición | `PageRequest` si es el cuerpo común de una página; si no, el método sin `get` más `Request` (`CancelBookingRequest`). Un `GET`, como este, no lleva cuerpo |
| Mock | La clave `"GET /booking/availability"` de `bookingsMocks.json` |

Para añadir un método nuevo, se comprueba primero que no exista ya con otro
nombre.

## 2. El schema de la respuesta

Los campos, sus nulos y sus enumerados se copian de la respuesta real del
endpoint. El schema va en el fichero de schemas de su zona,
`services/bookings/bookingsAvailabilitySchema.ts`. El tipo sale del schema; no
se escribe a mano:

```ts
import { z } from 'zod'

export const bookingsAvailabilitySchema = z.object({
  from: z.string(),
  to: z.string(),
  rooms: z.array(z.object({
    roomSlug: z.string(),
    freeDates: z.array(z.string()).nullable().transform((value) => value ?? []),
  })),
})

export type BookingsAvailability = z.infer<typeof bookingsAvailabilitySchema>
```

- **Cada habitación se reconoce por su `roomSlug`,** el mismo `slug` que
  tiene en `ROOMS` (`src/constants/rooms.ts`): la API da las noches libres, y
  la web, el nombre, las fotos y el precio.
- **Un campo que la API manda `null`** pero que se usa como recuento, lista o
  texto se normaliza aquí con `.transform` (`null` → `0`, `[]` o `''`): una
  habitación sin noches libres llega con `freeDates: []`, y nadie más tiene
  que comprobarlo.
- **Un enumerado numérico de la API** se declara como objeto `as const` con
  nombres de la web, en el fichero de lo que comparten las zonas de la entidad
  (`services/bookings/bookingsSchema.ts`):
  `BOOKING_STATUS = { pending: 0, confirmed: 1, cancelled: 2 }`, y se valida
  con `z.literal(Object.values(BOOKING_STATUS))`.
<!-- kit:if privateArea -->
- **Lo que comparten varias entidades** va en `src/schemas/commonSchema.ts`,
  que nace con lo primero que se comparte: la opción de un selector
  (`selectItemSchema`, `{ id, name }`), el cuerpo común de una página
  (`pageRequestSchema` y su tipo, `PageRequest`) y el schema de una página,
  que se arma con el de su fila:

```ts
export const pageRequestSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  search: z.string(),
  orderByField: z.string().optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
})

export type PageRequest = z.infer<typeof pageRequestSchema>

/**
 * Crea el schema de una página de un listado, como la da la API: las filas pedidas y los totales.
 * @param item El schema de una fila.
 * @returns El schema de la página.
 */
export function createPageSchema<T extends z.ZodType> (item: T) {
  return z.object({
    items: z.array(item),
    page: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
  })
}
```

Así, una página de «Mis reservas» es `createPageSchema(bookingsListRowSchema)`.
Si la API pagina de otra forma, se adapta en un solo sitio
([Puntos de adaptación a la API](#puntos-de-adaptación-a-la-api)).
<!-- kit:else -->
- **Lo que comparten varias entidades** va en `src/schemas/commonSchema.ts`,
  que nace con lo primero que se comparte (la opción de un selector,
  `selectItemSchema`, `{ id, name }`).
<!-- kit:end -->

## 3. El método

El service es un objeto de funciones de una línea. Cada método llama al
transporte con el verbo, la ruta, el schema que valida la respuesta y, si lo
hay, el cuerpo. Su JSDoc empieza por el endpoint:

```ts
import { apiUtils } from '@/utils/apiUtils'
import { bookingsAvailabilitySchema } from './bookingsAvailabilitySchema'

export const bookingsService = {
  /**
   * GET /booking/availability. Las noches libres de cada habitación, de hoy a 30 días.
   * @returns Las fechas libres de cada habitación, por su `roomSlug`.
   */
  getBookingsAvailability: () => apiUtils.request('GET', '/booking/availability', bookingsAvailabilitySchema),
}
```

<!-- kit:if privateArea -->
- `apiUtils.request(method, path, schema, body?)` añade el token de la
  sesión, si la hay, valida la respuesta con el schema y, si no es 2xx, lanza
  un fallo de la API ([Errores de la API](#errores-de-la-api)).
<!-- kit:else -->
- `apiUtils.request(method, path, schema, body?)` valida la respuesta con el
  schema y, si no es 2xx, lanza un fallo de la API
  ([Errores de la API](#errores-de-la-api)).
<!-- kit:end -->
  Con `USE_MOCKS=true` no llama a la API: responde con el JSON de los mocks
  ([El mock](#4-el-mock)), y valida igual.
- Un endpoint que no devuelve nada se valida con `z.undefined()`.
- El service no importa nada de `pages/`, `layouts/` ni `components/`: solo
  el transporte (`apiUtils`) y sus schemas.

## 4. El mock

Con `USE_MOCKS=true`, el transporte no llama a la API: responde con los
mocks. `%%PM%% run dev` y los tests van con ellos (`.env.development` y
`.env.test`). Todo endpoint que use la web tiene su respuesta en el JSON de
mocks de su service, al lado del service:
`services/bookings/bookingsMocks.json` ([Nomenclatura](../naming.md#mocks)).

```json
{
<!-- kit:if privateArea -->
  "GET /booking/detail/1287": { "id": 1287, "roomSlug": "encina", "arrivalDate": "2026-11-03", "departureDate": "2026-11-05", "guests": 2, "status": 1, "arrivalTime": "18:00", "note": "Llegamos con un perro pequeño." },
  "GET /booking/detail/:id": { "id": 1288, "roomSlug": "roble", "arrivalDate": "2026-12-26", "departureDate": "2026-12-30", "guests": 4, "status": 0, "arrivalTime": null, "note": null },
  "PUT /booking/cancel/:id": null,
  "GET /booking/invoice/:id": "Casa del Roble · Factura de la reserva #1287",
<!-- kit:end -->
  "GET /booking/availability": {
    "from": "2026-11-01",
    "to": "2026-11-30",
    "rooms": [
      { "roomSlug": "encina", "freeDates": ["2026-11-03", "2026-11-04", "2026-11-05"] },
      { "roomSlug": "castano", "freeDates": [] },
      { "roomSlug": "roble", "freeDates": null }
    ]
  }
}
```

- **La clave** es `"<MÉTODO> /ruta"`, como la pide el service, sin la query
  string. Un segmento variable va con `:` (`"GET /booking/detail/:id"`), y una
  ruta concreta gana a la de su `:param`: así un registro puede tener su
  propia respuesta (`"GET /booking/detail/1287"`).
- **La respuesta** tiene la forma real de la API, y la valida el schema del
  método, como la de la API. Un endpoint que no devuelve nada lleva `null`, y
  una descarga, el texto del fichero, que llega como un fichero de texto:
  sirve para probar el camino, no el fichero de verdad.
- **Es una respuesta fija.** Un listado da siempre la misma página, sin
  filtrar, ordenar ni paginar, y un alta o una cancelación responden bien,
  pero no cambian lo que dan las demás rutas. Lo que hace una página con otra
  respuesta (un fallo, una habitación sin noches libres) se prueba en su
  test, que simula el service
  ([Escribir tests](./write-tests.md#una-página)).
- **Los ids y los nombres que se cruzan casan:** los mocks son un solo
  mundo, como la base de datos, y casan también con los datos de la web:
  cada `roomSlug` es el de una habitación de `ROOMS`.
<!-- kit:if privateArea -->
  La persona de la sesión es una de las que conocen los mocks.
<!-- kit:end -->
  Cada mock se escribe a partir de los que ya hay.
- **Si el JSON crece mucho,** se parte por zona, como los schemas:
  `bookingsListMocks.json`, con las rutas de una zona. `apiMockUtils`
  (`src/utils/apiMockUtils.ts`) junta todos los `*Mocks.json` de `services/`:
  no hay que registrarlos en ningún sitio.
- **Cada respuesta espera como la red** (300 ms); en los tests, nada. Una ruta
  sin mock falla con «Sin mock para …», también en la consola.
- **El código de producción no los usa:** `USE_MOCKS` se fija al compilar, y
  `.env.production` lo deja en `false`.

## 5. La página que lo pide

La página que usa el dato lo pide en su frontmatter y pasa a sus componentes
lo que pintan. Si lo piden varias, cada una lo pide, sin importarse. La
llamada de ROOMS (`src/pages/rooms.astro`):

<!-- kit:if server -->
```astro
---
import { bookingsService } from '@/services/bookings/bookingsService'

export const prerender = false

const [result] = await Promise.allSettled([bookingsService.getBookingsAvailability()])
const availability = result.status === 'fulfilled' ? result.value : null
---
```
<!-- kit:else -->
```astro
---
import { bookingsService } from '@/services/bookings/bookingsService'

const availability = await bookingsService.getBookingsAvailability()
---
```
<!-- kit:end -->

<!-- kit:if server -->
- **Solo las páginas, los endpoints, las actions, el middleware y las islas
  de servidor llaman a los services:** un componente recibe el dato por
  props, y la comprobación de la estructura lo vigila.
<!-- kit:else -->
- **Solo las páginas llaman a los services:** un componente recibe el dato por
  props, y la comprobación de la estructura lo vigila.
<!-- kit:end -->
- **Si la página pide varios,** van a la vez
  ([Varios datos a la vez](./load-and-save-data.md#5-varios-datos-a-la-vez)).
<!-- kit:if server -->
- **Las noches libres cambian con cada reserva:** la página las pide en cada
  petición, y no se guardan en la caché de la ruta, o solo unos minutos, como
  diga el documento de la página
  ([Los catálogos](./load-and-save-data.md#4-los-catálogos)).
<!-- kit:else -->
- **Se pide en el build,** una vez por página: un cambio en la API se ve en
  el siguiente build.
<!-- kit:end -->

Cómo elige la página su estado (error, vacío, no existe) y el resto, en
[Cargar y guardar datos](./load-and-save-data.md).

## 6. Los tests

### El test del schema

Todo schema tiene su test, en el fichero de al lado
(`bookingsAvailabilitySchema.test.ts`). Comprueba que acepta la respuesta real
(la de su mock), con lo que normaliza, y que rechaza una que no tiene su
forma:

```ts
import { describe, expect, it } from 'vitest'
import { bookingsAvailabilitySchema } from './bookingsAvailabilitySchema'
import bookingsMocks from './bookingsMocks.json'

const availability = bookingsMocks['GET /booking/availability']

describe('bookingsAvailabilitySchema', () => {
  it('acepta la respuesta de la API, y una habitación con null queda sin noches libres', () => {
    expect(bookingsAvailabilitySchema.parse(availability).rooms[2]).toEqual({ roomSlug: 'roble', freeDates: [] })
  })

  it('rechaza una respuesta sin las habitaciones', () => {
    expect(() => bookingsAvailabilitySchema.parse({ ...availability, rooms: undefined })).toThrow()
  })
})
```

### El test del service

El service tiene su test al lado (`bookingsService.test.ts`), con un `it` por
método. Lo llama contra los mocks y comprueba que responde lo que da su
mock: el test recorre a la vez el método, su ruta, su mock y su schema.

```ts
import { describe, expect, it } from 'vitest'
import { bookingsService } from './bookingsService'

describe('bookingsService', () => {
  it('getBookingsAvailability responde con las noches libres de cada habitación', async () => {
    const availability = await bookingsService.getBookingsAvailability()

    expect(availability.rooms[0]).toEqual({ roomSlug: 'encina', freeDates: ['2026-11-03', '2026-11-04', '2026-11-05'] })
  })
})
```

Cada método nuevo del service añade su `it`. Más casos en
[Escribir tests](./write-tests.md#un-service).

## La llamada terminada

Con las piezas que nombra esta guía, `getBookingsAvailability` queda así en
`services/`:

```text
services/bookings/
├── bookingsService.ts                   getBookingsAvailability
├── bookingsService.test.ts              su it, contra el mock
├── bookingsAvailabilitySchema.ts        bookingsAvailabilitySchema y el tipo BookingsAvailability
├── bookingsAvailabilitySchema.test.ts   acepta su mock y rechaza lo que no tiene su forma
└── bookingsMocks.json                   "GET /booking/availability": la respuesta, con la forma real de la API
```

La llamada no está en `services/`: la hace la página que pide el dato, ROOMS
(`src/pages/rooms.astro`).

## Casos especiales

Dos casos que no entran en todo método: el que sube o descarga un fichero y
el que trata un código de error concreto de la API.

### Subir y descargar ficheros

<!-- kit:if privateArea -->
- **Subir:** `apiUtils.upload(path, schema, formData, { onProgress, signal })`,
  con `POST`, desde la action que recibe el formulario con el fichero. Va por
  `fetch`, desde el servidor, así que no hay progreso: `onProgress` recibe el
  100 % al terminar. Su mock es la respuesta de `POST` de la ruta en el JSON.
- **Descargar:** `apiUtils.download(method, path, body?)` devuelve un `Blob`
  sin validar, que el endpoint de la descarga devuelve tal cual
  ([La exportación](./load-and-save-data.md#3-la-exportación)). La factura de
  una reserva:

  ```ts
  /**
   * GET /booking/invoice/{id}. La factura de una reserva, en PDF.
   * @param id Id de la reserva.
   * @returns El PDF, como `Blob`, sin validar.
   * @throws {ApiError} 404 si la reserva no existe o no es de la persona de la sesión.
   */
  downloadBookingInvoice: (id: number) => apiUtils.download('GET', `/booking/invoice/${id}`),
  ```
<!-- kit:else -->
<!-- kit:if server -->
- **Subir:** `apiUtils.upload(path, schema, formData, { onProgress, signal })`,
  con `POST`, desde la action que recibe el formulario con el fichero. Va por
  `fetch`, desde el servidor, así que no hay progreso: `onProgress` recibe el
  100 % al terminar. Su mock es la respuesta de `POST` de la ruta en el JSON.
- **Descargar:** `apiUtils.download(method, path, body?)` devuelve un `Blob`
  sin validar, que un endpoint de `src/pages/api/` devuelve tal cual.
- **Los dos piden sin token:** lo que es de una persona (sus reservas, sus
  facturas) llega con la zona privada, con `%%KIT_RUN%% change`.
<!-- kit:else -->
Sin servidor, la web no sube ni descarga nada de la API: después del build no
hay quien lo pida. `apiUtils.upload` y `apiUtils.download` sirven con el
servidor, que llega con `%%KIT_RUN%% change`.
<!-- kit:end -->
<!-- kit:end -->

### Errores de la API

Un fallo de la API (el tipo `ApiError`, en `src/types/api.ts`) lleva el
`status` de la respuesta y el `code` que manda la API en su cuerpo
(`BOOKING_NOT_FOUND`), o `null` si no lo trae. Lo crea el transporte, y se lee
con `apiErrorUtils` (`src/utils/apiErrorUtils.ts`): `isApiError(error)`,
`isNotFound(error)` (un fallo con 404) y `getRequestFailure(error)`, que da
`'network'` si no se ha llegado al servidor y `'generic'` en cualquier otro
caso. `readErrorCode(body)` lee el `code` del cuerpo, y un test crea un fallo
igual con `buildError(status, code)`.

<!-- kit:if privateArea -->
- **Un `401` cierra la sesión,** y no lo hace la página: el transporte avisa a
  la sesión de la petición, la que el middleware le da con
  `apiSessionUtils.run({ getToken, onEnd }, next)`, con `expired`, y el
  middleware borra la cookie y lleva al login, con el aviso de que ha
  caducado ([D10](../ux-ui/rules.md#d10-navegación)). En una página pública,
  sin sesión, no pasa nada
  ([Aplicar permisos](./apply-permissions.md#lo-que-da-la-sesión)).
- **Un 404 de un registro** se reconoce con `apiErrorUtils.isNotFound(error)`.
  Al cargar, la página pinta su estado de registro que no existe
  ([Carga, error y vacío](./load-and-save-data.md#3-carga-error-y-vacío)); al
  guardar o al actuar, el aviso de que ya no existe
  ([El fallo del guardado](./load-and-save-data.md#2-el-fallo-del-guardado)).
<!-- kit:else -->
- **Un 404** se reconoce con `apiErrorUtils.isNotFound(error)`: lo que se
  pedía no existe
  ([Carga, error y vacío](./load-and-save-data.md#3-carga-error-y-vacío)).
<!-- kit:end -->
- **Si la página trata un código concreto,** el método lo documenta en su
  `@throws` y la constante del código vive con los schemas de su entidad
  (`BOOKING_ERROR_CODE`, en `bookingsSchema.ts`). El código cambia la
  descripción del aviso, nunca su título
  ([D4](../ux-ui/rules.md#d4-avisos-y-fallos)).

<!-- kit:if privateArea -->
Un código concreto, de punta a punta. Cancelar una reserva falla con
`409 BOOKING_CANCEL_TOO_LATE` si ya ha pasado el plazo para cancelarla. El
código es una constante con nombre de la web, en el fichero de lo que
comparten las zonas de la entidad, `services/bookings/bookingsSchema.ts`,
junto a los demás códigos de las reservas que trata la web:

```ts
export const BOOKING_ERROR_CODE = {
  notFound: 'BOOKING_NOT_FOUND',
  cancelTooLate: 'BOOKING_CANCEL_TOO_LATE',
} as const
```

El método lo documenta en su `@throws`:

```ts
/**
 * PUT /booking/cancel/{id}. Cancela una reserva, si aún se está a tiempo.
 * @param id Id de la reserva.
 * @param request El motivo de la cancelación.
 * @throws {ApiError} 409 BOOKING_CANCEL_TOO_LATE si ha pasado el plazo para cancelarla.
 */
cancelBooking: (id: number, request: CancelBookingRequest) => apiUtils.request('PUT', `/booking/cancel/${id}`, z.undefined(), request),
```

La action que cancela, `cancelBooking`, es de la sección (`accountActions`),
porque se cancela desde «Mis reservas» y desde la gestión de la reserva. En su
handler, después de comprobar la sesión y el permiso, compara el fallo con la
constante: con ese código, lanza un `ActionError` con `CONFLICT`; cualquier
otro fallo sigue su camino, y Astro lo da como un error del servidor:

```ts
try {
  await bookingsService.cancelBooking(id, { reasonId })
} catch (error) {
  const isTooLate = apiErrorUtils.isApiError(error) && error.code === BOOKING_ERROR_CODE.cancelTooLate
  if (isTooLate) throw new ActionError({ code: 'CONFLICT' })
  throw error
}
```

<!-- kit:if i18n -->
La página lee el resultado
(`Astro.getActionResult(actions.account.cancelBooking)`) y pasa su `error` al
modal (`BookingCancelModal.astro`), que pinta el aviso al final del cuerpo,
encima del pie, con el título fijo de la acción («No se ha podido cancelar la
reserva», `booking.cancel.failure`) y la descripción que toca. El modal sigue
abierto ([D9](../ux-ui/rules.md#d9-modales)):

```astro
---
const hasFailure = error !== undefined
const isTooLate = error?.code === 'CONFLICT'
---

{hasFailure ? <PageAlert tone='error' title={t('booking.cancel.failure')}>{isTooLate ? t('booking.cancel.failureTooLate') : t('common.failure.generic')}</PageAlert> : null}
```
<!-- kit:else -->
La página lee el resultado
(`Astro.getActionResult(actions.account.cancelBooking)`) y pasa su `error` al
modal (`BookingCancelModal.astro`), que escribe sus textos: al final del
cuerpo, encima del pie, el título fijo de la acción y la descripción que
toca. El modal sigue abierto ([D9](../ux-ui/rules.md#d9-modales)):

```astro
---
const hasFailure = error !== undefined
const isTooLate = error?.code === 'CONFLICT'
---

{hasFailure
  ? (
    <PageAlert tone='error' title='No se ha podido cancelar la reserva'>
      {isTooLate ? 'Ya ha pasado el plazo para cancelarla: llámanos y lo vemos.' : 'Vuelve a intentarlo dentro de un rato.'}
    </PageAlert>
    )
  : null}
```
<!-- kit:end -->

Qué hace un guardado con un fallo, en general:
[El fallo del guardado](./load-and-save-data.md#2-el-fallo-del-guardado).

<!-- kit:end -->
## Puntos de adaptación a la API

<!-- kit:if privateArea -->
El transporte (`apiUtils`, `apiErrorUtils` y `apiSessionUtils`, en
`src/utils/`) supone una API con unas convenciones concretas.
<!-- kit:else -->
El transporte (`apiUtils` y `apiErrorUtils`, en `src/utils/`) supone una API
con unas convenciones concretas.
<!-- kit:end -->
Si la del proyecto es distinta en alguna, se cambia en un solo sitio y el
resto de la web no se entera:

| Qué | Dónde | Por defecto |
|---|---|---|
| La dirección de la API | `API_URL`, en cada `.env.<modo>` | `http://localhost:3000/api` |
| El idioma que se manda a la API | `getHeaders`, en `apiUtils.ts` | No se manda |
| La forma del cuerpo de error | `readErrorCode`, en `apiErrorUtils.ts` | `{ code }` |
<!-- kit:if privateArea -->
| Cómo va el token | `getHeaders`, en `apiUtils.ts` | `Authorization: Bearer <token>`, si hay sesión |
| Qué estado cierra la sesión | `endOnError`, en `apiSessionUtils.ts` | 401 → `expired` |
| La forma de una página | El schema de página de `commonSchema.ts` y las páginas de los `*Mocks.json` | `{ items, page, pageSize, totalItems, totalPages }` |
<!-- kit:end -->

- **La dirección.** `API_URL` es la base de todas las rutas; la declara
  `env.schema`, en `astro.config.ts`, y se lee de `astro:env/server`, así que
  nunca llega al navegador.
- **El idioma.** Si la API traduce lo que devuelve (un catálogo, unos textos)
  y necesita saber en qué idioma, `getHeaders` (`apiUtils.ts`), que arma lo
  que lleva toda petición, lo añade como pida la API: una cabecera
  (`Accept-Language`) o un parámetro de la query string.
- **El error.** `apiErrorUtils.readErrorCode(body)` lee el código del cuerpo
  de una respuesta de error. Si la API lo manda de otra forma
  (`{ error: { code } }`, `{ errorCode }`), se cambia ahí, y el `code` del
  fallo sigue queriendo decir lo mismo en toda la web.
<!-- kit:if privateArea -->
- **El token.** `getHeaders` lo toma de la sesión de la petición
  (`apiSessionUtils.getToken`) y lo manda como `Authorization: Bearer`; si la
  API lo pide de otra forma, se cambia ahí.
- **La sesión.** `apiSessionUtils.endOnError(error)` decide qué fallos cierran
  la sesión y con qué motivo; por defecto, solo un `401`, con `expired`. Si la
  API la cierra con otro estado, se añade ahí, con su motivo, y la sesión
  decide qué aviso da.
- **La página.** El schema de página de `commonSchema.ts`
  (`createPageSchema`) describe la página como la da la API, y las páginas de
  los `*Mocks.json` tienen esa misma forma: cambian siempre juntos, con el
  cuerpo de la petición (`PageRequest`).
<!-- kit:end -->

## Errores comunes

| Síntoma | Causa |
|---|---|
| «Sin mock para GET /…» en la consola | Falta su clave en el `<entidad>Mocks.json` del service, o no coincide con el método y la ruta (sin la query string, que no cuenta). |
| La página dice error aunque la API responde | La respuesta no cumple el schema: comprueba el campo que falla en el `ZodError` de la consola. |
| Funciona con los mocks y falla contra la API | El JSON del mock no tiene la forma real de la API. |
| Una habitación sale sin sus noches libres | Su `roomSlug` en la API no es el `slug` que tiene en `ROOMS`. |
| Un fallo de la API llega sin `code` | El cuerpo de error no tiene la forma que lee `apiErrorUtils.readErrorCode`: se adapta ahí. |
<!-- kit:if !server -->
| `%%PM%% run build` falla con «Sin mock para …» o sin conexión | El build lee la API de `API_URL`: tiene que responder al compilar, o `USE_MOCKS=true` en `.env.production.local` para una demo. |
<!-- kit:end -->
<!-- kit:if privateArea -->
| La API da la sesión por terminada y la web sigue como si nada | El middleware no corre la petición con `apiSessionUtils.run`, o la API la cierra con un estado que `apiSessionUtils.endOnError` no mira. |
<!-- kit:end -->
