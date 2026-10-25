---
name: zaius-languages
description: Añade un idioma a la app. Los textos ya están en los catálogos, i18n/<idioma>.json de cada carpeta, aunque haya un solo idioma: la skill apunta el idioma con el change del kit, crea el catálogo traducido de cada carpeta (o marca lo que falta) y deja los documentos que cambian para zaius-merge, con el OK de cada paso.
disable-model-invocation: true
---

# Añadir un idioma

## Lee primero

- [Textos](../../../docs/standards.md#textos), en la normativa, y
  [Textos (i18n)](../../../docs/naming.md#textos-i18n), en la nomenclatura:
  cómo están los catálogos.
- `%%KIT_RUN%% help` y
  `%%KIT_RUN%% status`: las órdenes del kit
  (`change`) y los `.kit-new` pendientes.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).

## Pasos

1. **El idioma:** pregunta cuál y quién traduce sus textos. El de por
   defecto sigue siendo `%%DEFAULT_LANGUAGE%%`.
2. **El kit:** pide a la persona que lance
   `%%KIT_RUN%% change` y responda Sí a «más de un idioma», con todos los
   idiomas, el de por defecto el primero. Apunta el idioma en
   `APP_LANGUAGES` y deja un `.kit-new` de cada documento que cambia.
<!-- kit:if existing -->
   En un proyecto que aún se migra, el código del kit llega con el último
   bloque de la migración: este paso se planifica como un bloque más.
<!-- kit:end -->
3. **Sus catálogos:** en cada carpeta `i18n/` (la raíz, cada dominio, cada
   familia con su `common` y cada feature), un `<idioma>.json` con las
   mismas claves que el del idioma por defecto, traducidas, con sus
   plurales (`_one` y `_other`). Si son muchas, por bloques, cada uno con su
   casilla en «Dónde estamos».
4. **Las traducciones:** traduce, si la IA es quien traduce. Lo que no sepas
   traducir con seguridad lleva el texto del idioma por defecto y una
   casilla en
   [Decisiones pendientes](../../../docs/next-steps.md#decisiones-pendientes)
   («Revisar las traducciones de <idioma>: …»).
5. **Los documentos:** sus `.kit-new` los fusiona `/zaius-merge`, que lanza
   la persona: dale la orden.
6. **Las comprobaciones:** `%%PM%% run typecheck`, `%%PM%% run lint` y
   `%%PM%% run test`, con la paridad de idiomas, en verde. La revisión, con la
   revisión visual en cada idioma, es `/zaius-review`, sin historia, que lanza
   la persona.
7. **«Dónde estamos»:** lo que falta por traducir y lo siguiente. Para.

## Comprobación

- [ ] El idioma, en `APP_LANGUAGES`.
- [ ] Cada carpeta `i18n/`, con su catálogo del idioma nuevo: la paridad de
      idiomas, en verde.
- [ ] Lo que falta por traducir, apuntado en los próximos pasos.
- [ ] Los `.kit-new` de los documentos, con la orden de `/zaius-merge` dada
      a la persona.
- [ ] Tipos, lint y tests, en verde.
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el idioma, antes de lanzar `%%KIT_RUN%% change`.
- Con las traducciones hechas, antes de darlas por buenas.
- Si elegir el idioma pide algo que se ve y no existe (un selector en la
  cabecera): es una historia, que va al backlog con `/zaius-backlog`.
