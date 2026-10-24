---
name: zaius-languages
description: Pasa a varios idiomas una web instalada con uno solo. Instala i18next con el change del kit, lleva cada texto de las páginas y los componentes al catálogo de cada idioma, src/i18n/<idioma>.json, con t('<página>.<clave>'), traduce o marca lo que falta y deja los documentos que cambian para zaius-merge, por bloques y con el OK de cada uno.
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
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos) y el
  [brief](../../../docs/brief.md), en «Idiomas y legales».

## Pasos

1. **Los idiomas:** pregunta cuáles; el primero es el de por defecto (hoy,
   `%%DEFAULT_LANGUAGE%%`), y cada uno de los otros tendrá su dirección
   (`/en/rooms`). Pregunta también quién traduce los textos. Pide el OK
   para i18next. Lo decidido va al brief, en «Idiomas y legales», con la
   fecha.
2. **El kit:** pide a la persona que lance
   `%%KIT_RUN%% change` y responda Sí al
   multiidioma, con los idiomas. Instala i18next, `src/i18n/` y
   `languageUtils`, las rutas de cada idioma en `astro.config.ts`, añade la
   paridad de idiomas a la comprobación de la estructura y deja un
   `.kit-new` de cada documento que cambia; «Textos (i18n)» de la
   nomenclatura, en su `.kit-new`, dice ya cómo se nombran las claves.
<!-- kit:if existing -->
   En un proyecto que aún se trae a las reglas del kit, el código del kit
   llega con el último bloque del plan: este paso se planifica como un
   bloque más.
<!-- kit:end -->
3. **Por bloques,** si hay muchas páginas: el marco y los componentes
   comunes, y cada página, o cada sección con sus páginas. Cada bloque, con
   su casilla en «Dónde estamos», y su OK antes de empezarlo y al
   terminarlo.
4. **Los textos,** página a página: cada texto de quien visita, de una
   página o de un componente, va al catálogo de cada idioma,
   `src/i18n/<idioma>.json`, y se pide con la `t` del idioma de la petición
   (`Astro.currentLocale`), de `src/i18n/i18n.ts`. Las claves, por página,
   como dice la nomenclatura (`t('rooms.title')`,
   `t('common.actions.send')`). Los plurales pasan a `count`, con `_one` y
   `_other`; el menú y el pie, a sus claves; el título y la descripción de
   cada página para los buscadores, también.
<!-- kit:if content -->
   Las entradas de las colecciones, una por idioma, como dice la guía de
   contenido en su `.kit-new`.
<!-- kit:end -->
5. **Las traducciones:** traduce a cada idioma, si la IA es quien traduce.
   Lo que no sepas traducir con seguridad lleva el texto del idioma por
   defecto y una casilla en
   [Decisiones pendientes](../../../docs/next-steps.md#decisiones-pendientes)
   («Revisar las traducciones de <idioma>: …»). Los textos legales no los
   traduce la IA: los da quien los escribió, en cada idioma.
6. **Los documentos:** sus `.kit-new` los fusiona `/zaius-merge`, que lanza
   la persona: dale la orden.
7. **Las comprobaciones:** `%%PM%% run typecheck`, `%%PM%% run lint` y
   `%%PM%% run test`, con la paridad de idiomas, en verde. La revisión, con la
   revisión visual en cada idioma, es `/zaius-review`, sin página, que lanza
   la persona.
8. **«Dónde estamos»:** los bloques hechos, lo que falta por traducir y lo
   siguiente. Para.

## Comprobación

- [ ] Ningún texto de quien visita escrito en una página o un componente.
- [ ] Las claves, por página, como dice la nomenclatura.
- [ ] La paridad de idiomas, en verde en la comprobación de la estructura:
      las mismas claves en todos los idiomas.
- [ ] El título y la descripción de cada página, en cada idioma.
- [ ] Lo que falta por traducir, apuntado en los próximos pasos.
- [ ] Los `.kit-new` de los documentos, con la orden de `/zaius-merge` dada
      a la persona.
- [ ] Tipos, lint y tests, en verde.
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la web, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Antes de instalar i18next: es una dependencia nueva.
- Con los idiomas, antes de lanzar
  `%%KIT_RUN%% change`.
- Antes y al final de cada bloque.
- Si cambiar de idioma pide algo que se ve y no existe (un selector en la
  cabecera): es un cambio de la página que lo lleva, la portada si va en el
  marco, con `/zaius-page HOME`.
