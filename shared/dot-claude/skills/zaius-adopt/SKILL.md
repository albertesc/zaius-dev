---
name: zaius-adopt
description: Trae a las reglas del kit un proyecto que ya tenía código, después de zaius-init. Analiza el código con lo que dice «Traer un proyecto que ya existe» de la normativa, revisa los .kit-new con la persona y escribe en docs/next-steps.md un plan por bloques, sin mover código sin el OK de cada bloque.
---

# Traer un proyecto que ya existe

## Lee primero

- [Normativa](../../../docs/standards.md), con su apartado
  [Traer un proyecto que ya existe](../../../docs/standards.md#traer-un-proyecto-que-ya-existe),
  y [Nomenclatura](../../../docs/naming.md): lo que el código tiene que
  cumplir al final y lo que se mira para llegar.
- [AGENTS.md](../../../AGENTS.md), entero.
- `%%KIT_RUN%% help` y `%%KIT_RUN%% status`: las órdenes del kit (`change`) y
  los `.kit-new` pendientes.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos) y
  [Comprobar la estructura](../../../docs/standards.md#comprobar-la-estructura),
  que llega con el último bloque.

## Pasos

1. **Analiza el código,** sin mover nada, con lo que dice «Traer un proyecto
   que ya existe», en su orden. Resume cada punto con cuántos casos hay y un
   par de ejemplos, con `fichero:línea`.
2. **Las %%UNITS%% que ya hay:** cada una, al backlog, con su fichero en
   `%%UNIT_DOCS%%/` y el estado «hecha» si ya funciona como dice su fichero, o
   «pendiente» si falta algo; con el OK de la lista.
3. **Los `.kit-new`** de configuración y documentos (`%%KIT_RUN%% status`):
   repásalos con la persona, uno a uno; cada uno se fusiona, como en
   `zaius-merge`, o se descarta, con su OK.
4. **El plan,** en `docs/next-steps.md`, en un apartado propio, «Traer el
   proyecto»: un bloque por casilla, con lo que trae y su «Está cuando», del
   más seguro al más grande. Los nombres van en
   su propio bloque, que se hace con `/zaius-rename`. El último es siempre el
   mismo:

   ```markdown
   - [ ] **N. El código base del kit.**
     `%%KIT_RUN%% change`, con Sí a «¿Ha terminado ya la migración?»: trae el
     código base y la comprobación de la estructura, y los `.kit-new` que deje
     se fusionan.
     *Está cuando* `%%PM%% run test` pasa, con la estructura en verde.
   ```

5. **«Dónde estamos»:** el análisis, en dos o tres frases, y el plan.
6. **Espera el OK** del plan. Después, un bloque cada vez, con su OK; al
   terminar cada uno, `/zaius-review`, sin %%UNIT%%. `%%KIT_RUN%% change` lo
   lanza la persona.

## Comprobación

- [ ] El análisis, con sus recuentos y sus ejemplos.
- [ ] Las %%UNITS%% que ya hay, en el backlog, con su estado.
- [ ] Cada `.kit-new`, fusionado o descartado con la persona.
- [ ] Cada bloque, con su «Está cuando»; el último, con `%%KIT_RUN%% change`.
- [ ] Ningún código movido sin el OK de su bloque.
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el análisis y el plan escritos, antes de mover nada.
- Antes de empezar cada bloque, y al terminarlo.
- Con cada dependencia nueva que pida el stack del kit.
- Si una regla del kit no encaja con el proyecto: propón cambiarla en sus
  documentos y espera.
