---
name: zaius-service
description: Añade una llamada a la API con la guía docs/guides/add-a-service.md, con lo que dice el documento aprobado de la página. Del nombre del método a su schema, su mock y la página que lo pide, cada pieza con su test de la lista. Para si el documento o la API no dicen algo.
---

# Añadir un servicio

Se usa dentro de `zaius-build`: cada paso llega con el test de la lista que
lo pide, escrito antes y visto en rojo. Aplica lo que dice el documento
aprobado de la página; lo que no dice, no se inventa.

## Lee primero

- [Añadir un servicio](../../../docs/guides/add-a-service.md): la guía
  que sigue esta skill.
- [Nomenclatura](../../../docs/naming.md#services-schemas-y-caché):
  los nombres del método, su schema y su tipo.
<!-- kit:if mocks -->
- [Mocks](../../../docs/naming.md#mocks): los nombres de su mock.
<!-- kit:end -->
- [Cargar y guardar datos](../../../docs/guides/load-and-save-data.md):
<!-- kit:if server -->
  la página que lo pide o la action que guarda.
<!-- kit:else -->
  la página que lo pide.
<!-- kit:end -->
- El documento de la página, en `docs/pages/`, aprobado, con su lista de
  tests y su apartado «Datos»: qué dato, de qué endpoint y qué se ve si
  falla o no hay nada.

## Pasos

1. **La respuesta real:** mírala contra la API en marcha o pídesela a la
   persona; nunca la inventes. Lo que no dice el documento de la página
   (qué endpoint, qué se guarda) se pregunta y se escribe en él, con la
   fecha, antes del código.
2. **El nombre,** `<verbo><Entidad><Zona?><Qué>`, y de él, los del tipo y el
   schema; comprueba que no exista ya con otro nombre
   ([guía](../../../docs/guides/add-a-service.md#1-el-nombre)).
3. **El schema de la respuesta,** en
   `services/<entidad>/<entidad><Zona>Schema.ts`, con el tipo por `z.infer`
   ([guía](../../../docs/guides/add-a-service.md#2-el-schema-de-la-respuesta)).
4. **El método,** en `<entidad>Service.ts`, con su JSDoc, que empieza por el
   endpoint ([guía](../../../docs/guides/add-a-service.md#3-el-método)).
<!-- kit:if mocks -->
5. **El mock:** su clave, `"<MÉTODO> /ruta"`, en el `<entidad>Mocks.json`
   del service, con una respuesta con la forma real de la API
   ([guía](../../../docs/guides/add-a-service.md#4-el-mock)).
6. **La página** que lo pide lo llama en su frontmatter y pasa a sus
<!-- kit:else -->
5. **La página** que lo pide lo llama en su frontmatter y pasa a sus
<!-- kit:end -->
   componentes lo que pintan; si lo piden varias, cada una lo llama, sin
   importarse. Lo que se ve si falla o no hay nada, como dice su documento.
<!-- kit:if privateArea -->
   Si guarda, lo llama la action de su sección
   ([Guardar](../../../docs/guides/load-and-save-data.md#guardar)).
<!-- kit:end -->
<!-- kit:if privateArea -->
   En la zona privada, la action comprueba la sesión y el permiso antes de
   llamarlo.
<!-- kit:end -->
<!-- kit:if mocks -->
7. **Los tests,** los de la lista, cada uno antes que su código: el del
   schema, que acepta la respuesta de su mock y rechaza lo que no tiene su
   forma, y el del service, un `it` por método, contra el mock
   ([guía](../../../docs/guides/add-a-service.md#el-test-del-schema)). Si la
   guía pide uno que la lista no tiene, para y propón añadirlo.
<!-- kit:else -->
6. **Los tests,** los de la lista, cada uno antes que su código: el del
   schema, que acepta una respuesta de ejemplo con la forma real y rechaza
   lo que no la tiene, y el del service, un `it` por método, con `fetch`
   pisado
   ([guía](../../../docs/guides/add-a-service.md#el-test-del-schema)). Si la
   guía pide uno que la lista no tiene, para y propón añadirlo.
<!-- kit:end -->

## Comprobación

- [ ] El método, su tipo y su schema salen de la nomenclatura.
- [ ] El JSDoc empieza por el endpoint y ocupa de 6 a 8 líneas como máximo.
- [ ] El test del schema acepta la respuesta real y rechaza lo que no tiene
      su forma.
<!-- kit:if mocks -->
- [ ] El JSON del mock tiene la forma real de la API.
<!-- kit:end -->
- [ ] El service tiene un `it` por método.
- [ ] Ningún componente llama al service: recibe el dato por props.
- [ ] Cada test, de la lista del documento de la página, y marcado en verde.
- [ ] `%%PM%% run typecheck`, `%%PM%% run lint` y `%%PM%% run test`, en verde.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la web, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Si no se conoce la respuesta real: no la inventes; pregunta.
- Si el documento de la página no dice qué dato hace falta, qué se guarda o
  qué se ve si falla: pregunta, y escribe la respuesta en él, con la fecha,
  antes del código
  ([La persona decide](../../../docs/process.md#la-persona-decide)).
- Antes de tocar el transporte (`apiUtils` y los suyos), para adaptarlo a
  la API: cambia todas las llamadas
  ([Puntos de adaptación](../../../docs/guides/add-a-service.md#puntos-de-adaptación-a-la-api)).
- Con una dependencia nueva.
