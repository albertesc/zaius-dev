# Páginas

Cada página de %%APP_NAME%% tiene aquí su documento: para qué es, sus
secciones, su contenido, sus datos y su lista de tests. Es a la vez la
especificación de la página, antes de construirla, y lo que hace hoy, cuando
ya está hecha: el código cumple su documento, y el documento dice siempre lo
que hace el código, escrito como si siempre hubiera sido así, sin «antes» ni
«ahora».

Lo crea `/zaius-backlog` al apuntar la página, en «pendiente»; lo escribe
`/zaius-page`, con la persona, y lo pone al día `/zaius-review` al cerrarla
([El flujo](../process.md#el-flujo)). Lo que depende de un documento cambia
con él: las normas, las guías y el [backlog](../backlog.md).

**En esta página:** [El nombre y el fichero](#el-nombre-y-el-fichero), [Plantilla](#plantilla), [Cómo se escribe](#cómo-se-escribe), [Índice](#índice), [Lo que no es una página](#lo-que-no-es-una-página)

## El nombre y el fichero

- **El nombre de una página** es el prefijo de su URL
  ([Páginas y rutas](../naming.md#páginas-y-rutas)) en mayúsculas, con un
  guion entre palabras: `/` es HOME; `/rooms`, ROOMS; `/legal/notice`,
  LEGAL-NOTICE; `/blog/[...slug]`, BLOG-POST.
- **Su documento** es `docs/pages/<NOMBRE>.md` (`docs/pages/ROOMS.md`), y
  empieza por su nombre, para que el `@` de la IA lo liste
  (`/zaius-build @docs/pages/RO`).
- **Su estado** va en su cabecera, con la fecha, y el backlog lo repite:
  pendiente, por aprobar, aprobada, en curso, por cerrar y hecha
  ([Los estados](../process.md#los-estados-de-una-página)).

## Plantilla

Todos los documentos tienen los mismos apartados, en este orden. Se escriben
sin dudas abiertas: las que salen se resuelven con la persona en el momento y
quedan escritas.

```markdown
# ROOMS: Las habitaciones

URL: `/rooms`. Estado: por aprobar el AAAA-MM-DD

## Para qué

Como pareja que busca una escapada, quiero ver cada habitación con sus fotos,
cuántos caben y su precio, para elegir la mía y pedir disponibilidad.

Llamada a la acción: «Pide disponibilidad», que lleva a `/contact`.

## Secciones

1. **Portada:** el título, una frase y la foto de la casa (portada de una
   página).
2. **Las habitaciones:** una tarjeta por habitación, con su foto, su nombre,
   cuántas personas caben y su precio por noche (tarjeta de contenido).
3. **Pide disponibilidad:** una frase y el botón (llamada a la acción).

## Contenido

- Los textos: los da la persona antes de construirla; mientras, los del
  boceto.
- Las fotos: tres por habitación, las da la persona; con su texto
  alternativo.

## Datos

- Las habitaciones, de `ROOMS` (`src/constants/rooms.ts`): las cambia la
  persona pidiéndolo, sin documento.

## Buscadores y compartir

- Título: «Habitaciones». Descripción: «Tres habitaciones de piedra y
  madera, para dos o para cuatro, con desayuno casero.»
- Imagen para compartir: `public/share/rooms.png`.

## Rendimiento

- La primera foto, la de la portada, carga enseguida; las demás, al
  acercarse.

## Tests

| Test | Nivel | En verde |
|---|---|---|
| Enseña una tarjeta por habitación, con su precio por noche | página | |
| Lleva su título, su descripción y su imagen para compartir | página | |
| Se lee entera a 360 px, sin scroll horizontal | verificación manual | |

## Decisiones

Ninguna todavía.

## Verificación a mano

La rellena `zaius-review`.
```

Lo que lleva cada apartado:

- **La cabecera:** el nombre y el título de la página, separados por dos puntos,
  y debajo su URL y su estado con la fecha. Una página con parámetro lo dice en
  la URL (`/blog/[...slug]`).
- **Para qué:** su historia, la del backlog («Como…, quiero…, para…»), y su
  llamada a la acción: lo que se quiere que haga quien llega (llamar, pedir
  disponibilidad, leer más), con su texto y adónde lleva.
- **Secciones:** de arriba abajo, cada una con lo que enseña y la pieza que
  la pinta, por su papel
  ([Piezas por papel](../ux-ui/design-system.md#piezas-por-papel)). El
  nombre de su componente lo pone la nomenclatura al construirla.
- **Contenido:** los textos de verdad o quién los da y cuándo; las imágenes
  y el vídeo, de dónde salen, con su texto alternativo. Nunca «Lorem
  ipsum»: lo que falta se pregunta.
<!-- kit:if backend -->
- **Datos:** de dónde sale cada dato que se ve y quién lo cambia: un
  fichero de `constants/`, una colección de contenido o la API, con su
  método de service y su endpoint
  ([Añadir un servicio](../guides/add-a-service.md)).
<!-- kit:else -->
<!-- kit:if content -->
- **Datos:** de dónde sale cada dato que se ve y quién lo cambia: un
  fichero de `constants/` o una colección de contenido
  ([Añadir contenido](../guides/add-content.md)).
<!-- kit:else -->
- **Datos:** de dónde sale cada dato que se ve y quién lo cambia: el texto
  de la página o un fichero de `constants/`
  ([Los datos de la web](../standards.md#los-datos-de-la-web)).
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if server -->
  Lo que se envía o se guarda, con su action, y si la página se pinta en
  cada petición.
<!-- kit:end -->
<!-- kit:if privateArea -->
  Quién puede verla y qué puede hacer cada uno, con sus permisos
  ([Aplicar permisos](../guides/apply-permissions.md)).
<!-- kit:end -->
- **Buscadores y compartir:** su título, su descripción y su imagen para
  compartir; o `noindex`, si no es pública
  ([D14](../ux-ui/rules.md#d14-buscadores-y-compartir)).
- **Rendimiento:** qué imagen carga enseguida, el vídeo y, si la página lleva
  JavaScript, qué y por qué.
- **Tests:** la lista, `Test | Nivel | En verde`, que es la especificación: cada
  cosa que la página tiene que hacer, con su test en el nivel más alto que se
  pueda (la página antes que un componente o un util), en una frase, como se
  escribirá en el código; y «verificación manual» para lo que no se automatiza
  bien (cómo se ve a 360 px, el lector de pantalla). La aprueba la persona;
  `zaius-build` la construye de un test en uno y marca cada uno en verde, con
  «sí» en su columna
  ([Lo que se prueba](../guides/write-tests.md#1-lo-que-se-prueba)).
- **Decisiones:** lo que se decide al construirla, con su fecha
  («2026-11-03: los precios, sin decimales»), lo apunta `zaius-build` en cada
  parada, con su test en la lista si hace falta.
- **Verificación a mano:** lo que se mira a mano, con su casilla, lo apunta y
  lo marca `zaius-review`.

## Cómo se escribe

- **Idioma.** La prosa va en castellano. Los textos de la interfaz van entre
  «», tal como se leen en la página («Pide disponibilidad»).
- **Con palabras de la web:** qué se ve, qué se puede hacer y adónde lleva
  cada enlace. Lo técnico (los ficheros, las piezas por su nombre de código)
  solo en «Datos» y en «Decisiones», si hace falta.
- **Cada regla se escribe una vez.** Lo que ya dicen las
  [normas de diseño](../ux-ui/rules.md) no se repite: se enlaza la norma.
- **Tamaño.** Unas 200 líneas como máximo, con las líneas cortadas a 80
  caracteres. Una página que no cabe es que hace demasiado: se propone
  partirla en dos, en el backlog.
- **Un cambio de datos o de textos** que pide la persona (un precio, una
  frase, una foto) se hace sin tocar la especificación: se pone al día lo que
  diga el documento al cerrarlo, con `/zaius-review`
  ([La persona decide](../process.md#la-persona-decide)).

## Índice

Una página entra en esta tabla al apuntarla en el backlog, y su nombre enlaza
su documento. El orden y el estado de cada una están en el
[backlog](../backlog.md).

| Página | URL | Título |
|---|---|---|

## Lo que no es una página

Las secciones, las pestañas, los modales y las demás piezas de una página no
son páginas: van en el documento de la suya.
<!-- kit:if server -->
Tampoco lo son la página que no existe y la del error, que nacen con el marco
([Páginas y rutas](../naming.md#páginas-y-rutas)).
<!-- kit:else -->
Tampoco lo es la página que no existe, que nace con el marco
([Páginas y rutas](../naming.md#páginas-y-rutas)).
<!-- kit:end -->
