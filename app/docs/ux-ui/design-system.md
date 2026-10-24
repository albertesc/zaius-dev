# Sistema de diseño

> Pendiente de definir: lo rellena la skill `zaius-init`.

Con qué se construyen las pantallas de %%APP_NAME%%: la librería, los tokens y
qué pieza cumple cada papel que nombran las [normas](./rules.md). Las normas
dicen cómo se comporta una pantalla; este documento, con qué piezas se hace.
Una vez escrito, se cambia con una propuesta
([Cómo se cambia el diseño](./README.md#cómo-se-cambia-el-diseño)).

**En esta página:** [Librería y cómo se monta](#librería-y-cómo-se-monta) · [Tokens](#tokens) · [Anchos](#anchos) · [Tema](#tema) · [Movimiento](#movimiento) · [Iconos](#iconos) · [Bocetos](#bocetos) · [Piezas por papel](#piezas-por-papel) · [Lo que falta](#lo-que-falta)

## Librería y cómo se monta

Pendiente.

*La librería de componentes (una del mercado, una propia o ninguna) y su
paquete; los proveedores que pide, en `src/main.tsx` y en los ayudantes de
los tests (`renderWithProviders` y `renderPage`, en `src/tests/testUtils.tsx`);
y sus estilos globales.*

## Tokens

Pendiente.

*De dónde salen (los de la librería o `src/styles/tokens.css`, importado en
`src/main.tsx`): el color de la marca, la tipografía, la escala de grises, los
espacios y los radios. Nunca colores sueltos.*

## Anchos

Pendiente.

*El ancho de pantalla para el que se diseña y el mínimo en el que todo
funciona sin scroll horizontal de la página.*

## Tema

Pendiente.

*Claro, oscuro o los dos, y cómo se cambia.*

## Movimiento

Pendiente.

*Cuánto se mueve (nada, lo justo o vistoso), sus duraciones y sus curvas,
como tokens, y que con «reducir movimiento» solo queda un fundido
([D13](./rules.md#d13-movimiento)).*

## Iconos

Pendiente.

*De dónde salen (los de la librería, un paquete de iconos o ninguno) y cómo se
pasa un icono a una pieza.*

## Bocetos

Pendiente.

*El nivel de partida de los bocetos de cada historia (baja, media o alta) y
la guía visual, `mockups/design-system.html`, que enseña las piezas con sus
colores y su tipografía. Los hace la skill `zaius-sketch`, con los tokens de
este documento ([Bocetos](./README.md#bocetos)).*

## Piezas por papel

Pendiente.

*Qué pieza cumple cada papel: el componente de la librería o, sin librería, la
pieza propia que se crea en `src/components/` cuando la pide la primera
historia.*

| Papel | Pieza | Notas |
|---|---|---|
| Título de página | Pendiente | El `h1`; recibe el foco al entrar (D10, D12) |
| Título de sección | Pendiente | `h2` y `h3`, sin saltos (D12) |
| Texto | Pendiente | |
| Enlace | Pendiente | Con el enlace del router para las rutas internas (D10) |
| Botón primario | Pendiente | Uno por zona, el último (D5) |
| Botón secundario | Pendiente | |
| Botón discreto | Pendiente | La salida de una zona: «Cancela», «Vuelve» (D5) |
| Botón destructivo | Pendiente | Al final de su zona (D5) |
| Botón de icono | Pendiente | Con `aria-label` (D12) |
| Campo de texto | Pendiente | Con su error debajo (D6) |
| Área de texto | Pendiente | |
| Selector de una lista cerrada | Pendiente | |
| Campo combobox de un catálogo que crece | Pendiente | La caja es el buscador |
| Selección múltiple | Pendiente | |
| Fecha | Pendiente | |
| Rango de fechas | Pendiente | |
| Número o importe | Pendiente | Con la unidad |
| Casilla | Pendiente | Un dato que se guarda con «Guarda» |
| Interruptor | Pendiente | Lo que se aplica al momento |
| Tabla | Pendiente | Acciones en su cabecera; la cabecera, siempre a la vista (D8) |
| Paginación | Pendiente | 10, 25 o 50 filas (D8) |
| Buscador | Pendiente | Espera 400 ms si busca en el servidor (D8) |
| Modal | Pendiente | Se bloquea mientras actúa (D9) |
| Modal de confirmación | Pendiente | Su título es una pregunta (D9) |
| Pestañas | Pendiente | En `?tab=` en la gestión de un registro (D7) |
| Tarjeta | Pendiente | Plegable en un formulario de tres secciones o más (D6) |
| Lista de datos (etiqueta y valor) | Pendiente | Lo que no se edita (D6) |
| Cabecera de página | Pendiente | Título, estado y acciones (D7) |
| Barra de acciones | Pendiente | «Hay N campos por revisar» y «Guarda» (D6) |
| Aviso de página | Pendiente | Fallos y avisos que no se van solos (D4) |
| Nota de un campo o un botón | Pendiente | La ayuda, el error o la causa de un botón desactivado (D4, D5) |
| Aviso efímero | Pendiente | Nunca un fallo (D4) |
| Esqueleto de carga | Pendiente | Con la forma del contenido (D3) |
| Estado vacío | Pendiente | «Todavía no hay …» (D3) |
| Estado de error | Pendiente | Con reintentar (D3) |
| Insignia de estado | Pendiente | |
| Menú ⋮ | Pendiente | El último de su fila o su tarjeta (D8) |
| Icono de información | Pendiente | De 1 a 4 frases (D2) |
| Barra de progreso | Pendiente | |
| Contenedores y rejilla | Pendiente | Los espacios salen de sus tokens (D1) |

## Lo que falta

Pendiente.

*Lo que la app necesita y el sistema de diseño no tiene: se pide al sistema de
diseño (o se crea una sola vez en `src/components/`, si no hay librería) en
lugar de rehacerlo en cada feature (D1).*
