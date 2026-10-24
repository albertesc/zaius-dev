---
name: zaius-service
description: Añade una llamada a la API con la guía docs/guides/add-a-service.md, con lo que dice la especificación aprobada de la historia. Del nombre del método a su schema y el hook que lo pide, con su clave de consulta y lo que invalida, cada pieza con su test de la lista. Para si la especificación o la API no dicen algo.
---

# Añadir un servicio

Se usa dentro de `zaius-build`: cada paso llega con el test de la lista que
lo pide, escrito antes y visto en rojo. Aplica lo que dicen la
especificación y el documento de la pantalla; lo que no dicen, no se
inventa.

## Lee primero

- [Añadir un servicio](../../../docs/guides/add-a-service.md): la guía
  que sigue esta skill.
- [Nomenclatura](../../../docs/naming.md#services-schemas-y-claves-de-consulta):
  los nombres del método, su schema, su tipo y su clave.
<!-- kit:if mocks -->
- [Mocks](../../../docs/naming.md#mocks): los nombres de su mock.
<!-- kit:end -->
- [Cargar y guardar datos](../../../docs/guides/load-and-save-data.md):
  el hook que lo pide o lo guarda.
<!-- kit:if api -->
- [API](../../../docs/api/README.md) y `docs/api/<zona>.md`, el contrato del
  endpoint, y [Peticiones a la API](../../../docs/api-requests.md).
<!-- kit:end -->
- La especificación de la historia, en `docs/specs/`, aprobada, con su
  lista de tests, y el apartado «Datos» del documento de la pantalla que lo
  usa, en `docs/features/`.

## Pasos

<!-- kit:if api -->
1. **El contrato:** lee el endpoint en `docs/api/<zona>.md`; si no está,
   escríbelo antes con `zaius-api`. Lo «Sin verificar» se comprueba o
   se pregunta. Lo que la app necesita y la API no da va a
   `docs/api-requests.md`, con su casilla, y a «Propuestos (no existen)»
   de su zona.
<!-- kit:else -->
1. **La respuesta real:** mírala contra la API en marcha o pídesela a la
   persona; nunca la inventes. Lo que no dice el documento de la pantalla
   (qué endpoint, qué se guarda) se pregunta antes.
<!-- kit:end -->
2. **El nombre,** `<verbo><Entidad><Zona?><Qué>`, y de él, los del tipo, el
   schema y la clave; comprueba que no exista ya con otro nombre
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
6. **El hook** de la feature, o del `common` de su familia si lo piden
<!-- kit:else -->
5. **El hook** de la feature, o del `common` de su familia si lo piden
<!-- kit:end -->
   varias, con la clave `[service, método, ...parámetros]`: la misma en todas
   las features que piden el dato, sin importarse. Si guarda, invalida lo
   que pinta el registro con la función de su familia
   (`orderQueryUtils.invalidateOrdersQueries`)
   ([Guardar](../../../docs/guides/load-and-save-data.md#guardar)).
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

- [ ] El método, su tipo, su schema y su clave salen de la nomenclatura.
- [ ] El JSDoc empieza por el endpoint y ocupa de 6 a 8 líneas como máximo.
- [ ] El test del schema acepta la respuesta real y rechaza lo que no tiene
      su forma.
<!-- kit:if mocks -->
- [ ] El JSON del mock tiene la forma real de la API.
<!-- kit:end -->
- [ ] El service tiene un `it` por método.
- [ ] Las features que piden el dato usan la misma clave y no se importan.
- [ ] Cada test, de la lista de la especificación, y marcado en verde.
- [ ] Un guardado invalida lo que pinta el registro.
<!-- kit:if api -->
- [ ] `docs/api/<zona>.md` y `docs/api-requests.md`, al día.
<!-- kit:end -->
- [ ] `%%PM%% run typecheck`, `%%PM%% run lint` y `%%PM%% run test`, en verde.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Si no se conoce la respuesta real: no la inventes; pregunta.
- Si la especificación o el documento de la pantalla no dicen qué dato hace
  falta o qué se guarda: pregunta, y escribe la respuesta en ellos, con la
  fecha, antes del código
  ([La persona decide](../../../docs/process.md#la-persona-decide)).
- Antes de tocar el transporte (`apiUtils` y los suyos), para adaptarlo a
  la API: cambia todas las llamadas
  ([Puntos de adaptación](../../../docs/guides/add-a-service.md#puntos-de-adaptación-a-la-api)).
- Con un dominio o una dependencia nuevos.
