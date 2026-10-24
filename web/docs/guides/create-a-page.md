# Crear una página

Esta guía monta una página de principio a fin: su documento, la URL y el
nombre, la página y sus componentes, los textos, el menú, los permisos, los
datos y los tests. Sirve también para añadir una página a una sección que ya
existe, saltando los pasos hechos. El ejemplo es ROOMS, las habitaciones de
Casa del Roble, en `/rooms`.
<!-- kit:if privateArea -->
Donde la zona privada enseña mejor un patrón, sale de ACCOUNT-BOOKINGS, «Mis
reservas», en `/account/bookings`.
<!-- kit:end -->

En los ejemplos, las piezas visuales llevan el nombre de su papel
(`PageHeader`, `CallToAction`, `ErrorState`) y no se importan; las del
proyecto están en [Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- [1. El documento](#1-el-documento)
- [2. La URL y el nombre](#2-la-url-y-el-nombre)
- [3. La página](#3-la-página): [Un componente](#un-componente)
- [4. Los textos](#4-los-textos)
- [5. El menú](#5-el-menú)
- [6. Los permisos](#6-los-permisos)
- [7. Los datos y el guardado](#7-los-datos-y-el-guardado)
- [8. Los tests](#8-los-tests)
- [Buscadores y compartir](#buscadores-y-compartir) · [Imágenes y vídeo](#imágenes-y-vídeo) · [Las animaciones](#las-animaciones)
- [La página terminada](#la-página-terminada)
- [Errores comunes](#errores-comunes)

## 1. El documento

Una página empieza por su documento, `docs/pages/<NOMBRE>.md`
(`docs/pages/ROOMS.md`), que es a la vez lo que se pide y lo que hace: lo
crea `/zaius-backlog` al apuntarla, «pendiente», y lo escribe
`/zaius-page ROOMS` con la persona, con la plantilla de
[Páginas](../pages/README.md#plantilla). Ahí se decide para qué es, sus
secciones (cada una con su pieza del sistema de diseño), su contenido, sus
datos, cómo sale en los buscadores, su rendimiento y su lista de tests.

Con el documento va su boceto, `docs/ux-ui/mockups/ROOMS.html`, que enseña la
página antes de construirla ([Bocetos](../ux-ui/README.md#bocetos)). Nada se
empieza a montar hasta que la persona da el OK a los dos
([La persona decide](../process.md#la-persona-decide)): la lista de tests
aprobada es la especificación, y `/zaius-build ROOMS` la construye de un test
en uno. Lo que se decide construyendo va a «Decisiones», con su fecha, y el
documento dice siempre lo que hace el código.

El esqueleto, con los apartados de la plantilla en su orden:

```markdown
# ROOMS · Las habitaciones

URL: `/rooms` · Estado: por aprobar el AAAA-MM-DD

## Para qué

Que quien visita la casa elija habitación y pida disponibilidad: «Pide
disponibilidad», que lleva a `/contact`.

## Secciones
## Contenido
## Datos
## Buscadores y compartir
## Rendimiento
## Tests

| Test | Nivel | ✓ |
|---|---|---|
| Enseña cada habitación con sus personas y su precio por noche | página | |

## Decisiones
## Verificación a mano
```

Cada apartado está en la plantilla de [Páginas](../pages/README.md#plantilla).
El estado va en la cabecera y el backlog lo repite
([Los estados](../process.md#los-estados-de-una-página)).

## 2. La URL y el nombre

El fichero de una página es su URL, dentro de `src/pages/`, y su prefijo, el
de todo lo suyo, sale de esa URL en camelCase
([Nomenclatura](../naming.md#páginas-y-rutas)). Su nombre es el prefijo en
mayúsculas, con un guion entre palabras:

| URL | Fichero | Prefijo | Nombre |
|---|---|---|---|
| `/` | `src/pages/index.astro` | `home` | HOME |
| `/rooms` | `src/pages/rooms.astro` | `rooms` | ROOMS |
| `/legal/notice` | `src/pages/legal/notice.astro` | `legalNotice` | LEGAL-NOTICE |
<!-- kit:if content -->
| `/blog/autumn-routes` | `src/pages/blog/[...slug].astro` | `blogPost` | BLOG-POST |
<!-- kit:end -->
<!-- kit:if privateArea -->
| `/account/bookings/1287/edit` | `src/pages/account/bookings/[id]/edit.astro` | `accountBookingsEdit` | ACCOUNT-BOOKINGS-EDIT |
<!-- kit:end -->

<!-- kit:if i18n -->
Con ese prefijo se llaman sus componentes (`RoomsList.astro`), el grupo de
sus textos (`rooms.*`) y, con su nombre, su documento (`docs/pages/ROOMS.md`).
<!-- kit:else -->
Con ese prefijo se llaman sus componentes (`RoomsList.astro`) y, con su
nombre, su documento (`docs/pages/ROOMS.md`).
<!-- kit:end -->

- **Una página sin sección** es un fichero suelto (`src/pages/rooms.astro`);
  cuando tiene páginas debajo, su carpeta (`src/pages/blog/index.astro`).
- **En `src/pages/` solo van rutas:** Astro convierte en una cada `.astro` y
  cada `.ts` de la carpeta. Lo demás va en su sitio
  ([Organización de src](../standards.md#organización-de-src)).
<!-- kit:if privateArea -->
- **`/account/bookings/[id]` no es una ruta:** una reserva tiene una sola
  página, su gestión, en `/account/bookings/[id]/edit`
  ([D7](../ux-ui/rules.md#d7-un-registro-una-pantalla)).
<!-- kit:end -->
<!-- kit:if server -->
- **Cuándo se pinta.** Una página se genera al compilar, con los datos de ese
  momento, salvo que lleve `export const prerender = false`: entonces se pinta
  en cada petición. Lo lleva la página que necesita el servidor: un
  formulario (CONTACT) o datos que cambian en cada visita.
<!-- kit:if privateArea -->
  También las de la zona privada, que piden la sesión.
<!-- kit:end -->
<!-- kit:else -->
<!-- kit:if backend -->
- **Cuándo se pinta.** Todas las páginas se generan al compilar, con los datos
  que da la API en ese momento. Una ruta con parámetro (`[slug]`) dice qué
  páginas genera con `getStaticPaths`
  ([Un dato](./load-and-save-data.md#2-un-dato)).
<!-- kit:else -->
- **Cuándo se pinta.** Todas las páginas se generan al compilar, con los datos
  del proyecto. Una ruta con parámetro (`[slug]`) dice qué páginas genera con
  `getStaticPaths`.
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if content -->
- **Una página de contenido** (el blog, en `/blog`) lee una colección:
  [Añadir contenido](./add-content.md#3-leerla-en-una-página).
<!-- kit:end -->

## 3. La página

El frontmatter de la página lee los datos, decide el estado y pinta un layout
con sus componentes; su HTML es el orden de la pantalla: el layout, la
cabecera y una línea por sección ([Normativa](../standards.md#páginas)). Esta
es la de ROOMS (`src/pages/rooms.astro`):

```astro
---
<!-- kit:if i18n -->
import { getRelativeLocaleUrl } from 'astro:i18n'
<!-- kit:end -->
<!-- kit:if backend -->
import RoomsAvailabilitySection from '@/components/RoomsAvailabilitySection.astro'
<!-- kit:end -->
import RoomsList from '@/components/RoomsList.astro'
<!-- kit:if i18n -->
import { APP_DEFAULT_LANGUAGE } from '@/constants/appLanguages'
<!-- kit:end -->
import { ROOMS } from '@/constants/rooms'
<!-- kit:if i18n -->
import { getI18nT } from '@/i18n/i18n'
<!-- kit:end -->
import AppLayout from '@/layouts/AppLayout.astro'
<!-- kit:if backend -->
import { bookingsService } from '@/services/bookings/bookingsService'
<!-- kit:if server -->

export const prerender = false
<!-- kit:end -->
<!-- kit:end -->

<!-- kit:if i18n -->
const t = getI18nT(Astro.currentLocale)
const locale = Astro.currentLocale ?? APP_DEFAULT_LANGUAGE
<!-- kit:end -->
<!-- kit:if backend -->
<!-- kit:if server -->
const [result] = await Promise.allSettled([bookingsService.getBookingsAvailability()])
const availability = result.status === 'fulfilled' ? result.value : null
<!-- kit:else -->
const availability = await bookingsService.getBookingsAvailability()
<!-- kit:end -->
<!-- kit:end -->
---

<!-- kit:if i18n -->
<AppLayout title={t('rooms.title')} description={t('rooms.description')} image='/share/rooms.png'>
  <PageHeader title={t('rooms.title')} />
  <RoomsList rooms={ROOMS} />
<!-- kit:if backend -->
  <RoomsAvailabilitySection availability={availability} />
<!-- kit:end -->
  <CallToAction href={getRelativeLocaleUrl(locale, '/contact')}>{t('rooms.cta')}</CallToAction>
</AppLayout>
<!-- kit:else -->
<AppLayout title='Habitaciones' description='Tres habitaciones de piedra y madera, para dos o para cuatro personas.' image='/share/rooms.png'>
  <PageHeader title='Habitaciones' />
  <RoomsList rooms={ROOMS} />
<!-- kit:if backend -->
  <RoomsAvailabilitySection availability={availability} />
<!-- kit:end -->
  <CallToAction href='/contact'>Pide disponibilidad</CallToAction>
</AppLayout>
<!-- kit:end -->
```

<!-- kit:if backend -->
<!-- kit:if server -->
Las habitaciones salen de `constants/rooms.ts`, escritas en el proyecto
([Los datos de la web](../standards.md#los-datos-de-la-web)), y sus noches
libres, de la API. Como cambian cada día, la página se pinta en cada petición
(`prerender = false`). Si la API falla, `availability` es `null` y su sección
pinta su error; las habitaciones se ven igual
([Carga, error y vacío](./load-and-save-data.md#3-carga-error-y-vacío)).
<!-- kit:else -->
Las habitaciones salen de `constants/rooms.ts`, escritas en el proyecto
([Los datos de la web](../standards.md#los-datos-de-la-web)), y sus noches
libres, de la API, al compilar: si la API falla, falla `%%PM%% run build`, y
no se publica una página rota. Lo que da la API es lo del último build.
<!-- kit:end -->
<!-- kit:else -->
La página lee las habitaciones de `constants/rooms.ts`, escritas en el
proyecto ([Los datos de la web](../standards.md#los-datos-de-la-web)), y las
pinta.
<!-- kit:end -->

- **El marco nace con la primera página:** `src/layouts/AppLayout.astro`, con
  la cabecera del sitio (`AppHeader`), el menú y el pie (`AppFooter`), que
  pinta `BaseLayout.astro` por dentro, y la página que no existe,
  `src/pages/404.astro`, dentro del marco
  ([Normativa](../standards.md#rutas-y-navegación)). Las demás páginas solo
  lo usan.
- **El título** va al layout, y la pestaña del navegador dice «Habitaciones ·
  %%APP_NAME%%». El de una página del menú es el texto de su entrada
  ([D10](../ux-ui/rules.md#d10-navegación)).
- **La cabecera es `PageHeader`,** con el `h1`. En la portada (HOME) es su
  propia pieza, `HomeHeader`, con la frase, la foto y la llamada a la acción.
- **La llamada a la acción es un enlace** (`<a href>`) con aspecto de botón
  primario, uno por sección ([D5](../ux-ui/rules.md#d5-acciones)); lo que
  hace algo sin cambiar de página es un botón
  ([D10](../ux-ui/rules.md#d10-navegación)).
- **Cada sección es un componente** de `src/components/`, con su nombre según
  la fórmula de [Nomenclatura](../naming.md#componentes). La lógica de más de
  unas líneas va a un util puro, con su test.

### Un componente

Un componente pinta lo que recibe: sus props van en su `interface Props` y
sus estilos, en su `<style>`, con los tokens del sistema de diseño
([D1](../ux-ui/rules.md#d1-el-sistema-de-diseño-primero)).
<!-- kit:if backend -->
Nunca llama a un service.
<!-- kit:end -->
<!-- kit:if i18n -->
Sus textos salen de `t()`, que pide en su frontmatter.
<!-- kit:else -->
Sus textos van escritos en él.
<!-- kit:end -->
`RoomsList` pinta una `RoomCard` por habitación, y la tarjeta
(`src/components/RoomCard.astro`), que usan ROOMS y HOME, lleva la entidad
delante ([Prefijo de origen](../naming.md#prefijo-de-origen)):

```astro
---
import { Image } from 'astro:assets'
import { ROOM_TYPE } from '@/constants/rooms'
<!-- kit:if i18n -->
import { getI18nT } from '@/i18n/i18n'
<!-- kit:end -->
import type { Room } from '@/types/room'
import { formatUtils } from '@/utils/formatUtils'

interface Props {
  room: Room
}

const { room } = Astro.props
<!-- kit:if i18n -->
const t = getI18nT(Astro.currentLocale)
<!-- kit:end -->
const [cover] = room.photos
const isFamily = room.type === ROOM_TYPE.family
<!-- kit:if !i18n -->
const isForOne = room.capacity === 1
<!-- kit:end -->
const price = formatUtils.formatPrice(room.pricePerNight)
---

<article>
  <Image src={cover.src} alt={cover.alt} width={640} height={427} />
  <h3>{room.name}</h3>
<!-- kit:if i18n -->
  {isFamily ? <StatusBadge label={t('room.family')} /> : null}
  <p>{t('room.capacity', { count: room.capacity })} · {t('room.pricePerNight', { value: price })}</p>
<!-- kit:else -->
  {isFamily ? <StatusBadge label='Familiar' /> : null}
  <p>{isForOne ? '1 persona' : `${room.capacity} personas`} · {price} la noche</p>
<!-- kit:end -->
</article>

<style>
  article {
    display: grid;
    gap: var(--space-2);
  }
</style>
```

- **Cada condición es una constante con nombre** (`isFamily`), y el HTML la
  resuelve con `? :`, con `null` en la rama que no pinta; nunca `&&`
  ([Normativa](../standards.md#componentes)).
- **Las cifras salen de `formatUtils`:** el precio, «95 €»
  ([D11](../ux-ui/rules.md#d11-textos-y-formato)). Una cuenta de más de unas
  líneas (el precio de una estancia, `roomPriceUtils.buildRoomStayPrice`) va
  a un util, no al frontmatter.
- **Cada imagen, con `<Image>` y su `alt`**
  ([Imágenes y vídeo](#imágenes-y-vídeo)).
<!-- kit:if backend -->
- **`RoomsAvailabilitySection`** recibe la disponibilidad que le pasa la
  página
<!-- kit:if server -->
  (o `null`, si no ha llegado) y lleva dentro su error, con «Vuelve a
  intentarlo», sin tapar el resto de la página.
<!-- kit:else -->
  y pinta su vacío si no queda ninguna noche libre.
<!-- kit:end -->
<!-- kit:end -->
- **Un componente no redirige ni cambia el estado de la respuesta:** eso lo
  hace la página, en su frontmatter.
- **Un comportamiento pequeño en el navegador** (abrir la galería en un
  `<dialog>`, cambiar de pestaña) va en un `<script>` del componente. Lo que
  tiene estado que crece es una isla
  ([Añadir una isla](./add-an-island.md)).

## 4. Los textos

<!-- kit:if i18n -->
Cada idioma de la web (%%LANGUAGES%%) tiene un solo catálogo,
`src/i18n/<idioma>.json`. Lo de una página sin sección cuelga de su prefijo
(`rooms`); lo de una pieza de negocio que usan varias, de su entidad
(`room`, de `RoomCard`); y lo de toda la web, de `common`. Dentro, las claves
se agrupan por sección de la página. Lo de ROOMS en
`src/i18n/%%DEFAULT_LANGUAGE%%.json`:

```json
{
  "rooms": {
    "title": "Habitaciones",
    "description": "Tres habitaciones de piedra y madera, para dos o para cuatro personas.",
    "cta": "Pide disponibilidad"
  },
  "room": {
    "family": "Familiar",
    "capacity_one": "{{count}} persona",
    "capacity_other": "{{count}} personas",
    "pricePerNight": "{{value}} la noche"
  }
}
```

- **`t` se pide en el frontmatter** de la página o del componente que pinta
  el texto: `const t = getI18nT(Astro.currentLocale)`, fija al idioma de la
  petición. Cada `t()` lleva la clave entera: `t('rooms.title')`.
- **Un número que concuerda** va en `count`, y la clave tiene sus formas
  `_one` y `_other` («1 persona», «4 personas»):
  `t('room.capacity', { count: room.capacity })`
  ([D11](../ux-ui/rules.md#d11-textos-y-formato)).
- **Los enlaces siguen en el idioma de la página:** el de por defecto va sin
  prefijo (`/rooms`) y los demás, con el suyo (`/en/rooms`). Un enlace se
  arma con `getRelativeLocaleUrl(locale, '/contact')`, con
  `const locale = Astro.currentLocale ?? APP_DEFAULT_LANGUAGE`.
- **El contenido también se traduce:** los textos largos de cada idioma, como
  los de las páginas legales, van en sus claves o, con colecciones, en una
  entrada por idioma.
- **Todos los catálogos llevan las mismas claves:** lo mira la
  [comprobación de la estructura](../standards.md#comprobar-la-estructura).
  Las reglas de nombres de las claves están en
  [Nomenclatura](../naming.md#textos-i18n).
<!-- kit:else -->
La web tiene un solo idioma, así que los textos van escritos en el componente
que los pinta, y en ningún otro sitio: un util devuelve datos (un precio, un
recuento), y el componente los convierte en texto
([Normativa](../standards.md#textos)). Así, quitar una página es quitar sus
textos con ella.

- **Un número que concuerda** elige su forma con una constante con nombre, y
  la cifra sale de `formatUtils`
  ([D11](../ux-ui/rules.md#d11-textos-y-formato)), como las personas de
  `RoomCard`: «1 persona», «4 personas».
- **Lo que repite toda la web** («Pide disponibilidad», «Vuelve a
  intentarlo») lo escribe una sola pieza, y las páginas la usan.
- **Si la web pasa a varios idiomas,** la skill `zaius-languages` lleva los
  textos a los catálogos.
<!-- kit:end -->

## 5. El menú

Si la página es destino del menú, se añade su entrada en
`src/constants/appNavigation.ts`, que nace con la primera página:
`APP_NAVIGATION`, el menú de la cabecera, y `APP_FOOTER_NAVIGATION`, el del
pie, con las páginas legales. Los pinta `AppLayout.astro`, que marca la
entrada activa con `Astro.url.pathname`:

<!-- kit:if i18n -->
```ts
export const APP_NAVIGATION: NavEntry[] = [
  { href: '/', labelKey: 'common.nav.home' },
  { href: '/rooms', labelKey: 'common.nav.rooms' },
  { href: '/area', labelKey: 'common.nav.area' },
<!-- kit:if content -->
  { href: '/blog', labelKey: 'common.nav.blog' },
<!-- kit:end -->
  { href: '/contact', labelKey: 'common.nav.contact' },
<!-- kit:if privateArea -->
  { href: '/account/bookings', labelKey: 'common.nav.accountBookings', permission: 'BOOKINGS.VIEW' },
<!-- kit:end -->
]

export const APP_FOOTER_NAVIGATION: NavEntry[] = [
  { href: '/legal/notice', labelKey: 'common.nav.legalNotice' },
  { href: '/privacy', labelKey: 'common.nav.privacy' },
  { href: '/cookies', labelKey: 'common.nav.cookies' },
]
```

La etiqueta de cada entrada es `common.nav.<prefijo>` (`common.nav.rooms`,
«Habitaciones»).
<!-- kit:else -->
```ts
export const APP_NAVIGATION: NavEntry[] = [
  { href: '/', label: 'Inicio' },
  { href: '/rooms', label: 'Habitaciones' },
  { href: '/area', label: 'El entorno' },
<!-- kit:if content -->
  { href: '/blog', label: 'Blog' },
<!-- kit:end -->
  { href: '/contact', label: 'Contacto' },
<!-- kit:if privateArea -->
  { href: '/account/bookings', label: 'Mis reservas', permission: 'BOOKINGS.VIEW' },
<!-- kit:end -->
]

export const APP_FOOTER_NAVIGATION: NavEntry[] = [
  { href: '/legal/notice', label: 'Aviso legal' },
  { href: '/privacy', label: 'Privacidad' },
  { href: '/cookies', label: 'Cookies' },
]
```
<!-- kit:end -->

- **El orden es el del mapa del sitio,** el del [backlog](../backlog.md),
  y el texto de la entrada es también el título de la página
  ([D10](../ux-ui/rules.md#d10-navegación)).
<!-- kit:if content -->
- **Una página que no está en el menú** deja marcada la entrada de la que
  cuelga: una entrada del blog, «Blog».
<!-- kit:else -->
- **Una página que no está en el menú** deja marcada la entrada de la que
  cuelga, si la tiene.
<!-- kit:end -->
<!-- kit:if privateArea -->
- **Una entrada con `permission`** no se ve sin ese permiso: «Mis reservas»
  solo sale con la sesión de un huésped
  ([El menú](./apply-permissions.md#6-el-menú)).
<!-- kit:end -->
- **Una entrada con un submenú** es un grupo (`NavGroup`), con sus entradas
  dentro. Sus tipos están en `src/types/navigation.ts`.

## 6. Los permisos

<!-- kit:if privateArea -->
Solo la zona privada tiene permisos: lo demás de la web es público. La regla
de una página es una función pura de un objeto de utils, con su test:
`bookingPermissionUtils.getAccountBookingsPermissions`, en
`src/utils/bookingPermissionUtils.ts`, recibe los permisos de la sesión y da
lo que la persona puede hacer (`{ canView, canCancel }`). La página la aplica
en su frontmatter (`src/pages/account/bookings/index.astro`):

```ts
export const prerender = false

const { canView } = bookingPermissionUtils.getAccountBookingsPermissions(Astro.locals.session?.permissions ?? [])
const request = accountBookingsRequestUtils.buildAccountBookingsRequest(Astro.url.searchParams)
const [list] = canView ? await Promise.allSettled([bookingsService.getBookingsListPage(request)]) : []
const page = list?.status === 'fulfilled' ? list.value : null

if (!canView) Astro.response.status = 403
```

- **Sin sesión no se llega aquí:** el middleware lleva al login a quien abre
  una página de `/account/` sin haber entrado.
- **Sin permiso de ver, no se pide nada:** la página pinta dentro del marco
  el aviso de que no se tiene acceso, con un 403. No redirige.
- **Lo que decide un botón o una sección** sale de la misma regla
  (`canCancel` decide «Cancela la reserva»), y la página se lo pasa al
  componente.
- **Cada action y cada endpoint aplican la regla otra vez,** en su handler:
  esconder un botón no protege nada.
- **ACCOUNT-BOOKINGS-EDIT tiene la suya,** `getAccountBookingsEditPermissions`,
  en el mismo objeto: aunque pida lo mismo que otra página, cada página tiene
  su regla.

Cómo se escribe la regla y cómo se aplica a una página, un botón, una
sección, una action o el menú, con ejemplos:
[Aplicar permisos](./apply-permissions.md#1-la-regla).
<!-- kit:else -->
Lo que se publica lo ve cualquiera: la web no tiene permisos. Si un día
necesita una zona privada (la de los huéspedes, con su entrada y sus
reservas), la trae `%%KIT_RUN%% change`.
<!-- kit:end -->

## 7. Los datos y el guardado

Cada dato va en un sitio, según lo que sea:

| Es | Va en | En ROOMS |
|---|---|---|
| Un dato que se escribe en la web | Un fichero de `constants/`, que lee la página | `ROOMS`, en `constants/rooms.ts` |
<!-- kit:if backend -->
<!-- kit:if server -->
| Un dato de otro sistema | El frontmatter de la página, con su service | `bookingsService.getBookingsAvailability` |
<!-- kit:else -->
| Un dato de otro sistema | El frontmatter de la página, con su service, al compilar | `bookingsService.getBookingsAvailability` |
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if content -->
| Un texto largo que se escribe a mano | Una colección de contenido | En BLOG, las entradas de `blogPosts` |
<!-- kit:end -->
<!-- kit:if server -->
| Lo que envía quien visita la web | Una action, en `src/actions/` | En CONTACT, `actions.contact.sendContactMessage` |
<!-- kit:end -->
<!-- kit:if privateArea -->
| Lo que sobrevive a abrir un registro y volver, a recargar y a compartir el enlace (la página de una lista, la pestaña) | La query de la URL, que lee la página | En ACCOUNT-BOOKINGS, `/account/bookings?page=2` |
| Una descarga | Un endpoint de `src/pages/api/` | En ACCOUNT-BOOKINGS-EDIT, `src/pages/api/account/bookings/[id]/invoice.pdf.ts` |
<!-- kit:end -->
| Lo que solo importa en el navegador mientras la página está abierta | Un `<script>` del componente | Abrir la galería de fotos |

<!-- kit:if !server -->
En una web sin servidor no se guarda nada: CONTACT da el teléfono y el correo,
como enlaces (`tel:` y `mailto:`). Si la web tiene que recibir mensajes, el
formulario y su servidor llegan con `%%KIT_RUN%% change`.

<!-- kit:end -->
<!-- kit:if backend -->
Si el endpoint aún no existe en el service, se añade antes
([Añadir un servicio](./add-a-service.md)); cómo se leen los datos, con sus
estados, está en [Cargar y guardar datos](./load-and-save-data.md).
<!-- kit:else -->
Dónde van los datos y cómo se cambian:
[Los datos de la web](../standards.md#los-datos-de-la-web).
<!-- kit:end -->
<!-- kit:if server -->
Cada formulario, con su action y sus campos:
[Crear un formulario](./create-a-form.md).
<!-- kit:end -->
Lo que ya existe se reutiliza; si dos páginas necesitan lo mismo, se comparte
con el nombre que dice quién lo usa
([Normativa](../standards.md#dónde-va-cada-cosa)).

## 8. Los tests

Cada fichero con código tiene su test al lado, con el mismo nombre
(`RoomCard.test.ts`); solo se libran los tipos, las constantes y la
configuración. Una página no puede tenerlo al lado, porque Astro lo
convertiría en una ruta: va en `src/tests/pages/`, en la misma ruta
<!-- kit:if backend -->
(`src/tests/pages/rooms.test.ts`). Se prueba entera contra los mocks,
pintándola en el servidor con `testUtils.renderAstro`.
<!-- kit:else -->
(`src/tests/pages/rooms.test.ts`). Se prueba entera, pintándola en el
servidor con `testUtils.renderAstro`.
<!-- kit:end -->
Los tests que se escriben son los de la lista del documento, en su orden.
Cómo: [Escribir tests](./write-tests.md#una-página).

## Buscadores y compartir

Lo que piden los buscadores y las redes lo pone `BaseLayout.astro` en la
cabecera del documento ([D14](../ux-ui/rules.md#d14-buscadores-y-compartir)).
Cada página solo le da su contenido, por props, a través del marco
(`AppLayout` recibe las mismas y se las pasa), y el documento de la página lo
dice en «Buscadores y compartir»:

- **`title`,** único: «Habitaciones», y la pestaña dice «Habitaciones ·
  %%APP_NAME%%».
- **`description`,** una o dos frases (unos 150 caracteres) que dicen qué hay
  en la página.
- **`image`,** la imagen para compartir: 1200 × 630 px, en
  `public/share/<prefijo>.png` (`public/share/rooms.png`), con la foto o el
  título bien grande. Sin una propia, la de la portada.
<!-- kit:if privateArea -->
- **`noindex`,** en lo que no es público: la zona privada, el login y las
  páginas de error.
<!-- kit:else -->
- **`noindex`,** en lo que no es público: las páginas de error.
<!-- kit:end -->

```astro
<AppLayout title='Habitaciones' description='Tres habitaciones de piedra y madera, para dos o para cuatro personas.' image='/share/rooms.png'>
```

<!-- kit:if privateArea -->
```astro
<AppLayout title='Mis reservas' noindex>
```

<!-- kit:end -->
Lo demás va solo: la dirección canónica de cada página, la etiqueta de las
redes y el mapa del sitio (`sitemap`), que se genera al compilar. Necesitan la
dirección final de la web, `site`, en `astro.config.ts`, y un `robots.txt` en
`public/` que señale el mapa: los pone `zaius-publish` al publicar. El icono
de la pestaña, `public/favicon.svg`, nace con el logo, y con él se enlaza en
`BaseLayout` (`<link rel='icon' href='/favicon.svg' />`).

## Imágenes y vídeo

Lo vistoso no puede hacer lenta la página, y el documento dice en
«Rendimiento» lo que pesa:

- **Las imágenes van en `src/assets/`,** con el prefijo de su página
  (`src/assets/roomsEncina1.jpg`), y se pintan con `<Image>` de
  `astro:assets` (o `<Picture>`, para varios formatos), que las sirve en el
  tamaño justo y en formatos ligeros. Siempre con su `alt`, que dice lo que se
  ve («La Encina, con la cama de matrimonio y la ventana al jardín»); una que
  solo adorna, con `alt=''` ([D12](../ux-ui/rules.md#d12-accesibilidad)).
- **Solo la primera imagen que se ve al entrar carga enseguida**
  (`loading='eager'` y `fetchpriority='high'`), como la foto de la portada,
  `homeHeader.jpg`; las demás esperan a que se acerquen, que es lo que hace
  `<Image>` por defecto.
- **Lo que se sirve tal cual** (el icono de la pestaña, las imágenes para
  compartir, un PDF con las normas de la casa) va en `public/`.
- **Un vídeo propio,** corto y comprimido, con
  `<video muted playsinline loop poster='…'>`: sin sonido si arranca solo,
  con su imagen de espera y con su pausa
  ([D13](../ux-ui/rules.md#d13-movimiento)); si no es lo primero que se ve,
  `preload='none'`. Su pieza es un `Viewer` (`HomeVideoViewer`).
- **Un vídeo de YouTube o Vimeo se carga al pulsarlo:** hasta entonces es su
  imagen con un botón de reproducir, que no pide nada a la plataforma ni deja
  sus cookies.

## Las animaciones

Cuánto se mueve la web lo dice «Movimiento», en el sistema de diseño, y cómo,
[D13](../ux-ui/rules.md#d13-movimiento):

- **Las transiciones, en el `<style>` del componente,** con los tokens de
  movimiento, solo sobre `transform` y `opacity`, y con su versión para
  «reducir movimiento»:

  ```css
  .card {
    transition: transform var(--motion-fast) var(--motion-ease);
  }

  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }
  }
  ```

- **Aparecer al llegar a una sección,** con «Movimiento» vistoso: la sección
  lleva `data-reveal`, y un `<script>` del marco (`AppLayout.astro`) la
  descubre al verla, una sola vez. El punto de partida (transparente y algo
  más abajo) solo se aplica cuando ese script ha corrido, con la clase
  `has-motion`: sin JavaScript, todo se ve. Sus estilos van en los globales
  (`src/styles/motion.css`):

  ```astro
  <script>
    document.documentElement.classList.add('has-motion')
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    })
    for (const element of document.querySelectorAll('[data-reveal]')) observer.observe(element)
  </script>
  ```

  ```css
  .has-motion [data-reveal] {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity var(--motion-slow) var(--motion-ease), transform var(--motion-slow) var(--motion-ease);
  }

  .has-motion [data-reveal].is-visible {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .has-motion [data-reveal] {
      transform: none;
    }
  }
  ```

- **Una animación compleja** (una secuencia que sigue al scroll) pide una
  librería (GSAP, Motion): es una dependencia nueva, con el OK, y va en una
  isla si tiene estado ([Añadir una isla](./add-an-island.md)).
- **Se revisa con «reducir movimiento» activado,** en la revisión visual: lo
  que se desplaza o cambia de tamaño pasa a un fundido o se queda quieto.

## La página terminada

Con las piezas que nombra esta guía, ROOMS queda así (cada fichero con código
tiene su `.test.ts` al lado, y la página, el suyo en `src/tests/pages/`). El
resto está en las secciones de su documento.

```text
docs/pages/ROOMS.md                    su documento
public/share/rooms.png                 la imagen para compartir
src/
├── pages/rooms.astro                  ROOMS
├── layouts/AppLayout.astro            el marco, que nace con la primera página
├── components/
│   ├── AppFooter.astro                el pie del sitio, del marco
│   ├── AppHeader.astro                la cabecera del sitio, del marco
<!-- kit:if backend -->
│   ├── RoomsAvailabilitySection.astro las noches libres
<!-- kit:end -->
│   ├── RoomCard.astro                 también la usa HOME
│   └── RoomsList.astro
├── assets/roomsEncina1.jpg            las fotos de cada habitación
├── constants/
│   ├── appNavigation.ts               la entrada de «Habitaciones»
│   └── rooms.ts                       ROOMS y ROOM_TYPE
<!-- kit:if i18n -->
├── i18n/                              rooms.*, room.* y common.nav.rooms, en cada idioma
<!-- kit:end -->
├── types/room.ts                      Room
├── utils/formatUtils.ts               formatPrice, con la primera página que formatea un dato
└── tests/pages/rooms.test.ts
```
<!-- kit:if backend -->

Las noches libres salen de `bookingsService` (`src/services/bookings/`), que
también podrán usar otras páginas.
<!-- kit:end -->

## Errores comunes

| Síntoma | Causa |
|---|---|
<!-- kit:if server -->
| La página enseña los datos de cuando se compiló, o no ve la query ni lo enviado | Le falta `export const prerender = false`. |
<!-- kit:end -->
<!-- kit:if backend -->
<!-- kit:if !server -->
| `%%PM%% run build` falla al leer una página | La API de `API_URL` no responde al compilar: el build la necesita. |
<!-- kit:end -->
| Falla «quién llama a la API» en la comprobación de la estructura | Un componente importa un service: los datos los pide la página y se los pasa por props. |
<!-- kit:end -->
| Un fichero de `src/pages/` que no es una página sale como una ruta | En `src/pages/` solo van rutas; los tests de las páginas, en `src/tests/pages/`. |
<!-- kit:if privateArea -->
| `/account/bookings/1287` no existe | Una reserva no tiene esa ruta: su página es `/account/bookings/1287/edit`. |
<!-- kit:end -->
<!-- kit:if i18n -->
| Se ven las claves (`rooms.title`) en lugar de los textos | Falta la clave en el catálogo del idioma, o no coincide entera. |
| Un enlace en otro idioma lleva a la página en el de por defecto | El enlace no lleva el idioma: se arma con `getRelativeLocaleUrl`. |
<!-- kit:end -->
| La entrada del menú no se marca | Su `href` no coincide con el principio de la ruta de la página. |
| Al compartir el enlace sale sin imagen ni descripción | La página no pasa `image` y `description` al marco, o falta `site` en `astro.config.ts`. |
| Una foto pesa mucho o sale borrosa | Se pinta con `<img>`: va con `<Image>`, desde `src/assets/`, con su ancho y su alto. |
<!-- kit:if privateArea -->
| La pantalla dice «No tienes acceso a esta página» con alguien que debería entrar | La regla de la página pide un permiso que la sesión no trae. |
| La página pide sus datos aunque la persona no puede verla | Los pide sin mirar antes `canView`. |
<!-- kit:end -->
| Falla «cada página y cada endpoint tienen su test» en la comprobación de la estructura | El test de la página no está en `src/tests/pages/`, con la misma ruta que la página. |
