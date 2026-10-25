# Crear una feature

<!-- kit:if backend -->
Esta guía monta una feature de principio a fin: su documento, la carpeta, las
rutas, la página, los textos, el menú, los permisos y los datos. Sirve también
para añadir una página a una feature que ya existe, saltando los pasos hechos.
<!-- kit:else -->
Esta guía monta una feature de principio a fin: su documento, la carpeta, las
rutas, la página, los textos, el menú y los datos. Sirve también para añadir
una página a una feature que ya existe, saltando los pasos hechos.
<!-- kit:end -->
El ejemplo es `orders`, la gestión de los pedidos, en `/orders`; donde otra
pieza de la misma familia enseña mejor el patrón, sale de `ordersEdit`, la
gestión de un pedido, en `/orders/:id/edit`.

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- [1. El documento](#1-el-documento)
- [2. El nombre y la carpeta](#2-el-nombre-y-la-carpeta)
- [3. Las rutas](#3-las-rutas)
- **4. La página:** [Un componente](#un-componente), [Un hook](#un-hook)
- [5. Los textos](#5-los-textos)
- [6. El menú](#6-el-menú)
<!-- kit:if backend -->
- [7. Los permisos](#7-los-permisos)
- [8. Los datos y el estado](#8-los-datos-y-el-estado)
- [9. Los tests](#9-los-tests)
<!-- kit:else -->
- [7. Los datos y el estado](#7-los-datos-y-el-estado)
- [8. Los tests](#8-los-tests)
<!-- kit:end -->
- [Las animaciones](#las-animaciones)
- [La feature terminada](#la-feature-terminada)
- [Errores comunes](#errores-comunes)

## 1. El documento

Una feature nace con la primera historia que la pide (`ORD001`, en
`docs/specs/`). Al especificarla, `zaius-spec` escribe también el documento de
la pantalla en [Features](../features/README.md):
`docs/features/<familia>/<feature>.md` (sin familia,
`docs/features/<feature>.md`), con la plantilla del índice. Ahí se decide qué
<!-- kit:if backend -->
hace, sus páginas, sus permisos, sus zonas y los métodos de service que usa.
<!-- kit:else -->
hace, sus páginas, sus zonas y sus datos.
<!-- kit:end -->
Se escribe sin dudas abiertas: las que salen se resuelven en el momento y
quedan como decisiones. El código cumple ese documento, y el documento dice
siempre lo que hace el código: lo que se decide al construir se apunta en la
historia y en el documento antes de seguir, escrito como si siempre hubiera
sido así.

Con la historia y el documento va su boceto, una página HTML que enseña la
pantalla antes de construirla ([Bocetos](../ux-ui/README.md#bocetos)). La
feature no se empieza a montar (la carpeta, las rutas, el código) hasta que
la persona los aprueba; después, se construye test a test con `/zaius-build`
y se cierra con `/zaius-review`, que borra el boceto
([El flujo](../process.md#el-flujo)).

El esqueleto, con los apartados de la plantilla en su orden:

```markdown
# orders

La gestión de los pedidos: el listado, con la barra de filtros, para buscarlos,
<!-- kit:if backend -->
gestionarlos, exportarlos y crear nuevos. Es para quien los gestiona, con el
permiso `ORDERS.VIEW`.
<!-- kit:else -->
gestionarlos, exportarlos y crear nuevos. Es para quien los gestiona.
<!-- kit:end -->

## Qué hace

- Ver los pedidos de los almacenes elegidos en un listado paginado.

## URL y páginas

| Ruta | Página | Pestaña | Miga de pan |
|---|---|---|---|
| `/orders` | `OrdersPage` | «Gestión de pedidos» | «Pedidos / Gestión de pedidos» |

<!-- kit:if backend -->
## Permisos
<!-- kit:end -->
## Zonas de la pantalla
## Datos
## Raíz, dominios, familia y específico
## Decisiones de producto
## Historias
## Pendiente
```

Cada apartado, con sus tablas, está en la plantilla de
[Features](../features/README.md). El documento no tiene estado: lo tiene la
historia, en su fichero y en el [backlog](../backlog.md).

## 2. El nombre y la carpeta

El nombre sale de la URL
([Nomenclatura](../naming.md#familias-y-features)): `/orders` es
`orders`, `/orders/dashboard` es `ordersDashboard`, `/orders/new` es
`ordersNew` y `/orders/:id/edit` es `ordersEdit`. La carpeta va dentro de su
familia:

```text
src/features/orders/orders/
```

<!-- kit:if backend -->
Una pantalla sin familia va directa en `features/` (`features/profile/`). La
entrada, si hay login, es una familia más (`features/auth/authLogin/`): sus
rutas las monta `router/rootRoutes.tsx`, fuera del marco de la app, en lugar
de `appRoutes.tsx`. La forma de la carpeta
por dentro está en [Normativa](../standards.md#la-forma-de-una-feature): solo
se crean las carpetas que hacen falta.
<!-- kit:else -->
Una pantalla sin familia va directa en `features/` (`features/settings/`). La
forma de la carpeta por dentro está en
[Normativa](../standards.md#la-forma-de-una-feature): solo se crean las
carpetas que hacen falta.
<!-- kit:end -->

## 3. Las rutas

La feature declara sus rutas en `ordersRoutes.tsx`. Con una sola pantalla en
la app, su página va en `/`, directa, sin `lazy`, ni `handle`, ni una
redirección desde `/`:

```tsx
import type { RouteObject } from 'react-router'
import { OrdersPage } from './pages/OrdersPage'

export const ordersRoutes: RouteObject[] = [
  { index: true, Component: OrdersPage },
]
```

Desde la segunda, cada página se carga con `lazy` en forma de función, que
devuelve `{ Component }`: así, si no llega el código, sale la página de error
([Normativa](../standards.md#rutas-permisos-y-navegación)). Y si la app pinta
miga, como la de `orders`, que es de una familia con varias pantallas, la ruta
<!-- kit:if backend -->
lleva su segmento en `handle`. `orders` tiene una página, en el índice de la
familia, bajo su guarda:

```tsx
import type { RouteObject } from 'react-router'
import { SessionPermissionGuard } from '@/domains/session/components/SessionPermissionGuard'
import { ordersPermissions } from './ordersPermissions'

export const ordersRoutes: RouteObject[] = [
  {
    element: <SessionPermissionGuard allowed={(permissions) => ordersPermissions(permissions).canView} />,
    children: [
      {
        index: true,
        handle: { crumb: () => ({ labelKey: 'common:nav.orders', to: '/orders' }) },
        lazy: () => import('./pages/OrdersPage').then((m) => ({ Component: m.OrdersPage })),
      },
    ],
  },
]
```

La guarda y la regla salen del dominio `session`, que crea el proyecto con su
login ([Aplicar permisos](./apply-permissions.md#lo-que-da-la-sesión)). Una app
sin login no tiene guardas: sus rutas van sin el `element` de la guarda.
<!-- kit:else -->
lleva su segmento en `handle`. `orders` tiene una página, en el índice de la
familia:

```tsx
import type { RouteObject } from 'react-router'

export const ordersRoutes: RouteObject[] = [
  {
    index: true,
    handle: { crumb: () => ({ labelKey: 'common:nav.orders', to: '/orders' }) },
    lazy: () => import('./pages/OrdersPage').then((m) => ({ Component: m.OrdersPage })),
  },
]
```
<!-- kit:end -->

Después se añade a las rutas de la app, `src/router/appRoutes.tsx`, en
los `children` del segmento de su familia (`path: 'orders'`), junto a las
demás features de la familia: `...ordersRoutes, ...ordersDashboardRoutes,
...ordersNewRoutes, ...ordersEditRoutes`. Esa es la única línea que conoce la
feature desde fuera. El segmento de la familia lleva la miga de pan «Pedidos»,
sin `to`: es texto, sin enlace, porque la familia no tiene página. Así, la
miga de `orders` es «Pedidos / Gestión de pedidos».

- **`NavHandle`** (`types/navigation.ts`, que nace con la miga o con el menú)
  es el tipo del `handle`: su `crumb` recibe los parámetros de la URL.
- **Las rutas de una feature son relativas al segmento de la familia:**
  `ordersDashboard` declara `path: 'dashboard'`; `ordersNew`, `path: 'new'`, y
  `ordersEdit`, `path: ':id/edit'`.
- **Una ruta que no está en el menú** lleva `handle.navTo` con la entrada del
  menú que debe seguir marcada: en la gestión de un pedido, `'/orders'`. De
  ese `navTo` sale también el segundo nivel de su miga, porque la miga lleva
  siempre la lista: «Pedidos / Gestión de pedidos / Pedido #1287». La
  pestaña del navegador dice lo mismo que su segmento, «Pedido #1287», y el
  título de la página es otro texto, «Gestiona el pedido #1287».

## 4. La página

Cada página de `pages/` monta una pantalla: su cabecera y sus zonas. Reparte
<!-- kit:if backend -->
los datos que piden sus hooks a los componentes; no pide nada a un service ni
transforma datos. Un solo `return`, los hooks arriba y las piezas del sistema
de diseño en el JSX. Esta es la página de `orders`
(`pages/OrdersPage.tsx`):

```tsx
export function OrdersPage () {
  const { t } = useTranslation()
  const search = useOrdersStore((state) => state.listQuery.search)
  const request = useOrdersRequest()
  const list = useOrdersListPage(request)
  const [closing, setClosing] = useState<number | null>(null)

  const isClosing = closing !== null

  return (
    <>
      <OrderFiltersHeader
        title={t('orders:title')}
        total={list.data?.totalItems}
        isTotalError={list.isError}
        search={search}
      />
      <OrdersTable
        page={list.data}
        request={request}
        isError={list.isError}
        loading={list.isPending || list.isPlaceholderData}
        onRetry={() => { void list.refetch() }}
        onClose={setClosing}
      />
      {isClosing ? <OrderCloseModal id={closing} onClose={() => setClosing(null)} /> : null}
    </>
  )
}
```

El cuerpo de la petición (`useOrdersRequest`) es el mismo para la página y
para la exportación, así que la página lo arma una vez y se lo pasa a la
tabla, que exporta. El modal de cerrar un pedido es de la familia y se monta
solo mientras está abierto, con el pedido que eligió la fila: así pide lo suyo
al abrirse.
<!-- kit:else -->
los datos que dan sus hooks a los componentes y no transforma datos. Un solo
`return`, los hooks arriba y las piezas del sistema de diseño en el JSX. Esta
es la página de `orders` (`pages/OrdersPage.tsx`):

```tsx
export function OrdersPage () {
  const { t } = useTranslation()
  const search = useOrdersStore((state) => state.listQuery.search)
  const list = useOrdersListPage()
  const [closing, setClosing] = useState<number | null>(null)

  const isClosing = closing !== null

  return (
    <>
      <OrderFiltersHeader
        title={t('orders:title')}
        total={list.totalItems}
        search={search}
      />
      <OrdersTable
        page={list.page}
        onClose={setClosing}
      />
      {isClosing ? <OrderCloseModal id={closing} onClose={() => setClosing(null)} /> : null}
    </>
  )
}
```

El modal de cerrar un pedido es de la familia y se monta solo mientras está
abierto, con el pedido que eligió la fila: así empieza limpio cada vez.
<!-- kit:end -->

`ordersDashboard`, la otra feature de la familia, usa la misma cabecera, con
el enlace al listado, y debajo monta las secciones del análisis. La cabecera
(`OrderFiltersHeader`) es una pieza de `orders/common`, porque la usan las
dos: el título, el recuento y la barra de filtros. Recibe por props lo que
<!-- kit:if backend -->
depende de la página (el título, el recuento y si ha fallado, la búsqueda) y
<!-- kit:else -->
depende de la página (el título, el recuento y la búsqueda) y
<!-- kit:end -->
no sabe nada de ellas. Las pestañas de la gestión de un registro van en
`?tab=`, con `replace`; las de un asistente, en un `useState`
([Normativa](../standards.md#rutas-permisos-y-navegación)).

- **La cabecera es `PageHeader`** con su título y, si la pantalla necesita
  explicación, el icono de información
  ([D2](../ux-ui/rules.md#d2-sin-textos-explicativos)). El título de una
  pantalla que abre una entrada del menú es el texto de esa entrada («Gestión
  de pedidos»), y con él pone la cabecera la pestaña del navegador, con el
  `<title>` de React: «Gestión de pedidos - %%APP_NAME%%»
  ([D10](../ux-ui/rules.md#d10-navegación)).
- **Una pantalla sin barra de acciones abajo** (la gestión de un registro en
  lectura) lleva la vuelta encima del título. Lleva a donde se estaba: si la
  pantalla de origen pasó en el estado de navegación su destino de vuelta, usa
  ese texto y esa ruta; si no, la lista de la familia
  ([D10](../ux-ui/rules.md#d10-navegación)).
- **Lo que lleva a otra pantalla es un enlace:** un `Button` con `href`,
  nunca `onClick` con `navigate`
  ([D10](../ux-ui/rules.md#d10-navegación)).
- **Cada zona es un componente** de `components/` (o de `components/<zona>/`
  si tiene varias piezas), con su nombre según la fórmula de
  [Nomenclatura](../naming.md#componentes).

### Un componente

Un componente pinta lo que recibe: sus props van tipadas y sus estilos salen
de un `.module.css` al lado, con los tokens del sistema de diseño
([D1](../ux-ui/rules.md#d1-el-sistema-de-diseño-primero)).
Sus textos salen de `t()`, con el namespace de la feature.
La tarjeta de las líneas de `ordersEdit` no pide nada: sus props son justo lo
que devuelve su hook ([Un hook](#un-hook)), y la página se lo pasa entero
(`<OrdersEditLinesCard {...lines} />`).

<!-- kit:if backend -->
```tsx
type OrdersEditLinesCardProps = ReturnType<typeof useOrdersEditLines>

export function OrdersEditLinesCard ({ lines, isError, onRetry }: OrdersEditLinesCardProps) {
  const { t } = useTranslation()
  const isLoading = lines === undefined

  return (
    <Card title={t('ordersEdit:lines.title')}>
      {isError
        ? <ErrorState title={t('common:errorState.title')} retryLabel={t('common:errorState.retry')} onRetry={onRetry} />
        : isLoading
          ? <LoadingSkeleton />
          : <OrdersEditLinesTable lines={lines} />}
    </Card>
  )
}
```

- **Cada estado es una constante con nombre** (`isLoading`), y el JSX los
<!-- kit:else -->
```tsx
type OrdersEditLinesCardProps = ReturnType<typeof useOrdersEditLines>

export function OrdersEditLinesCard ({ lines }: OrdersEditLinesCardProps) {
  const { t } = useTranslation()
  const isEmpty = lines.length === 0

  return (
    <Card title={t('ordersEdit:lines.title')}>
      {isEmpty
        ? <EmptyState title={t('ordersEdit:lines.empty')} />
        : <OrdersEditLinesTable lines={lines} />}
    </Card>
  )
}
```

- **Cada estado es una constante con nombre** (`isEmpty`), y el JSX los
<!-- kit:end -->
  resuelve con ternarios, con `null` en la rama que no pinta; nunca `&&`
  ([Normativa](../standards.md#componentes)).
- **La tabla es otro componente,** en su propio fichero: un fichero de
  componente tiene una sola función.
- **Las props de función se llaman `onX`.** Una flecha en línea solo relanza
  una llamada; un handler local que hace algo más (abrir un modal, avisar) se
  llama `handleX`.

### Un hook

<!-- kit:if backend -->
El hook de la feature pide el dato y devuelve justo las props de la pieza que
lo pinta, para que el componente no transforme nada. Este es el de las líneas
del pedido:

```ts
import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/orders/ordersService'
import { formatUtils } from '@/utils/formatUtils'
import { ordersEditLineUtils } from '../utils/ordersEditLineUtils'

/**
 * Las líneas del pedido de la gestión, listas para su tarjeta: el producto, la cantidad y el importe de cada una, con formato.
 * @param id Id del pedido.
 * @returns `lines` (`undefined` mientras carga), `isError` y `onRetry`, que las vuelve a pedir.
 */
export function useOrdersEditLines (id: number) {
  const { data, isError, refetch } = useQuery({
    queryKey: ['ordersService', 'getOrderEditLines', id],
    queryFn: () => ordersService.getOrderEditLines(id),
  })

  return {
    lines: data?.map((line) => ({
      id: line.id,
      product: line.productName,
      quantity: formatUtils.formatNumber(line.quantity),
      amount: formatUtils.formatAmount(ordersEditLineUtils.getOrdersEditLineAmount(line)),
    })),
    isError,
    onRetry: () => { void refetch() },
  }
}
```

- **La clave es `[service, método, ...parámetros]`:** dos features que piden
  el mismo dato con la misma clave comparten la caché, sin importarse
  ([Cargar y guardar datos](./load-and-save-data.md#2-un-dato)).
<!-- kit:else -->
El hook de la feature lee el dato y devuelve justo las props de la pieza que
lo pinta, para que el componente no transforme nada. Lo que la app guarda sin
API se decide en `/zaius-init` y se monta con la primera historia que lo
necesita; en el ejemplo, los pedidos están en un store de la familia,
`useOrderRecordsStore`. Este es el hook de las líneas del pedido:

```ts
import { formatUtils } from '@/utils/formatUtils'
import { useOrderRecordsStore } from '../../common/stores/useOrderRecordsStore'
import { ordersEditLineUtils } from '../utils/ordersEditLineUtils'

/**
 * Las líneas del pedido de la gestión, listas para su tarjeta: el producto, la cantidad y el importe de cada una, con formato.
 * @param id Id del pedido.
 * @returns `lines`, una lista vacía si el pedido no tiene ninguna.
 */
export function useOrdersEditLines (id: number) {
  const order = useOrderRecordsStore((state) => state.orders.find((item) => item.id === id))

  return {
    lines: (order?.lines ?? []).map((line) => ({
      id: line.id,
      product: line.productName,
      quantity: formatUtils.formatNumber(line.quantity),
      amount: formatUtils.formatAmount(ordersEditLineUtils.getOrdersEditLineAmount(line)),
    })),
  }
}
```

<!-- kit:end -->
- **Lo que se calcula sin `t` ni locale va en `utils/`,** en el objeto de su
  tema. El hook solo junta, traduce y da formato:

```ts
<!-- kit:if backend -->
import type { OrderEditLines } from '@/services/orders/ordersEditSchema'

/**
 * Calcula el importe de una línea del pedido: la cantidad por el precio, menos el descuento.
 * @param line Una línea, como la da `getOrderEditLines`.
 * @returns El importe, sin redondear.
 */
function getOrdersEditLineAmount (line: OrderEditLines[number]): number {
<!-- kit:else -->
import type { OrderRecord } from '../../common/stores/useOrderRecordsStore'

/**
 * Calcula el importe de una línea del pedido: la cantidad por el precio, menos el descuento.
 * @param line Una línea del pedido guardado.
 * @returns El importe, sin redondear.
 */
function getOrdersEditLineAmount (line: OrderRecord['lines'][number]): number {
<!-- kit:end -->
  return line.quantity * line.unitPrice * (1 - line.discount / 100)
}

export const ordersEditLineUtils = {
  getOrdersEditLineAmount,
}
```

- **El formato sale de las funciones de la raíz,** `formatUtils`
  (`src/utils/formatUtils.ts`), que nace con la primera feature que formatea
  algo: fechas, cifras, importes y porcentajes, siempre igual en toda la app
  ([D11](../ux-ui/rules.md#d11-textos-y-formato)). Ninguna pantalla formatea
  a mano.
<!-- kit:if backend -->
- **Mientras carga, `lines` es `undefined`,** y el componente lo lee como su
  estado de carga; un fallo va en `isError`, con su reintento
  ([Carga, error y vacío](./load-and-save-data.md#3-carga-error-y-vacío)).
<!-- kit:else -->
- **Sin líneas, `lines` es una lista vacía,** y el componente la pinta como su
  estado vacío ([D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío)).
<!-- kit:end -->

## 5. Los textos

Cada feature lleva un catálogo por idioma de la app (%%LANGUAGES%%) en su
carpeta `i18n/` (`i18n/<idioma>.json`). Se cargan solos: el namespace es el
nombre de la carpeta, así que añadir una feature no toca `src/i18n/`. Los
textos del `common` de una familia van en el namespace de la familia
(`orders:`); `common:` es solo de la raíz. Las claves se agrupan por zona, y
el texto del icono de información de cada zona es `info`. El catálogo en
castellano de `orders`:

```json
{
  "title": "Gestión de pedidos",
  "create": "Crea un pedido",
  "table": {
    "title": "Listado de pedidos",
    "info": "Cada pedido con su cliente, su estado y su fecha de entrega. Por defecto, del más reciente al más antiguo. Se pueden buscar por número o por cliente.",
    "manage": "Gestiona",
    "manageAria": "Gestiona el pedido #{{id}}"
  }
}
```

La acción de una fila que solo lleva el verbo («Gestiona», «Quita») tiene su
texto a la vista y, en `…Aria`, el que nombra el registro para el lector de
pantalla ([D12](../ux-ui/rules.md#d12-accesibilidad)).

Los catálogos de todos los idiomas llevan las mismas claves: lo mira la
[comprobación de la estructura](../standards.md#comprobar-la-estructura).
Cada `t()` lleva su namespace y la clave entera, de la zona al texto:
`t('orders:table.title')`. Las variables van como segundo argumento. Un
número que concuerda va siempre en `count`, y la clave tiene sus formas de
plural (`_one` y `_other`: «1 pedido», «24 pedidos»):
`t('orders:filters.subtitle', { count })`
([D11](../ux-ui/rules.md#d11-textos-y-formato)). Las reglas de nombres de
las claves están en [Nomenclatura](../naming.md#textos-i18n).

## 6. El menú

Con una sola pantalla no hay menú: nace con la segunda que se abre desde él,
y entran las dos ([Normativa](../standards.md#rutas-permisos-y-navegación)).

<!-- kit:if backend -->
Si la feature es destino del menú, se añade su entrada en
`src/router/navigation.config.ts`, con su texto y una regla `allowed`
con el permiso que pide su ruta: sin él, la entrada no se ve. El menú no
importa de la feature, así que la regla repite el permiso:

```ts
{ to: '/orders', labelKey: 'common:nav.orders', allowed: (permissions) => permissions.includes('ORDERS.VIEW') }
```
<!-- kit:else -->
Si la feature es destino del menú, se añade su entrada en
`src/router/navigation.config.ts`, con su ruta y su texto:

```ts
{ to: '/orders', labelKey: 'common:nav.orders' }
```
<!-- kit:end -->

La etiqueta es `common:nav.<feature>`, con el nombre de la feature
(`common:nav.ordersNew`, `common:nav.orders`).

La entrada va en los `children` del grupo de su familia, en su sitio: las tres
primeras son siempre añadir, análisis y gestión («Añadir pedido», «Análisis de
pedidos» y «Gestión de pedidos»), y lo propio de la familia va detrás. Una
familia sin análisis se lo salta. El grupo («Pedidos») es solo el nombre de la
<!-- kit:if backend -->
familia: no tiene `to` ni regla propia, su cabecera despliega o pliega sus
entradas y se ve si se ve alguna de ellas
([Aplicar permisos](./apply-permissions.md#8-el-menú)). El texto de la entrada
es también el segmento de la pantalla en la miga, si la app la pinta
([las rutas](#3-las-rutas)).

## 7. Los permisos

La ruta de una pantalla que necesita un permiso cuelga de
`SessionPermissionGuard`, como en [las rutas](#3-las-rutas). Si la misma regla
decide también los botones, es una función pura `ordersPermissions` en
`ordersPermissions.ts`, en la raíz de la feature, junto a sus rutas (no es
un util), y la página la aplica con `useSessionPermissions`:

```tsx
const { canExport, canCreate } = useSessionPermissions(ordersPermissions)
```

`ordersDashboard` tiene la suya, `ordersDashboardPermissions`: aunque pida lo
mismo que `orders`, ninguna de las dos features importa la regla de la
otra. Cómo se escribe la regla y cómo se aplica a una ruta, un botón, una
pestaña, una petición o el menú, con ejemplos:
[Aplicar permisos](./apply-permissions.md#la-regla).

## 8. Los datos y el estado

Cada dato va en un sitio, según lo que sea:

| Es | Va en | En `orders` |
|---|---|---|
| Un dato del servidor | `useQuery` en un hook, con la clave `[service, método, ...parámetros]` | `useOrdersListPage` |
| Un guardado o una exportación | `useMutation` en un hook | `useOrdersExport` |
| Lo que solo importa mientras la pantalla está abierta | `useState` | el borrador de «Más filtros», hasta aplicarlo |
| Lo que sobrevive a abrir un registro y volver, y a recargar (los filtros, la página, el orden, los ajustes de vista) | Un store de `stores/`, guardado en el `sessionStorage` sin la búsqueda; si lo comparten dos features de la familia, uno de su `common` | `useOrdersStore`: la consulta del listado; `useOrderFiltersStore`, de `orders/common`: los filtros aplicados |
| Lo que se comparte con un enlace | La URL | la pantalla (`/orders`) y, en la gestión de un registro, su pestaña (`/orders/1287/edit?tab=documents`) |

Si el endpoint aún no existe en el service, se añade antes
([Añadir un servicio](./add-a-service.md)); cómo se piden, se guardan y
se recargan los datos está en
[Cargar y guardar datos](./load-and-save-data.md). Lo que ya existe en la
raíz, en un dominio o en el `common` de la familia se reutiliza; nada se
importa de otra feature: si dos necesitan lo mismo, se sube primero
([Normativa](../standards.md#independencia-de-las-features)).

## 9. Los tests

<!-- kit:if mocks -->
Cada fichero con código tiene su test al lado, con el mismo nombre; solo se
libran los tipos, las constantes, la configuración y las rutas. La página se
prueba entera contra los mocks, montando solo las rutas de la feature.
<!-- kit:else -->
Cada fichero con código tiene su test al lado, con el mismo nombre; solo se
libran los tipos, las constantes, la configuración y las rutas. La página se
prueba entera, con el service simulado, montando solo las rutas de la feature.
<!-- kit:end -->
<!-- kit:else -->
familia: no tiene `to` y su cabecera despliega o pliega sus entradas. El texto
de la entrada es también el segmento de la pantalla en la miga, si la app la
pinta ([las rutas](#3-las-rutas)).

## 7. Los datos y el estado

Cada dato va en un sitio, según lo que sea:

| Es | Va en | En `orders` |
|---|---|---|
| Lo que la app guarda (los pedidos) | El sitio que se decide en `/zaius-init`; en el ejemplo, un store de la familia | `useOrderRecordsStore`, de `orders/common` |
| Un dato fijo, que no cambia al usar la app (los motivos de cierre) | Una constante de `constants/` | `ORDER_CLOSE_REASONS`, de `orders/common` |
| Lo que solo importa mientras la pantalla está abierta | `useState` | el borrador de «Más filtros», hasta aplicarlo |
| Lo que sobrevive a abrir un registro y volver, y a recargar (los filtros, la página, el orden, los ajustes de vista) | Un store de `stores/`, guardado en el `sessionStorage` sin la búsqueda; si lo comparten dos features de la familia, uno de su `common` | `useOrdersStore`: la consulta del listado; `useOrderFiltersStore`, de `orders/common`: los filtros aplicados |
| Lo que se comparte con un enlace | La URL | la pantalla (`/orders`) y, en la gestión de un registro, su pestaña (`/orders/1287/edit?tab=documents`) |

Dónde guarda la app sus datos se decide en `/zaius-init` y queda en el
[brief](../brief.md); la primera historia que guarda algo lo monta, con el OK
de la persona. Lo que ya existe en la raíz, en un dominio o en el `common` de
la familia se reutiliza; nada se importa de otra feature: si dos necesitan lo
mismo, se sube primero
([Normativa](../standards.md#independencia-de-las-features)).

## 8. Los tests

Cada fichero con código tiene su test al lado, con el mismo nombre; solo se
libran los tipos, las constantes, la configuración y las rutas. La página se
prueba entera, montando solo las rutas de la feature.
<!-- kit:end -->
Los tests salen de la lista de la historia y se escriben antes que su código,
uno a uno. Cómo: [Escribir tests](./write-tests.md#una-página).

## Las animaciones

Cuánto se mueve la app lo dice «Movimiento», en el sistema de diseño, y cómo,
[D13](../ux-ui/rules.md#d13-movimiento). En una app de trabajo, lo justo: lo
que se mueve explica qué ha cambiado.

- **Las piezas del sistema de diseño ya traen las suyas** (un modal que se
  abre, un aviso que llega): no se rehacen.
- **Una transición propia** va en el `.module.css` del componente, con los
  tokens de movimiento, solo sobre `transform` y `opacity`, y con su versión
  para «reducir movimiento»:

  ```css
  .row {
    transition: opacity var(--motion-fast) var(--motion-ease);
  }

  @media (prefers-reduced-motion: reduce) {
    .row {
      transition: none;
    }
  }
  ```

- **Una animación que no cabe en CSS** (una lista que se reordena, un panel
  que se arrastra) pide una librería, como Motion: es una dependencia nueva,
  con el OK.
- **Se revisa con «reducir movimiento» activado,** en la revisión visual.

## La feature terminada

Con las piezas que nombra esta guía, las dos features de la familia `orders`
que salen en ella y su `common` quedan así (cada fichero con código tiene su
`.test` al lado). El resto está en el apartado «Raíz, dominios, familia y
específico» del documento de cada feature.

<!-- kit:if backend -->
```text
orders/
    orders/
        pages/OrdersPage.tsx
        components/OrdersTable.tsx
        hooks/
            useOrdersExport.ts
            useOrdersListPage.ts
            useOrdersRequest.ts
        constants/ordersColumns.ts
        stores/useOrdersStore.ts
        ordersPermissions.ts
        ordersRoutes.tsx
    ordersEdit/
        pages/OrdersEditPage.tsx
        components/lines/
            OrdersEditLinesCard.tsx
            OrdersEditLinesTable.tsx
        hooks/
            useOrdersEdit.ts
            useOrdersEditLines.ts
        utils/ordersEditLineUtils.ts
        ordersEditPermissions.ts
        ordersEditRoutes.tsx
    common/
        components/
            OrderFiltersHeader.tsx
            OrderCloseModal.tsx
        stores/useOrderFiltersStore.ts
        utils/
            orderQueryUtils.ts
            orderRequestUtils.ts
```
<!-- kit:else -->
```text
orders/
    orders/
        pages/OrdersPage.tsx
        components/OrdersTable.tsx
        hooks/
            useOrdersExport.ts
            useOrdersListPage.ts
        constants/ordersColumns.ts
        stores/useOrdersStore.ts
        ordersRoutes.tsx
    ordersEdit/
        pages/OrdersEditPage.tsx
        components/lines/
            OrdersEditLinesCard.tsx
            OrdersEditLinesTable.tsx
        hooks/
            useOrdersEdit.ts
            useOrdersEditLines.ts
        utils/ordersEditLineUtils.ts
        ordersEditRoutes.tsx
    common/
        components/
            OrderFiltersHeader.tsx
            OrderCloseModal.tsx
        constants/orderCloseReasons.ts
        stores/
            useOrderFiltersStore.ts
            useOrderRecordsStore.ts
        utils/orderQueryUtils.ts
```
<!-- kit:end -->

Cada feature y el `common` llevan además su carpeta `i18n/`, con un catálogo
por idioma.

`ordersDashboard` lee los filtros aplicados de `useOrderFiltersStore`, el
mismo que usa `orders`, así que pasar de una a otra conserva los filtros.

## Errores comunes

| Síntoma | Causa |
|---|---|
| La página sale en blanco y la consola dice que falta un export | El `lazy` importa un nombre distinto del que exporta la página. |
| La pestaña del navegador dice solo «%%APP_NAME%%» | La pantalla no pone su `<title>`: falta en su cabecera. |
| Se ven las claves (`orders:title`) en lugar de los textos | El namespace no coincide con el nombre de la carpeta, o falta la clave en el catálogo del idioma. |
| La entrada del menú no se marca en la gestión de un registro | Falta `handle.navTo` en su ruta. |
| Falla la independencia en la comprobación de la estructura | La feature importa de otra feature o de otra familia: hay que subir lo compartido. |
<!-- kit:if backend -->
| La pantalla dice «No tienes acceso a esta página» con alguien que debería entrar | La regla de `SessionPermissionGuard` pide un permiso que la sesión no trae. |
| La lista no se actualiza al cambiar un filtro | La clave de consulta no lleva el cuerpo entero de la petición. |
| La lista vuelve a la carga al cambiar un filtro | Falta `placeholderData: keepPreviousData`, o el `loading` de la tabla lee `isFetching` en lugar de `isPending \|\| isPlaceholderData`. |
<!-- kit:end -->
| «Gestiona» no se puede abrir en otra pestaña | Navega con `onClick` y `navigate`: lo que lleva a otra pantalla es un enlace con `href`. |
<!-- kit:if backend -->
| Dos zonas piden el mismo dato dos veces | Sus claves de consulta no son iguales: un parámetro distinto o un objeto que se crea en cada render. |
<!-- kit:end -->
| Falla «un test por fichero» en la comprobación de la estructura | Un fichero con código no tiene su `.test` al lado, con el mismo nombre. |
