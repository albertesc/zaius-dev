---
name: zaius-design
description: Escribe una propuesta de cambio de diseño (una norma nueva o cambiada, o un cambio del sistema de diseño después de zaius-init) en docs/ux-ui/proposals/, sin tocar el código, y la añade al índice «en revisión». Si se acepta, la lleva a rules.md, a AGENTS.md y a los próximos pasos; si se descarta, la deja con su motivo.
---

# Proponer un cambio de diseño

## Lee primero

- [UX/UI](../../../docs/ux-ui/README.md): el proceso, la
  [plantilla](../../../docs/ux-ui/README.md#plantilla-de-una-propuesta) y el
  [índice de propuestas](../../../docs/ux-ui/README.md#propuestas).
- [Normas](../../../docs/ux-ui/rules.md): las vigentes y cómo se escribe una.
- [Sistema de diseño](../../../docs/ux-ui/design-system.md).
- [Diseño y UX](../../../AGENTS.md#diseño-y-ux), en `AGENTS.md`.

## Pasos

1. **El problema:** qué no funciona hoy y dónde se ve. Si una norma vigente
   ya lo resuelve, dilo y no propongas nada.
2. **La propuesta,** en `docs/ux-ui/proposals/AAAA-MM-DD-<topic>.md`, con la
   fecha de hoy y el tema en inglés, en minúsculas y con guiones, con la
   plantilla: el estado «en revisión», el problema, la propuesta con un antes
   y un después, a qué afecta y las alternativas. Si lo que cambia se ve, con
   su boceto del antes y el después (`zaius-sketch`).
3. **El índice:** su fila, al final de la tabla de propuestas, con la fecha,
   el enlace, «en revisión» y las normas que cambia («D5», «D15 (nueva)»).
4. **Sin tocar el código,** ni `rules.md`, ni `AGENTS.md`, mientras no esté
   aceptada. Cada revisión reescribe el mismo fichero hasta que está clara.
5. **Si se acepta,** con el OK:
   - el estado, «aceptada», en el fichero y en el índice, con la fecha y lo
     decidido en «Decisión»;
   - la norma, en `rules.md`: una Dn nueva, con el número siguiente, o la
     que cambia, con su regla, su «Por qué» y su «Mal | Bien», y su enlace en
     «En esta página»;
   - su frase, en «Diseño y UX» de `AGENTS.md`, con el mismo número;
   - un cambio del sistema de diseño, en `design-system.md`, y en `AGENTS.md`
     si cambia la librería o los tokens; y la guía visual,
     `docs/ux-ui/mockups/design-system.html`, al día;
   - las tareas para aplicarla, en `docs/next-steps.md`.
6. **Si se descarta,** «descartada», con su motivo en «Decisión»; si otra la
   sustituye, «sustituida», con el enlace a la que la sustituye.

## Comprobación

- [ ] El fichero, con la plantilla entera y la fecha en el nombre.
- [ ] Su fila en el índice, con el mismo estado que el fichero.
- [ ] Ningún cambio en el código antes de «aceptada».
- [ ] Si se acepta, la norma en `rules.md` y su frase en `AGENTS.md`, con el
      mismo número, y sus tareas en los próximos pasos.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con la propuesta escrita: la decide la persona.
- Antes de llevar una propuesta aceptada a `rules.md`, a `design-system.md` y
  a `AGENTS.md`.
