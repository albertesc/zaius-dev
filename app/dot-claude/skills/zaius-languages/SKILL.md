---
name: zaius-languages
description: Pasa a varios idiomas un proyecto instalado con uno solo. Instala i18next con el change del kit, lleva cada texto de los componentes a los catálogos i18n/<idioma>.json con t('<namespace>:<clave>'), traduce o marca lo que falta y deja los documentos que cambian para zaius-merge, por bloques y con el OK de cada uno.
disable-model-invocation: true
---

# Activar el multiidioma

## Lee primero

- [Textos](../../../docs/standards.md#textos), en la normativa, y
  [Textos](../../../docs/naming.md#textos), en la nomenclatura: cómo
  están hoy.
- `%%KIT_RUN%% help` y
  `%%KIT_RUN%% status`: las órdenes del kit
  (`change`) y los `.kit-new` pendientes.
- [La persona decide](../../../docs/process.md#la-persona-decide): i18next
  es una dependencia nueva.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).

## Pasos

1. **Los idiomas:** pregunta cuáles; el primero es el de por defecto (hoy,
   `%%DEFAULT_LANGUAGE%%`). Pide el OK para i18next y react-i18next.
2. **El kit:** pide a la persona que lance
   `%%KIT_RUN%% change` y responda Sí al
   multiidioma, con los idiomas. Instala i18next, `src/i18n/` y
   `languageUtils`, añade la paridad de idiomas a la comprobación de la
   estructura y deja un `.kit-new` de cada documento que cambia;
   «Textos (i18n)» de la nomenclatura, en su `.kit-new`, dice ya cómo se
   nombran las claves.
<!-- kit:if existing -->
   En un proyecto que aún se migra, el código del kit llega con el último
   bloque de la migración: este paso se planifica como un bloque más.
<!-- kit:end -->
3. **Por bloques,** si hay muchas pantallas: la raíz, cada dominio, cada
   familia con su `common` y cada feature, cada bloque con su casilla en
   «Dónde estamos», y su OK antes de empezarlo y al terminarlo.
4. **Los textos,** carpeta a carpeta: cada texto de usuario de un componente
   va al `i18n/<idioma>.json` de su carpeta, y el componente lo pide con
   `t('<namespace>:<clave>')`. El namespace es la carpeta (la feature, el
   dominio), la familia para su `common` y `common` para la raíz; las
   claves, por zona. Los plurales pasan a `count`, con `_one` y `_other`; la
   miga y el menú, a `labelKey`; los textos de las piezas del sistema de
   diseño, a `common:fields`.
5. **Las traducciones:** traduce a cada idioma. Lo que no sepas traducir con
   seguridad lleva el texto del idioma por defecto y una casilla en
   [Decisiones pendientes](../../../docs/next-steps.md#decisiones-pendientes)
   («Revisar las traducciones de <idioma>: …»).
6. **Los documentos:** sus `.kit-new` los fusiona `/zaius-merge`, que lanza
   la persona: dale la orden.
7. **Las comprobaciones:** `%%PM%% run typecheck`, `%%PM%% run lint` y
   `%%PM%% run test`, con la paridad de idiomas, en verde. La revisión, con la
   revisión visual en cada idioma, es `/zaius-review`, sin historia, que lanza
   la persona.
8. **«Dónde estamos»:** los bloques hechos, lo que falta por traducir y lo
   siguiente. Para.

## Comprobación

- [ ] Ningún texto de usuario escrito en un componente.
- [ ] Cada `t()` con su namespace; las claves, por zona.
- [ ] La paridad de idiomas, en verde en la comprobación de la estructura:
      las mismas claves en todos los idiomas.
- [ ] Lo que falta por traducir, apuntado en los próximos pasos.
- [ ] Los `.kit-new` de los documentos, con la orden de `/zaius-merge` dada
      a la persona.
- [ ] Tipos, lint y tests, en verde.
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Antes de instalar i18next: es una dependencia nueva.
- Con los idiomas, antes de lanzar
  `%%KIT_RUN%% change`.
- Antes y al final de cada bloque, si se hace por bloques.
- Si elegir el idioma pide algo que se ve y no existe (un selector en la
  cabecera): es una historia, que va al backlog con `/zaius-backlog`.
