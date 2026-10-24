---
name: zaius-form
description: Monta un formulario con react-hook-form y zod, con la guía docs/guides/create-a-form.md y lo que dice la especificación aprobada de la historia, también las filas de una tabla que se editan y los asistentes. Del schema a build…FormValues y build…Request, con el comportamiento de las normas D6, D7 y D9, cada pieza con su test de la lista. Para si la especificación no dice un campo o una regla.
---

# Crear un formulario

Se usa dentro de `zaius-build`: cada paso llega con el test de la lista que
lo pide, escrito antes y visto en rojo. Aplica lo que dicen la
especificación y el documento de la pantalla; lo que no dicen, no se
inventa.

## Lee primero

- [Crear un formulario](../../../docs/guides/create-a-form.md): la guía
  que sigue esta skill, con sus variantes.
- Las normas que deciden su comportamiento:
  [D6. Formularios](../../../docs/ux-ui/rules.md#d6-formularios),
  [D7. Un registro, una pantalla](../../../docs/ux-ui/rules.md#d7-un-registro-una-pantalla)
  y [D9. Modales](../../../docs/ux-ui/rules.md#d9-modales).
- [Nomenclatura](../../../docs/naming.md#funciones-hooks-tipos-constantes-y-stores):
  los nombres del schema, su tipo y sus funciones.
- La especificación de la historia, en `docs/specs/`, aprobada, con sus
  criterios y su lista de tests, y el documento de la pantalla, en
  `docs/features/`: sus campos, sus reglas y qué se guarda.

## Pasos

1. **Los campos y sus reglas,** de la especificación y del documento de la
   pantalla. Lo que no digan (obligatorios, máximos, campos que dependen de
   otros) se pregunta y se escribe en ellos, con la fecha, antes del código.
2. **El schema,** `<feature><Qué>FormSchema`, en
   `schemas/<feature>FormSchema.ts` (en el `common` de la familia si lo
   comparten el alta y la gestión), con su tipo, `<Feature><Qué>FormValues`,
   por `z.infer`
   ([guía](../../../docs/guides/create-a-form.md#1-el-schema)).
3. **Del registro al formulario y del formulario a la petición:**
   `build<Feature><Qué>FormValues` y `build<Feature><Qué>Request`, en el
   objeto de utils del tema (`ordersEditFormUtils`). El alta y la edición usan
   el mismo formulario (D6).
4. **El formulario,** en un hook de la feature: `useForm` con el resolver de
   zod, `mode: 'onSubmit'` y `reValidateMode: 'onChange'` (D6); y sus campos,
   con las piezas de
   [Piezas por papel](../../../docs/ux-ui/design-system.md#piezas-por-papel)
   y el error bajo cada uno
   ([guía](../../../docs/guides/create-a-form.md#2-el-formulario)).
5. **El envío:** `handleSubmit` llama a la mutación con `mutate`; «Hay N
   campos por revisar», en la barra, y el foco, en el primer error; mientras
   guarda, todo desactivado y el primario con `loading`; el fallo, encima de
   la barra o al final del modal, nunca en un aviso efímero
   ([guía](../../../docs/guides/create-a-form.md#4-enviar-el-formulario)).
6. **Los cambios sin guardar** avisan al salir; el «Cancela» de una fila, una
   tarjeta o un modal cierra sin preguntar (D6, D9)
   ([guía](../../../docs/guides/create-a-form.md#5-los-cambios-sin-guardar)).
7. **La variante,** si la hay, con su parte de la guía:
   [la gestión de un registro](../../../docs/guides/create-a-form.md#editar-un-registro)
   (D7), [un modal](../../../docs/guides/create-a-form.md#formularios-en-un-modal)
   (D9), o [las filas de una tabla o un asistente](../../../docs/guides/create-a-form.md#formularios-por-partes).
8. **Los tests,** los de la lista, cada uno antes que su código: los del
   schema y de los `build…`; y, en el de la página, que no valida antes del
   primer intento, que enseña los errores y su recuento, que manda la
   petición que arma `build…Request` y que el fallo se ve. Si la guía pide
   uno que la lista no tiene, para y propón añadirlo.

## Comprobación

- [ ] El alta y la edición son el mismo formulario.
- [ ] Ningún error antes del primer intento; después, al cambiar cada campo.
- [ ] «Hay N campos por revisar» en la barra, con el foco en el primer error.
- [ ] Mientras guarda, todo desactivado y el primario con `loading`.
- [ ] Salir con cambios avisa; el «Cancela» de una fila o un modal, no.
- [ ] El fallo del guardado se ve donde toca y se puede releer.
- [ ] El schema, `build…FormValues` y `build…Request`, con su test.
- [ ] Cada test, de la lista de la especificación, y marcado en verde.
- [ ] `%%PM%% run typecheck`, `%%PM%% run lint` y `%%PM%% run test`, en verde.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Si la especificación o el documento de la pantalla no dicen un campo, una
  regla o qué se guarda: pregunta antes de escribirlo
  ([La persona decide](../../../docs/process.md#la-persona-decide)).
- Si D6, D7 o D9 no dicen cómo se comporta algo (un guardado por partes, un
  campo que se calcula): pregunta antes de escribirlo; si es una regla de
  diseño nueva, va con `zaius-design`.
- Si el sistema de diseño no tiene la pieza de un campo: apúntala en «Lo que
  falta» y pregunta antes de crearla. Con una dependencia nueva, igual.
