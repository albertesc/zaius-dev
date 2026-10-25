---
name: zaius-refactor
description: Propone el refactor de una %%UNIT%% hecha, o, sin ninguna, de algo que se repite en todo el proyecto, con la forma de una especificación. Escribe en docs/refactors/ el porqué con su señal en el código, lo que cambia a la vista y lo que no, el boceto de antes y después si toca piezas que se ven, la lista de tests y los pasos, y para hasta el OK. No toca el código.
disable-model-invocation: true
argument-hint: [<%%UNIT_EXAMPLE%%>]
---

# Proponer un refactor

Un refactor cambia cómo está hecho el código, no lo que se puede hacer. Lo que
se ve solo cambia en lo que se apruebe en el boceto, como la pequeña
diferencia al unificar dos piezas. Una mejora de lo que se ve o se puede hacer
no es un refactor: es una %%UNIT%% (`/%%SPEC_SKILL%%` o `/zaius-backlog`).

## Lee primero

- [Cómo se trabaja con la IA](../../../docs/process.md) y
  [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).
- El fichero de la %%UNIT%%, en `%%UNIT_DOCS%%/`, y su código; sin %%UNIT%%,
  lo que la persona ha señalado.
- [Normativa](../../../docs/standards.md) y
  [Nomenclatura](../../../docs/naming.md): adónde va lo que se comparte y cómo
  se llama.
- [Bocetos](../../../docs/ux-ui/README.md#bocetos).

## Pasos

1. **Las señales,** en el código, sin mover nada: lo que ya se repite (a la
   segunda copia), un fichero o un componente que pasa del tamaño de la
   normativa, un nombre que no la cumple, una pieza en un sitio que no le
   toca. Sin una señal concreta, no se propone nada.
2. **La propuesta,** en `docs/refactors/AAAA-MM-DD-<topic>.md`, con la fecha
   de hoy y el tema en inglés, en minúsculas y con guiones:

   ```markdown
   # <Lo que se mejora>

   Estado: por aprobar. Unidad: <código, o «todo el proyecto»>. Fecha: AAAA-MM-DD

   ## Por qué
   Lo que se mejora y su señal en el código (`fichero:línea`).

   ## Qué cambia a la vista
   Nada; o la pequeña diferencia, con su boceto.

   ## Qué no cambia
   Lo que se puede hacer, las URL, los textos, cada criterio y cada test que
   ya hay.

   ## Boceto
   `docs/ux-ui/mockups/<código>-refactor.html`, si toca piezas que se ven.

   ## Tests
   | Test | |
   |---|---|
   | <los que ya hay> | siguen igual |
   | <el de la pieza nueva> | nuevo |
   | <el que cambia por una diferencia aprobada> | cambia, aprobado en el boceto |

   ## Pasos
   - [ ] <un paso, que deja los tests en verde>
   ```

   Si lo que se va a tocar no tiene test, el primer paso es el test que fija
   lo que hace hoy.
3. **El boceto,** si toca piezas que se ven (una pieza compartida, el sistema
   de diseño): con `zaius-sketch`, el antes y el después, aunque salgan
   iguales.
4. **«Dónde estamos»:** la propuesta, «por aprobar».

Con el OK, la propuesta pasa a «aprobada», con la fecha, y la persona la
construye con `/zaius-build <fichero de la propuesta>` y la cierra con
<!-- kit:if git -->
`/zaius-review`. La %%UNIT%% sigue «hecha», y el commit va aparte del de la
funcionalidad. Al cerrarla, la propuesta se queda en `docs/refactors/`, como
historial, con el estado «hecho».
<!-- kit:else -->
`/zaius-review`. La %%UNIT%% sigue «hecha». Al cerrarla, la propuesta se
queda en `docs/refactors/`, como historial, con el estado «hecho».
<!-- kit:end -->

## Comprobación

- [ ] Cada cambio, con su señal en el código.
- [ ] «Qué no cambia», escrito; ningún criterio ni test que cambie sin estar
      en la lista.
- [ ] El boceto, si toca piezas que se ven.
- [ ] Ningún fichero de código tocado.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con la propuesta, el boceto y la lista: enséñale la propuesta entera en la
  pantalla, tal como ha quedado escrita, y dónde está el boceto; la persona la
  aprueba o pide cambios, en el mismo fichero hasta su sí.
- Si lo que se quiere cambia lo que se ve o lo que se puede hacer: dilo y
  propón una %%UNIT%% en su lugar.
- Si llevar algo a un sitio compartido pide el OK de la normativa (un
  dominio, la raíz).
