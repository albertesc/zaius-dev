# Escribir tests

Esta guía escribe los tests de un cambio: decide qué hay que probar, dónde va
cada test y cómo se escribe según el tipo de fichero. Sirve a quien añade o
cambia un fichero con código. Lo que mira la comprobación de la estructura está
en [Normativa](../standards.md#comprobar-la-estructura), y cómo se comprueba un
cambio antes de darlo por hecho, en
[AGENTS.md](../../AGENTS.md#comprobar-un-cambio). Los ejemplos son de
`ordersEdit`, la gestión de un pedido, y de `orders`, el listado.

Los tests de una historia salen de su lista, en su especificación
(`docs/specs/`), y `zaius-build` los escribe de uno en uno, cada uno antes que
su código: primero el test, que falla (rojo); después, el mínimo código que lo
pasa (verde). Cada criterio de la historia tiene su test, o va a la
verificación a mano. Esta guía dice cómo se escribe cada uno.

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- [1. Lo que se prueba](#1-lo-que-se-prueba)
- [2. El sitio del test](#2-el-sitio-del-test)
- [3. La escritura de un test](#3-la-escritura-de-un-test)
- **4. El test de cada tipo de fichero:** [Una página](#una-página) · [Un componente](#un-componente) · [Un hook](#un-hook) · [Un service](#un-service) · [Un schema, un util o un store](#un-schema-un-util-o-un-store)
<!-- kit:if mocks -->
- [5. Los mocks que casan](#5-los-mocks-que-casan)
<!-- kit:end -->
- [Errores comunes](#errores-comunes)

## 1. Lo que se prueba

**Todo fichero con código tiene su test.** No se elige fichero a fichero: si
un tipo de fichero se prueba, se prueban todos los de ese tipo.

| Fichero | Su test comprueba |
|---|---|
<!-- kit:if mocks -->
| Página | Que pinta lo que tiene que pintar y que sus acciones funcionan, contra los mocks, con el foco, la validación y los textos que piden las normas ([Una página](#una-página)). |
<!-- kit:else -->
| Página | Que pinta lo que tiene que pintar y que sus acciones funcionan, con el service simulado, con el foco, la validación y los textos que piden las normas ([Una página](#una-página)). |
<!-- kit:end -->
| Componente | Que pinta lo que recibe y que llama a sus `onX` al interactuar. |
| Hook | Lo que devuelve y lo que hace al llamarlo. |
| Util | Sus casos normales y sus casos raros. |
| Schema | Que acepta lo bueno y rechaza lo malo, también si solo describe una respuesta. |
<!-- kit:if mocks -->
| Service | Que cada método responde con su mock y pasa su schema. |
<!-- kit:else -->
| Service | Que cada método pide su ruta y devuelve la respuesta validada por su schema. |
<!-- kit:end -->
| Store | Su estado inicial, sus acciones y que vuelve al inicial al cerrar la sesión. |
| Regla de permisos (`<feature>Permissions.ts`) | Cada regla, con el permiso y sin él. |

**Sin test** solo están los ficheros que declaran y no hacen nada, y el código
base que trae el kit. Es una lista cerrada, por tipo de fichero, y la misma
que aplica la
[comprobación de la estructura](../standards.md#comprobar-la-estructura):

- los tipos y las constantes: `types/`, `constants/` y los `*.d.ts`;
- la configuración (`*.config.ts`) y el arranque (`main.tsx`): lo que decide
  una regla dentro de una configuración (las reglas `allowed` del menú) lo
  recorre el test del componente que la usa, con varios juegos de permisos;
- las rutas (`*Routes.tsx`): las recorre el test de su página;
<!-- kit:if mocks -->
- los JSON de los mocks (`*Mocks.json`): los valida el test del schema de su
  método;
<!-- kit:end -->
- los ayudantes de `src/tests/`;
<!-- kit:if i18n -->
- el código base que trae el kit, el transporte (`utils/api*Utils.ts`) y lo
  de i18n (`i18n/i18n.ts`, `utils/languageUtils.ts`): lo prueba el propio
  kit, y si el proyecto lo cambia (la forma del error de su API), le escribe
  su test.
<!-- kit:else -->
- el código base que trae el kit, el transporte (`utils/api*Utils.ts`): lo
  prueba el propio kit, y si el proyecto lo cambia (la forma del error de su
  API), le escribe su test.
<!-- kit:end -->

<!-- kit:if i18n -->
Los estilos (`.module.css`) y los textos (`i18n/*.json`) no son código: los
textos los cubre la paridad de idiomas de la comprobación de la estructura.
<!-- kit:else -->
Los estilos (`.module.css`) no son código.
<!-- kit:end -->

Si un fichero de esta lista empieza a tener lógica, la lógica sale a un util
o a un hook, y esos sí se prueban.

## 2. El sitio del test

- **Cada test va al lado de su fichero,** con el mismo nombre:
  `ordersEditLineUtils.ts` y `ordersEditLineUtils.test.ts`;
  `OrdersEditPage.tsx` y `OrdersEditPage.test.tsx`. El de un `.ts` puede ser
  `.test.tsx` si pinta algo: un hook que necesita el router se prueba montando
  unas rutas con JSX.
- **`src/tests/` guarda solo lo que no es el test de un fichero:**
  - la configuración de Vitest, `src/tests/setup.ts`, que pone lo que jsdom
    no tiene y, antes de cada test, deja la app como al arrancar: vacía el
    `localStorage` y el `sessionStorage` y deja la ventana en su ancho
    inicial. Después de cada test, deshace los `vi.spyOn`
    (`vi.restoreAllMocks`).
    Cuando el proyecto crea su dominio `session`, `setup.ts` cierra también
    la sesión antes de cada test, que vacía con ella los stores que se
    suscriben;
  - los ayudantes, en un objeto, `testUtils` (`src/tests/testUtils.tsx`):
    `renderPage`, `renderWithProviders`, `createProvidersWrapper` (su
    `wrapper` para `renderHook`) y `setViewportWidth`, que cambia el ancho de
    la ventana y avisa a las media queries;
  - la comprobación de la estructura, `src/tests/structure.test.ts`
    ([Normativa](../standards.md#comprobar-la-estructura)).

Una feature con sus tests (`ordersEdit`). Lo que no tiene `.test` es lo de la
lista del [paso 1](#1-lo-que-se-prueba):

```text
ordersEdit/
├── pages/
│   ├── OrdersEditPage.tsx
│   └── OrdersEditPage.test.tsx
├── components/lines/
│   ├── OrdersEditLinesCard.tsx
│   └── OrdersEditLinesCard.test.tsx
├── hooks/
│   ├── useOrdersEdit.ts
│   └── useOrdersEdit.test.ts
├── utils/
│   ├── ordersEditLineUtils.ts
│   └── ordersEditLineUtils.test.ts
├── constants/ordersEditTabs.ts      (sin test: solo declara)
├── ordersEditPermissions.ts
├── ordersEditPermissions.test.ts
└── ordersEditRoutes.tsx             (sin test: lo recorre OrdersEditPage.test.tsx)
```

Y lo que la sirve en `services/`:

<!-- kit:if mocks -->
```text
services/orders/
├── ordersService.ts
├── ordersService.test.ts
├── ordersEditSchema.ts
├── ordersEditSchema.test.ts
└── ordersMocks.json                       (sin test: lo valida ordersEditSchema.test.ts)
```
<!-- kit:else -->
```text
services/orders/
├── ordersService.ts
├── ordersService.test.ts
├── ordersEditSchema.ts
└── ordersEditSchema.test.ts
```
<!-- kit:end -->

## 3. La escritura de un test

- **Se importa de `vitest` lo que se usa** (`describe`, `it`, `expect`,
  `vi`): no hay globales.
- **El nombre de cada `it`** dice, en castellano, qué pasa: «vuelve a pedir
  las líneas al pulsar reintentar».
- **Se busca como lo haría una persona:** por rol y nombre accesible
  (`getByRole('button', { name: 'Guarda' })`) o por etiqueta. Nunca por clase
  CSS.
<!-- kit:if i18n -->
- **Los textos son los reales,** en el idioma por defecto de la app
  (`APP_DEFAULT_LANGUAGE`): `setup.ts` carga el i18n de la app, que en los
  tests arranca en él. Un test que cambia de idioma lo devuelve al acabar.
<!-- kit:else -->
- **Los textos son los reales,** los que pinta la app.
<!-- kit:end -->
- **Las horas son las de %%TEST_TIMEZONE%%:** `vite.config.ts` fija `TZ` en
  los tests, para que una fecha con hora dé lo mismo en cualquier máquina.
- **Las interacciones van con `userEvent`.** Lo que llega después (lo que
  piden los hooks) se espera con `findBy`; `getBy` es para lo que ya está en
  pantalla.

Un `it` con todo eso:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { testUtils } from '@/tests/testUtils'
import { OrdersEditLinesCard } from './OrdersEditLinesCard'

describe('OrdersEditLinesCard', () => {
  it('vuelve a pedir las líneas al pulsar reintentar', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    testUtils.renderWithProviders(<OrdersEditLinesCard lines={undefined} isError onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Vuelve a intentarlo' }))

    expect(onRetry).toHaveBeenCalledOnce()
  })
})
```

## 4. El test de cada tipo de fichero

Una página se monta con `testUtils.renderPage` y un componente con
`testUtils.renderWithProviders`, los dos de `src/tests/`; un hook usa el
`wrapper` de `testUtils.createProvidersWrapper`. Lo que no pinta (un service, un
schema, un util o un store) se prueba llamándolo. Si el sistema de diseño
necesita sus proveedores, `/zaius-init` los pone en `testUtils`, como en
`main.tsx` ([Sistema de diseño](../ux-ui/design-system.md)).

### Una página

`testUtils.renderPage(routes, entry)` monta la página con:

- **las rutas de su feature, y solo esas,** en un router en memoria, para que el
  test siga siendo suyo. Lo que queda fuera de ellas no pinta nada: el test mira
  adónde ha llevado la página en el `router` que devuelve
  (`router.state.location.pathname`), junto a lo que devuelve `render` y su
  `queryClient`. Las rutas de una feature son relativas al segmento de su
  familia, así que se montan dentro de él:
  `testUtils.renderPage([{ path: 'orders', children: ordersEditRoutes }], '/orders/1287/edit')`.
- **un `QueryClient` nuevo,** con `queryClientConfig`, para que ningún test
  herede la caché de otro.
<!-- kit:if mocks -->
- **los mocks de la app, sin retardo,** como en todos los tests:
  `apiMockUtils` no espera en el modo `test`.
<!-- kit:end -->

La entrada puede llevar el estado de navegación con el que se llega:
`testUtils.renderPage(routes, { pathname: '/orders/1287/edit', state: { back } })`.
Una página que pide permisos necesita una sesión que los tenga: el test la abre
antes de montarla
([Los tests de la regla](./apply-permissions.md#9-los-tests-de-la-regla)).

Una página grande, que tarda en cargarse con la suite entera en marcha (un
análisis), se importa arriba del test (`import './OrdersDashboardPage'`):
así su `lazy` ya la encuentra cargada y la primera espera no se pasa de
tiempo.

<!-- kit:if mocks -->
```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useSessionStore } from '@/domains/session/stores/useSessionStore'
import { testUtils } from '@/tests/testUtils'
import { ordersEditRoutes } from '../ordersEditRoutes'

describe('OrdersEditPage', () => {
  it('activa «Guarda» al cambiar las notas', async () => {
    const user = userEvent.setup()
    useSessionStore.getState().setSession({ ...session, permissions: ['ORDERS.VIEW', 'ORDERS.EDIT'] })
    testUtils.renderPage([{ path: 'orders', children: ordersEditRoutes }], '/orders/1287/edit')

    const save = await screen.findByRole('button', { name: 'Guarda' })
    expect(save).toBeDisabled()

    await user.type(screen.getByRole('textbox', { name: 'Notas' }), ' Entregar por la mañana.')

    expect(save).toBeEnabled()
  })
})
```

- **Se prueba contra los mocks,** no contra un `vi.mock` del service: así el
  test recorre de verdad el service, el schema y el mock.
- **Lo que los mocks no dan** (un fallo de la API, un 404, un listado vacío)
  se da en el propio test, simulando solo ese método del service con
  `vi.spyOn`; los demás siguen respondiendo con los mocks. `setup.ts` lo
  deshace al terminar el test:

```ts
vi.spyOn(ordersService, 'getOrderDetail').mockRejectedValue(apiErrorUtils.buildError(404, 'ORDER_NOT_FOUND'))
```
<!-- kit:else -->
El test simula el service con `vi.mock`, escrito con `import()` para que
TypeScript compruebe la ruta. Sin fábrica, Vitest cambia cada método
por una función vacía, y cada test le da la respuesta del caso con
`vi.mocked`; los datos son constantes del propio test, con el tipo de la
respuesta:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionStore } from '@/domains/session/stores/useSessionStore'
import type { OrderDetail } from '@/services/orders/ordersEditSchema'
import { ordersService } from '@/services/orders/ordersService'
import { testUtils } from '@/tests/testUtils'
import { ordersEditRoutes } from '../ordersEditRoutes'

vi.mock(import('@/services/orders/ordersService'))

const ORDER: OrderDetail = { id: 1287, customerId: 7, carrierId: null, orderDate: '2026-03-10', deliveryDate: null, shippingCost: 12.5, notes: null, lines: [] }

beforeEach(() => {
  vi.mocked(ordersService.getOrderDetail).mockResolvedValue(ORDER)
  vi.mocked(ordersService.getOrderCarriersCatalog).mockResolvedValue([])
})

describe('OrdersEditPage', () => {
  it('activa «Guarda» al cambiar las notas', async () => {
    const user = userEvent.setup()
    useSessionStore.getState().setSession({ ...session, permissions: ['ORDERS.VIEW', 'ORDERS.EDIT'] })
    testUtils.renderPage([{ path: 'orders', children: ordersEditRoutes }], '/orders/1287/edit')

    const save = await screen.findByRole('button', { name: 'Guarda' })
    expect(save).toBeDisabled()

    await user.type(screen.getByRole('textbox', { name: 'Notas' }), ' Entregar por la mañana.')

    expect(save).toBeEnabled()
  })
})
```

- **Un error de la API** (un 404) se da en el propio test, con el mismo error
  que lanzaría el transporte:

```ts
vi.mocked(ordersService.getOrderDetail).mockRejectedValue(apiErrorUtils.buildError(404, 'ORDER_NOT_FOUND'))
```
<!-- kit:end -->

Además de lo que pinta y de sus acciones, el test de una página comprueba lo
que las normas piden a toda pantalla:

- **El foco** ([D12](../ux-ui/rules.md#d12-accesibilidad)): al abrir un
  modal va a su primer campo (si el cuerpo carga, se espera con `waitFor`),
  al guardar con errores va al primer campo que los tiene y al guardar bien se
  queda en «Guarda» (`expect(…).toHaveFocus()`). Lo que hace el navegador y
  jsdom no imita (la vuelta del foco al cerrar un `<dialog>`) se mira en la
  revisión visual.
- **Las tablas** ([D8](../ux-ui/rules.md#d8-listados-y-tablas)): una tabla es
  una tabla para el lector de pantalla, así que se busca como tal:
  `getByRole('table', { name: 'Listado de pedidos' })`, sus filas (`row`, la
  primera es la de las cabeceras), sus cabeceras (`columnheader`; la
  ordenada, con su `aria-sort`) y sus celdas (`cell`).
- **El teclado:** lo que se abre con el ratón (el ⋮ de una fila, un selector)
  se prueba también sin él, con `user.keyboard('{Enter}')` y las flechas.
- **La validación** ([D6](../ux-ui/rules.md#d6-formularios)): nada sale
  antes del primer intento; tras él, el error de un campo se va en cuanto se
  corrige, y la barra dice «Hay N campos por revisar».
- **Los plurales** ([D11](../ux-ui/rules.md#d11-textos-y-formato)): un texto
  con número se prueba con uno y con varios («1 pedido», «2 pedidos»), para
  que no falte ninguna de las dos formas.
- **Lo que no se ofrece** ([D5](../ux-ui/rules.md#d5-acciones)): sin permiso,
  o en un estado que no lo deja, la acción no está (`queryByRole` da `null`),
  ni siquiera desactivada.
- **Los enlaces** ([D10](../ux-ui/rules.md#d10-navegación)): lo que lleva a
  otra pantalla («Gestiona», «Ve al listado») es un enlace con su ruta
  (`getByRole('link', { name })` y su `href`).

### Un componente

Un componente se monta con `testUtils.renderWithProviders`, con las props de un
caso, y se comprueba lo que ve y lo que avisa una persona, como en el ejemplo de
[La escritura de un test](#3-la-escritura-de-un-test). Se prueban sus estados
(con datos, vacío, desactivado) si los tiene.

<!-- kit:if mocks -->
- **Un componente que pide datos** se prueba como una página: responden los
  mocks.
<!-- kit:else -->
- **Un componente que pide datos** se prueba como una página, con el service
  simulado.
<!-- kit:end -->
- **`testUtils.renderWithProviders` lleva un router en memoria,** así que un
  componente con enlaces se monta igual. Uno que depende de la ruta (una guarda,
  un layout con `Outlet`, el aviso de cambios sin guardar, que usa `useBlocker`)
  se monta con `testUtils.renderPage` y unas rutas de prueba.
<!-- kit:if i18n -->
- **Un test que cambia de idioma,** o que pinta algo que lo cambia, lo
  devuelve al idioma por defecto en su `afterEach`, con la instancia de
  `src/i18n/i18n.ts` (`i18n.changeLanguage(APP_DEFAULT_LANGUAGE)`).
<!-- kit:end -->
- **Cada subpieza de un componente** vive en su fichero y tiene su test, como
  cualquier componente; el del componente que la usa no la vuelve a probar
  entera.

### Un hook

Un hook se prueba con `renderHook` y el `wrapper` que da
`testUtils.createProvidersWrapper()`, con un `QueryClient` nuevo:

```ts
const { result } = renderHook(() => useOrderFilters(), { wrapper: testUtils.createProvidersWrapper().wrapper })
```

<!-- kit:if mocks -->
- **Si el hook pide datos,** responden los mocks, igual que en una página, y
  lo que los mocks no dan, con `vi.spyOn` sobre el método del service.
<!-- kit:else -->
- **Si el hook pide datos,** el service se simula con
  `vi.mock(import('@/services/orders/ordersService'))` y `vi.mocked`, igual
  que en una página.
<!-- kit:end -->

### Un service

<!-- kit:if mocks -->
Un `it` por método: lo llama contra los mocks y comprueba que responde con lo
que el mock da para su endpoint. Como el transporte valida con el schema, el
test recorre el método, el mock y el schema a la vez. El ejemplo está en
[Añadir un servicio](./add-a-service.md#el-test-del-service).

Sus fallos no se prueban aquí: los lanza el transporte, que tiene sus tests,
y los trata la página o el hook que los muestra, que los prueba con
`vi.spyOn`.
<!-- kit:else -->
Un `it` por método: pisa `fetch` con una respuesta de ejemplo
(`vi.stubGlobal`) y comprueba la ruta que pide y lo que devuelve, ya validado
por su schema. El ejemplo está en
[Añadir un servicio](./add-a-service.md#el-test-del-service).

Un caso de error (un 404) se da con una respuesta de `fetch` con ese estado,
y el test espera el fallo de la API, con su `status`.
<!-- kit:end -->

### Un schema, un util o un store

<!-- kit:if mocks -->
- **Un schema:** un `describe` por schema. Comprueba que acepta la respuesta
  real (la de su mock) y que rechaza una a la que le falta un campo; un
  schema de formulario, que acepta un formulario bueno y rechaza uno malo con
  el error en el campo que toca
  ([Crear un formulario](./create-a-form.md#1-el-schema)).
<!-- kit:else -->
- **Un schema:** un `describe` por schema. Comprueba que acepta una respuesta
  con la forma real, escrita en el test, y que rechaza una a la que le falta
  un campo; un schema de formulario, que acepta un formulario bueno y rechaza
  uno malo con el error en el campo que toca
  ([Crear un formulario](./create-a-form.md#1-el-schema)).
<!-- kit:end -->
- **Un util:** un `describe` por función pública de su objeto, con sus casos
  normales y sus casos raros (vacíos, `null`, límites). Las privadas se
  prueban a través de las públicas.
- **Un store:** su estado inicial y cada acción. Si se vacía al cerrar la
  sesión, el test cierra la sesión y comprueba que vuelve al estado inicial:

```ts
it('vuelve a la consulta inicial al cerrar la sesión', () => {
  useOrdersStore.getState().setListSearch('1287')

  useSessionStore.getState().clearSession()

  expect(useOrdersStore.getState().listQuery.search).toBe('')
})
```

- **Una regla de permisos:** un `it` por regla, con el permiso y sin él
  ([Aplicar permisos](./apply-permissions.md#9-los-tests-de-la-regla)).

<!-- kit:if mocks -->
## 5. Los mocks que casan

Este test no viene hecho: es un patrón para cuando los mocks de varios
services se cruzan (un pedido nombra a un cliente, un almacén o una persona
de otro service). Se escribe en `src/tests/mockData.test.ts` el día que hace
falta: lee los JSON de los mocks y falla si un id o un nombre que pasa de un
service a otro no existe en el otro
([El mock](./add-a-service.md#4-el-mock)). Cada mock nuevo que se cruce
con otro añade aquí su comprobación:

```ts
import { describe, expect, it } from 'vitest'
import customersMocks from '@/services/customers/customersMocks.json'
import ordersMocks from '@/services/orders/ordersMocks.json'

describe('los mocks casan entre services', () => {
  it('los clientes de los pedidos están en el catálogo de clientes', () => {
    const customerIds = new Set(customersMocks['GET /customer/select'].map(({ id }) => id))
    const orders = [ordersMocks['GET /order/detail/1287'], ordersMocks['GET /order/detail/:id']]

    expect(orders.map(({ customerId }) => customerId).filter((id) => !customerIds.has(id))).toEqual([])
  })
})
```

<!-- kit:end -->
## Errores comunes

| Síntoma | Causa |
|---|---|
| Vitest no arranca: «Vitest failed to find the runner» | En Windows, se lanzó desde Git Bash, que le pasa la ruta con la letra de la unidad en minúscula: se lanza desde PowerShell. |
<!-- kit:if mocks -->
| Un test pasa solo y falla con los demás | Comparte la caché de consultas: falta usar `testUtils.renderPage` o `testUtils.renderWithProviders`. |
| Un `vi.spyOn` del service no cambia lo que pinta la página | Se puso después de montarla, o la página pide otro método: va antes de `testUtils.renderPage`. |
<!-- kit:else -->
| Un test pasa solo y falla con los demás | Comparte la caché de consultas: falta usar `testUtils.renderPage` o `testUtils.renderWithProviders`. O un `vi.mocked` de un test sigue en el siguiente: cada test pone sus respuestas en `beforeEach`. |
<!-- kit:end -->
| Un `vi.mock` no hace nada | La ruta no existe. Con `vi.mock(import('…'))`, TypeScript lo detecta. |
| La página del test no pinta nada | Sus rutas son relativas al segmento de la familia: se montan dentro de `{ path: 'orders', children: … }`. |
| La página del test dice que no hay acceso | El test no ha abierto una sesión con los permisos que pide la regla. |
| `findByRole` no encuentra un botón que se ve | El nombre accesible no es el texto que se busca: mira su `aria-label`. |
| `getByRole('button', { name: 'Gestiona' })` no lo encuentra | Lleva a otra pantalla, así que es un enlace, y su nombre accesible nombra el registro: `getByRole('link', { name: 'Gestiona el pedido #1287' })`. |
| Un texto sale como «1 pedidos» | El texto no tiene sus dos formas, o no recibe el número. |
| Falla «un test por fichero» en la comprobación de la estructura | Un fichero con código no tiene su `.test` al lado: se escribe, con el mismo nombre. Lo demás que mira está en [Normativa](../standards.md#comprobar-la-estructura). |
| La revisión visual no arranca | El puerto %%REVIEW_PORT%% está ocupado: se para el servidor que lo ocupa; nunca se usa el %%HUMAN_PORT%%. |
