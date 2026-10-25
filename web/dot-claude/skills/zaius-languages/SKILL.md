---
name: zaius-languages
description: Añade un idioma a la web. Los textos ya están en el catálogo, src/i18n/<idioma>.json, aunque haya un solo idioma: la skill apunta el idioma con el change del kit, crea su catálogo traducido (o marca lo que falta), sus entradas si hay colecciones, y deja los documentos que cambian para zaius-merge, con el OK de cada paso.
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
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos) y el
  [brief](../../../docs/brief.md), en «Idiomas y legales».

## Pasos

1. **El idioma:** pregunta cuál y quién traduce sus textos. El de por
   defecto sigue siendo `%%DEFAULT_LANGUAGE%%`, sin prefijo en sus
   direcciones; el nuevo tendrá el suyo (`/en/rooms`). Lo decidido va al
   brief, en «Idiomas y legales», con la fecha.
2. **El kit:** pide a la persona que lance
   `%%KIT_RUN%% change` y responda Sí a «más de un idioma», con todos los
   idiomas, el de por defecto el primero. Apunta el idioma en
   `APP_LANGUAGES` (y con él, sus direcciones en `astro.config.ts`) y deja
   un `.kit-new` de cada documento que cambia.
<!-- kit:if existing -->
   En un proyecto que aún se trae a las reglas del kit, el código del kit
   llega con el último bloque del plan: este paso se planifica como un
   bloque más.
<!-- kit:end -->
3. **Su catálogo,** `src/i18n/<idioma>.json`: las mismas claves que el del
   idioma por defecto, traducidas, con sus plurales (`_one` y `_other`), el
   título y la descripción de cada página para los buscadores y los textos
   del menú y del pie.
<!-- kit:if content -->
   Y las entradas de las colecciones, una por idioma, en la carpeta del
   suyo, con el mismo nombre de fichero.
<!-- kit:end -->
4. **Las traducciones:** traduce, si la IA es quien traduce. Lo que no sepas
   traducir con seguridad lleva el texto del idioma por defecto y una
   casilla en
   [Decisiones pendientes](../../../docs/next-steps.md#decisiones-pendientes)
   («Revisar las traducciones de <idioma>: …»). Los textos legales no los
   traduce la IA: los da quien los escribió, en cada idioma.
5. **Los documentos:** sus `.kit-new` los fusiona `/zaius-merge`, que lanza
   la persona: dale la orden.
6. **Las comprobaciones:** `%%PM%% run typecheck`, `%%PM%% run lint` y
   `%%PM%% run test`, con la paridad de idiomas, en verde. La revisión, con la
   revisión visual en cada idioma, es `/zaius-review`, sin página, que lanza
   la persona.
7. **«Dónde estamos»:** lo que falta por traducir y lo siguiente. Para.

## Comprobación

- [ ] El idioma, en el brief y en `APP_LANGUAGES`.
- [ ] Su catálogo, con las mismas claves: la paridad de idiomas, en verde.
- [ ] El título y la descripción de cada página, en el idioma nuevo.
- [ ] Lo que falta por traducir, apuntado en los próximos pasos.
- [ ] Los `.kit-new` de los documentos, con la orden de `/zaius-merge` dada
      a la persona.
- [ ] Tipos, lint y tests, en verde.
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la web, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el idioma, antes de lanzar `%%KIT_RUN%% change`.
- Con las traducciones hechas, antes de darlas por buenas.
- Si cambiar de idioma pide algo que se ve y no existe (un selector en la
  cabecera): es un cambio de la página que lo lleva, la portada si va en el
  marco, con `/zaius-page HOME`.
