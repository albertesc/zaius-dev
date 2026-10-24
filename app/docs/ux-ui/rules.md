# Normas de UX/UI

Estas son las normas de diseño vigentes de %%APP_NAME%%. No dependen de ninguna
librería: dicen cómo se comporta y cómo se escribe cada pantalla, y nombran
cada pieza por su papel («la tabla», «el aviso de página», «el aviso
efímero»). Qué pieza del sistema de diseño cumple cada papel está en
[Piezas por papel](./design-system.md#piezas-por-papel). AGENTS.md las
resume en una frase cada una; aquí está el detalle.

**Cómo se escribe una norma:**

- el título, `## Dn. Título`, con el número siguiente al último;
- la regla, en viñetas: cada una empieza por la regla en negrita y sigue con
  su detalle;
- «Por qué», en una o dos frases: lo que evita o lo que consigue;
- una tabla «Mal | Bien», con ejemplos de la app.

**Una norma nueva llega por una propuesta aceptada**
([Cómo se cambia el diseño](./README.md#cómo-se-cambia-el-diseño)). Al
aceptarse, se escribe aquí y en la sección «Diseño y UX» de AGENTS.md. Nada
entra aquí directamente, ni se aplica en el código antes.

**En esta página:** [D1](#d1-el-sistema-de-diseño-primero) · [D2](#d2-sin-textos-explicativos) · [D3](#d3-estados-de-carga-error-y-vacío) · [D4](#d4-avisos-y-fallos) · [D5](#d5-acciones) · [D6](#d6-formularios) · [D7](#d7-un-registro-una-pantalla) · [D8](#d8-listados-y-tablas) · [D9](#d9-modales) · [D10](#d10-navegación) · [D11](#d11-textos-y-formato) · [D12](#d12-accesibilidad) · [D13](#d13-movimiento)

## D1. El sistema de diseño primero

- **Se usan las piezas y los tokens del sistema de diseño**
  ([design-system.md](./design-system.md)). Antes de escribir un
  componente o un estilo, se busca si el sistema de diseño ya lo resuelve.
- **Siempre tokens.** Nunca un color suelto, un `!important`, la prop `style`
  ni CSS que anule la caja de una pieza del sistema de diseño.
- **Lo genérico que falta se pide al sistema de diseño,** no se rehace en la
  app: se apunta en [Lo que falta](./design-system.md#lo-que-falta). Lo
  único propio de la app son las piezas que conocen la app o su negocio.
- **Los textos de una pieza se le pasan siempre desde la app,** aunque traiga
  los suyos: así toda la app habla igual ([D11](#d11-textos-y-formato)).

**Por qué:** con una sola fuente de piezas y de tokens, todas las pantallas se
ven y se comportan igual, y un cambio de diseño se hace en un solo sitio.

| Mal | Bien |
|---|---|
| `color: #1f6feb` en el `.module.css` de una feature | El token de color que da el sistema de diseño |
| Una tabla propia en una feature porque a la del sistema de diseño le falta ordenar | El orden, pedido al sistema de diseño y apuntado en «Lo que falta» |
| `style={{ marginTop: 12 }}` para separar dos tarjetas | El contenedor del sistema de diseño, con su espacio |
| El «No results» que trae de serie un campo | «Ningún resultado», que le pasa la app |

## D2. Sin textos explicativos

- **Páginas, secciones, pestañas y tarjetas muestran solo su título.** No
  llevan párrafos que expliquen qué se ve.
- **Lo que necesita explicación lleva el icono de información** junto a su
  título. Al pulsarlo se abre la explicación, con el mismo título: de 1 a 4
  frases que dicen qué es y cómo se lee. Solo lo lleva lo que no se entiende
  con el título y el dato: una cifra calculada, una puntuación.
- **Los subtítulos solo llevan datos:** un recuento («24 pedidos»), una fecha,
  la última actualización. Nunca una explicación. El recuento va en el
  subtítulo, no en el título.
- **Se quedan en pantalla** las ayudas cortas de los campos, los mensajes de
  estado (vacío, error, sin permisos) y las confirmaciones.

**Por qué:** un texto que explica la pantalla se lee una vez y después
estorba; el icono deja la explicación a mano sin ocupar sitio.

| Mal | Bien |
|---|---|
| «Plazo medio» y debajo «Aquí tienes la media de días que tardan los pedidos en entregarse…» | «Plazo medio» con el icono de información: «Media de días entre la creación y la entrega de los pedidos del periodo.» |
| El subtítulo «Consulta los pedidos que has creado» | Sin subtítulo, o «12 pedidos» |
| «Pedidos relacionados (2)» | «Pedidos relacionados», con el subtítulo «2 pedidos» |

## D3. Estados de carga, error y vacío

- **Primera carga:** el esqueleto de carga, con la forma del contenido: filas
  en el cuerpo de una tabla, la caja de una tarjeta.
- **Recarga** por un filtro, la página o el orden: lo anterior, atenuado,
  mientras llega lo nuevo.
- **En segundo plano** (volver a la pantalla, un refresco periódico): nada; no
  se nota.
- **Error de carga:** el estado de error en la zona que falla, con
  «Vuelve a intentarlo». Sin conexión, su descripción lo dice: «Comprueba la
  conexión y vuelve a intentarlo.».
- **Vacíos,** sin punto ([D11](#d11-textos-y-formato)):
  - sin datos, «Todavía no hay ningún …»;
  - con filtros o una búsqueda, «Ningún … con estos filtros», con la acción
    «Quita los filtros».
- **Un registro que no existe:** su estado vacío, a pantalla completa, con
  una acción para volver a su lista.

**Por qué:** cada estado se reconoce de un vistazo, la pantalla no salta al
recargar y siempre queda una salida: reintentar, quitar los filtros o volver.

| Mal | Bien |
|---|---|
| Un indicador girando en medio de la página mientras carga una tabla | La cabecera de la tabla y el esqueleto de carga en su cuerpo |
| La tabla en blanco al cambiar un filtro | La tabla de antes, atenuada, hasta que llega la nueva |
| «No hay datos» en una tabla filtrada | «Ningún pedido con estos filtros», con «Quita los filtros» |
| Una página en blanco con «Error 404» al abrir un pedido borrado | «Este pedido no existe», con «Vuelve a los pedidos» |

## D4. Avisos y fallos

- **Un fallo dice «No se ha podido …»** en su título, sin punto; la
  descripción dice el motivo y qué hacer, con punto. Un código conocido de la
  API cambia la descripción, nunca el título.
- **Va donde se ve:**
  - al guardar una página, en el aviso de página, encima de la barra de
    acciones;
  - en un modal, al final de su cuerpo, con el modal abierto y lo escrito;
  - en un campo, por el schema o por la API, bajo el campo, en su nota;
  - en una acción inmediata (cambiar un estado, descargar un documento), en el
    aviso de página bajo la cabecera, que nombra el registro y se cierra con
    la ×.
- **Nunca en un aviso efímero:** se va solo, y un fallo hay que poder
  releerlo.
- **El aviso efímero solo sale cuando el control con el que se actuó
  desaparece o no cambia:** se cierra un modal, se guarda una edición, se da
  de baja algo. No sale cuando el propio control enseña el resultado (un
  estado que cambia, una descarga).
- **Se anuncia:** un fallo, en cuanto sale (`role="alert"`); el aviso efímero,
  sin interrumpir ([D12](#d12-accesibilidad)).

**Por qué:** un fallo que se ve junto a lo que lo ha causado se entiende y se
corrige; uno que desaparece solo se pierde.

| Mal | Bien |
|---|---|
| Un aviso efímero «Error al guardar» que se va a los 4 segundos | «No se ha podido guardar el pedido» en el aviso de página, encima de la barra, con «Comprueba la conexión y vuelve a intentarlo.» |
| Cerrar el modal y avisar del fallo en la página | El aviso al final del cuerpo del modal, que sigue abierto con lo escrito |
| «Error: CARRIER_REQUIRED» | Bajo el campo Transportista: «Elige un transportista para cerrar el pedido.» |
| «Se ha cambiado el estado» en un aviso efímero, con el selector ya en el estado nuevo | Nada: el selector ya lo dice |

## D5. Acciones

- **En cada zona, la salida a la izquierda y el primario el último,** a la
  derecha. Lo destructivo, al final.
- **Un solo primario por zona:** la barra de acciones, un modal, un formulario
  en línea.
- **Lo que el permiso o el estado no deja hacer no se ofrece,** ni desactivado
  ni con aviso.
- **Solo se desactiva lo que se desbloquea en la misma pantalla,** con la causa
  a la vista: en la propia zona, en la nota del botón o en la barra de
  acciones. Nunca solo en un tooltip.
- **Mientras una acción está en curso,** su botón lleva `loading` sin cambiar
  el texto, y se bloquea todo lo que actúa sobre lo mismo: los campos, el
  resto de la barra, las acciones de las demás filas.
- **Nada se pinta como hecho antes de que el servidor lo confirme:** no hay
  cambios optimistas.
- **Las tablas no tienen selección múltiple.** Una acción sobre muchos
  registros actúa sobre lo filtrado y va en la cabecera de la tabla
  ([D8](#d8-listados-y-tablas)).

**Por qué:** la misma acción en el mismo sitio se encuentra sin buscarla, lo
que no se puede hacer no se intenta, y lo que se ve es siempre lo guardado.

| Mal | Bien |
|---|---|
| «Guarda» a la izquierda y «Cancela» a la derecha | «Cancela» a la izquierda y «Guarda», el último |
| «Cancela el pedido» desactivado, con el tooltip «No tienes permiso» | Sin el botón: sin permiso no se ofrece |
| «Guarda» que pasa a «Guardando…» | «Guarda» con `loading`, el mismo texto |
| La fila tachada en cuanto se pulsa «Anula», antes de la respuesta | La fila igual y bloqueada hasta que el servidor responde |
| Una casilla en cada fila para enviar varios pedidos | «Envía los pendientes», en la cabecera de la tabla, con su confirmación que dice cuántos son |

## D6. Formularios

- **El alta y la edición de un registro son el mismo formulario:** las mismas
  secciones, los mismos títulos, el mismo orden y las mismas piezas. Solo
  cambian los campos que existen en una de las dos.
- **Se valida con el schema:** nada antes del primer intento (guardar,
  continuar, el botón del modal); después, cada campo al cambiar, y su error
  se va en cuanto se corrige. El error va bajo su campo, en una frase completa
  con punto.
- **«Hay N campos por revisar»** sale en la barra de acciones de toda pantalla
  de formulario, tras un intento con errores; se actualiza al corregir y
  desaparece al llegar a cero. El foco va al primer campo con error.
- **Mientras se guarda,** los campos y las acciones del formulario se
  desactivan, y el primario lleva `loading` ([D5](#d5-acciones)).
- **Cambios sin guardar:** un formulario con cambios avisa antes de salir de
  la pantalla. El «Cancela» de una fila, una tarjeta o un modal cierra sin
  preguntar: pulsarlo ya es una decisión.
- **Con tres secciones o más,** cada una es una sección plegable, todas
  abiertas al entrar; al guardar con errores, se despliegan las que los
  tienen.
- **Lo que no se edita se lee como texto,** nunca como un campo desactivado.
  Desactivado queda para lo que se activará en la misma pantalla.

**Por qué:** quien rellena un formulario ve los errores cuando ya ha
intentado algo, sabe cuántos le quedan y no pierde lo escrito por un clic.

| Mal | Bien |
|---|---|
| «Este campo es obligatorio.» en rojo antes de escribir nada | Sin errores hasta el primer «Guarda» |
| Un formulario de alta y otro de edición, con los campos en otro orden | El mismo formulario, con las mismas secciones |
| El número del pedido en un campo de texto desactivado | «Número: #1287», como texto |
| El «Cancela» de una fila que pregunta «¿Seguro?» | Cierra la fila sin preguntar |
| Salir con cambios y perderlos sin aviso | «¿Quieres salir sin guardar?», con «Sigue editando» y «Descarta los cambios» |

## D7. Un registro, una pantalla

- **Cada registro tiene una sola pantalla, su gestión:** la feature
  `<familia>Edit`, en `/<familia>/:id/edit` (`ordersEdit`). No hay ficha
  aparte: `/<familia>/:id` no es una ruta.
- **La cabecera lleva el estado junto al título,** solo para leer, nunca como
  desplegable. El título dice lo que se hace: «Gestiona el pedido #1287».
- **Las pestañas van en `?tab=`,** con `replace`; la primera no lleva
  parámetro.
- **Lo que se edita va en un solo formulario,** repartido en sus pestañas, con
  un solo «Guarda» en la barra de acciones, en todas ellas.
- **Al guardar, se sigue en la pantalla,** con el foco en «Guarda» y el
  formulario a partir de lo guardado.
- **Lo inmediato va fuera del «Guarda»** (cambiar el estado, subir un
  documento): actúa al momento. Si cambia datos del formulario, se desactiva
  mientras haya cambios sin guardar, con la causa a la vista.
- **Sin permiso de editar,** la misma pantalla en lectura, sin barra, con un
  aviso bajo la cabecera que no se cierra.

**Por qué:** un solo sitio por registro: los enlaces, las notificaciones y el
listado llevan a la misma pantalla, y no hay dos versiones que mantener.

| Mal | Bien |
|---|---|
| Una ficha en `/orders/1287` y otra pantalla para editar el pedido | Una sola, `/orders/1287/edit` |
| Un «Guarda» en cada pestaña | Uno solo en la barra, que guarda todas |
| «Edita» en cada tarjeta | Los campos, ya editables en su sección |
| El estado como desplegable en la cabecera | El estado junto al título; se cambia donde lo decide su familia |
| Sin permiso de editar, «Gestiona» lleva a un error | La misma pantalla, en lectura, con «No puedes editar este pedido» |
| Al guardar, volver al listado | Seguir en la pantalla, con «Se han guardado los cambios» |

## D8. Listados y tablas

- **Solo las columnas imprescindibles,** sin texto libre (comentarios,
  descripciones): eso va al CSV.
- **Las columnas, en un orden fijo:** número, lo que nombra el registro, tipo,
  estado, señales (el plazo, la prioridad), fechas, cifras y texto. El número va
  como «#1287»; las cifras, a la derecha.
- **Todas las acciones de la tabla van en su cabecera,** de izquierda a
  derecha: el buscador, «Exporta», lo que actúa sobre lo filtrado y, la
  última, «Crea…». Nunca debajo ni al pie.
- **La cabecera de la tabla se ve siempre:** el esqueleto de carga y el estado
  de error ocupan solo su cuerpo.
- **Paginación de 10 filas, o 25 o 50 a elegir.** Se vuelve a la página 1 al
  cambiar los filtros, la búsqueda, el orden o el tamaño.
- **El buscador espera 400 ms** desde la última tecla si busca en el
  servidor; Enter lo lanza al momento.
- **Como mucho dos acciones por fila,** y la última, la que abre el registro
  («Gestiona»). El resto, tras el menú ⋮, siempre el último de la fila, con la
  destructiva al final.
- **La fila no se abre al pulsarla:** se abre con su acción.
- **Filtros, página y orden sobreviven a navegar y a recargar,** en el
  `sessionStorage`; nunca en la URL, y sin la búsqueda.

**Por qué:** una tabla que cabe y se lee de un vistazo; las acciones siempre
en el mismo sitio; y al volver de un registro, la lista está como se dejó.

| Mal | Bien |
|---|---|
| Una columna «Comentario» con el texto entero | El comentario, en el CSV |
| «Exporta» y «Crea un pedido» al pie de la tabla | En la cabecera, con «Crea un pedido» el último |
| Cuatro botones en cada fila | «Gestiona» y el ⋮ con el resto |
| Pulsar la fila abre el pedido | Lo abre «Gestiona» |
| `/orders?status=pending&page=3` | La URL limpia; los filtros y la página, en el store de la pantalla |
| Una búsqueda en el servidor con cada tecla | Una búsqueda a los 400 ms de la última |

## D9. Modales

- **Un modal decide o pide lo mínimo; nunca sirve para leer.** Confirma, pide
  los datos que la acción necesita o elige. Lo que se lee se enseña en su
  sitio («Muestra…»).
- **Su botón principal dice lo que hace:** «Guarda» solo si guarda en el
  servidor; si devuelve algo a un formulario que se guarda después, «Añade …»
  o «Aplica …».
- **Solo se confirma lo que no se puede deshacer,** con el modal de
  confirmación, cuyo título es una pregunta: «¿Quieres cancelar el pedido?».
  Quitar algo que aún no se ha guardado no se confirma.
- **Una confirmación se cierra sin preguntar.** Un formulario en un modal solo
  pregunta si se cierra con cambios por la ×, Escape o pulsando fuera; su
  «Cancela» cierra sin preguntar.
- **Mientras actúa, se bloquea entero,** también la × y Escape, y su fallo va
  al final del cuerpo, con el modal abierto y lo escrito
  ([D4](#d4-avisos-y-fallos)).
- **Al cerrarse, el foco vuelve al control que lo abrió.**

**Por qué:** un modal interrumpe; si solo aparece para decidir, se entiende
qué pide y su botón dice qué va a pasar.

| Mal | Bien |
|---|---|
| Un modal para ver el detalle de una línea | La línea, en su sitio, con «Muestra la línea» |
| «Guarda» en un modal que solo añade una línea al formulario | «Añade la línea» |
| «¿Seguro que quieres quitar esta línea?» antes de guardar | Se quita; nada se guarda hasta «Guarda» |
| «¿Quieres salir?» al cerrar una confirmación | Se cierra |
| Cerrar el modal con Escape mientras guarda | El modal, bloqueado hasta la respuesta |

## D10. Navegación

- **Lo que lleva a otra pantalla es un enlace** (con `href`), con aspecto de
  botón donde toque; nunca `navigate` en un `onClick`. Lo que hace algo sin
  cambiar de pantalla es un botón.
- **El título de una pantalla del menú es el de su entrada.**
- **La pestaña del navegador dice «<título> · %%APP_NAME%%»,** sin datos
  personales: en la gestión de un registro, «Pedido #1287 · %%APP_NAME%%».
- **Volver lleva a donde se estaba:** el origen pasa `back`, con el texto y la
  ruta, en el estado de navegación. Nunca lleva a una pantalla sin permiso.
- **Al entrar en una pantalla,** el scroll va arriba y el foco a su `h1`.
- **La página que no existe, la que no se puede ver y el error** se pintan
  dentro de la app, con su marco y una salida.

El detalle técnico está en
[Rutas, permisos y navegación](../standards.md#rutas-permisos-y-navegación).

**Por qué:** un enlace se abre en otra pestaña, se copia y el lector de
pantalla lo anuncia como enlace; y quien vuelve, vuelve a donde estaba.

| Mal | Bien |
|---|---|
| `<button onClick={() => navigate('/orders/new')}>` | Un enlace a `/orders/new` con aspecto de botón |
| La pestaña «Pedido de Marta Puig · %%APP_NAME%%» | «Pedido #1287 · %%APP_NAME%%» |
| «Vuelve» que siempre lleva al listado, aunque se viniera de un envío | «Vuelve al envío #12» |
| La página en blanco del servidor para una ruta que no existe | «Esta página no existe», dentro de la app, con «Vuelve al inicio» |
| Una entrada del menú que aún no lleva a ninguna parte | La entrada no está hasta que su pantalla existe |

## D11. Textos y formato

- **Se trata de tú.** Solo llevan mayúscula el principio, los nombres propios
  y las siglas.
- **Toda acción va en imperativo, con verbo y objeto:** «Guarda», «Crea el
  pedido», «Quita el filtro». Nunca en infinitivo.
- **Cada verbo, para lo suyo:** «Crea…» da de alta un registro; «Guarda» es
  para lo que ya existe; «Aplica…» devuelve algo a un formulario sin
  guardarlo; «Gestiona…» abre la gestión de un registro; «Abre…», otra
  pantalla; y «Muestra…» enseña algo en el sitio.
- **El punto final:** lo que se lee como un título (un aviso, un vacío, una
  etiqueta) va sin punto; el texto que lo acompaña, con punto.
- **El formato, con las funciones comunes de la raíz**
  ([Textos](../standards.md#textos)): las fechas, con su función; los miles,
  siempre («1.500»); los porcentajes, enteros y con espacio («65 %»); las
  medias, con un decimal («3,8»).
<!-- kit:if i18n -->
- **Los plurales, con `count`:** «1 pedido», «2 pedidos».
<!-- kit:else -->
- **Los plurales, según la cifra:** «1 pedido», «2 pedidos».
<!-- kit:end -->
- **Lo que falta es «-».**
- **Un registro es «#1287» en una tabla y «Pedido #1287» fuera de ella.**

**Por qué:** la app habla con una sola voz: el mismo verbo hace siempre lo
mismo, y un dato se lee igual en todas las pantallas.

| Mal | Bien |
|---|---|
| «Guardar», «Nuevo» | «Guarda», «Crea un pedido» |
| «Guarda» al final del alta de un pedido | «Crea el pedido» |
| «Ver pedido» | «Gestiona el pedido #1287» |
| «Se ha guardado el pedido.» en un aviso efímero | «Se ha guardado el pedido» |
| «0.65», «1500», «3.833» | «65 %», «1.500», «3,8» |
| «1 pedidos» | «1 pedido» |
| Una celda vacía, o «null» | «-» |

## D12. Accesibilidad

- **Todo botón de icono lleva `aria-label`,** que dice qué hace: «Quita el
  filtro Estado».
- **El foco siempre se ve,** salvo en el título al que se lleva al entrar en
  una pantalla, que no es un control.
- **Los títulos no saltan niveles:** `h1`, la cabecera de la página; `h2`,
  cada sección o tarjeta; `h3`, lo que va dentro.
- **Los landmarks:** un solo `main`; la navegación y la miga, cada una en su
  `nav` con su nombre; la cabecera, en `header`.
- **Todo se hace con teclado,** también lo que se arrastra (desde un menú).
- **Nada que se pulse mide menos de 24 × 24 px.**
- **Contraste:** solo combinaciones de tokens que lo cumplen.
- **Un fallo se anuncia** (`role="alert"`); un recuento o un progreso, sin
  interrumpir (`role="status"`).
- **Cada pantalla se prueba** con el teclado, con un lector de pantalla y con
  el zoom al 200 %, antes de darla por buena.

**Por qué:** la app la usan personas con teclado, con lector de pantalla o con
zoom; lo que solo funciona con el ratón deja fuera a alguien.

| Mal | Bien |
|---|---|
| Un botón con solo una papelera, sin nombre | El mismo botón con `aria-label="Quita la línea 2"` |
| `outline: none` en los botones | El foco visible del sistema de diseño |
| Un `h1` y después un `h4` | `h1`, `h2`, `h3`, sin saltos |
| Una × de 16 px para quitar un filtro | La × con una zona de pulsar de 24 px |
| El recuento nuevo tras filtrar, sin anunciar | El recuento en una región `role="status"` |

## D13. Movimiento

- **Cuánto se mueve lo dice el sistema de diseño,** en «Movimiento»: nada,
  lo justo o vistoso. Las duraciones y las curvas son tokens, como los
  colores.
- **El movimiento explica:** de dónde viene algo y qué ha cambiado (un modal
  que se abre, una fila que se añade, un aviso que llega). En lo que se usa,
  corto: de 150 a 300 ms.
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

Lo que es propio de cada proyecto (colores con significado, anchos, iconos de
cada acción, impresión, exportación a CSV con su formato) se añade como norma
nueva con una propuesta.
