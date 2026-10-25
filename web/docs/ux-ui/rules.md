# Normas de UX/UI

Estas son las normas de diseño vigentes de %%APP_NAME%%. No dependen de ninguna
librería: dicen cómo se comporta y cómo se escribe cada página, y nombran
cada pieza por su papel («la portada de una página», «el aviso de página»,
«la tarjeta de contenido»). Qué pieza del sistema de diseño cumple cada papel
está en [Piezas por papel](./design-system.md#piezas-por-papel). AGENTS.md
las resume en una frase cada una; aquí está el detalle.

**Cómo se escribe una norma:**

- el título, `## Dn. Título`, con el número siguiente al último;
- la regla, en viñetas: cada una empieza por la regla en negrita y sigue con
  su detalle;
- «Por qué», en una o dos frases: lo que evita o lo que consigue;
- una tabla «Mal | Bien», con ejemplos de la web.

**Una norma nueva llega por una propuesta aceptada**
([Cómo se cambia el diseño](./README.md#cómo-se-cambia-el-diseño)). Al
aceptarse, se escribe aquí y en la sección «Diseño y UX» de AGENTS.md. Nada
entra aquí directamente, ni se aplica en el código antes.

<!-- kit:if privateArea -->
**En esta página:** [D1](#d1-el-sistema-de-diseño-primero), [D2](#d2-sin-textos-explicativos), [D3](#d3-estados-de-carga-error-y-vacío), [D4](#d4-avisos-y-fallos), [D5](#d5-acciones), [D6](#d6-formularios), [D7](#d7-un-registro-una-pantalla), [D8](#d8-listados-y-tablas), [D9](#d9-modales), [D10](#d10-navegación), [D11](#d11-textos-y-formato), [D12](#d12-accesibilidad), [D13](#d13-movimiento), [D14](#d14-buscadores-y-compartir), [D15](#d15-jerarquía-espacios-y-columnas), [D16](#d16-lo-que-no-se-hace)
<!-- kit:else -->
**En esta página:** [D1](#d1-el-sistema-de-diseño-primero), [D2](#d2-sin-textos-explicativos), [D3](#d3-estados-de-carga-error-y-vacío), [D4](#d4-avisos-y-fallos), [D5](#d5-acciones), [D6](#d6-formularios), [D10](#d10-navegación), [D11](#d11-textos-y-formato), [D12](#d12-accesibilidad), [D13](#d13-movimiento), [D14](#d14-buscadores-y-compartir), [D15](#d15-jerarquía-espacios-y-columnas), [D16](#d16-lo-que-no-se-hace)

D7, D8 y D9 (un registro, una pantalla; listados y tablas; modales) son las
de una zona privada, y llegan con ella.
<!-- kit:end -->

## D1. El sistema de diseño primero

- **Se usan las piezas y los tokens del sistema de diseño**
  ([design-system.md](./design-system.md)). Antes de escribir un
  componente o un estilo, se busca si el sistema de diseño ya lo resuelve.
- **Siempre tokens.** Nunca un color suelto, un `!important`, el atributo
  `style` ni CSS que anule la caja de una pieza del sistema de diseño.
- **Lo genérico que falta se pide al sistema de diseño,** no se rehace en una
  página: se apunta en [Lo que falta](./design-system.md#lo-que-falta). Lo
  único propio de la web son las piezas que conocen su negocio.
- **Los textos de una pieza se le pasan siempre desde la web,** aunque traiga
  los suyos: así toda la web habla igual ([D11](#d11-textos-y-formato)).

**Por qué:** con una sola fuente de piezas y de tokens, todas las páginas se
ven y se comportan igual, y un cambio de diseño se hace en un solo sitio.

| Mal | Bien |
|---|---|
| `color: #2f6b3a` en el `<style>` de un componente | El token de color que da el sistema de diseño |
| Una galería propia en una página porque a la del sistema de diseño le falta pasar con el teclado | El teclado, pedido al sistema de diseño y apuntado en «Lo que falta» |
| `style="margin-top: 12px"` para separar dos tarjetas | El contenedor del sistema de diseño, con su espacio |
| El «Next» que trae de serie una galería | «Foto siguiente», que le pasa la web |

## D2. Sin textos explicativos

- **El contenido no es un texto explicativo.** Lo que la web cuenta (la casa,
  cada habitación, el entorno, una entrada del blog) es su contenido y va
  entero. La norma vale para lo que se usa: los formularios, los botones, el
  menú y las zonas de trabajo.
- **Lo que se usa muestra solo su título.** Un formulario, una sección de
  datos o una tarjeta no llevan párrafos que expliquen qué se ve o cómo se
  usa.
- **Lo que necesita explicación lleva el icono de información** junto a su
  título. Al pulsarlo se abre la explicación, con el mismo título: de 1 a 4
  frases que dicen qué es y cómo se lee. Solo lo lleva lo que no se entiende
  con el título y el dato: un precio con condiciones, una cifra calculada.
- **Los subtítulos de lo que se usa solo llevan datos:** un recuento («3
  habitaciones»), una fecha, la última actualización. Nunca una explicación.
- **Se quedan en pantalla** las ayudas cortas de los campos, los mensajes de
  estado (vacío, error) y las confirmaciones.

**Por qué:** un texto que explica cómo se usa una página se lee una vez y
después estorba; el icono deja la explicación a mano sin ocupar sitio.

| Mal | Bien |
|---|---|
| «Precio por noche» y debajo «Aquí tienes el precio de cada noche, que incluye…» | «Precio por noche» con el icono de información: «Para dos personas, con desayuno. La cama supletoria, 20 € la noche.» |
| Encima del formulario, «Rellena estos campos y te contestaremos» | El título del formulario y sus campos, cada uno con su ayuda si la necesita |
| Un párrafo que resume en dos líneas la habitación que ya se cuenta debajo | La habitación, contada una vez |

## D3. Estados de carga, error y vacío

- **La página llega con sus datos:** no tiene estado de carga. Lo que se
  carga después de ella lleva el esqueleto de carga, con la forma del
  contenido: la caja de una tarjeta, las filas de una lista.
<!-- kit:if server -->
- **Error de carga:** el estado de error en la zona que falla, con
  «Vuelve a intentarlo», que vuelve a pedir la página.
<!-- kit:end -->
- **Vacíos,** sin punto ([D11](#d11-textos-y-formato)):
  - sin datos, «Todavía no hay ninguna …»;
  - con filtros o una búsqueda, «Ninguna … con estos filtros», con la acción
    «Quita los filtros».
- **Lo que no existe:** la página que no existe, dentro de la web, con una
  salida que lleva adonde sí hay algo.

**Por qué:** cada estado se reconoce de un vistazo y siempre queda una salida:
reintentar, quitar los filtros o volver.

| Mal | Bien |
|---|---|
| Una lista vacía, sin nada | «Todavía no hay ninguna entrada» |
| «No hay datos» al buscar habitación para seis | «Ninguna habitación para 6 personas», con «Quita los filtros» |
| Una página en blanco con «Error 404» al abrir un enlace viejo | «Esta página no existe», dentro de la web, con «Vuelve al inicio» |

## D4. Avisos y fallos

- **Un fallo dice «No se ha podido …»** en su título, sin punto; la
  descripción dice el motivo y qué hacer, con punto. Un código conocido del
  servidor cambia la descripción, nunca el título.
- **Va donde se ve:**
  - al enviar un formulario, en el aviso de página, encima de su botón, con
    lo escrito intacto;
  - en un campo, bajo el campo, en su nota;
<!-- kit:if privateArea -->
  - en un modal, al final de su cuerpo, con el modal abierto y lo escrito;
  - en una acción inmediata (descargar una factura), en el aviso de página bajo
    la cabecera, que nombra lo que ha fallado y se cierra con su botón de
    cerrar.
<!-- kit:end -->
- **Nunca en un aviso efímero:** se va solo, y un fallo hay que poder
  releerlo.
- **El aviso efímero solo sale cuando el control con el que se actuó
  desaparece o no cambia:** se cierra un modal, se guarda algo. No sale
  cuando la página ya enseña el resultado (el mensaje enviado, en lugar del
  formulario).
- **Se anuncia:** un fallo, en cuanto sale (`role="alert"`); el aviso efímero,
  sin interrumpir ([D12](#d12-accesibilidad)).

**Por qué:** un fallo que se ve junto a lo que lo ha causado se entiende y se
corrige; uno que desaparece solo se pierde.

| Mal | Bien |
|---|---|
| Un aviso efímero «Error al enviar» que se va a los 4 segundos | «No se ha podido enviar el mensaje» en el aviso de página, encima de «Envía el mensaje», con «Comprueba la conexión y vuelve a intentarlo.» |
| «Error: INVALID_DATES» | Bajo el campo Salida: «La salida tiene que ser después de la llegada.» |
| El formulario vacío otra vez después de un fallo | El formulario con lo escrito y el fallo encima del botón |
<!-- kit:if privateArea -->
| Cerrar el modal y avisar del fallo en la página | El aviso al final del cuerpo del modal, que sigue abierto con lo escrito |
<!-- kit:end -->

## D5. Acciones

- **En cada zona, la salida a la izquierda y el primario el último,** a la
  derecha. Lo destructivo, al final.
- **Un solo primario por zona:** la llamada a la acción de una sección, el
  botón de un formulario, el de un modal.
<!-- kit:if privateArea -->
- **Lo que el permiso o el estado no deja hacer no se ofrece,** ni desactivado
  ni con aviso.
<!-- kit:else -->
- **Lo que no se puede hacer no se ofrece,** ni desactivado ni con aviso.
<!-- kit:end -->
- **Solo se desactiva lo que se desbloquea en la misma página,** con la causa
  a la vista: en la propia zona o en la nota del botón. Nunca solo en un
  tooltip.
- **Mientras una acción está en curso,** su botón lleva `loading` sin cambiar
  el texto, y se bloquea todo lo que actúa sobre lo mismo: los campos y los
  demás botones del formulario.
- **Nada se pinta como hecho antes de que el servidor lo confirme:** no hay
  cambios optimistas.
<!-- kit:if privateArea -->
- **Las tablas no tienen selección múltiple.** Una acción sobre muchos
  registros actúa sobre lo filtrado y va en la cabecera de la tabla
  ([D8](#d8-listados-y-tablas)).
<!-- kit:end -->

**Por qué:** la misma acción en el mismo sitio se encuentra sin buscarla, lo
que no se puede hacer no se intenta, y lo que se ve es siempre lo que ha
pasado de verdad.

| Mal | Bien |
|---|---|
| Dos botones iguales de «Pide disponibilidad» en la misma sección | Uno, el último de la sección |
| «Envía» que pasa a «Enviando…» | «Envía el mensaje» con `loading`, el mismo texto |
| «Mensaje enviado» en cuanto se pulsa, antes de la respuesta | El formulario bloqueado hasta que el servidor responde |
<!-- kit:if privateArea -->
| «Cancela la reserva» desactivado, con el tooltip «No tienes permiso» | Sin el botón: sin permiso no se ofrece |
| Una casilla en cada fila para cancelar varias reservas | Cada reserva se cancela en su gestión, con su confirmación |
<!-- kit:end -->

## D6. Formularios

<!-- kit:if privateArea -->
- **El alta y la edición de un registro son el mismo formulario:** las mismas
  secciones, los mismos títulos, el mismo orden y las mismas piezas. Solo
  cambian los campos que existen en una de las dos.
<!-- kit:end -->
- **Se valida con el schema, al enviar:** nada antes del primer intento.
  Si algo falla, la página vuelve con lo escrito y el error bajo su campo, en
  una frase completa con punto.
- **«Hay N campos por revisar»** sale encima del botón de envío, tras un
  intento con errores; se actualiza al corregir y desaparece al llegar a
  cero. El foco va al primer campo con error.
- **Mientras se envía,** los campos y las acciones del formulario se
  desactivan, y el primario lleva `loading` ([D5](#d5-acciones)).
- **Pide lo mínimo:** solo los campos que hacen falta para contestar, cada
  uno con su etiqueta a la vista (nunca solo el texto de ejemplo dentro del
  campo) y su tipo (`email`, `tel`, `date`), para que el móvil abra su
  teclado.
- **La casilla de la privacidad va sin marcar,** con el enlace a la página de
  privacidad.
- **Cambios sin enviar:** un formulario con algo escrito avisa antes de salir
  de la página.
- **Lo que no se edita se lee como texto,** nunca como un campo desactivado.
  Desactivado queda para lo que se activará en la misma página.

**Por qué:** quien rellena un formulario ve los errores cuando ya ha
intentado algo, sabe cuántos le quedan y no pierde lo escrito por un clic.

| Mal | Bien |
|---|---|
| «Este campo es obligatorio.» en rojo antes de escribir nada | Sin errores hasta el primer «Envía el mensaje» |
| El nombre del campo solo dentro de la caja, que se borra al escribir | La etiqueta «Correo» encima de la caja |
| La casilla «Acepto la política de privacidad» ya marcada | Sin marcar, y el envío no sigue sin ella |
| Salir con un mensaje a medias y perderlo sin aviso | «¿Quieres salir sin enviar el mensaje?», con «Sigue escribiendo» y «Sal sin enviar» |
<!-- kit:if privateArea -->
| El número de la reserva en un campo de texto desactivado | «Reserva: #1287», como texto |
<!-- kit:end -->
<!-- kit:if privateArea -->

## D7. Un registro, una pantalla

En la zona privada, cada registro de quien entra (una reserva) se gestiona en
una sola página.

- **Cada registro tiene una sola página, su gestión:** la página
  `/<sección>/[id]/edit` (`accountBookingsEdit`). No hay ficha aparte:
  `/<sección>/[id]` no es una ruta.
- **La cabecera lleva el estado junto al título,** solo para leer, nunca como
  desplegable. El título dice lo que se hace: «Gestiona la reserva #1287».
- **Las pestañas van en `?tab=`;** la primera no lleva parámetro, y cambiar
  de una a otra no recarga la página ni pierde lo escrito.
- **Lo que se edita va en un solo formulario,** repartido en sus pestañas, con
  un solo «Guarda» en la barra de acciones, en todas ellas.
- **Al guardar, se sigue en la página,** con el foco en «Guarda» y el
  formulario a partir de lo guardado.
- **Lo inmediato va fuera del «Guarda»** (cancelar la reserva, descargar la
  factura): actúa al momento. Si cambia datos del formulario, se desactiva
  mientras haya cambios sin guardar, con la causa a la vista.
- **Sin permiso de editar,** la misma página en lectura, sin barra, con un
  aviso bajo la cabecera que no se cierra.

**Por qué:** un solo sitio por registro: los enlaces, los correos y el
listado llevan a la misma página, y no hay dos versiones que mantener.

| Mal | Bien |
|---|---|
| Una ficha en `/account/bookings/1287` y otra página para editar la reserva | Una sola, `/account/bookings/1287/edit` |
| Un «Guarda» en cada pestaña | Uno solo en la barra, que guarda todas |
| El estado como desplegable en la cabecera | El estado junto al título; la reserva se cancela con su botón |
| Sin permiso de editar, «Gestiona» lleva a un error | La misma página, en lectura, con «No puedes cambiar esta reserva» |
| Al guardar, volver al listado | Seguir en la página, con «Se han guardado los cambios» |

## D8. Listados y tablas

- **Solo las columnas imprescindibles,** sin texto libre (notas,
  descripciones).
- **Las columnas, en un orden fijo:** número, lo que nombra el registro, tipo,
  estado, fechas, cifras y texto. El número va como «#1287»; las cifras, a la
  derecha.
- **Todas las acciones de la tabla van en su cabecera,** de izquierda a
  derecha: el buscador, lo que actúa sobre lo filtrado y, la última,
  «Crea…». Nunca debajo ni al pie.
- **La cabecera de la tabla se ve siempre:** el esqueleto de carga y el estado
  de error ocupan solo su cuerpo.
- **Paginación de 10 filas, o 25 o 50 a elegir.** Se vuelve a la página 1 al
  cambiar los filtros, la búsqueda, el orden o el tamaño.
- **El buscador espera 400 ms** desde la última tecla si busca en el
  servidor; Enter lo lanza al momento.
- **Como mucho dos acciones por fila,** y la última, la que abre el registro
  («Gestiona»). El resto, tras el menú de más acciones, siempre el último de la
  fila, con la destructiva al final.
- **La fila no se abre al pulsarla:** se abre con su acción.
- **Filtros, página y orden van en la URL,** nunca en el `sessionStorage`:
  sobreviven a navegar y a recargar.

**Por qué:** una tabla que cabe y se lee de un vistazo; las acciones siempre
en el mismo sitio; y al volver de un registro, la lista está como se dejó.

| Mal | Bien |
|---|---|
| Una columna «Nota» con el texto entero | La nota, en la gestión de la reserva |
| Cuatro botones en cada fila | «Gestiona» y el menú de más acciones con el resto |
| Pulsar la fila abre la reserva | La abre «Gestiona» |
| Los filtros y la página, en el `sessionStorage` | `/account/bookings?status=confirmed&page=2` |
| Una búsqueda en el servidor con cada tecla | Una búsqueda a los 400 ms de la última |

## D9. Modales

- **Un modal decide o pide lo mínimo; nunca sirve para leer.** Confirma, pide
  los datos que la acción necesita o elige. Lo que se lee se enseña en su
  sitio («Muestra…»).
- **Su botón principal dice lo que hace:** «Guarda» solo si guarda en el
  servidor; si devuelve algo a un formulario que se guarda después, «Añade …»
  o «Aplica …».
- **Solo se confirma lo que no se puede deshacer,** con el modal de
  confirmación, cuyo título es una pregunta: «¿Quieres cancelar la
  reserva?». Quitar algo que aún no se ha guardado no se confirma.
- **Una confirmación se cierra sin preguntar.** Un formulario en un modal solo
  pregunta si se cierra con cambios por su botón de cerrar, Escape o pulsando
  fuera; su «Cancela» cierra sin preguntar.
- **Mientras actúa, se bloquea entero,** también su botón de cerrar y Escape, y
  su fallo va al final del cuerpo, con el modal abierto y lo escrito
  ([D4](#d4-avisos-y-fallos)).
- **Al cerrarse, el foco vuelve al control que lo abrió.**

**Por qué:** un modal interrumpe; si solo aparece para decidir, se entiende
qué pide y su botón dice qué va a pasar.

| Mal | Bien |
|---|---|
| Un modal para ver el detalle de un huésped | El huésped, en su sitio, con «Muestra el huésped» |
| «Guarda» en un modal que solo añade un huésped al formulario | «Añade el huésped» |
| «¿Seguro que quieres quitar este huésped?» antes de guardar | Se quita; nada se guarda hasta «Guarda» |
| «¿Quieres salir?» al cerrar una confirmación | Se cierra |
| Cerrar el modal con Escape mientras cancela la reserva | El modal, bloqueado hasta la respuesta |
<!-- kit:end -->

## D10. Navegación

- **Lo que lleva a otra página es un enlace** (con `href`), con aspecto de
  botón donde toque; nunca un botón que cambia `location.href`. Lo que hace
  algo sin cambiar de página es un botón.
- **El menú y el pie son los mismos en toda la web,** y marcan la página en
  la que se está (`aria-current="page"`).
- **El título de una página del menú es el de su entrada.**
<!-- kit:if privateArea -->
- **La pestaña del navegador dice «<título> - %%APP_NAME%%»,** sin datos
  personales: en la gestión de una reserva, «Reserva #1287 - %%APP_NAME%%».
- **Volver lleva a donde se estaba,** con su URL entera: una lista vuelve con
  sus filtros. Nunca lleva a una página sin permiso.
<!-- kit:else -->
- **La pestaña del navegador dice «<título> - %%APP_NAME%%».**
<!-- kit:end -->
<!-- kit:if server -->
- **La página que no existe y el error** se pintan dentro de la web, con su
  marco y una salida.
<!-- kit:else -->
- **La página que no existe** se pinta dentro de la web, con su marco y una
  salida.
<!-- kit:end -->

El detalle técnico está en
[Rutas y navegación](../standards.md#rutas-y-navegación).

**Por qué:** un enlace se abre en otra pestaña, se copia y el lector de
pantalla lo anuncia como enlace; y quien llega a una página sabe siempre
dónde está y cómo salir.

| Mal | Bien |
|---|---|
| Un botón que cambia `location.href` a `/contact` | Un enlace a `/contact` con aspecto de botón |
| La entrada «Habitaciones» igual que las demás estando en ella | Marcada, con `aria-current="page"` |
| La página en blanco del servidor para una ruta que no existe | «Esta página no existe», dentro de la web, con «Vuelve al inicio» |
| Una entrada del menú que aún no lleva a ninguna parte | La entrada no está hasta que su página existe |
<!-- kit:if privateArea -->
| La pestaña «Reserva de Marta Puig - %%APP_NAME%%» | «Reserva #1287 - %%APP_NAME%%» |
<!-- kit:end -->

## D11. Textos y formato

- **Se trata de tú,** salvo que el [brief](../brief.md#tono) diga otra cosa.
  Solo llevan mayúscula el principio, los nombres propios y las siglas.
- **Toda acción va en imperativo, con verbo y objeto:** «Pide
  disponibilidad», «Envía el mensaje», «Mira las habitaciones». Nunca en
  infinitivo.
<!-- kit:if privateArea -->
- **Cada verbo, para lo suyo:** «Envía…» manda algo a alguien; «Crea…» da de
  alta un registro; «Guarda» es para lo que ya existe; «Aplica…» devuelve
  algo a un formulario sin guardarlo; «Gestiona…» abre la gestión de un
  registro; «Abre…» o «Mira…», otra página; «Muestra…» enseña algo en el
  sitio; y «Descarga…» baja un fichero.
<!-- kit:else -->
- **Cada verbo, para lo suyo:** «Envía…» manda algo a alguien; «Abre…» o
  «Mira…», otra página; «Muestra…» enseña algo en el sitio; y «Descarga…»
  baja un fichero.
<!-- kit:end -->
- **El punto final:** lo que se lee como un título (un aviso, un vacío, una
  etiqueta) va sin punto; el texto que lo acompaña, con punto.
- **El formato, con las funciones comunes de la raíz**
  ([Textos](../standards.md#textos)): las fechas, con su función; los miles,
  siempre («1.500»); los precios, con su moneda y sin decimales si son
  enteros («95 €»); los porcentajes, enteros y con espacio («10 %»).
- **Los plurales, con `count`:** «1 noche», «2 noches».
- **Lo que falta es «-».**
<!-- kit:if privateArea -->
- **Un registro es «#1287» en una tabla y «Reserva #1287» fuera de ella.**
<!-- kit:end -->
- **Sin los signos ni las frases de la IA:** ni «·», «→», «—», «✓» ni
  emojis, ni «¡Descubre…!», ni «no solo…, sino también…»
  ([Escribir como una persona](../process.md#escribir-como-una-persona)). Dos
  datos seguidos se separan con el diseño, no con un carácter.

**Por qué:** la web habla con una sola voz: el mismo verbo hace siempre lo
mismo, y un dato se lee igual en todas las páginas.

| Mal | Bien |
|---|---|
| «Enviar», «Más información» | «Envía el mensaje», «Mira las habitaciones» |
| «Haz clic aquí para reservar» | «Pide disponibilidad» |
| «Se ha enviado el mensaje.» como título | «Se ha enviado el mensaje» |
| «95.00€», «1500», «0.1» | «95 €», «1.500», «10 %» |
| «1 noches» | «1 noche» |
| Un dato vacío, o «null» | «-» |
| «Hasta 14 · Piscina · Jardín», «Reserva → Confirmada» | «Hasta 14 personas», «Piscina» y «Jardín», cada uno en su sitio; «Reserva confirmada» |

## D12. Accesibilidad

- **Todo botón de icono lleva `aria-label`,** que dice qué hace: «Abre el
  menú», «Foto siguiente».
- **El foco siempre se ve.**
- **Los títulos no saltan niveles:** `h1`, el título de la página; `h2`,
  cada sección; `h3`, lo que va dentro.
- **Los landmarks:** la cabecera del sitio, en `header`; el menú, en un `nav`
  con su nombre; un solo `main`; el pie, en `footer`. El primer enlace del
  tabulador salta al contenido.
- **Cada imagen lleva su `alt`,** que dice lo que se ve; la que solo adorna,
  `alt=''`.
- **Todo se hace con teclado,** también la galería y el menú del móvil.
- **Nada que se pulse mide menos de 24 por 24 px.**
- **Contraste:** solo combinaciones de tokens que lo cumplen, también el
  texto sobre una foto.
- **Un fallo se anuncia** (`role="alert"`); un recuento o un progreso, sin
  interrumpir (`role="status"`).
- **Cada página se prueba** con el teclado, con un lector de pantalla y con
  el zoom al 200 %, antes de darla por buena.

**Por qué:** la web la usan personas con teclado, con lector de pantalla o con
zoom; lo que solo funciona con el ratón deja fuera a alguien.

| Mal | Bien |
|---|---|
| El botón del menú del móvil, con solo tres rayas y sin nombre | El mismo botón con `aria-label="Abre el menú"` |
| `outline: none` en los enlaces | El foco visible del sistema de diseño |
| Un `h1` y después un `h4` | `h1`, `h2`, `h3`, sin saltos |
| La foto de la habitación con `alt='foto1.jpg'` | `alt='La Encina: cama de matrimonio junto a la ventana'` |
| El texto blanco sobre la parte clara de la foto de la portada | El texto sobre un fondo que cumple el contraste |

## D13. Movimiento

- **Cuánto se mueve lo dice el sistema de diseño,** en «Movimiento»: nada,
  lo justo o vistoso. Las duraciones y las curvas son tokens, como los
  colores.
- **El movimiento explica:** de dónde viene algo y qué ha cambiado (un menú
  que se abre, una foto que pasa, un aviso que llega). En lo que se usa,
  corto: de 150 a 300 ms.
- **Lo que se pulsa responde al ratón y al teclado:** cada botón, enlace, tarjeta que lleva a otra página, foto de una galería y
  enlace del menú cambian al pasar por encima (su color, su fondo,
  su sombra o un pequeño desplazamiento) y con el foco, con
  `--motion-fast`. Con «nada», el mismo cambio, sin transición. Nada que se
  pulse se queda igual.
- **En una web vistosa, también presenta:** una sección que aparece al
  llegar a ella, la foto de la portada que entra al cargar. Hasta unos
  600 ms, y una sola vez: lo que ya se ha visto no vuelve a animarse.
- **Se respeta «reducir movimiento»:** con `prefers-reduced-motion: reduce`,
  nada se desplaza ni cambia de tamaño; como mucho, un fundido.
- **Nada se queda escondido esperando una animación:** el contenido se ve
  aunque el JavaScript no llegue a correr, y la animación va encima.
- **Lo que se mueve solo se puede parar:** un vídeo de fondo o un carrusel
  que dura más de 5 segundos lleva su pausa, y nada parpadea más de 3 veces
  por segundo.
- **Solo se animan `transform` y `opacity`,** que no hacen saltar la página
  ni la vuelven lenta.

**Por qué:** el movimiento justo ayuda a entender qué ha pasado; el que sobra
distrae, cansa y, a algunas personas, las marea.

| Mal | Bien |
|---|---|
| Cada tarjeta entra rebotando durante un segundo | Las tarjetas aparecen con un fundido corto, una vez |
| El contenido empieza invisible y aparece con un script | El contenido se ve sin script; el script solo añade la entrada |
| Un vídeo de fondo en bucle, sin forma de pararlo | El mismo vídeo, con su botón de pausa |
| La animación sigue igual con «reducir movimiento» | Con «reducir movimiento», solo un fundido |
| Las tarjetas de las habitaciones no cambian al pasar por encima | La tarjeta sube un poco y su título cambia de color, en 200 ms; igual con el foco |

## D14. Buscadores y compartir

- **Cada página pública tiene su título y su descripción,** únicos, que
  dicen qué hay en ella: el título, en la pestaña y en los buscadores; la
  descripción, de una o dos frases, debajo del título en los resultados.
- **Y su imagen para compartir,** de 1200 por 630 px, la que sale al pegar el
  enlace en una red o en un chat. Sin una propia, la de la portada.
- **La web dice su dirección final:** `site`, en `astro.config.ts`, que usan
  la dirección canónica de cada página, la imagen para compartir y el mapa
  del sitio (`sitemap`), que se genera solo al compilar. `robots.txt` señala
  ese mapa.
<!-- kit:if privateArea -->
- **Lo que no es público no se ofrece a los buscadores:** las páginas de la
  zona privada, la entrada y las de error llevan `noindex`.
<!-- kit:else -->
- **Lo que no es público no se ofrece a los buscadores:** las páginas de
  error llevan `noindex`.
<!-- kit:end -->
- **El HTML dice lo que es:** un solo `h1` por página, los títulos sin saltos
  y cada imagen con su `alt` (D12); los enlaces, con un texto que dice
  adónde llevan, nunca «aquí».
- **La página carga rápido:** las imágenes, optimizadas y en su tamaño; solo
  la primera que se ve carga enseguida; y nada pesado antes de lo primero que
  se ve.

**Por qué:** una web que no se encuentra o que sale sin imagen al compartirla
pierde a quien la busca; casi todo se resuelve una vez, en el layout, y el
resto es contenido de cada página.

| Mal | Bien |
|---|---|
| Todas las páginas con el mismo título, el de la web | «Habitaciones - %%APP_NAME%%», «Contacto - %%APP_NAME%%» |
| El enlace sale en WhatsApp sin imagen ni descripción | La imagen de 1200 por 630 px y la descripción de la página |
| «Para ver las habitaciones, pulsa aquí» | «Mira las habitaciones» |
<!-- kit:if privateArea -->
| «Mis reservas» aparece en Google | «Mis reservas», con `noindex` |
<!-- kit:else -->
| La página que no existe aparece en Google | La página que no existe, con `noindex` |
<!-- kit:end -->

## D15. Jerarquía, espacios y columnas

- **Lo que más importa, primero y más grande.** Cada página tiene una sola
  cosa principal, y cada sección, una sola entrada (su título o su foto); lo
  demás va en su orden: lo que menos importa, más pequeño, más suave o más
  abajo.
- **Pocos niveles, y bien distintos:** el título de la página, el de una
  sección, el texto y la nota, cada uno de la escala de la letra y distinto
  de los otros por su tamaño y su peso, no solo por su color. Nunca dos
  títulos que compiten ni todo en negrita.
- **Las acciones, en su orden:** el primario se ve el primero
  ([D5](#d5-acciones)), el secundario menos y el discreto apenas.
- **Lo que va junto, cerca; lo que no, separado.** La distancia dice qué va
  con qué: la etiqueta, pegada a su campo; el título, cerca de su texto y con
  aire encima; los botones de una acción, juntos. Entre dos grupos, siempre
  más espacio que dentro de cada uno.
- **Cada relación tiene su espacio, siempre el mismo,** de la escala de los
  tokens: dentro de un grupo, entre grupos y entre secciones, igual en toda
  la web. Nunca un valor a ojo, ni todo con el mismo espacio.
- **Nada pegado:** ningún texto toca el borde de su caja ni el de la
  pantalla; en el móvil, con el margen de los lados de «Anchos».
- **Una rejilla para toda la página:** la cabecera, cada sección y el pie,
  con el mismo ancho máximo y los mismos márgenes. El logo empieza donde
  empieza el texto, y el menú acaba donde acaba; lo que va a sangre (la foto
  de una portada) lo dice el boceto.
- **Las columnas siguen la rejilla:** las tarjetas, un texto con su foto, el
  pie; con el mismo hueco entre ellas y los bordes de los bloques en las
  mismas líneas.
- **La cabecera:** el logo a un lado, y el menú y la llamada a la acción al
  otro, centrados en vertical; en el móvil, el logo y el botón del menú.
- **El pie, en columnas:** cada grupo (el contacto, el menú, lo legal) en la
  suya, alineadas con la rejilla; en el móvil, una debajo de otra, en el
  orden en que se buscan, con la última línea (©, aviso legal, privacidad)
  aparte.
- **En el móvil, una columna,** en el orden de lectura y con la misma
  jerarquía de espacios: se encogen, pero lo que va junto sigue más cerca que
  lo que no. Nunca columnas tan estrechas que partan las palabras.

**Por qué:** la jerarquía, los espacios y las columnas son lo primero que
ordena una página: bien puestos, se ve qué importa y qué va con qué antes de
leer; mal puestos, todo compite, o parece suelto o amontonado.

| Mal | Bien |
|---|---|
| Tres titulares del mismo tamaño en la portada | Uno grande; los demás, en su nivel |
| Todo en negrita para que destaque | Solo lo que más importa, con más peso |
| La etiqueta de un campo, igual de lejos de su campo que del campo de arriba | La etiqueta, pegada a su campo; entre campos, más espacio |
| El título de una sección, más cerca de la sección de arriba que de su texto | El título, cerca de su texto, con aire encima |
| Tres tarjetas, con 16, 20 y 24 px entre ellas | El mismo token entre todas |
| El logo, más a la izquierda que el texto de la portada | El logo y el texto, en la misma línea de la rejilla |
| El pie, con los enlaces sueltos en una fila larga | El pie en columnas: el contacto, el menú y lo legal |

## D16. Lo que no se hace

Salvo que la persona lo pida (y entonces se apunta, con su motivo, en
«Identidad» del sistema de diseño), nunca:

- **Un borde o una franja de color a la izquierda:** en una tarjeta, un
  aviso, una cita, una fila o el enlace activo de un menú. Está demasiado
  visto: lo que destaca se destaca con su fondo, su peso o su sitio.
- **Lo que delata un diseño hecho por IA,** cada punto por sí solo:
  - un fondo crema, títulos con serifa y un acento terracota o teja;
  - un fondo casi negro con un único acento verde ácido o bermellón;
  - todo en tarjetas iguales, con el mismo radio y la misma sombra gris, y
    degradados de adorno;
  - una etiqueta en mayúsculas espaciadas encima de cada título; datos
    unidos con puntos medios en la página («Hasta 14 · Piscina · Jardín»;
    la pestaña, aparte); una flecha («→») al final de los enlaces;
  - números 01, 02, 03 en lo que no es una secuencia;
  - una palabra del título en cursiva o en otro color;
  - una cifra enorme con una etiqueta pequeña y un degradado, como portada;
  - cada sección que entra desde abajo al llegar a ella: un solo momento de
    movimiento se nota más que muchos;
  - una forma sin referente (una mancha, una nube, un borde ondulado) como
    adorno o separador.

**Por qué:** son las soluciones que salen sin decidir: una web que las usa se
parece a todas y deja de parecerse a la suya.

| Mal | Bien |
|---|---|
| Un aviso con una franja roja a la izquierda | El aviso, con su fondo, su icono y su texto |
| «NUESTRAS HABITACIONES», pequeño y espaciado, encima de «Las habitaciones» | Solo el título |
| «Ver más →» | «Mira las habitaciones» |
| El enlace activo del menú, con una barra a su izquierda | El enlace activo, con su peso o su fondo |

Lo que es propio de cada proyecto (colores con significado, anchos, iconos de
cada acción, impresión) se añade como norma nueva con una propuesta.
