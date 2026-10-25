# Añadir contenido

Esta guía publica contenido escrito en Markdown o MDX: textos largos que se
escriben a mano y cambian poco, como las entradas de un blog o los sitios del
entorno. Sirve a quien añade una colección o una página que la lee. El ejemplo
es el blog de la casa: su índice, BLOG (`/blog`), y cada entrada, BLOG-POST
(`/blog/[...slug]`), con la colección `blogPosts`.

En los ejemplos, las piezas visuales llevan el nombre de su papel; las del
proyecto están en
[Piezas por papel](../ux-ui/design-system.md#piezas-por-papel).

**En esta página:**

- [1. La colección y su schema](#1-la-colección-y-su-schema)
- [2. Las entradas](#2-las-entradas)
- [3. Leerla en una página](#3-leerla-en-una-página)
- [4. Las rutas de las entradas](#4-las-rutas-de-las-entradas)
- [5. Los tests](#5-los-tests)
- [Errores comunes](#errores-comunes)

## 1. La colección y su schema

Una colección es un grupo de entradas con la misma forma. Todas se declaran en
`src/content.config.ts`, que nace con la primera: cada una con el loader
`glob`, que lee los ficheros de su carpeta, y el schema de su frontmatter.

```ts
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blogPosts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blogPosts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: image(),
    imageAlt: z.string(),
  }),
})

export const collections = { blogPosts }
```

- **El nombre** dice qué es, con el prefijo de quién la usa, como cualquier
  pieza ([Prefijo de origen](../naming.md#prefijo-de-origen)): `blogPosts`,
  las entradas del blog. Su carpeta se llama igual, `src/content/blogPosts/`.
  Los sitios del entorno, que lee AREA, son otra colección, `areaPlaces`,
  declarada igual y en el mismo `collections`.
- **El schema** es el frontmatter de cada entrada: lo que la página pinta o
  usa para ordenar. En una colección que tiene página por entrada, también lo
  que piden los buscadores y las redes
  ([D14](../ux-ui/rules.md#d14-buscadores-y-compartir)): el título, la
  descripción y la imagen. Una entrada que no lo cumple hace fallar
  `%%PM%% run typecheck` y `%%PM%% run build`, con su nombre.
- **`image()`** valida que la imagen existe y la deja lista para `<Image>`,
  que la sirve optimizada; `imageAlt` es su texto alternativo
  ([D12](../ux-ui/rules.md#d12-accesibilidad)).
- **`z` sale de `astro/zod`,** el de Astro, que es el que lee la colección.
- **El tipo de una entrada** sale de la colección:
  `CollectionEntry<'blogPosts'>`, de `astro:content`. No se escribe a mano.
- **MDX ya está:** `astro.config.ts` lleva su integración, `mdx()`.

## 2. Las entradas

Cada entrada es un fichero de la carpeta de su colección, con su frontmatter y
su texto. Su nombre, en inglés y en kebab-case, es el final de su URL:
`autumn-routes.md` es `/blog/autumn-routes`. Sus imágenes van en
`src/assets/`, con el prefijo de la página que las pinta
(`blogPostAutumnRoutes.jpg`).

```text
src/
    content.config.ts
    assets/blogPostAutumnRoutes.jpg
    content/blogPosts/
        <idioma>/
            autumn-routes.md
            village-guide.mdx
```

```md
---
title: Cinco rutas para el otoño
description: Cinco paseos desde la casa, de una a cuatro horas, para ver cómo cambian de color los robles.
date: 2026-10-02
image: ../../../assets/blogPostAutumnRoutes.jpg
imageAlt: Un camino entre robles con las hojas amarillas
---

Las cinco salen de la puerta de la casa y están señaladas. La más corta llega
al molino viejo en una hora, y la más larga sube al mirador del valle.
```

- **Markdown (`.md`)** para el texto; **MDX (`.mdx`)** solo si la entrada
  pinta un componente de `src/components/` dentro (un mapa, una galería).
- **La ruta de la imagen** es relativa a la entrada.
- **El texto sigue las normas** de la web: se trata de tú, y las acciones van
  en imperativo y entre «» ([D11](../ux-ui/rules.md#d11-textos-y-formato)).
- **Quién escribe las entradas** lo dice el brief, en «Contenido»; una que
  falta no se inventa: se pregunta.
- **Una carpeta por idioma** (%%LANGUAGES%%), con las mismas entradas y el
  mismo nombre de fichero en todas:
  `src/content/blogPosts/%%DEFAULT_LANGUAGE%%/autumn-routes.md`. El idioma va
  delante en el nombre de la entrada (`%%DEFAULT_LANGUAGE%%/autumn-routes`),
  y la página lo quita de la URL.

## 3. Leerla en una página

Una colección la leen las páginas, como cualquier otro dato: un componente
recibe lo que pinta por props. El índice del blog,
`src/pages/blog/index.astro` (BLOG), con una tarjeta por entrada, la más
reciente primero:

```astro
---
import { getCollection } from 'astro:content'
import { getRelativeLocaleUrl } from 'astro:i18n'
import BlogPostCard from '@/components/BlogPostCard.astro'
import { APP_DEFAULT_LANGUAGE } from '@/constants/appLanguages'
import { getI18nT } from '@/i18n/i18n'
import AppLayout from '@/layouts/AppLayout.astro'

const t = getI18nT(Astro.currentLocale)
const language = Astro.currentLocale ?? APP_DEFAULT_LANGUAGE
const posts = (await getCollection('blogPosts', ({ id }) => id.startsWith(`${language}/`))).sort((first, second) => second.data.date.getTime() - first.data.date.getTime())
const hasPosts = posts.length > 0
---

<AppLayout title={t('blog.index.title')} description={t('blog.index.description')}>
  <PageHeader title={t('blog.index.title')} />
  {hasPosts
    ? (
        <ul>
          {posts.map((post) => <li><BlogPostCard post={post.data} href={getRelativeLocaleUrl(language, `blog/${post.id.slice(language.length + 1)}`)} /></li>)}
        </ul>
      )
    : <EmptyState title={t('blog.index.emptyTitle')} />}
</AppLayout>
```

- **Se ordena a propósito,** con un campo del schema (`date`):
  `getCollection` da las entradas en el orden de los ficheros.
- **La tarjeta es de la entrada, no del índice:** `BlogPostCard` recibe sus
  datos (`CollectionEntry<'blogPosts'>['data']`) y su enlace, así que la
  portada la usa igual para enseñar las tres últimas
  ([Prefijo de origen](../naming.md#prefijo-de-origen)).
- **Sin entradas,** su vacío: «Todavía no hay ninguna entrada»
  ([D3](../ux-ui/rules.md#d3-estados-de-carga-error-y-vacío)).
- **Se leen las del idioma de la página,** por el principio de su nombre, y
  los enlaces se arman con `getRelativeLocaleUrl`, como todos los de la web
  ([Rutas y navegación](../standards.md#rutas-y-navegación)).
<!-- kit:if server -->
- **Se genera al compilar,** como toda página sin `prerender = false`: el
  contenido no cambia de una petición a otra, y una entrada nueva sale en el
  siguiente build.
<!-- kit:else -->
- **Se genera al compilar,** como todas las páginas: una entrada nueva sale
  en el siguiente build.
<!-- kit:end -->
<!-- kit:if privateArea -->
- **Lo ve cualquiera:** el middleware no pasa por lo que se genera al
  compilar. Una entrada que solo pueden leer los huéspedes con reserva (la
  guía de la casa, con la clave de la puerta) va en una página de
  `/account/`, que se pinta en cada petición, y busca su entrada con
  `getEntry`.
<!-- kit:end -->
- **Si el blog crece,** el índice se parte en páginas con `paginate()`, en
  `src/pages/blog/page/[page].astro` (`/blog/page/2`), y no en
  `src/pages/blog/[...page].astro`, que se cruzaría con las rutas de las
  entradas.

## 4. Las rutas de las entradas

Cada entrada tiene su página, que sale de su nombre:
`src/pages/blog/[...slug].astro` (BLOG-POST) genera una al compilar por cada
entrada, con `getStaticPaths`, y la pinta con `render`. Su título, su
descripción y su imagen son los de la entrada, también para los buscadores y
las redes: la imagen para compartir es la suya, recortada a 1200 por 630 px con
`getImage`.

```astro
---
import type { GetStaticPaths } from 'astro'
import { getImage, Image } from 'astro:assets'
import { getCollection, getEntry, render } from 'astro:content'
import { APP_DEFAULT_LANGUAGE } from '@/constants/appLanguages'
import AppLayout from '@/layouts/AppLayout.astro'
import { formatUtils } from '@/utils/formatUtils'

type Props = Record<string, never>

/** Una página por entrada del blog, con el nombre de su fichero, al compilar. */
export const getStaticPaths = (async () => {
  const posts = await getCollection('blogPosts', ({ id }) => id.startsWith(`${APP_DEFAULT_LANGUAGE}/`))
  return posts.map((post) => ({ params: { slug: post.id.slice(APP_DEFAULT_LANGUAGE.length + 1) } }))
}) satisfies GetStaticPaths

const language = Astro.currentLocale ?? APP_DEFAULT_LANGUAGE
const post = await getEntry('blogPosts', `${language}/${Astro.params.slug}`)
if (post === undefined) return Astro.rewrite('/404')
const { Content } = await render(post)
const shareImage = await getImage({ src: post.data.image, width: 1200, height: 630, fit: 'cover' })
---

<AppLayout title={post.data.title} description={post.data.description} image={shareImage.src}>
  <PageHeader title={post.data.title} subtitle={formatUtils.formatDate(post.data.date)} />
  <Image src={post.data.image} alt={post.data.imageAlt} loading='eager' fetchpriority='high' />
  <Content />
</AppLayout>
```

- **Una ruta para todos los idiomas:** `getStaticPaths` da las entradas del
  idioma por defecto, y la página lee la del idioma en el que se pinta
  (`/<idioma>/blog/…` es la misma página, en otro idioma).
- **`type Props = Record<string, never>`:** la página no recibe props. Sin
  él, Astro le da el tipo `never` y su test no la puede pintar.
- **Si a un idioma le falta la entrada,** su URL da la página que no existe,
  y el build lo avisa.
- **`[...slug]` admite subcarpetas:** una entrada en
  `src/content/blogPosts/<tema>/…` tiene su URL con ese tema delante.
- **El título de la entrada** es el de la página y el de la pestaña
  ([D10](../ux-ui/rules.md#d10-navegación)); la fecha va en el subtítulo, con
  `formatUtils` ([D11](../ux-ui/rules.md#d11-textos-y-formato)).
- **La imagen de arriba es la primera que se ve:** carga enseguida
  (`loading='eager'` y `fetchpriority='high'`); las del texto esperan a que
  se acerquen ([Imágenes y vídeo](./create-a-page.md#imágenes-y-vídeo)).
- **Lo que pinta el Markdown** no lleva clases: sus estilos van en el
  componente que lo envuelve, con `:global()`
  ([Estilos](../standards.md#estilos)).

## 5. Los tests

Cada página tiene su test en `src/tests/pages/`, con su ruta
(`src/tests/pages/blog/index.test.ts` y
`src/tests/pages/blog/[...slug].test.ts`), como cualquier otra
([Una página](./write-tests.md#una-página)).

**Las entradas las da el test.** Vitest no sincroniza las colecciones: según
lo que dejó la última vez `astro dev`, salen vacías o con lo que había. Así
que el test cambia lo que lee de `astro:content` por uno de prueba, con
`vi.mock`, y cada `it` da las entradas del caso. Lo que se prueba es la página
(el orden, los enlaces, lo que pinta), no el texto de las entradas, que ya
comprueba su schema. La imagen de una entrada de prueba es la de cualquier
fichero (`src`, `width`, `height` y `format`).

```ts
import { getCollection } from 'astro:content'
import { describe, expect, it, vi } from 'vitest'
import BlogPage from '@/pages/blog/index.astro'
import { testUtils } from '@/tests/testUtils'

const IMAGE = { src: '/blogPostAutumnRoutes.jpg', width: 1600, height: 1067, format: 'jpg' as const }

vi.mock('astro:content', async (importOriginal) => ({ ...await importOriginal<object>(), getCollection: vi.fn() }))

describe('/blog', () => {
  it('enlaza las entradas, la más reciente primero', async () => {
    vi.mocked(getCollection).mockResolvedValue([
      { id: '%%DEFAULT_LANGUAGE%%/village-guide', collection: 'blogPosts', data: { title: 'Qué ver en el pueblo', description: 'La iglesia, el lavadero y la plaza.', date: new Date('2026-06-14'), image: IMAGE, imageAlt: 'La plaza del pueblo' } },
      { id: '%%DEFAULT_LANGUAGE%%/autumn-routes', collection: 'blogPosts', data: { title: 'Cinco rutas para el otoño', description: 'Cinco paseos desde la casa.', date: new Date('2026-10-02'), image: IMAGE, imageAlt: 'Un camino entre robles' } },
    ])

    const view = await testUtils.renderAstro(BlogPage)

    expect(view.getByRole('link', { name: 'Cinco rutas para el otoño' })).toHaveAttribute('href', '/blog/autumn-routes/')
    expect(view.getByRole('main').textContent).toMatch(/Cinco rutas para el otoño.*Qué ver en el pueblo/s)
  })
})
```

El de una entrada la da con `getEntry`, con su texto ya pintado en
`rendered.html`, que `render` pinta como el de una entrada de verdad:

```ts
import { getEntry } from 'astro:content'
import { describe, expect, it, vi } from 'vitest'
import BlogPostPage from '@/pages/blog/[...slug].astro'
import { testUtils } from '@/tests/testUtils'

const IMAGE = { src: '/blogPostAutumnRoutes.jpg', width: 1600, height: 1067, format: 'jpg' as const }

vi.mock('astro:content', async (importOriginal) => ({ ...await importOriginal<object>(), getEntry: vi.fn() }))

describe('/blog/[...slug]', () => {
  it('pinta la entrada del idioma de la página', async () => {
    vi.mocked(getEntry).mockResolvedValue({ id: '%%DEFAULT_LANGUAGE%%/autumn-routes', collection: 'blogPosts', data: { title: 'Cinco rutas para el otoño', description: 'Cinco paseos desde la casa.', date: new Date('2026-10-02'), image: IMAGE, imageAlt: 'Un camino entre robles' }, rendered: { html: '<p>Las cinco salen de la puerta de la casa.</p>' } })

    const view = await testUtils.renderAstro(BlogPostPage, { params: { slug: 'autumn-routes' } })

    expect(getEntry).toHaveBeenCalledWith('blogPosts', '%%DEFAULT_LANGUAGE%%/autumn-routes')
    expect(view.getByRole('heading', { level: 1, name: 'Cinco rutas para el otoño' })).toBeInTheDocument()
    expect(view.getByText('Las cinco salen de la puerta de la casa.')).toBeInTheDocument()
  })
})
```

- **Las páginas se pintan en el idioma por defecto,** como en todos los tests
  ([La escritura de un test](./write-tests.md#3-la-escritura-de-un-test)).
- **`vi.restoreAllMocks` no deshace lo que se da a un `vi.fn`:** cada `it`
  da sus entradas.
- **El título, la descripción y la imagen para compartir** de una entrada se
  prueban leyendo la cabecera de la página, como los de cualquier otra
  ([Una página](./write-tests.md#una-página)).

## Errores comunes

| Síntoma | Causa |
|---|---|
| `%%PM%% run typecheck` falla con «blogPosts → autumn-routes data does not match collection schema» | El frontmatter de esa entrada no cumple el schema de su colección: le falta un campo o tiene otro tipo. |
| `%%PM%% run build` falla porque no encuentra la imagen de una entrada | La ruta de `image` no lleva a la imagen: es relativa a la entrada, no a la raíz. |
| Las entradas salen en el orden de los ficheros | La página no las ordena: `.sort()` por el campo del schema que da el orden (`date`). |
| Una entrada `.mdx` no se pinta | Falta la integración `mdx()` en `astro.config.ts`. |
| La entrada sale en las redes sin imagen | La página no pasa `image` al marco: la de la entrada, con `getImage`. |
<!-- kit:if i18n -->
| El build avisa «Entry blogPosts → <idioma>/… was not found» y esa URL da la página que no existe | A ese idioma le falta la entrada: cada idioma tiene las mismas, con el mismo nombre de fichero. |
| En otro idioma, el índice sale vacío | Las entradas no están en la carpeta de su idioma (`src/content/blogPosts/<idioma>/`). |
<!-- kit:end -->
<!-- kit:if privateArea -->
| Una entrada para los huéspedes se ve sin entrar | Se genera al compilar, y el middleware no pasa por ella: lo que solo pueden ver quienes entran se pinta en cada petición, en `/account/`. |
<!-- kit:end -->
| En un test, la colección sale vacía, o con entradas que el test no ha dado | Vitest no sincroniza las colecciones: el test da sus entradas con `vi.mock('astro:content', …)`. |
| El test de una entrada no compila: «Argument of type '(_props: never) => any'…» | La página no declara sus props: lleva `type Props = Record<string, never>`. |
