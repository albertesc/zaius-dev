---
name: zaius-rename
description: Alinea los nombres del proyecto con la nomenclatura. Revisa lo que dice «Revisar los nombres» de naming.md, da una tabla con cada nombre que no la cumple, el que le toca, su regla y lo que arrastra, y con el OK renombra por bloques, sin romper imports, rutas, menú, textos, tests ni documentos.
disable-model-invocation: true
---

# Alinear la nomenclatura

## Cuándo

- **Al traer un proyecto que ya tenía código:** `zaius-adopt` la pone como un
  bloque de su plan.
- **Al actualizar el kit,** si el `CHANGELOG.md` de la versión cambia una
  regla de nombres: `zaius-merge` la propone.
- **Cuando la persona lo pide,** para todo el proyecto o una parte.

## Lee primero

- [Nomenclatura](../../../docs/naming.md), entera, y su apartado
  [Revisar los nombres](../../../docs/naming.md#revisar-los-nombres): qué se
  mira, en qué orden, y cómo se mueve cada cosa en esta %%KIND%%.
- [Normativa](../../../docs/standards.md): dónde va cada cosa, que decide el
  prefijo de cada nombre.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).

## Pasos

1. **Revisa los nombres,** sin mover nada, con lo que dice «Revisar los
   nombres», en su orden.
2. **La tabla:** cada nombre que no cumple, con el que le toca, la regla que lo
   pide (con su enlace a `naming.md`) y lo que arrastra (quién lo importa,
   sus textos, su ruta, sus tests, sus documentos). Agrupada por %%UNIT%% o
   por carpeta, del bloque más pequeño al más grande. Aparte, lo que no se
   renombra sin preguntar: una URL, porque rompe los enlaces que la gente ha
   guardado, y lo que diga «Revisar los nombres».
3. **Los bloques,** en `docs/next-steps.md`, cada uno con su «Está cuando»:
   tipos, lint y tests en verde, y el nombre viejo no sale en ningún sitio.
   Espera el OK del plan.
4. **Cada bloque,** con su OK:
<!-- kit:if git -->
   - **mueve con `git mv`** cada fichero y cada carpeta, para conservar su
     historia;
<!-- kit:else -->
   - **mueve** cada fichero y cada carpeta;
<!-- kit:end -->
   - **cambia lo que exporta** cada fichero y cada import que lo usa, también
     en los tests;
   - lo demás que arrastra, como dice «Revisar los nombres» (las rutas, el
     menú, los textos);
   - **sus documentos:** el fichero de su %%UNIT%% y lo que lo enlaza;
   - **busca el nombre viejo** en todo el proyecto: no queda ninguno.
5. **Comprueba** cada bloque con `/zaius-review`, sin %%UNIT%%: tipos, lint,
   tests, build y la comprobación de la estructura.

## Comprobación

- [ ] La tabla, con la regla de cada nombre y lo que arrastra.
- [ ] Ninguna URL cambiada sin el OK de la persona.
<!-- kit:if git -->
- [ ] Cada bloque, con `git mv`, sus imports, sus textos y sus documentos.
<!-- kit:else -->
- [ ] Cada bloque, con sus imports, sus textos y sus documentos.
<!-- kit:end -->
- [ ] El nombre viejo no sale en ningún sitio.
- [ ] Tipos, lint y tests, en verde después de cada bloque.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Antes de empezar: la tabla y los bloques.
- Antes de cada bloque, salvo que la persona pida hacerlos seguidos.
- Si un nombre no tiene una regla clara: propón uno y espera.
- Si una URL no cumple la regla.
