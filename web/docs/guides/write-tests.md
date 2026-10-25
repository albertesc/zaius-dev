# Escribir tests

Esta guía escribe los tests de un cambio: decide qué hay que probar, dónde va
cada test y cómo se escribe según el tipo de fichero. Sirve a quien añade o
cambia un fichero con código. Lo que mira la comprobación de la estructura está
en [Normativa](../standards.md#comprobar-la-estructura), y cómo se comprueba un
cambio antes de darlo por hecho, en
[AGENTS.md](../../AGENTS.md#comprobar-un-cambio).
<!-- kit:if server -->
Los ejemplos son de ROOMS, las habitaciones (`/rooms`), y de CONTACT, el
formulario para pedir disponibilidad (`/contact`).
<!-- kit:else -->
Los ejemplos son de ROOMS, las habitaciones (`/rooms`).
<!-- kit:end -->

Los tests de una página salen de su lista, en su documento
(`docs/pages/<NOMBRE>.md`, en «Tests»), y `zaius-build` los escribe de uno en
uno, cada uno antes que su código: primero el test, que falla (rojo); después,
el mínimo código que lo pasa (verde). Lo que pide la página tiene su test, o va
a la verificación a mano. Esta guía dice cómo se escribe cada uno; la plantilla
del documento está en [Páginas](../pages/README.md).

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- [1. Lo que se prueba](#1-lo-que-se-prueba)
- [2. El sitio del test](#2-el-sitio-del-test)
- [3. La escritura de un test](#3-la-escritura-de-un-test)
<!-- kit:if server -->
<!-- kit:if backend -->
- **4. El test de cada tipo de fichero:** [Una página](#una-página), [Un componente](#un-componente), [Una isla](#una-isla), [Una action](#una-action), [Un service](#un-service), [Un schema o un util](#un-schema-o-un-util)
<!-- kit:else -->
- **4. El test de cada tipo de fichero:** [Una página](#una-página), [Un componente](#un-componente), [Una isla](#una-isla), [Una action](#una-action), [Un schema o un util](#un-schema-o-un-util)
<!-- kit:end -->
<!-- kit:else -->
<!-- kit:if backend -->
- **4. El test de cada tipo de fichero:** [Una página](#una-página), [Un componente](#un-componente), [Una isla](#una-isla), [Un service](#un-service), [Un schema o un util](#un-schema-o-un-util)
<!-- kit:else -->
- **4. El test de cada tipo de fichero:** [Una página](#una-página), [Un componente](#un-componente), [Una isla](#una-isla), [Un schema o un util](#un-schema-o-un-util)
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if backend -->
- [5. Los mocks que casan](#5-los-mocks-que-casan)
<!-- kit:end -->
- [Errores comunes](#errores-comunes)

## 1. Lo que se prueba

**Todo fichero con código tiene su test.** No se elige fichero a fichero: si
un tipo de fichero se prueba, se prueban todos los de ese tipo.

| Fichero | Su test comprueba |
|---|---|
<!-- kit:if backend -->
| Página (`src/pages/`) | Lo que pinta con los datos de los mocks y cada uno de sus estados, su título y su descripción para los buscadores, y lo que piden las normas ([Una página](#una-página)). |
<!-- kit:else -->
| Página (`src/pages/`) | Lo que pinta con sus datos, su título y su descripción para los buscadores, y lo que piden las normas ([Una página](#una-página)). |
<!-- kit:end -->
<!-- kit:if server -->
| Endpoint (`src/pages/api/`) | Su respuesta: el estado, el tipo y el cuerpo. |
<!-- kit:end -->
| Componente (`.astro`) | Lo que pinta con sus props y sus slots, en cada estado. |
| Isla, si la web tiene alguna | Lo que pinta con sus props y lo que hace al usarla ([Una isla](#una-isla)). |
<!-- kit:if server -->
<!-- kit:if privateArea -->
| Action (`src/actions/`) | Que envía o guarda con un input bueno, el error de cada campo con uno malo, y que no guarda sin sesión ni sin permiso. |
| Middleware | Que responde con un 303 a un formulario que sale bien, que deja pasar con sesión y que lleva al login sin ella. |
<!-- kit:else -->
| Action (`src/actions/`) | Que envía con un input bueno y el error de cada campo con uno malo. |
| Middleware | Que responde con un 303 a un formulario que sale bien. |
<!-- kit:end -->
<!-- kit:end -->
| Util | Sus casos normales y sus casos raros. |
<!-- kit:if privateArea -->
| Regla de permisos (`bookingPermissionUtils`) | Cada regla, con el permiso y sin él. |
<!-- kit:end -->
<!-- kit:if server -->
| Schema | Que acepta lo bueno y rechaza lo malo, también si solo describe una respuesta. |
<!-- kit:else -->
<!-- kit:if backend -->
| Schema | Que acepta lo bueno y rechaza lo malo, también si solo describe una respuesta. |
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if backend -->
| Service | Que cada método responde con su mock y pasa su schema. |
<!-- kit:end -->

**El nivel de cada test.** En la lista del documento, cada test lleva su
nivel: el tipo de fichero que lo prueba, de los de la tabla (página,
componente, util…), o «verificación manual». Se elige el más alto que lo
comprueba: lo que se ve en la página, antes que el componente o el util que lo
calcula. Y lo que espera sale del documento (el texto, el precio, el orden),
nunca calculado con la misma lógica que el código.

**La verificación manual** es lo que un test no ve, y lo mira `zaius-review`
([La revisión visual](../standards.md#la-revisión-visual)): cómo se ve en los
anchos del sistema de diseño (360, 768 y 1280 px), sin scroll horizontal; con
el teclado, con un lector de pantalla, con el zoom al 200 % y con «reducir
movimiento»; y cómo sale el enlace al compartirlo, con su imagen.
<!-- kit:if server -->
También lo que pasa fuera de la web: el correo que llega con un mensaje del
formulario.
<!-- kit:end -->

**Sin test** solo están los ficheros que declaran y no hacen nada, y el código
base que trae el kit. Es una lista cerrada, por tipo de fichero, y la misma
que aplica la
[comprobación de la estructura](../standards.md#comprobar-la-estructura):

<!-- kit:if privateArea -->
- los tipos y las constantes: `types/`, `constants/` y los `*.d.ts`
  (`env.d.ts`);
<!-- kit:else -->
- los tipos y las constantes: `types/`, `constants/` y los `*.d.ts`;
<!-- kit:end -->
<!-- kit:if content -->
- la configuración (`*.config.ts`): `astro.config.ts`, `vitest.config.ts` y
  `content.config.ts`;
<!-- kit:else -->
- la configuración (`*.config.ts`): `astro.config.ts` y `vitest.config.ts`;
<!-- kit:end -->
<!-- kit:if server -->
- `src/actions/index.ts`, que solo junta las actions de cada sección: cada
  una se prueba en el test de su fichero;
<!-- kit:end -->
<!-- kit:if backend -->
- los JSON de los mocks (`*Mocks.json`): los valida el test del schema de su
  método;
<!-- kit:end -->
<!-- kit:if backend -->
- los ayudantes de `src/tests/`;
<!-- kit:else -->
- los ayudantes de `src/tests/`;
<!-- kit:end -->
<!-- kit:if backend -->
- el código base que trae el kit, el transporte (`utils/api*Utils.ts`) y lo
  de i18n (`i18n/i18n.ts`, `utils/languageUtils.ts`): lo prueba el propio
  kit, y si el proyecto lo cambia (la forma del error de su API), le escribe
  su test.
<!-- kit:else -->
- el código base que trae el kit, lo de i18n (`i18n/i18n.ts`,
  `utils/languageUtils.ts`): lo prueba el propio kit, y si el proyecto lo
  cambia, le escribe su test.
<!-- kit:end -->

Los estilos y los textos (`i18n/*.json`) no son código: los textos los cubre
la paridad de idiomas de la comprobación de la estructura.
<!-- kit:if content -->
Las entradas de contenido (`src/content/`) tampoco: las valida el schema de su
colección al compilar
([Añadir contenido](./add-content.md#1-la-colección-y-su-schema)).
<!-- kit:end -->

Si un fichero de esta lista empieza a tener lógica, la lógica sale a un util,
y ese sí se prueba.

## 2. El sitio del test

- **Cada test va al lado de su fichero,** con el mismo nombre y `.test.ts`:
  `roomPriceUtils.ts` y `roomPriceUtils.test.ts`; `RoomCard.astro` y
  `RoomCard.test.ts`. El de una isla, que pinta JSX, es `.test.tsx`:
  `RoomsSearch.tsx` y `RoomsSearch.test.tsx`.
<!-- kit:if privateArea -->
- **El de una página o un endpoint va en `src/tests/pages/`,** con su misma
  ruta: el de `src/pages/rooms.astro` es `src/tests/pages/rooms.test.ts`;
  el de `src/pages/account/bookings/[id]/edit.astro` es
  `src/tests/pages/account/bookings/[id]/edit.test.ts`;
  el de `src/pages/api/account/bookings/[id]/invoice.pdf.ts` es
  `src/tests/pages/api/account/bookings/[id]/invoice.pdf.test.ts`. Astro
  convierte en una ruta cualquier `.ts` de `src/pages/`: un test al lado de
  la página sería una URL más, y el build fallaría al pintarla.
<!-- kit:else -->
<!-- kit:if server -->
- **El de una página o un endpoint va en `src/tests/pages/`,** con su misma
  ruta: el de `src/pages/rooms.astro` es `src/tests/pages/rooms.test.ts`; el de
  `src/pages/legal/notice.astro` es `src/tests/pages/legal/notice.test.ts`.
  Astro convierte en una ruta cualquier `.ts` de `src/pages/`: un test al lado
  de la página sería una URL más, y el build fallaría al pintarla.
<!-- kit:else -->
- **El de una página va en `src/tests/pages/`,** con su misma ruta: el de
  `src/pages/rooms.astro` es `src/tests/pages/rooms.test.ts`; el de
  `src/pages/legal/notice.astro` es `src/tests/pages/legal/notice.test.ts`.
  Astro convierte en una ruta cualquier `.ts` de `src/pages/`: un test al lado
  de la página sería una URL más, y el build fallaría al pintarla.
<!-- kit:end -->
<!-- kit:end -->
- **`src/tests/` guarda solo lo que no es el test de un fichero:**
  - la configuración de Vitest, `setup.ts`, que
    carga los comparadores de jest-dom (`toBeInTheDocument`…) y, después de
    cada test, deshace los `vi.spyOn` (`vi.restoreAllMocks`). Con la primera
    isla, también desmonta lo que se pintó (`cleanup`);
<!-- kit:if server -->
  - los ayudantes, en un objeto, `testUtils` (`testUtils.ts`):
    `renderAstro`, que pinta una página o un componente en el servidor, y
    `callAction`, que llama a una action como lo hace Astro;
<!-- kit:else -->
  - los ayudantes, en un objeto, `testUtils` (`testUtils.ts`):
    `renderAstro`, que pinta una página o un componente en el servidor;
<!-- kit:end -->
  - la comprobación de la estructura,
    `structure.test.ts`
    ([Normativa](../standards.md#comprobar-la-estructura));
  - `pages/`, los tests de lo que hay en `src/pages/`.

ROOMS con sus tests. Lo que no tiene `.test` es lo de la lista del
[paso 1](#1-lo-que-se-prueba):

```text
src/
<!-- kit:if server -->
    pages/
        contact.astro
        rooms.astro
<!-- kit:else -->
    pages/rooms.astro
<!-- kit:end -->
    components/
        RoomCard.astro
        RoomCard.test.ts
        RoomsList.astro
        RoomsList.test.ts
    utils/
        roomPriceUtils.ts
        roomPriceUtils.test.ts
<!-- kit:if server -->
    actions/
        index.ts                       (sin test: solo junta las de cada sección)
        contactActions.ts
        contactActions.test.ts
        contactFormSchema.ts
        contactFormSchema.test.ts
<!-- kit:end -->
    constants/rooms.ts                 (sin test: solo declara)
    types/room.ts                      (sin test: solo declara)
    tests/pages/
<!-- kit:if server -->
        contact.test.ts
<!-- kit:end -->
        rooms.test.ts
```

<!-- kit:if backend -->
Y lo que le da la disponibilidad, en `services/`:

```text
services/bookings/
    bookingsService.ts
    bookingsService.test.ts
    bookingsAvailabilitySchema.ts
    bookingsAvailabilitySchema.test.ts
    bookingsMocks.json                 (sin test: lo valida bookingsAvailabilitySchema.test.ts)
```

<!-- kit:end -->
## 3. La escritura de un test

- **Se importa de `vitest` lo que se usa** (`describe`, `it`, `expect`,
  `vi`): no hay globales.
- **El nombre de cada `it`** dice, en castellano, qué pasa: «enseña cada
  habitación con su precio por noche».
- **Se busca como lo haría una persona:** por rol y nombre accesible
  (`getByRole('link', { name: testUtils.translate('rooms.cta') })`) o por
  etiqueta. Nunca por clase CSS.
- **Corre en el entorno `node`,** como el servidor de Astro, que es donde se
  pintan las páginas y los componentes.
- **Lo pintado ya está:** `testUtils.renderAstro` devuelve el HTML terminado,
  así que se busca con `getBy`, sin esperar.
- **Los textos salen del catálogo, nunca escritos en el test:**
  `testUtils.translate('rooms.card.capacity', { count: 2 })` da el texto en
  el idioma por defecto (`APP_DEFAULT_LANGUAGE`), el que pinta
  `testUtils.renderAstro`, con sus valores y su plural, y falla si la clave
  o esa forma no están. Nunca se lee el JSON a mano ni se arma un texto con
  `replace`. Un componente que recibe sus textos por props
  ([D1](../ux-ui/rules.md#d1-el-sistema-de-diseño-primero)) los recibe así
  también en su test. Lo que no es un texto de la web, sino un dato del caso
  (el nombre de una habitación, un precio, un teléfono), va escrito en el
  test.
- **Las horas son las de %%TEST_TIMEZONE%%:** `vitest.config.ts` fija `TZ` en
  los tests, para que una fecha con hora dé lo mismo en cualquier máquina.

Un `it` con todo eso:

```ts
import { describe, expect, it } from 'vitest'
import { testUtils } from '@/tests/testUtils'
import type { Room } from '@/types/room'
import RoomCard from './RoomCard.astro'

const ROOM: Room = { slug: 'encina', name: 'La Encina', capacity: 2, pricePerNight: 85, photos: [] }

describe('RoomCard', () => {
  it('pinta el nombre, las personas y el precio por noche', async () => {
    const view = await testUtils.renderAstro(RoomCard, { props: { room: ROOM } })

    expect(view.getByRole('heading', { name: 'La Encina' })).toBeInTheDocument()
    expect(view.getByText(testUtils.translate('rooms.card.capacity', { count: 2 }))).toBeInTheDocument()
    expect(view.getByText(testUtils.translate('rooms.card.pricePerNight', { price: '85 €' }))).toBeInTheDocument()
  })
})
```

La habitación va escrita en el test, con los datos del caso: si cambia
`ROOMS`, el test de la tarjeta no cambia.

### Un test no se manipula

Un test dice lo que la página tiene que hacer: si falla, se arregla el
código, nunca el test. Para que pase, nunca:

- **se cambia lo que espera por lo que sale:** lo esperado viene del
  documento de la página o del catálogo de textos, no de lo que pinta el
  código ni de la misma lógica que lo calcula;
- **se afloja:** una comprobación que acepta más (`toBeTruthy`, un trozo del
  texto, una expresión regular más ancha), un `queryBy` que no se comprueba
  o una comprobación de menos;
- **se salta o se borra:** `it.skip`, `it.todo`, `it.only`, comentado, o
  quitado de la lista del documento;
- **se simula lo que prueba:** solo se simula lo de fuera (la API, la hora),
  nunca la pieza que se prueba ni la lógica que tiene que funcionar;
- **se esconde el fallo:** un `try`/`catch`, un `if` dentro del test o una
  espera más larga para algo que no llega;
- **se amaña un texto:** escrito a mano, leído del JSON o arreglado con
  `replace`, en lugar de pedírselo a `testUtils.translate`;
- **se calla a las comprobaciones:** `// @ts-expect-error`,
  `eslint-disable` o un cambio en la configuración de Vitest, de los tipos o
  del lint.

Si es el test el que está mal (el documento ha cambiado, o pedía otra cosa),
se para y se pregunta: con el OK, primero cambia el documento y después el
test, en un paso aparte. `zaius-review` lo busca en cada página.

## 4. El test de cada tipo de fichero

Una página y un componente `.astro` se pintan en el servidor con
`testUtils.renderAstro`, de `src/tests/`.
<!-- kit:if server -->
Una action se llama con `testUtils.callAction`.
<!-- kit:end -->
<!-- kit:if backend -->
Lo que no pinta (un service, un schema o un util) se prueba llamándolo.
<!-- kit:else -->
Lo que no pinta (un util) se prueba llamándolo.
<!-- kit:end -->

### Una página

`testUtils.renderAstro(página, opciones)` la pinta en el servidor, con la
Container API de Astro, y devuelve las consultas de Testing Library sobre su
`body`. La página se importa con su prefijo y `Page`
([Páginas y rutas](../naming.md#páginas-y-rutas)), y las opciones le dan lo
que en la web llega con la petición:

- `params`, los segmentos de una ruta con parámetro: `{ params: { slug: 'encina' } }`
  para una página `[slug].astro`;
<!-- kit:if server -->
- `request`, la URL con su query, que la página lee en `Astro.url`:
  `{ request: new Request('http://localhost/contact?room=encina') }`;
<!-- kit:end -->
<!-- kit:if privateArea -->
- `locals`, lo que deja el middleware: la sesión, con los permisos del caso
  ([Lo que da la sesión](./apply-permissions.md#lo-que-da-la-sesión));
<!-- kit:end -->
- `props`, lo que le da `getStaticPaths` a una página que se genera al
  compilar.

<!-- kit:if backend -->
```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { JSDOM } from 'jsdom'
import { describe, expect, it, vi } from 'vitest'
import RoomsPage from '@/pages/rooms.astro'
import { bookingsService } from '@/services/bookings/bookingsService'
import { testUtils } from '@/tests/testUtils'

/**
 * Pinta la página entera y da la cabecera del documento, que `renderAstro` no da.
 * @returns El `head` de la página pintada.
 */
async function renderHead (): Promise<HTMLHeadElement> {
  const container = await AstroContainer.create()
  return new JSDOM(await container.renderToString(RoomsPage)).window.document.head
}

describe('/rooms', () => {
  it('enseña cada habitación con su precio por noche', async () => {
    const view = await testUtils.renderAstro(RoomsPage)

    expect(view.getByRole('heading', { name: 'La Encina' })).toBeInTheDocument()
    expect(view.getByText(testUtils.translate('rooms.card.pricePerNight', { price: '85 €' }))).toBeInTheDocument()
  })

  it('dice «Completa» en la habitación que no tiene fechas libres', async () => {
    vi.spyOn(bookingsService, 'getBookingsAvailability').mockResolvedValue({ from: '2026-11-01', to: '2026-11-30', rooms: [{ roomSlug: 'encina', freeDates: [] }] })

    const view = await testUtils.renderAstro(RoomsPage)

    expect(view.getByText(testUtils.translate('rooms.card.full'))).toBeInTheDocument()
  })

  it('da a los buscadores su título y su descripción', async () => {
    const head = await renderHead()

    expect(head.querySelector('title')?.textContent).toBe(`${testUtils.translate('rooms.title')} - %%APP_NAME%%`)
    expect(head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(testUtils.translate('rooms.description'))
  })
})
```

- **Se prueba contra los mocks:** `.env.test` lleva `USE_MOCKS=true`, así que
  la página pide sus datos al service y responde su `*Mocks.json`. El test
  recorre de verdad el service, el schema y el mock.
- **Lo que los mocks no dan** (un fallo de la API, un 404, una habitación
  completa) se da en el propio test, simulando solo ese método del service
  con `vi.spyOn`, antes de pintar la página; los demás siguen respondiendo
  con los mocks. `setup.ts` lo deshace al terminar el test.
<!-- kit:else -->
```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'
import RoomsPage from '@/pages/rooms.astro'
import { testUtils } from '@/tests/testUtils'

/**
 * Pinta la página entera y da la cabecera del documento, que `renderAstro` no da.
 * @returns El `head` de la página pintada.
 */
async function renderHead (): Promise<HTMLHeadElement> {
  const container = await AstroContainer.create()
  return new JSDOM(await container.renderToString(RoomsPage)).window.document.head
}

describe('/rooms', () => {
  it('enseña cada habitación con su precio por noche', async () => {
    const view = await testUtils.renderAstro(RoomsPage)

    expect(view.getByRole('heading', { name: 'La Encina' })).toBeInTheDocument()
    expect(view.getByText(testUtils.translate('rooms.card.pricePerNight', { price: '85 €' }))).toBeInTheDocument()
  })

  it('da a los buscadores su título y su descripción', async () => {
    const head = await renderHead()

    expect(head.querySelector('title')?.textContent).toBe(`${testUtils.translate('rooms.title')} - %%APP_NAME%%`)
    expect(head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(testUtils.translate('rooms.description'))
  })
})
```

- **La página se pinta con sus datos,** los de `constants/`: no hay nada que
  simular. Un caso que necesita otros (una lista vacía) se prueba en el
  componente que la pinta, con sus props.
<!-- kit:end -->
- **La cabecera del documento** (el título, la descripción, la imagen para
  compartir y `noindex`) no la da `renderAstro`, que da el `body`: se lee
  pintando la página con la Container API, como en
  `src/layouts/BaseLayout.test.ts`. Cuando la prueban varias páginas, el
  ayudante pasa a `testUtils`.
<!-- kit:if privateArea -->

Una página de la zona privada recibe la sesión en `locals`, como se la deja
el middleware:

```ts
import { describe, expect, it, vi } from 'vitest'
import AccountBookingsEditPage from '@/pages/account/bookings/[id]/edit.astro'
import { bookingsService } from '@/services/bookings/bookingsService'
import { testUtils } from '@/tests/testUtils'
import { apiErrorUtils } from '@/utils/apiErrorUtils'

const GUEST = { session: { token: 'test', permissions: ['BOOKINGS.VIEW', 'BOOKINGS.EDIT'] } }

describe('/account/bookings/[id]/edit', () => {
  it('enseña la reserva, con su hora de llegada', async () => {
    const view = await testUtils.renderAstro(AccountBookingsEditPage, { params: { id: '1287' }, locals: GUEST })

    expect(view.getByRole('heading', { level: 1, name: testUtils.translate('accountBookingsEdit.title', { id: '1287' }) })).toBeInTheDocument()
  })

  it('dice que la reserva no existe si la API da un 404', async () => {
    vi.spyOn(bookingsService, 'getBookingDetail').mockRejectedValue(apiErrorUtils.buildError(404, 'BOOKING_NOT_FOUND'))

    const view = await testUtils.renderAstro(AccountBookingsEditPage, { params: { id: '1287' }, locals: GUEST })

    expect(view.getByText(testUtils.translate('accountBookingsEdit.notFound'))).toBeInTheDocument()
  })

  it('no enseña la reserva sin el permiso de verla', async () => {
    const view = await testUtils.renderAstro(AccountBookingsEditPage, { params: { id: '1287' }, locals: { session: { token: 'test', permissions: [] } } })

    expect(view.queryByRole('heading', { level: 1, name: testUtils.translate('accountBookingsEdit.title', { id: '1287' }) })).toBeNull()
  })
})
```

**Un endpoint** se prueba llamando a su `GET` (o su `POST`) con lo que lee de
la petición, en un contexto de prueba, y mirando la respuesta:

```ts
import type { APIContext } from 'astro'
import { describe, expect, it } from 'vitest'
import { GET } from '@/pages/api/account/bookings/[id]/invoice.pdf'

describe('/api/account/bookings/[id]/invoice.pdf', () => {
  it('responde la factura de la reserva en PDF', async () => {
    const context: Partial<APIContext> = { params: { id: '1287' }, locals: { session: { token: 'test', permissions: ['BOOKINGS.VIEW'] } } }

    const response = await GET(context as APIContext)

    expect(response.headers.get('Content-Type')).toBe('application/pdf')
  })
})
```
<!-- kit:end -->

Además de lo que pinta, el test de una página comprueba lo que las normas
piden a toda página:

- **Un solo `h1`** y los títulos sin saltos
  ([D14](../ux-ui/rules.md#d14-buscadores-y-compartir)):
  `getAllByRole('heading', { level: 1 })` da uno.
- **Las imágenes** ([D12](../ux-ui/rules.md#d12-accesibilidad)): cada una
  que dice algo, con su texto alternativo
  (`getByRole('img', { name: 'La Encina, con la ventana al robledal' })`);
  la que solo adorna, con `alt=''`, no sale como imagen.
- **Los plurales** ([D11](../ux-ui/rules.md#d11-textos-y-formato)): un texto
  con número se prueba con uno y con varios
  (`testUtils.translate('rooms.card.capacity', { count: 1 })` y
  `{ count: 2 }`): si falta una de las dos formas, `translate` falla.
- **Los enlaces** ([D10](../ux-ui/rules.md#d10-navegación)): lo que lleva a
  otra página («Pide disponibilidad», «Ve a las habitaciones») es un enlace
  con su ruta (`getByRole('link', { name })` y su `href`).
<!-- kit:if privateArea -->
- **Lo que no se ofrece** ([D5](../ux-ui/rules.md#d5-acciones)): sin permiso,
  o en un estado que no lo deja (una reserva ya cancelada), la acción no está
  (`queryByRole` da `null`), ni siquiera desactivada.
- **Las tablas** ([D8](../ux-ui/rules.md#d8-listados-y-tablas)): una tabla es
  una tabla para el lector de pantalla, así que se busca como tal:
  `getByRole('table', { name: 'Mis reservas' })`, sus filas (`row`, la
  primera es la de las cabeceras), sus cabeceras (`columnheader`) y sus
  celdas (`cell`).
- **Lo que no es público** lleva `noindex`, en su cabecera: las páginas de
  `/account/` y las de error.
<!-- kit:else -->
- **Lo que no se ofrece** ([D5](../ux-ui/rules.md#d5-acciones)): en un estado
  que no lo deja, la acción no está (`queryByRole` da `null`), ni siquiera
  desactivada.
- **Lo que no es público** lleva `noindex`, en su cabecera: las páginas de
  error.
<!-- kit:end -->
<!-- kit:if server -->
- **La validación** ([D6](../ux-ui/rules.md#d6-formularios)): los errores de
  cada campo los da la action, y se prueban en su test
  ([Una action](#una-action)).
<!-- kit:end -->

### Un componente

Un componente `.astro` se pinta con `testUtils.renderAstro`, con las props de
un caso (`props`) y lo que lleva dentro (`slots`, en HTML:
`{ slots: { default: '<p>Desayuno incluido</p>' } }`), y se comprueba lo que
ve una persona, como en el ejemplo de
[La escritura de un test](#3-la-escritura-de-un-test). Se prueban sus estados
(con datos, vacío, con error) si los tiene: `RoomsList` sin ninguna
habitación dice «Todavía no hay ninguna habitación».

- **Su `<script>` no corre en el test:** el HTML se abre en jsdom sin ejecutar
  sus scripts. Si lo que hace tiene lógica, sale a un util con su test; lo
  demás (abrir la galería de fotos) se mira en la revisión visual.
- **Cada subpieza de un componente** vive en su fichero y tiene su test, como
  cualquier componente; el del componente que la usa no la vuelve a probar
  entera.

### Una isla

Una web no tiene islas hasta que hace falta la primera
([Añadir una isla](./add-an-island.md)), que trae con ella lo que necesitan
sus tests: Testing Library para React y `user-event`. El test de una isla va
al lado de la isla y corre en un navegador simulado. El ejemplo entero, con
`RoomsSearch`, está en esa guía.

- **Su primera línea es `// @vitest-environment jsdom`:** sin ella corre en
  `node`, como los demás tests, y no se puede pintar.
- **Se pinta con `render`, de `@testing-library/react`,** con las props de un
  caso escritas en el test, como se las pasaría la página, y se usa con
  `userEvent` (`@testing-library/user-event`), como una persona.
- **Lo que llega después** de una acción se espera con `findBy`; `getBy` es
  para lo que ya está en pantalla.
- **El foco** ([D12](../ux-ui/rules.md#d12-accesibilidad)): adónde va al
  abrir y al terminar, con `expect(…).toHaveFocus()`.
- **El teclado:** lo que se abre con el ratón (un selector de fechas) se
  prueba también sin él, con `user.keyboard('{Enter}')` y las flechas.
- **Un hook** de `src/hooks/`, que nace con la isla que lo necesita, se
  prueba con `renderHook`, de `@testing-library/react`, también en jsdom.
<!-- kit:if privateArea -->
- **Si guarda con una action,** el test cambia `astro:actions` por uno de
  prueba y da a la action la respuesta del caso (la action ya tiene su propio
  test: [Una action](#una-action)). `vi.restoreAllMocks` no deshace lo que se
  da a un `vi.fn`, así que cada test da su respuesta:

```ts
import { ActionError, actions } from 'astro:actions'

vi.mock('astro:actions', async (importOriginal) => ({ ...await importOriginal<object>(), actions: { account: { updateBookingGuests: vi.fn() } } }))

vi.mocked(actions.account.updateBookingGuests).mockResolvedValue({ data: undefined, error: new ActionError({ code: 'INTERNAL_SERVER_ERROR' }) })
```
<!-- kit:end -->
<!-- kit:if server -->

### Una action

`testUtils.callAction(action, input, locals)` llama a una action como lo hace
Astro en una petición, con los `locals` que deja el middleware, y devuelve su
resultado: `{ data }` si sale bien y `{ error }` si no. El input es el de
verdad: el `FormData` del envío si la action recibe un formulario
(`accept: 'form'`), o el objeto que manda una isla.

```ts
import { isInputError } from 'astro:actions'
import { describe, expect, it, vi } from 'vitest'
import { testUtils } from '@/tests/testUtils'
import { contactActions } from './contactActions'

/**
 * Arma lo que envía el formulario de contacto.
 * @param fields Los campos que cambian respecto a un envío bueno.
 * @returns El `FormData` del envío.
 */
function buildSent (fields: Record<string, string> = {}): FormData {
  const sent = new FormData()
  const values = { name: 'Lucía Martín', email: 'lucia@example.com', arrival: '2026-12-05', departure: '2026-12-08', guests: '2', message: '¿Tenéis La Encina libre el puente de diciembre?', privacy: 'on', website: '', ...fields }
  for (const [name, value] of Object.entries(values)) sent.set(name, value)
  return sent
}

describe('contactActions', () => {
  it('sendContactMessage manda el mensaje al servicio de correo, con el correo de quien escribe', async () => {
    const send = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }))

    const result = await testUtils.callAction(contactActions.sendContactMessage, buildSent())

    expect(result.error).toBeUndefined()
    expect(String(send.mock.calls[0]?.[1]?.body)).toContain('lucia@example.com')
  })

  it('sendContactMessage no manda nada si llega el campo trampa', async () => {
    const send = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }))

    const result = await testUtils.callAction(contactActions.sendContactMessage, buildSent({ website: 'https://spam.example' }))

    expect(result.error).toBeUndefined()
    expect(send).not.toHaveBeenCalled()
  })

  it('sendContactMessage pone el error en el correo mal escrito, y no manda nada', async () => {
    const send = vi.spyOn(globalThis, 'fetch')

    const result = await testUtils.callAction(contactActions.sendContactMessage, buildSent({ email: 'lucia' }))

    expect(isInputError(result.error) ? Object.keys(result.error.fields) : []).toEqual(['email'])
    expect(send).not.toHaveBeenCalled()
  })
})
```

- **Un `it` por camino:** manda el mensaje con un input bueno; no manda nada
  y responde como si fuera bien con el campo trampa (`website`) relleno; y da
  el error del campo con uno malo (`isInputError(result.error)` y
  `result.error.fields`), sin mandar nada.
- **El test no manda correos:** la action habla con el servicio de correo con
  `fetch`, y el test lo simula con `vi.spyOn(globalThis, 'fetch')`, con la
  respuesta del caso. Su fallo, con una respuesta de error
  (`new Response(null, { status: 500 })`), y el test mira lo que devuelve la
  action ([Crear un formulario](./create-a-form.md)). `setup.ts` lo deshace
  al terminar cada test.
<!-- kit:if privateArea -->
- **En la zona privada,** la action comprueba antes la sesión y el permiso:
  `UNAUTHORIZED` sin sesión (`{ session: null }`) y `FORBIDDEN` sin el
  permiso, sin llamar al service:

```ts
const result = await testUtils.callAction(accountActions.cancelBooking, sent, { session: { token: 'test', permissions: ['BOOKINGS.VIEW'] } })

expect(result.error?.code).toBe('FORBIDDEN')
expect(cancel).not.toHaveBeenCalled()
```
<!-- kit:end -->
- **El middleware** (`src/middleware.ts`) tiene su test al lado,
  `middleware.test.ts`: llama a `onRequest` con un contexto de prueba, como un
  endpoint (`Partial<APIContext>` con la URL, las cookies, los `locals` y
  `redirect`), y un `next` falso (`vi.fn`), y comprueba lo que responde.
<!-- kit:end -->
<!-- kit:if backend -->

### Un service

Un `it` por método: lo llama contra los mocks y comprueba que responde con lo
que el mock da para su endpoint. Como el transporte valida con el schema, el
test recorre el método, el mock y el schema a la vez. El ejemplo está en
[Añadir un servicio](./add-a-service.md).

Sus fallos no se prueban aquí: los lanza el transporte, que tiene sus tests,
y los trata la página que los pinta, que los prueba con `vi.spyOn`.
<!-- kit:end -->

### Un schema o un util

<!-- kit:if backend -->
- **Un schema de una respuesta:** un `describe` por schema. Comprueba que
  acepta la respuesta real (la de su mock) y que rechaza una a la que le falta
  un campo.
<!-- kit:end -->
<!-- kit:if server -->
- **Un schema de un formulario:** que acepta un envío bueno y rechaza uno malo
  con el error en el campo que toca
  ([Crear un formulario](./create-a-form.md)).
<!-- kit:end -->
- **Un util:** un `describe` por función pública de su objeto, con sus casos
  normales y sus casos raros (vacíos, `null`, límites). Las privadas se
  prueban a través de las públicas. Lo que espera va escrito, nunca calculado
  como lo calcula el util:

```ts
import { describe, expect, it } from 'vitest'
import type { Room } from '@/types/room'
import { roomPriceUtils } from './roomPriceUtils'

const ROOM: Room = { slug: 'encina', name: 'La Encina', capacity: 2, pricePerNight: 85, photos: [] }

describe('buildRoomStayPrice', () => {
  it('da el precio de las noches de la estancia', () => {
    expect(roomPriceUtils.buildRoomStayPrice(ROOM, 3)).toBe(255)
  })

  it('da 0 si la estancia no tiene ninguna noche', () => {
    expect(roomPriceUtils.buildRoomStayPrice(ROOM, 0)).toBe(0)
  })
})
```
<!-- kit:if privateArea -->
- **Una regla de permisos:** un `it` por regla, con el permiso y sin él
  ([Aplicar permisos](./apply-permissions.md)).
<!-- kit:end -->

<!-- kit:if backend -->
## 5. Los mocks que casan

Este test no viene hecho: es un patrón para cuando los mocks nombran algo de
otro sitio (una reserva nombra una habitación, que está en `ROOMS`, o un dato
de otro service). Se escribe en `src/tests/mockData.test.ts` el día que hace
falta: lee los JSON de los mocks y falla si un id o un nombre que pasa de uno
a otro no existe en el otro ([El mock](./add-a-service.md#4-el-mock)). Cada
mock nuevo que se cruce con otro añade aquí su comprobación:

```ts
import { describe, expect, it } from 'vitest'
import { ROOMS } from '@/constants/rooms'
import bookingsMocks from '@/services/bookings/bookingsMocks.json'

describe('los mocks casan con los datos de la web', () => {
  it('las habitaciones de la disponibilidad están en ROOMS', () => {
    const slugs = new Set(ROOMS.map(({ slug }) => slug))

    expect(bookingsMocks['GET /booking/availability'].rooms.map(({ roomSlug }) => roomSlug).filter((slug) => !slugs.has(slug))).toEqual([])
  })
})
```

<!-- kit:end -->
## Errores comunes

| Síntoma | Causa |
|---|---|
| Vitest no arranca: «Vitest failed to find the runner» | En Windows, se lanzó desde Git Bash, que le pasa la ruta con la letra de la unidad en minúscula: se lanza desde PowerShell. |
| `%%PM%% run build` falla con «Caught error rendering /rooms.test» | El test de una página está en `src/pages/`, y Astro lo toma por una ruta: va en `src/tests/pages/`, con la misma ruta. |
| Falla «cada página y cada endpoint tienen su test en src/tests/pages, con la misma ruta» | El test no tiene la misma ruta que la página, carpetas, `index` y corchetes incluidos: el de `src/pages/legal/notice.astro` es `src/tests/pages/legal/notice.test.ts`. |
| Falla «cada fichero con código tiene su test al lado» | Un fichero con código no tiene su `.test` al lado: se escribe, con el mismo nombre. Lo demás que mira está en [Normativa](../standards.md#comprobar-la-estructura). |
| `%%PM%% run typecheck` falla en el test de una página con «Argument of type '(_props: never) => any'…» | Su `getStaticPaths` solo da `params`, y Astro le pone a sus props el tipo `never`: la página declara que no recibe ninguna, con `type Props = Record<string, never>`. |
| El test de una página o de un componente `.astro` falla al importarlo | Lleva `// @vitest-environment jsdom`: lo de Astro se pinta en el entorno `node`. Solo las islas van en jsdom. |
| El test de una isla falla al pintarla, con «Cannot read properties of undefined (reading 'Symbol(Node prepared…» | Le falta `// @vitest-environment jsdom` en su primera línea. |
| El test busca el título o la descripción de la página y no los encuentra | `renderAstro` da el `body`: la cabecera se lee pintando la página con la Container API ([Una página](#una-página)). |
<!-- kit:if backend -->
| Un `vi.spyOn` del service no cambia lo que pinta la página | Se puso después de `testUtils.renderAstro`, o la página pide otro método: va antes de pintarla. |
| Una página falla con «Sin mock para …» | Pide un endpoint que no tiene respuesta en el `*Mocks.json` de su service: se añade ([El mock](./add-a-service.md#4-el-mock)), o el caso se da con `vi.spyOn`. |
<!-- kit:end -->
<!-- kit:if server -->
| Un test de una action manda un correo de verdad | No simula `fetch`: cada test de la action lleva su `vi.spyOn(globalThis, 'fetch')`. |
<!-- kit:end -->
<!-- kit:if privateArea -->
| La página del test no enseña nada de lo que debería | Lee la sesión y el test no le ha dado una con los permisos que pide la regla: `{ locals: { session } }`. |
| El test de una action da `UNAUTHORIZED` en todos los casos | No le llega la sesión: el tercer argumento de `testUtils.callAction` son los `locals`, `{ session }`, no la sesión sola. |
<!-- kit:end -->
| `getByRole` no encuentra un botón que se ve | El nombre accesible no es el texto que se busca: mira su `aria-label`. |
| `getByRole('button', { name: 'Pide disponibilidad' })` no lo encuentra | Lleva a otra página, así que es un enlace: `getByRole('link', { name: 'Pide disponibilidad' })`. |
| Un texto sale como «1 personas» | El texto no tiene sus dos formas, o no recibe el número. |
| La revisión visual no arranca | El puerto %%REVIEW_PORT%% está ocupado: se para el servidor que lo ocupa; nunca se usa el %%HUMAN_PORT%%. |
