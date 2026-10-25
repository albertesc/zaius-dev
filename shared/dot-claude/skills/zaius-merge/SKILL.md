---
name: zaius-merge
description: Fusiona los ficheros .kit-new que deja zaius-dev al actualizar el kit o al cambiar una respuesta. Compara cada uno con la versión del proyecto, lee en el CHANGELOG del kit qué ha cambiado, conserva lo que el proyecto cambió a propósito, trae lo nuevo y lo escribe con el OK, uno a uno.
disable-model-invocation: true
---

# Fusionar las versiones del kit

## Lee primero

- `%%KIT_RUN%% help` y `%%KIT_RUN%% status`: las órdenes del kit (`update`,
  `change`) y los `.kit-new` pendientes.
- `zaius-dev.json`, en la raíz: la versión del kit y las respuestas.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos): la tarea que
  dejó `zaius-dev`, con los ficheros por fusionar.
- El `CHANGELOG.md` del kit.

## Pasos

1. **Los `.kit-new`:** los lista `%%KIT_RUN%% status`; si no, búscalos
   (`*.kit-new`) en el proyecto. Sin ninguno, dilo y termina.
2. **El kit:** su carpeta la dice `%%KIT_RUN%% status`, en «Carpeta del kit»
   (con npx, la de su caché); si no, pregúntala. Lee en su `CHANGELOG.md` las
   entradas de las versiones que el proyecto no tenía y que tocan cada
   fichero.
3. **Por cada fichero,** uno a uno:
<!-- kit:if git -->
   1. compara la versión del proyecto con su `.kit-new` (por ejemplo, con
      `git diff --no-index <fichero> <fichero>.kit-new`);
<!-- kit:else -->
   1. compara la versión del proyecto con su `.kit-new`, leyendo los dos,
      parte a parte;
<!-- kit:end -->
   2. separa lo que el proyecto cambió a propósito (sus reglas, sus
      decisiones, «Qué es», sus %%UNITS%%) de lo que trae el kit, según el
      `CHANGELOG.md`;
   3. fusiona: conserva lo del proyecto y trae lo nuevo del kit; si los dos
      cambian lo mismo, no elijas: pregunta, con las dos opciones y lo que
      cambia con cada una;
   4. cuenta el resultado, sin pegar el diff: lo que entra del kit, lo que se
      queda del proyecto y por qué;
   5. con el OK, escribe el fichero y borra su `.kit-new`.
4. **Lo que depende:** si cambia un documento, lo que lo enlaza o lo resume
   (`AGENTS.md`, el `README.md`, las guías) tiene que seguir diciendo lo
   mismo, con los enlaces y las anclas vivos.
5. **Los nombres:** si una versión nueva cambia una regla de nombres, lo que
   el proyecto ya tiene no se renombra solo: propón alinearlo con
   `/zaius-rename`, como una tarea aparte, y apúntala en «Dónde estamos».
6. **Cierra:** marca en «Dónde estamos» la tarea que dejó `zaius-dev`
   («Fusionar las versiones del kit…») y, si ha cambiado código o
   configuración, propón `/zaius-review`.

## Comprobación

- [ ] `%%KIT_RUN%% status` ya no lista ningún `.kit-new`.
- [ ] Nada de lo que el proyecto cambió a propósito se ha perdido.
- [ ] Cada fusión, enseñada y escrita con el OK.
- [ ] La tarea de «Dónde estamos», marcada.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Antes de escribir cada fichero fusionado, salvo que la persona pida
  hacerlos seguidos.
- Si el proyecto y el kit cambian lo mismo de dos formas distintas.
- Si el `CHANGELOG.md` no explica un cambio del `.kit-new`.
