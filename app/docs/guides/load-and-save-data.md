# Cargar y guardar datos

Esta guía pide y guarda los datos del servidor desde una feature con TanStack
Query, siempre desde un hook: cómo se cargan, qué estados devuelve el hook,
cómo se comparten los catálogos, cómo sobreviven los filtros a recargar, cómo
se guarda, qué se vuelve a pedir después y cómo se exporta. Es la técnica: qué
se pinta en cada estado y dónde va cada aviso lo dicen las normas
[D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío),
[D4](../ux-ui/rules.md#d4-avisos-y-fallos),
[D8](../ux-ui/rules.md#d8-listados-y-tablas) y
[D11](../ux-ui/rules.md#d11-textos-y-formato). Sirve para quien ya tiene el
método en el service; si el endpoint no está, se añade primero con
[Añadir un servicio](./add-a-service.md). Los ejemplos son de la familia
`orders` (su índice, `orders`; `ordersEdit` y `ordersNew`) y de la carga de
facturas, `invoicesUpload`.

Tiene dos partes. «Cargar» va del dato suelto a la lista con filtros;
«Guardar», del guardado a su fallo y a la exportación.

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- **Cargar:** [1. El hook y el QueryClient](#1-el-hook-y-el-queryclient), [2. Un dato](#2-un-dato), [3. Carga, error y vacío](#3-carga-error-y-vacío), [4. Los catálogos](#4-los-catálogos), [5. Varios datos a la vez](#5-varios-datos-a-la-vez), [6. El store de una pantalla](#6-el-store-de-una-pantalla), [7. Listas paginadas y filtros](#7-listas-paginadas-y-filtros), [8. Refresco periódico](#8-refresco-periódico)
- **Guardar:** [1. El guardado](#1-el-guardado), [2. El fallo del guardado](#2-el-fallo-del-guardado), [3. La exportación](#3-la-exportación)
- [Errores comunes](#errores-comunes)

## Cargar

Pedir un dato del servidor y pintarlo con sus estados. Los pasos 1 a 3 valen
para toda pantalla que lee del servidor; del 4 al 8, cada uno cuando la
pantalla lo necesita.

### 1. El hook y el QueryClient

Toda petición sale de un hook, y el `QueryClient` fija cómo se comportan
todas.

- **Un componente nunca llama a un service:** llama a un hook de `hooks/`, y
  el hook usa `useQuery` o `useMutation`
  ([Normativa](../standards.md#datos)).
- **La configuración es una sola,** `queryClientConfig`, en
  `src/queryClient.config.ts`: `retry: false` (un fallo se ve en cuanto pasa)
  y `refetchOnWindowFocus: false` (la pantalla no se recarga sola al volver a
  la pestaña).
  La usan el `QueryClient` de `main.tsx` y el de los ayudantes de los tests,
  así que la app y los tests se comportan igual:

```ts
import type { QueryClientConfig } from '@tanstack/react-query'

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
}
```

- **Si el endpoint no está en el service,** se añade primero:
  [Añadir un servicio](./add-a-service.md).

### 2. Un dato

El contenido de un documento de un pedido, para el visor de su gestión:

```ts
import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/orders/ordersService'

/**
 * El contenido de un documento del pedido, para el visor.
 * @param documentId Id del documento.
 * @param viewable Si su formato se puede ver en pantalla.
 * @returns La consulta de TanStack Query.
 */
export function useOrdersEditDocumentContent (documentId: number, viewable: boolean) {
  return useQuery({
    queryKey: ['ordersService', 'downloadOrderEditDocument', documentId],
    queryFn: () => ordersService.downloadOrderEditDocument(documentId),
    enabled: viewable,
    staleTime: Infinity,
  })
}
```

- **La clave** es siempre `[service, método, ...parámetros]`
  ([Nomenclatura](../naming.md#services-schemas-y-claves-de-consulta)).
  Cuando cambia un parámetro, se pide de nuevo; cuando vuelve a uno ya pedido,
  sale de la caché. «Descarga» usa la misma clave y aprovecha el contenido ya
  pedido.
- **`enabled`** evita pedir lo que no se va a ver: un documento cuyo formato
  no se ve, un `id` que no es un número o la pestaña de una gestión que aún no
  se ha abierto (`enabled: tab === 'documents'`). También lleva la regla de
  permisos de lo que pide
  ([Aplicar permisos](./apply-permissions.md#7-las-peticiones)).
- **`staleTime: Infinity`** es para lo que no cambia mientras dura la sesión:
  un documento guardado o un catálogo ([Los catálogos](#4-los-catálogos)).

### 3. Carga, error y vacío

Qué se pinta en cada estado lo dice
[D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío); aquí, de qué
estado de TanStack Query sale cada uno:

| Estado | En TanStack Query | Qué se pinta |
|---|---|---|
| Primera carga | `isPending`: aún no hay dato | La carga con la forma del contenido, o el `loading` de la pieza |
| Recarga por un filtro, la página o el orden | `isPlaceholderData`, con `placeholderData: keepPreviousData` ([Listas paginadas y filtros](#7-listas-paginadas-y-filtros)) | Lo anterior, atenuado, mientras llega lo nuevo |
| Recarga en segundo plano (volver a la pantalla, un refresco periódico) | Ninguno: nunca `isFetching`, que también se enciende aquí | Nada: no se nota |
| Fallo al cargar | `isError`, y `apiErrorUtils.getRequestFailure(error)` para saber si es la red | El estado de error, con reintentar; sin conexión, su variante |
| Nada que enseñar | El dato llega vacío | El estado vacío, o el vacío de la tabla |
| El registro no existe | `apiErrorUtils.isNotFound(error)` | Su propio estado, con el enlace a su lista |

Los hooks que piden devuelven los estados ya decididos (`isError`,
`isOffline`, `isNotFound` y `data` sin definir mientras carga) y la página los
resuelve con ternarios, del caso más concreto al más general, con un solo
`return`:

```tsx
export function OrdersEditPage () {
  const { t } = useTranslation()
  const { data, isError, isOffline, isNotFound, refetch } = useOrdersEdit()
  const isLoading = data === undefined

  return isNotFound
    ? <EmptyState title={t('ordersEdit:notFound.title')} action={{ label: t('ordersEdit:notFound.action'), href: '/orders' }} />
    : isError
      ? <ErrorState title={t(isOffline ? 'common:errorState.offline' : 'common:errorState.title')} retryLabel={t('common:errorState.retry')} onRetry={refetch} />
      : isLoading
        ? <LoadingSkeleton />
        : <OrdersEditTabs data={data} />
}
```

- **`apiErrorUtils.isNotFound(error)`** dice si es un fallo de la API con
  estado 404 ([Errores de la API](./add-a-service.md#errores-de-la-api)).
  El hook de [Varios datos a la vez](#5-varios-datos-a-la-vez) lo convierte en
  el `isNotFound` que lee la página.
- **La acción de volver del vacío es un enlace** (`href`), porque lleva a otra
  pantalla ([D10](../ux-ui/rules.md#d10-navegación)). Si la persona no puede
  ver la lista, lleva al inicio.
- **Una zona de una pantalla** (una tarjeta) lleva su propia carga, su vacío y
  su error, con las props de su pieza: si una falla, las demás se siguen
  viendo. Lo que solo ayuda (un dato de contexto) falla sin avisar ni
  bloquear.
- **Una tabla lleva su carga, su vacío y su error dentro,** con su cabecera
  siempre a la vista ([D8](../ux-ui/rules.md#d8-listados-y-tablas)).

### 4. Los catálogos

Un catálogo es una lista de opciones de un selector (transportistas, motivos
de cierre; los endpoints `…/select`), y su método termina en `Catalog`.
Cambia muy poco, así que se pide una vez por sesión. Cada feature que lo
necesita lo pide desde su propio hook, con esta misma consulta:

```ts
useQuery({
  queryKey: ['ordersService', 'getOrderCarriersCatalog'],
  queryFn: ordersService.getOrderCarriersCatalog,
  staleTime: Infinity,
})
```

Dos features con la misma clave comparten la caché: la petición sale una sola
vez y ninguna importa de la otra. Dentro de una familia, el hook puede vivir
en su `common`.

Lo que se pide una vez y no caduca, pero no es una lista de opciones (los
filtros de la barra, la configuración de la empresa, `getCompanyConfig`), se
pide igual, con `staleTime: Infinity`, pero no es un catálogo ni su método
lleva `Catalog`: los documentos de feature lo etiquetan «Sin caducidad
(`staleTime: Infinity`)».
<!-- kit:if i18n -->

**El idioma, si la API traduce.** Por defecto la app no manda su idioma a la
API ([Puntos de adaptación a la API](./add-a-service.md#puntos-de-adaptación-a-la-api)).
Si el proyecto lo manda y la API traduce un catálogo, el idioma va en la
clave, para que cambiar de idioma lo pida de nuevo:

```ts
const { i18n } = useTranslation()
useQuery({
  queryKey: ['ordersService', 'getOrderCloseReasonsCatalog', i18n.language],
  queryFn: ordersService.getOrderCloseReasonsCatalog,
  staleTime: Infinity,
})
```

Lo que la API no traduce (los nombres de los transportistas) va sin él.
<!-- kit:end -->

### 5. Varios datos a la vez

Si una pantalla necesita varios datos para pintarse (el pedido y los
catálogos de sus selectores), un hook de la feature los junta con
`useQueries` y devuelve un solo resultado con `combine`: los datos cuando han
llegado todos, si ha fallado alguno, si el registro no existe y el reintento.
La página no sabe cuántas consultas hay detrás:

```ts
import { useQueries } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { ordersService } from '@/services/orders/ordersService'
import { apiErrorUtils } from '@/utils/apiErrorUtils'

/**
 * El pedido de la gestión, con el `:id` de la ruta, y el catálogo de transportistas de su selector.
 * @returns `data` cuando han llegado todos (`undefined` mientras falta alguno), `isError`, `isOffline`, `isNotFound` y `refetch`.
 */
export function useOrdersEdit () {
  const id = Number(useParams().id)

  return useQueries({
    queries: [
      { queryKey: ['ordersService', 'getOrderDetail', id], queryFn: () => ordersService.getOrderDetail(id), enabled: Number.isInteger(id) },
      { queryKey: ['ordersService', 'getOrderCarriersCatalog'], queryFn: ordersService.getOrderCarriersCatalog, staleTime: Infinity },
    ],
    combine: ([order, carriers]) => ({
      data: order.isFetchedAfterMount && order.data && carriers.data ? { order: order.data, carriers: carriers.data } : undefined,
      isError: order.isError || carriers.isError,
      isOffline: apiErrorUtils.getRequestFailure(order.error ?? carriers.error) === 'network',
      isNotFound: !Number.isInteger(id) || apiErrorUtils.isNotFound(order.error),
      refetch: () => void Promise.all([order.refetch(), carriers.refetch()]),
    }),
  })
}
```

Un `:id` que no es un entero deja la consulta con `enabled: false`, que no
pide nada y se queda en `isPending`: por eso el hook lo da por un registro que
no existe. El pedido lleva la misma clave en toda la familia: el modal de
cerrar del listado lo pide igual y comparte su caché.

- **Lo que solo se lee** pinta lo que hay en la caché al momento y lo recarga
  en segundo plano, sin que se note.
- **La gestión de un registro no parte de la caché:** su formulario parte del
  dato del servidor, así que espera a la respuesta pedida al abrirla
  (`isFetchedAfterMount`) y, mientras tanto, la página pinta la carga
  ([Crear un formulario](./create-a-form.md#2-el-formulario)).

### 6. El store de una pantalla

Los filtros y la página de una lista viven en un store, y la consulta del
paso siguiente los lee de él. Zustand guarda lo que sobrevive a abrir un
registro y volver, y también a recargar la página: los filtros aplicados, la
página, el orden, los ajustes de vista y los almacenes elegidos en la cabecera
([D8](../ux-ui/rules.md#d8-listados-y-tablas)). Nada de esto va en la URL. Lo
que solo importa mientras la pantalla está abierta, o lo que es de una
pestaña de la gestión de un registro (el buscador de sus documentos), es
`useState` y no se conserva al salir.

```ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useSessionStore } from '@/domains/session/stores/useSessionStore'
import type { PageRequest } from '@/schemas/commonSchema'

type OrdersQuery = Pick<PageRequest, 'page' | 'pageSize' | 'search' | 'orderByField' | 'orderDirection'>

type OrdersState = {
  listQuery: OrdersQuery
  setListPage: (page: number) => void
  setListSearch: (search: string) => void
  resetListQuery: () => void
}

const INITIAL_LIST_QUERY: OrdersQuery = { page: 1, pageSize: 10, search: '', orderByField: 'createdAt', orderDirection: 'desc' }

/** La consulta del listado de pedidos: la página, el tamaño, la búsqueda y el orden. */
export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      listQuery: INITIAL_LIST_QUERY,
      /**
       * Cambia de página; es lo único que no vuelve a la primera.
       * @param page La página, desde 1.
       */
      setListPage: (page) => set(({ listQuery }) => ({ listQuery: { ...listQuery, page } })),
      /**
       * Cambia la búsqueda y vuelve a la primera página.
       * @param search El texto del buscador.
       */
      setListSearch: (search) => set(({ listQuery }) => ({ listQuery: { ...listQuery, search, page: 1 } })),
      /** Vuelve a la consulta inicial. */
      resetListQuery: () => set({ listQuery: INITIAL_LIST_QUERY }),
    }),
    {
      name: 'ordersStore',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ listQuery }) => ({ listQuery: { ...listQuery, search: '' } }),
    },
  ),
)

useSessionStore.subscribe((state) => {
  if (state.session !== null) return
  useOrdersStore.getState().resetListQuery()
  useOrdersStore.persist.clearStorage()
})
```

- **Un store por feature** (`useOrdersStore`), en `stores/`. Cada acción
  lleva el nombre de su dato (`setListPage`, `setListSearch`; y, como la
  búsqueda, `setListPageSize` y `setListSort`). Lo que conservan dos features
  de la misma familia al pasar de una a otra vive en un store de su `common`:
  los filtros aplicados de `orders` y `ordersDashboard` son
  `useOrderFiltersStore`.
- **Se guarda en el `sessionStorage` de la pestaña del navegador,** con el
  `persist` de Zustand, para que sobreviva a recargar. Su `name` es el nombre
  del store sin `use`, en camelCase (`ordersStore`).
- **La búsqueda no se guarda al recargar,** porque puede ser un dato de una
  persona: sigue en el store mientras se navega, pero `partialize` la deja
  fuera de lo que se guarda.
- **Cambiar un filtro, la búsqueda, el orden o el tamaño vuelve a la página
  1;** solo cambiar de página la conserva. Por eso el store de la consulta se
  suscribe también a los filtros aplicados y a los almacenes elegidos. Tras
  una baja desde una fila, la tabla se queda en la misma página; si se queda
  vacía, pasa a la anterior ([Listas paginadas y filtros](#7-listas-paginadas-y-filtros)).
- **Al cerrar la sesión no queda nada de la persona anterior:** cada store se
  suscribe a `useSessionStore` (del dominio `session`, que crea el proyecto
  con su login), en su propio fichero, vuelve a su estado inicial y vacía lo
  que guardó en el `sessionStorage`.
  Su test cierra la sesión y lo comprueba
  ([Escribir tests](./write-tests.md#un-schema-un-util-o-un-store)).
  Una app sin sesión no lleva la suscripción.
- **Cuando una segunda tabla repite la consulta** (página, tamaño, búsqueda y
  orden con sus acciones), sube a la raíz como un trozo de store que se suma a
  lo demás de cada uno ([Normativa](../standards.md#dónde-va-cada-cosa)).

### 7. Listas paginadas y filtros

Un listado pide una página cada vez, con los filtros, la página y la búsqueda
dentro del cuerpo (`PageRequest`, el cuerpo común de una página). Así lo pide
`orders`:

```ts
import { useWarehousesStore } from '@/domains/warehouses/stores/useWarehousesStore'
import { useOrderFiltersStore } from '../../common/stores/useOrderFiltersStore'
import { orderRequestUtils } from '../../common/utils/orderRequestUtils'
import { useOrdersStore } from '../stores/useOrdersStore'

/**
 * El cuerpo de las peticiones del listado: los filtros aplicados, los almacenes elegidos y la consulta de la tabla.
 * @returns El cuerpo de página (`PageRequest`), el mismo para la página y para la exportación.
 */
export function useOrdersRequest () {
  const appliedFilters = useOrderFiltersStore((state) => state.appliedFilters)
  const warehouses = useWarehousesStore((state) => state.selected)
  const listQuery = useOrdersStore((state) => state.listQuery)

  return orderRequestUtils.buildOrderRequest(appliedFilters, warehouses, listQuery)
}
```

```ts
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { PageRequest } from '@/schemas/commonSchema'
import { ordersService } from '@/services/orders/ordersService'
import { useOrdersStore } from '../stores/useOrdersStore'

/**
 * Una página del listado de pedidos, que deja la anterior a la vista mientras llega la nueva. Si la página pedida ya no existe, pasa a la última que queda.
 * @param request El cuerpo de la página (`useOrdersRequest`).
 * @returns La consulta de TanStack Query, con las filas y los totales (`totalItems`, `totalPages`).
 */
export function useOrdersListPage (request: PageRequest) {
  const setListPage = useOrdersStore((state) => state.setListPage)
  const list = useQuery({
    queryKey: ['ordersService', 'getOrdersListPage', request],
    queryFn: () => ordersService.getOrdersListPage(request),
    placeholderData: keepPreviousData,
  })
  const lastPage = list.data === undefined || list.isPlaceholderData ? null : Math.max(1, list.data.totalPages)

  useEffect(() => {
    if (lastPage !== null && request.page > lastPage) setListPage(lastPage)
  }, [lastPage, request.page, setListPage])

  return list
}
```

- **El cuerpo** sale de su propio hook (`useOrdersRequest`), porque lo
  usan la página y la exportación, y la página lo arma una vez y se lo pasa a
  las dos. Lo monta `orderRequestUtils.buildOrderRequest` (de
  `orders/common`, porque lo piden las dos features) con los filtros
  aplicados, los almacenes elegidos y la consulta de la tabla, que salen de
  los stores ([El store de una pantalla](#6-el-store-de-una-pantalla)). Sin la
  consulta de la tabla (el análisis), pide la página 1. Los almacenes de la
  cabecera son un filtro global: van en el cuerpo de todo lo que los admite.
- **La clave** lleva el cuerpo entero: cambiar de página, de tamaño, de
  búsqueda o de filtro pide de nuevo.
- **`placeholderData: keepPreviousData`** mantiene la página anterior en
  pantalla mientras llega la nueva, sin pasar por la carga. Lo mismo vale para
  las tarjetas de un análisis.
- **Una página que ya no existe** (se ha dado de baja la última fila de la
  última página) pasa a la última que queda: el hook lo ve en los totales de
  la respuesta, no en la que aún se ve mientras llega la nueva.
- **El `loading` de la tabla** es `isPending || isPlaceholderData`: la primera
  carga pinta la carga, y una recarga atenúa lo anterior. Nunca `isFetching`,
  que también se enciende con una recarga en segundo plano, que no se tiene
  que notar ([D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío)).
- **La búsqueda llega al store cuando la persona deja de escribir** (400 ms,
  [D8](../ux-ui/rules.md#d8-listados-y-tablas)), así que la clave cambia una
  vez y no con cada letra.
- **Solo cuenta la última respuesta:** cada consulta pinta lo de su clave, así
  que una respuesta de una clave que ya no se pinta (un filtro que se ha
  cambiado) no llega a la pantalla.
- **La paginación de la tabla** recibe la página y el tamaño de la consulta,
  el total que da la API (`totalItems`) y las acciones del store que los
  cambian, y ofrece 10, 25 o 50 filas
  ([D8](../ux-ui/rules.md#d8-listados-y-tablas)).

### 8. Refresco periódico

Lo que cambia solo en el servidor mientras se mira (una carga de facturas que
el servidor está procesando) se refresca con `refetchInterval`. Es una opción
más de la consulta de la lista:

```ts
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { PageRequest } from '@/schemas/commonSchema'
import { invoicesService } from '@/services/invoices/invoicesService'
import { invoicesUploadUtils } from '../utils/invoicesUploadUtils'

/**
 * Una página de las cargas de facturas, que se refresca sola mientras alguna se está procesando.
 * @param request El cuerpo de la página.
 * @returns La consulta de TanStack Query.
 */
export function useInvoicesUploadList (request: PageRequest) {
  return useQuery({
    queryKey: ['invoicesService', 'getInvoicesUploadsPage', request],
    queryFn: () => invoicesService.getInvoicesUploadsPage(request),
    placeholderData: keepPreviousData,
    refetchInterval: (query) => (invoicesUploadUtils.hasInvoicesUploadsInProgress(query.state.data) ? 30_000 : false),
  })
}
```

- **Solo con trabajo pendiente** que se ve en pantalla: sin cargas en curso,
  la función devuelve `false` y el refresco se para.
- **Parado con la pestaña del navegador oculta:** es lo que hace
  `refetchInterval` mientras `refetchIntervalInBackground` siga en `false`, su
  valor por defecto.
- **No se nota:** la clave no cambia, así que no hay carga ni
  `isPlaceholderData`; los datos anteriores siguen en pantalla hasta que
  llegan los nuevos ([D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío)).

Lo que cambian otras personas en cualquier momento y se mira en vivo (un
tablero, como el de las incidencias) se refresca siempre: su consulta pone
`refetchInterval` con un número fijo (`60_000`) y `refetchOnWindowFocus: true`,
que anula el valor de `queryClientConfig`.

## Guardar

Guardar y exportar son mutaciones: se hacen en un hook con `useMutation`, como
las consultas ([El hook y el QueryClient](#1-el-hook-y-el-queryclient)).

### 1. El guardado

Guardar el pedido desde su gestión:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateOrderDetailRequest } from '@/services/orders/ordersEditSchema'
import { ordersService } from '@/services/orders/ordersService'
import { orderQueryUtils } from '../../common/utils/orderQueryUtils'

/**
 * Guarda el pedido de la gestión y lo pide de nuevo.
 * @param id Id del pedido.
 * @returns La mutación de TanStack Query, que acaba con el pedido guardado.
 */
export function useOrdersEditUpdate (id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: UpdateOrderDetailRequest) => {
      await ordersService.updateOrderDetail(id, request)
      return queryClient.fetchQuery({ queryKey: ['ordersService', 'getOrderDetail', id], queryFn: () => ordersService.getOrderDetail(id) })
    },
    onSuccess: () => orderQueryUtils.invalidateOrdersQueries(queryClient),
  })
}
```

- **Mientras guarda,** `isPending` pone el `loading` en el botón de guardar y
  desactiva los campos y las demás acciones del formulario
  ([Crear un formulario](./create-a-form.md#4-enviar-el-formulario)).
- **Después de guardar, se vuelve a pedir lo que pinta el registro:** el
  propio registro, las listas y los recuentos de su familia y lo que de otras
  familias lo enseña (el tablero de incidencias, si el pedido puede tenerlas).
  Nunca un service entero (`['ordersService']`), ni los catálogos. Cada
  familia lo junta en una función que usan todas sus mutaciones,
  `invalidate<Familia>Queries`, en el objeto `<entidad>QueryUtils` de su
  `common` (`orderQueryUtils.invalidateOrdersQueries`). Lo que no está en
  pantalla solo se marca como viejo y se pide al abrirlo.

```ts
import type { QueryClient } from '@tanstack/react-query'

const ORDERS_QUERIES = [
  ['ordersService', 'getOrdersListPage'],
  ['ordersService', 'getOrdersStatus'],
  ['ordersService', 'getOrdersDashboardStatusByMonth'],
  ['incidentsService', 'getIncidents'],
]

/**
 * Tras cambiar un pedido, marca como viejo lo que enseña los pedidos, por su método: el listado, el análisis y el tablero de incidencias; nunca un catálogo.
 * @param queryClient El cliente de TanStack Query de la app.
 */
async function invalidateOrdersQueries (queryClient: QueryClient): Promise<void> {
  await Promise.all(ORDERS_QUERIES.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
}

export const orderQueryUtils = {
  invalidateOrdersQueries,
}
```

La lista puede llevar ya los métodos de las features de la familia que aún
no existen: invalidar una clave que no está en la caché no hace nada, y así
cada feature queda al día al llegar. El registro cambiado no está en ella:
cada mutación pide de nuevo el suyo, como en el ejemplo de arriba.

- **La gestión recibe el registro guardado:** la mutación lo pide de nuevo
  (`fetchQuery`, que también lo deja al día en la caché) y acaba con él, y el
  formulario parte de él
  ([Crear un formulario](./create-a-form.md#4-enviar-el-formulario)).
  Como la mutación sigue en `isPending` hasta entonces, la pantalla no enseña
  el dato viejo un instante. Lo que se cierra al guardar (un modal) consigue
  lo mismo devolviendo en `onSuccess` la promesa de la invalidación.
- **Nada se pinta como hecho antes de que el servidor lo confirme:** no hay
  cambios optimistas (`setQueryData` antes de la respuesta)
  ([D5](../ux-ui/rules.md#d5-acciones)).
- **Solo cuenta la última respuesta:** una que llega después de salir de la
  pantalla se descarta sin avisar. Por eso el aviso y lo que cambia la
  pantalla van en los callbacks de `mutate`, que no se llaman si el
  componente ya no está.
- **Dos personas en el mismo registro:** gana la última que guarda, sin aviso
  ni bloqueo. Lo que manda un registro entero para cambiar solo una parte lo
  pide de nuevo justo antes (`fetchQuery`), para no deshacer el resto.
- **Si va bien,** el aviso efímero se da en el `onSuccess` de `mutate`, solo
  cuando el control con el que se actuó desaparece o no cambia (se cierra un
  modal, se guarda una edición); cuándo sale y qué dice, en
  [D4](../ux-ui/rules.md#d4-avisos-y-fallos).

### 2. El fallo del guardado

La mutación guarda el error, y el hook lo convierte en lo que pinta el aviso.
Un aviso de fallo tiene dos partes
([D4](../ux-ui/rules.md#d4-avisos-y-fallos)):

- **El título** es «No se ha podido <verbo> <objeto>», sin punto, y es fijo:
  es de la zona («No se ha podido crear el pedido»).
- **La descripción** dice el motivo y qué hacer, con punto: sin conexión
  (`apiErrorUtils.getRequestFailure(error)` da `'network'`), «Comprueba la
  conexión y vuelve a intentarlo.»; un fallo sin código, «Vuelve a intentarlo
  dentro de un rato.»; un código conocido de la API cambia la descripción, nunca
  el título ([Errores de la API](./add-a-service.md#errores-de-la-api)).
- **Lo escrito se queda:** un fallo no cierra la edición ni el modal, ni vacía
  el formulario.

El alta de un pedido, con el hook que da el fallo y el aviso que lo pinta
encima de la barra de acciones:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ordersService } from '@/services/orders/ordersService'
import { apiErrorUtils } from '@/utils/apiErrorUtils'
import type { OrderFormValues } from '../../common/schemas/orderFormSchema'
import { orderQueryUtils } from '../../common/utils/orderQueryUtils'
import { ordersNewValueUtils } from '../utils/ordersNewValueUtils'

/**
 * Da de alta el pedido con lo escrito en el formulario.
 * @returns La mutación de TanStack Query y `failure`, la descripción del aviso si ha fallado (`null` si no).
 */
export function useOrdersNewCreate () {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (values: OrderFormValues) => ordersService.createOrder(ordersNewValueUtils.buildOrdersNewRequest(values)),
    onSuccess: () => orderQueryUtils.invalidateOrdersQueries(queryClient),
  })

  return { ...mutation, failure: mutation.isError ? t(`common:failure.${apiErrorUtils.getRequestFailure(mutation.error)}`) : null }
}
```

```tsx
const hasFailure = failure !== null

<>
  {hasFailure ? <PageAlert tone='error' title={t('ordersNew:failure')}>{failure}</PageAlert> : null}
  <ActionBar>
    <Button loading={creating} onClick={onCreate}>{t('ordersNew:create')}</Button>
  </ActionBar>
</>
```

Dónde va cada fallo (encima de la barra, al final de un modal, bajo un campo,
bajo la cabecera) lo dice [D4](../ux-ui/rules.md#d4-avisos-y-fallos); el
hook es el mismo en todos los casos. Un fallo nunca va en el aviso efímero:
se va solo, y un fallo hay que poder releerlo.

- **Un campo que solo comprueba la API** (un número de pedido repetido) se
  marca en el campo con `form.setError`
  ([Enviar el formulario](./create-a-form.md#4-enviar-el-formulario)).
- **Si el registro ya no existe** al guardar o al actuar
  (`apiErrorUtils.isNotFound(error)`), en el sitio del fallo sale «Este pedido
  ya no existe», sin reintento y con el enlace a la lista. Lo escrito se sigue
  viendo hasta salir, y la mutación invalida la lista de la familia.
- **Un lote** (varios ficheros, varios registros) va con una petición por
  elemento, cada una con su estado. Si uno falla, los demás siguen, y
  reintentar repite solo los que fallaron.

### 3. La exportación

Exportar también es una mutación: `isPending` dice que se está exportando, e
`isError`, que ha fallado, con su aviso como el de un guardado.

- **Si el fichero lo genera el servidor,** el hook llama al método de
  descarga del service (`apiUtils.download`,
  [Subir y descargar ficheros](./add-a-service.md#subir-y-descargar-ficheros))
  y lo guarda con la función de la raíz que descarga un fichero
  (`fileUtils.downloadFile`, que nace con la primera descarga).
- **Si lo genera la app,** monta las filas con una función de la raíz que
  escribe el CSV, una sola para toda la app, que nace con la primera
  exportación: así todos los ficheros tienen el mismo formato.
- **Exporta lo que enseña la tabla:** todas las filas, con sus filtros, su
  búsqueda y su orden, con el mismo cuerpo que la página
  (`useOrdersRequest`). Se desactiva con la tabla vacía, mientras carga o
  si ha fallado ([D5](../ux-ui/rules.md#d5-acciones)).

```ts
import { useMutation } from '@tanstack/react-query'
import type { PageRequest } from '@/schemas/commonSchema'
import { ordersService } from '@/services/orders/ordersService'
import { fileUtils } from '@/utils/fileUtils'

/**
 * Exporta el listado a un CSV que genera el servidor, con todas las filas de la consulta, y lo guarda.
 * @param request El cuerpo de la página del listado (`useOrdersRequest`); la API ignora la página y el tamaño.
 * @returns La mutación de TanStack Query, que recibe el nombre del fichero.
 */
export function useOrdersExport (request: PageRequest) {
  return useMutation({
    mutationFn: async (fileName: string) => fileUtils.downloadFile(await ordersService.exportOrdersListCsv(request), fileName),
  })
}
```

El nombre del fichero lo pone quien lo pinta, con el título de la pantalla.
La descarga es el aviso de que ha ido bien, sin aviso efímero.

## Errores comunes

| Síntoma | Causa |
|---|---|
| Dos pantallas piden el mismo catálogo dos veces | Usan claves de consulta distintas para el mismo método. |
| La pantalla pide el mismo dato varias veces | Las claves no son iguales: un parámetro distinto, un orden distinto o un objeto que se crea en cada render. |
| Después de guardar no se ve el cambio | La mutación no invalida la clave de la consulta que pinta el dato. |
| Después de guardar, el listado o el recuento de la cabecera siguen viejos | La mutación solo invalida el registro: también van las listas y los recuentos de la familia, con `invalidate<Familia>Queries`. |
| Después de guardar se recarga media pantalla | La mutación invalida una clave demasiado amplia (`['ordersService']`). |
| La lista parpadea al cambiar de página | Falta `placeholderData: keepPreviousData`. |
| La tabla se atenúa sola al volver a la pantalla o con el refresco | Su `loading` lee `isFetching`: es `isPending \|\| isPlaceholderData`. |
| La gestión enseña un momento datos viejos | Parte de la caché: tiene que esperar a `isFetchedAfterMount`. |
| Una pestaña pide sus datos sin abrirse | Falta `enabled` con la pestaña activa. |
| La página se queda en la carga con un `:id` que no es un número | La consulta lleva `enabled: false` y no sale de `isPending`: el hook tiene que dar ese `:id` por un registro que no existe. |
| Al recargar se pierden los filtros o la página | El store no se guarda en el `sessionStorage` (`persist`). |
| Al recargar vuelve la búsqueda | `partialize` no la deja fuera de lo que se guarda. |
| Otra persona entra y ve los filtros o la búsqueda de la anterior | El store no se suscribe a `useSessionStore`, así que no vuelve a su estado inicial ni vacía su `sessionStorage` al cerrar la sesión. |
| Un fallo sale en el aviso efímero y no se puede releer | El fallo va en su sitio, con el aviso de página o la nota del campo, nunca en el aviso efímero. |
| El refresco periódico sigue sin nada pendiente | `refetchInterval` devuelve un número siempre: tiene que devolver `false` cuando no queda trabajo. |
