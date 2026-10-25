# Crear un formulario

Esta guía monta un formulario con react-hook-form y un schema de zod, de
principio a fin: el schema, el formulario, los campos, el envío con su
validación y el aviso de los cambios sin guardar. Es la técnica: cómo se ve y
cómo se comporta cada pantalla lo dicen las normas
[D6](../ux-ui/rules.md#d6-formularios),
[D7](../ux-ui/rules.md#d7-un-registro-una-pantalla) y
[D9](../ux-ui/rules.md#d9-modales). Sirve a quien construye el alta o la
edición de algo. Los ejemplos son el alta de un pedido, `ordersNew`, y su
gestión, `ordersEdit`, que comparten el formulario.

Después van las variantes, cada una con sus pasos: editar un registro en su
gestión, un formulario en un modal y los formularios por partes (editar las
filas de una tabla y los asistentes).

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- [1. El schema](#1-el-schema)
- [2. El formulario](#2-el-formulario)
- [3. Los campos](#3-los-campos)
- [4. Enviar el formulario](#4-enviar-el-formulario)
- [5. Los cambios sin guardar](#5-los-cambios-sin-guardar)
- [El formulario terminado](#el-formulario-terminado)
- **Editar un registro:** [1. El formulario único](#1-el-formulario-único), [2. La barra de acciones](#2-la-barra-de-acciones), [3. Las pestañas](#3-las-pestañas), [4. Las secciones plegables](#4-las-secciones-plegables), [5. Lo que actúa al momento](#5-lo-que-actúa-al-momento), [6. La lectura](#6-la-lectura)
- **Formularios en un modal:** [1. El modal con su formulario](#1-el-modal-con-su-formulario), [2. El aviso al cerrar](#2-el-aviso-al-cerrar)
- **Formularios por partes:**
  - **Editar filas de una tabla:** [1. Filas de un formulario que se guarda entero](#1-filas-de-un-formulario-que-se-guarda-entero), [2. Filas que se guardan una a una](#2-filas-que-se-guardan-una-a-una), [3. Filas que se editan en un modal](#3-filas-que-se-editan-en-un-modal)
  - **Asistentes:** [1. Los pasos](#1-los-pasos), [2. El estado y la validación](#2-el-estado-y-la-validación), [3. La barra del asistente](#3-la-barra-del-asistente), [4. La revisión y el final](#4-la-revisión-y-el-final)
- [Errores comunes](#errores-comunes)

## 1. El schema

Los schemas de los formularios de una feature van en
`schemas/<feature>FormSchema.ts`. Si lo
usan varias features de una familia, va en su `common`: el de los datos de un
pedido, `orderFormSchema.ts`, lo usan `ordersNew` y `ordersEdit`. Las
validaciones que se repiten (`requiredText`, `requiredId`, el correo, la
contraseña) están en `src/schemas/commonSchema.ts`, cada una desde que la usa
la primera feature:

```ts
import { z } from 'zod'

const REQUIRED = { error: 'common:formErrors.required', abort: true }

export const requiredText = z.string().trim().min(1, REQUIRED)

export const requiredId = z.string().min(1, REQUIRED)

export const requiredPassword = z.string().min(1, REQUIRED)
```

- **Lo obligatorio corta las demás reglas** (`abort: true`): un campo vacío
  dice solo «Este campo es obligatorio.», y no también que no cumple la regla
  que se le añade detrás (`requiredText.regex(…)`).
- **Una contraseña no se recorta:** `requiredPassword`, no `requiredText`.
- **Una regla entre campos** (el `refine` del objeto) no corre si algún campo
  ya tiene error. Si tiene que avisar igual, lleva `when`. Ni con `when` corre
  si el error es un obligatorio vacío, que lo corta todo (`abort`): entonces
  avisa cuando se rellena.
- **Una regla que compara con un valor de fuera del formulario** (la fecha
  del pedido guardado, al cerrarlo) va en el propio campo, y el schema se arma
  con ese valor, en una función: así avisa siempre, aunque falte otro campo
  (`buildOrderCloseFormSchema({ orderDate })`).

El schema de un formulario junta las validaciones y añade las reglas entre
campos. El de los datos de un pedido, con sus líneas:

```ts
import { z } from 'zod'
import { requiredId, requiredText } from '@/schemas/commonSchema'
import { ORDER_NOTES_MAX } from '../constants/orderForm'

const AMOUNT = /^(\d+([.,]\d{1,2})?)?$/

export const orderLineFormSchema = z.object({
  productId: requiredId,
  quantity: requiredText.regex(/^\d+$/, 'orders:errors.quantity'),
})

export const orderFormSchema = z
  .object({
    customerId: requiredId,
    carrierId: z.string(),
    orderDate: requiredText,
    deliveryDate: z.string(),
    shippingCost: z.string().regex(AMOUNT, 'orders:errors.amount'),
    notes: z.string().trim().max(ORDER_NOTES_MAX, 'common:formErrors.max'),
    lines: z.array(orderLineFormSchema),
  })
  .refine((order) => order.deliveryDate === '' || order.deliveryDate >= order.orderDate, {
    path: ['deliveryDate'],
    error: 'orders:errors.deliveryBeforeOrder',
  })

export type OrderFormValues = z.infer<typeof orderFormSchema>
```

- **Los mensajes de error** son claves de i18n con su namespace:
  `common:formErrors.required` o una de la familia o la feature, en su bloque
  `errors` (`orders:errors.amount`). El campo las traduce al pintarlas. Cada
  mensaje es una frase completa, con punto: qué está mal y, si cabe, cómo
  tiene que ser. Los que se repiten van en `common:formErrors`.
- **Lo que escribe el formulario es texto:** un selector guarda el id como
  texto (por eso `requiredId` es un `string`), una fecha es el `aaaa-mm-dd`
  que da su campo y se compara como texto, y un importe se guarda como se
<!-- kit:if backend -->
  escribe: el schema comprueba que es un importe y el util que monta la
  petición lo convierte a número.
<!-- kit:else -->
  escribe: el schema comprueba que es un importe y el util que arma los
  cambios lo convierte a número.
<!-- kit:end -->
- **Las fechas:** una posterior no puede ser anterior a la que la precede (el
  mismo día vale: `>=`), y el error va en la posterior. Esos límites van
  también en el calendario del campo de fecha (`min` y `max`), para que no se
  puedan elegir; el schema los sigue comprobando.
<!-- kit:if backend -->
- **Los textos se recortan** (`trim()`), y el util que monta la petición
  manda `null` si un texto queda vacío.
- **Todo texto libre tiene un máximo,** el que acepta la API. El máximo es una
  constante (`ORDER_NOTES_MAX`, en `constants/`), que usan el schema y el
  campo, para su contador. Nunca el `maxlength` del navegador, que corta sin
  avisar lo que se pega.
<!-- kit:else -->
- **Los textos se recortan** (`trim()`), y el util que arma los cambios pone
  `null` si un texto queda vacío.
- **Todo texto libre tiene un máximo.** El máximo es una constante
  (`ORDER_NOTES_MAX`, en `constants/`), que usan el schema y el campo, para su
  contador. Nunca el `maxlength` del navegador, que corta sin avisar lo que se
  pega.
<!-- kit:end -->

Su test, al lado, comprueba que acepta un formulario bueno y que el error de
uno malo sale en el campo que toca
([Escribir tests](./write-tests.md#un-schema-un-util-o-un-store)):

```ts
import { describe, expect, it } from 'vitest'
import { orderFormSchema } from './orderFormSchema'

const VALID = { customerId: '7', carrierId: '', orderDate: '2026-03-10', deliveryDate: '', shippingCost: '12,50', notes: '', lines: [] }

describe('orderFormSchema', () => {
  it('acepta un pedido sin transportista ni fecha de entrega', () => {
    expect(orderFormSchema.safeParse(VALID).success).toBe(true)
  })

  it('pone el error en la fecha de entrega si es anterior a la del pedido', () => {
    const result = orderFormSchema.safeParse({ ...VALID, deliveryDate: '2026-03-09' })

    expect(result.error?.issues.map(({ path }) => path)).toEqual([['deliveryDate']])
  })
})
```

## 2. El formulario

El formulario vive en un hook de la feature, que devuelve todo lo que
necesita el componente. Un alta parte de un formulario con sus valores por
defecto:

```ts
const form = useForm<OrderFormValues>({
  resolver: zodResolver(orderFormSchema),
  mode: 'onSubmit',
  reValidateMode: 'onChange',
  defaultValues: orderFormUtils.buildOrderFormValues(),
})
```

- **`mode` y `reValidateMode`** dicen cuándo se valida
  ([D6](../ux-ui/rules.md#d6-formularios)): nada antes del primer intento, y
  después cada campo al cambiar. Son los valores por defecto de
  react-hook-form, pero se escriben para que la regla se vea
  ([Enviar el formulario](#4-enviar-el-formulario)).
- **Los valores por defecto** van en `defaultValues`, así que no cuentan como
  cambio: un selector obligatorio con una sola opción viene elegido y una
<!-- kit:if backend -->
  fecha que registra el momento de la acción parte de hoy. Si un valor sale
  de un catálogo, el formulario se monta cuando el catálogo ha llegado.
<!-- kit:else -->
  fecha que registra el momento de la acción parte de hoy.
<!-- kit:end -->

Una edición parte del registro guardado. Una función pura,
`build<Feature><Qué>FormValues`, lo pasa a lo que escribe el formulario, y
<!-- kit:if backend -->
otra, `build<Feature><Qué>Request`, hace el camino contrario para la petición.
<!-- kit:else -->
otra, `build<Feature><Qué>Changes`, hace el camino contrario para guardarlo.
<!-- kit:end -->
Las dos van en el objeto de utils del tema
([Nomenclatura](../naming.md#ficheros)):

<!-- kit:if backend -->
```ts
import type { OrderDetail, UpdateOrderDetailRequest } from '@/services/orders/ordersEditSchema'
import type { OrderFormValues } from '../../common/schemas/orderFormSchema'

/**
 * Los valores iniciales del formulario de la gestión de un pedido.
 * @param order El pedido guardado.
 * @returns El pedido como lo escribe el formulario: los ids y las cifras, como texto, y `''` en lo vacío.
 */
function buildOrdersEditFormValues (order: OrderDetail): OrderFormValues {
  return {
    customerId: String(order.customerId),
    carrierId: order.carrierId === null ? '' : String(order.carrierId),
    orderDate: order.orderDate,
    deliveryDate: order.deliveryDate ?? '',
    shippingCost: order.shippingCost === null ? '' : String(order.shippingCost),
    notes: order.notes ?? '',
    lines: order.lines.map((line) => ({ productId: String(line.productId), quantity: String(line.quantity) })),
  }
}

/**
 * La petición que guarda el pedido con lo escrito en el formulario.
 * @param values Los valores del formulario, ya validados.
 * @returns El cuerpo de `updateOrderDetail`: los ids y las cifras, como números, y `null` en lo vacío.
 */
function buildOrdersEditRequest (values: OrderFormValues): UpdateOrderDetailRequest {
  return {
    customerId: Number(values.customerId),
    carrierId: values.carrierId === '' ? null : Number(values.carrierId),
    orderDate: values.orderDate,
    deliveryDate: values.deliveryDate === '' ? null : values.deliveryDate,
    shippingCost: values.shippingCost === '' ? null : Number(values.shippingCost.replace(',', '.')),
    notes: values.notes === '' ? null : values.notes,
    lines: values.lines.map((line) => ({ productId: Number(line.productId), quantity: Number(line.quantity) })),
  }
}

export const ordersEditValueUtils = {
  buildOrdersEditFormValues,
  buildOrdersEditRequest,
}
```

**Una edición parte de los datos del servidor al abrirse, después de su
propio guardado y después de una acción inmediata que cambia sus datos; nada
más la reinicia:**

- **Al abrirse,** la página pinta la carga hasta tener el registro recién
  pedido, no el de la caché
  ([Varios datos a la vez](./load-and-save-data.md#5-varios-datos-a-la-vez)),
  y solo entonces monta el formulario, que parte de él con `defaultValues`.
- **Una recarga en segundo plano no lo toca:** lo escrito no se pisa. Por eso
  no se usa `values`, que reinicia el formulario con cada dato nuevo y se
  lleva lo escrito, los errores e `isDirty`, también con
  `resetOptions: { keepDirtyValues: true }`.
<!-- kit:else -->
```ts
import type { OrderFormValues } from '../../common/schemas/orderFormSchema'
import type { OrderChanges, OrderRecord } from '../../common/stores/useOrderRecordsStore'

/**
 * Los valores iniciales del formulario de la gestión de un pedido.
 * @param order El pedido guardado.
 * @returns El pedido como lo escribe el formulario: los ids y las cifras, como texto, y `''` en lo vacío.
 */
function buildOrdersEditFormValues (order: OrderRecord): OrderFormValues {
  return {
    customerId: String(order.customerId),
    carrierId: order.carrierId === null ? '' : String(order.carrierId),
    orderDate: order.orderDate,
    deliveryDate: order.deliveryDate ?? '',
    shippingCost: order.shippingCost === null ? '' : String(order.shippingCost),
    notes: order.notes ?? '',
    lines: order.lines.map((line) => ({ productId: String(line.productId), quantity: String(line.quantity) })),
  }
}

/**
 * Los cambios que guardan el pedido con lo escrito en el formulario.
 * @param values Los valores del formulario, ya validados.
 * @returns Lo que recibe `updateOrder`: los ids y las cifras, como números, y `null` en lo vacío.
 */
function buildOrdersEditChanges (values: OrderFormValues): OrderChanges {
  return {
    customerId: Number(values.customerId),
    carrierId: values.carrierId === '' ? null : Number(values.carrierId),
    orderDate: values.orderDate,
    deliveryDate: values.deliveryDate === '' ? null : values.deliveryDate,
    shippingCost: values.shippingCost === '' ? null : Number(values.shippingCost.replace(',', '.')),
    notes: values.notes === '' ? null : values.notes,
    lines: values.lines.map((line) => ({ productId: Number(line.productId), quantity: Number(line.quantity) })),
  }
}

export const ordersEditValueUtils = {
  buildOrdersEditFormValues,
  buildOrdersEditChanges,
}
```

Los tipos (`OrderRecord`, el pedido como se guarda, y `OrderChanges`, lo que
cambia el formulario) los da el sitio donde la app guarda sus pedidos: en el
ejemplo, el store de la familia. Lo que la app guarda sin API se decide en
`/zaius-init` y se monta con la primera historia que lo necesita.

**Una edición parte del registro guardado al abrirse, después de su propio
guardado y después de una acción inmediata que cambia sus datos; nada más la
reinicia:**

- **Al abrirse,** la página monta el formulario con el registro, y el
  formulario parte de él con `defaultValues`.
- **Que el registro cambie mientras se edita no lo toca:** lo escrito no se
  pisa. Por eso no se usa `values`, que reinicia el formulario con cada dato
  nuevo y se lleva lo escrito, los errores e `isDirty`, también con
  `resetOptions: { keepDirtyValues: true }`.
<!-- kit:end -->
- **Tras su propio guardado,** el hook lo reinicia con `reset` y el registro
  guardado ([Enviar el formulario](#4-enviar-el-formulario)).
- **Tras una acción inmediata que cambia sus datos** (el estado, un paso sobre
  el registro), también, con el registro nuevo. Esa acción solo se ofrece sin
  cambios, así que no hay nada escrito que perder
  ([5. Lo que actúa al momento](#5-lo-que-actúa-al-momento)).

## 3. Los campos

Qué pieza lleva cada dato (un texto, un selector, una fecha) lo dice el
sistema de diseño ([Piezas por papel](../ux-ui/design-system.md#piezas-por-papel)),
y cómo se colocan y se marcan, [D6](../ux-ui/rules.md#d6-formularios). Aquí,
cómo se enlazan con el formulario:

- **`register` o `Controller`.** Los campos que son un `<input>` o un
  `<textarea>` nativos (texto, número, casilla) se enlazan con `register`.
  Los demás (un selector, una fecha, una elección múltiple) con `Controller`,
  pasando su `value`, su `onChange` y su `disabled`.
- **El error** es `error={t(mensaje)}`, con `{ max }` si el campo tiene
  máximo ([El schema](#1-el-schema)). Lo obligatorio lleva `required`.
- **Un selector opcional** lleva primero la opción vacía (valor `''`), que lo
  vacía; uno obligatorio no la lleva. Sus opciones salen de su catálogo con
  una función de la raíz (`formUtils.buildSelectOptions`, que nace con el
  primer formulario), que pone la opción vacía de un campo opcional y conserva
  el valor guardado que ya no está en el catálogo. Los ids viajan como texto.
- **Un valor guardado que ya no está en el catálogo** se enseña como «<nombre>
  (desactivado)»: se conserva mientras no se cambie y no se ofrece en la
  lista.
<!-- kit:if backend -->
- **Un selector que busca en el servidor** empieza desde 2 letras, a los
  400 ms de dejar de escribir, y solo cuenta la última respuesta: el texto va
  en la clave de la consulta.
<!-- kit:end -->
- **Lo que no se edita se enseña como lectura,** nunca como un campo
  `disabled`. `disabled` queda para lo que se activará en la misma pantalla y
  para lo que se bloquea mientras se guarda
  ([6. La lectura](#6-la-lectura)).
- **Un campo que depende de otro** aparece justo después del que lo activa.
  Oculto, no se valida (la regla del schema mira el campo que lo activa) ni se
<!-- kit:if backend -->
  envía (el util de la petición no lo manda), pero lo escrito se conserva
  mientras la pantalla está abierta: no se desregistra.
<!-- kit:else -->
  guarda (el util que arma los cambios lo deja fuera), pero lo escrito se
  conserva mientras la pantalla está abierta: no se desregistra.
<!-- kit:end -->
- **Unos campos que comparten dos formularios** (el motivo y la fecha de
  cierre, en el modal de cerrar y en la gestión) leen el formulario con
  `useFormContext`, con el tipo de su parte, y quien los monta envuelve su
  `<form>` en `FormProvider`. Por props solo reciben las opciones de sus
  selectores, y pintan sus campos sueltos, para que se coloquen en la rejilla
  de quien los monta:

```tsx
<FormProvider {...form}>
  <form noValidate onSubmit={submit}>
    <OrderClosingFields closeReasonOptions={data.closeReasonOptions} />
  </form>
</FormProvider>
```

- **Una lista de elementos** se enlaza con `useFieldArray`; con dos campos o
  más por elemento, es una tabla
  ([Editar filas de una tabla](#editar-filas-de-una-tabla)).

La entrega de un pedido lleva un selector y un importe:

```tsx
type OrderDeliveryFieldsProps = {
  form: UseFormReturn<OrderFormValues>
  carrierOptions: Array<{ value: string, label: string }>
}

export function OrderDeliveryFields ({ form, carrierOptions }: OrderDeliveryFieldsProps) {
  const { t } = useTranslation()
  const { register, control, formState } = form

  return (
    <>
      <Controller
        name='carrierId'
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label={t('orders:form.carrier')}
            options={carrierOptions}
            value={field.value}
            disabled={field.disabled}
            onChange={field.onChange}
            error={fieldState.error?.message && t(fieldState.error.message)}
          />
        )}
      />
      <TextInput
        label={t('orders:form.shippingCost')}
        suffix='€'
        error={formState.errors.shippingCost?.message && t(formState.errors.shippingCost.message)}
        {...register('shippingCost')}
      />
    </>
  )
}
```

## 4. Enviar el formulario

`form.handleSubmit` solo llama a su función si el schema da los valores por
buenos; si no, deja el error en cada campo y lleva el foco al primero. La
<!-- kit:if backend -->
función llama a la mutación con `mutate`, no con `mutateAsync`: `mutate` no
lanza, y el fallo queda en el error de la mutación, de donde el hook saca el
aviso ([El fallo del guardado](./load-and-save-data.md#2-el-fallo-del-guardado)).
<!-- kit:else -->
función pasa los valores, ya validados, a lo que decidió la historia para
guardarlos: en el ejemplo, la acción `updateOrder` del store de los pedidos.
<!-- kit:end -->

**Cuándo se valida** ([D6](../ux-ui/rules.md#d6-formularios)):

- **Nada antes del primer intento:** guardar, continuar o el botón del modal.
  Es `mode: 'onSubmit'`.
- **Después, cada campo se revalida al cambiar,** y su error se va en cuanto
  se corrige. Es `reValidateMode: 'onChange'`, que react-hook-form aplica
  desde el primer `handleSubmit`. «Continúa» de un asistente valida con
  `trigger`, que no cuenta como envío, así que el asistente revalida por su
  cuenta ([El estado y la validación](#2-el-estado-y-la-validación)).
- **Una regla entre dos campos revalida los dos:** el campo que no lleva el
  error declara al otro en `deps`. Al cambiar la fecha del pedido, se revalida
  la de entrega:

```tsx
<Controller
  name='orderDate'
  control={control}
  rules={{ deps: ['deliveryDate'] }}
  render={({ field, fieldState }) => (
    <DateInput
      label={t('orders:form.orderDate')}
      value={field.value}
      disabled={field.disabled}
      onChange={field.onChange}
      error={fieldState.error?.message && t(fieldState.error.message)}
    />
  )}
/>
```

<!-- kit:if backend -->
- **Lo que solo comprueba la API** se ve al enviar. Si es de un campo (un
  número de pedido repetido), el hook lo pone en ese campo con
  `form.setError`, como un error de zod; si no, va en el aviso de fallo.
<!-- kit:end -->
- **«Hay N campos por revisar»** sale en la barra de toda pantalla de
  formulario (una edición, un asistente, un alta de un paso) después de un
  intento con errores. Se actualiza al corregir y desaparece al llegar a cero.
  En un modal no sale, porque todos sus campos están a la vista. El hook da el
  recuento (`reviewCount`) solo después de un intento, con una función de la
  raíz que cuenta los errores (`formUtils.countErrors`).

<!-- kit:if backend -->
**Mientras se guarda,** el primario lleva `loading` y los campos y las
acciones del formulario se desactivan ([D5](../ux-ui/rules.md#d5-acciones)):
`disabled` en `useForm` desactiva todos los campos (un `Controller` lo recibe
en `field.disabled`), y las demás acciones (la salida de la barra, añadir y
quitar filas) reciben `disabled={saving}`. Así nada de lo que se escriba se
pierde al llegar la respuesta.
<!-- kit:else -->
**Si guardar lleva un tiempo** (según dónde guarde la app), mientras dura, el
primario lleva `loading` y los campos y las acciones del formulario se
desactivan ([D5](../ux-ui/rules.md#d5-acciones)): `disabled` en `useForm`
desactiva todos los campos (un `Controller` lo recibe en `field.disabled`), y
las demás acciones (la salida de la barra, añadir y quitar filas) reciben el
mismo `disabled`. Así nada de lo que se escriba se pierde al acabar.
<!-- kit:end -->

**Enter no envía** una edición, un asistente ni un formulario en línea: el
`<form>` no guarda en su `onSubmit`, y el primario llama al envío al pulsarlo.

El de la gestión de un pedido:

<!-- kit:if backend -->
```ts
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { OrderDetail } from '@/services/orders/ordersEditSchema'
import { ORDER_ERROR_CODE } from '@/services/orders/ordersSchema'
import { apiErrorUtils } from '@/utils/apiErrorUtils'
import { formUtils } from '@/utils/formUtils'
import { orderFormSchema } from '../../common/schemas/orderFormSchema'
import type { OrderFormValues } from '../../common/schemas/orderFormSchema'
import { ordersEditValueUtils } from '../utils/ordersEditValueUtils'
import { useOrdersEditUpdate } from './useOrdersEditUpdate'

/**
 * El formulario de la gestión de un pedido y su guardado.
 * @param id Id del pedido.
 * @param order El pedido, recién pedido al servidor.
 * @returns `form`, `save` (el envío), `saving`, `reviewCount` y `failure`, la descripción del último fallo o `null`.
 */
export function useOrdersEditForm (id: number, order: OrderDetail) {
  const { t } = useTranslation()
  const { showNotice } = useEphemeralNotice()
  const update = useOrdersEditUpdate(id)
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: ordersEditValueUtils.buildOrdersEditFormValues(order),
    disabled: update.isPending,
  })

  const save = form.handleSubmit((values) => {
    update.mutate(ordersEditValueUtils.buildOrdersEditRequest(values), {
      onSuccess: (saved) => {
        form.reset(ordersEditValueUtils.buildOrdersEditFormValues(saved))
        showNotice({ title: t('ordersEdit:saved') })
      },
    })
  })

  const isShipped = apiErrorUtils.isApiError(update.error) && update.error.code === ORDER_ERROR_CODE.alreadyShipped
  const failure = t(isShipped ? 'ordersEdit:failure.shipped' : `common:failure.${apiErrorUtils.getRequestFailure(update.error)}`)
  const reviewCount = form.formState.submitCount > 0 ? formUtils.countErrors(form.formState.errors) : 0

  return { form, save, saving: update.isPending, reviewCount, failure: update.isError ? failure : null }
}
```

`useEphemeralNotice` es, por su papel, el aviso efímero del sistema de
diseño.

- **Tras guardar, el formulario parte del registro guardado:** la mutación
  devuelve el pedido pedido de nuevo al servidor
  ([El guardado](./load-and-save-data.md#1-el-guardado)), y `reset` lo
  pone como punto de partida. El formulario vuelve a estar sin cambios
  (`isDirty` es `false`) y sin intentos, así que nada se valida hasta el
  siguiente.
- **`saving` dura hasta que llega el registro nuevo,** porque la mutación no
  acaba antes. El aviso efímero sale con el formulario ya limpio.
- **El fallo** tiene un título fijo, de la zona («No se ha podido guardar el
  pedido»), y la descripción que da el hook: la de un código concreto de la
  API (`alreadyShipped`) o la común, sin conexión o cualquier otro fallo
  ([El fallo del guardado](./load-and-save-data.md#2-el-fallo-del-guardado)).
<!-- kit:else -->
```ts
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { formUtils } from '@/utils/formUtils'
import { orderFormSchema } from '../../common/schemas/orderFormSchema'
import type { OrderFormValues } from '../../common/schemas/orderFormSchema'
import { useOrderRecordsStore } from '../../common/stores/useOrderRecordsStore'
import type { OrderRecord } from '../../common/stores/useOrderRecordsStore'
import { ordersEditValueUtils } from '../utils/ordersEditValueUtils'

/**
 * El formulario de la gestión de un pedido y su guardado.
 * @param order El pedido guardado.
 * @returns `form`, `save` (el envío) y `reviewCount`.
 */
export function useOrdersEditForm (order: OrderRecord) {
  const { t } = useTranslation()
  const { showNotice } = useEphemeralNotice()
  const updateOrder = useOrderRecordsStore((state) => state.updateOrder)
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: ordersEditValueUtils.buildOrdersEditFormValues(order),
  })

  const save = form.handleSubmit((values) => {
    const saved = updateOrder(order.id, ordersEditValueUtils.buildOrdersEditChanges(values))
    form.reset(ordersEditValueUtils.buildOrdersEditFormValues(saved))
    showNotice({ title: t('ordersEdit:saved') })
  })

  const reviewCount = form.formState.submitCount > 0 ? formUtils.countErrors(form.formState.errors) : 0

  return { form, save, reviewCount }
}
```

`useEphemeralNotice` es, por su papel, el aviso efímero del sistema de
diseño.

- **Tras guardar, el formulario parte del registro guardado:** `updateOrder`
  devuelve el pedido como ha quedado, y `reset` lo pone como punto de
  partida. El formulario vuelve a estar sin cambios (`isDirty` es `false`) y
  sin intentos, así que nada se valida hasta el siguiente.
- **El aviso efímero** sale después, con el formulario ya limpio.
<!-- kit:end -->

## 5. Los cambios sin guardar

Un formulario con cambios avisa antes de salir de la pantalla
([D6](../ux-ui/rules.md#d6-formularios)). Lo hacen dos piezas de la raíz,
que nacen con el primer formulario: un hook que para la salida y un
componente que pregunta.

```ts
import { useEffect } from 'react'
import { useBlocker } from 'react-router'

/**
 * Para la salida de la pantalla mientras hay cambios sin guardar: la navegación de la app, con el bloqueo del router, y cerrar o recargar la pestaña, con el aviso del navegador.
 * @param when Si hay algo que se perdería al salir.
 * @returns El bloqueo del router: `state` es `blocked` mientras se pregunta, y `proceed` y `reset` deciden.
 */
export function useUnsavedChangesBlocker (when: boolean) {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => when && currentLocation.pathname !== nextLocation.pathname)

  useEffect(() => {
    if (!when) return
    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [when])

  return blocker
}
```

```tsx
type UnsavedChangesGuardProps = {
  when: boolean
}

export function UnsavedChangesGuard ({ when }: UnsavedChangesGuardProps) {
  const blocker = useUnsavedChangesBlocker(when)
  const isAsking = blocker.state === 'blocked'

  return <UnsavedChangesPromptModal open={isAsking} onKeep={() => blocker.reset?.()} onDiscard={() => blocker.proceed?.()} />
}
```

`UnsavedChangesPromptModal` (raíz, `components/`) pinta la pregunta en un
modal: «¿Quieres salir sin guardar?», con «Sigue editando» y «Descarta los
cambios». La usan también los modales con formulario
([El aviso al cerrar](#2-el-aviso-al-cerrar)).

- **Cuentan todos los cambios de la pantalla:** el formulario
  (`formState.isDirty`), una fila en edición con cambios, un comentario a
  medio escribir y una subida en curso, que se cancela si se sale. En un
  asistente, el `unsaved` de su hook.
- **Si se intenta salir a otra pantalla,** también con la salida de la barra,
  pregunta. Cambiar de pestaña (`?tab=`) no es salir: el bloqueo solo mira la
  ruta.
- **Si se cierra o se recarga la pestaña del navegador,** avisa el navegador,
  con su propio texto (`beforeunload`).
<!-- kit:if backend -->
- **Si la sesión caduca,** la app va a la entrada sin preguntar: el bloqueo
  deja pasar esa navegación.
<!-- kit:end -->
- **La salida de una fila, un formulario en línea o un modal** cierra sin
  preguntar: pulsarla ya es una decisión.
- **Lo escrito no se guarda en el navegador** (no hay borradores), y recargar
  empieza de cero.

La página lo monta junto al `<form>`, como en
[la barra de acciones](#2-la-barra-de-acciones) de la gestión de un registro.
`useBlocker` necesita el router de datos de la app.
Por eso una pantalla con el aviso se prueba con `testUtils.renderPage`
([Escribir tests](./write-tests.md#una-página)).

## El formulario terminado

Con las piezas que nombra esta guía, un formulario queda repartido así:

| Pieza | Dónde |
|---|---|
| El schema | `schemas/<feature>FormSchema.ts` (o el `common` de la familia, `orderFormSchema.ts`), con las validaciones de `src/schemas/commonSchema.ts` |
| Los máximos de los textos | `constants/` (`ORDER_NOTES_MAX`) |
<!-- kit:if backend -->
| Los valores iniciales y la petición | Dos funciones puras del objeto de utils del tema (`ordersEditValueUtils`): `build<Feature><Qué>FormValues` y `build<Feature><Qué>Request` |
| El formulario y su envío | Un hook de la feature, como `useOrdersEditForm` |
| La mutación | Su propio hook (`useOrdersEditUpdate`), como en [El guardado](./load-and-save-data.md#1-el-guardado) |
<!-- kit:else -->
| Los valores iniciales y los cambios que se guardan | Dos funciones puras del objeto de utils del tema (`ordersEditValueUtils`): `build<Feature><Qué>FormValues` y `build<Feature><Qué>Changes` |
| El formulario y su envío | Un hook de la feature, como `useOrdersEditForm` |
| Dónde se guarda | Lo que decidió la historia; en el ejemplo, la acción `updateOrder` del store de los pedidos (`useOrderRecordsStore`) |
<!-- kit:end -->
| Los campos | Componentes de la feature o, si los comparten varias, de su `common`, como `OrderDeliveryFields` |
| El aviso de cambios sin guardar | `UnsavedChangesGuard` en la página |

## Editar un registro

Esta parte monta el formulario de la gestión de un registro, su única
pantalla: `<familia>Edit` en `/<familia>/:id/edit` (`ordersEdit`,
[Nomenclatura](../naming.md#familias-y-features)). Se llega a ella con
<!-- kit:if backend -->
«Gestiona», desde su fila, también sin permiso para editar: entonces se abre
en lectura ([6. La lectura](#6-la-lectura)). Cómo es la pantalla lo dice
<!-- kit:else -->
«Gestiona», desde su fila, también si su estado no deja editarlo: entonces se
abre en lectura ([6. La lectura](#6-la-lectura)). Cómo es la pantalla lo dice
<!-- kit:end -->
[D7](../ux-ui/rules.md#d7-un-registro-una-pantalla); lo propio del
formulario viene en estos pasos.

### 1. El formulario único

Un solo formulario con todo lo que se edita del registro, repartido en
pestañas y en secciones, y un solo «Guarda». Es el mismo formulario que el
alta del registro: el mismo schema, las mismas secciones, el mismo orden y las
mismas piezas de la familia; solo cambian los campos que existen en una de
las dos ([D6](../ux-ui/rules.md#d6-formularios)).

- **Las pestañas** van en `?tab=`, y la primera no lleva parámetro
  ([3. Las pestañas](#3-las-pestañas)): un enlace desde otra pantalla abre la
  que toca.
<!-- kit:if backend -->
- **El formulario parte del registro recién pedido** y solo se reinicia tras
<!-- kit:else -->
- **El formulario parte del registro guardado** y solo se reinicia tras
<!-- kit:end -->
  su propio guardado o tras una acción inmediata que cambia sus datos
  ([El formulario](#2-el-formulario)).
- **Lo guardado que ya no cumple las reglas** se marca al abrir: el hook
  valida una vez lo que llega (`trigger()`, sin mover el foco) y, desde ahí,
  revalida al cambiar, como un asistente tras «Continúa»
  ([El estado y la validación](#2-el-estado-y-la-validación)).
- **Lo que actúa al momento** (el estado, los pasos sobre el registro, sus
  documentos) no es parte del formulario
  ([5. Lo que actúa al momento](#5-lo-que-actúa-al-momento)).
<!-- kit:if backend -->
- **Lo que el permiso o el estado no deja editar** se enseña como lectura
  ([6. La lectura](#6-la-lectura)).
<!-- kit:else -->
- **Lo que el estado no deja editar** se enseña como lectura
  ([6. La lectura](#6-la-lectura)).
<!-- kit:end -->

### 2. La barra de acciones

La barra de acciones va fija al pie en todas las pestañas y lleva, de
izquierda a derecha:

- **la ayuda (`hint`),** que dice una sola cosa, la primera que toque: «Hay N
  campos por revisar» (`reviewCount`) después de un intento con errores; lo
  que impide guardar (otra edición abierta) y, con cambios sin guardar, «Hay
  cambios sin guardar» o, si esos cambios desactivan algo inmediato, por qué;
- **la salida,** la única forma de volver. Lleva a donde se estaba: el hook de
  la página da `back`, con el texto y la ruta del origen que trae el estado de
  navegación; sin origen, la lista de la familia
  ([D10](../ux-ui/rules.md#d10-navegación));
- **«Guarda»,** el primario, desactivado sin cambios o si una regla no deja
  guardar, con la causa a la vista. Al pulsarlo llama a `save`, porque el
  `<form>` no envía con Enter.

<!-- kit:if backend -->
Mientras guarda, «Guarda» lleva `loading` y la salida se desactiva. El aviso
de fallo sale encima de la barra y se sigue en la gestión, con el foco en
«Guarda» y el formulario partiendo de lo guardado. Sin permiso para editar no
hay nada que guardar, así que tampoco hay barra:

```tsx
const hasReview = reviewCount > 0
const isDirty = form.formState.isDirty
const hasFailure = failure !== null
const hint = hasReview ? t('common:form.review', { count: reviewCount }) : isDirty ? t('common:form.unsaved') : undefined

<form noValidate onSubmit={(event) => event.preventDefault()}>
  <OrdersEditTabs form={form} />
  {canEdit
    ? (
      <>
        {hasFailure ? <PageAlert tone='error' title={t('ordersEdit:failure.title')}>{failure}</PageAlert> : null}
        <ActionBar hint={hint}>
          <Button variant='quiet' href={back.to} disabled={saving}>{back.label}</Button>
          <Button loading={saving} disabled={!isDirty || saveBlocked} onClick={save}>{t('common:actions.save')}</Button>
        </ActionBar>
      </>
      )
    : null}
</form>
<UnsavedChangesGuard when={isDirty} />
```
<!-- kit:else -->
Al guardar, se sigue en la gestión, con el foco en «Guarda» y el formulario
partiendo de lo guardado. Si el estado del registro no deja editar nada
(`canEdit` es `false`), no hay nada que guardar, así que tampoco hay barra:

```tsx
const hasReview = reviewCount > 0
const isDirty = form.formState.isDirty
const hint = hasReview ? t('common:form.review', { count: reviewCount }) : isDirty ? t('common:form.unsaved') : undefined

<form noValidate onSubmit={(event) => event.preventDefault()}>
  <OrdersEditTabs form={form} />
  {canEdit
    ? (
      <ActionBar hint={hint}>
        <Button variant='quiet' href={back.to}>{back.label}</Button>
        <Button disabled={!isDirty || saveBlocked} onClick={save}>{t('common:actions.save')}</Button>
      </ActionBar>
      )
    : null}
</form>
<UnsavedChangesGuard when={isDirty} />
```
<!-- kit:end -->

`saveBlocked` lo da el hook del formulario: desactiva «Guarda» si una regla
no deja guardar (otra edición abierta).

### 3. Las pestañas

Una función de la raíz, `useTabs` (`src/hooks/`, que nace con la primera
gestión con pestañas), guarda la pestaña abierta en `?tab=`, con `replace`: la
<!-- kit:if backend -->
primera no lleva parámetro, y una `?tab=` que no existe, o que la persona no
puede ver, abre la primera
<!-- kit:else -->
primera no lleva parámetro, y una `?tab=` que no existe abre la primera
<!-- kit:end -->
([Normativa](../standards.md#rutas-permisos-y-navegación)). Como el formulario
es uno solo para todas, `handleSubmit` recibe también qué hacer con los
errores: abre la primera pestaña que los tiene, y el foco va a su primer
campo.

```ts
const { tab, setTab } = useTabs(ORDERS_EDIT_TABS)

const save = form.handleSubmit(submit, (errors) => {
  setTab(ordersEditTabUtils.getOrdersEditFirstTabWithErrors(errors) ?? tab)
})
```

- **Las pestañas del formulario quedan montadas,** ocultas, al cambiar de
  pestaña, para no perder lo escrito ni el registro de sus campos.
- **Cada pestaña con errores lleva su marca,** sin recuento, y «con errores»
  en su nombre accesible ([D12](../ux-ui/rules.md#d12-accesibilidad)).
- **Qué pestaña tiene cada campo** lo sabe la feature, en una constante
  (`ORDERS_EDIT_TAB_FIELDS`, en `constants/`), y lo lee su util.

### 4. Las secciones plegables

Con tres secciones o más, cada una es una tarjeta plegable, como un acordeón
([D6](../ux-ui/rules.md#d6-formularios)). La página sabe cuáles ha plegado la
persona con `useCollapsibleSections` (raíz, `hooks/`, que nace con el primer
formulario en acordeón): al entrar no hay ninguna, así que todas salen
abiertas. Al guardar con errores, se despliegan las que los tienen antes de
llevar el foco al primero, porque un campo plegado no se puede enfocar. Lo
mismo vale al pulsar «Continúa» en un paso de un asistente:

```ts
const sections = useCollapsibleSections<OrdersEditSection>()

const save = form.handleSubmit(submit, (errors) => {
  setTab(ordersEditTabUtils.getOrdersEditFirstTabWithErrors(errors) ?? tab)
  sections.open(ordersEditTabUtils.getOrdersEditSectionsWithErrors(errors))
})
```

```tsx
<Card collapsible {...sections.cardProps('delivery')} title={t('orders:delivery.title')}>
  <OrderDeliveryFields form={form} carrierOptions={carrierOptions} />
</Card>
```

`cardProps` da a la tarjeta `open` y `onOpenChange`. Los campos de la
entrega son `OrderDeliveryFields`, de la familia, los mismos en el alta
([El formulario único](#1-el-formulario-único)).

### 5. Lo que actúa al momento

Lo que actúa al momento no espera a «Guarda» ni pasa por el formulario
([D7](../ux-ui/rules.md#d7-un-registro-una-pantalla)): el estado del
registro, los pasos sobre él (cerrar o cancelar un pedido) y sus documentos.

<!-- kit:if backend -->
- **Cada uno es su propia mutación,** con su modal si pide datos o una
<!-- kit:else -->
- **Cada uno se guarda por su cuenta,** con su modal si pide datos o una
<!-- kit:end -->
  confirmación ([Formularios en un modal](#formularios-en-un-modal)). Si
  falla una acción sin modal, el aviso va donde dice
  [D4](../ux-ui/rules.md#d4-avisos-y-fallos), nombrando el registro.
- **Con cambios sin guardar, lo que cambia datos del formulario se
  desactiva,** y la causa se ve sin pasar el ratón: en la ayuda de la barra
  («Guarda los cambios para cambiar el estado») o bajo el botón, con la nota
  que lo acompaña. Lo que no toca el formulario (los documentos) sigue, y lo
  escrito se queda como estaba.
- **Tras una acción que cambia sus datos,** el formulario, que no tenía
  cambios, parte del registro nuevo ([El formulario](#2-el-formulario)).
- **Un comentario a medio escribir o una subida en curso** cuentan para el
  aviso de cambios sin guardar
  ([Los cambios sin guardar](#5-los-cambios-sin-guardar)).

### 6. La lectura

Cuando no se puede editar, la gestión se abre igual, y lo dice un aviso bajo
la cabecera que no se cierra
([D7](../ux-ui/rules.md#d7-un-registro-una-pantalla)):

<!-- kit:if backend -->
- **Sin permiso** (puede ver, pero no editar): todo va en lectura, con el
  aviso «No puedes editar este pedido», con «Tienes permiso para consultarlo,
  pero no para editarlo.». Lo decide la regla `canEdit` de la feature
  ([Aplicar permisos](./apply-permissions.md#6-las-zonas-de-la-pantalla)).
<!-- kit:end -->
- **Por el estado:** el aviso dice qué se puede hacer («Este pedido ya ha
  salido del almacén», con «Solo se puede editar la fecha de entrega.»). Lo
  que el estado deja editar sigue en el formulario, y lo demás va en lectura.
- **En lectura,** cada pestaña enseña sus datos como texto, en las mismas
  tarjetas, nunca con campos `disabled` ([Los campos](#3-los-campos)).
- **Sin nada que guardar no hay barra:** se vuelve con la vuelta encima del
  título, con el mismo destino que tendría la salida de la barra.
<!-- kit:if backend -->
- **Lo inmediato que el permiso o el estado deja** sigue: descargar un
  documento.
<!-- kit:else -->
- **Lo inmediato que el estado deja** sigue: descargar un documento.
<!-- kit:end -->

## Formularios en un modal

Esta parte monta una acción que pide datos antes de hacerse (cerrar un pedido
con su motivo, cancelarlo) como un modal con un formulario. Un modal decide o
pide lo mínimo; lo que se lee no va en un modal, sino en su sitio
([D9](../ux-ui/rules.md#d9-modales)).

### 1. El modal con su formulario

El hook sigue [Enviar el formulario](#4-enviar-el-formulario); el modal pinta
sus campos y sus acciones ([D9](../ux-ui/rules.md#d9-modales)):

- **El título:** en una confirmación, la pregunta («¿Quieres cancelar el
  pedido?»); en un formulario que pide datos, la acción («Añade una línea»).
<!-- kit:if backend -->
- **El botón principal dice lo que hace:** «Guarda» solo si guarda en el
  servidor. Si devuelve lo escrito a un formulario, que se guarda luego con
<!-- kit:else -->
- **El botón principal dice lo que hace:** «Guarda» solo si lo deja
  guardado. Si devuelve lo escrito a un formulario, que se guarda luego con
<!-- kit:end -->
  su «Guarda», es «Añade …» o «Aplica …»
  ([Filas que se editan en un modal](#3-filas-que-se-editan-en-un-modal)).
- **La salida** es «Cancela». Si la acción ya empieza por «Cancela» («Cancela
  el pedido»), la salida es «Mantén el pedido», para que dos botones no digan
  lo mismo.
<!-- kit:if backend -->
- **Si necesita cargar algo** (los motivos), se abre ya con la carga dentro y,
  si falla, con el estado de error y su reintento. No se cambia por otro
  modal.
- **Mientras su acción está en curso,** `busy` bloquea el modal entero (su botón
  de cerrar y Escape), el botón lleva `loading`, la salida se desactiva y los
  campos también (`disabled` en `useForm`).
<!-- kit:else -->
- **Si su acción lleva un tiempo,** mientras dura, `busy` bloquea el modal
  entero (su botón de cerrar y Escape), el botón lleva `loading`, la salida se
  desactiva y los campos también (`disabled` en `useForm`).
<!-- kit:end -->
- **Si su acción falla,** el aviso va al final del cuerpo, encima del pie, y
  el modal sigue abierto con lo escrito.
- **Enter** envía con el botón principal: el cuerpo es un `<form noValidate>`
  con el mismo envío que el botón. Al cerrarse, el foco vuelve al botón que lo
  abrió ([D12](../ux-ui/rules.md#d12-accesibilidad)).
<!-- kit:if backend -->
- **Si el formulario parte de lo que carga** (el de cerrar, del pedido recién
  pedido), no se puede montar con sus `defaultValues` al abrirse. El hook
  guarda una foto de los valores iniciales la primera vez que llega todo y se
  la da a `useForm` en `values`; como la foto ya no cambia, el formulario se
  rellena una sola vez y una recarga no pisa lo escrito:

```ts
const [initialValues, setInitialValues] = useState<OrderCloseFormValues>()
if (initialValues === undefined && data !== undefined) setInitialValues(orderCloseUtils.buildOrderCloseFormValues(data.order))
const form = useForm<OrderCloseFormValues>({ resolver, mode: 'onSubmit', reValidateMode: 'onChange', values: initialValues, disabled: close.isPending })
```
<!-- kit:end -->

El de cancelar un pedido es de la familia (`orders/common`), porque lo abren
la gestión del pedido y el listado:

<!-- kit:if backend -->
```tsx
export function OrderCancelModal ({ id, onClose }: OrderCancelModalProps) {
  const { t } = useTranslation()
  const { reasonOptions, form, submit, cancelling, failure } = useOrderCancelForm(id, onClose)
  const isLoadingReasons = reasonOptions === undefined
  const hasFailure = failure !== null

  return (
    <Modal
      open
      busy={cancelling}
      title={t('orders:cancel.title')}
      onClose={onClose}
      actions={[
        { label: t('orders:cancel.keep'), variant: 'quiet', onClick: onClose },
        { label: t('orders:cancel.confirm'), variant: 'danger', loading: cancelling, disabled: isLoadingReasons, onClick: submit },
      ]}
    >
      <form noValidate onSubmit={submit}>
        {isLoadingReasons ? <LoadingSkeleton /> : <OrderCancelReasonField form={form} options={reasonOptions} />}
        {hasFailure ? <PageAlert tone='error' title={t('orders:cancel.failure')}>{failure}</PageAlert> : null}
      </form>
    </Modal>
  )
}
```

- **Se monta solo mientras está abierto:** quien lo abre lo pinta con el
  registro elegido (`{isCancelling ? <OrderCancelModal id={cancelling} onClose={…} /> : null}`),
  y el modal va siempre `open`. Así pide lo suyo al abrirse y empieza limpio
  cada vez.
- **Es una confirmación** (su título es «¿Quieres…?»): se cierra sin
  preguntar, aunque se haya elegido un motivo. Cerrarla ya es la respuesta.
- **El aviso efímero** sale al cerrarse bien, en el `onSuccess` de `mutate`
  ([D4](../ux-ui/rules.md#d4-avisos-y-fallos)).
<!-- kit:else -->
```tsx
export function OrderCancelModal ({ id, onClose }: OrderCancelModalProps) {
  const { t } = useTranslation()
  const { reasonOptions, form, submit } = useOrderCancelForm(id, onClose)

  return (
    <Modal
      open
      title={t('orders:cancel.title')}
      onClose={onClose}
      actions={[
        { label: t('orders:cancel.keep'), variant: 'quiet', onClick: onClose },
        { label: t('orders:cancel.confirm'), variant: 'danger', onClick: submit },
      ]}
    >
      <form noValidate onSubmit={submit}>
        <OrderCancelReasonField form={form} options={reasonOptions} />
      </form>
    </Modal>
  )
}
```

- **Los motivos son un dato fijo:** una constante de `orders/common`
  (`ORDER_CANCEL_REASONS`, en `constants/`), así que el modal los tiene al
  abrirse.
- **Se monta solo mientras está abierto:** quien lo abre lo pinta con el
  registro elegido (`{isCancelling ? <OrderCancelModal id={cancelling} onClose={…} /> : null}`),
  y el modal va siempre `open`. Así empieza limpio cada vez.
- **Es una confirmación** (su título es «¿Quieres…?»): se cierra sin
  preguntar, aunque se haya elegido un motivo. Cerrarla ya es la respuesta.
- **El aviso efímero** sale al cerrarse bien, después de guardar
  ([D4](../ux-ui/rules.md#d4-avisos-y-fallos)).
<!-- kit:end -->

### 2. El aviso al cerrar

Un modal no navega, así que avisa él mismo. Una confirmación no pregunta nunca.
Un modal con un formulario que no es una confirmación (el de añadir una línea)
pregunta con `UnsavedChangesPromptModal` solo si se cierra con cambios por su
botón de cerrar, Escape o pulsando fuera; su «Cancela» es una decisión y cierra
sin preguntar ([D9](../ux-ui/rules.md#d9-modales)). Por eso el `onClose` del
modal (su botón de cerrar, Escape y fuera) pasa a ser `handleClose`, y «Cancela»
llama a `onClose` directamente:

```tsx
const [asking, setAsking] = useState(false)

function handleClose () {
  if (form.formState.isDirty) setAsking(true)
  else onClose()
}

<>
  <Modal open title={title} onClose={handleClose} actions={actions}>
    …
  </Modal>
  <UnsavedChangesPromptModal open={asking} onKeep={() => setAsking(false)} onDiscard={onClose} />
</>
```

En `actions`, la salida es `{ …, onClick: onClose }` y el principal,
`{ …, onClick: submit }`.

## Formularios por partes

Un formulario no siempre es una pantalla con un solo «Guarda». Esta parte
explica las dos formas de repartirlo: corregir las filas de una tabla y dar
de alta en varios pasos. El schema, los campos y el envío son los de los
pasos 1 a 4 de esta guía, desde [El schema](#1-el-schema).

### Editar filas de una tabla

En una tabla cuyas filas se corrigen hay tres formas, según cómo se guarda lo
que se escribe y cuánto cabe en una celda: la del primer paso, si lo escrito
se guarda con el «Guarda» del formulario; la del segundo, si cada fila se
guarda sola, y la del tercero, si se guarda con el «Guarda» pero la fila
tiene demasiados campos para una celda. Cómo se ven las acciones de la tabla
y de sus filas lo dice [D8](../ux-ui/rules.md#d8-listados-y-tablas).

#### 1. Filas de un formulario que se guarda entero

Las filas de un formulario que se guarda entero (las líneas de un pedido)
llevan los campos en la celda, siempre abiertos, enlazados al formulario con
`useFieldArray`:

- **quitar una fila** va en sus acciones, con solo el verbo, y su nombre
  accesible nombra la fila. No pide confirmación: nada se guarda hasta
  «Guarda». El foco pasa a la misma acción de la fila siguiente, o a «Añade…»
  si era la última;
- **añadir una fila** va en la cabecera de la tabla, la última de sus
  acciones;
- **no hay fila en edición:** lo escrito se guarda con el «Guarda» del
  formulario.

Las líneas de un pedido, en el hook que prepara su tabla. La clave de cada
fila es la que pone `useFieldArray` (`keyName`), y cada celda enlaza su campo
por su posición:

```tsx
const { t } = useTranslation()
const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lines', keyName: 'key' })

const columns = [
  {
    key: 'quantity',
    header: t('orders:lines.quantity'),
    render: (line: OrderLineRow) => (
      <TextInput
        aria-label={t('orders:lines.quantityOf', { number: fields.indexOf(line) + 1 })}
        {...form.register(`lines.${fields.indexOf(line)}.quantity`)}
      />
    ),
  },
]

return {
  columns,
  rows: fields,
  rowKey: (line: OrderLineRow) => line.key,
  rowActions: (line: OrderLineRow) => [
    { label: t('common:actions.remove'), ariaLabel: t('orders:lines.removeOf', { number: fields.indexOf(line) + 1 }), disabled: saving, onClick: () => remove(fields.indexOf(line)) },
  ],
  add: { label: t('orders:lines.add'), disabled: saving, onClick: () => append({ productId: '', quantity: '1' }) },
}
```

#### 2. Filas que se guardan una a una

<!-- kit:if backend -->
Si cada fila se guarda sola en el servidor, la tabla marca la fila que se
edita:
<!-- kit:else -->
Si cada fila se guarda sola, la tabla marca la fila que se edita:
<!-- kit:end -->

- cada fila lleva «Edita» en sus acciones; quitar una fila guardada es una
  baja, con su confirmación ([D9](../ux-ui/rules.md#d9-modales));
- añadir una fila va en la cabecera de la tabla, como arriba;
- la fila que se edita pinta sus campos, y «Cancela» y «Guarda» ocupan el
<!-- kit:if backend -->
  sitio de sus acciones. Aquí sí es «Guarda», porque guarda la fila en el
  servidor;
<!-- kit:else -->
  sitio de sus acciones. Aquí sí es «Guarda», porque guarda la fila;
<!-- kit:end -->
- lo que se escribe en la fila es un formulario propio de la fila, con su
  schema, no el de la pantalla: valida al pulsar «Guarda» y, mientras guarda,
  sus campos se desactivan ([Enviar el formulario](#4-enviar-el-formulario));
- hay una sola edición abierta a la vez: con una fila en edición, las demás
  acciones de la tabla y de la pantalla se desactivan;
- «Cancela» y Escape cancelan sin preguntar, y Enter no envía;
- si falla, la fila sigue en edición con lo escrito;
- una fila con cambios cuenta para el aviso de los cambios sin guardar.

#### 3. Filas que se editan en un modal

Cuando una fila tiene demasiados campos para una celda, se guarda con el
«Guarda» del formulario, como en el primer paso, pero se lee en la tabla y se
edita en un modal:

- «Edita» y «Quita» van en las acciones de la fila, y añadir abre el mismo
  modal;
- el modal es un formulario propio (`OrderLineModal`, de la familia) que
  recibe la fila y devuelve los valores validados; no se cierra solo, lo
  cierra quien lo abre;
- su botón principal no es «Guarda», porque no guarda nada: «Añade la línea»
  al añadir y «Aplica los cambios» al editar
  ([D9](../ux-ui/rules.md#d9-modales));
- su «Cancela» cierra sin preguntar ([El aviso al cerrar](#2-el-aviso-al-cerrar));
- la tabla aplica lo que devuelve con `update` o `append` del
  `useFieldArray` del formulario, y nada se guarda hasta «Guarda».

En el hook de la tabla:

```ts
const { fields, append, update, remove } = useFieldArray({ control: form.control, name: 'lines', keyName: 'key' })
const [editing, setEditing] = useState<{ index: number | null } | null>(null)

function handleSubmit (values: OrderLineFormValues) {
  if (editing?.index == null) append(values)
  else update(editing.index, values)
  setEditing(null)
}
```

«Edita» llama a `setEditing({ index })`, «Quita» a `remove(index)` y añadir a
`setEditing({ index: null })`. La tabla pinta el modal solo mientras hay una
fila abierta (`const hasModal = editing !== null`), con la fila que toca
(`fields[editing.index]`, o ninguna al añadir), `handleSubmit` y el cierre
(`() => setEditing(null)`): así cada vez parte de la fila que recibe.

### Asistentes

Un asistente (dar de alta un pedido en varios pasos) reparte un alta larga en
pasos.

#### 1. Los pasos

- **Pasos:** la cabecera lleva el indicador de pasos («Paso X de Y») y debajo
  va el paso en curso. Cada paso es un componente `<Feature><Qué>Step`. Al
  cambiar de paso, el foco va al título del paso nuevo
  ([D12](../ux-ui/rules.md#d12-accesibilidad)).
- **Historial:** cada paso añade una entrada al historial sin tocar la URL,
  así que atrás del navegador hace lo mismo que «Atrás»; en el primer paso,
  sale del asistente. Recargar empieza de cero
  ([D10](../ux-ui/rules.md#d10-navegación)).

#### 2. El estado y la validación

- **Estado:** el estado del asistente (el paso actual, lo que ya se ha
  decidido) va en un `useReducer` de su hook. Los datos del alta van en un
  solo `useForm` para todos los pasos, con un solo schema.
- **Validación por paso:** «Continúa» valida solo los campos de su paso, con
  `trigger`; «Crea…», al final («Crea el pedido»), valida todo y, si algo
  falla, vuelve al paso de los datos.
- **Después de un intento, el paso se revalida al cambiar.** `trigger` no
  cuenta como envío, así que `reValidateMode` no actúa: tras un «Continúa»
  fallido, el hook vuelve a validar los campos del paso en cada cambio
  (`watch` y `trigger`), y cada error se va en cuanto se corrige
  ([D6](../ux-ui/rules.md#d6-formularios)).

El hook del alta de un pedido. Los campos de cada paso son una constante de
`constants/ordersNewWizard.ts`: el paso del cliente valida `customerId` y
`orderDate`; el de las líneas, `lines`; la revisión no valida nada.

```ts
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { formUtils } from '@/utils/formUtils'
import { orderFormSchema } from '../../common/schemas/orderFormSchema'
import type { OrderFormValues } from '../../common/schemas/orderFormSchema'
import { orderFormUtils } from '../../common/utils/orderFormUtils'
import { ORDERS_NEW_INITIAL_STATE, ORDERS_NEW_STEP_FIELDS } from '../constants/ordersNewWizard'
import { ordersNewWizardUtils } from '../utils/ordersNewWizardUtils'

/**
 * El estado del asistente del alta de un pedido: el paso y el formulario único.
 * @returns `state`, `form`, `reviewCount` (los campos por revisar del paso), `unsaved` y `handleContinue`.
 */
export function useOrdersNewWizard () {
  const [state, dispatch] = useReducer(ordersNewWizardUtils.reduceOrdersNewWizard, ORDERS_NEW_INITIAL_STATE)
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: orderFormUtils.buildOrderFormValues(),
  })
  const stepFields = ORDERS_NEW_STEP_FIELDS[state.step]

  useEffect(() => {
    if (!state.attempted) return
    const subscription = form.watch(() => void form.trigger(stepFields))
    return () => subscription.unsubscribe()
  }, [form, state.attempted, stepFields])

  async function handleContinue () {
    const valid = await form.trigger(stepFields, { shouldFocus: true })
    dispatch({ type: valid ? 'next' : 'invalid' })
  }

  return {
    state,
    form,
    reviewCount: state.attempted ? formUtils.countErrors(form.formState.errors) : 0,
    unsaved: form.formState.isDirty && state.step !== 'done',
    handleContinue,
  }
}
```

El reductor es una función pura del objeto de utils del asistente, como
cualquier util.

#### 3. La barra del asistente

- **Volver** («Atrás») es un botón de la barra, y la única forma de volver: no
  hay enlace arriba. En el primer paso, en su sitio va «Cancela», que vuelve a
  la pantalla de origen con el aviso de cambios sin guardar. El primario de la
  barra no cambia de sitio.
- **«Hay N campos por revisar»** va en la ayuda de la barra, en lugar de lo
  que se lleva hecho. Se actualiza al corregir y desaparece al llegar a cero;
  el foco ya ha ido al primer campo con error.
- **Si el alta falla,** el aviso va encima de la barra de acciones, como en
  una edición. Mientras guarda, «Crea…» lleva `loading` y los campos y las
  demás acciones se desactivan.
- **Enter no avanza:** la barra no es el envío de un `<form>`.

El paso del cliente es el primero, así que su barra lleva «Cancela» y el
primario, y la ayuda con los campos por revisar:

```tsx
const hasReview = reviewCount > 0

<ActionBar hint={hasReview ? t('common:form.review', { count: reviewCount }) : undefined}>
  <Button variant='quiet' onClick={onCancel}>{t('common:actions.cancel')}</Button>
  <Button onClick={onContinue}>{t('common:wizard.next')}</Button>
</ActionBar>
```

#### 4. La revisión y el final

- **Revisión:** un paso de revisión, si lo hay, enseña lo que se va a crear y
  deja volver a cualquier paso.
- **Al terminar:** una pantalla final de la feature
  (`OrdersNewDoneScreen`) lleva solo el mensaje, un estado vacío que dice qué
  se ha creado, y su barra ofrece lo siguiente: crear otro (primario) e ir al
  listado («Ve al listado»), que lleva a otra pantalla y es un enlace, con
  `href` ([D10](../ux-ui/rules.md#d10-navegación)).
- **Cambios sin guardar:** el aviso mira `unsaved` del hook, en cualquier
  paso menos el final ([Los cambios sin guardar](#5-los-cambios-sin-guardar)).

## Errores comunes

| Síntoma | Causa |
|---|---|
| El error sale como una clave (`orders:errors.…`) | El campo no traduce el mensaje con `t()`, o falta la clave en el catálogo. |
| Un selector no guarda su valor | El campo se conectó con `register` en lugar de `Controller`. |
| «Guarda» está activo sin cambios | Falta desactivarlo con `!formState.isDirty`. |
| Los errores salen mientras se escribe, antes de guardar | `mode` no es `onSubmit`. |
| Tras guardar con errores, el error no se va al corregir el campo | `reValidateMode` no es `onChange`. En un asistente, falta revalidar el paso tras «Continúa» (`watch` y `trigger`). |
| Al cambiar la fecha del pedido, el error de la de entrega no se va | Falta `deps` en el campo que no lleva el error. |
<!-- kit:if backend -->
| Tras guardar, el formulario sigue con cambios | El hook no reinicia el formulario con el registro guardado: falta `reset` en el `onSuccess` de `mutate`. |
| Lo escrito se pierde al llegar una recarga | El formulario usa `values`, que lo reinicia con cada dato nuevo: parte de `defaultValues` y solo se reinicia tras su propio guardado o tras una acción inmediata que cambia sus datos. |
| La gestión se abre con datos viejos | Monta el formulario con lo que había en la caché: la página espera al registro recién pedido. |
<!-- kit:else -->
| Tras guardar, el formulario sigue con cambios | El hook no reinicia el formulario con el registro guardado: falta `reset` después de guardar. |
| Lo escrito se pierde cuando cambia el registro | El formulario usa `values`, que lo reinicia con cada dato nuevo: parte de `defaultValues` y solo se reinicia tras su propio guardado o tras una acción inmediata que cambia sus datos. |
<!-- kit:end -->
| Mientras guarda se puede seguir escribiendo | Falta `disabled` en `useForm`, o un `Controller` no pasa `field.disabled` a su campo. |
| Enter guarda una edición | El `<form>` guarda en su `onSubmit`: «Guarda» llama al envío al pulsarlo. |
<!-- kit:if backend -->
| Al guardar con un fallo, la consola dice «Uncaught (in promise)» | El envío usa `mutateAsync` sin `try/catch`: se usa `mutate`. |
<!-- kit:end -->
| No avisa al salir con cambios | Falta `UnsavedChangesGuard` en la pantalla, o su `when` no cuenta todos los cambios. |
| El test de una pantalla con el aviso falla con un error de `useBlocker` | Se montó con `testUtils.renderWithProviders`: `useBlocker` necesita el router de datos de `testUtils.renderPage`. |
| «Cancela» de un modal pregunta si se quiere salir sin guardar | Llama a `handleClose` en lugar de a `onClose`: solo su botón de cerrar, Escape y pulsar fuera preguntan. |
| Un texto largo se corta al pegarlo | El campo usa el `maxlength` del navegador: el máximo va en el schema. |
<!-- kit:if backend -->
| Sin permiso para editar, la gestión enseña campos desactivados | En lectura, los datos van como texto, sin barra: nunca campos `disabled`. |
<!-- kit:else -->
| En lectura, la gestión enseña campos desactivados | Los datos van como texto, sin barra: nunca campos `disabled`. |
<!-- kit:end -->
| Al quitar una fila, las demás cambian de valor | `rowKey` no devuelve la clave de `useFieldArray` (la que lleva `keyName`). |
| «Continúa» deja pasar un paso con errores | `trigger` no recibe los campos del paso: valida otra cosa. |
