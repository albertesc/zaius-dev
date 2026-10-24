---
name: zaius-api
description: Escribe o pone al día docs/api/<zona>.md con la plantilla de docs/api/README.md, a partir del código del backend o de lo que se sabe del endpoint. Nunca adivina, marca «Sin verificar» lo que no se ha comprobado y apunta en docs/api-requests.md lo que la app necesita y la API no da.
---

# Documentar la API

## Lee primero

- [API](../../../docs/api/README.md): la
  [forma de un documento](../../../docs/api/README.md#cómo-se-lee-un-documento),
  [Sin verificar](../../../docs/api/README.md#sin-verificar), las
  convenciones comunes y
  [Lo propuesto](../../../docs/api/README.md#lo-propuesto).
- [Peticiones a la API](../../../docs/api-requests.md#cómo-se-escribe-una-petición).
- [Puntos de adaptación a la API](../../../docs/guides/add-a-service.md#puntos-de-adaptación-a-la-api).
- El apartado «Datos» de los documentos de las pantallas que usan la zona,
  en `docs/features/`, y la especificación de la historia que lo pide, si la
  hay, en `docs/specs/`.

## Pasos

1. **La zona y sus endpoints:** cuáles, y si `docs/api/<zona>.md` ya existe,
   para ponerlo al día.
2. **La fuente:** pide la ruta del código del backend. Con ella, lee de cada
   endpoint su ruta, su permiso, lo que recibe y lo que devuelve, sus
   errores y lo que hace de verdad. Sin ella, lo que se sabe: la API en
   marcha, su documentación o lo que diga la persona.
3. **El documento,** con la forma de la plantilla: de dónde sale y cuándo se
   comprobó, la tabla de endpoints, las rarezas comunes y cada endpoint con
   lo que pide, lo que devuelve (en bloques `ts`), sus errores y sus
   rarezas.
4. **Nunca adivines:** lo que no se ha comprobado lleva «Sin verificar» y lo
   que falta para comprobarlo.
5. **Las convenciones comunes** (la base, la sesión, los errores, las
   fechas, la paginación, el idioma y los ficheros), en `docs/api/README.md`,
   la primera vez o al descubrir una. Si no son las que espera el
   transporte, dilo: se adapta el transporte (`src/utils/api*Utils.ts`), no
   cada service.
6. **El índice:** la zona, en «Las zonas» de `docs/api/README.md`.
7. **Lo que falta:** lo que la app necesita y la API no da va a
   `docs/api-requests.md`, con su casilla en la sección de su feature, y a
   «Propuestos (no existen)» de la zona, con su contrato.
<!-- kit:if mocks -->
8. **Los mocks** imitan el contrato de `docs/api/`: el que no coincide se
   corrige, con `zaius-service`.
<!-- kit:end -->

## Comprobación

- [ ] El documento dice de dónde sale y cuándo se comprobó.
- [ ] Nada adivinado: lo que no se ha comprobado, «Sin verificar».
- [ ] Cada endpoint, con su permiso, lo que pide, lo que devuelve y sus
      errores.
- [ ] La zona, en el índice; cada petición, enlazada desde su rareza.
<!-- kit:if mocks -->
- [ ] Los mocks de la zona imitan lo escrito.
<!-- kit:end -->

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Si no hay ninguna fuente (ni el código ni la API en marcha): pregunta.
- Antes de adaptar el transporte (`src/utils/api*Utils.ts`).
- Si el servidor contradice el documento de una pantalla o una
  especificación: vale el servidor; avisa y pregunta cómo quedan, y lo que
  cambia de una historia aprobada vuelve a `/zaius-spec <código>`.
