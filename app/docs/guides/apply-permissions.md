# Aplicar permisos

Esta guía decide qué ve y qué puede hacer cada persona en una feature: dice
qué tiene que dar la sesión, escribe la regla de permisos de la feature y la
aplica a la ruta, los botones, las acciones de fila, las pestañas, las zonas
de la pantalla, las peticiones y la entrada del menú. Sirve para quien monta
una feature y para quien añade a una pantalla algo que pide un permiso. El
ejemplo es `orders`, la gestión de los pedidos, en `/orders`; donde otra
pieza enseña mejor el patrón, sale de `ordersNew` o de `ordersEdit`.

Después de los pasos vienen los casos especiales: varios permisos a la vez,
decidir por rol, pedir un permiso que aún no existe y qué hacer cuando la API
pide otra cosa que la app. Una app sin login no tiene sesión ni permisos: sus
rutas van sin guarda y esta guía no se aplica.

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- **1. La regla de la feature:** [Lo que da la sesión](#lo-que-da-la-sesión), [La regla](#la-regla)
- [2. La ruta](#2-la-ruta)
- [3. Los botones](#3-los-botones)
- [4. Las acciones de fila](#4-las-acciones-de-fila)
- [5. Las pestañas](#5-las-pestañas)
- [6. Las zonas de la pantalla](#6-las-zonas-de-la-pantalla)
- [7. Las peticiones](#7-las-peticiones)
- [8. El menú](#8-el-menú)
- [9. Los tests de la regla](#9-los-tests-de-la-regla)
- **Casos especiales:** [Varios permisos](#varios-permisos), [Por rol](#por-rol), [Un permiso nuevo](#un-permiso-nuevo), [Cuando la API pide otra cosa](#cuando-la-api-pide-otra-cosa)
- [Errores comunes](#errores-comunes)

## 1. La regla de la feature

Los permisos no se inventan en la feature: llegan con la sesión. Antes de
escribir la regla, de dónde salen y qué piezas los aplican.

### Lo que da la sesión

El dominio `session` (la sesión, sus permisos y sus guardas) no viene hecho:
lo crea el proyecto con su login, en `src/domains/session/`, como cualquier
dominio ([Normativa](../standards.md#dominios)). Las pantallas del login, la
entrada, son una familia más, `auth` (`features/auth/authLogin/`), fuera del
marco de la app: `rootRoutes.tsx` monta sus rutas bajo `SessionGuestGuard`,
con su layout (`AuthLayout`). La sesión tiene que dar estas piezas,
con estos nombres, porque las features y las guías cuentan con ellas:

| Pieza | Qué da |
|---|---|
| `useSessionStore` (`stores/`) | La sesión (`session`: el token, la lista de permisos y lo que el proyecto necesite de la persona, o `null`), con `setSession` y `clearSession`. La guarda donde sobreviva a recargar y, al crearse, se conecta al transporte con `apiSessionUtils.connect({ getToken, onEnd })`: `getToken` da el token de la sesión y `onEnd` la cierra cuando la API la da por terminada ([Errores de la API](./add-a-service.md#errores-de-la-api)). |
| `useSessionPermissions(rule)` (`hooks/`) | Aplica la regla de una feature a los permisos de la sesión actual y devuelve lo que devuelve la regla; sin sesión, la aplica a una lista vacía. |
| `SessionGuard` (`components/`) | Protege las rutas que piden sesión: sin ella, lleva a la entrada con la ruta pedida, para volver a ella al entrar. |
| `SessionPermissionGuard` (`components/`) | Protege una ruta con una regla, `allowed(permissions)`: sin permiso, pinta dentro de la app «No tienes acceso a esta página», con «Vuelve al inicio», y no monta la página, así que no pide nada. |

- **Al cerrarse la sesión no queda nada de la persona:** se vacía la caché de
  consultas y cada store que guarda algo suyo vuelve a su estado inicial
  ([El store de una pantalla](./load-and-save-data.md#6-el-store-de-una-pantalla)).
- **En los tests,** `setup.ts` cierra la sesión antes de cada test, y un test
  abre la que necesita con `useSessionStore.getState().setSession(…)`, con los
  permisos del caso ([9. Los tests de la regla](#9-los-tests-de-la-regla)).
- **Lo que pinta cada pieza** (la entrada, el aviso de sesión caducada, la
  página sin acceso) lo dice [D10](../ux-ui/rules.md#d10-navegación).

### La regla

- **Un permiso es `SECCIÓN.ACCIÓN`,** por ejemplo `ORDERS.VIEW` o
  `ORDERS.EDIT`. Las acciones habituales son `VIEW`, `CREATE`, `EDIT`,
  `DELETE` y `EXPORT`; las secciones son las áreas de la aplicación (los
  pedidos, las facturas, cada pantalla de administración…).
- **Un rol es un conjunto de permisos.** Una persona puede tener varios roles
  y recibe la unión de todos.
- **La lista llega al entrar.** La respuesta del login trae los permisos de la
  persona y la sesión los guarda. Si se cambia un rol, la persona lo ve al
  volver a entrar.
- **La API es la que manda.** Cada endpoint declara qué permiso pide, o una
  lista de la que basta uno, y lo comprueba en cada petición.
- **La app solo decide qué ofrecer, y nunca ofrece más de lo que la API
  acepta.** Un botón que la API rechazaría es un fallo que la persona no
  puede arreglar; y si la API responde a la falta de permiso con el estado que
  cierra la sesión (un `401`, por defecto:
  [Puntos de adaptación a la API](./add-a-service.md#puntos-de-adaptación-a-la-api)),
  la echa a la entrada a media tarea. Por eso lo que el permiso o el estado
  del registro no deja hacer no se ofrece, ni desactivado ni con un aviso
  ([D5](../ux-ui/rules.md#d5-acciones)). Esconder algo es una comodidad; la
  seguridad la pone la API.

Con eso, cada decisión de la pantalla es una regla `canX`, y todas juntas son
una función pura en `<feature>Permissions.ts`, en la raíz de la feature,
junto a `<feature>Routes.tsx` (no es un util), que recibe la lista de
permisos de la sesión. Esta es la de `orders`:

```ts
/**
 * Lo que puede hacer la sesión en el listado de pedidos.
 * @param permissions Los permisos de la sesión.
 * @returns `canView`, `canExport`, `canManage`, `canClose`, `canCancel` y `canCreate`.
 */
export function ordersPermissions (permissions: string[]) {
  return {
    canView: permissions.includes('ORDERS.VIEW'),
    canExport: permissions.includes('ORDERS.EXPORT'),
    canManage: permissions.includes('ORDERS.VIEW'),
    canClose: permissions.includes('ORDERS.EDIT'),
    canCancel: permissions.includes('ORDERS.DELETE'),
    canCreate: permissions.includes('ORDERS.CREATE'),
  }
}
```

- **Una regla por decisión,** con el nombre de lo que decide: `canExport`, no
  `hasExportPermission`. Cada una pide lo que pide el endpoint al que da paso.
- **La misma función decide la ruta y los botones,** para que nunca se
  desajusten. La página la aplica con `useSessionPermissions`, que devuelve lo
  que devuelve la regla para la sesión actual:

```tsx
const { canExport, canCreate } = useSessionPermissions(ordersPermissions)
```

- **Cada regla se escribe en el documento de su feature,** en el apartado
  «Permisos»: nombre, permiso de la API y qué decide.
- **Si la regla solo la usa la ruta,** va en línea en `allowed` y no hace
  falta el fichero.
- **Una regla que otra feature necesita igual se repite en cada una:** por
  independencia, ninguna importa la de la otra
  ([Normativa](../standards.md#independencia-de-las-features)).

## 2. La ruta

Una pantalla que pide un permiso cuelga de `SessionPermissionGuard` con la
regla de la feature. Sin permiso, la guarda no monta la página, así que no se
pide nada:

```tsx
import type { RouteObject } from 'react-router'
import { SessionPermissionGuard } from '@/domains/session/components/SessionPermissionGuard'
import { ordersPermissions } from './ordersPermissions'

export const ordersRoutes: RouteObject[] = [
  {
    element: <SessionPermissionGuard allowed={(permissions) => ordersPermissions(permissions).canView} />,
    children: [
      { index: true, handle: ordersHandle, lazy: () => import('./pages/OrdersPage').then((m) => ({ Component: m.OrdersPage })) },
    ],
  },
]
```

`ordersDashboard`, el análisis de la misma familia, tiene su propia guarda con
su propia regla (`ordersDashboardPermissions`): pide el mismo permiso, pero
ninguna de las dos features importa la regla de la otra. Una subruta que pide
más que su feature lleva su propia guarda con su propia regla. La miga de pan
(`handle`) está en [Crear una feature](./create-a-feature.md#3-las-rutas).

## 3. Los botones

Un botón que pide un permiso no se ofrece sin él: ni desactivado ni con un
aviso. Un componente tiene un solo `return`, así que un elemento opcional se
pinta con un ternario, con `null` en la rama que no pinta
([Normativa](../standards.md#componentes)). Así sale «Ve al listado» en la
pantalla final del alta de un pedido, solo para quien puede ver el listado.
Lleva a otra pantalla, así que es un enlace (`href`)
([D10](../ux-ui/rules.md#d10-navegación)):

```tsx
const { canViewList } = useSessionPermissions(ordersNewPermissions)

return (
  <ActionBar>
    {canViewList ? <Button variant='secondary' href='/orders'>{t('common:wizard.toList')}</Button> : null}
    <Button onClick={onCreateAnother}>{t('ordersNew:done.createAnother')}</Button>
  </ActionBar>
)
```

- **Para elegir entre dos cosas** se usa un ternario. Si de un grupo de
  acciones no queda ninguna, el grupo tampoco se pinta.
- **Volver no lleva a una pantalla sin permiso.** La salida de la gestión de
  un registro sin origen, o la de un registro que no existe, lleva a la lista
  de su familia; si la persona no puede verla, lleva al inicio. La regla que
  lo decide es la de la lista (`canViewList`), repetida en la feature
  ([D10](../ux-ui/rules.md#d10-navegación)).
- **Solo se desactiva lo que se puede desbloquear en la misma pantalla,** y
  la causa se ve sin pasar el ratón: «Exporta» con la tabla vacía, no sin
  permiso ([D5](../ux-ui/rules.md#d5-acciones)).

## 4. Las acciones de fila

Cuando la tabla tiene acciones por fila, cada una se ofrece solo con su
permiso y en los estados en que se puede hacer. Cuántas se ven, cuál va la
última y cuáles van en el menú de más acciones de la fila lo dice
[D8](../ux-ui/rules.md#d8-listados-y-tablas); aquí, cómo se arman.

«Gestiona» pide lo que pide la gestión para abrirse, no para editar: su regla
es `canManage`, que en los pedidos es `ORDERS.VIEW`, porque la gestión se abre
en lectura a quien solo puede ver
([La lectura](./create-a-form.md#6-la-lectura)). Si la API pidiera el
permiso de editar también para leer el registro, `canManage` pediría ese, y
sin él «Gestiona» no se ofrecería.

Las acciones de una fila son funciones que reciben la fila y devuelven sus
acciones: las que se ven y las del menú de más acciones. Una acción sin permiso,
o que el estado no deja hacer, no está en la lista; si el menú se queda sin
ninguna, no se pinta. En el listado de pedidos, una fila puede tener tres
(gestionar, cerrar y cancelar), así que cerrar y cancelar van en el menú:

```ts
const { t } = useTranslation()
const { canManage, canClose, canCancel } = useSessionPermissions(ordersPermissions)

const rowActions = (order: OrdersListRow) => canManage
  ? [{ label: t('orders:table.manage'), ariaLabel: t('orders:table.manageAria', { id: order.id }), href: `/orders/${order.id}/edit` }]
  : []

const rowMenu = (order: OrdersListRow) => {
  const isOpen = orderStatusUtils.isOrderOpen(order.status)

  return [
    ...(canClose && isOpen ? [{ label: t('orders:table.close'), ariaLabel: t('orders:table.closeAria', { id: order.id }), onClick: () => onClose(order.id) }] : []),
    ...(canCancel && isOpen ? [{ label: t('orders:table.cancel'), ariaLabel: t('orders:table.cancelAria', { id: order.id }), destructive: true, onClick: () => onCancel(order.id) }] : []),
  ]
}
```

Se arman en el hook que prepara la tabla.

Cada acción lleva su regla y, si solo vale en unos estados, la condición del
estado, que es de la familia (`orderStatusUtils.isOrderOpen`, en
`orders/common`). `onClose` y `onCancel` abren los modales de la familia, los
mismos que en la gestión del pedido. «Gestiona» lleva a otra pantalla, así
que es un enlace (`href`).

## 5. Las pestañas

La pestaña que pide un permiso no sale en la lista de pestañas:

```tsx
const { canViewInvoices } = useSessionPermissions(ordersEditPermissions)

const tabs = [
  { value: 'data', label: t('ordersEdit:tabs.data') },
  { value: 'documents', label: t('ordersEdit:tabs.documents') },
  ...(canViewInvoices ? [{ value: 'invoices', label: t('ordersEdit:tabs.invoices') }] : []),
]
```

Los datos de esa pestaña llevan además la regla en su petición
([Las peticiones](#7-las-peticiones)), para que ni escribiendo
`?tab=invoices` en la URL se pida nada. Una `?tab=` que la persona no puede
ver, o que no existe, abre la pestaña por defecto
([Las pestañas](./create-a-form.md#3-las-pestañas)).

## 6. Las zonas de la pantalla

Una tarjeta, una sección o un campo opcional se pinta igual que un botón:
`{canX ? … : null}`, o con la alternativa en lugar de `null`. En la gestión de
un pedido, la tarjeta de su cliente solo enlaza a la ficha del cliente con
`canViewCustomer`; sin él, enseña sus datos sin enlace. La zona y los datos
que pide llevan la misma regla, para que no se pida nada de lo que no se ve
([Las peticiones](#7-las-peticiones)).

La lectura de una gestión es la alternativa de un ternario: con `canEdit`, el
formulario y su barra; sin él, los mismos datos en lectura, con el aviso de
que no se puede editar bajo la cabecera
([La lectura](./create-a-form.md#6-la-lectura)).

## 7. Las peticiones

Una petición que pide un permiso que la sesión no tiene la rechazaría la API
y, si lo hace con el estado que cierra la sesión, echaría a la persona a la
entrada. Por eso el hook que la hace lleva la regla en `enabled`:

```ts
import { useQuery } from '@tanstack/react-query'
import { useSessionPermissions } from '@/domains/session/hooks/useSessionPermissions'
import { ordersService } from '@/services/orders/ordersService'
import { ordersEditPermissions } from '../ordersEditPermissions'

/**
 * Las facturas del pedido de la gestión, solo si la sesión puede verlas.
 * @param id Id del pedido.
 * @returns La consulta de TanStack Query.
 */
export function useOrdersEditInvoices (id: number) {
  const { canViewInvoices } = useSessionPermissions(ordersEditPermissions)

  return useQuery({
    queryKey: ['ordersService', 'getOrderEditInvoices', id],
    queryFn: () => ordersService.getOrderEditInvoices(id),
    enabled: canViewInvoices,
  })
}
```

Con la ruta bien protegida y la zona sin pintar casi nunca llega a hacer
falta, pero es lo que impide que un descuido saque a alguien de la sesión.
Cuándo se pide un dato y cuándo no:
[Cargar y guardar datos](./load-and-save-data.md#2-un-dato).

## 8. El menú

Si la feature es destino del menú, su entrada lleva su regla en `allowed`, en
`navigation.config.ts`. El menú no importa de la feature, así que repite el
permiso que pide la ruta. Un grupo (una familia) es solo el nombre de la
familia: no tiene `to` ni regla propia. Cada una de sus entradas lleva la
suya, en el orden del menú (añadir, análisis, gestión y lo propio de la
familia):

```ts
{
  labelKey: 'common:navGroups.orders',
  children: [
    { to: '/orders/new', labelKey: 'common:nav.ordersNew', allowed: (permissions) => permissions.includes('ORDERS.CREATE') },
    { to: '/orders/dashboard', labelKey: 'common:nav.ordersDashboard', allowed: (permissions) => permissions.includes('ORDERS.VIEW') },
    { to: '/orders', labelKey: 'common:nav.orders', allowed: (permissions) => permissions.includes('ORDERS.VIEW') },
  ],
}
```

- **Una entrada sin permiso no se ve.**
- **Un grupo se ve si se ve alguna de sus entradas:** «Pedidos» se ve con
  `ORDERS.VIEW` o con `ORDERS.CREATE`. Sin ninguna, el grupo no se pinta.
- **La regla del menú y la de la ruta piden lo mismo.** Si no, la entrada se
  ve y la ruta dice que no hay acceso, o al revés.

## 9. Los tests de la regla

La regla es una función pura: se prueba con listas, sin sesión ni datos, en
su test, al lado (`ordersPermissions.test.ts`). Un `it` por regla, con un
caso con el permiso y otro sin él:

```ts
import { describe, expect, it } from 'vitest'
import { ordersPermissions } from './ordersPermissions'

describe('ordersPermissions', () => {
  it('canExport pide ORDERS.EXPORT', () => {
    expect(ordersPermissions(['ORDERS.EXPORT']).canExport).toBe(true)
    expect(ordersPermissions(['ORDERS.VIEW']).canExport).toBe(false)
  })

  it('canCancel pide ORDERS.DELETE', () => {
    expect(ordersPermissions(['ORDERS.DELETE']).canCancel).toBe(true)
    expect(ordersPermissions(['ORDERS.EDIT']).canCancel).toBe(false)
  })
})
```

La página se prueba con los permisos del caso y sin ellos: con el permiso
sale el botón, sin él no sale, ni siquiera desactivado
([Escribir tests](./write-tests.md#una-página)). El test abre la sesión
con los permisos que necesita antes de montar la página:

```ts
useSessionStore.getState().setSession({ ...session, permissions: ['ORDERS.VIEW'] })
```

`session` es una sesión de ejemplo, con la forma de la del login, que el
proyecto crea para sus tests con el dominio `session`.

## Casos especiales

Los pasos suponen una regla que pide un permiso por decisión y una API de
acuerdo con la app. Estos son los casos que se salen de ahí.

### Varios permisos

Una decisión puede pedir más de un permiso:

- **Todos (y):** la pantalla encadena endpoints y cada uno pide el suyo. Se
  piden todos:

```ts
canCreate: permissions.includes('ORDERS.CREATE') && permissions.includes('CUSTOMERS.VIEW'),
```

- **Alguno (o):** un solo endpoint acepta una lista y deja pasar con
  cualquiera. La regla copia esa lista:

```ts
canUpload: permissions.includes('INVOICES.CREATE') || permissions.includes('INVOICES.EDIT'),
```

- **Mezcla:** las dos cosas a la vez, con paréntesis:

```ts
canUpload:
  permissions.includes('INVOICES.VIEW') &&
  (permissions.includes('INVOICES.CREATE') || permissions.includes('INVOICES.EDIT')),
```

Cuando la regla se complica, el documento de la feature dice qué endpoint
pide cada parte.

### Por rol

Las reglas no preguntan por el rol, preguntan por el permiso. El nombre de un
rol es texto libre que define quien administra, y una persona puede tener
varios; un `roles.includes('Jefe de almacén')` se rompería al renombrar el
rol. La sesión puede guardar los nombres de los roles, pero la regla solo
recibe los permisos.

Para que algo lo vea solo un rol, se le da un permiso a ese rol y la regla
pregunta por el permiso:

1. Se marca el permiso en el rol, desde la administración de roles.
2. La regla de la feature pregunta por ese permiso, como en cualquier otro
   caso.

El código no cambia cuando el permiso se da o se quita de un rol.

### Un permiso nuevo

La app no puede inventar un permiso: tiene que existir en la API, que es
quien lo comprueba y quien lo ofrece en la administración de roles.

<!-- kit:if api -->
1. **Se pide a la API** en [Peticiones a la API](../api-requests.md): el
   permiso (`SECCIÓN.ACCIÓN`), el endpoint que lo exige y que la
   administración de roles lo ofrezca.
<!-- kit:else -->
1. **Se pide a quien lleva la API:** el permiso (`SECCIÓN.ACCIÓN`), el
   endpoint que lo exige y que la administración de roles lo ofrezca.
<!-- kit:end -->
2. **Se marca en los roles** que lo tienen que tener.
3. **Se escribe la regla** en `<feature>Permissions`, con su fila en el
   apartado «Permisos» del documento de la feature.

**Un permiso que solo decide la app** es válido cuando la API no tiene nada
que comprobar: imprimir lo hace el navegador, así que un `ORDERS.PRINT` solo
decide si se ofrece «Imprime». El documento de la feature lo dice («La API no
lo comprueba»). Para que se pueda dar o quitar, la administración de roles
tiene que ofrecerlo.

### Cuando la API pide otra cosa

La regla de la app pide lo mismo que la API, o más; nunca menos.

<!-- kit:if api -->
- **La API pide menos de lo razonable.** La app puede pedir más. Se escribe en
  el documento de la feature («la app pide más») y se anota la petición en
  [Peticiones a la API](../api-requests.md). Por ejemplo, si subir facturas
  solo pidiera `INVOICES.VIEW`, la app pediría además crear o editar.
- **La API pide más de lo razonable.** La app tiene que pedir lo mismo, o el
  botón se vería y la API lo rechazaría. Por ejemplo, si los documentos de un
  pedido pidieran `ORDERS.EDIT` también para leerlos, la gestión se abriría
  con `ORDERS.EDIT`. Se escribe en el documento y se pide el cambio en
  [Peticiones a la API](../api-requests.md).
<!-- kit:else -->
- **La API pide menos de lo razonable.** La app puede pedir más. Se escribe en
  el documento de la feature («la app pide más») y se pide el cambio a quien
  lleva la API. Por ejemplo, si subir facturas solo pidiera `INVOICES.VIEW`,
  la app pediría además crear o editar.
- **La API pide más de lo razonable.** La app tiene que pedir lo mismo, o el
  botón se vería y la API lo rechazaría. Por ejemplo, si los documentos de un
  pedido pidieran `ORDERS.EDIT` también para leerlos, la gestión se abriría
  con `ORDERS.EDIT`. Se escribe en el documento y se pide el cambio.
<!-- kit:end -->

## Errores comunes

| Síntoma | Causa |
|---|---|
| Pulsar un botón echa a la persona de la sesión | La regla pide menos que el endpoint y la API responde con el estado que cierra la sesión: se iguala al permiso del endpoint. |
| Un botón sale desactivado para quien no tiene el permiso | Lo que el permiso no deja hacer no se ofrece: se deja fuera con `canX ? … : null`, no con `disabled`. |
| La salida de una gestión lleva a una pantalla sin acceso | La salida no mira el permiso de la lista de destino: sin él, lleva al inicio. |
| «Gestiona» no sale para quien solo puede ver un pedido | `canManage` pide el permiso de editar: pide el que abre la gestión (`ORDERS.VIEW`), que se abre en lectura. |
| «No tienes acceso a esta página» con alguien que debería entrar | La sesión no trae el permiso que pide la regla. Si se cambió su rol, tiene que volver a entrar. |
| La entrada del menú se ve y la página dice que no hay acceso | La regla del menú y la de la ruta no piden lo mismo. |
| Se cambió un rol y nada cambia | La lista de permisos se carga al entrar: hay que volver a entrar. |
| Una pestaña no sale, pero con `?tab=` en la URL se pide su dato | La petición de esa pestaña no lleva la regla en `enabled`. |
| `useSessionPermissions` no existe | El proyecto aún no ha creado el dominio `session`: se crea con su login, con las piezas de [Lo que da la sesión](#lo-que-da-la-sesión). |
| Un botón se ve y no se puede quitar desde la administración de roles | El permiso no existe en la API o la administración de roles no lo ofrece. |
