# Añadir un servicio

<!-- kit:if mocks -->
Esta guía añade una llamada a la API: el método del service, el schema de su
respuesta, el mock que la imita y la clave con la que se consulta.
<!-- kit:else -->
Esta guía añade una llamada a la API: el método del service, el schema de su
respuesta y la clave con la que se consulta.
<!-- kit:end -->
Sirve para quien necesita un endpoint que el service aún no tiene. El ejemplo
es `getOrdersFilters`, los filtros de la barra que da la API (estados,
transportistas y almacenes), que piden `orders` y `ordersDashboard`; el
caso de un código de error concreto sale de la cancelación de un pedido. Al
final están los puntos donde el transporte se adapta a la API del proyecto.
Una vez hecha la llamada, pedir el dato desde la feature y guardarlo está en
[Cargar y guardar datos](./load-and-save-data.md).

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- [1. El nombre](#1-el-nombre)
- [2. El schema de la respuesta](#2-el-schema-de-la-respuesta)
- [3. El método](#3-el-método)
<!-- kit:if mocks -->
- [4. El mock](#4-el-mock)
- [5. La consulta](#5-la-consulta)
- [6. Los tests](#6-los-tests)
<!-- kit:else -->
- [4. La consulta](#4-la-consulta)
- [5. Los tests](#5-los-tests)
<!-- kit:end -->
- [La llamada terminada](#la-llamada-terminada)
- **Casos especiales:** [Subir y descargar ficheros](#subir-y-descargar-ficheros) · [Errores de la API](#errores-de-la-api)
- [Puntos de adaptación a la API](#puntos-de-adaptación-a-la-api)
- [Errores comunes](#errores-comunes)

## 1. El nombre

El método va en el service de su entidad (`services/orders/ordersService.ts`)
y se llama `<verbo><Entidad><Zona?><Qué>`
([Nomenclatura](../naming.md#services-schemas-y-claves-de-consulta)): un
verbo, la entidad del service justo detrás, la pantalla que lo usa si es de
una sola y lo que da. El nombre dice qué hace en el lenguaje de la app, aunque
el endpoint use otras palabras. Así se llaman seis de `ordersService`, con el
tipo y el schema de lo que devuelven:

| Endpoint | Método | Respuesta (tipo y schema) | Por qué se llama así |
|---|---|---|---|
| `GET /order/filters` | `getOrdersFilters` | `OrdersFilters`, `ordersFiltersSchema` | La piden `orders` y `ordersDashboard`: no lleva el nombre de ninguna. En plural, porque son los filtros de varios pedidos. |
| `POST /order/search` | `getOrdersListPage` | `OrdersListPage`, `ordersListPageSchema` | Una página de la lista de pedidos, que solo pide el índice, `orders`. En plural: son varios pedidos. |
| `POST /order/dashboard/status` | `getOrdersStatus` | `OrdersStatus`, `ordersStatusSchema` | El recuento por estado lo piden el análisis y la portada: sin zona. |
| `GET /order/detail/{id}` | `getOrderDetail` | `OrderDetail`, `orderDetailSchema` | Trata un solo pedido: la entidad, en singular. |
| `PUT /order/cancel/{id}` | `cancelOrder` | Nada (`z.undefined()`) | Una acción sobre un pedido: el verbo y la entidad, en singular. |
| `GET /orderEndReason/select` | `getOrderCloseReasonsCatalog` | `OrderCloseReasonsCatalog`, `orderCloseReasonsCatalogSchema` | Termina en `Catalog` porque es un `…/select`: las opciones de un campo de un pedido, en singular. La ruta dice «end»; la app, «close». |

- **Singular o plural.** La entidad va en singular cuando el método trata un
  registro: su gestión, una acción sobre él o las opciones de uno de sus
  campos (`getOrderDetail`, `cancelOrder`, `getOrderCloseReasonsCatalog`). Va
  en plural cuando trata varios: una página, un análisis, un filtro de la
  barra, un CSV (`getOrdersListPage`, `getOrdersStatus`,
  `exportOrdersListCsv`).
- **La zona.** Un método que solo usa una feature lleva su pantalla detrás de
  la entidad (`getOrderEditLines`). Uno que usan varias
  es **global**: no lleva ninguna (`getOrdersFilters`, `getOrdersStatus`) y su
  respuesta sirve para todas. El documento de cada feature marca cuál es cuál.
- **Un catálogo** es una lista de opciones de un selector (`…/select`) y su
  método termina en `Catalog`. Lo que se pide una vez pero no es una lista de
  opciones (la configuración de la empresa, `getCompanyConfig`) no lo lleva.
  Un catálogo de otra entidad sin service propio vive en el de la familia que
  lo usó primero, con la entidad de ese service
  (`getOrderCarriersCatalog`).
- **Dar de alta** es `create<Entidad>`: `createOrder` (varios a la vez,
  `createOrders`).

De ese nombre salen los demás, aquí con `getOrdersFilters`:

| Pieza | Nombre |
|---|---|
| Tipo de la respuesta | `OrdersFilters` |
| Schema de la respuesta | `ordersFiltersSchema` |
| Tipo del cuerpo de la petición | `PageRequest` si es el cuerpo común de una página; si no, el método sin `get` más `Request` (`CancelOrderRequest`). Un `GET`, como este, no lleva cuerpo |
<!-- kit:if mocks -->
| Mock | La clave `"GET /order/filters"` de `ordersMocks.json` |
<!-- kit:end -->
| Clave de consulta | `['ordersService', 'getOrdersFilters']` |

Para añadir un método nuevo, se comprueba primero que no exista ya con otro
nombre.

## 2. El schema de la respuesta

<!-- kit:if api -->
Los campos, sus nulos y sus enumerados se copian del contrato del endpoint, en
[API](../api/README.md) (el documento de su zona, `docs/api/<zona>.md`).
<!-- kit:else -->
Los campos, sus nulos y sus enumerados se copian de la respuesta real del
endpoint.
<!-- kit:end -->
El schema va en el fichero de schemas de su zona,
`services/orders/ordersFiltersSchema.ts` (los filtros de la barra de la
familia). El tipo sale del schema; no se escribe a mano:

```ts
import { z } from 'zod'
import { selectItemSchema } from '@/schemas/commonSchema'

export const ordersFiltersSchema = z.object({
  statuses: z.array(selectItemSchema),
  carriers: z.array(selectItemSchema),
  warehouses: z.array(selectItemSchema),
})

export type OrdersFilters = z.infer<typeof ordersFiltersSchema>
```

- **Un campo que la API manda `null`** pero que se usa como recuento, lista o
  texto se normaliza aquí con `.transform` (`null` → `0`, `[]` o `''`), para
  que nadie más tenga que comprobarlo.
- **Un enumerado numérico de la API** se declara como objeto `as const` con
  nombres de la app, en el fichero de lo que comparten las zonas de la entidad
  (`services/orders/ordersSchema.ts`):
  `ORDER_STATUS = { pending: 0, preparing: 1, shipped: 2, delivered: 3, cancelled: 4 }`,
  y se valida con `z.literal(Object.values(ORDER_STATUS))`.
- **Lo que comparten varias entidades** va en `src/schemas/commonSchema.ts`,
  que nace con la primera feature que lo necesita: la opción de un selector
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

Así, la página del listado es `createPageSchema(ordersListRowSchema)`. Si la
API pagina de otra forma, se adapta en un solo sitio
([Puntos de adaptación a la API](#puntos-de-adaptación-a-la-api)).

## 3. El método

El service es un objeto de funciones de una línea. Cada método llama al
transporte con el verbo, la ruta, el schema que valida la respuesta y, si lo
hay, el cuerpo. Su JSDoc empieza por el endpoint:

```ts
import { apiUtils } from '@/utils/apiUtils'
import { ordersFiltersSchema } from './ordersFiltersSchema'

export const ordersService = {
  /**
   * GET /order/filters. Los filtros que da la API para la barra de los pedidos.
   * @returns Los estados, los transportistas y los almacenes, cada uno con sus opciones.
   */
  getOrdersFilters: () => apiUtils.request('GET', '/order/filters', ordersFiltersSchema),
}
```

<!-- kit:if mocks -->
- `apiUtils.request(method, path, schema, body?)` añade el token de la
  sesión, valida la respuesta con el schema y, si no es 2xx, lanza un fallo de
  la API ([Errores de la API](#errores-de-la-api)). Con `VITE_USE_MOCKS=true`
  no llama a la API: responde con el JSON de los mocks
  ([El mock](#4-el-mock)), y valida igual.
<!-- kit:else -->
- `apiUtils.request(method, path, schema, body?)` añade el token de la
  sesión, valida la respuesta con el schema y, si no es 2xx, lanza un fallo de
  la API ([Errores de la API](#errores-de-la-api)).
<!-- kit:end -->
- Un endpoint que no devuelve nada se valida con `z.undefined()`.
- El service no importa nada de `features/`, `domains/`, `hooks/` ni
  `components/`: solo el transporte (`apiUtils`) y sus schemas.

<!-- kit:if mocks -->
## 4. El mock

Con `VITE_USE_MOCKS=true`, el transporte no llama a la API: responde con los
mocks. Todo endpoint que use la app tiene su respuesta en el JSON de mocks de
su service, al lado del service: `services/orders/ordersMocks.json`
([Nomenclatura](../naming.md#mocks)).

```json
{
  "GET /order/filters": {
    "statuses": [{ "id": 0, "name": "Pendiente" }, { "id": 1, "name": "En preparación" }],
    "carriers": [{ "id": 3, "name": "Transportes del Norte" }],
    "warehouses": [{ "id": 1, "name": "Almacén central" }]
  },
  "GET /order/detail/1287": { "id": 1287, "customerId": 7, "carrierId": 3, "orderDate": "2026-03-10", "deliveryDate": null, "shippingCost": 12.5, "notes": "Entregar por la mañana.", "lines": [] },
  "GET /order/detail/:id": { "id": 1288, "customerId": 7, "carrierId": null, "orderDate": "2026-03-11", "deliveryDate": null, "shippingCost": 0, "notes": null, "lines": [] },
  "PUT /order/cancel/:id": null,
  "POST /order/exportCsv": "Núm.;Estado\n1287;Pendiente"
}
```

- **La clave** es `"<MÉTODO> /ruta"`, como la pide el service, sin la query
  string. Un segmento variable va con `:` (`"GET /order/detail/:id"`), y una
  ruta concreta gana a la de su `:param`: así un registro puede tener su
  propia respuesta (`"GET /order/detail/1287"`).
- **La respuesta** tiene la forma real de la API, y la valida el schema del
  método, como la de la API. Un endpoint que no devuelve nada lleva `null`, y
  una descarga, el texto del fichero.
- **Es una respuesta fija.** Un listado da siempre la misma página, sin
  filtrar, ordenar ni paginar, y un alta o una cancelación responden bien,
  pero no cambian lo que dan las demás rutas.
  Lo que hace una pantalla con otra respuesta (un fallo, un listado vacío)
  se prueba en su test, que simula el service
  ([Escribir tests](./write-tests.md#una-página)).
- **Los ids y los nombres que se cruzan entre services casan:** los mocks son
  un solo mundo, como la base de datos. Un pedido solo usa clientes,
  almacenes, transportistas y opciones de catálogo que están en sus mocks, y
  la persona de la sesión es una de las que conocen los mocks. Cada mock se
  escribe a partir de los que ya hay.
- **Si el JSON crece mucho,** se parte por zona, como los schemas:
  `ordersEditMocks.json`, con las rutas de la gestión. `apiMockUtils`
  (`src/utils/apiMockUtils.ts`) junta todos los `*Mocks.json` de `services/`:
  no hay que registrarlos en ningún sitio.
- **Cada respuesta espera como la red** (300 ms); en los tests, nada. Una ruta
  sin mock falla con «Sin mock para …», también en la consola.

## 5. La consulta
<!-- kit:else -->
## 4. La consulta
<!-- kit:end -->

La feature que lo usa pide el dato desde un hook, con la clave
`[service, método, ...parámetros]`. Si lo usan varias features de una
familia, el hook es de su `common`: los filtros de la API los pide
`useOrderFilters` (`orders/common`), que usan `orders` y
`ordersDashboard`. Su consulta de `getOrdersFilters`:

```ts
const filters = useQuery({
  queryKey: ['ordersService', 'getOrdersFilters'],
  queryFn: ordersService.getOrdersFilters,
  staleTime: Infinity,
})
```

- **`staleTime: Infinity`:** los filtros no cambian mientras dura la sesión,
  así que se piden una vez
  ([Los catálogos](./load-and-save-data.md#4-los-catálogos)).
<!-- kit:if i18n -->
- **El idioma, si la API traduce.** Por defecto la app no manda su idioma a
  la API. Si el proyecto lo manda
  ([Puntos de adaptación a la API](#puntos-de-adaptación-a-la-api)) y la API
  traduce lo que devuelve, el idioma va en la clave
  (`['ordersService', 'getOrdersFilters', i18n.language]`), para que cambiar
  de idioma lo pida de nuevo.
<!-- kit:end -->

Un método lo pide un hook de la feature que lo usa: `getOrdersStatus`, el
recuento por estado, lo pide en `ordersDashboard` `useOrdersDashboardStatus`,
que lo comparte entre la cabecera y su tarjeta. Si un dato lo piden varias
features, cada una lo pide desde su hook con la misma clave: la portada pide
`getOrdersStatus` desde el suyo con la misma clave que el análisis, así que,
con el mismo cuerpo, la petición sale una sola vez y ninguna importa de la
otra. Cómo se usan la carga, los errores, los catálogos y los guardados:
[Cargar y guardar datos](./load-and-save-data.md).

<!-- kit:if mocks -->
## 6. Los tests
<!-- kit:else -->
## 5. Los tests
<!-- kit:end -->

### El test del schema

<!-- kit:if mocks -->
Todo schema tiene su test, en el fichero de al lado
(`ordersFiltersSchema.test.ts`). Comprueba que acepta la respuesta real (la
de su mock) y que rechaza una que no tiene su forma:

```ts
import { describe, expect, it } from 'vitest'
import { ordersFiltersSchema } from './ordersFiltersSchema'
import ordersMocks from './ordersMocks.json'

const ordersFilters = ordersMocks['GET /order/filters']

describe('ordersFiltersSchema', () => {
  it('acepta la respuesta de la API', () => {
    expect(ordersFiltersSchema.parse(ordersFilters)).toEqual(ordersFilters)
  })

  it('rechaza una respuesta sin los almacenes', () => {
    expect(() => ordersFiltersSchema.parse({ ...ordersFilters, warehouses: undefined })).toThrow()
  })
})
```
<!-- kit:else -->
Todo schema tiene su test, en el fichero de al lado
(`ordersFiltersSchema.test.ts`). Comprueba que acepta una respuesta con la
forma real, escrita en el propio test, y que rechaza una que no la tiene:

```ts
import { describe, expect, it } from 'vitest'
import { ordersFiltersSchema } from './ordersFiltersSchema'

const ORDERS_FILTERS = {
  statuses: [{ id: 0, name: 'Pendiente' }],
  carriers: [{ id: 3, name: 'Transportes del Norte' }],
  warehouses: [{ id: 1, name: 'Almacén central' }],
}

describe('ordersFiltersSchema', () => {
  it('acepta la respuesta de la API', () => {
    expect(ordersFiltersSchema.parse(ORDERS_FILTERS)).toEqual(ORDERS_FILTERS)
  })

  it('rechaza una respuesta sin los almacenes', () => {
    expect(() => ordersFiltersSchema.parse({ ...ORDERS_FILTERS, warehouses: undefined })).toThrow()
  })
})
```
<!-- kit:end -->

### El test del service

<!-- kit:if mocks -->
El service tiene su test al lado (`ordersService.test.ts`), con un `it` por
método. Lo llama contra los mocks y comprueba que responde lo que da su
mock: el test recorre a la vez el método, su ruta, su mock y su schema.

```ts
import { describe, expect, it } from 'vitest'
import ordersMocks from './ordersMocks.json'
import { ordersService } from './ordersService'

describe('ordersService', () => {
  it('getOrdersFilters responde con los filtros de la API', async () => {
    expect(await ordersService.getOrdersFilters()).toEqual(ordersMocks['GET /order/filters'])
  })
})
```

Cada método nuevo del service añade su `it`. Más casos en
[Escribir tests](./write-tests.md#un-service).
<!-- kit:else -->
El service tiene su test al lado (`ordersService.test.ts`), con un `it` por
método. El test pisa `fetch` con una respuesta de ejemplo y comprueba la
petición que sale y lo que devuelve el método: recorre a la vez el método, su
ruta y su schema.

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ordersService } from './ordersService'

const ORDERS_FILTERS = {
  statuses: [{ id: 0, name: 'Pendiente' }],
  carriers: [{ id: 3, name: 'Transportes del Norte' }],
  warehouses: [{ id: 1, name: 'Almacén central' }],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ordersService', () => {
  it('getOrdersFilters pide GET /order/filters y devuelve los filtros', async () => {
    const serverFetch = vi.fn(async () => Response.json(ORDERS_FILTERS))
    vi.stubGlobal('fetch', serverFetch)

    expect(await ordersService.getOrdersFilters()).toEqual(ORDERS_FILTERS)
    expect(serverFetch).toHaveBeenCalledWith(expect.stringMatching(/\/order\/filters$/), expect.objectContaining({ method: 'GET' }))
  })
})
```

Cada método nuevo del service añade su `it`. Más casos en
[Escribir tests](./write-tests.md#un-service).
<!-- kit:end -->

## La llamada terminada

Con las piezas que nombra esta guía, `getOrdersFilters` queda así en
`services/`:

<!-- kit:if mocks -->
```text
services/orders/
├── ordersService.ts                getOrdersFilters
├── ordersService.test.ts           su it, contra el mock
├── ordersFiltersSchema.ts          ordersFiltersSchema y el tipo OrdersFilters
├── ordersFiltersSchema.test.ts     acepta su mock y rechaza lo que no tiene su forma
└── ordersMocks.json                "GET /order/filters": la respuesta, con la forma real de la API
```
<!-- kit:else -->
```text
services/orders/
├── ordersService.ts                getOrdersFilters
├── ordersService.test.ts           su it, con fetch pisado
├── ordersFiltersSchema.ts          ordersFiltersSchema y el tipo OrdersFilters
└── ordersFiltersSchema.test.ts     acepta la respuesta de ejemplo y rechaza lo que no tiene su forma
```
<!-- kit:end -->

La consulta no está en `services/`: la escribe el hook que pide el dato. La de
`getOrdersFilters` está en `useOrderFilters`, en `orders/common/hooks/`,
porque la piden las dos features de la familia.

## Casos especiales

Dos casos que no entran en todo método: el que sube o descarga un fichero y
el que trata un código de error concreto de la API.

### Subir y descargar ficheros

<!-- kit:if mocks -->
- **Subir:** `apiUtils.upload(path, schema, formData, { onProgress, signal })`,
  con `POST`. Va por `XMLHttpRequest` para dar el progreso (`onProgress`
  recibe el porcentaje enviado), y se cancela con un `AbortController`
  (`signal`). Su mock es la respuesta de `POST` de la ruta en el JSON, y el
  progreso llega al 100 % al responder.
<!-- kit:else -->
- **Subir:** `apiUtils.upload(path, schema, formData, { onProgress, signal })`,
  con `POST`. Va por `XMLHttpRequest` para dar el progreso (`onProgress`
  recibe el porcentaje enviado), y se cancela con un `AbortController`
  (`signal`).
<!-- kit:end -->
- **Descargar:** `apiUtils.download(method, path, body?)` devuelve un `Blob`
  sin validar, que se guarda con la función de la raíz que descarga un fichero
  (`fileUtils.downloadFile`, que nace con la primera descarga).

### Errores de la API

Un fallo de la API (el tipo `ApiError`, en `src/types/api.ts`) lleva el
`status` de la respuesta y el `code` que manda la API en su cuerpo
(`ORDER_NOT_FOUND`). Lo crea el transporte, y se lee con `apiErrorUtils`
(`src/utils/apiErrorUtils.ts`): `isApiError(error)`, `isNotFound(error)` (un
fallo con 404) y `getRequestFailure(error)`, que da `'network'` si no se ha
llegado al servidor y `'generic'` en cualquier otro caso. Un test crea uno
igual con `buildError(status, code)`.

- **Un `401` cierra la sesión,** y no lo hace la pantalla: el transporte avisa a
  la sesión que tiene conectada
  (`apiSessionUtils.connect({ getToken, onEnd })`), con `expired`, y la sesión
  lleva a la entrada con el aviso, guardando la ruta para volver a ella
  ([D10](../ux-ui/rules.md#d10-navegación)). Sin una sesión conectada, no pasa
  nada ([Aplicar permisos](./apply-permissions.md#lo-que-da-la-sesión)).
- **Un 404 de un registro** se reconoce con `apiErrorUtils.isNotFound(error)`.
  Al cargar, la pantalla pinta su estado de registro que no existe
  ([Carga, error y vacío](./load-and-save-data.md#3-carga-error-y-vacío)); al
  guardar o al actuar, el aviso de que ya no existe
  ([El fallo del guardado](./load-and-save-data.md#2-el-fallo-del-guardado)).
- **Si la pantalla trata un código concreto,** el método lo documenta en su
  `@throws` y la constante del código vive con los schemas de su entidad
  (`ORDER_ERROR_CODE`, en `ordersSchema.ts`). El código cambia la descripción
  del aviso, nunca su título
  ([D4](../ux-ui/rules.md#d4-avisos-y-fallos)).

Un código concreto, de punta a punta. Cancelar un pedido falla con
`409 ORDER_ALREADY_SHIPPED` si el pedido ha salido del almacén con la pantalla
abierta. El código es una constante con nombre de la app, en el fichero de lo
que comparten las zonas de la entidad, `services/orders/ordersSchema.ts`,
junto a los demás códigos de los pedidos que trata la app:

```ts
export const ORDER_ERROR_CODE = {
  notFound: 'ORDER_NOT_FOUND',
  alreadyShipped: 'ORDER_ALREADY_SHIPPED',
} as const
```

El método lo documenta en su `@throws`:

```ts
/**
 * PUT /order/cancel/{id}. Cancela un pedido que aún no ha salido del almacén.
 * @param id Id del pedido.
 * @param request El motivo de la cancelación.
 * @throws {ApiError} 409 ORDER_ALREADY_SHIPPED si el pedido ya ha salido.
 */
cancelOrder: (id: number, request: CancelOrderRequest) => apiUtils.request('PUT', `/order/cancel/${id}`, z.undefined(), request),
```

<!-- kit:if i18n -->
El hook lo compara con la constante y elige la descripción del aviso;
cualquier otro fallo, la común (`common:failure.network` o
`common:failure.generic`). Es de la familia (`orders/common`), porque cancelan
el listado y la gestión:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ORDER_ERROR_CODE } from '@/services/orders/ordersSchema'
import type { CancelOrderRequest } from '@/services/orders/ordersEditSchema'
import { ordersService } from '@/services/orders/ordersService'
import { apiErrorUtils } from '@/utils/apiErrorUtils'
import { orderQueryUtils } from '../utils/orderQueryUtils'

/**
 * Cancela un pedido con su motivo.
 * @param id Id del pedido.
 * @returns La mutación de TanStack Query y `failure`, la descripción del aviso si ha fallado (`null` si no).
 */
export function useOrderCancel (id: number) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (request: CancelOrderRequest) => ordersService.cancelOrder(id, request),
    onSuccess: () => orderQueryUtils.invalidateOrdersQueries(queryClient),
  })
  const isShipped = apiErrorUtils.isApiError(mutation.error) && mutation.error.code === ORDER_ERROR_CODE.alreadyShipped
  const failure = isShipped ? t('orders:cancel.failureShipped') : t(`common:failure.${apiErrorUtils.getRequestFailure(mutation.error)}`)

  return { ...mutation, failure: mutation.isError ? failure : null }
}
```

El componente pinta el aviso al final del cuerpo del modal, encima del pie,
con el título fijo de la acción («No se ha podido cancelar el pedido»,
`orders:cancel.failure`) y `failure` como descripción. El modal sigue abierto
([D9](../ux-ui/rules.md#d9-modales)):

```tsx
{hasFailure ? <PageAlert tone='error' title={t('orders:cancel.failure')}>{failure}</PageAlert> : null}
```
<!-- kit:else -->
El hook lo compara con la constante y da el motivo del fallo: el código concreto
o, en cualquier otro caso, el de `apiErrorUtils.getRequestFailure`. Es de la
familia (`orders/common`), porque cancelan el listado y la gestión:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ORDER_ERROR_CODE } from '@/services/orders/ordersSchema'
import type { CancelOrderRequest } from '@/services/orders/ordersEditSchema'
import { ordersService } from '@/services/orders/ordersService'
import { apiErrorUtils } from '@/utils/apiErrorUtils'
import { orderQueryUtils } from '../utils/orderQueryUtils'

/**
 * Cancela un pedido con su motivo.
 * @param id Id del pedido.
 * @returns La mutación de TanStack Query y `failure`, el motivo del fallo (`alreadyShipped`, `network` o `generic`) o `null`.
 */
export function useOrderCancel (id: number) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (request: CancelOrderRequest) => ordersService.cancelOrder(id, request),
    onSuccess: () => orderQueryUtils.invalidateOrdersQueries(queryClient),
  })
  const isShipped = apiErrorUtils.isApiError(mutation.error) && mutation.error.code === ORDER_ERROR_CODE.alreadyShipped
  const failure = isShipped ? 'alreadyShipped' : apiErrorUtils.getRequestFailure(mutation.error)

  return { ...mutation, failure: mutation.isError ? failure : null }
}
```

El componente, que pinta el aviso, escribe sus textos: al final del cuerpo
del modal, encima del pie, el título fijo de la acción y la descripción que
toca. El modal sigue abierto ([D9](../ux-ui/rules.md#d9-modales)):

```tsx
const hasFailure = failure !== null
const isShipped = failure === 'alreadyShipped'
const isOffline = failure === 'network'

{hasFailure
  ? (
    <PageAlert tone='error' title='No se ha podido cancelar el pedido'>
      {isShipped ? 'El pedido ya ha salido del almacén.' : isOffline ? 'Comprueba la conexión y vuelve a intentarlo.' : 'Vuelve a intentarlo dentro de un rato.'}
    </PageAlert>
    )
  : null}
```
<!-- kit:end -->

Qué hace un guardado con un fallo, en general:
[El fallo del guardado](./load-and-save-data.md#2-el-fallo-del-guardado).

## Puntos de adaptación a la API

El transporte (`apiUtils`, `apiErrorUtils` y `apiSessionUtils`, en
`src/utils/`) supone una API con unas convenciones concretas.
Si la del proyecto es distinta en alguna, se cambia en un solo sitio y el
resto de la app no se entera:

| Qué | Dónde | Por defecto |
|---|---|---|
| El idioma que se manda a la API | `getHeaders`, en `apiUtils.ts` | No se manda |
| La forma del cuerpo de error | `readErrorCode`, en `apiErrorUtils.ts` | `{ code }` |
| Qué estado cierra la sesión | `endOnError`, en `apiSessionUtils.ts` | 401 → `expired` |
<!-- kit:if mocks -->
| La forma de una página | El schema de página de `commonSchema.ts` y las páginas de los `*Mocks.json` | `{ items, page, pageSize, totalItems, totalPages }` |
<!-- kit:else -->
| La forma de una página | El schema de página de `commonSchema.ts` | `{ items, page, pageSize, totalItems, totalPages }` |
<!-- kit:end -->

- **El idioma.** Si la API traduce lo que devuelve (catálogos, filtros) y
  necesita saber en qué idioma, `getHeaders` (`apiUtils.ts`), que arma lo que
  lleva toda petición, lo añade como pida la API: una cabecera
  (`Accept-Language`) o un parámetro de la query string.
<!-- kit:if i18n -->
  Lo que la API traduce lleva entonces el idioma en su clave de consulta
  ([Los catálogos](./load-and-save-data.md#4-los-catálogos)).
<!-- kit:end -->
- **El error.** `apiErrorUtils.readErrorCode(body)` lee el código del cuerpo
  de una respuesta de error. Si la API lo manda de otra forma
  (`{ error: { code } }`, `{ errorCode }`), se cambia ahí, y el `code` del
  fallo sigue queriendo decir lo mismo en toda la app.
- **La sesión.** `apiSessionUtils.endOnError(error)` decide qué fallos cierran
  la sesión y con qué motivo; por defecto, solo un `401`, con `expired`. Si la
  API la cierra con otro estado, se añade ahí, con su motivo, y la sesión decide
  qué aviso da.
<!-- kit:if mocks -->
- **La página.** El schema de página de `commonSchema.ts`
  (`createPageSchema`) describe la página como la da la API, y las páginas de
  los `*Mocks.json` tienen esa misma forma: cambian siempre juntos, con el
  cuerpo de la petición (`PageRequest`).
<!-- kit:else -->
- **La página.** El schema de página de `commonSchema.ts`
  (`createPageSchema`) describe la página como la da la API, y cambia con el
  cuerpo de la petición (`PageRequest`).
<!-- kit:end -->
<!-- kit:if api -->

Lo que se adapta se escribe también en las convenciones comunes de la
[API](../api/README.md), para que quien lea un endpoint sepa cómo son su
error, su sesión y su página.
<!-- kit:end -->

## Errores comunes

| Síntoma | Causa |
|---|---|
<!-- kit:if mocks -->
| «Sin mock para POST /…» en la consola | Falta su clave en el `<entidad>Mocks.json` del service, o no coincide con el método y la ruta (sin la query string, que no cuenta). |
<!-- kit:end -->
| La pantalla dice error aunque la API responde | La respuesta no cumple el schema: comprueba el campo que falla en el `ZodError` de la consola. |
<!-- kit:if mocks -->
| Funciona con los mocks y falla contra la API | El JSON del mock no tiene la forma real de la API. |
<!-- kit:end -->
<!-- kit:if i18n -->
| Al cambiar de idioma, un catálogo sigue en el anterior | La API lo traduce y su clave de consulta no lleva el idioma de la app. |
<!-- kit:end -->
| Un fallo de la API llega sin `code` | El cuerpo de error no tiene la forma que lee `apiErrorUtils.readErrorCode`: se adapta ahí. |
| La API da la sesión por terminada y la app sigue como si nada | La sesión no se ha conectado al transporte con `apiSessionUtils.connect`, o la API la cierra con un estado que `apiSessionUtils.endOnError` no mira. |
