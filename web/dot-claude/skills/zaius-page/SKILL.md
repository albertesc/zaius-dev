---
name: zaius-page
description: Especifica con la persona una página del backlog, nueva o ya hecha. Escribe en docs/pages/<NOMBRE>.md, con su plantilla, para qué es y su llamada a la acción, sus secciones con su pieza del sistema de diseño, su contenido (los textos, las imágenes, el vídeo y el movimiento), sus datos, lo que ven los buscadores y al compartirla, su rendimiento y la lista de tests, que es la especificación, y hace su boceto desde el móvil. La deja «por aprobar» y para hasta el OK; con él, «aprobada». Un cambio de una página hecha también empieza aquí. No escribe código.
disable-model-invocation: true
argument-hint: <HOME>
---

# Especificar una página

La especificación dice qué verá y qué podrá hacer quien visite la página, con
qué contenido y con qué tests se comprueba. La lista de tests aprobada es la
especificación: `zaius-build` la construye de un test en uno. En una web, el
documento de la página es a la vez su especificación y lo que dice de ella
mientras exista: no hay otro.

## Lee primero

- [AGENTS.md](../../../AGENTS.md), entero, y
  [Cómo se trabaja con la IA](../../../docs/process.md): la persona decide,
  hablar con la persona, iterar y empezar de cero.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).
- El fichero de la página, en `docs/pages/`, y su línea en el
  [backlog](../../../docs/backlog.md), con el mapa del sitio.
- [Páginas](../../../docs/pages/README.md): su
  [plantilla](../../../docs/pages/README.md#plantilla), con lo que lleva cada
  apartado, y cómo se escribe.
- [El brief](../../../docs/brief.md): para qué es la web, para quién, su
  tono, quién da el contenido, sus idiomas y legales y sus objetivos de
  accesibilidad, buscadores y rendimiento.
- [Normas](../../../docs/ux-ui/rules.md) y el
  [sistema de diseño](../../../docs/ux-ui/design-system.md), con
  [Anchos](../../../docs/ux-ui/design-system.md#anchos) y
  [Piezas por papel](../../../docs/ux-ui/design-system.md#piezas-por-papel):
  lo que ya está decidido no se pregunta.
- [Crear una página](../../../docs/guides/create-a-page.md), en lo que toca a
  [buscadores y compartir](../../../docs/guides/create-a-page.md#buscadores-y-compartir)
  y a [imágenes y vídeo](../../../docs/guides/create-a-page.md#imágenes-y-vídeo),
  y [Añadir una isla](../../../docs/guides/add-an-island.md): cuándo hace
  falta.
- [Escribir tests](../../../docs/guides/write-tests.md): qué se prueba y en
  qué nivel.
<!-- kit:if content -->
- [Añadir contenido](../../../docs/guides/add-content.md): las colecciones.
<!-- kit:end -->
<!-- kit:if server -->
- [Crear un formulario](../../../docs/guides/create-a-form.md): lo que pide
  un formulario.
<!-- kit:end -->
<!-- kit:if backend -->
- [Cargar y guardar datos](../../../docs/guides/load-and-save-data.md): lo
  que pinta la página cuando el dato de otro sistema falla o no llega.
<!-- kit:end -->
<!-- kit:if privateArea -->
- [Aplicar permisos](../../../docs/guides/apply-permissions.md): quién puede
  ver cada página de la zona privada.
<!-- kit:end -->

## Antes de empezar

1. **La página:** su nombre o su ruta (`/zaius-page ROOMS`, o eligiéndola
   con `@`). Sin ninguna, propón la primera «pendiente» del backlog y
   espera. Una que no está en el backlog es una página nueva: propónla y,
   con el OK, apúntala, «pendiente», con su fichero, como hace
   `/zaius-backlog`.
2. **Su estado:**
   - «pendiente»: se especifica, desde el paso 1;
   - «por aprobar»: se sigue donde se quedó, con lo que diga «Dónde
     estamos»;
   - «aprobada», «en curso», «por cerrar» o «hecha»: cambia lo que se pidió:
     [Cambiar una página](#cambiar-una-página).
3. **El proyecto, iniciado:** si el brief no dice «Estado: aprobado el …», o
   el sistema de diseño sigue «Pendiente de definir», para: primero,
   `/zaius-init`.
4. **Lo que pide:** si la página necesita algo con lo que la web no se
   instaló (un formulario, un blog, datos de otro sistema, una zona privada),
   dilo, con la orden del kit que lanza la persona en la terminal,
   `%%KIT_RUN%% change`:
   se puede especificar, pero no se construye hasta que la web lo tenga.
5. **El marco:** la cabecera, con el menú, y el pie llegan con la primera
   página que se construye, HOME si se sigue el backlog. Si es esta, sus
   secciones empiezan y acaban con ellos, como dice el mapa del sitio.

## Pasos

Cada apartado va en el fichero de la página, con la
[plantilla](../../../docs/pages/README.md#plantilla) y en su orden, en cuanto
se sabe.

1. **Lo que falta saber,** en tandas de 1 a 3 preguntas, cada una con la
   opción recomendada primero y «No lo sé», por lo que ve y hace quien la
   visita: qué tiene que ver nada más llegar, qué tiene que hacer después
   (la llamada a la acción), qué secciones lleva y en qué orden, qué pasa al
   pulsar cada cosa y de dónde sale cada dato. Lo que ya dicen el brief, las
   normas o el sistema de diseño no se pregunta, y nunca se inventa un
   requisito. Cada respuesta va al fichero en el momento, y la pregunta
   abierta, a «Dónde estamos», antes de hacerla.
2. **Para qué:** lo que tiene que conseguir, en dos o tres líneas, y su
   llamada a la acción: el botón o el enlace que más importa, con su texto y
   adónde lleva.
3. **Las secciones,** de arriba abajo en el móvil: cada una con lo que
   enseña y la pieza que la pinta, por su papel
   ([Piezas por papel](../../../docs/ux-ui/design-system.md#piezas-por-papel)),
   y lo que se mueve, si algo se mueve, con el nivel de «Movimiento» del
   sistema de diseño; con «reducir movimiento», solo un fundido
   ([D13](../../../docs/ux-ui/rules.md#d13-movimiento)). Una pieza que el
   sistema de diseño no tiene va a su «Lo que falta» y se dice en el OK: es
   un tipo de componente nuevo. Lo que necesita y las normas no dicen va
   antes con `zaius-design`, y esa parte espera a que se acepte.
4. **El contenido:**
   - **los textos,** de quien diga el brief: si los da la persona, se le
     piden, con cuándo llegan; si los propone la IA, van en el documento, con
     el tono del brief, y se aprueban con él;
<!-- kit:if i18n -->
   - **los idiomas:** cada texto, en %%LANGUAGES%%, con quién lo traduce;
<!-- kit:end -->
   - **los legales,** nunca propuestos por la IA: los da la persona o quien
     lleve lo legal, con los datos de la empresa que llevan;
   - **lo que falta:** cada texto, foto o vídeo que no ha llegado, con quién
     lo da y cuándo. Mientras, el boceto lleva un texto de prueba verosímil,
     marcado como tal, o el hueco de la foto, nunca «Lorem ipsum»;
   - **las imágenes:** cuáles, de dónde salen (propias, de un fotógrafo, de
     un banco de imágenes con su licencia), su forma (horizontal o vertical)
     y su tamaño mínimo, y su texto alternativo, que dice lo que se ve; la que
     solo adorna, sin él
     ([Imágenes y vídeo](../../../docs/guides/create-a-page.md#imágenes-y-vídeo));
   - **el vídeo:** uno propio, corto, sin sonido si arranca solo, con su
     imagen de espera y su pausa; uno de YouTube o de Vimeo se carga al
     pulsarlo, y hasta entonces es su imagen con un botón de reproducir, sin
     las cookies de la plataforma.
5. **Los datos,** de dónde sale cada dato que se ve y quién lo cambia, como
   dice su línea del backlog:
   - la página: sus textos;
   - `constants/`: qué datos, con sus campos;
<!-- kit:if content -->
   - una colección: sus campos, quién escribe las entradas y en qué orden
     salen;
<!-- kit:end -->
<!-- kit:if server -->
   - un formulario: sus campos y sus reglas (obligatorios, máximos), qué ve
     quien lo envía, adónde llega lo que se escribe (un correo, otro
     sistema), que se pregunta si nadie lo ha dicho, y si la página se pinta
     en cada petición. Funciona sin JavaScript;
<!-- kit:end -->
<!-- kit:if backend -->
   - la API: qué dato, de qué endpoint (si no se sabe, se pregunta), y qué
     ve quien visita si falla o no hay nada;
<!-- kit:end -->
<!-- kit:if privateArea -->
   - en la zona privada, quién puede verla y qué puede hacer cada uno, por
     sus permisos, y qué ve quien no puede;
<!-- kit:end -->
   - varios, si la página junta más de uno.
6. **Buscadores y compartir**
   ([D14](../../../docs/ux-ui/rules.md#d14-buscadores-y-compartir)): su
   título, único; su descripción, de una o dos frases (unos 150 caracteres),
   que dice qué hay en ella; su imagen para compartir, de 1200 × 630 px, o la
   de la portada si no lleva una propia; o `noindex`, si no se ofrece a los
   buscadores (lo privado y las páginas de error).
<!-- kit:if i18n -->
   El título y la descripción, en cada idioma.
<!-- kit:end -->
7. **El rendimiento,** con lo que pide «Objetivos» del brief: qué imagen
   carga enseguida (solo la primera que se ve al entrar; las demás, al
   acercarse), el vídeo, y que nada pesado retrase lo primero que se ve.
   Todo se ve y funciona sin JavaScript; si la página lo lleva, qué y por
   qué. Lo que pide más que un pequeño script (un calendario para elegir
   fechas) es una isla: se dice en el OK, y la primera de la web trae React,
   una dependencia nueva
   ([Añadir una isla](../../../docs/guides/add-an-island.md)).
8. **Los tests,** en su tabla, `Test | Nivel | ✓`:
   - **cada cosa que la página tiene que enseñar o hacer, con al menos un
     test,** en el nivel más alto que se pueda: la página, pintada entera,
     antes que un componente o un util;
   - **los de buscadores y compartir:** que lleva su título, su descripción y
     su imagen, o su `noindex`;
<!-- kit:if server -->
   - **los de cada formulario:** su action, con lo que acepta, lo que
     rechaza con el error de cada campo y adónde manda lo que se escribe;
<!-- kit:end -->
<!-- kit:if i18n -->
   - **la página en otro idioma,** en su URL (`/en/rooms`), con sus textos;
<!-- kit:end -->
   - **los de cada fichero con código** que pide
     [Lo que se prueba](../../../docs/guides/write-tests.md#1-lo-que-se-prueba);
   - **el nivel:** página, componente, util, schema,
<!-- kit:if server -->
     action,
<!-- kit:end -->
<!-- kit:if backend -->
     service,
<!-- kit:end -->
     o «verificación manual» para lo que no se automatiza bien: cómo se ve en
     cada ancho de [Anchos](../../../docs/ux-ui/design-system.md#anchos), que
     se recorre con el teclado, cómo queda con «reducir movimiento» y lo que
     solo se juzga mirándolo (las fotos, el contraste), que se mira en
     `zaius-review`;
   - **cada test, con lo que comprueba,** en una frase, como se escribirá en
     el código («enseña una tarjeta por habitación, con su precio por
     noche»).

   La lista aprobada es la especificación: `zaius-build` escribe estos, en
   este orden, y uno nuevo, cambiado o quitado necesita el OK.
9. **El boceto,** con `zaius-sketch`: `docs/ux-ui/mockups/<NOMBRE>.html`, en
   el nivel de «Bocetos» del sistema de diseño, diseñado desde el móvil (el
   ancho más estrecho de «Anchos») y comprobado en el más ancho, con el
   contenido que hay (y el de prueba, marcado) y cada estado de la página:
   un formulario vacío, con errores y enviado; una lista con entradas y sin
   ninguna.
10. **El tamaño:** si el documento pasa de unas 200 líneas, la página hace
    demasiado: propón partirla, y las partes nuevas van al backlog con el OK,
    «pendiente», con su fichero.
11. **«Por aprobar»:** el estado, en el fichero y en el backlog, con la
    fecha, y «Dónde estamos» al día.
12. **El OK,** con lo que la persona va a ver, en unas líneas:

    ```text
    ROOMS Las habitaciones, lista para tu OK
    Verás: <lo que se verá, de arriba abajo, en una o dos líneas>
    Podrás: <lo que podrá hacer quien la visite, y adónde lleva su llamada a la acción>
    En los buscadores y al compartirla: <su título y su descripción, o que no sale>
    Falta: <los textos, las fotos o los legales que no han llegado, con quién los da>
    Se comprobará: <los tests, con palabras de la web, en una o dos líneas>
    El boceto: docs/ux-ui/mockups/ROOMS.html (se abre con doble clic)
    ¿La doy por aprobada, o cambio algo?
    ```

    Lo que pida se cambia en el fichero y en el boceto, y se enseña solo lo
    que ha cambiado, hasta su sí.
13. **Con el OK:** «aprobada» con la fecha, en el fichero y en el backlog; en
    «Dónde estamos», lo siguiente, `/zaius-build <NOMBRE>`, que lanza la
    persona. Para: no escribe código.

## Cambiar una página

Una página «aprobada», «en curso», «por cerrar» o «hecha» cambia primero
aquí, y después en el código. Un cambio de textos o de datos que pide la
persona (un precio, una frase, una foto) no pasa por aquí: se hace y se
cierra con `/zaius-review`
([La persona decide](../../../docs/process.md#la-persona-decide)).

1. **Lo que cambia,** con palabras de la web, en tandas de 1 a 3 preguntas:
   qué se verá distinto, qué se podrá hacer y qué deja de hacerse. Otra URL
   es otra página, o un cambio de URL del backlog (`/zaius-backlog`).
2. **El documento,** escrito como si siempre hubiera sido así, sin «antes»
   ni «ahora»: lo que el cambio quita se quita también de él. Sus apartados,
   el boceto, con la página como quedará, y la lista de tests: uno que
   cambia se desmarca; uno que sobra, con el OK, se quita de la lista y del
   código en `zaius-build`.
3. **«Por aprobar»,** con la fecha, en el fichero y en el backlog, y el OK
   como la primera vez, con solo lo que cambia. Si quita algo que quien
   visita ya usa (una sección, un enlace del menú), dilo aparte.
4. **Con el OK,** «aprobada», y lo siguiente, `/zaius-build <NOMBRE>`, que
   sigue por el primer test sin marcar.

## Comprobación

- [ ] El fichero, con los apartados de la plantilla en su orden.
- [ ] La cabecera, con su nombre y su título, y debajo su URL y su estado
      con la fecha, el mismo que en el backlog.
- [ ] Su para qué, con su llamada a la acción y adónde lleva.
- [ ] Cada sección, en su orden, con su pieza del sistema de diseño.
- [ ] El contenido: quién da cada texto, foto y vídeo, y lo que falta,
      apuntado; ningún texto legal propuesto por la IA.
- [ ] Sus datos, sus buscadores y compartir y su rendimiento, escritos.
- [ ] Cada cosa que tiene que enseñar o hacer, con su test; cada test, con
      su nivel.
- [ ] El boceto, desde el móvil y con cada estado, en
      `docs/ux-ui/mockups/`.
- [ ] Ningún requisito inventado y ningún fichero de código tocado.
- [ ] Con el OK, «aprobada» con su fecha, y «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la web, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el documento, el boceto y la lista de tests: la persona los aprueba o
  pide cambios, en el mismo fichero hasta su sí.
- Con cada duda abierta: pregúntala antes de seguir; no la resuelvas tú.
- Con un contenido que falta: quién lo da y cuándo; no lo inventes.
- Si la página pide algo que el brief deja fuera: dilo; se cambia antes el
  brief, con `/zaius-init`.
- Si la página pide algo con lo que la web no se instaló: dilo, con la orden
  del kit, que lanza la persona.
- Con un tipo de componente nuevo, una norma de diseño, una isla o una
  dependencia nueva que pida la página: dilo en el OK, con qué es, para qué
  hace falta y qué pasa sin ella.
- Antes de partir la página y de llevar las partes al backlog.
- Al terminar: no construye nada. La etapa siguiente la lanza la persona.
