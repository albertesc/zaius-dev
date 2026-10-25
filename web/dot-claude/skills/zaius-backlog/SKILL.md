---
name: zaius-backlog
description: Escribe con la persona el backlog de la web, después de zaius-init. Habla el sitio (qué páginas tiene, qué tiene que conseguir cada una y cómo se llega a ellas), dice lo que pide un cambio del kit (un formulario, un blog, una zona privada, datos de otro sistema) y deja docs/backlog.md, que se entiende sin saber programar, con el mapa del sitio (el menú y el pie) y un apartado por página, HOME primero, y el fichero de cada página en docs/pages/, «pendiente», con su fila en el índice. Para hasta el OK. Se vuelve a lanzar para añadir, cambiar, partir, ordenar o quitar páginas.
disable-model-invocation: true
---

# Escribir el backlog

El backlog es la lista de las páginas de la web y su mapa del sitio: qué
páginas tiene, qué tiene que conseguir cada una y cómo se llega a ellas. Cada
página se especifica después, de una en una, con `/zaius-page`.

## Lee primero

- [AGENTS.md](../../../AGENTS.md), entero, y
  [Cómo se trabaja con la IA](../../../docs/process.md): la persona decide,
  hablar con la persona e iterar.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).
- [El brief](../../../docs/brief.md): para qué es la web y su acción
  principal, para quién, su contenido, sus idiomas y sus legales.
- [El backlog](../../../docs/backlog.md), con su forma, en «Cómo se
  escribe», y los ficheros de `docs/pages/`, si ya hay páginas, con
  [El nombre y el fichero](../../../docs/pages/README.md#el-nombre-y-el-fichero)
  y su [índice](../../../docs/pages/README.md#índice).

## Antes de empezar

1. **El brief:** si su cabecera no dice «Estado: aprobado el …», para:
   primero, `/zaius-init`.
2. **Lo que se pide:** sin páginas en el backlog, se escribe entero, desde el
   paso 1. Si está «por aprobar», se sigue desde el OK (paso 4): enséñalo y
   pregunta. Con páginas aprobadas, es un cambio:
   [Cambiar el backlog](#cambiar-el-backlog).
<!-- kit:if existing -->
3. **Lo que ya existe:** las páginas que el proyecto ya tenía las apunta
   `zaius-adopt`, «hechas». Las nuevas van detrás.
<!-- kit:end -->

## Cómo es una página

- **Una dirección de la web,** con lo que tiene que conseguir de quien la
  visita: la portada, las habitaciones, el contacto. Las que se repiten con
  la misma forma, como cada entrada del blog, son una sola: BLOG-POST,
  `/blog/[...slug]`.
- **Su nombre sale de su URL:** el prefijo de la URL (`/`, home; `/rooms`,
  rooms; `/legal/notice`, legalNotice), en mayúsculas y con un guion entre
  las palabras: HOME, ROOMS, LEGAL-NOTICE, BLOG-POST. La URL y el nombre van
  en inglés; el título que se ve, en el idioma de la web («Las
  habitaciones»). Los pones tú, desde lo que cuente la persona: no se le
  preguntan.
- **Su para qué,** como una historia de quien la visita, en una frase: «Como
  <quién>, quiero <qué>, para <para qué>.», con quien la visita según «Para
  quién» del brief, con su nombre («Como pareja que busca una escapada», «Como
  cliente») o, si no se distingue, «Como visitante»; nunca una perífrasis como
  «Como quien visita la web». Y con sus palabras: lo que viene a hacer en ella
  (conocer la casa, elegir habitación, pedir unas fechas). Si tiene una llamada
  a la acción (el botón que más importa: «Reserva», «Escríbenos»), va en la
  frase. Una página no se parte en varias historias: se entrega entera, y su
  historia dice a qué viene quien llega a ella.
- **Lo que enseña:** de dónde sale lo que se ve, con palabras de la web,
  una o varias, que dicen también dónde irá:
  - «sus textos»: los de la propia página, con sus imágenes (el aviso
    legal);
  - «los datos de …», con lo que son: unos pocos que se repiten o cambian de
    vez en cuando (las habitaciones, con su capacidad y su precio), que
    irán en `constants/`;
<!-- kit:if content -->
  - «las entradas de …»: lo que se escribe como entradas, una por fichero
    (las del blog, los rincones del entorno), que irán en una colección de
    `content/`;
<!-- kit:end -->
<!-- kit:if server -->
  - «un formulario»: lo que escribe quien la visita y la web recibe (el
    contacto);
<!-- kit:end -->
<!-- kit:if backend -->
  - «lo que da …», con el sistema: datos de otro sistema en el momento (la
    disponibilidad de las habitaciones, del programa de reservas), por su
    API;
<!-- kit:end -->
- **La primera, HOME:** con ella nacen el marco (la cabecera, el menú y el
  pie) y lo que comparten todas. Las demás crecen sobre ella.
- **Las legales,** si el brief las pide: el aviso legal (LEGAL-NOTICE,
  `/legal/notice`), la privacidad (PRIVACY, `/privacy`) y, si la web usa
  cookies que no son imprescindibles (una analítica con cookies, un vídeo de
  YouTube), las cookies (COOKIES, `/cookies`). Sus textos no los propone la
  IA: los da la persona o quien lleve lo legal, y el brief dice quién.
- **Sin secciones ni textos:** lo que lleva cada página, sus textos y su
  aspecto llegan con `/zaius-page`.

## El mapa del sitio

- **El menú:** las páginas a las que se llega desde la cabecera, en su orden,
  con el texto de cada entrada («Habitaciones») y su página. Pocas: de 4 a
  6.
- **El pie:** lo que va abajo en todas: las legales, el contacto, las redes.
- **Lo demás** se alcanza desde otra página, y su para qué lo dice: cada
  entrada del blog, desde el blog.

## Lo que pide un cambio del kit

Algunas páginas necesitan algo con lo que la web no se instaló. Se añade con
una orden del kit, que lanza la persona en la terminal, en la carpeta del
proyecto, con Sí a su pregunta:
`%%KIT_RUN%% change`.
Díselo al apuntar la página, con la orden lista para copiar; la página se
apunta igual, y se puede especificar, pero no construir hasta que la web lo
tenga.

<!-- kit:if server -->
- **Un formulario** (el contacto, pedir presupuesto): la web ya recibe lo que
  se escribe; su página enseña «un formulario».
<!-- kit:else -->
- **Un formulario** (el contacto, pedir presupuesto) pide que la web reciba
  lo que se escribe, con un servidor: «¿La web recibe mensajes o datos de
  quien la visita?». Pregunta antes si hace falta, con estas opciones: **el
  formulario** (recomendada, si quien visita tiene que escribir algo: un
  mensaje, unas fechas), que pide el cambio; o **un enlace** que abre el
  correo o WhatsApp de la casa, sin formulario ni cambio.
<!-- kit:end -->
<!-- kit:if content -->
- **Un blog, noticias o artículos:** la web ya tiene las colecciones; sus
  páginas enseñan «las entradas de …».
<!-- kit:else -->
- **Un blog, noticias o artículos,** que se escriben como entradas: «¿Lleva
  blog, noticias o artículos?».
<!-- kit:end -->
<!-- kit:if backend -->
- **Datos de otro sistema** (la disponibilidad real de las habitaciones,
  del programa de reservas): la web ya se conecta a él; su página lleva
  «lo que da …».
<!-- kit:else -->
- **Datos de otro sistema** en el momento (la disponibilidad real de las
  habitaciones, del programa de reservas): «¿La web muestra datos de otro
  sistema (una API)?».
<!-- kit:end -->
<!-- kit:if privateArea -->
- **La zona privada:** la web ya la tiene. Su entrada (LOGIN, `/login`,
  «Entrar») y sus páginas, con el prefijo de su zona (ACCOUNT-BOOKINGS,
  `/account/bookings`, «Mis reservas»), van como las demás; no se ofrecen a
  los buscadores, y quién puede ver cada una lo dice su especificación.
<!-- kit:else -->
- **Una zona privada** (los huéspedes entran con su cuenta a ver sus
  reservas): «¿La web tiene una zona privada?», que trae el servidor, la
  conexión con el sistema que da las cuentas y la sesión. Con ella llegan su
  entrada (LOGIN, `/login`) y sus páginas (ACCOUNT-BOOKINGS,
  `/account/bookings`, «Mis reservas»).
<!-- kit:end -->

Si lo principal es entrar con una cuenta (casi todo se hace dentro, con
usuarios, permisos y pantallas de gestión), lo que se construye es una app,
no una web: dilo antes de seguir. Una app es otro proyecto, que se instala
con el kit.

## Pasos

1. **El sitio, hablado,** en tandas de 1 a 3 preguntas, cada una con la
   opción recomendada primero y «No lo sé», que se queda con la recomendada
   ([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)):
   qué páginas necesita, qué tiene que hacer quien llega a cada una y cómo
   llega (el menú, el pie, desde otra página). Lo que ya dice el brief no se
   vuelve a preguntar. Nunca se inventa una página que nadie ha pedido: si
   parece que falta una (el contacto, las legales que pide el brief), se
   pregunta. Cada respuesta va al backlog en el momento, y la pregunta
   abierta, a «Dónde estamos», antes de hacerla.
2. **Lo que pide un cambio del kit:** cada página que lo necesita, con su
   pregunta y su orden ([Lo que pide un cambio del kit](#lo-que-pide-un-cambio-del-kit)).
3. **El backlog,** escrito en cuanto hay una primera versión, con «Estado:
   por aprobar» debajo del título, como en el brief, y ajustado en él con la
   persona: así una sesión nueva sigue desde ahí.
   - `docs/backlog.md`: el «Pendiente» de «Mapa del sitio», cambiado por el
     menú y el pie, y el de «Páginas», por un apartado por página, en el
     orden en que se construyen, que se entiende sin saber programar:

     ```markdown
     ## Mapa del sitio

     - **Menú:** «Inicio» (HOME), «Habitaciones» (ROOMS), «Contacto» (CONTACT)
     - **Pie:** «Aviso legal» (LEGAL-NOTICE), «Privacidad» (PRIVACY)

     ## Páginas

     ### HOME: Inicio

     - **Para qué:** como pareja que busca una escapada, quiero conocer la casa de un vistazo, para saber si es lo que busco y reservar, con «Reserva» a la vista.
     - **Dirección web:** `/`
     - **Lo que enseña:** sus textos y los datos de la casa (cuántos caben, el teléfono).
     - **Estado:** pendiente

     ### ROOMS: Las habitaciones

     - **Para qué:** como pareja que busca una escapada, quiero ver cada habitación con sus fotos, cuántos caben y su precio, para elegir la mía y pedir disponibilidad.
     - **Dirección web:** `/rooms`
     - **Lo que enseña:** los datos de las habitaciones.
     - **Estado:** pendiente

     ### CONTACT: Contacto

<!-- kit:if server -->
     - **Para qué:** como pareja que busca una escapada, quiero pedir unas fechas o preguntar, para que la casa me conteste.
     - **Dirección web:** `/contact`
     - **Lo que enseña:** sus textos y un formulario.
<!-- kit:else -->
     - **Para qué:** como pareja que busca una escapada, quiero llamar o escribir a la casa, para pedir unas fechas o preguntar.
     - **Dirección web:** `/contact`
     - **Lo que enseña:** sus textos y los datos de la casa (el teléfono, el correo).
<!-- kit:end -->
     - **Estado:** pendiente

     ### LEGAL-NOTICE: Aviso legal

     - **Para qué:** como visitante, quiero saber quién está detrás de la web, para saber con quién trato, como pide la ley.
     - **Dirección web:** `/legal/notice`
     - **Lo que enseña:** sus textos.
     - **Estado:** pendiente
     ```

     Ni carpetas, ni ficheros, ni jerga: lo que necesite explicarse para
     entenderlo se escribe mejor, en el mismo apartado.
   - el fichero de cada página, `docs/pages/<NOMBRE>.md`
     (`docs/pages/ROOMS.md`): su cabecera y su para qué, nada más; lo demás
     lo escribe `/zaius-page`. Empieza por el nombre para que el `@` las
     liste (`/zaius-page @docs/pages/RO`).

     ```markdown
     # ROOMS: Las habitaciones

     URL: `/rooms`. Estado: pendiente el AAAA-MM-DD

     ## Para qué

     Como pareja que busca una escapada, quiero ver cada habitación con sus
     fotos, cuántos caben y su precio, para elegir la mía y pedir
     disponibilidad.
     ```

   - su fila en el [índice](../../../docs/pages/README.md#índice) de
     `docs/pages/README.md`: su nombre, enlazado a su fichero
     (`./ROOMS.md`), su URL y su título.

4. **El OK:** enséñale a la persona en la pantalla el backlog, copiado del
   fichero tal como ha quedado: el mapa del sitio y cada página con su
   apartado, en su orden; sin la explicación de arriba ni «Cómo se escribe»,
   que son para escribirlo. Si para entenderlo hace falta un «cómo leerlo»,
   lo que falta va en el backlog, y se enseña otra vez. Debajo, lo que pide
   un cambio del kit, si algo lo pide, con su orden. Pregunta si lo aprueba o
   qué cambia. Lo que pida se cambia en el mismo fichero hasta su sí, y se
   enseña lo que ha cambiado. Con el OK, «Estado: aprobado el AAAA-MM-DD»,
   con su fecha. Las páginas siguen «pendiente».
5. **«Dónde estamos»:** el backlog aprobado, con su fecha, lo que pide un
   cambio del kit, si hay algo, y lo siguiente, `/zaius-page HOME`, que
   lanza la persona. Para: no especifica ninguna página.

## Cambiar el backlog

Cada cambio va en el backlog, en el fichero de la página y en su fila del
índice. Mientras espera
el OK, el backlog dice «Estado: por aprobar»; con el OK, «aprobado», con la
fecha nueva, y «Dónde estamos», al día.

- **Añadir:** su apartado, en su sitio, «pendiente», con su fichero y su fila
  en el índice, y en el menú o en el pie si se llega desde ahí.
- **Cambiar:** su apartado y el para qué de su fichero. Si ya tiene
  especificación, el cambio se hace con `/zaius-page <NOMBRE>`, también si
  está «hecha»: primero su documento y después el código.
- **Partir:** la página se queda con su nombre y su primera parte; las demás,
  con su URL y su nombre, «pendiente», con su fichero. Si ya tenía
  especificación, lo que se va a otra parte sale de ella.
- **Ordenar:** se mueven los apartados; los nombres no cambian. El menú y el
  pie se ordenan aparte.
- **Cambiar de URL:** cambia su nombre, con su fichero, su apartado y su fila,
  con el OK; si ya tiene código, sus nombres se mueven con `/zaius-rename`.
- **Quitar:** una «pendiente», con su apartado, su fichero, su fila del
  índice y su entrada del menú o del pie. Si tiene trabajo hecho (desde «por
  aprobar»), pregunta antes, con lo que se pierde: su especificación y su
  boceto. Si ya tiene código, quitarlo es un cambio de la web, que va antes
  por `/zaius-page <NOMBRE>`. Pasa a «Quitadas», al final del backlog, en una
  línea, con su nombre, la fecha y el porqué.

## Comprobación

- [ ] Cada página, en su apartado, con su nombre y su título, su para qué
      como una historia («Como…, quiero…, para…»), su dirección, lo que
      enseña y su estado; HOME, la primera.
- [ ] Se entiende sin saber programar: ni carpetas, ni ficheros, ni jerga.
- [ ] El menú y el pie, con las páginas que se alcanzan desde ellos.
- [ ] Cada página, con su fichero en `docs/pages/`, que empieza por su
      nombre, el mismo estado en el fichero y en el backlog, y su fila en el
      índice.
- [ ] Las legales, si el brief las pide, sin textos inventados.
- [ ] Lo que pide un cambio del kit, dicho a la persona con su orden.
- [ ] Ninguna sección, texto ni diseño de una página.
- [ ] El OK, con su fecha, y «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la web, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el backlog escrito: la persona lo aprueba o pide cambios, en el mismo
  fichero hasta su sí.
- Antes de quitar una página con trabajo hecho.
- Si una página pide algo con lo que la web no se instaló: dilo, con la orden
  del kit, que lanza la persona.
- Si una página pide algo que el brief deja fuera: dilo. O se cambia el
  brief, con `/zaius-init`, o la página se queda fuera.
- Si no está claro qué tiene que conseguir una página: pregunta; no lo
  inventes.
- Al terminar: no especifica ni construye nada. La etapa siguiente la lanza
  la persona.
