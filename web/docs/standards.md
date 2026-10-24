# Normativa

Esta guía dice dónde va cada cosa en %%APP_NAME%% y cómo se escribe el código.
Los nombres tienen su propia guía, [Nomenclatura](./naming.md), y el
diseño, la suya, [Normas de UX/UI](./ux-ui/rules.md).

Todo gira alrededor de las páginas: cada URL es un fichero de `src/pages/`,
que lee sus datos y pinta sus componentes. No hay más capas ni más carpetas
que las de esta página, y cada una nace cuando la necesita la primera pieza.

**En esta página:**

- [Organización de src](#organización-de-src)
- [Dónde va cada cosa](#dónde-va-cada-cosa)
- [Sencillez y tamaño](#sencillez-y-tamaño)
- [Comprobar la estructura](#comprobar-la-estructura)
- [Qué se revisa](#qué-se-revisa) · [La revisión visual](#la-revisión-visual)
<!-- kit:if server -->
- **Código:** [TypeScript](#typescript) · [Páginas](#páginas) · [Componentes](#componentes) · [Islas](#islas) · [Datos](#datos) · [Los datos de la web](#los-datos-de-la-web) · [Guardar](#guardar) · [Textos](#textos) · [Estilos](#estilos) · [Comentarios](#comentarios)
<!-- kit:else -->
- **Código:** [TypeScript](#typescript) · [Páginas](#páginas) · [Componentes](#componentes) · [Islas](#islas) · [Datos](#datos) · [Los datos de la web](#los-datos-de-la-web) · [Textos](#textos) · [Estilos](#estilos) · [Comentarios](#comentarios)
<!-- kit:end -->
- [Rutas y navegación](#rutas-y-navegación)
<!-- kit:if existing -->
- [Traer un proyecto que ya existe](#traer-un-proyecto-que-ya-existe)
<!-- kit:end -->

## Organización de src

```text
src/
├── pages/                 las rutas: una página por URL, en la ruta de su URL (legal/notice.astro)
<!-- kit:if server -->
│   └── api/               los endpoints: solo lo que es HTTP de verdad (un fichero que se descarga, un webhook)
<!-- kit:end -->
├── layouts/               los layouts generales: el documento HTML y el marco de la web
├── components/            los componentes, planos, sin subcarpetas
<!-- kit:if server -->
├── actions/               lo que envían o guardan los formularios, con sus schemas
├── middleware.ts          la respuesta a los formularios (post/redirect/get)
<!-- kit:end -->
<!-- kit:if privateArea -->
├── env.d.ts               el tipo de la sesión, que el middleware deja en Astro.locals
<!-- kit:end -->
<!-- kit:if content -->
├── content.config.ts      las colecciones de contenido
├── content/               las entradas de cada colección, en Markdown o MDX
<!-- kit:end -->
<!-- kit:if backend -->
├── services/<entidad>/    el service de una entidad de la API, sus schemas y su JSON de mocks
├── schemas/               los schemas que comparten varias entidades
├── utils/                 las funciones puras, en un objeto por tema, y el transporte
├── types/                 los tipos compartidos (api.ts, los del transporte)
<!-- kit:else -->
├── utils/                 las funciones puras, en un objeto por tema
├── types/                 los tipos compartidos
<!-- kit:end -->
├── constants/             las constantes compartidas (appLanguages.ts) y los datos de la web (rooms.ts)
<!-- kit:if i18n -->
├── i18n/                  la configuración y un catálogo de textos por idioma
<!-- kit:end -->
├── styles/                los tokens del sistema de diseño y los estilos globales
├── assets/                las imágenes que optimiza Astro, con el prefijo de su página (homeHeader.jpg)
└── tests/                 la comprobación de la estructura, la configuración de Vitest, testUtils y los tests de las páginas
```

Solo existen las carpetas que hacen falta:

- **Lo instala el kit:** `layouts/BaseLayout.astro`, con su test,
  `constants/appLanguages.ts` y, en `tests/`, `structure.test.ts`,
  `setup.ts` y `testUtils.ts`. Fuera de `src/`, `astro.config.ts` y
  `vitest.config.ts`.
<!-- kit:if backend -->
- **Con la API,** también el transporte: `utils/apiUtils.ts`,
  `utils/apiErrorUtils.ts`, `utils/apiMockUtils.ts` y `types/api.ts`; y,
  fuera de `src/`, los `.env.<modo>`.
<!-- kit:end -->
<!-- kit:if privateArea -->
- **Con la zona privada,** también `utils/apiSessionUtils.ts`, la sesión de
  cada petición para el transporte.
<!-- kit:end -->
<!-- kit:if i18n -->
- **Con varios idiomas,** también `i18n/i18n.ts`, un catálogo por idioma
  (`i18n/<idioma>.json`) y `utils/languageUtils.ts`.
<!-- kit:end -->
<!-- kit:if existing -->
- **En un proyecto que ya existía,** el kit no toca `src/` hasta que acaba
  de traerse (la skill `zaius-adopt`): entonces `%%KIT_RUN%% change` trae
  estas piezas.
<!-- kit:end -->
- **Nace con el proyecto,** con la primera pieza que lo necesita:
  `layouts/AppLayout.astro` (el marco), `pages/404.astro` y
  `constants/appNavigation.ts` (el menú y el pie), con la primera página;
<!-- kit:if server -->
  `pages/500.astro`, con el marco; `middleware.ts` y `actions/`, con el
  primer formulario; `pages/api/`, con el primer endpoint;
<!-- kit:end -->
<!-- kit:if privateArea -->
  `env.d.ts` y `pages/login.astro`, con la sesión;
<!-- kit:end -->
<!-- kit:if backend -->
  `services/<entidad>/`, con el primer endpoint de la API;
  `schemas/commonSchema.ts`, con el primer schema que comparten dos
  entidades;
<!-- kit:end -->
<!-- kit:if content -->
  `content.config.ts` y `content/`, con la primera colección;
<!-- kit:end -->
  `styles/`, con el sistema de diseño (la skill `zaius-init`); `assets/`,
  con la primera imagen que se pinta con `<Image>`; y `formatUtils`, con la
  primera página que formatea un dato.

Qué va en cada una:

- **`pages/`** solo tiene rutas: Astro convierte en una cada `.astro` y cada
  `.ts` de la carpeta, así que ahí no va nada más (los tests de las páginas
  van en `tests/pages/`). Cada página lee sus datos, decide su estado y
  pinta un layout con sus componentes ([Páginas](#páginas)).
- **`layouts/`** tiene los layouts generales, no uno por página:
  `BaseLayout.astro`, el documento HTML (`<html lang>`, el `<head>` con el
  título de la pestaña, la descripción, la dirección canónica y la imagen
  para compartir), y `AppLayout.astro`, el marco de la web (la cabecera del
  sitio, el menú y el pie), que pinta `BaseLayout` por dentro.
- **`components/`** tiene todo lo que pinta, plano: los componentes de una
  página, los que comparten varias y los genéricos, y las islas, si las hay
  ([Islas](#islas)). El nombre dice de dónde es cada uno
  ([Prefijo de origen](./naming.md#prefijo-de-origen)), y al ordenar por
  nombre queda junto lo de cada página.
<!-- kit:if backend -->
- **El transporte** es lo único que habla con la API, y son utils de la
  raíz ([Nomenclatura](./naming.md#el-transporte)).
  `apiUtils.request`, `apiUtils.upload` y `apiUtils.download` validan la
  respuesta con el schema que les pasa el service y, si algo falla, lanzan
  un fallo de la API (`ApiError`), que se lee con `apiErrorUtils`. Sus tipos
  están en `types/api.ts`.
<!-- kit:if server -->
  - **Solo corre en el servidor,** al generar las páginas o en cada
    petición: lee `API_URL` de `astro:env/server`.
<!-- kit:else -->
  - **Solo corre al generar las páginas,** nunca en el navegador: en el
    build y, en desarrollo, en el servidor de `%%PM%% run dev`. Lee `API_URL`
    de `astro:env/server`.
<!-- kit:end -->
  - **Cada llamada elige entre los mocks y la API.** Con `USE_MOCKS=true`,
    `apiUtils` carga `apiMockUtils` con un import dinámico, que responde con
    los `*Mocks.json` de `services/`; si no, pide a la API. `USE_MOCKS` se
    fija al compilar: el código de producción no usa los mocks.
<!-- kit:if privateArea -->
  - **Cada petición lleva su sesión,** sin mezclarse con las demás. El
    middleware corre la petición con `apiSessionUtils.run`, con `getToken`
    (el token de esa petición, de su cookie) y `onEnd` (qué hace cuando la
    API la cierra); dentro, el transporte pide el token a
    `apiSessionUtils.getToken`. Los services no reciben el token. Un `401`
    llega a `onEnd` como `expired`.
<!-- kit:else -->
  - **Sin sesión:** el transporte no manda ningún token. Lo que la web
    enseña de la API es lo mismo para todas las personas; la zona privada,
    con su sesión, llega con `%%KIT_RUN%% change`.
<!-- kit:end -->
  - **El modo elige los mocks o la API.** Las variables van en
    `.env.<modo>`: `API_URL`, la base de la API, y `USE_MOCKS`. Las declara
    `env.schema`, en `astro.config.ts`, y se fijan al compilar.

    | Modo | Se arranca con | `USE_MOCKS` | Responde |
    |---|---|---|---|
    | `development` | `%%PM%% run dev` | `true` | Los mocks: la web funciona sin la API. |
    | `production` | `%%PM%% run build` | `false` | La API de `API_URL`. |
    | `test` | `%%PM%% run test` | `true` | Los mocks, sin esperar; un test da otra respuesta simulando su service con `vi.spyOn`. |

    Para trabajar contra la API en desarrollo, `USE_MOCKS=false` en
    `.env.development.local`, que no se versiona.
<!-- kit:if !server -->
    El build necesita la API, porque lee de ella los datos; para una demo
    sin ella, `USE_MOCKS=true` en `.env.production.local`.
<!-- kit:end -->
- **`services/<entidad>/`** tiene un service por entidad
  (`bookingsService.ts`), los schemas de sus respuestas agrupados por zona
  (`bookingsAvailabilitySchema.ts`) y, a su lado, sus mocks, un JSON con la
  respuesta de cada endpoint (`bookingsMocks.json`,
  [Nomenclatura](./naming.md#mocks)). Un service solo importa el transporte
  y sus schemas.
<!-- kit:end -->
- **Los datos de la web** se escriben en el proyecto: los textos, en la
  página que los pinta; lo que se repite o cambia a menudo (las habitaciones
  y sus precios), en `constants/`
  ([Los datos de la web](#los-datos-de-la-web)).
<!-- kit:if server -->
- **`actions/`** tiene lo que envían o guardan los formularios: un fichero
  por página o sección (`contactActions.ts`), con los schemas de sus
  formularios al lado (`contactFormSchema.ts`), y `index.ts`, que los compone
  ([Guardar](#guardar)).
- **`middleware.ts`** responde a los formularios con el post/redirect/get
  ([Guardar](#guardar)).
<!-- kit:if privateArea -->
  También abre la sesión de cada petición
  ([Rutas y navegación](#rutas-y-navegación)), y `env.d.ts` tipa lo que deja
  en `Astro.locals`.
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if content -->
- **`content.config.ts` y `content/`** son el contenido que se escribe a
  mano (Markdown o MDX): las colecciones, con su schema, y sus entradas, una
  carpeta por colección ([Añadir contenido](./guides/add-content.md)).
<!-- kit:end -->

## Dónde va cada cosa

<!-- kit:if privateArea -->
- **Lo que pide una URL lo resuelve su página.** Sus datos, sus permisos y su
  estado se deciden en el frontmatter de la página; los componentes reciben
  el resultado por props.
<!-- kit:else -->
- **Lo que pide una URL lo resuelve su página.** Sus datos y su estado se
  deciden en el frontmatter de la página; los componentes reciben el
  resultado por props.
<!-- kit:end -->
<!-- kit:if backend -->
<!-- kit:if server -->
- **Solo hablan con la API las páginas,** los endpoints, las actions, el
  middleware y las islas de servidor: son los únicos que importan un service
  o el transporte. Un componente, nunca.
<!-- kit:else -->
- **Solo hablan con la API las páginas,** que son las únicas que importan un
  service o el transporte. Un componente, nunca.
<!-- kit:end -->
<!-- kit:end -->
- **`utils/`** es para funciones puras, sin HTML ni estado, aunque las use
  una sola pieza. Las funciones de un tema van en un objeto (`formatUtils.ts`,
  con `formatUtils.formatDate`), suelto en `src/utils/`, sin carpetas de tema
  ([Nomenclatura](./naming.md#ficheros)). Las constantes que exporta van a
  `constants/` y sus tipos compartidos, a `types/`.
<!-- kit:if backend -->
  La única excepción es el transporte (`apiUtils` y los suyos), que habla
  con la red.
<!-- kit:end -->
- **`constants/`** tiene las constantes que se exportan, por tema y sin test:
  el menú y el pie (`appNavigation.ts`), los idiomas (`appLanguages.ts`) y los
  datos que se escriben en la propia web, como las habitaciones
  (`rooms.ts`, [Los datos de la web](#los-datos-de-la-web)).
- **`types/`** es para tipos que usan varios ficheros y no salen de un
  schema, uno por tema (`room.ts`, `navigation.ts`).
<!-- kit:if backend -->
  Un tipo de un service sale de su schema y vive con él.
<!-- kit:end -->
<!-- kit:if backend -->
- **`schemas/`** solo existe si dos entidades comparten un schema
  (`commonSchema.ts`). Los de las respuestas van con su service.
<!-- kit:if server -->
  Los de un formulario, con su action, en `actions/`.
<!-- kit:end -->
<!-- kit:end -->
- **`layouts/` no crece con las páginas.** Una página no tiene layout propio:
  lo que es suyo es un componente.
<!-- kit:if privateArea -->
  La entrada (`/login`) pinta `BaseLayout`, sin el marco.
<!-- kit:end -->
- **Compartir** lo decide quién lo usa, y todo va en la misma carpeta, con
  el nombre que dice su origen:

  | Quién lo usa | Nombre |
  |---|---|
  | Una página | Su prefijo: `HomeRoomsSection` |
  | Varias páginas, si es de negocio | La entidad delante: `RoomCard`, `BlogPostCard` |
  | Cualquiera, si no es de negocio | Lo que es: `AppHeader`, `AppFooter` |

  Lo que se comparte recibe por props lo que depende de la página y no sabe
  qué página lo usa. Si dos piezas solo se parecen, cada página tiene la
  suya.

## Sencillez y tamaño

La web tiene que ser lo más sencilla y entendible posible, sin un montón de
ficheros.

- Un componente es un fichero, no una carpeta. Sus estilos van dentro, en su
  `<style>`.
- Su test va al lado, con el mismo nombre ([Nomenclatura](./naming.md#ficheros)).
  En VS Code, `.vscode/settings.json` lo pliega bajo su fichero en el
  explorador.
- Un fichero de componente tiene un solo componente. Cada subpieza (una
  tarjeta, un pie, un campo de un tipo) es otro componente, en su propio
  fichero de `components/`, con el nombre de la zona que la junta con las
  demás. Lo que no pinta (un cálculo, un ayudante) va a `utils/`, en un
  objeto por tema (`roomPriceUtils.buildRoomStayPrice`), con sus ayudantes
  privados dentro ([Nomenclatura](./naming.md#ficheros)). Las constantes y
  los tipos privados sí pueden ir en el frontmatter del componente o dentro
  del fichero de utils.
- Todo fichero con código tiene su test al lado, con el mismo nombre. Las
  páginas no pueden: lo de `src/pages/` tiene su test en `src/tests/pages/`,
  en la misma ruta (`src/pages/legal/notice.astro` →
  `src/tests/pages/legal/notice.test.ts`), porque Astro convertiría en ruta
  un test que estuviera a su lado. Solo se libran los que únicamente
  declaran (tipos, constantes y configuración),
<!-- kit:if server -->
  `src/actions/index.ts`, que solo compone,
<!-- kit:end -->
  y el código base que trae el kit, que lo prueba el propio kit. Lo mira la
  [comprobación de la estructura](#comprobar-la-estructura), y cómo se
  escribe cada uno está en [Escribir tests](./guides/write-tests.md).
- No hay más carpetas que las de la
  [organización de src](#organización-de-src), y dentro de ellas no hay
  subcarpetas: `components/`, `utils/`, `constants/` y las demás son planas.
<!-- kit:if backend -->
  Solo `pages/` sigue la URL y `services/` va por entidad.
<!-- kit:else -->
  Solo `pages/` sigue la URL.
<!-- kit:end -->
<!-- kit:if i18n -->
- Lo que solo arma etiquetas con `t()` no sale del componente: va en su
  frontmatter.
<!-- kit:else -->
- Lo que solo arma los textos de una pieza no sale del componente: va en su
  frontmatter.
<!-- kit:end -->
- Se extrae solo lo que es igual, y cuando aparece la segunda copia o el
  documento de la página ya dice que la habrá, no antes. Nada de componentes
  genéricos llenos de huecos que cuesten más de leer que la copia.
- Nada «por si acaso»: ni dependencias, ni abstracciones, ni ficheros que la
  página no pida.
- Tamaño orientativo: unas 150 líneas por fichero y unas 100 por componente.
  Si se pasa, se divide por significado (una sección, un grupo de campos, un
  tipo de dato), nunca por tipo técnico. Si dividirlo lo hace menos
  entendible, no se divide.

## Comprobar la estructura

`src/tests/structure.test.ts` comprueba las reglas de esta normativa que se
pueden mirar sin ejecutar la web. Lo instala el kit, va con
`%%PM%% run test` y, si algo no las cumple, falla con la lista, fichero a
fichero:

<!-- kit:if backend -->
<!-- kit:if server -->
- **Quién llama a la API:** solo las páginas, los endpoints, las actions, el
  middleware y las islas de servidor (los componentes que una página pinta con
  `server:defer`) importan un service o el transporte (los `*Service.ts` de
  `services/` y `utils/api*Utils.ts`). Un componente sí puede importar el tipo
  de un schema de `services/` para sus props
  ([Dónde va cada cosa](#dónde-va-cada-cosa)).
<!-- kit:else -->
- **Quién llama a la API:** solo las páginas importan un service o el
  transporte (los `*Service.ts` de `services/` y `utils/api*Utils.ts`). Un
  componente sí puede importar el tipo de un schema de `services/` para sus
  props ([Dónde va cada cosa](#dónde-va-cada-cosa)).
<!-- kit:end -->
<!-- kit:end -->
- **Los utils:** cada fichero de `utils/` exporta un solo objeto, que se llama
  como el fichero y acaba en `Utils` ([Nomenclatura](./naming.md#ficheros)).
- **Un test por fichero:** cada fichero con código tiene su test al lado, y
  cada fichero de `src/pages/`, el suyo en `src/tests/pages/`, salvo los que
  solo declaran y el código base del kit
  ([Sencillez y tamaño](#sencillez-y-tamaño)).
<!-- kit:if i18n -->
- **La paridad de idiomas:** `src/i18n/` tiene un catálogo por idioma de la
  web, y todos con las mismas claves ([Textos](#textos)).
<!-- kit:end -->

Lo encuentra todo solo, con `import.meta.glob`: no hay que apuntar en él
ninguna página ni ningún fichero.

- **Cada regla es un solo `it`** que espera vacía la lista de lo que la rompe:
  si falla, enseña de una vez todos los ficheros que la rompen.
- **La caché de módulos de Vitest va apagada** (`fsModuleCache: false`, en
  `vitest.config.ts`): con ella, vería el `src/` de la vez anterior y pasaría
  aunque se rompiera una regla.
- **Una regla nueva** de esta normativa que se pueda comprobar leyendo el
  código se añade aquí, con su `describe`.

## Qué se revisa

Lo que mira `zaius-review` en una página, en un refactor o en el cambio en
curso, con las comprobaciones ya en verde
([Comprobar un cambio](../AGENTS.md#comprobar-un-cambio)). El agente que
revisa sin el contexto de la conversación lee cada fichero entero, con el
documento de la página, y lo mira en este orden, que es también el de sus
hallazgos, de lo más grave a lo menos:

1. **La página manda:** la página lee los datos y elige el estado; los
   componentes solo pintan lo que reciben por props
   ([Páginas](#páginas), [Componentes](#componentes) y
   [Dónde va cada cosa](#dónde-va-cada-cosa)).
2. **Las islas:** solo donde un `<script>` no basta, cada una con su
   directiva, y ninguna importa código que solo funciona en el servidor
   ([Islas](#islas)).
<!-- kit:if privateArea -->
3. **La sesión y los permisos:** cada página de la zona privada aplica su
   regla, y cada action y cada endpoint comprueban la sesión y el permiso
   antes de hacer nada ([Guardar](#guardar) y
   [Aplicar permisos](./guides/apply-permissions.md)).
4. **Los nombres:** el prefijo de origen, el tipo final, el verbo, el
   singular o el plural y, si los hay, los métodos de service
   ([Nomenclatura](./naming.md)).
5. **El código:** las condiciones en constantes con `? :` y `null`, ningún
   `&&` en el HTML, sin `any`, `import type`, el JSDoc y los tamaños
   ([Código](#código) y [Sencillez y tamaño](#sencillez-y-tamaño)).
<!-- kit:if i18n -->
6. **Los textos:** ninguno de usuario en el código, las claves de la
   nomenclatura y las mismas claves en todos los idiomas ([Textos](#textos)).
<!-- kit:else -->
6. **Los textos:** en el componente que los pinta, sin copiar los que ya
   escribe una pieza de toda la web, y el mismo dato con el mismo nombre en
   todas las páginas ([Textos](#textos)).
<!-- kit:end -->
7. **El diseño:** las normas, la pieza de cada papel y los tokens
   ([Normas de UX/UI](./ux-ui/rules.md) y
   [Piezas por papel](./ux-ui/design-system.md#piezas-por-papel)).
8. **Los tests:** uno al lado de cada fichero con código; cada test de la
   lista de la página, marcado y en verde; y cada cosa que pide su
   documento, con su test o en la verificación a mano
   ([Escribir tests](./guides/write-tests.md)).
9. **El documento dice lo que hace el código:** el de la página, en
   `docs/pages/`, con lo decidido al construirla, y lo que dependa de él (el
   backlog, el mapa del sitio, las guías).
<!-- kit:else -->
3. **Los nombres:** el prefijo de origen, el tipo final, el verbo y el
   singular o el plural
<!-- kit:if backend -->
   y los métodos de service
<!-- kit:end -->
   ([Nomenclatura](./naming.md)).
4. **El código:** las condiciones en constantes con `? :` y `null`, ningún
   `&&` en el HTML, sin `any`, `import type`, el JSDoc y los tamaños
   ([Código](#código) y [Sencillez y tamaño](#sencillez-y-tamaño)).
<!-- kit:if i18n -->
5. **Los textos:** ninguno de usuario en el código, las claves de la
   nomenclatura y las mismas claves en todos los idiomas ([Textos](#textos)).
<!-- kit:else -->
5. **Los textos:** en el componente que los pinta, sin copiar los que ya
   escribe una pieza de toda la web, y el mismo dato con el mismo nombre en
   todas las páginas ([Textos](#textos)).
<!-- kit:end -->
6. **El diseño:** las normas, la pieza de cada papel y los tokens
   ([Normas de UX/UI](./ux-ui/rules.md) y
   [Piezas por papel](./ux-ui/design-system.md#piezas-por-papel)).
7. **Los tests:** uno al lado de cada fichero con código; cada test de la
   lista de la página, marcado y en verde; y cada cosa que pide su
   documento, con su test o en la verificación a mano
   ([Escribir tests](./guides/write-tests.md)).
8. **El documento dice lo que hace el código:** el de la página, en
   `docs/pages/`, con lo decidido al construirla, y lo que dependa de él (el
   backlog, el mapa del sitio, las guías).
<!-- kit:end -->

Cada hallazgo va en una línea, con `fichero:línea`, la regla que rompe, con
su enlace, y la corrección propuesta:

```text
src/components/RoomsSection.astro:3 · Falta el prefijo de la página (docs/naming.md#prefijo-de-origen) · Renombrar a HomeRoomsSection.
```

<!-- kit:if existing -->
Mientras el proyecto se trae a estas reglas, la comprobación de la estructura
aún no está: lo que comprueba
([Comprobar la estructura](#comprobar-la-estructura)) se mira a mano, con lo
demás.

<!-- kit:end -->
### La revisión visual

Si la página se ve, se mira en el navegador, en el puerto %%REVIEW_PORT%%,
con su propio servidor (`%%PM%% run dev:review`), y nunca en el
%%HUMAN_PORT%%, que es el de la persona:

- **en los anchos del sistema de diseño, desde el móvil**
  ([Anchos](./ux-ui/design-system.md#anchos); por ejemplo, 360, 768 y
  1280 px), sin scroll horizontal de la página;
<!-- kit:if server -->
- **con los estados que toca:** el vacío, el error de una zona y, en un
  formulario, sus errores, el envío y lo que se ve al enviarlo
  ([D3](./ux-ui/rules.md#d3-estados-de-carga-error-y-vacío) y
  [D6](./ux-ui/rules.md#d6-formularios));
<!-- kit:else -->
- **con los estados que toca:** el vacío y la página que no existe
  ([D3](./ux-ui/rules.md#d3-estados-de-carga-error-y-vacío));
<!-- kit:end -->
- **con el teclado, con un lector de pantalla y con el zoom al 200 %**
  ([D12](./ux-ui/rules.md#d12-accesibilidad));
- **con «reducir movimiento»,** si algo se mueve
  ([D13](./ux-ui/rules.md#d13-movimiento));
- **buscadores y compartir,** en el HTML de la página: su título y su
  descripción, únicos; su imagen para compartir, de 1200 × 630 px; la
  dirección canónica; y `noindex` en las páginas que no son públicas y en
  las de error. El `site`, el mapa del sitio y el `robots.txt` los pone
  `zaius-publish` al publicar
  ([D14](./ux-ui/rules.md#d14-buscadores-y-compartir));
- **el rendimiento:** cada imagen, con `<Image>` o `<Picture>` y su tamaño;
  solo la primera que se ve, con `loading='eager'` y
  `fetchpriority='high'`; y el JavaScript que carga la página, el de sus
  `<script>` y sus islas, que sin islas es casi nada
  ([Imágenes y vídeo](./guides/create-a-page.md#imágenes-y-vídeo)).

Lo que no se puede mirar así (un móvil de verdad, la velocidad con la red de
un móvil, un correo que llega) va a la verificación a mano de la persona. En
el resumen, su línea: «✓ Revisión visual: <páginas>, en <anchos>, con
teclado, lector de pantalla, zoom al 200 % y reducir movimiento; título,
descripción e imagen para compartir; imágenes optimizadas».

**Al terminar, se para el servidor de revisión:** el `%%PM%% run dev:review`
que se arrancó, con Ctrl+C en su terminal o parando su tarea. Si se arrancó
`%%PM%% run dev` por error y se fue a segundo plano, se para con
`%%PM_EXEC%% astro dev stop`. El de la persona, en el %%HUMAN_PORT%%, no se
toca.

## Código

### TypeScript

- Estricto, sin `any` y sin casts innecesarios. Se prefiere la inferencia.
- Los imports de solo tipos usan `import type`.
- Sin `enum` ni `namespace`. Un enumerado es un objeto `as const` con
  nombres de la web (`ROOM_TYPE = { double: 0, … }`).
<!-- kit:if backend -->
- Los tipos de los datos de la API salen de los schemas de zod con
  `z.infer`; no se escriben a mano.
<!-- kit:end -->
- Las props de un componente `.astro` van en su `interface Props`, que Astro
  lee para tipar a quien lo usa.

```ts
// mal
enum RoomType { Double, Twin, Family }
// bien
export const ROOM_TYPE = { double: 0, twin: 1, family: 2 } as const
export type RoomType = (typeof ROOM_TYPE)[keyof typeof ROOM_TYPE]
```

### Páginas

- **Una página por URL,** en `src/pages/`, en la ruta de su URL
  ([Páginas y rutas](./naming.md#páginas-y-rutas)). Cómo se crea:
  [Crear una página](./guides/create-a-page.md).
<!-- kit:if backend -->
<!-- kit:if server -->
- **El frontmatter lee, decide y pinta:** pide los datos con los services
  (a la vez si son varios, con `Promise.allSettled`, para que una zona que
  falla pinte su error sin tumbar las demás),
<!-- kit:if privateArea -->
  aplica los permisos,
<!-- kit:end -->
  elige el estado de la página y pinta un layout con sus componentes. La
  lógica de más de unas líneas va a un util puro, con su test.
<!-- kit:else -->
- **El frontmatter lee, decide y pinta:** pide los datos con los services
  (`Promise.all` si son varios), elige el estado de la página y pinta un
  layout con sus componentes. La lógica de más de unas líneas va a un util
  puro, con su test.
<!-- kit:end -->
<!-- kit:else -->
<!-- kit:if content -->
- **El frontmatter lee, decide y pinta:** lee sus datos de `constants/` o de
  sus colecciones ([Los datos de la web](#los-datos-de-la-web)), elige el
  estado de la página y pinta un layout con sus componentes. La lógica de
  más de unas líneas va a un util puro, con su test.
<!-- kit:else -->
- **El frontmatter lee, decide y pinta:** lee sus datos de `constants/`
  ([Los datos de la web](#los-datos-de-la-web)), elige el estado de la
  página y pinta un layout con sus componentes. La lógica de más de unas
  líneas va a un util puro, con su test.
<!-- kit:end -->
<!-- kit:end -->
- **Su HTML es el orden de la página:** el layout, la portada o el `h1` y una
  línea por sección, cada una un componente.
- **Cada página da su título, su descripción y su imagen para compartir** al
  layout, por props; lo demás de los buscadores lo pone `BaseLayout.astro`
  ([D14](./ux-ui/rules.md#d14-buscadores-y-compartir)).
<!-- kit:if backend -->
<!-- kit:if server -->
- **Los estados** ([D3](./ux-ui/rules.md#d3-estados-de-carga-error-y-vacío)):
  no hay estado de carga, porque la página llega con sus datos; una zona
  lenta va en una isla de servidor (`server:defer`), con su esqueleto en
  `slot="fallback"`: es el único componente que lee sus datos, como una
  página. Un fallo de la API pinta el estado de error en la zona que falla.
<!-- kit:if privateArea -->
  Un registro que no existe (`apiErrorUtils.isNotFound`) pinta su estado
  vacío, con `Astro.response.status = 404`; y sin permiso, el aviso de que no
  se tiene acceso, dentro del marco y con un 403.
<!-- kit:end -->
  El detalle:
  [Carga, error y vacío](./guides/load-and-save-data.md#3-carga-error-y-vacío).
<!-- kit:else -->
- **Los estados** ([D3](./ux-ui/rules.md#d3-estados-de-carga-error-y-vacío)):
  no hay carga ni error en pantalla, porque los datos se piden en el build, y
  un fallo de la API lo para. El vacío sí: «Todavía no hay ninguna …». El
  detalle:
  [Carga, error y vacío](./guides/load-and-save-data.md#3-carga-error-y-vacío).
<!-- kit:end -->
<!-- kit:else -->
- **Los estados** ([D3](./ux-ui/rules.md#d3-estados-de-carga-error-y-vacío)):
  no hay carga ni error en pantalla, porque la página llega con sus datos. El
  vacío sí: una lista que se queda sin nada dice «Todavía no hay ninguna …».
<!-- kit:end -->
<!-- kit:if server -->
- **Se generan en el build, salvo las que dicen lo contrario.** Una página
  que necesita el servidor (un formulario,
<!-- kit:if privateArea -->
  la sesión,
<!-- kit:end -->
  datos de cada petición) lleva `export const prerender = false`; sin él, se
  pinta una vez al compilar, con los datos de ese momento.
- **Solo una página redirige** (`return Astro.redirect('/contact')`), en su
  frontmatter. Un componente no puede: la respuesta ya ha empezado.
<!-- kit:else -->
- **Se generan todas en el build,** con los datos de ese momento. Una ruta
  dinámica lleva `getStaticPaths` en la propia página, y una lista con
  páginas, `paginate()`.
<!-- kit:end -->

Así queda ROOMS, con las habitaciones de `constants/`:

```astro
---
import RoomsList from '@/components/RoomsList.astro'
import { ROOMS } from '@/constants/rooms'
<!-- kit:if i18n -->
import { getI18nT } from '@/i18n/i18n'
<!-- kit:end -->
import AppLayout from '@/layouts/AppLayout.astro'
<!-- kit:if i18n -->

const t = getI18nT(Astro.currentLocale)
<!-- kit:end -->
---

<!-- kit:if i18n -->
<AppLayout title={t('rooms.title')} description={t('rooms.description')} image='/share/rooms.png'>
  <h1>{t('rooms.title')}</h1>
<!-- kit:else -->
<AppLayout title='Habitaciones' description='Tres habitaciones de piedra y madera, para dos o para cuatro, con desayuno casero.' image='/share/rooms.png'>
  <h1>Habitaciones</h1>
<!-- kit:end -->
  <RoomsList rooms={ROOMS} />
</AppLayout>
```

<!-- kit:if backend -->
Con las noches libres de cada habitación, la página las pide también al
service y se las pasa a la lista
([Un dato](./guides/load-and-save-data.md#2-un-dato)).

<!-- kit:end -->
### Componentes

<!-- kit:if backend -->
- **Un componente pinta lo que recibe.** Sus datos le llegan por props, ya
  listos, y nunca llama a un service. Si una pieza necesita un dato, se lo
  pide su página y se lo pasa.
<!-- kit:else -->
- **Un componente pinta lo que recibe.** Sus datos le llegan por props, ya
  listos. Si una pieza necesita un dato, se lo lee su página y se lo pasa.
<!-- kit:end -->
- **Renderizado condicional:** cada condición va en una constante con nombre,
  en el frontmatter (`const hasPhotos = room.photos.length > 0`,
  `const isFamily = room.type === ROOM_TYPE.family`), y en el HTML se aplica
  siempre con `? :`, con `null` en la rama que no pinta; nunca con `&&`. Un
  ternario anidado vale si cada condición es una de esas constantes. Un
  booleano que ya tiene nombre (una prop como `compact`) ya es esa
  constante. Las condiciones de un atributo
  (`aria-current={isActive ? 'page' : undefined}`) no son renderizado
  condicional y pueden ir en línea.
<!-- kit:if i18n -->
- **El frontmatter solo prepara lo que pinta:** las condiciones, `t` y las
  etiquetas. Lo que transforma un dato va a un util puro, que devuelve justo
  lo que pinta la pieza (el precio de una estancia).
<!-- kit:else -->
- **El frontmatter solo prepara lo que pinta:** las condiciones y las
  etiquetas. Lo que transforma un dato va a un util puro, que devuelve justo
  lo que pinta la pieza (el precio de una estancia).
<!-- kit:end -->
- **Lo que envuelve llega por `<slot />`,** no por una prop con HTML; con
  varios huecos, slots con nombre (`<slot name='actions' />`).
- **Un `<script>` para lo pequeño:** abrir el menú del móvil, pasar las fotos
  de una galería, abrir un `<dialog>`, avisar de un mensaje sin enviar. Va
  dentro del componente, y Astro lo empaqueta una vez aunque el componente
  salga varias veces. Sin estado de cliente que crezca: eso es una isla
  ([Islas](#islas)).

```astro
---
// mal: la condición en el HTML y `&&`
---

{room.photos.length > 0 && <RoomPhotosGallery photos={room.photos} />}
```

```astro
---
// bien: la condición en una constante, y `? :` con `null`
const hasPhotos = room.photos.length > 0
---

{hasPhotos ? <RoomPhotosGallery photos={room.photos} /> : null}
```

```astro
---
// mal: el frontmatter calcula
const total = room.pricePerNight * nights + (nights >= 7 ? 0 : cleaningFee)
---
```

```astro
---
// bien: un util puro devuelve lo que pinta la pieza
const total = roomPriceUtils.buildRoomStayPrice(room, nights)
---
```

### Islas

Una isla es un componente que Astro pinta en el servidor, como los demás, y
que después se pone en marcha en el navegador, con su JavaScript.

- **No hay ninguna al instalar.** La primera llega cuando hace falta, con
  React y el OK de la persona, porque es una dependencia nueva: cómo se
  añade, en [Añadir una isla](./guides/add-an-island.md).
- **Solo donde hay estado en el cliente que un `<script>` no lleva bien:** un
  buscador que filtra mientras se elige, un asistente, un calendario. Lo
  demás es `.astro`.
- **Cada una con su directiva, elegida a propósito**
  ([La directiva](./guides/add-an-island.md#3-la-directiva)):
  `client:visible` por defecto; `client:idle` si tiene que estar lista
  pronto; `client:load` solo si se usa nada más cargar.
<!-- kit:if i18n -->
- **Props serializables:** datos, nunca funciones ni instancias de clases. Los
  textos le llegan ya traducidos, por props: la isla no usa i18n.
<!-- kit:else -->
- **Props serializables:** datos, nunca funciones ni instancias de clases.
<!-- kit:end -->
<!-- kit:if server -->
<!-- kit:if backend -->
- **Nunca importa código que solo funciona en el servidor:** ni services, ni
  `src/actions/`, ni el middleware, ni `astro:env/server`. Si envía algo, lo
  hace con las actions de `astro:actions`; si tiene que leer, pide a un
  endpoint de `pages/api/`.
<!-- kit:else -->
- **Nunca importa código que solo funciona en el servidor:** ni
  `src/actions/`, ni el middleware, ni `astro:env/server`. Si envía algo, lo
  hace con las actions de `astro:actions`; si tiene que leer, pide a un
  endpoint de `pages/api/`.
<!-- kit:end -->
<!-- kit:else -->
- **Nunca importa código que solo funciona en el servidor**
  (`astro:env/server`): todo lo que necesita le llega por props, porque una
  web sin servidor no tiene a quién pedir.
<!-- kit:end -->
- **Dentro, las reglas de los componentes:** un solo `return`; cada
  condición, en una constante con nombre, y en el JSX, `? :` con `null`,
  nunca `&&`. Entre las piezas de la isla, las props de función se llaman
  `onX` (`onChange`), y un handler local que hace algo más que relanzar la
  prop, `handleX`. La lógica con estado que no pinta va a un hook de
  `hooks/`, que nace con el primero.

<!-- kit:if i18n -->
```astro
<RoomsSearch client:visible rooms={rooms} labels={labels} />
```
<!-- kit:else -->
```astro
<RoomsSearch client:visible rooms={rooms} />
```
<!-- kit:end -->

### Datos

<!-- kit:if backend -->
<!-- kit:if server -->
- **Los datos los pide la página,** en su frontmatter, con los services; si
  son varios, a la vez, con `Promise.allSettled`, para que una zona que falla
  pinte su error sin tumbar las demás. Un componente nunca llama a un
  service, salvo una isla de servidor (`server:defer`). El detalle está en
  [Cargar y guardar datos](./guides/load-and-save-data.md).
<!-- kit:else -->
- **Los datos los pide la página,** en su frontmatter, con los services, al
  compilar; si son varios, a la vez, con `Promise.all`. Un componente nunca
  llama a un service. El detalle está en
  [Cargar y guardar datos](./guides/load-and-save-data.md).
<!-- kit:end -->
- **Lo demás se escribe en el proyecto:** las habitaciones, en
  `constants/` ([Los datos de la web](#los-datos-de-la-web)).
<!-- kit:else -->
<!-- kit:if content -->
- **Los datos los lee la página,** en su frontmatter, de `constants/` o de
  sus colecciones ([Los datos de la web](#los-datos-de-la-web)). Un
  componente los recibe por props.
<!-- kit:else -->
- **Los datos los lee la página,** en su frontmatter, de `constants/`
  ([Los datos de la web](#los-datos-de-la-web)). Un componente los recibe
  por props.
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if server -->
<!-- kit:if backend -->
- **Zod valida** lo que llega de fuera: lo que envía un formulario (el
  `input` de cada action), los parámetros de la ruta, la query de la URL y
  las respuestas de la API. Un campo que llega `null` y se usa como
  recuento, lista o texto se normaliza en el propio schema con `.transform`.
<!-- kit:else -->
- **Zod valida** lo que llega de fuera: lo que envía un formulario (el
  `input` de cada action), los parámetros de la ruta y la query de la URL.
<!-- kit:end -->
- **No hay estado de cliente que sobreviva a la página.** Lo que tiene que
  durar va en la URL, que lee el servidor: los filtros, la página y el orden
  de una lista, en su query. Así sobreviven a recargar y a compartir el
  enlace. Nada va en el `sessionStorage`.
<!-- kit:if privateArea -->
- **Al cerrar la sesión no queda nada de la persona anterior:** el navegador
  no guarda sus datos, así que basta con borrar la cookie de la sesión.
- **La caché se decide por ruta,** en el documento de su página: con
  `Astro.cache.set` en la página o con `routeRules` en `astro.config.ts`.
  Solo se cachea lo que es igual para todas las personas; una página que
  depende de la sesión, nunca.
<!-- kit:else -->
- **La caché se decide por ruta,** en el documento de su página: con
  `Astro.cache.set` en la página o con `routeRules` en `astro.config.ts`.
  Solo se cachea lo que es igual para todas las personas.
<!-- kit:end -->
<!-- kit:else -->
<!-- kit:if backend -->
- **Zod valida** los parámetros de la ruta y las respuestas de la API. Un
  campo que llega `null` y se usa como recuento, lista o texto se normaliza
  en el propio schema con `.transform`.
<!-- kit:end -->
- **Los datos son los del último build:** un cambio se ve al compilar y
  publicar otra vez. No hay caché que decidir.
- **El build no ve la query de la URL:** una lista pagina en la ruta
  (`/blog/page/2`, con `paginate()`), y lo que depende de la query (la foto
  abierta de una galería) lo resuelve el navegador, con un `<script>`. Nada
  va en el `sessionStorage`.
<!-- kit:end -->

<!-- kit:if backend -->
```ts
// mal: el schema deja el null y cada uso lo comprueba
note: z.string().nullable(),
// bien: el schema lo normaliza una vez
note: z.string().nullable().transform((value) => value ?? ''),
```

<!-- kit:end -->
### Los datos de la web

<!-- kit:if backend -->
Lo que no sale de la API se escribe en el proyecto:
<!-- kit:else -->
Todo lo que se ve se escribe en el proyecto:
<!-- kit:end -->

<!-- kit:if i18n -->
- **Los textos,** en los catálogos de cada idioma ([Textos](#textos)).
<!-- kit:else -->
- **Los textos,** en la página o el componente que los pinta
  ([Textos](#textos)).
<!-- kit:end -->
<!-- kit:if content -->
- **Los textos largos** (una entrada del blog, un sitio del entorno), en las
  colecciones de contenido ([Añadir contenido](./guides/add-content.md)).
<!-- kit:end -->
- **Lo que se repite o cambia a menudo** (las habitaciones y sus precios, el
  horario de llegada, las temporadas), en `constants/`: un fichero por tema,
  con su tipo (`constants/rooms.ts`, que exporta `ROOMS`, con el tipo `Room`
  de `types/room.ts`). La página lo lee y lo pasa por props.
- **Cambiarlos no es cambiar la página.** Si la persona pide un dato o un
  texto nuevo («La Encina pasa a 90 € la noche»), se cambia, se comprueba y
  se dice dónde verlo, sin documento ni boceto
  ([La persona decide](./process.md#la-persona-decide)). Lo que cambia qué
  se ve o qué se puede hacer sí es una página.

<!-- kit:if server -->
### Guardar

- **Una action por envío o guardado** (`defineAction`), en el fichero de su
  página o su sección (`src/actions/contactActions.ts`, que exporta
  `contactActions`). `index.ts` las compone
  (`export const server = { contact: contactActions }`), y se llaman como
  `actions.contact.sendContactMessage`
  ([Actions y endpoints](./naming.md#actions-y-endpoints)).
- **Su `input` es el schema del formulario** (`contactFormSchema`, al lado,
  en `actions/`), con `accept: 'form'` si la llama un `<form>`. Un campo
  vacío llega como `null`: el mensaje de obligatorio va en
  `z.string({ error: '…' })`, además de en `.trim().min(1, '…')`.
<!-- kit:if privateArea -->
- **En la zona privada, el handler comprueba la sesión y el permiso antes de
  llamar al service:** sin sesión (`context.locals.session` es `null`),
  `ActionError` con `UNAUTHORIZED`; sin permiso, `FORBIDDEN`. La regla de
  permisos es la misma que aplica la página.
<!-- kit:end -->
- **Los formularios funcionan sin JavaScript:** un
  `<form method='POST' action={actions.contact.sendContactMessage}>` en un
  componente `.astro`, en una página con `prerender = false`. El middleware
  hace el post/redirect/get con `getActionContext`: si sale bien, responde
  con un 303 a la misma ruta (o a la que diga la action); si un campo está
  mal, la página se pinta otra vez, con un 400, y lee los errores con
  `Astro.getActionResult(...)` e `isInputError(result.error)`
  (`result.error.fields.email`). Sin librería de formularios:
  [Crear un formulario](./guides/create-a-form.md).
- **La action envía el mensaje ella misma,** al servicio de correo que
  elige la persona, con su clave en una variable secreta del `env.schema`
  (`MAIL_API_KEY`); adónde llegan los mensajes lo dice el documento de la
  página, o se pregunta
  ([Crear un formulario](./guides/create-a-form.md#adónde-llega-el-mensaje)).
<!-- kit:if backend -->
  Si lo que se envía va al sistema de la empresa, es un endpoint más de su
  API, con su service.
<!-- kit:end -->
- **Un endpoint solo para lo que es HTTP de verdad:**
<!-- kit:if privateArea -->
  descargar la factura de una reserva
  (`src/pages/api/account/bookings/[id]/invoice.pdf.ts`), un webhook.
<!-- kit:else -->
  un fichero que se genera en cada petición, un webhook.
<!-- kit:end -->
  Es fino: valida con zod lo que recibe, hace lo suyo y responde
  (`export const GET: APIRoute`), y lleva `export const prerender = false`.
  Enviar un formulario no es un endpoint: es una action.

```ts
export const contactActions = {
  /**
   * Envía el mensaje del formulario de contacto al correo de la casa.
   * @throws {ActionError} `INTERNAL_SERVER_ERROR` si no se ha podido enviar.
   */
  sendContactMessage: defineAction({
    accept: 'form',
    input: contactFormSchema,
    handler: async (values) => {
      await sendMail(values)
    },
  }),
}
```
<!-- kit:if privateArea -->

Una action de la zona privada, con la sesión y el permiso:

```ts
export const accountActions = {
  /**
   * Cancela una reserva, desde su gestión.
   * @throws {ActionError} `UNAUTHORIZED` sin sesión; `FORBIDDEN` sin permiso de cancelar.
   */
  cancelBooking: defineAction({
    accept: 'form',
    input: bookingCancelFormSchema,
    handler: async ({ id, reasonId }, context) => {
      const session = context.locals.session
      if (session === null) throw new ActionError({ code: 'UNAUTHORIZED' })
      if (!bookingPermissionUtils.getAccountBookingsEditPermissions(session.permissions).canCancel) throw new ActionError({ code: 'FORBIDDEN' })
      await bookingsService.cancelBooking(id, { reasonId })
    },
  }),
}
```
<!-- kit:end -->

<!-- kit:end -->
### Textos

<!-- kit:if i18n -->
- Ningún texto de usuario va en el código: todo sale de i18n.
- **`t` se pide en el frontmatter** de la página o del componente que pinta el
  texto, fija al idioma de la petición:
  `const t = getI18nT(Astro.currentLocale)`. Un idioma que no es de la web
  usa el de por defecto.
- **Un catálogo por idioma,** `src/i18n/<idioma>.json`, con las claves
  agrupadas por página: `rooms.title`, `contact.form.email`,
  `legal.notice.title`, `common.actions.send`
  ([Nomenclatura](./naming.md#textos-i18n)).
- **La configuración** está en `src/i18n/i18n.ts`: una instancia de i18next
  con los catálogos de `src/i18n/`. Los idiomas son los de `APP_LANGUAGES`
  (%%LANGUAGES%%), en `src/constants/appLanguages.ts`, y el de por defecto,
  `APP_DEFAULT_LANGUAGE` (`%%DEFAULT_LANGUAGE%%`). `astro.config.ts` les da
  sus rutas: el de por defecto, sin prefijo (`/rooms`), y los demás, con el
  suyo (`/en/rooms`), con la misma página.
- Un número que concuerda va en `count`, y la clave tiene sus formas en
  singular y plural (`_one` y `_other`): «1 noche», «2 noches»
  ([D11](./ux-ui/rules.md#d11-textos-y-formato)).
- Las piezas del sistema de diseño reciben siempre sus textos desde i18n,
  aunque traigan los suyos
  ([D1](./ux-ui/rules.md#d1-el-sistema-de-diseño-primero)).
<!-- kit:if server -->
- **Los errores de un schema de formulario son claves**
  (`'common.formErrors.required'`): el schema no sabe el idioma de la
  petición, y el formulario las pinta con `t()`.
<!-- kit:end -->
<!-- kit:if backend -->
- Las claves que manda la API se resuelven contra claves propias, con el texto
  de la API como valor por defecto.
<!-- kit:end -->
- **Cambiar de idioma es un enlace** a la misma página en el otro idioma
  (`getRelativeLocaleUrl`). `<html lang>` es el idioma de la petición: lo
  pone `BaseLayout.astro`.
- La [comprobación de la estructura](#comprobar-la-estructura) mira que todos
  los idiomas tengan las mismas claves.
<!-- kit:else -->
- La web tiene un solo idioma, `APP_DEFAULT_LANGUAGE` (`%%DEFAULT_LANGUAGE%%`),
  en `src/constants/appLanguages.ts`. No hay i18next ni catálogos.
- **Los textos van escritos en el componente que los pinta,** en el HTML o en
  una constante del frontmatter. El texto de una pieza compartida va con
  ella; el de una página se queda en sus componentes.
- Las piezas del sistema de diseño reciben siempre sus textos desde la web,
  aunque traigan los suyos
  ([D1](./ux-ui/rules.md#d1-el-sistema-de-diseño-primero)).
- Un número que concuerda tiene su forma en singular y en plural: «1
  noche», «2 noches» ([D11](./ux-ui/rules.md#d11-textos-y-formato)).
<!-- kit:if backend -->
- Los códigos que manda la API se resuelven contra textos propios, con el
  texto de la API como valor por defecto.
<!-- kit:end -->
- `<html lang>` es el idioma de la web: lo pone `BaseLayout.astro`.
- Para pasar a varios idiomas, la skill `zaius-languages` lleva los
  textos a catálogos y activa la prueba de que todos tienen las mismas claves.
<!-- kit:end -->
- **Las fechas, los números, los precios y los porcentajes se formatean con
  las funciones de la raíz,** en `formatUtils`, que nace con la primera
  página que formatea un dato. Ninguna pieza formatea a mano, y todas dan «-»
  si falta el dato ([D11](./ux-ui/rules.md#d11-textos-y-formato)):

  | Función | Recibe | Da |
  |---|---|---|
  | `formatUtils.formatDate(value)` | Una fecha, en `yyyy-mm-dd` | La fecha, sin moverse por la zona horaria |
  | `formatUtils.formatDateTime(value)` | Un momento | La fecha y la hora, en la zona horaria de la máquina que pinta |
  | `formatUtils.formatNumber(value, decimals = 0)` | Una cifra y sus decimales | «1.500»; una media, con `1`: «4,8» |
  | `formatUtils.formatPrice(value)` | Un importe en euros | «95 €»; con céntimos, «95,50 €» |
  | `formatUtils.formatPercent(value)` | Un porcentaje de 0 a 100 | «10 %», entero |

  Una función nueva de formato se añade a este objeto y a esta tabla. Las
  páginas se pintan en el servidor o en el build, no en el navegador: la
  hora sale en la zona horaria de esa máquina, y la publicación la fija a la
  de la web.

### Estilos

- **En un `.astro`, `<style>` dentro del componente:** Astro lo limita al
  componente. Nunca el atributo `style` ni `!important`. Las clases que
  dependen de un dato van con `class:list`.
- Siempre los tokens del sistema de diseño
  ([Tokens](./ux-ui/design-system.md#tokens)), nunca un color suelto.
- Los estilos globales solo tienen lo que no puede ir en un componente: van
  en `src/styles/` y los importa una vez `BaseLayout.astro`. `:global()`
  solo para el HTML que el componente no pinta (el de un `<slot />`, el de
  un Markdown).

### Comentarios

- Toda función que no es un componente lleva un JSDoc corto, siempre con la
  misma forma: [Nomenclatura](./naming.md#jsdoc).
<!-- kit:if server -->
  Cada action lleva el suyo, como cualquier función.
<!-- kit:end -->
- Sin comentarios en el cuerpo de las funciones, en el frontmatter ni en el
  HTML de un componente.
- Sin comentarios en las constantes, los schemas ni la configuración: su
  nombre dice lo que son.
- El código está en inglés y el JSDoc en castellano. Describe el proyecto por
  sí mismo, sin referencias a otros proyectos.

## Rutas y navegación

Esta parte es la técnica. Cómo se ve y cómo se comporta la navegación está en
[D10](./ux-ui/rules.md#d10-navegación).

<!-- kit:if privateArea -->
- **URLs.** Las páginas cuelgan de la raíz (`/rooms`, `/contact`,
  `/legal/notice`), y `/` es la portada. La zona privada cuelga de
  `/account/` (`/account/bookings`), y su entrada es `/login`; lo demás de la
  web es público. `/account/bookings/[id]` no es una ruta: un registro tiene
  una sola página, su gestión
  ([D7](./ux-ui/rules.md#d7-un-registro-una-pantalla)).
<!-- kit:else -->
- **URLs.** Las páginas cuelgan de la raíz (`/rooms`, `/contact`,
  `/legal/notice`), y `/` es la portada.
<!-- kit:end -->
  La ruta del fichero es la URL: `/legal/notice` es
  `src/pages/legal/notice.astro`
  ([Páginas y rutas](./naming.md#páginas-y-rutas)).
<!-- kit:if i18n -->
- **Idiomas.** El idioma por defecto no lleva prefijo (`/rooms`) y los
  demás, sí (`/en/rooms`); los dos los pinta la misma página, con
  `Astro.currentLocale`. Un enlace de la web se arma con
  `getRelativeLocaleUrl(Astro.currentLocale ?? APP_DEFAULT_LANGUAGE, '/rooms')`,
  para seguir en el idioma de la página (ojo: termina en `/`).
<!-- kit:end -->
<!-- kit:if server -->
- **Páginas de error.** La página que no existe (`src/pages/404.astro`) y el
  error inesperado (`src/pages/500.astro`) se pintan dentro de la web, con
  su marco, una salida y `noindex`.
<!-- kit:else -->
- **Página de error.** La página que no existe (`src/pages/404.astro`) se
  pinta dentro de la web, con su marco, una salida y `noindex`.
<!-- kit:end -->
- **Lo que aún no está hecho no tiene página ni entrada en el menú.** Una
  página entra en el menú cuando se hace.
<!-- kit:if privateArea -->
- **Sesión.** La abre el middleware (`src/middleware.ts`, con `sequence`) en
  cada petición:
  - salta las páginas que se generan en el build (`context.isPrerendered`),
    que son todas las públicas;
  - lee la cookie de la sesión y deja en `Astro.locals.session` la persona y
    sus permisos, o `null` (su tipo, en `src/env.d.ts`);
  - corre la petición con `apiSessionUtils.run`, con el token de esa cookie;
  - sin sesión, lleva al login lo que cuelga de `/account/`, y al entrar se
    vuelve a la ruta pedida si la persona puede verla; si no, a
    «Mis reservas»;
  - si la API la cierra (un `401`), borra la cookie y lleva al login, con el
    aviso de que ha caducado.

  La sesión es la de la web, en su cookie: no se usa `Astro.session`.
- **Permisos.** Los permisos de la sesión son `SECCIÓN.ACCIÓN`
  (`BOOKINGS.VIEW`, `BOOKINGS.EDIT`, `BOOKINGS.CANCEL`). Cada regla es una
  función pura de un objeto de utils, con su test:
  `bookingPermissionUtils.getAccountBookingsEditPermissions(permissions)` da
  `{ canView, canEdit, canCancel }`. La página la aplica en su frontmatter, y
  cada action, en su handler. Sin permiso de ver, la página pinta dentro del
  marco el aviso de que no se tiene acceso, con un 403: no redirige ni existe
  una página `/403`. Cómo se aplica a una página, un botón, una zona o una
  action: [Aplicar permisos](./guides/apply-permissions.md).
<!-- kit:else -->
- **Sin sesión ni permisos.** Todo lo que se publica lo ve cualquiera. Una
  zona privada, con su entrada y sus permisos, llega con
  `%%KIT_RUN%% change`.
<!-- kit:end -->
- **Menú y pie.** `src/constants/appNavigation.ts` es la única fuente de los
  dos: `APP_NAVIGATION`, el menú, y `APP_FOOTER_NAVIGATION`, los enlaces del
  pie. Añadir una página al menú es añadir su entrada ahí. Los pinta
  `AppLayout.astro`, que marca la entrada de la página en la que se está
  con `aria-current="page"`, mirando `Astro.url.pathname`; una página que no
  está en el menú deja marcada la entrada de la que cuelga (una entrada del
  blog, «Blog»). Sus tipos (`NavEntry` y `NavGroup`, una entrada con un
  submenú) están en `types/navigation.ts`.
<!-- kit:if privateArea -->
  - Cada entrada de la zona privada lleva el permiso que pide su página;
    `navigationUtils.filterNavMenu` deja lo que ve la persona. En las páginas
    públicas, que se generan sin sesión, la entrada se ve, y el middleware
    lleva al login a quien no ha entrado
    ([El menú](./guides/apply-permissions.md#6-el-menú)).
<!-- kit:end -->
  - Cómo se añade una entrada: [El menú](./guides/create-a-page.md#5-el-menú).
- **Títulos.** Cada página pasa su `title` al layout, y `BaseLayout.astro`
  pone en la pestaña del navegador «<título> · %%APP_NAME%%». El título de
  una página del menú es el de su entrada.
<!-- kit:if privateArea -->
  El de la gestión de un registro, «Reserva #1287», aunque su `h1` diga
  «Gestiona la reserva #1287».
- **Pestañas.** Las de la gestión de un registro van en `?tab=`
  (`/account/bookings/1287/edit?tab=guests`), y la primera no lleva
  parámetro. Se pintan todas, y un `<script>` del componente de las
  pestañas cambia de una a otra sin recargar y pone `?tab=` con
  `history.replaceState`. Así no se pierde lo escrito en el formulario. La
  que se abre al entrar la lee la página de `?tab=`; una que no existe, o que
  la persona no puede ver, abre la primera.
<!-- kit:end -->
- **Enlaces.** Lo que lleva a otra página es un enlace (`<a href>`), con
  aspecto de botón donde toque.
<!-- kit:if server -->
  Lo que hace algo sin cambiar de página es un botón: el de un `<form>` si
  envía, o uno con un `<script>` si solo abre algo (un `<dialog>`).
<!-- kit:else -->
  Lo que hace algo sin cambiar de página es un botón, con un `<script>`
  (abrir el menú del móvil).
<!-- kit:end -->
  Un enlace externo se abre en una pestaña nueva y lo dice en su nombre
  accesible.
<!-- kit:if privateArea -->
- **Volver.** Solo tienen salida la gestión de un registro y las páginas que
  cuelgan de otra: un enlace a la lista o a la página de la que cuelgan. Como
  los filtros de una lista van en su URL, el enlace que abre un registro
  desde ella le pasa esa URL en `?back=`, y la salida vuelve a ella si es una
  ruta de la web (empieza por `/` y no por `//`); si no, a la lista.
<!-- kit:else -->
- **Volver.** Solo tienen salida las páginas que cuelgan de otra (una
  entrada del blog): un enlace a la página de la que cuelgan. A lo demás se
  vuelve con el menú.
<!-- kit:end -->
<!-- kit:if server -->
- **Historial.** Un formulario enviado responde con un 303
  (post/redirect/get): ir atrás no lo envía otra vez, y recargar tampoco.
<!-- kit:end -->
- **Scroll y foco.** Cada página es un documento nuevo: el navegador la
  abre arriba, con el foco al principio, donde lo primero del tabulador es
  el enlace para saltar al contenido; atrás y adelante recuperan el scroll de
  antes. Por eso la web no usa `<ClientRouter />` (las transiciones de vista
  de Astro), que cambiaría todo esto.
<!-- kit:if existing -->

## Traer un proyecto que ya existe

Lo que mira `zaius-adopt` en el código que ya había, sin mover nada, para
escribir el plan que lo trae a esta normativa. Cada punto, con cuántos casos
hay y un par de ejemplos, con `fichero:línea`, en este orden:

1. **La estructura de `src`** y dónde va cada cosa: las carpetas que sobran
   o que tienen otro nombre, y las subcarpetas de `components/`
   ([Organización de src](#organización-de-src) y
   [Dónde va cada cosa](#dónde-va-cada-cosa)).
2. **Las páginas:** cada URL, con su fichero en `src/pages/` en la ruta de su
   URL, y nada que no sea una ruta dentro de `src/pages/`
   ([Páginas y rutas](./naming.md#páginas-y-rutas)).
3. **Los nombres:** páginas, componentes, utils, constantes y, si los hay,
   services ([Revisar los nombres](./naming.md#revisar-los-nombres)).
4. **La página manda:** los componentes que leen sus datos o llaman a la
   red, y la lógica que se calcula en el frontmatter
   ([Páginas](#páginas) y [Componentes](#componentes)).
5. **Las islas:** cuáles hay, con qué framework y con qué directiva; las que
   pueden quedarse en `.astro` con un `<script>`; y las que no son de React,
   que se dicen en el plan ([Islas](#islas)).
6. **Los datos:** lo que se escribe a mano en las páginas y debe ir a
   `constants/`, las colecciones de contenido y lo que se pide a otro sistema
   ([Datos](#datos)).
7. **Buscadores y compartir:** el título, la descripción y la imagen de cada
   página, `site`, el mapa del sitio y `robots.txt`
   ([D14](./ux-ui/rules.md#d14-buscadores-y-compartir)).
8. **Los tests que faltan,** al lado de cada fichero con código y, los de las
   páginas, en `src/tests/pages/`
   ([Sencillez y tamaño](#sencillez-y-tamaño)).
9. **El stack:** la versión de Astro, el adaptador, las integraciones y lo
   que falta o sobra respecto a
   [Stack y comandos](../AGENTS.md#stack-y-comandos).

Lo que ya hay entra en el backlog: una página por URL, con su documento en
[Páginas](./pages/README.md), «hecha» si funciona como dice su documento o
«pendiente» si le falta algo. Los bloques del plan van del más seguro al más
grande: los documentos de las páginas, los nombres (con `/zaius-rename`), lo
que pinta cada componente y lo que lee cada página, los datos, los buscadores
y los tests; el último, el código base del kit, con `%%KIT_RUN%% change`.
<!-- kit:end -->
