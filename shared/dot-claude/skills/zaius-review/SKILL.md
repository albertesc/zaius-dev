---
name: zaius-review
description: Revisa y cierra una %%UNIT%% (o un refactor), o, sin ninguna, el cambio en curso. Pasa tipos, lint, tests y build, la revisa con un agente sin el contexto de la conversación contra las normas del proyecto, prepara con la persona la verificación a mano y da un resumen. Con el OK, la da por hecha y pone al día los documentos. No arregla nada.
disable-model-invocation: true
argument-hint: [<%%UNIT_EXAMPLE%%>]
---

# Revisar y cerrar

## Lee primero

- [AGENTS.md](../../../AGENTS.md#comprobar-un-cambio) y
  [Cómo se trabaja con la IA](../../../docs/process.md).
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).
- El fichero de la %%UNIT%%, en `%%UNIT_DOCS%%/`, con su lista de tests (o la
  propuesta del refactor, en `docs/refactors/`).
- [Qué se revisa](../../../docs/standards.md#qué-se-revisa), en la
  normativa: lo que se mira, en su orden, y la revisión visual de esta
  %%KIND%%.

## Pasos

1. **El alcance:** una %%UNIT%% por su código o su ruta
   (`/zaius-review %%UNIT_EXAMPLE%%`, o con `@`), un refactor por su fichero, o,
   sin nada, el cambio en curso (lo que dice git; sin git, pregunta qué
   ficheros).
2. **Las comprobaciones:** `%%PM%% run typecheck`, `%%PM%% run lint`,
   `%%PM%% run test` y `%%PM%% run build`, en verde. En Windows, desde
   PowerShell.
3. **La revisión sin contexto:** lanza un agente aparte (en Claude Code, un
   subagente) que no ha visto la conversación. Recibe solo las rutas de los
   ficheros que se revisan, la especificación y estos documentos:
   `AGENTS.md`, `docs/standards.md`, `docs/naming.md`,
   `docs/ux-ui/rules.md` y `docs/ux-ui/design-system.md`. Devuelve cada
   hallazgo con `fichero:línea`, la regla que rompe (con su enlace) y la
   corrección propuesta. Si le falta algo para entender lo que hace la
   %%UNIT%%, eso también es un hallazgo: falta escribirlo.
4. **La lista:** cada test, marcado y en verde, y cada uno de lo que pide la
   especificación, con su test o en la verificación a mano.
5. **La revisión visual,** si se ve: en el puerto %%REVIEW_PORT%%
   (`%%PM%% run dev:review`), nunca en el %%HUMAN_PORT%%, que es el de la
   persona, con lo que dice «Qué se revisa». Al terminar, para el servidor.
6. **El resumen:** el estado, «por cerrar», en el fichero de la %%UNIT%% y en el
   backlog, con lo que falta verificar a mano sin marcar, y a la persona:

   ```text
   <código> <título>, lista para cerrar
   ✓ Tipos, lint, tests (N nuevos) y build
   ✓ Revisión contra las normas: nada que cambiar
   ✓ <lo propio de esta %%KIND%%, de «Qué se revisa»>
   Falta tu verificación (N):
     · <lo que se mira a mano>
   Para verla: http://localhost:%%HUMAN_PORT%%/<…>
   Cuando lo hayas visto, ¿la doy por hecha? Con tu OK, <lo que se hará>.
   Commit propuesto, para que lo hagas tú: «<mensaje>»
   ```

7. **Si hay hallazgos,** o la persona ve algo que no le encaja: no lo arregles.
   Apúntalo en «Dónde estamos» y propón volver a `/zaius-build <código>`, o
   antes a `/%%SPEC_SKILL%% <código>` si cambia lo que se pidió.
8. **Con el OK:**
   - la %%UNIT%%, «hecha» con la fecha, en su fichero y en el backlog, con lo
     verificado a mano marcado;
   - los documentos, al día con lo que hace el código, escritos como si
     siempre hubiera sido así: los que enlaza la especificación y lo que
     dependa de ellos (las normas, las guías, `AGENTS.md`);
   - su boceto, borrado de `docs/ux-ui/mockups/`; el de un refactor, también;
   - «Dónde estamos», al día, con la %%UNIT%% siguiente que propones; la elige
     la persona.

Sin %%UNIT%%, los pasos 2, 3 y 5 y el resumen, sin cambiar ningún estado.

## Comprobación

- [ ] Tipos, lint, tests y build, en verde.
- [ ] La revisión, hecha por un agente sin el contexto de la conversación.
- [ ] Ningún fichero de código editado.
- [ ] El resumen, con lo que falta verificar a mano.
- [ ] Con el OK: la %%UNIT%% «hecha», los documentos al día, el boceto borrado
      y «Dónde estamos» al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Siempre, con el resumen: la %%UNIT%% no se da por hecha sin el OK.
- Si una regla de los documentos se contradice o no cubre un caso: dilo
  aparte, como «Regla que falta», sin decidirla.
