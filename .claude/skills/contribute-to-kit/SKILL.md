---
name: contribute-to-kit
description: Lleva a la plantilla del kit zaius-dev una regla nueva o cambiada en un proyecto instalado con el kit. La generaliza con el ejemplo de su camino (orders en una app, Casa del Roble en una web) y las condiciones de la plantilla, la escribe en shared/, web/ o app/, añade su entrada al CHANGELOG, sube la versión y pasa las comprobaciones del kit, con el OK antes de escribir.
disable-model-invocation: true
---

# Aportar al kit

## Lee primero

- [AGENTS.md](../../../AGENTS.md) del kit, entero: lo que deja en un
  proyecto, la plantilla (las carpetas, las respuestas, los bloques
  condicionales, los ficheros enteros y los valores), lo común y cada camino,
  y las reglas para editarlo.
- [templateFiles.json](../../../templateFiles.json): qué ficheros dependen de
  una respuesta y cuáles son semillas.
- El `CHANGELOG.md` del kit: la forma de una entrada y la última versión.
- El fichero de la plantilla que toca y lo que lo enlaza o lo resume.

## Pasos

1. **Localiza el cambio en el proyecto:** qué regla es, nueva o cambiada, en
   qué ficheros está (su `AGENTS.md`, sus `docs/`, sus skills, sus tests, su
   configuración) y por qué nació. Si es propia del proyecto (su negocio, su
   backend, su sistema de diseño), no va al kit: dilo y para. El tipo del
   proyecto está en su `zaius-dev.json` (`type`). Decide si la regla vale para
   los dos caminos o solo para el suyo.
2. **Generalízala:**
   - los ejemplos, del de su camino (en una app, el dominio `orders`; en una
     web, Casa del Roble), y los textos de interfaz, en castellano y entre «»;
   - ningún nombre ni detalle del proyecto: ni sus entidades, ni su backend,
     ni su gente;
   - ninguna librería de diseño: las piezas, por su papel, remitiendo a
     `docs/ux-ui/design-system.md`;
   - si depende de una respuesta, en su bloque, con cada marcador en su línea:
     `<!-- kit:if x -->`, `<!-- kit:else -->` y `<!-- kit:end -->` (en código,
     `// kit:if x`); si es un fichero entero, su condición en
     `templateFiles.json`, con la carpeta delante (`web/…`) si solo vale en un
     camino;
   - solo los valores de la tabla del `AGENTS.md` del kit.
3. **Escríbela** donde toca:
   - **si vale para los dos caminos y dice lo mismo,** en `shared/`, sin
     ningún «si es una web…»: lo que cambia según el tipo va en sus valores
     (`%%UNIT%%`, `%%SPEC_SKILL%%`…);
   - **si es de un solo camino,** en `web/` o en `app/`;
   - **si vale para los dos pero cambia,** en los dos, cada uno con los
     nombres de su camino.

   Y en lo que lo resume o lo enlaza: el `AGENTS.md` y el README del camino,
   las guías y las skills. Los enlaces y las anclas tienen que existir con
   cualquier combinación de respuestas.
4. **El `CHANGELOG.md`:** una entrada con la versión nueva, los ficheros que
   toca, qué cambia y cómo llega a un proyecto: su `update` lo sustituye si el
   proyecto no lo ha tocado y, si lo ha cambiado, deja un `.kit-new` que
   fusiona la skill `zaius-merge`. Una semilla no se actualiza: di qué se
   copia a mano.
5. **La versión,** en el `package.json` del kit, la misma que la de la
   entrada: un arreglo sube el último número; una regla o un fichero nuevos,
   el del medio.
6. **Las comprobaciones:** `npm test` y `npm run verify` del kit, en verde (en
   Windows, desde PowerShell); mientras se escribe, `npm run verify -- --docs`
   las mira en segundos. Y `next-steps.md` del kit, al día.
7. **La publicación,** como dice «Publicar una versión» en el README del kit:
   el commit, la etiqueta anotada (`git tag -a vX.Y.Z`, porque
   `--follow-tags` no sube las ligeras) y, con el OK, `git push --follow-tags`.
   Hasta que se sube, ningún proyecto la recibe.

## Comprobación

- [ ] Buscar en la plantilla el nombre del proyecto y sus entidades no da nada.
- [ ] Cada marcador, en su línea; ningún valor fuera de la tabla.
- [ ] `shared/` sigue sin nada de un camino.
- [ ] La entrada del `CHANGELOG.md`, con la versión, los ficheros, el cambio y
      cómo llega a un proyecto.
- [ ] La versión de `package.json`, igual que la del `CHANGELOG.md`.
- [ ] `npm test` y `npm run verify`, en verde.
- [ ] El commit y la etiqueta de la versión; subidos, con el OK.
- [ ] El proyecto de donde sale la regla, sin tocar.

## Para y pide el OK

- Antes de escribir en el kit: enseña la regla generalizada, los ficheros que
  toca y la versión nueva, y espera.
- Si no está claro si la regla es del proyecto o sirve para todos.
- Si la regla contradice otra de la plantilla.
- Antes de `git push`: publica la versión para todos los proyectos.
