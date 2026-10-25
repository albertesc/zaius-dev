---
name: zaius-spec
description: Refina con la persona una historia del backlog. Escribe en su fichero de docs/specs/ los criterios de aceptación (Dado / Cuando / Entonces), lo que no incluye, las pantallas que toca, con su documento en docs/features/, un plan corto y la lista de tests, que es la especificación, y hace su boceto. La deja «por aprobar» y para hasta el OK; con él, «aprobada». También cambia una historia que aún no está hecha. No escribe código.
disable-model-invocation: true
argument-hint: <ORD001>
---

# Especificar una historia

La especificación dice qué se verá y qué se podrá hacer al terminar la
historia, y con qué tests se comprueba. La lista de tests aprobada es la
especificación: `zaius-build` la construye de un test en uno.

## Lee primero

- [AGENTS.md](../../../AGENTS.md), entero, y
  [Cómo se trabaja con la IA](../../../docs/process.md): la persona decide,
  hablar con la persona, iterar y empezar de cero.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).
- El fichero de la historia, en `docs/specs/`, su línea en el
  [backlog](../../../docs/backlog.md) y las historias que requiere.
- [El brief](../../../docs/brief.md): para qué es la app, quién la usa, qué
  no entra, sus decisiones caras y sus requisitos no funcionales.
- [Features](../../../docs/features/README.md): la plantilla del documento
  de una pantalla y el índice; los documentos de las pantallas que toca, y
  su código.
- [Familias y features](../../../docs/naming.md#familias-y-features): el
  nombre de una pantalla nueva sale de su URL.
- [Normas](../../../docs/ux-ui/rules.md) y
  [Piezas por papel](../../../docs/ux-ui/design-system.md#piezas-por-papel):
  lo que ya está decidido no se pregunta.
- [Escribir tests](../../../docs/guides/write-tests.md): qué se prueba y en
  qué nivel.
<!-- kit:if api -->
- [API](../../../docs/api/README.md): los endpoints de lo que pide.
<!-- kit:end -->

## Antes de empezar

1. **La historia:** su código o su ruta (`/zaius-spec ORD001`, o eligiéndola
   con `@`). Sin ninguna, propón la primera «pendiente» del backlog y espera.
2. **Su estado:**
   - «pendiente»: se especifica, desde el paso 1;
   - «por aprobar»: se sigue donde se quedó, con lo que diga «Dónde estamos»;
   - «aprobada», «en curso» o «por cerrar»: cambia lo que se pidió:
     [Cambiar una historia](#cambiar-una-historia);
   - «hecha»: no se cambia; lo nuevo es otra historia. Propónla y, con el
     OK, apúntala en el backlog, «pendiente», con su fichero, como hace
     `/zaius-backlog`.
3. **El proyecto, iniciado:** si el brief no dice «Estado: aprobado el …», o
   el sistema de diseño sigue «Pendiente de definir», para: primero,
   `/zaius-init`.
4. **Lo que requiere:** si requiere una historia que aún no está hecha,
   dilo: se puede especificar, pero se construye después.

## Pasos

<!-- kit:if backend -->
1. **Lo que falta saber,** en tandas de 1 a 3 preguntas, por la app: qué se
   ve, qué se puede hacer, qué pasa al pulsar cada cosa, de dónde sale cada
   dato y quién lo cambia, quién puede verlo o cambiarlo, y qué pasa si
   falla o si no hay nada. Lo que ya dicen el brief, las normas o el sistema
   de diseño no se pregunta, y nunca se inventa un requisito. Cada respuesta
   va al fichero en el momento, y la pregunta abierta, a «Dónde estamos»,
   antes de hacerla.
<!-- kit:else -->
1. **Lo que falta saber,** en tandas de 1 a 3 preguntas, por la app: qué se
   ve, qué se puede hacer, qué pasa al pulsar cada cosa, de dónde sale cada
   dato y si se guarda, y qué pasa si falla o si no hay nada. Lo que ya
   dicen el brief, las normas o el sistema de diseño no se pregunta, y nunca
   se inventa un requisito. Cada respuesta va al fichero en el momento, y la
   pregunta abierta, a «Dónde estamos», antes de hacerla.
<!-- kit:end -->
2. **Los criterios de aceptación:** de 2 a 3, «Dado / Cuando / Entonces»,
   cada uno con su casilla, que marca `zaius-review`. Solo lo que la persona
   ve o consigue, nunca cómo se hace: ni piezas, ni datos por dentro, ni
   ficheros. Con más de 3, la historia es grande: propón partirla. Las partes
   nuevas van al backlog con el OK (el número siguiente de su épica,
   «pendiente», con su fichero), y se sigue con la primera.
3. **No incluye:** lo que se queda fuera a propósito, con la historia que lo
   trae, si la hay.
<!-- kit:if backend -->
4. **Las pantallas:** cada pantalla que toca, con el enlace a su documento,
   `docs/features/<familia>/<feature>.md`, creado o puesto al día con la
   plantilla de [Features](../../../docs/features/README.md): lo que hace,
   sus rutas, sus permisos, sus zonas, sus datos y sus piezas. Es la
   especificación funcional y técnica de la pantalla: dice cómo quedará con
   la historia, escrito como si siempre hubiera sido así, y la historia sale
   en su apartado «Historias», con su enlace. Lo técnico va ahí, no en la
   historia. Una pantalla nueva entra en el índice, con su familia, su nombre
   y su URL.
<!-- kit:else -->
4. **Las pantallas:** cada pantalla que toca, con el enlace a su documento,
   `docs/features/<familia>/<feature>.md`, creado o puesto al día con la
   plantilla de [Features](../../../docs/features/README.md): lo que hace,
   sus rutas, sus zonas, sus datos y sus piezas. Es la especificación
   funcional y técnica de la pantalla: dice cómo quedará con la historia,
   escrito como si siempre hubiera sido así, y la historia sale en su
   apartado «Historias», con su enlace. Lo técnico va ahí, no en la
   historia. Una pantalla nueva entra en el índice, con su familia, su nombre
   y su URL.
<!-- kit:end -->
<!-- kit:if api -->
   Cada dato, con su endpoint de `docs/api/`: si no está, se escribe antes
   con `zaius-api`, y lo que la API no da va a `docs/api-requests.md`.
<!-- kit:else -->
   Cada dato dice de dónde sale: una constante, el store de la pantalla o lo
   que guarda la app, que va donde dice el brief. Si es la primera historia
   que guarda algo, montarlo va en el plan y se dice en el OK; si el brief
   no dice dónde se guarda, para: primero, `/zaius-init`.
<!-- kit:end -->
5. **El plan:** 5 puntos como mucho, en el orden en que se construye, con
   palabras de la app: sin código ni nombres de ficheros. Solo lo que usa
   esta historia: el menú, la miga de pan o una variante de una pieza entran
   con la historia que los usa
   ([Nace con el proyecto](../../../docs/standards.md#organización-de-src)).
6. **Los tests,** en su tabla, `Test | Nivel | En verde`:
   - **cada criterio, con al menos un test,** en el nivel más alto que se
     pueda: la pantalla, antes que un hook o un util;
<!-- kit:if backend -->
   - **los de cada fichero con código** que pide
     [Lo que se prueba](../../../docs/guides/write-tests.md#1-lo-que-se-prueba):
     el schema y el service de un dato nuevo, la regla de los permisos;
   - **el nivel:** pantalla, componente, hook, util, schema, service, regla
     de permisos…, o «verificación manual» para lo que no se automatiza bien
     (cómo se ve en el ancho mínimo, un correo de verdad), que se mira en
     `zaius-review`;
<!-- kit:else -->
   - **los de cada fichero con código** que pide
     [Lo que se prueba](../../../docs/guides/write-tests.md#1-lo-que-se-prueba):
     el schema de un formulario nuevo, un util, un store;
   - **el nivel:** pantalla, componente, hook, util, schema, store…, o
     «verificación manual» para lo que no se automatiza bien (cómo se ve en
     el ancho mínimo), que se mira en `zaius-review`;
<!-- kit:end -->
   - **cada test, con lo que comprueba,** en una frase, como se escribirá en
     el código («enseña los pedidos del almacén, los más urgentes
     primero»).

   La lista aprobada es la especificación: `zaius-build` escribe estos, en
   este orden, y uno nuevo, cambiado o quitado necesita el OK.
7. **El boceto,** con `zaius-sketch`: `docs/ux-ui/mockups/<código>.html`,
   con la identidad del sistema de diseño, con cada estado de sus
   pantallas, y su ruta en «Pantallas». Lo que necesita y las normas no
   dicen va antes con `zaius-design`, y esa parte espera a que se acepte.
8. **Las sugerencias,** solo con una señal concreta en el código (el listado
   de facturas ya tiene ese mismo filtro y se puede compartir), en
   «Sugerencias (tú decides)», con su `fichero:línea`. Sin una señal, no se
   escribe el apartado. Lo que la persona acepte va al plan o al backlog.
9. **«Por aprobar»:** el estado, en el fichero y en el backlog, con la
   fecha, y «Dónde estamos» al día.
10. **El OK,** con lo que la persona va a ver, en unas líneas:

    ```text
    ORD001 Ver los pedidos del almacén, lista para tu OK
    Verás: <lo que se verá, en una o dos líneas>
    Podrás: <lo que se podrá hacer>
    Se queda fuera: <lo de «No incluye»>
    Se comprobará: <los tests, con palabras de la app, en una o dos líneas>
    El boceto: docs/ux-ui/mockups/ORD001.html (se abre con doble clic)
    ```

    Y debajo, enteros y tal como han quedado en el fichero, los criterios de
    aceptación, «No incluye» y la lista de tests: es lo que se aprueba.

    Y al final, después de todo eso, lo siguiente, para que la persona sepa
    qué hacer:

    ```text
    Lo siguiente:
    - Si te encaja, dime «OK» y la doy por aprobada; después, la construimos
      juntos o especificamos antes la historia siguiente.
    - Si quieres cambiar algo, dime qué: lo cambio y te enseño solo lo que
      cambie.
    ```

    Lo que pida se cambia en el fichero, en el documento de la pantalla y en
    el boceto, y se enseña solo lo que ha cambiado, otra vez con lo
    siguiente al final, hasta su sí.
11. **Con el OK:** «aprobada» con la fecha, en el fichero y en el backlog; en
    «Dónde estamos», lo siguiente, `/zaius-build <código>`, que lanza la
    persona, o especificar antes la historia siguiente: la primera «pendiente»
    del backlog. Díselo a ella con las dos salidas:

    ```text
    ORD001, aprobada. Lo siguiente, lo que prefieras:
    - Construirla ahora, juntos: /zaius-build ORD001
    - Especificar antes la siguiente, ORD002 <su título>: /zaius-spec ORD002
    ```

    Sin historias pendientes, solo la primera. Si esta requiere otra que aún
    no está hecha, la primera salida es construir esa. Para: no escribe
    código.

## La forma

```markdown
# ORD001 Ver los pedidos del almacén

Épica: Pedidos (ORD). Estado: por aprobar el AAAA-MM-DD

## Historia

Como responsable de almacén, quiero ver los pedidos de mi almacén, para
saber cuáles hay que preparar hoy.

## Criterios de aceptación

- [ ] **Dado** que hay pedidos por preparar, **cuando** abro «Pedidos»,
  **entonces** veo cada uno con su cliente, su fecha de entrega y su estado,
  los más urgentes primero.
- [ ] **Dado** que no hay pedidos por preparar, **cuando** abro «Pedidos»,
  **entonces** veo «Todavía no hay pedidos».

## No incluye

- Filtrar los pedidos por estado: ORD002.

## Pantallas

- [orders](../features/orders/orders.md), el listado de pedidos: nueva.
- Boceto: `docs/ux-ui/mockups/ORD001.html`.

## Plan

- Los pedidos del almacén, con sus datos.
- El listado, con su vacío y su error.
- Su entrada en el menú.

## Tests

| Test | Nivel | En verde |
|---|---|---|
| Enseña los pedidos del almacén, los más urgentes primero | pantalla | |
| Enseña «Todavía no hay pedidos» si no hay ninguno | pantalla | |
| Enseña el error y «Reintenta» si no se pueden cargar | pantalla | |
<!-- kit:if backend -->
| Acepta la respuesta de los pedidos y rechaza otra forma | schema | |
| Devuelve los pedidos del almacén validados | service | |
<!-- kit:else -->
| Pone primero los pedidos con la entrega más cercana | util | |
<!-- kit:end -->
| Se lee entero en el ancho mínimo, sin scroll horizontal | verificación manual | |

## Decisiones

Ninguna todavía.

## Verificación a mano

La rellena `zaius-review`.
```

- **La cabecera:** «Requiere», solo si la historia lo lleva en el backlog
  («Épica: Pedidos (ORD). Requiere: ORD001. Estado: …»).
- **Decisiones:** lo que se decide al construir, con su fecha, lo apunta
  `zaius-build` en cada parada («2026-11-03: los pedidos anulados no
  salen»), con su test en la lista si hace falta.
- **Verificación a mano:** lo que se mira a mano, con su casilla, lo apunta
  y lo marca `zaius-review`.
- **Sugerencias (tú decides):** solo si hay alguna, al final.

## Cambiar una historia

Una historia «aprobada», «en curso» o «por cerrar» cambia primero aquí, y
después en el código:

1. **Lo que cambia,** con palabras de la app, en tandas de 1 a 3 preguntas.
2. **La especificación:** los criterios, «No incluye», el documento de la
   pantalla, el boceto y la lista de tests. Un test que cambia se desmarca;
   uno que sobra, con el OK, se quita de la lista y del código en
   `zaius-build`.
3. **«Por aprobar»,** con la fecha, y el OK como la primera vez, con solo lo
   que cambia.
4. **Con el OK,** «aprobada», y lo siguiente, `/zaius-build <código>`, que
   sigue por el primer test sin marcar.

## Comprobación

- [ ] La cabecera, con su épica, lo que requiere y su estado con la fecha,
      el mismo que en el backlog.
- [ ] De 2 a 3 criterios, «Dado / Cuando / Entonces», sin cómo se hace.
- [ ] «No incluye», escrito.
- [ ] Cada pantalla, con su documento creado o al día con la plantilla, la
      historia en su apartado «Historias», y en el índice.
- [ ] El plan, en 5 puntos como mucho, sin código ni ficheros, y nada «por si
      acaso»: cada pieza y cada mecanismo nuevos los usa esta historia.
- [ ] Cada criterio, con su test; cada test, con su nivel.
- [ ] El boceto, con cada estado, en `docs/ux-ui/mockups/`.
- [ ] Ningún requisito inventado y ningún fichero de código tocado.
- [ ] Con el OK, «aprobada» con su fecha, y «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con los criterios, el boceto y la lista de tests: la persona los aprueba
  o pide cambios, en el mismo fichero hasta su sí.
- Con cada duda abierta: pregúntala antes de seguir; no la resuelvas tú.
- Con más de 3 criterios: antes de partir la historia y de llevar las partes
  al backlog.
- Si la historia pide algo que el brief deja fuera, o cambia una decisión
  cara: dilo; se cambia antes el brief, con `/zaius-init`.
- Con un tipo de componente o un verbo nuevos, un dominio nuevo o una
  dependencia nueva que pida la historia: dilo en el OK, con qué es, para qué
  hace falta y qué pasa sin él.
- Al terminar: no construye nada. La etapa siguiente la lanza la persona.
