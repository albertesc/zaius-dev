# Aplicar permisos

Esta guía decide qué ve y qué puede hacer cada persona en la zona privada de
la web: dice qué tiene que dar la sesión, escribe la regla de permisos de la
página y la aplica a la página, sus botones y enlaces, sus zonas, sus actions
y la entrada del menú. Sirve para quien monta una página de la zona privada y
para quien añade a una de ellas algo que pide un permiso. El ejemplo es
ACCOUNT-BOOKINGS-EDIT, la gestión de una reserva, en
`/account/bookings/[id]/edit`; donde otra pieza enseña mejor el patrón, sale
de ACCOUNT-BOOKINGS, «Mis reservas», en `/account/bookings`.

Después de los pasos vienen los casos especiales: varios permisos a la vez y
pedir un permiso que aún no existe. Lo demás de la web es público: no tiene
sesión ni permisos, y esta guía no se aplica a sus páginas.

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- **1. La regla:** [Lo que da la sesión](#lo-que-da-la-sesión)
- [2. La página](#2-la-página)
- [3. Los botones y enlaces](#3-los-botones-y-enlaces)
- [4. Las zonas de la pantalla](#4-las-zonas-de-la-pantalla)
- [5. Las actions](#5-las-actions)
- [6. El menú](#6-el-menú)
- [7. Los tests de la regla](#7-los-tests-de-la-regla)
- **Casos especiales:** [Varios permisos](#varios-permisos), [Un permiso nuevo](#un-permiso-nuevo)
- [Errores comunes](#errores-comunes)

## 1. La regla

- **Un permiso es `SECCIÓN.ACCIÓN`,** por ejemplo `BOOKINGS.VIEW`,
  `BOOKINGS.EDIT` o `BOOKINGS.CANCEL`. Las acciones habituales son `VIEW`,
  `CREATE`, `EDIT`, `CANCEL`, `DELETE` y `EXPORT`; las secciones son las
  áreas de la zona privada (las reservas, las facturas, los datos de la
  cuenta).
- **Un rol es un conjunto de permisos** (el huésped, quien lleva la casa).
  Una persona puede tener varios roles y recibe la unión de todos. Las reglas
  no preguntan por el rol, que es un nombre que cambia: para que algo lo vea
  solo un rol, se le da un permiso a ese rol y la regla pregunta por el
  permiso.
- **La API es la que manda.** Cada endpoint declara qué permiso pide, o una
  lista de la que basta uno, y lo comprueba en cada petición.
- **La web solo decide qué ofrecer, y nunca ofrece más de lo que la API
  acepta.** Un botón que la API rechazaría es un fallo que la persona no puede
  arreglar; y si la API responde a la falta de permiso con el estado que
  cierra la sesión (un `401`), la echa al login a media tarea. Por eso lo que
  el permiso o el estado del registro no deja hacer no se ofrece, ni
  desactivado ni con un aviso ([D5](../ux-ui/rules.md#d5-acciones)). Esconder
  algo es una comodidad; la seguridad la pone la API.

Con eso, cada decisión de una página es una regla `canX`, y todas juntas son
una función pura del util de permisos de su entidad,
`src/utils/bookingPermissionUtils.ts`: una función por página,
`get<Prefijo>Permissions`, que recibe la lista de permisos de la sesión
([Nomenclatura](../naming.md#funciones-tipos-y-constantes)). La de la
gestión de una reserva:

```ts
/**
 * Lo que puede hacer la sesión en la gestión de una reserva.
 * @param permissions Los permisos de la sesión.
 * @returns `canView`, abrirla; `canEdit`, guardar su llegada y sus huéspedes; `canCancel`, cancelarla.
 */
function getAccountBookingsEditPermissions (permissions: string[]) {
  return {
    canView: permissions.includes('BOOKINGS.VIEW'),
    canEdit: permissions.includes('BOOKINGS.EDIT'),
    canCancel: permissions.includes('BOOKINGS.CANCEL'),
  }
}

export const bookingPermissionUtils = {
  getAccountBookingsEditPermissions,
}
```

- **Una regla por decisión,** con el nombre de lo que decide: `canEdit`, no
  `hasEditPermission`. Cada una pide lo que pide el endpoint al que da paso.
- **La misma función decide la página, sus botones y sus actions,** para que
  nunca se desajusten.
- **Cada página tiene la suya,** aunque pida lo mismo que otra: «Mis
  reservas» aplica `getAccountBookingsPermissions`, y la gestión,
  `getAccountBookingsEditPermissions`. Las dos van en el mismo objeto.
- **Cada regla se apunta en el documento de su página,** en «Datos»
  ([Páginas](../pages/README.md)): su nombre, el permiso de la API y lo que
  decide.

### Lo que da la sesión

La sesión no viene hecha: nace con la primera página de la zona privada, la de
entrar, LOGIN (`/login`). Es una página que pinta `BaseLayout.astro`, sin el
marco de la web, y su action pide a la API la sesión y la guarda en la cookie
de la web. La sesión es esa cookie, nunca `Astro.session`. Lo demás tiene que
dar estas piezas, con estos nombres, porque las páginas y las guías cuentan con
ellas ([Rutas y navegación](../standards.md#rutas-y-navegación)):

| Pieza | Qué da |
|---|---|
| `src/middleware.ts` | En cada petición que no se genera al compilar: lee la cookie y deja la sesión en `Astro.locals.session`; corre la petición con `apiSessionUtils.run`, con `getToken` (el token de esa cookie) y `onEnd`, para que los services usen su token; sin sesión, en las rutas privadas (las de `/account/`), lleva al login, y al entrar se vuelve a la ruta pedida; si la API la da por terminada (un `401`, que llega a `onEnd` como `expired`), borra la cookie y lleva al login, con el aviso de que ha caducado. |
| `src/env.d.ts` | El tipo de `Astro.locals`: `session` es el token, la lista de permisos y lo que el proyecto necesite de la persona, o `null`. |
| `Astro.locals.session.permissions` | Los permisos de la persona: lo que recibe cada regla. En una action, `context.locals.session`. |

```ts
declare namespace App {
  interface Locals {
    session: { token: string, permissions: string[] } | null
  }
}
```

- **Solo la zona privada pide sesión.** Sus páginas (las de `/account/` y el
  login) llevan `export const prerender = false` y se pintan en cada
  petición; el middleware salta las que se generan al compilar
  (`context.isPrerendered`), que son todas las demás de la web, iguales para
  todo el mundo.
- **No se ofrecen a los buscadores:** cada página de la zona privada lleva
  `noindex` ([D14](../ux-ui/rules.md#d14-buscadores-y-compartir)).
- **La lista llega al entrar.** La respuesta del login trae los permisos de la
  persona, y la cookie los guarda con el token. Si se cambia un rol, la
  persona lo ve al volver a entrar.
- **Sin acceso no se redirige:** la página pinta su aviso dentro del marco
  ([2. La página](#2-la-página)). Solo la falta de sesión lleva al login.
- **Lo que pinta cada pieza** (el login, el aviso de sesión caducada, la
  página sin acceso) lo dice [D10](../ux-ui/rules.md#d10-navegación).
- **En los tests,** la sesión es un `locals` más, con los permisos del caso
  ([7. Los tests de la regla](#7-los-tests-de-la-regla)).

## 2. La página

La página aplica la regla en su frontmatter, antes de pedir nada. Sin
`canView`, no pide los datos y pinta el aviso de que no se tiene acceso, dentro
del marco y con un 403; no redirige ni hay una página `/403`
([Rutas y navegación](../standards.md#rutas-y-navegación)). La gestión de una
reserva, sin sus estados de error y de registro que no existe:

```astro
---
import AccountBookingsEditForm from '@/components/AccountBookingsEditForm.astro'
import { getI18nT } from '@/i18n/i18n'
import AppLayout from '@/layouts/AppLayout.astro'
import { bookingsService } from '@/services/bookings/bookingsService'
import { bookingPermissionUtils } from '@/utils/bookingPermissionUtils'

export const prerender = false

const t = getI18nT(Astro.currentLocale)
const { canView, canEdit, canCancel } = bookingPermissionUtils.getAccountBookingsEditPermissions(Astro.locals.session?.permissions ?? [])
const booking = canView ? await bookingsService.getBookingDetail(Number(Astro.params.id)) : null
const hasNoAccess = booking === null

if (hasNoAccess) Astro.response.status = 403
---

<AppLayout title={t('account.bookingsEdit.documentTitle', { id: Astro.params.id })} noindex>
  {hasNoAccess
    ? <EmptyState title={t('common.errorPages.forbidden.title')} />
    : <AccountBookingsEditForm booking={booking} … />}
</AppLayout>
```

- **Antes de pedir nada:** sin permiso, la página no llama a ningún service,
  así que la API no rechaza nada ni cierra la sesión.
- **Lo que decide un botón o una zona** sale de la misma regla (`canEdit`,
  `canCancel`), y la página se lo pasa a sus componentes por props: un
  componente no lee la sesión.
- **Una zona que pide más** lleva su propia regla, en la misma función
  ([4. Las zonas de la pantalla](#4-las-zonas-de-la-pantalla)).

## 3. Los botones y enlaces

Un botón o un enlace que pide un permiso no se ofrece sin él: ni desactivado
ni con un aviso. La condición va en una constante con nombre y se pinta con
un ternario, con `null` en la rama que no pinta; nunca con `&&`
([Normativa](../standards.md#componentes)). En la gestión de una reserva,
«Cancela la reserva» sale con `canCancel` y solo mientras la reserva se puede
cancelar:

```astro
---
import { bookingCancelUtils } from '@/utils/bookingCancelUtils'

const isCancelOffered = canCancel && bookingCancelUtils.isBookingCancellable(booking)
---

{isCancelOffered ? <BookingCancelModal id={booking.id} … /> : null}
```

`BookingCancelModal` pinta el botón que lo abre y el modal
([Formularios en un modal](./create-a-form.md#formularios-en-un-modal)).

- **Para elegir entre dos cosas** se usa un ternario. Si de un grupo de
  acciones no queda ninguna, el grupo tampoco se pinta.
- **Un enlace a otra página pide lo que pide esa página:** «Gestiona», en cada
  fila de «Mis reservas», sale con el `canView` de la gestión.
- **Las acciones de cada fila de una tabla,** igual: la página le pasa a la
  tabla sus reglas (`canManage`, `canCancel`) y la tabla pinta en cada fila
  solo las que tocan, con la condición del estado de la fila
  ([D8](../ux-ui/rules.md#d8-listados-y-tablas)).
- **Volver no lleva a una página sin permiso:** la salida de la gestión vuelve
  a «Mis reservas» (con su página, de `?back=`), que pide lo mismo para verse
  ([D10](../ux-ui/rules.md#d10-navegación)).
- **Solo se desactiva lo que se puede desbloquear en la misma pantalla,** y la
  causa se ve sin pasar el ratón: «Añade un huésped» cuando la habitación ya
  está llena, no sin permiso ([D5](../ux-ui/rules.md#d5-acciones)).

## 4. Las zonas de la pantalla

Una tarjeta, una sección, una pestaña o un campo opcional se pinta igual:
`{canX ? … : null}`, o con la alternativa en lugar de `null`. El caso más
común es la gestión de un registro: con `canEdit`, el formulario y su barra;
sin él, los mismos datos como texto, con el aviso de que no se puede cambiar
bajo la cabecera, que no se cierra
([D7](../ux-ui/rules.md#d7-un-registro-una-pantalla)):

```astro
{canEdit
  ? <AccountBookingsEditForm booking={booking} … />
  : (
    <>
      <PageAlert title={t('account.bookingsEdit.readOnly.title')}>{t('account.bookingsEdit.readOnly.description')}</PageAlert>
      <AccountBookingsEditDetailsCard booking={booking} />
    </>
    )}
```

- **En lectura no hay campos desactivados:** los datos van como texto, sin
  `<form>` ni barra ([Editar un registro](./create-a-form.md#editar-un-registro)).
- **La página no pide lo que no va a pintar.** Una zona que pide un permiso
  más lleva su regla también en la petición del frontmatter. La factura de la
  reserva, en su tarjeta, con `canViewInvoice`
  (`permissions.includes('INVOICES.VIEW')`, en
  `getAccountBookingsEditPermissions`):

```ts
const invoice = canViewInvoice ? await bookingsService.getBookingInvoice(id) : null
```

- **Una pestaña sin permiso no sale** en la lista de pestañas, y una `?tab=`
  que la persona no puede ver, o que no existe, abre la primera
  ([Rutas y navegación](../standards.md#rutas-y-navegación)).

## 5. Las actions

Lo que la página no ofrece se puede enviar igual (un formulario copiado, una
petición a mano): cada action comprueba en su handler la sesión y la misma
regla que aplica la página, antes de llamar al service
([Guardar](../standards.md#guardar)):

```ts
updateBookingArrival: defineAction({
  accept: 'form',
  input: accountBookingsEditFormSchema,
  handler: async (values, context) => {
    const session = context.locals.session
    if (session === null) throw new ActionError({ code: 'UNAUTHORIZED' })
    if (!bookingPermissionUtils.getAccountBookingsEditPermissions(session.permissions).canEdit) throw new ActionError({ code: 'FORBIDDEN' })
    await bookingsService.updateBookingArrival(values.id, accountBookingsEditFormUtils.buildAccountBookingsEditRequest(values))
  },
}),
```

- **`UNAUTHORIZED` sin sesión y `FORBIDDEN` sin permiso,** los códigos de
  Astro. El formulario lo pinta como su fallo; con la página bien hecha,
  nadie llega a verlo.
- **La regla que comprueba es la de la página que la ofrece:**
  `cancelBooking`, que ofrecen la gestión y «Mis reservas», comprueba lo mismo
  que decide su botón en las dos (`canCancel`).
- **Con varias actions que piden lo mismo,** esas dos líneas pasan a una
  función del fichero de actions (`assertCanEditBooking(context)`), que llaman
  todas.
- **Un endpoint** (`src/pages/api/account/bookings/[id]/invoice.pdf.ts`,
  «Descarga la factura») hace lo mismo con su respuesta: un `401` sin sesión y
  un `403` sin permiso, con la regla de la página que lo enlaza
  (`canViewInvoice`).
- **La API sigue comprobando:** esto evita peticiones que fallarían, no
  sustituye a la API.

## 6. El menú

La entrada de la zona privada, «Mis reservas», va en
`src/constants/appNavigation.ts` (`APP_NAVIGATION`) con el permiso que mira el
`canView` de su página ([El menú](./create-a-page.md#5-el-menú)).
`navigationUtils.filterNavMenu` deja lo que ve la persona, y `AppLayout.astro`
lo pinta:

```ts
{ href: '/account/bookings', labelKey: 'common.nav.accountBookings', permission: 'BOOKINGS.VIEW' }
```

- **En la zona privada, una entrada sin permiso no se ve:** sus páginas se
  pintan en cada petición, y el marco filtra el menú con los permisos de la
  sesión.
- **En las páginas públicas no hay sesión:** se generan al compilar, iguales
  para todo el mundo, así que el marco no sabe quién entra. Ahí
  `filterNavMenu` recibe los permisos sin saber (`undefined`) y deja la
  entrada; sin sesión, el middleware lleva al login, y dentro, la página
  decide.
- **La entrada y la página piden lo mismo.** Si no, la entrada se ve y la
  página dice que no hay acceso, o al revés. El menú es una constante y no
  importa las reglas: repite el permiso.

## 7. Los tests de la regla

La regla es una función pura: se prueba con listas, sin sesión ni datos, en
su test, al lado (`bookingPermissionUtils.test.ts`), con un `describe` por
función y un `it` por regla, con un caso con el permiso y otro sin él:

```ts
import { describe, expect, it } from 'vitest'
import { bookingPermissionUtils } from './bookingPermissionUtils'

describe('bookingPermissionUtils.getAccountBookingsEditPermissions', () => {
  it('canView pide BOOKINGS.VIEW', () => {
    expect(bookingPermissionUtils.getAccountBookingsEditPermissions(['BOOKINGS.VIEW']).canView).toBe(true)
    expect(bookingPermissionUtils.getAccountBookingsEditPermissions([]).canView).toBe(false)
  })

  it('canEdit pide BOOKINGS.EDIT', () => {
    expect(bookingPermissionUtils.getAccountBookingsEditPermissions(['BOOKINGS.EDIT']).canEdit).toBe(true)
    expect(bookingPermissionUtils.getAccountBookingsEditPermissions(['BOOKINGS.VIEW']).canEdit).toBe(false)
  })

  it('canCancel pide BOOKINGS.CANCEL', () => {
    expect(bookingPermissionUtils.getAccountBookingsEditPermissions(['BOOKINGS.CANCEL']).canCancel).toBe(true)
    expect(bookingPermissionUtils.getAccountBookingsEditPermissions(['BOOKINGS.EDIT']).canCancel).toBe(false)
  })
})
```

La sesión de los demás tests es un `locals`, con los permisos del caso:

- **La página,** con el permiso y sin él: con `BOOKINGS.EDIT` sale «Guarda»;
  sin él, no, ni siquiera desactivado; sin `BOOKINGS.VIEW`, el aviso sin
  acceso ([Una página](./write-tests.md#una-página)):
  `testUtils.renderAstro(Page, { params: { id: '1287' }, locals: { session: { token: 'test', permissions: ['BOOKINGS.VIEW'] } } })`.
- **Cada action,** sin sesión y sin el permiso: da `UNAUTHORIZED` o
  `FORBIDDEN` y no llama al service
  ([Una action](./write-tests.md#una-action)):

```ts
it('updateBookingArrival no guarda sin BOOKINGS.EDIT', async () => {
  const update = vi.spyOn(bookingsService, 'updateBookingArrival')

  const result = await testUtils.callAction(accountActions.updateBookingArrival, buildSent(), { session: { token: 'test', permissions: ['BOOKINGS.VIEW'] } })

  expect(result.error?.code).toBe('FORBIDDEN')
  expect(update).not.toHaveBeenCalled()
})
```

`buildSent` arma el `FormData` de un envío bueno, como en el test de la action
de contacto ([Enviar el formulario](./create-a-form.md#4-enviar-el-formulario)).

## Casos especiales

Los pasos suponen una regla que pide un permiso por decisión y una API de
acuerdo con la web. Estos son los casos que se salen de ahí.

### Varios permisos

Una decisión puede pedir más de un permiso:

- **Todos (y):** la página encadena endpoints y cada uno pide el suyo. Se
  piden todos:

```ts
canEditGuests: permissions.includes('BOOKINGS.EDIT') && permissions.includes('GUESTS.VIEW'),
```

- **Alguno (o):** un solo endpoint acepta una lista y deja pasar con
  cualquiera. La regla copia esa lista:

```ts
canViewInvoice: permissions.includes('INVOICES.VIEW') || permissions.includes('BOOKINGS.EDIT'),
```

- **Mezcla:** las dos cosas a la vez, con paréntesis:

```ts
canCancel:
  permissions.includes('BOOKINGS.VIEW') &&
  (permissions.includes('BOOKINGS.CANCEL') || permissions.includes('BOOKINGS.EDIT')),
```

Cuando la regla se complica, el documento de la página dice qué endpoint pide
cada parte. Si es el `canView` de una página del menú, su entrada no puede
repetirla con un solo permiso: el menú pide el que abre la página, y la página
pinta el aviso sin acceso si falta el resto.

### Un permiso nuevo

La web no puede inventar un permiso: tiene que existir en la API, que es
quien lo comprueba y quien lo ofrece en la administración de roles.

1. **Se pide a quien lleva la API:** el permiso (`SECCIÓN.ACCIÓN`), el
   endpoint que lo exige y que la administración de roles lo ofrezca.
2. **Se marca en los roles** que lo tienen que tener.
3. **Se escribe la regla** en la función de la página, en
   `bookingPermissionUtils`, con su línea en el documento de la página.

**Un permiso que solo decide la web** es válido cuando la API no tiene nada
que comprobar: imprimir lo hace el navegador, así que un `BOOKINGS.PRINT` solo
decide si se ofrece «Imprime la reserva». El documento de la página lo dice
(«La API no lo comprueba»). Para que se pueda dar o quitar, la administración
de roles tiene que ofrecerlo.

## Errores comunes

| Síntoma | Causa |
|---|---|
| Pulsar un botón echa a la persona de la sesión | La regla pide menos que el endpoint y la API responde con el estado que cierra la sesión: se iguala al permiso del endpoint. |
| Un botón sale desactivado para quien no tiene el permiso | Lo que el permiso no deja hacer no se ofrece: se deja fuera con `canX ? … : null`, no con `disabled`. |
| «No tienes acceso a esta página» con alguien que debería entrar | La sesión no trae el permiso que pide la regla. Si se cambió su rol, tiene que volver a entrar. |
| Sin permiso, la página lleva al login o a otra página | La página redirige: sin acceso, pinta su aviso dentro del marco, con un 403. |
| La página sin acceso tarda o la API devuelve errores | La página pide los datos antes de mirar `canView`: sin él, no se pide nada. |
| Un formulario copiado guarda sin permiso | La action no comprueba la regla en su handler: esconder el botón no protege nada. |
| La entrada del menú se ve y la página dice que no hay acceso | La entrada y la regla de la página no piden lo mismo. |
| «Mis reservas» no sale en el menú de las páginas públicas | `filterNavMenu` la quita sin sesión: en una página que se genera al compilar no se sabe quién entra, y con los permisos sin saber (`undefined`) la entrada se deja. |
| Una pestaña no sale, pero con `?tab=` se piden sus datos | La petición de esa zona no lleva la regla en el frontmatter. |
| `Property 'session' does not exist on type 'Locals'` | Falta `src/env.d.ts`, con el tipo de `Astro.locals`. |
| `Astro.locals.session` es `undefined` en una página privada | La página se genera al compilar y el middleware la salta: le falta `export const prerender = false`. |
| Una página de la zona privada sale en los buscadores | Le falta `noindex`. |
| Un componente lee `Astro.locals.session` | La regla la aplica la página, que le pasa los `canX` por props. |
| Se cambió un rol y nada cambia | La lista de permisos llega al entrar: hay que volver a entrar. |
