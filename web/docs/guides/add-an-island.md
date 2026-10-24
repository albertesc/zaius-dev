# Añadir una isla

Esta guía añade una isla a una página: decide si hace falta, trae React con
la primera y la monta, con su nombre, su directiva, sus props y sus estilos.
Sirve a quien necesita en una página algo que cambia mientras se usa. Una isla
es un componente de React que Astro pinta en el servidor, como los demás, y
que después se pone en marcha en el navegador. La web nace sin ninguna.
El ejemplo es `RoomsSearch`, el buscador de ROOMS: se eligen las fechas y las
personas y enseña, mientras se eligen, las habitaciones en las que caben y el
precio de la estancia.
<!-- kit:if privateArea -->
Lo que guarda sale de la gestión de una reserva, ACCOUNT-BOOKINGS-EDIT.
<!-- kit:end -->

**En esta página:**

- [1. ¿Hace falta una isla?](#1-hace-falta-una-isla)
- [2. React y el sitio](#2-react-y-el-sitio): [Con la primera isla](#con-la-primera-isla) · [El nombre y el sitio](#el-nombre-y-el-sitio)
- [3. La directiva](#3-la-directiva)
- [4. Las props](#4-las-props)
<!-- kit:if privateArea -->
- [5. Guardar desde la isla](#5-guardar-desde-la-isla)
<!-- kit:end -->
- [6. Los estilos](#6-los-estilos)
- [7. Los tests](#7-los-tests)
- [Errores comunes](#errores-comunes)

## 1. ¿Hace falta una isla?

Casi nunca. Lo de Astro se pinta en el servidor y llega hecho: sin
JavaScript, carga antes y funciona siempre. Una isla lleva al navegador React
y su código, así que solo se usa donde hay estado en el navegador que un
`<script>` no lleva bien ([Normativa](../standards.md#islas)):

| Lo que hace falta | Con qué |
|---|---|
| Pintar datos, enseñar u ocultar según lo que llega, enlazar | Un componente `.astro` |
| Abrir la galería en un `<dialog>`, cambiar de pestaña, avisar de cambios sin guardar | Un `<script>` en el componente `.astro` |
<!-- kit:if server -->
| Enviar un formulario | Un `<form>` con su action, que funciona sin JavaScript ([Crear un formulario](./create-a-form.md)) |
<!-- kit:if backend -->
| Una zona lenta de pintar | Una isla de servidor (`server:defer`), que no lleva nada al navegador ([Carga, error y vacío](./load-and-save-data.md#3-carga-error-y-vacío)) |
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if privateArea -->
| Buscar en una lista que pagina el servidor | La búsqueda va en la query de la URL y la lee la página ([Listas paginadas y filtros](./load-and-save-data.md#7-listas-paginadas-y-filtros)) |
<!-- kit:end -->
| Calcular mientras se elige (el precio de una estancia), un asistente, una lista que se edita antes de guardarla | Una isla |

Una isla es una zona de la página, no la página: el resto sigue siendo
`.astro`, y la página sigue leyendo los datos y decidiendo su estado. La
revisión mira que cada isla haga falta de verdad
([Qué se revisa](../standards.md#qué-se-revisa)).

## 2. React y el sitio

### Con la primera isla

La web no trae React. La primera isla lo trae, y es una dependencia nueva:
antes se pide el OK a la persona, con lo que es («React, con el que se hace
una pieza que cambia mientras se usa»), para qué hace falta («el buscador
calcula el precio mientras eliges las fechas») y qué pasa sin él (la pieza
sería un formulario que envía y recarga la página, o no estaría). Con el OK:

1. **Los paquetes,** en `package.json`, con estas versiones, y después
   `%%PM%% install`:

   ```json
   {
     "dependencies": {
       "@astrojs/react": "^7.1.1",
       "react": "^19.2.8",
       "react-dom": "^19.2.8"
     },
     "devDependencies": {
       "@testing-library/react": "^16.3.3",
       "@testing-library/user-event": "^14.6.8",
       "@types/react": "^19.2.18",
       "@types/react-dom": "^19.2.7",
       "eslint-plugin-react-hooks": "^7.1.1"
     }
   }
   ```

2. **`astro.config.ts`:** la integración de React, la primera de
   `integrations`:

   ```ts
   import react from '@astrojs/react'

   export default defineConfig({
     integrations: [
       react(),
<!-- kit:if content -->
       mdx(),
<!-- kit:end -->
       sitemap(),
     ],
   })
   ```

3. **`tsconfig.json`:** en `compilerOptions`, cómo se lee el JSX:

   ```json
   "jsx": "react-jsx",
   "jsxImportSource": "react",
   ```

4. **`eslint.config.js`:** las reglas de los hooks, detrás de las de Astro, y
   las del JSX, junto a las demás de estilo:

   ```js
   import reactHooks from 'eslint-plugin-react-hooks'

   export default [
     ...astro.configs.recommended,
     reactHooks.configs.flat.recommended,
     {
       rules: {
         '@stylistic/comma-dangle': ['error', 'always-multiline'],
         '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
         '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
         '@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'],
       },
     },
   ]
   ```

5. **Los tests:** `src/tests/setup.ts` desmonta lo que pinta cada test, y
   `src/tests/testUtils.ts` enseña a `renderAstro` a pintar React, para que
   el test de una página vea su isla:

   ```ts
   // src/tests/setup.ts
   import { cleanup } from '@testing-library/react'

   afterEach(() => {
     cleanup()
     vi.restoreAllMocks()
   })
   ```

   ```ts
   // src/tests/testUtils.ts
   import { getContainerRenderer } from '@astrojs/react/container-renderer'
   import { loadRenderers } from 'astro:container'

   const renderers = await loadRenderers([getContainerRenderer()])

   const container = await AstroContainer.create({ renderers })
   ```

6. **El stack,** en [Stack y comandos](../../AGENTS.md#stack-y-comandos):
   React, solo para las islas.

Al terminar, `%%PM%% run typecheck`, `%%PM%% run lint` y `%%PM%% run test`,
en verde. Las islas siguientes ya lo tienen todo.

### El nombre y el sitio

- **Va en `src/components/`,** plana, junto a los componentes `.astro`, con
  el nombre de la misma fórmula
  ([Nomenclatura](../naming.md#componentes)): su prefijo de origen, su objeto
  y su tipo. La extensión dice que es una isla: `RoomsSearch.tsx`, que
  exporta `RoomsSearch`.
- **Sus piezas** (una fila, un paso de un asistente) son componentes de React,
  también en `src/components/`. Entre ellas sí se pasan funciones (`onRemove`).
- **La lógica con estado que crece** va a un hook de `src/hooks/`, que nace
  con el primero (`useRoomsSearch`), con su test; la que no tiene estado, a
  un util.

```text
src/
├── components/
│   ├── RoomsSearch.module.css
│   ├── RoomsSearch.test.tsx
│   └── RoomsSearch.tsx
└── pages/rooms.astro                  la página que la pinta
```

## 3. La directiva

La isla se pinta en el servidor con la página, y su HTML llega en la
respuesta. La directiva dice cuándo se pone en marcha en el navegador, que es
cuando carga su JavaScript. Cada isla lleva la suya, elegida a propósito:

| Directiva | Se pone en marcha | Para |
|---|---|---|
| `client:visible` | Cuando entra en la pantalla | Por defecto: casi todas |
| `client:idle` | Cuando el navegador queda libre, después de cargar la página | Lo que tiene que estar listo pronto, aunque aún no se vea |
| `client:load` | Nada más cargar la página | Solo lo que se usa en cuanto se abre |

La página importa la isla y la pinta con su directiva y sus props:

```astro
---
import { RoomsSearch } from '@/components/RoomsSearch'
import { ROOMS } from '@/constants/rooms'

const rooms = ROOMS.map(({ slug, name, capacity, pricePerNight }) => ({ slug, name, capacity, pricePerNight }))
<!-- kit:if i18n -->
const labels = {
  arrival: t('rooms.search.arrival'),
  departure: t('rooms.search.departure'),
  guests: t('rooms.search.guests'),
  empty: t('rooms.search.empty'),
}
<!-- kit:end -->
---

<!-- kit:if i18n -->
<RoomsSearch client:visible rooms={rooms} labels={labels} />
<!-- kit:else -->
<RoomsSearch client:visible rooms={rooms} />
<!-- kit:end -->
```

- **Sin directiva no es una isla:** se pinta en el servidor y no hace nada en
  el navegador. Para eso ya está `.astro`.
- **`client:only` no se usa:** se salta el servidor, así que la zona llega
  vacía hasta que carga el JavaScript, y el test de la página no la ve.
- **Hasta que se pone en marcha,** la isla es su HTML: se ve, pero no
  responde. Lo que tiene que funcionar antes (un enlace, «Pide
  disponibilidad») no depende de ella.

## 4. Las props

Lo que la isla necesita le llega por props, desde la página, y Astro lo
escribe en el HTML para pasárselo al navegador. Por eso:

- **Solo datos:** textos, números, booleanos, `null`, listas y objetos
  planos. Nada de funciones (una que le pase la página no llega al navegador)
  ni de instancias de clases.
- **Solo lo que usa:** todo lo que recibe va escrito en la página. Si cada
  habitación trae mucho más de lo que la isla pinta (sus fotos, su texto), la
  página le pasa lo justo de cada una, como arriba.
<!-- kit:if backend -->
- **Ella declara la forma de sus props,** con lo que usa:
  `rooms: Array<{ slug: string, name: string, capacity: number, pricePerNight: number }>`.
  No importa los tipos de `services/`, porque una isla no importa nada de ahí
  ([Comprobar la estructura](../standards.md#comprobar-la-estructura)): lo
  que da la API encaja igual, porque trae al menos esos campos.
<!-- kit:else -->
- **Ella declara la forma de sus props,** con lo que usa:
  `rooms: Array<{ slug: string, name: string, capacity: number, pricePerNight: number }>`.
  Las habitaciones de `ROOMS` encajan, porque traen al menos esos campos.
<!-- kit:end -->
- **Nada que solo funcione en el servidor:** ni `astro:env/server`
<!-- kit:if server -->
  ni `src/actions/`, ni el middleware,
<!-- kit:end -->
<!-- kit:if backend -->
  ni el transporte (`apiUtils` y los suyos),
<!-- kit:end -->
  directo o a través de otro fichero. Lo mira la revisión
  ([Qué se revisa](../standards.md#qué-se-revisa)). Los utils puros sí:
  corren igual en el navegador.
<!-- kit:if i18n -->
- **Los textos le llegan traducidos:** la isla no usa i18n. La página le pasa
  cada uno con `t()` (`labels`), con las claves de su página
  ([Textos (i18n)](../naming.md#textos-i18n)).
<!-- kit:else -->
- **Los textos van escritos en la isla,** como en cualquier componente.
<!-- kit:end -->

La isla, en `src/components/RoomsSearch.tsx`:

```tsx
import { useState } from 'react'
import { dateUtils } from '@/utils/dateUtils'
import { formatUtils } from '@/utils/formatUtils'
import { roomPriceUtils } from '@/utils/roomPriceUtils'
import styles from './RoomsSearch.module.css'

interface RoomsSearchProps {
  rooms: Array<{ slug: string, name: string, capacity: number, pricePerNight: number }>
<!-- kit:if i18n -->
  labels: { arrival: string, departure: string, guests: string, empty: string }
<!-- kit:end -->
}

<!-- kit:if i18n -->
export function RoomsSearch ({ rooms, labels }: RoomsSearchProps) {
<!-- kit:else -->
export function RoomsSearch ({ rooms }: RoomsSearchProps) {
<!-- kit:end -->
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [guests, setGuests] = useState(2)
  const nights = dateUtils.countNights(arrival, departure)
  const fittingRooms = rooms.filter((room) => room.capacity >= guests)
  const hasNights = nights > 0
  const isEmpty = fittingRooms.length === 0

  return (
    <div className={styles.search}>
      <label>
<!-- kit:if i18n -->
        {labels.arrival}
<!-- kit:else -->
        Llegada
<!-- kit:end -->
        <input type='date' value={arrival} onChange={(event) => setArrival(event.target.value)} />
      </label>
      <label>
<!-- kit:if i18n -->
        {labels.departure}
<!-- kit:else -->
        Salida
<!-- kit:end -->
        <input type='date' value={departure} onChange={(event) => setDeparture(event.target.value)} />
      </label>
      <label>
<!-- kit:if i18n -->
        {labels.guests}
<!-- kit:else -->
        Personas
<!-- kit:end -->
        <input type='number' min={1} value={guests} onChange={(event) => setGuests(Number(event.target.value))} />
      </label>
<!-- kit:if i18n -->
      {isEmpty ? <p>{labels.empty}</p> : null}
<!-- kit:else -->
      {isEmpty ? <p>Ninguna habitación para tantas personas</p> : null}
<!-- kit:end -->
      <ul>
        {fittingRooms.map((room) => (
          <li key={room.slug}>
            {room.name}
            {hasNights ? ` · ${formatUtils.formatPrice(roomPriceUtils.buildRoomStayPrice(room, nights))}` : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- **Las condiciones, en constantes con nombre** (`hasNights`, `isEmpty`), y
  en el JSX con `? :` y `null`, nunca con `&&` ([Islas](../standards.md#islas)).
- **Las cuentas, en utils puros,** con su test: las noches
  (`dateUtils.countNights`) y el precio (`roomPriceUtils.buildRoomStayPrice`).
  La isla solo pinta lo que dan.
- **El vacío dice que no hay ninguna,** sin punto
  ([D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío)).

**Un estado que empieza con una prop** (las personas con las que se abre el
buscador, `initialGuests`) solo la lee al empezar: las props de una isla no
cambian después.

```tsx
const [guests, setGuests] = useState(initialGuests)
```
<!-- kit:if privateArea -->

## 5. Guardar desde la isla

Una isla guarda con una action, como un formulario, pero la llama ella desde
el navegador. Si lo que se guarda cabe en un `<form>`, no hace falta isla
([Crear un formulario](./create-a-form.md)). Una isla guarda cuando lo que se
guarda es su estado: los huéspedes de una reserva, que se añaden y se quitan
antes de guardarlos, en `AccountBookingsEditGuestsForm`
([Con una isla](./create-a-form.md#con-una-isla)). Su «Guarda»:

```tsx
import { actions } from 'astro:actions'

const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')

async function handleSave () {
  setStatus('saving')
  const { error } = await actions.account.updateBookingGuests({ id: bookingId, guests })
  if (error?.code === 'UNAUTHORIZED') return window.location.reload()
  setStatus(error === undefined ? 'saved' : 'failed')
}
```

- **`actions` sale de `astro:actions`,** nunca de `src/actions/`: lo de
  servidor (las actions, los services, `astro:env/server`) no llega al
  navegador.
- **La llamada no lanza:** devuelve `{ data }` o `{ error }`, y la isla mira
  `error`.
- **Los errores de cada campo** (`isInputError(error)`) van bajo su campo
  ([Con una isla](./create-a-form.md#con-una-isla)).
- **`UNAUTHORIZED` es que la sesión se ha cerrado:** la isla recarga la
  página, y el middleware lleva al login.
- **Cualquier otro error es el fallo** del guardado, «No se han podido
  guardar los huéspedes», en el sitio que dice
  [D4](../ux-ui/rules.md#d4-avisos-y-fallos).
- **Nada se pinta como hecho antes de que responda**
  ([D5](../ux-ui/rules.md#d5-acciones)): mientras guarda, el primario lleva
  `loading` y lo demás de la isla se bloquea.
- **Si lo guardado cambia lo que pintó el servidor** fuera de la isla (las
  personas en la cabecera de la reserva), la isla recarga la página al
  terminar.
- **Para leer después de cargar** (lo que se pide mientras se escribe), la
  isla pide con `fetch` a un endpoint de `src/pages/api/`, nunca a la API.
<!-- kit:end -->

## 6. Los estilos

Los de la isla van en un CSS Module a su lado, `RoomsSearch.module.css`, que
solo afecta a la isla (`className={styles.search}`):

```css
.search {
  display: grid;
  gap: var(--space-2);
}
```

- **Siempre los tokens** del sistema de diseño
  ([Tokens](../ux-ui/design-system.md#tokens)), nunca un color suelto.
- **Nunca el atributo `style` ni `!important`**
  ([Estilos](../standards.md#estilos)).

## 7. Los tests

La isla tiene su test al lado, `RoomsSearch.test.tsx`, que corre en un
navegador simulado: su primera línea es `// @vitest-environment jsdom`. La
pinta con las props de un caso, escritas en el test como se las pasaría la
página, y la usa con `userEvent`, como una persona:

```tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { RoomsSearch } from './RoomsSearch'

const ROOMS = [
  { slug: 'encina', name: 'La Encina', capacity: 2, pricePerNight: 85 },
  { slug: 'roble', name: 'El Roble', capacity: 4, pricePerNight: 140 },
]
<!-- kit:if i18n -->
const LABELS = { arrival: 'Llegada', departure: 'Salida', guests: 'Personas', empty: 'Ninguna habitación para tantas personas' }
<!-- kit:end -->

describe('RoomsSearch', () => {
  it('deja solo las habitaciones en las que caben las personas', async () => {
    const user = userEvent.setup()
<!-- kit:if i18n -->
    render(<RoomsSearch rooms={ROOMS} labels={LABELS} />)
<!-- kit:else -->
    render(<RoomsSearch rooms={ROOMS} />)
<!-- kit:end -->

    await user.clear(screen.getByRole('spinbutton', { name: 'Personas' }))
    await user.type(screen.getByRole('spinbutton', { name: 'Personas' }), '4')

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['El Roble'])
  })

  it('da el precio de la estancia con las fechas elegidas', async () => {
    const user = userEvent.setup()
<!-- kit:if i18n -->
    render(<RoomsSearch rooms={ROOMS} labels={LABELS} />)
<!-- kit:else -->
    render(<RoomsSearch rooms={ROOMS} />)
<!-- kit:end -->

    await user.type(screen.getByLabelText('Llegada'), '2026-11-03')
    await user.type(screen.getByLabelText('Salida'), '2026-11-05')

    expect(screen.getByText(/La Encina/)).toHaveTextContent('170')
  })
})
```

- **Lo que pinta un test se desmonta solo** al acabar: lo hace `setup.ts`,
  con el `cleanup()` que se le puso con la primera isla.
- **El test de la página** ve la isla como sale del servidor, con sus props:
  comprueba lo que le pasa la página (las habitaciones, los textos), no lo que
  hace la isla al usarla.
<!-- kit:if privateArea -->
- **Si la isla guarda,** su test da a la action la respuesta de cada caso
  ([Una isla](./write-tests.md#una-isla)).
<!-- kit:end -->

Más casos y lo que se comprueba en cada tipo de fichero:
[Escribir tests](./write-tests.md).

## Errores comunes

| Síntoma | Causa |
|---|---|
| La isla se ve, pero no responde | Le falta la directiva: sin ella, solo es HTML. O aún no se ha puesto en marcha: con `client:visible`, al entrar en la pantalla. |
| `%%PM%% run build` o el tipado no entienden el JSX de la isla | Falta algo de [Con la primera isla](#con-la-primera-isla): la integración `react()` en `astro.config.ts` o `jsx` en `tsconfig.json`. |
| El test de la página falla al pintar la isla, sin un renderer para ella | `testUtils.renderAstro` no carga el de React: falta `renderers` en `AstroContainer.create`. |
| Una función que le pasa la página no hace nada | Las props de una isla son datos: una función no llega al navegador. Lo que hace va dentro de la isla. |
<!-- kit:if backend -->
| Falla «quién llama a la API» en la comprobación de la estructura, en la isla | La isla importa algo de `services/` o del transporte, aunque sea un tipo: la forma de sus props la declara ella. |
<!-- kit:end -->
| `%%PM%% run build` dice que `astro:env/server` solo es del servidor | La isla lo importa, directo o a través de otro fichero: lo que necesita le llega por props. |
<!-- kit:if privateArea -->
| La isla guarda importando `src/actions/` | Guarda con `actions`, de `astro:actions`: lo de `src/actions/` es del servidor. |
<!-- kit:end -->
<!-- kit:if i18n -->
| En otro idioma, la isla sale en el idioma por defecto | Tiene sus textos escritos: le llegan traducidos, por props. |
<!-- kit:end -->
| Los tests de la isla se ven unos a otros (dos «Personas» en la pantalla) | Falta el `cleanup()` en `src/tests/setup.ts`. |
| Su test falla al pintarla, con «Cannot read properties of undefined (reading 'Symbol(Node prepared…» | Le falta `// @vitest-environment jsdom` en su primera línea. |
