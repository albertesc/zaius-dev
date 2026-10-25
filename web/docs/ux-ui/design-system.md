# Sistema de diseño

> Pendiente de definir: lo rellena la skill `zaius-init`.

Con qué se construyen las páginas de %%APP_NAME%%: su identidad, la librería,
los tokens y qué pieza cumple cada papel que nombran las
[normas](./rules.md). Las normas dicen cómo se comporta una página; este
documento, con qué piezas se hace.
Una vez escrito, se cambia con una propuesta
([Cómo se cambia el diseño](./README.md#cómo-se-cambia-el-diseño)).

**En esta página:** [Identidad](#identidad), [Librería y cómo se monta](#librería-y-cómo-se-monta), [Tokens](#tokens), [Anchos](#anchos), [Tema](#tema), [Movimiento](#movimiento), [Iconos](#iconos), [Bocetos](#bocetos), [Piezas por papel](#piezas-por-papel), [Lo que falta](#lo-que-falta)

## Identidad

Pendiente.

*Lo que hace reconocible a %%APP_NAME%%, elegido entre tres direcciones con
la skill `zaius-brand`: su idea, en una frase; el logo (dónde está y si es
provisional); los colores y su papel (uno que domina y un acento); la letra,
con su papel y cómo se carga; las fotos (qué enseñan, cómo, y si son propias
o de muestra); la firma, lo único que se recordará; cómo se compone; «Lo
que no», lo genérico que se evita; y la skill de diseño de la persona, si la
hay ([Una skill de diseño propia](./README.md#una-skill-de-diseño-propia)).*

## Librería y cómo se monta

Pendiente.

*La librería de componentes (una del mercado, una propia o ninguna) y su
paquete, y sus estilos globales, en `src/styles/`, que importa una vez
`src/layouts/BaseLayout.astro`. Una librería que pide JavaScript en el
navegador es una isla: se dice aquí, con su peso.*

## Tokens

Pendiente.

*De dónde salen (los de la librería o `src/styles/tokens.css`, importado en
`src/layouts/BaseLayout.astro`): el color de la marca, la tipografía (y cómo
se carga: del propio proyecto, nunca de un servidor de fuera sin decirlo), la
escala de grises, los espacios (cada uno con lo que separa: una etiqueta de
su campo, dentro de un grupo, entre grupos, entre secciones), el ancho
máximo y los márgenes de la rejilla, y los radios. Nunca colores sueltos.*

## Anchos

Pendiente.

*Desde el móvil hacia arriba: los anchos con los que se diseña y se revisa
cada página (por ejemplo, 360, 768 y 1280 px), el máximo del contenido y el
mínimo en el que todo funciona sin scroll horizontal de la página.*

## Tema

Pendiente.

*Claro, oscuro o los dos, y cómo se cambia (el del sistema, o un botón).*

## Movimiento

Pendiente.

*Cuánto se mueve la web (nada, lo justo o vistoso), sus duraciones y sus
curvas, como tokens; cómo responde lo que se pulsa al pasar por encima y con
el foco; y que con «reducir movimiento» solo queda un fundido
([D13](./rules.md#d13-movimiento)).*

## Iconos

Pendiente.

*De dónde salen (los de la librería, un paquete de iconos o ninguno) y cómo se
pasa un icono a una pieza.*

## Bocetos

Pendiente.

*La guía visual, `mockups/design-system.html`, la documentación de este
sistema de diseño (la identidad, los fundamentos, cada pieza con sus estados
y sus normas, y los cambios), y la fecha en que se aprobó. Los bocetos los hace la skill `zaius-sketch`, con los tokens de este
documento ([Bocetos](./README.md#bocetos)).*

## Piezas por papel

Pendiente.

*Qué pieza cumple cada papel: el componente de la librería o, sin librería, la
pieza propia que se crea en `src/components/` cuando la pide la primera
página.*

| Papel | Pieza | Notas |
|---|---|---|
| Cabecera del sitio | Pendiente | El logo, el menú y, en el móvil, su botón (D10, D12) |
| Pie del sitio | Pendiente | Los enlaces legales, el contacto y las redes |
| Portada de una página | Pendiente | El título, una frase y la llamada a la acción; con imagen, su texto alternativo (D12) |
| Llamada a la acción | Pendiente | Un enlace con aspecto de botón primario (D5, D10) |
| Sección de contenido | Pendiente | Título y texto a todo el ancho, con su imagen si la lleva |
| Tarjeta de contenido | Pendiente | Imagen, título, texto corto y su enlace |
| Galería de imágenes | Pendiente | Cada imagen con su texto alternativo; se recorre con el teclado (D12) |
| Vídeo | Pendiente | Se carga al pulsarlo; con su pausa y, si los hay, subtítulos (D12, D13) |
| Título de página | Pendiente | El `h1`, uno por página (D12, D14) |
| Título de sección | Pendiente | `h2` y `h3`, sin saltos (D12) |
| Texto | Pendiente | |
| Enlace | Pendiente | Un enlace con `href`, también para las rutas internas (D10) |
| Botón primario | Pendiente | Uno por zona, el último (D5) |
| Botón secundario | Pendiente | |
| Botón discreto | Pendiente | La salida de una zona: «Cancela», «Vuelve» (D5) |
| Botón de icono | Pendiente | Con `aria-label` (D12) |
| Campo de texto | Pendiente | Con su error debajo (D6) |
| Área de texto | Pendiente | |
| Selector de una lista cerrada | Pendiente | |
| Fecha | Pendiente | |
| Número | Pendiente | Con la unidad |
| Casilla | Pendiente | La de la privacidad, sin marcar (D6) |
| Barra de acciones | Pendiente | «Hay N campos por revisar» y el primario (D6) |
| Aviso de página | Pendiente | Fallos y avisos que no se van solos (D4) |
| Nota de un campo o un botón | Pendiente | La ayuda, el error o la causa de un botón desactivado (D4, D5) |
| Aviso efímero | Pendiente | Nunca un fallo (D4) |
| Esqueleto de carga | Pendiente | Con la forma del contenido; solo lo que se carga después de la página (D3) |
| Estado vacío | Pendiente | «Todavía no hay …» (D3) |
| Estado de error | Pendiente | Con reintentar (D3) |
| Insignia de estado | Pendiente | |
| Icono de información | Pendiente | De 1 a 4 frases (D2) |
| Paginación | Pendiente | Una página por ruta (`/blog/page/2`) |
| Pestañas | Pendiente | Cambian sin recargar, con un `<script>` |
| Modal | Pendiente | Un `<dialog>`; al cerrarse, el foco vuelve a quien lo abrió |
| Contenedores y rejilla | Pendiente | Los espacios salen de sus tokens (D1) |
<!-- kit:if privateArea -->
| Cabecera de página | Pendiente | En la zona privada: título, estado y acciones (D7) |
| Tabla | Pendiente | Acciones en su cabecera; la cabecera, siempre a la vista (D8) |
| Buscador | Pendiente | Espera 400 ms si busca en el servidor (D8) |
| Menú de más acciones | Pendiente | El último de su fila o su tarjeta (D8) |
| Modal de confirmación | Pendiente | Su título es una pregunta; se bloquea mientras actúa (D9) |
| Botón destructivo | Pendiente | Al final de su zona (D5) |
<!-- kit:end -->

## Lo que falta

Pendiente.

*Lo que la web necesita y el sistema de diseño no tiene: se pide al sistema
de diseño (o se crea una sola vez en `src/components/`, si no hay librería)
en lugar de rehacerlo en cada página (D1).*
