# Crear un formulario

Esta guía monta un formulario de principio a fin: el schema, el formulario,
los campos, el envío con su action y su validación, y el aviso de los cambios
sin guardar. Es un `<form>` de HTML en un componente `.astro` que envía a su
action: funciona sin JavaScript y no lleva librería de formularios. Es la
técnica: cómo se ve y cómo se comporta lo dice la norma
<!-- kit:if privateArea -->
[D6](../ux-ui/rules.md#d6-formularios) y, en la zona privada,
[D7](../ux-ui/rules.md#d7-un-registro-una-pantalla) y
[D9](../ux-ui/rules.md#d9-modales).
<!-- kit:else -->
[D6](../ux-ui/rules.md#d6-formularios).
<!-- kit:end -->
Sirve a quien construye un formulario de la web. El ejemplo es el de CONTACT,
«Pide disponibilidad», en `/contact`: el nombre, el correo, la llegada, la
salida, las personas, la habitación, el mensaje y la casilla de la
privacidad. No guarda un registro: manda un mensaje a la casa.
<!-- kit:if privateArea -->

Después van las variantes de la zona privada: editar un registro (la gestión
de una reserva), un formulario en un modal y los formularios por partes (las
filas de una tabla, también con una isla).
<!-- kit:end -->

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel). Cada pieza de
un campo pinta su control de HTML (`<input>`, `<select>`, `<textarea>`) con el
`name` y el `value` que recibe, y pasa al control los atributos que no son
suyos (`required`, `autofocus`, `autocomplete`, `data-*`).

**En esta página:**

- [1. El schema](#1-el-schema)
- [2. El formulario](#2-el-formulario)
- [3. Los campos](#3-los-campos)
- [4. Enviar el formulario](#4-enviar-el-formulario): [Adónde llega el mensaje](#adónde-llega-el-mensaje)
- [5. Los cambios sin guardar](#5-los-cambios-sin-guardar)
- [El formulario terminado](#el-formulario-terminado)
<!-- kit:if privateArea -->
- [Editar un registro](#editar-un-registro), [Formularios en un modal](#formularios-en-un-modal), [Formularios por partes](#formularios-por-partes): [Con una isla](#con-una-isla)
<!-- kit:end -->
- [Errores comunes](#errores-comunes)

## 1. El schema

El schema dice qué recibe la action del formulario y lo valida. Va en
`src/actions/`, junto a la action que lo usa, con el prefijo de la página:
`contactFormSchema.ts`, con su tipo, `ContactFormValues`
([Nomenclatura](../naming.md#actions-y-endpoints)). Lo que repiten los
formularios de varias páginas (el texto obligatorio) pasa a
`src/schemas/commonSchema.ts` con el segundo que lo necesita.

```ts
import { z } from 'astro/zod'
import { CONTACT_MESSAGE_MAX, CONTACT_NAME_MAX } from '@/constants/contactForm'

const REQUIRED = 'common.formErrors.required'
const MAX = 'common.formErrors.max'

export const contactFormSchema = z.object({
  name: z.string({ error: REQUIRED }).trim().min(1, REQUIRED).max(CONTACT_NAME_MAX, MAX),
  email: z.string({ error: REQUIRED }).trim().min(1, REQUIRED).email('common.formErrors.email'),
  arrival: z.string({ error: REQUIRED }).min(1, REQUIRED),
  departure: z.string({ error: REQUIRED }).min(1, REQUIRED),
  guests: z.number({ error: REQUIRED }).int(),
  roomSlug: z.string().optional(),
  message: z.string().trim().max(CONTACT_MESSAGE_MAX, MAX).optional(),
  privacy: z.boolean().refine((accepted) => accepted, 'contact.form.errors.privacy'),
  website: z.string().optional(),
}).refine(({ arrival, departure }) => departure > arrival, { path: ['departure'], error: 'contact.form.errors.departureBeforeArrival' })

export type ContactFormValues = z.infer<typeof contactFormSchema>
```

- **`z` sale de `astro/zod`,** el de Astro, que es con el que valida la
  action.
- **Astro convierte lo que envía el `<form>` según el schema:** un campo vacío
  llega como `null`, o como `undefined` si es `.optional()`; un `z.number()`
  recibe el número (`'2'` pasa a `2`) y un `z.boolean()`, `true` si la casilla
  va marcada.
- **Lo obligatorio lleva su mensaje dos veces:** en `z.string({ error })`, para
  el campo vacío, que llega como `null`, y en `.min(1, …)`, para el que solo
  tiene espacios. Un selector obligatorio, en `z.number({ error })`.
- **Una casilla que hay que marcar** (la privacidad) es un `z.boolean()` con
  su `refine`: sin marcar llega `false`, y el mensaje dice qué hacer.
- **Los textos se recortan** (`trim()`), y todo texto libre tiene un máximo,
  en una constante (`src/constants/contactForm.ts`) que usan el schema y el
  campo. Nunca el `maxlength` del navegador, que corta sin avisar lo que se
  pega.
- **Una regla entre campos** va en el `refine` del objeto, con su `path` en el
  campo que lleva el error: la salida no puede ser antes de la llegada, y el
  error va en la salida.
- **`website` es el campo trampa** contra el spam: no se ve, y una persona no
  lo rellena ([4. Enviar el formulario](#4-enviar-el-formulario)).
- **Los mensajes de error** son claves del catálogo:
  `common.formErrors.required` o una de la página, en su grupo `errors`
  (`contact.form.errors.privacy`). El formulario las traduce al pintarlas.
  Cada mensaje es una frase completa, con punto: qué está mal y, si cabe, cómo
  tiene que ser.

Su test, al lado, comprueba que acepta un envío bueno y que el error de uno
malo sale en el campo que toca
([Escribir tests](./write-tests.md#un-schema-o-un-util)). Lo que hace Astro
con los campos vacíos se prueba en el de la action
([Enviar el formulario](#4-enviar-el-formulario)):

```ts
import { describe, expect, it } from 'vitest'
import { contactFormSchema } from './contactFormSchema'

const VALID = { name: 'Lucía Martín', email: 'lucia@example.com', arrival: '2026-11-13', departure: '2026-11-15', guests: 2, privacy: true }

describe('contactFormSchema', () => {
  it('acepta un mensaje sin habitación ni texto', () => {
    expect(contactFormSchema.safeParse(VALID).success).toBe(true)
  })

  it('pone el error en la salida si es antes de la llegada', () => {
    const result = contactFormSchema.safeParse({ ...VALID, departure: '2026-11-12' })

    expect(result.error?.issues.map(({ path }) => path)).toEqual([['departure']])
  })
})
```

## 2. El formulario

El formulario es un componente de la página,
`src/components/ContactForm.astro`
([Nomenclatura](../naming.md#componentes)). La página,
`src/pages/contact.astro`, se pinta en cada petición, porque recibe el envío,
y lee lo que ha pasado en el último y lo que necesitan sus selectores (las
habitaciones, de `ROOMS`):

```astro
---
import { actions } from 'astro:actions'
import ContactForm from '@/components/ContactForm.astro'
import { ROOMS } from '@/constants/rooms'
import AppLayout from '@/layouts/AppLayout.astro'

export const prerender = false

const result = Astro.getActionResult(actions.contact.sendContactMessage)
const sent = result?.error === undefined ? null : await Astro.request.formData()
const roomSlug = Astro.url.searchParams.get('room') ?? ''
---
```

Y la pinta en su layout:
`<ContactForm rooms={ROOMS} roomSlug={roomSlug} result={result} sent={sent} />`.
El componente es un `<form>` que envía a su action:

```astro
---
import { actions } from 'astro:actions'
import type { ActionReturnType } from 'astro:actions'
import type { Room } from '@/types/room'
import { formUtils } from '@/utils/formUtils'

interface Props {
  rooms: Room[]
  roomSlug: string
  result: ActionReturnType<typeof actions.contact.sendContactMessage> | undefined
  sent: FormData | null
}

const { rooms, roomSlug, result, sent } = Astro.props
const initial = { name: '', email: '', arrival: '', departure: '', guests: '', roomSlug, message: '' }
const fieldValue = (name: keyof typeof initial) => String(sent?.get(name) ?? initial[name])
---

<form method='POST' action={formUtils.buildFormAction(actions.contact.sendContactMessage, Astro.url)} novalidate data-contact-form data-unsaved={sent === null ? undefined : ''}>
  …
</form>
```

- **La `action` del formulario** envía a la misma URL con
  `?_action=contact.sendContactMessage`, y el middleware ejecuta la action
  ([4. Enviar el formulario](#4-enviar-el-formulario)).
  `actions.contact.…` sola cambiaría la query de la página, y se perdería lo
  que trae (`?room=encina`, desde «Pide disponibilidad» en ROOMS):
  `formUtils.buildFormAction` (en `src/utils/formUtils.ts`, que nace con el
  primer formulario) le suma la query de la página, sin un `_action` que ya
  traiga:

  ```ts
  /**
   * Da la `action` de un formulario que envía a una action de Astro sin perder la query de la página.
   * @param action La action (`actions.contact.sendContactMessage`), que se escribe como `?_action=…`.
   * @param url La URL de la página.
   * @returns `?_action=…` con la query de la página detrás.
   */
  function buildFormAction (action: { toString: () => string }, url: URL): string {
    const query = new URLSearchParams(url.search)
    query.delete('_action')
    return query.size === 0 ? String(action) : `${String(action)}&${query}`
  }

  export const formUtils = {
    buildFormAction,
  }
  ```
- **`novalidate`:** valida el schema, no el navegador, que pondría sus propios
  avisos.
- **Los valores:** cada campo parte de su valor inicial (vacío, o la
  habitación que trae `?room=`); tras un envío con errores, de lo que se envió
  (`sent`), para no perder nada de lo escrito. `fieldValue` elige uno u otro.
  La página solo lee lo enviado (`Astro.request.formData()`) si el envío ha
  fallado.
- **`export const prerender = false`:** una página que se genera al compilar
  no recibe el envío. El resto de la web se sigue generando al compilar.
- **`data-contact-form` y `data-unsaved`** son para su `<script>`
  ([5. Los cambios sin guardar](#5-los-cambios-sin-guardar)).

## 3. Los campos

Qué pieza lleva cada dato (un texto, un selector, una fecha) lo dice el sistema
de diseño, y cómo se colocan y se marcan,
[D6](../ux-ui/rules.md#d6-formularios). Aquí, cómo se enlazan con el
formulario. Los de «Pide disponibilidad»:

```astro
---
const t = getI18nT(Astro.currentLocale)
const locale = Astro.currentLocale ?? APP_DEFAULT_LANGUAGE
const errors = isInputError(result?.error) ? result.error.fields : {}
const translateError = (message: string | undefined, max?: number) => message === undefined ? undefined : t(message, { max })
const today = dateUtils.getToday()
const guestOptions = [{ value: '', label: '' }, ...['1', '2', '3', '4'].map((value) => ({ value, label: value }))]
const roomOptions = [{ value: '', label: t('contact.form.anyRoom') }, ...rooms.map((room) => ({ value: room.slug, label: room.name }))]
---

<TextInput name='name' label={t('contact.form.name')} autocomplete='name' value={fieldValue('name')} error={translateError(errors.name?.[0], CONTACT_NAME_MAX)} required />
<TextInput name='email' type='email' label={t('contact.form.email')} autocomplete='email' value={fieldValue('email')} error={translateError(errors.email?.[0])} required />
<DateInput name='arrival' label={t('contact.form.arrival')} min={today} value={fieldValue('arrival')} error={translateError(errors.arrival?.[0])} required />
<DateInput name='departure' label={t('contact.form.departure')} min={today} value={fieldValue('departure')} error={translateError(errors.departure?.[0])} required />
<Select name='guests' label={t('contact.form.guests')} options={guestOptions} value={fieldValue('guests')} error={translateError(errors.guests?.[0])} required />
<Select name='roomSlug' label={t('contact.form.room')} options={roomOptions} value={fieldValue('roomSlug')} />
<TextArea name='message' label={t('contact.form.message')} max={CONTACT_MESSAGE_MAX} value={fieldValue('message')} error={translateError(errors.message?.[0], CONTACT_MESSAGE_MAX)} />
<Checkbox name='privacy' checked={sent?.has('privacy') ?? false} error={translateError(errors.privacy?.[0])} required>
  {t('contact.form.privacy')} <a href={getRelativeLocaleUrl(locale, '/privacy')}>{t('contact.form.privacyLink')}</a>
</Checkbox>
<input class='trap' type='text' name='website' tabindex='-1' autocomplete='off' aria-hidden='true' />
```

- **`name`** es el del campo en el schema, y es lo que envía el `<form>`.
- **El error** sale de `fields` (`isInputError`), un array de mensajes por
  campo: se pinta el primero, en la nota del campo, que la pieza enlaza con
  `aria-invalid` y `aria-describedby`.
  Se traduce con `t()`, con `{ max }` si el campo tiene máximo.
  Lo obligatorio lleva `required`, que con `novalidate` solo lo marca.
- **`autocomplete`** (`name`, `email`) deja al navegador rellenar lo que ya
  sabe.
- **Un selector opcional** lleva primero la opción vacía (`value=''`), que lo
  vacía, con su texto («Cualquiera»); uno obligatorio la lleva sin texto solo
  mientras no tiene valor. Sus opciones salen de los datos que lee la página
  (las habitaciones, de `ROOMS`) y viajan como texto: la action recibe un
  número si el schema lo pide.
- **Una fecha** es el `aaaa-mm-dd` de `<input type='date'>`, y se compara como
  texto. Sus límites van también en `min` y `max`, para que no se puedan
  elegir (no se llega antes de hoy, `dateUtils.getToday()`); el schema sigue
  comprobando lo que importa.
- **La casilla de la privacidad** enlaza la página de PRIVACY, y sin marcar no
  se envía nada.
- **El campo trampa** (`website`) va fuera de la vista, con su clase en el
  `<style>` del componente (`.trap`), fuera del orden del tabulador
  (`tabindex='-1'`), sin autocompletar y escondido del lector de pantalla.
- **Lo que no se edita se enseña como lectura,** nunca como un campo
  `disabled`, que además no se envía.

## 4. Enviar el formulario

El navegador envía el `<form>`, sin JavaScript, y el middleware ejecuta la
action y hace el post/redirect/get:

- **si sale bien,** redirige (303) a la misma página: recargar no vuelve a
  enviar nada;
- **si un campo está mal,** no redirige: la página se pinta otra vez (400) y
  el formulario enseña los errores y lo que se escribió;
- **si falla otra cosa** (el servicio de correo no responde), también se
  pinta otra vez, con el fallo.

El middleware, `src/middleware.ts`, nace con el primer formulario:

```ts
import { getActionContext } from 'astro:actions'
<!-- kit:if privateArea -->
import { defineMiddleware, sequence } from 'astro:middleware'

const actionForms = defineMiddleware(async (context, next) => {
<!-- kit:else -->
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
<!-- kit:end -->
  if (context.isPrerendered) return next()
  const { action, setActionResult, serializeActionResult } = getActionContext(context)
  if (action?.calledFrom !== 'form') return next()
  const result = await action.handler()
  if (result.error === undefined) {
    const url = new URL(context.url)
    url.searchParams.delete('_action')
    context.cookies.set('saved', action.name, { path: '/', httpOnly: true, sameSite: 'lax' })
    return context.redirect(`${url.pathname}${url.search}`, 303)
  }
  setActionResult(action.name, serializeActionResult(result))
  return next()
})
<!-- kit:if privateArea -->

export const onRequest = sequence(session, actionForms)
<!-- kit:end -->
```

- **Si sale bien,** responde con un 303 a la misma URL, con su query y sin
  `_action`, y deja el nombre de la action en una cookie de un solo uso,
  `saved`, para que la página nueva sepa qué ha pasado.
- **Si falla,** la página se pinta con el resultado
  (`Astro.getActionResult`).
- **Salta las páginas que se generan al compilar** (`context.isPrerendered`):
  no reciben envíos.
<!-- kit:if privateArea -->
- **Va después del de la sesión,** que deja `Astro.locals.session` a las
  actions ([Lo que da la sesión](./apply-permissions.md#lo-que-da-la-sesión)).
<!-- kit:end -->

La action, en `src/actions/contactActions.ts`, compuesta en
`src/actions/index.ts` (`export const server = { contact: contactActions }`):

```ts
import { defineAction } from 'astro:actions'
import { MAIL_API_KEY, MAIL_TO } from 'astro:env/server'
import { contactFormSchema } from './contactFormSchema'
import type { ContactFormValues } from './contactFormSchema'

const MAIL_API_URL = 'https://api.mail.example/v1/emails'

/**
 * Manda a la casa un mensaje del formulario de contacto, con la API del servicio de correo.
 * @param message Lo enviado, ya validado.
 * @throws {Error} Si el servicio de correo no lo acepta.
 */
async function sendMail (message: Omit<ContactFormValues, 'website'>): Promise<void> {
  const lines = [`${message.name} <${message.email}>`, `Del ${message.arrival} al ${message.departure}, ${message.guests} personas`, message.roomSlug ?? '', message.message ?? '']
  const response = await fetch(MAIL_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MAIL_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: MAIL_TO, replyTo: message.email, subject: `Disponibilidad del ${message.arrival} al ${message.departure}`, text: lines.join('\n') }),
  })
  if (!response.ok) throw new Error(`El servicio de correo responde ${response.status}`)
}

export const contactActions = {
  /**
   * Manda a la casa el mensaje del formulario de contacto.
   * Si llega con el campo trampa relleno, no manda nada y responde como si hubiera ido bien.
   */
  sendContactMessage: defineAction({
    accept: 'form',
    input: contactFormSchema,
    handler: async ({ website, ...message }) => {
      if (website !== undefined) return
      await sendMail(message)
    },
  }),
}
```

- **`accept: 'form'`** recibe el `FormData` y lo valida con el schema antes
  del handler: con un campo mal, el handler no corre.
- **Contra el spam,** si llega el campo trampa con algo, la action responde
  como si hubiera ido bien y no manda nada: quien lo envía no sabe que lo ha
  descubierto.
- **El envío lo hace la propia action,** con `fetch` a la API del servicio de
  correo que ha elegido la persona, en una función privada del fichero
  (`sendMail`), que no se exporta
  ([Adónde llega el mensaje](#adónde-llega-el-mensaje)). Si el servicio no lo
  acepta, el error sale del handler tal cual, y el formulario pinta su fallo.
- **El correo es para la casa,** en su idioma: dice todo lo enviado, y su
  respuesta va al correo de quien lo escribió (`replyTo`).
<!-- kit:if privateArea -->
- **Una action de la zona privada** comprueba antes la sesión y el permiso
  ([Aplicar permisos](./apply-permissions.md#5-las-actions)). Esta no: el
  formulario de contacto es público.
<!-- kit:end -->

El formulario pinta el resultado:

```astro
---
const hasFailure = result?.error !== undefined && !isInputError(result.error)
const reviewCount = Object.keys(errors).length
---

  {hasFailure ? <PageAlert tone='error' title={t('contact.form.failure')}>{t('contact.form.failureDescription')}</PageAlert> : null}
  <ActionBar hint={reviewCount > 0 ? t('common.form.review', { count: reviewCount }) : undefined}>
    <Button type='submit'>{t('contact.form.send')}</Button>
  </ActionBar>
</form>
```

- **Cuándo se valida:** en el servidor, al enviar. Nada antes del primer
  intento, y cada envío pinta los errores que quedan. Revalidar cada campo
  mientras se escribe pide estado en el navegador: es una isla
  ([Añadir una isla](./add-an-island.md)), y casi nunca hace falta.
- **«Hay N campos por revisar»** va en la ayuda de la barra tras un intento
  con errores.
- **El foco va al primer campo con error:** su pieza lleva `autofocus`. Es el
  primero de `fields`, que sigue el orden del schema.
- **El fallo** va en el aviso de página, encima de la barra, con lo escrito
  intacto ([D4](../ux-ui/rules.md#d4-avisos-y-fallos)). Su título dice «No se
  ha podido …», sin punto; su descripción, qué hacer, con punto.
- **Mientras se envía,** el `<script>` del formulario marca el primario con
  `aria-busy`, que su pieza pinta como `loading`
  ([5. Los cambios sin guardar](#5-los-cambios-sin-guardar)). Los campos no se
  desactivan: un campo desactivado no se envía.

**Tras enviar,** la página enseña, en lugar del formulario, lo que pasa ahora.
Lee la cookie que dejó el middleware y la borra:

```astro
---
const isSent = Astro.cookies.get('saved')?.value === 'contact.sendContactMessage'
if (isSent) Astro.cookies.delete('saved', { path: '/' })
---

{isSent
  ? <Card title={t('contact.sent.title')}>{t('contact.sent.description')}</Card>
  : <ContactForm rooms={ROOMS} roomSlug={roomSlug} result={result} sent={sent} />}
```

La action tiene su test al lado, con `testUtils.callAction`, que la llama como
Astro, con el `FormData` del envío, y el envío simulado con
`vi.spyOn(globalThis, 'fetch')`: ningún test manda un correo de verdad
([Una action](./write-tests.md#una-action)):

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
  const values = { name: 'Lucía Martín', email: 'lucia@example.com', arrival: '2026-11-13', departure: '2026-11-15', guests: '2', roomSlug: '', message: '', privacy: 'on', website: '', ...fields }
  for (const [name, value] of Object.entries(values)) sent.set(name, value)
  return sent
}

describe('contactActions', () => {
  it('sendContactMessage manda el mensaje a la casa, para contestar a quien lo escribe', async () => {
    const send = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }))

    await testUtils.callAction(contactActions.sendContactMessage, buildSent())

    expect(JSON.parse(String(send.mock.calls[0]?.[1]?.body))).toMatchObject({ replyTo: 'lucia@example.com', subject: 'Disponibilidad del 2026-11-13 al 2026-11-15' })
  })

  it('sendContactMessage da su fallo si el servicio de correo no lo acepta', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    const result = await testUtils.callAction(contactActions.sendContactMessage, buildSent())

    expect(result.error).toBeDefined()
  })

  it('sendContactMessage no manda nada si llega el campo trampa', async () => {
    const send = vi.spyOn(globalThis, 'fetch')

    const result = await testUtils.callAction(contactActions.sendContactMessage, buildSent({ website: 'https://spam.example' }))

    expect(result.error).toBeUndefined()
    expect(send).not.toHaveBeenCalled()
  })

  it('sendContactMessage pone el error en la privacidad sin marcar', async () => {
    const sent = buildSent()
    sent.delete('privacy')

    const result = await testUtils.callAction(contactActions.sendContactMessage, sent)

    expect(isInputError(result.error) ? Object.keys(result.error.fields) : []).toEqual(['privacy'])
  })
})
```

### Adónde llega el mensaje

Adónde llegan los mensajes lo dice el documento de la página; si no lo dice,
se pregunta a la persona antes de escribir la action, con palabras de la web:

<!-- kit:if backend -->
- **A un correo de la casa,** la recomendada si no tiene un sistema propio.
- **Al sistema de la casa** (sus reservas, su CRM): es un endpoint más de su
  API, con su método en un service, y la action lo llama en lugar de mandar
  el correo ([Añadir un servicio](./add-a-service.md)).
<!-- kit:else -->
- **A un correo de la casa,** la recomendada si no tiene un sistema propio.
- **Al sistema de la casa** (sus reservas, su CRM): es su API, que llega con
  `%%KIT_RUN%% change`, con Sí a la pregunta de la API.
<!-- kit:end -->

A un correo, con un servicio de envío de correo (Resend, Brevo, Postmark…):

- **La cuenta la crea la persona,** en el servicio que elija, y la dirección
  de su API (`MAIL_API_URL`) y la forma del mensaje son las que dice ese
  servicio. La action la llama con `fetch`, sin paquetes; si hiciera falta el
  del servicio, es una dependencia nueva, con el OK
  ([La persona decide](../process.md#la-persona-decide)).
- **Su clave es secreta,** `MAIL_API_KEY`, y va en la cabecera de la
  petición; la dirección de la casa que recibe los mensajes es `MAIL_TO`. La
  action las lee de `astro:env/server`, y se declaran en el `env.schema` de
  `astro.config.ts`:

<!-- kit:if backend -->
  ```ts
  env: {
    schema: {
      API_URL: envField.string({ context: 'server', access: 'public' }),
      USE_MOCKS: envField.boolean({ context: 'server', access: 'public', default: false }),
      MAIL_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      MAIL_TO: envField.string({ context: 'server', access: 'public' }),
    },
  },
  ```
<!-- kit:else -->
  ```ts
  import { defineConfig, envField } from 'astro/config'

  export default defineConfig({
    env: {
      schema: {
        MAIL_API_KEY: envField.string({ context: 'server', access: 'secret' }),
        MAIL_TO: envField.string({ context: 'server', access: 'public' }),
      },
    },
  })
  ```

  `astro.config.ts` aún no importa `envField`: se añade al import de
  `astro/config`, con el `env` y su `schema`, junto a lo que ya tiene.
<!-- kit:end -->
- **La clave nunca va en el código ni en un `.env` que se versiona:** en tu
  máquina, en `.env.development.local`, que no se versiona; al publicar, en
  las variables de la plataforma (`zaius-publish`). En los tests, el envío
  está simulado, y `.env.test` les da valores de prueba (`MAIL_API_KEY=test`).
- **Mientras se desarrolla,** los mensajes van a una dirección de prueba de la
  casa (el `MAIL_TO` de `.env.development`), nunca a la de verdad, que va en
  el de `.env.production`.

## 5. Los cambios sin guardar

Un formulario con cambios avisa antes de salir de la página
([D6](../ux-ui/rules.md#d6-formularios)). Cada salida es una página nueva
(un enlace, otro envío, recargar, cerrar la pestaña), así que avisa el
navegador, con su propio texto (`beforeunload`). Lo hace el `<script>` del
formulario, que también marca el envío en curso:

```astro
<script>
  /**
   * Vigila un formulario en el navegador: avisa al salir con cambios sin enviar y marca el envío en curso.
   * @param form El formulario; con `data-unsaved`, ya tiene cambios desde que se carga.
   */
  function watchForm (form: HTMLFormElement) {
    const submit = form.querySelector('[type=submit]')
    const read = () => JSON.stringify([...new FormData(form)])
    const initial = form.dataset.unsaved === undefined ? read() : null
    let isSending = false
    form.addEventListener('submit', () => {
      isSending = true
      submit?.setAttribute('aria-busy', 'true')
    })
    window.addEventListener('pageshow', () => {
      isSending = false
      submit?.removeAttribute('aria-busy')
    })
    window.addEventListener('beforeunload', (event) => {
      if (!isSending && read() !== initial) event.preventDefault()
    })
  }

  const form = document.querySelector<HTMLFormElement>('form[data-contact-form]')
  if (form !== null) watchForm(form)
</script>
```

- **Hay cambios** si lo que tiene el formulario no es lo que tenía al cargarse.
  Tras un envío con errores, lo escrito aún no se ha enviado: el formulario
  lleva `data-unsaved` y avisa desde el principio.
- **Enviar no es salir:** el envío no avisa. `pageshow` lo deja como estaba si
  el navegador vuelve a la página desde su historial.
- **El `<script>` es del componente:** Astro lo empaqueta y lo carga una vez
  por página. Con el segundo formulario que lo necesita, el `<form>` y su
  `<script>` pasan a un componente de toda la web (`PageForm.astro`), que
  recibe la action y lo enviado y pinta los campos con `<slot />`: `utils/`
  es solo para funciones puras.
- **Lo escrito no se guarda en el navegador** (no hay borradores), y recargar
  empieza de cero.

## El formulario terminado

Con las piezas que nombra esta guía, un formulario queda repartido así:

| Pieza | Dónde |
|---|---|
| El schema | `src/actions/contactFormSchema.ts`, junto a su action |
| Los máximos de los textos | `src/constants/contactForm.ts` (`CONTACT_MESSAGE_MAX`) |
| La action | `sendContactMessage`, en `src/actions/contactActions.ts`, compuesta en `src/actions/index.ts` |
| El envío del mensaje | `sendMail`, privada en `src/actions/contactActions.ts`, con `MAIL_API_KEY` y `MAIL_TO`, declaradas en el `env.schema` de `astro.config.ts` |
| El post/redirect/get y la cookie del aviso | `src/middleware.ts` |
| El resultado, lo enviado y lo que se ve tras enviar | La página, `src/pages/contact.astro` |
| La `action` del `<form>` con la query de la página | `formUtils.buildFormAction`, en `src/utils/formUtils.ts` |
| El formulario, sus campos y su `<script>` | `src/components/ContactForm.astro` |
| Los tests | Al lado de cada fichero (`contactFormSchema.test.ts`, `contactActions.test.ts`, `formUtils.test.ts`, `ContactForm.test.ts`); el de la página, en `src/tests/pages/contact.test.ts` |
<!-- kit:if privateArea -->

## Editar un registro

La gestión de un registro es su única pantalla: ACCOUNT-BOOKINGS-EDIT, la de
una reserva, en `/account/bookings/[id]/edit`
([Nomenclatura](../naming.md#páginas-y-rutas)). Se llega con «Gestiona»,
desde su fila en «Mis reservas», también sin permiso para editar: entonces se
abre en lectura. Cómo es la pantalla lo dice
[D7](../ux-ui/rules.md#d7-un-registro-una-pantalla); lo propio del
formulario, `AccountBookingsEditForm.astro`, con la hora de llegada y una nota:

- **La página lee el registro** con su service, cada vez, también después de
  guardar, así que el formulario nunca parte de algo viejo:

  ```astro
  ---
  const id = Number(Astro.params.id)
  const booking = await bookingsService.getBookingDetail(id)
  const result = Astro.getActionResult(actions.account.updateBookingArrival)
  const sent = result?.error === undefined ? null : await Astro.request.formData()
  ---
  ```

- **Del registro al formulario y del formulario a la petición,** dos
  funciones puras del objeto de utils del formulario
  ([Nomenclatura](../naming.md#actions-y-endpoints)):

  ```ts
  import type { AccountBookingsEditFormValues } from '@/actions/accountBookingsEditFormSchema'
  import type { BookingDetail, UpdateBookingArrivalRequest } from '@/services/bookings/bookingsSchema'

  /**
   * Los valores con los que se abre el formulario de la gestión de una reserva.
   * @param booking La reserva guardada.
   * @returns Cada campo como lo pinta el formulario: texto, y `''` en lo vacío.
   */
  function buildAccountBookingsEditFormValues (booking: BookingDetail) {
    return {
      arrivalTime: booking.arrivalTime ?? '',
      note: booking.note ?? '',
    }
  }

  /**
   * La petición que guarda la llegada de una reserva con lo enviado en su formulario.
   * @param values Lo enviado, ya validado por el schema.
   * @returns El cuerpo de `updateBookingArrival`, con `null` en lo vacío.
   */
  function buildAccountBookingsEditRequest (values: AccountBookingsEditFormValues): UpdateBookingArrivalRequest {
    return {
      arrivalTime: values.arrivalTime ?? null,
      note: values.note || null,
    }
  }

  export const accountBookingsEditFormUtils = {
    buildAccountBookingsEditFormValues,
    buildAccountBookingsEditRequest,
  }
  ```

  Lo vacío va a la API como `null`: lo opcional llega como `undefined`, y una
  nota de solo espacios queda en `''` tras `trim()`, por eso `||`.
- **El id del registro** va en un campo oculto, y el schema lo pide
  (`id: z.number().int()`): una action no sabe desde qué página la llaman.
- **La action** (`updateBookingArrival`, en `src/actions/accountActions.ts`)
  comprueba la sesión y el permiso antes de llamar al service
  ([Aplicar permisos](./apply-permissions.md#5-las-actions)), y arma la
  petición con `buildAccountBookingsEditRequest`. Lo que solo comprueba la API
  vuelve como un `ActionError` con su código (`CONFLICT`), y el formulario lo
  pone bajo su campo.
- **Un solo formulario** con todo lo que se edita del registro, y un solo
  «Guarda». Es el mismo que el alta, si la hay: los mismos campos, en el mismo
  orden ([D6](../ux-ui/rules.md#d6-formularios)).
- **La barra de acciones** va al pie y lleva, de izquierda a derecha, la ayuda
  («Hay N campos por revisar» o nada), la salida («Vuelve a mis reservas»: la
  lista con su página, de `?back=` si es una ruta de la web, que empieza por
  `/` y no por `//`; si no, `/account/bookings`) y «Guarda», el último
  ([Rutas y navegación](../standards.md#rutas-y-navegación)).
- **Al guardar se sigue en la página,** con lo guardado y el aviso efímero
  «Se han guardado los cambios» ([D4](../ux-ui/rules.md#d4-avisos-y-fallos)):
  la página lee la cookie `saved` (`account.updateBookingArrival`) y la
  borra, como la de contacto.
- **Las pestañas** van en `?tab=` (`?tab=guests`), y la primera no lleva
  parámetro. Si el formulario es uno, todas van dentro del `<form>`: la página
  abre la de `?tab=` o, tras un envío con errores, la primera que los tiene, y
  el `<script>` cambia de una a otra sin recargar (`history.replaceState`).
  Cada pestaña con errores lleva su marca.
- **Las secciones plegables** (tres o más) son `<details open>`: todas
  abiertas al entrar, también tras un envío con errores.
- **Lo que actúa al momento** («Cancela la reserva») no es parte del
  formulario: es su propio `<form>`, con su action, fuera del principal,
  porque un `<form>` no va dentro de otro
  ([Formularios en un modal](#formularios-en-un-modal)). Enviarlo es salir de
  la página: con cambios sin guardar, avisa el navegador.
- **La lectura:** sin permiso para editar, la página pinta los mismos datos
  como texto, sin `<form>` ni barra, con el aviso «No puedes cambiar esta
  reserva» bajo la cabecera, que no se cierra
  ([Aplicar permisos](./apply-permissions.md#4-las-zonas-de-la-pantalla)). Si
  es el estado el que no deja editar (una reserva pasada), el aviso dice qué
  se puede hacer.

## Formularios en un modal

Una acción que pide datos antes de hacerse (cancelar una reserva, con su
motivo) es un modal con un formulario: un `<dialog>` con un `<form>` que envía
a su action, `cancelBooking`, con su schema, `bookingCancelFormSchema`. El de
cancelar una reserva es de la entidad, `src/components/BookingCancelModal.astro`,
porque lo abren la gestión y cada fila de «Mis reservas». La página le pasa los
motivos (`bookingsService.getBookingCancelReasonsCatalog`), su resultado y lo
enviado, como al formulario de la página:

```astro
---
const t = getI18nT(Astro.currentLocale)
const errors = isInputError(result?.error) ? result.error.fields : {}
const hasFailure = result?.error !== undefined && !isInputError(result.error)
const reasonOptions = [{ value: '', label: '' }, ...reasons.map((reason) => ({ value: String(reason.id), label: reason.name }))]
const reasonError = errors.reasonId === undefined ? undefined : t(errors.reasonId[0])
---

<Button variant='danger' type='button' data-booking-cancel-open>{t('booking.cancel.action')}</Button>
<dialog data-booking-cancel data-open={result === undefined ? undefined : ''} aria-labelledby='booking-cancel-title'>
  <h2 id='booking-cancel-title'>{t('booking.cancel.title')}</h2>
  <form method='POST' action={formUtils.buildFormAction(actions.account.cancelBooking, Astro.url)} novalidate>
    <input type='hidden' name='id' value={id} />
    <Select name='reasonId' label={t('booking.cancel.reason')} options={reasonOptions} value={String(sent?.get('reasonId') ?? '')} error={reasonError} required />
    {hasFailure ? <PageAlert tone='error' title={t('booking.cancel.failure')}>{t('common.failure.generic')}</PageAlert> : null}
    <Button variant='quiet' formmethod='dialog'>{t('booking.cancel.keep')}</Button>
    <Button variant='danger' type='submit'>{t('booking.cancel.confirm')}</Button>
  </form>
</dialog>

<script>
  const dialog = document.querySelector<HTMLDialogElement>('dialog[data-booking-cancel]')
  document.querySelector('[data-booking-cancel-open]')?.addEventListener('click', () => dialog?.showModal())
  if (dialog?.dataset.open !== undefined) dialog.showModal()
</script>
```

- **El `<dialog>`** se abre con `showModal()`: es lo único que pide
  JavaScript. Escape lo cierra y, al cerrarse, el foco vuelve al botón que lo
  abrió ([D12](../ux-ui/rules.md#d12-accesibilidad)). Si el sistema de diseño
  tiene su modal, es un `<dialog>` por dentro.
- **El título,** en una confirmación, es la pregunta («¿Quieres cancelar la
  reserva?»); en un formulario que pide datos, la acción.
- **El botón principal dice lo que hace** y envía a la action. Si sale bien,
  el post/redirect/get recarga la página, con el modal cerrado y su aviso
  efímero ([D4](../ux-ui/rules.md#d4-avisos-y-fallos)).
- **La salida** cierra sin enviar (`formmethod='dialog'`). Es «Cancela», o
  «Mantén la reserva» si la acción ya empieza por «Cancela», para que dos
  botones no digan lo mismo.
- **Si la action falla,** la página se pinta otra vez con `data-open` y el
  `<script>` vuelve a abrir el modal, con lo elegido, el error bajo su campo y
  el fallo al final del cuerpo ([D9](../ux-ui/rules.md#d9-modales)).
- **Una confirmación se cierra sin preguntar.** Un modal con un formulario que
  no es una confirmación pregunta antes de cerrarse con cambios por Escape o
  por su botón de cerrar: su `<script>` para el `cancel` del `<dialog>`
  (`event.preventDefault()`) y abre otro, «¿Quieres salir sin guardar?», con
  «Sigue editando» y «Descarta los cambios». Su «Cancela» cierra sin
  preguntar.
- **Va fuera del `<form>` de la página,** porque un `<form>` no va dentro de
  otro, y lo que necesita (los motivos) lo lee la página con lo demás.
- **En «Mis reservas»,** un solo modal para todas las filas: el botón de cada
  fila lleva su id (`data-booking-id`), y el `<script>` lo pone en el campo
  oculto antes de abrirlo.

## Formularios por partes

Un formulario no siempre es una pantalla con un solo «Guarda». El schema, los
campos y el envío son los de los pasos 1 a 4; cómo se ven las acciones de una
tabla y de sus filas lo dice [D8](../ux-ui/rules.md#d8-listados-y-tablas). El
ejemplo son los huéspedes de una reserva, en su pestaña (`?tab=guests`).

**Filas que se guardan una a una.** Cada fila en edición es su propio
`<form>`, con su action (`updateBookingGuest`):

- la fila que se edita va en la URL (`?tab=guests&guest=3`): su «Edita» es un
  enlace, así que solo hay una abierta a la vez;
- la fila abierta pinta sus campos, con «Cancela» (un enlace a la página sin
  `guest=`) y «Guarda», que aquí sí guarda en el servidor;
- al guardar, el post/redirect/get vuelve a la página sin `guest=`, con la
  fila cerrada; si falla, la página abre la fila que se envió (su id va en
  `sent`), con lo escrito y su error;
- quitar una fila guardada es una baja, con su modal de confirmación.

**Filas que se editan en un modal.** Si una fila tiene demasiados campos para
una celda, se lee en la tabla y se edita en un modal: su «Edita» es un enlace
a `?tab=guests&guest=3`, la página pinta el modal abierto con esa fila
([Formularios en un modal](#formularios-en-un-modal)), y su «Cancela» es un
enlace a la página sin `guest=`.

**Filas que se guardan con el formulario y asistentes.** Añadir y quitar
filas antes de «Guarda», o repartir un alta en pasos, pide estado en el
navegador: es una isla ([Con una isla](#con-una-isla)). Si la web aún no tiene
ninguna, primero se mira si basta con guardar las filas una a una, como
arriba, o con un solo formulario con sus secciones plegables.

### Con una isla

Los huéspedes de una reserva que se añaden y se quitan antes de guardarlos
van en una isla de React, `src/components/AccountBookingsEditGuestsForm.tsx`
([Añadir una isla](./add-an-island.md)). La primera isla de la web trae React
y su integración: es una dependencia nueva, con el OK de la persona. La isla
no importa el schema ni llama a la API: guarda con la action, desde el
navegador.

- La página la pinta con su directiva y lo que necesita, serializable:
  `<AccountBookingsEditGuestsForm client:visible bookingId={booking.id} guests={booking.guests} capacity={booking.capacity} />`.
- Su action, `updateBookingGuests`, va sin `accept: 'form'`: recibe JSON, con
  su schema (`accountBookingsEditGuestsFormSchema`) y la sesión y el permiso
  en el handler, como cualquier action.

Al pulsar «Guarda», la isla llama a la action y lee el resultado:

```ts
const { error } = await actions.account.updateBookingGuests({ id: bookingId, guests })
const errors = isInputError(error) ? Object.fromEntries(error.issues.map(({ path, message }) => [path.join('.'), message])) : {}
```

- **`actions` sale de `astro:actions`,** nunca de `src/actions/`: lo de
  servidor no llega al navegador.
- **Lo que manda es lo que se valida:** con JSON no hay campos vacíos que
  pasen a `null`, así que la isla manda los números como números.
- **Los errores de las filas** vienen en `error.issues`, con la ruta entera
  (`guests.2.name`); `error.fields` solo tiene el primer nivel (`guests`).
- **`UNAUTHORIZED` es que la sesión se ha cerrado:** la isla recarga la
  página, y el middleware lleva al login.
- **Mientras guarda,** la isla desactiva sus campos y sus acciones, y el
  primario lleva `loading`.
- **«Hay N campos por revisar», el fallo y el aviso efímero** los pinta la
  isla, en los mismos sitios que un formulario de página. Tras un intento con
  errores, el error de un campo se va en cuanto se cambia.
- **Los cambios sin guardar:** la isla compara sus filas con las guardadas y,
  mientras no son iguales, avisa con `beforeunload`.
- **Los textos llegan traducidos,** porque la isla no usa i18n: la página le
  pasa los suyos y los de los mensajes de error que puede recibir, por su
  clave (`errorTexts`), y la isla pinta `errorTexts[message]`.

Un asistente (un alta en varios pasos) también es una isla: lleva el paso y
lo escrito; cada paso es un componente suyo, y al cambiar de paso el foco va a
su título. La validación es la de la action, al final: si devuelve errores, la
isla vuelve al primer paso que los tiene, con «Hay N campos por revisar».
<!-- kit:end -->

## Errores comunes

| Síntoma | Causa |
|---|---|
| El envío no hace nada y `Astro.getActionResult` siempre es `undefined` | La página se genera al compilar: le falta `export const prerender = false`. |
| Un campo obligatorio vacío dice «Invalid input: expected string, received null» | Un campo vacío llega como `null`: el mensaje va también en `z.string({ error })`, no solo en `.min(1, …)`. |
| Un campo opcional vacío da error | Le falta `.optional()`: sin él, vacío llega como `null`. |
| El error sale como una clave (`common.formErrors.…`) | El formulario no traduce el mensaje con `t()`, o falta la clave en el catálogo. |
| El navegador enseña sus propios avisos («Rellena este campo») | Al `<form>` le falta `novalidate`. |
| Tras un error, el formulario se vacía y se pierde lo escrito | Los campos no parten de lo enviado: la página lee `Astro.request.formData()` y el formulario usa `sent`. |
| Al recargar después de enviar, el navegador pregunta si reenviar el formulario | No hay post/redirect/get: el middleware no redirige (303) tras un envío bueno. |
| «Hemos recibido tu mensaje» sale en cada recarga | La página no borra la cookie `saved` al leerla. |
| Llegan mensajes de spam | Falta el campo trampa, o la action no lo mira antes de mandar. |
| Un mensaje de verdad no llega y la action dice que ha ido bien | El campo trampa se ve o lo rellena el navegador: va fuera de la vista, con `tabindex='-1'` y `autocomplete='off'`. |
| En la web publicada, enviar da su fallo | Falta `MAIL_API_KEY` o `MAIL_TO` en las variables de la plataforma. |
| Un test manda un correo de verdad, o falla sin red | El envío no está simulado: `vi.spyOn(globalThis, 'fetch')` en el test de la action. |
| Un campo desaparece del envío | Está `disabled`: un campo desactivado no se envía. Lo que no se edita va como texto. |
| Salir con cambios no avisa | Falta el `<script>` del formulario, o su selector no encuentra el `<form>`. |
| Tras un envío con errores, salir no avisa | El formulario no lleva `data-unsaved` cuando se pinta con lo enviado. |
| Un texto largo se corta al pegarlo | El campo usa el `maxlength` del navegador: el máximo va en el schema. |
<!-- kit:if privateArea -->
| El modal se cierra al enviar con errores y el error no se ve | El modal no vuelve a abrirse: le falta `data-open` cuando hay resultado, o el `<script>` no llama a `showModal()`. |
| La salida del modal envía el formulario | Le falta `formmethod='dialog'`. |
| El formulario del modal no envía a su action | Está dentro del `<form>` de la página: un `<form>` no va dentro de otro. |
| Sin permiso para editar, la gestión enseña campos desactivados | En lectura, los datos van como texto, sin `<form>` ni barra. |
| La isla no puede importar el schema | Una isla no importa nada de `src/actions/`: la validación es la de la action, que devuelve los errores. |
| Los errores de las filas no salen en la isla | Se leen de `error.fields`, que solo tiene el primer nivel: van en `error.issues`, con su ruta. |
<!-- kit:end -->
