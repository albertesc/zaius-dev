# Cómo se trabaja con la IA

Cómo se construye %%APP_NAME%% con la IA, paso a paso, sea cual sea la IA
(Claude Code, opencode) y sea quien sea la persona. Las skills que lo hacen
están en [AGENTS.md](../AGENTS.md#skills-del-proyecto).

**En esta página:** [El flujo](#el-flujo) · [La persona decide](#la-persona-decide) · [Hablar con la persona](#hablar-con-la-persona) · [Iterar](#iterar) · [Empezar de cero en cualquier punto](#empezar-de-cero-en-cualquier-punto) · [Los estados de una %%UNIT%%](#los-estados-de-una-%%UNIT%%)

## El flujo

| Etapa | Comando | Lo que sale |
|---|---|---|
| 1 | `/zaius-init` | El brief (`docs/brief.md`) y el sistema de diseño, con su guía visual. |
| 2 | `/zaius-backlog` | La lista de %%UNITS%% (`docs/backlog.md`), con el fichero de cada una en `%%UNIT_DOCS%%/`. |
| 3 | `/%%SPEC_SKILL%% %%UNIT_EXAMPLE%%` | La especificación de una %%UNIT%%: su documento, su boceto y su lista de tests. |
| 4 | `/zaius-build %%UNIT_EXAMPLE%%` | La %%UNIT%% construida en pareja, test a test. |
| 5 | `/zaius-review %%UNIT_EXAMPLE%%` | La revisión y, con el OK, la %%UNIT%% «hecha». |
| 6 | `/zaius-publish` | La %%KIND%% publicada. |

Las etapas 3 a 5 se repiten con cada %%UNIT%%. Lo que ya está hecho se mejora
con `/zaius-refactor`, que sigue el mismo camino: una propuesta, el OK,
`build` y `review`.

Una %%UNIT%% se nombra por su código (`%%UNIT_EXAMPLE%%`), y su fichero empieza
por él: se escribe el código o se elige con `@` (`/zaius-build @%%UNIT_DOCS%%/`),
que lista las que hay.

## La persona decide

La IA propone y hace; la persona decide.

- **Cada etapa la lanza la persona.** Ninguna skill lanza la siguiente: la IA
  termina, dice qué viene después y para.
- **La IA para y pregunta** ante:
  - algo que no estaba en el plan, o que no se ha pedido;
  - una dependencia nueva;
  - un tipo de componente o un verbo nuevo ([Nomenclatura](./naming.md));
  - una norma de diseño nueva o cambiada, que va como propuesta
    (`zaius-design`);
  - cambiar, saltar o borrar un test;
  - dos intentos sin verde, o un paso de más de unas 50 líneas o de más de
    3 ficheros;
  - un contenido o un dato que falta y el documento no dice qué poner;
  - publicar.
- **La IA nunca:** inventa un requisito (lo que falta se pregunta), da algo
  por «hecho» sin el OK, hace un commit o un push, publica sin el OK, pisa lo
  que la persona ha cambiado ni lanza la etapa siguiente.
- **No necesita OK** un cambio de datos o de textos que pide la persona (una
  fecha, un precio, una frase, una imagen): lo que pide ya es el OK. Se hace
  sin documento ni boceto, se cierra con `/zaius-review` y se dice dónde
  verlo. Lo que cambia qué se ve o qué se puede hacer sí lo necesita: es una
  %%UNIT%%.

## Hablar con la persona

Quien trabaja con la IA en %%APP_NAME%% puede no saber programar: todo lo que
se le pregunta o se le cuenta se entiende sin saberlo. Si programa y pide el
detalle técnico, se le da en técnico.

- **Se pregunta por la %%KIND%%, no por el código:** qué hace, quién la usa,
  qué se ve y qué pasa al pulsar cada cosa. Lo que deciden la normativa y la
  nomenclatura (dónde va un fichero, cómo se llama) no se pregunta: se hace.
- **Sin jerga.** Una palabra técnica que haga falta va explicada en la misma
  frase, con un ejemplo de la %%KIND%%. Una pregunta no lleva nombres de
  ficheros, carpetas ni funciones.
- **Pocas preguntas cada vez,** de una a tres, cada una con sus opciones: la
  recomendada, la primera; con cada una, lo que cambia; y «No lo sé», que se
  queda con la recomendada. En Claude Code, con su herramienta de preguntas;
  si no, en el chat, con las opciones numeradas.
- **Un OK se pide con lo que la persona va a ver:** qué se verá, qué se podrá
  hacer y qué se queda fuera, en unas líneas, antes del documento que lo
  detalla, y su boceto (`zaius-sketch`), que se abre con doble clic. Un OK
  técnico (una dependencia, un tipo de componente) dice qué es, para qué hace
  falta y qué pasa sin él.
- **Al terminar, cómo verlo:** la dirección en el navegador
  (`http://localhost:%%HUMAN_PORT%%/…`), qué probar y qué falta. Si la persona
  no tiene la %%KIND%% arrancada, se le ofrece arrancarla (`%%PM%% run dev`).
  Lo técnico va al final, en pocas líneas.
- **Un fallo se cuenta por lo que significa** y por lo que se va a hacer, sin
  pegar el error.
- **Lo que tiene que hacer la persona** (lanzar una orden del kit, abrir una
  página) va con la orden exacta, lista para copiar, y dónde se escribe.

## Iterar

- **Cada parada se ajusta hasta el OK.** La persona pide cambios, la IA los
  hace, enseña solo lo que ha cambiado y vuelve a preguntar.
- **Lo que se decide construyendo se apunta.** Una decisión tomada en una
  parada de `build` va a la especificación de la %%UNIT%%, y su test a la
  lista, antes de seguir: la especificación siempre dice lo que hace el
  código.
- **Lo que no encaja vuelve.** Lo que `review` encuentra, o lo que la persona
  ve que no le encaja, vuelve a `build`; si cambia lo que se pidió, antes a la
  especificación.
- **La lista crece con el trabajo.** Una %%UNIT%% que se parte, o una nueva
  que aparece al especificar otra, va al backlog, con el OK.
- **El brief y el backlog se pueden cambiar.** `/zaius-init` se vuelve a
  lanzar sobre el brief que hay: dice qué %%UNITS%% toca y espera el OK.
  `/zaius-backlog`, igual, para añadir, cambiar, partir, ordenar o quitar.
- **El código también se itera.** Con la lista en verde, `build` propone los
  refactors que ve, y solo los hace con el OK, con los tests en verde y en un
  commit aparte. Lo que ya está «hecho» se mejora con `/zaius-refactor`.

## Empezar de cero en cualquier punto

La conversación no guarda nada. En cualquier momento se puede abrir una sesión
nueva, con otra IA o con otra persona, y seguir solo con lo que hay en el
repo. Lo que no está en un fichero, no existe.

- **Lo que se decide se escribe en el momento.** Un OK, una respuesta o una
  decisión de una parada van a su fichero antes de seguir, con la fecha del
  OK.
- **Cada %%UNIT%% dice su estado,** en su fichero y en el backlog
  ([Los estados](#los-estados-de-una-%%UNIT%%)).
- **La lista de tests marca los que están en verde,** así que se sigue por el
  primero sin marcar.
- **Antes de parar, «Dónde estamos».** Cada paso pone al día
  [Próximos pasos](./next-steps.md#dónde-estamos): qué se ha hecho, qué falta
  y, si hay una pregunta abierta, la pregunta, que se apunta antes de hacerla.
- **Al empezar, se lee.** Cualquier sesión lee `AGENTS.md` y «Dónde estamos»,
  cuenta dónde se está y propone el comando que sigue, sin lanzarlo. Cada
  comando lee además el fichero de su %%UNIT%%.
- **Nada en la memoria de la IA.** Lo del proyecto no se guarda en la memoria
  del asistente ni depende de una herramienta.

`/zaius-review` lo comprueba en cada %%UNIT%%: revisa con un agente que no ha
visto la conversación, y si con los ficheros no le basta, falta algo por
escribir.

## Los estados de una %%UNIT%%

| Estado | Qué quiere decir | Quién lo pone |
|---|---|---|
| pendiente | Está en el backlog, con su línea. | `zaius-backlog` |
| por aprobar | Su especificación está escrita y espera el OK. | `%%SPEC_SKILL%%` |
| aprobada | La persona ha dado el OK a la especificación, el boceto y la lista. | `%%SPEC_SKILL%%`, con el OK |
| en curso | Se está construyendo. | `zaius-build` |
| por cerrar | La revisión está hecha y espera la verificación a mano y el OK. | `zaius-review` |
| hecha | Revisada y con el OK. | `zaius-review`, con el OK |

El estado va en la cabecera del fichero de la %%UNIT%%, con su fecha
(«Estado: aprobada el AAAA-MM-DD»), y el backlog lo repite.
