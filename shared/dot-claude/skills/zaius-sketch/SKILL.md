---
name: zaius-sketch
description: Crea un boceto en HTML, que se abre con doble clic en el navegador, de la guía visual del sistema de diseño, de una %%UNIT%%, de un refactor o de una propuesta de diseño, en baja, media o alta fidelidad, con la plantilla de al lado. Lo usan zaius-init, %%SPEC_SKILL%%, zaius-refactor y zaius-design; también se puede pedir suelto.
argument-hint: [<%%UNIT_EXAMPLE%%>]
---

# Crear un boceto

## Lee primero

- [Bocetos](../../../docs/ux-ui/README.md#bocetos): qué son, sus niveles y
  cuándo se borran.
- [Sistema de diseño](../../../docs/ux-ui/design-system.md): los tokens, los
  anchos, el tema, el movimiento, las piezas por papel y el nivel de los
  bocetos.
- [Normas](../../../docs/ux-ui/rules.md): un boceto ya las cumple.
- La plantilla, que se copia: [mockup.html](./mockup.html), con el marco de
  esta %%KIND%%.
- Para una %%UNIT%%, su fichero, en `%%UNIT_DOCS%%/`: lo que se ve, sus
  datos, sus acciones y sus estados.
- Las referencias de `docs/ux-ui/references/`, si las hay.

## Pasos

1. **Qué boceto y dónde,** en `docs/ux-ui/mockups/`:
   - la guía visual, `design-system.html`, siempre en alta;
   - una %%UNIT%%, `<código>.html` (`%%UNIT_EXAMPLE%%.html`), en el nivel de
     «Bocetos» del sistema de diseño, salvo que la persona pida otro;
   - un refactor, `<código>-refactor.html`, con el antes y el después;
   - una propuesta de diseño, `AAAA-MM-DD-<topic>.html`, con el nombre de su
     propuesta, con el antes y el después.
2. **Copia la plantilla** y ajusta su arranque:
   - en `:root`, los tokens del sistema de diseño (los valores de
     `tokens.css` o del tema de la librería, y los anchos de «Anchos»); lo
     que siga «Pendiente», con los provisionales;
   - `data-fidelity`, con el nivel (`low`, `mid` o `high`);
   - `data-width`, el ancho con el que se diseña («Anchos»), y `data-theme`,
     el tema («Tema»); con un solo tema, quita su selector, y si no se usa en
     el móvil, la opción «Móvil»;
   - lo demás que pida la plantilla, que lo dice en su comentario de arriba.
3. **El contenido:**
   - **la guía:** el marco, con el menú de las primeras %%UNITS%% del backlog,
     y dentro, una sección por grupo de «Piezas por papel», con sus estados;
   - **una %%UNIT%%:** el marco y lo que dice su fichero, en su orden, con una
     sección por estado (`data-for-state`, con su `data-label`): con datos y,
     si el fichero los tiene, cargando, vacío, error o sin permiso;
   - **un refactor o una propuesta:** el antes y el después de lo que cambia,
     uno al lado del otro o como dos estados.
4. **Datos de ejemplo verosímiles,** del negocio de la %%KIND%% y del
   fichero: nombres, fechas y cifras que podrían ser reales, con el formato de
   las normas; nunca «Lorem ipsum». Las normas de diseño se cumplen ya en el
   boceto.
5. **Solo HTML y CSS,** con su plantilla: sin librerías, sin CDN, sin fuentes
   ni imágenes de fuera (una imagen es un hueco con su tamaño; una tipografía
   que no está en el equipo cae en la del sistema, y se dice). El JavaScript,
   solo el de la plantilla.
6. **Enséñalo:** dónde está y cómo se abre (doble clic, o arrastrarlo al
   navegador), qué mirar y qué se ha decidido; si puedes abrirlo tú, ábrelo.
   Lo que pida la persona se cambia en el mismo fichero hasta su sí.

## Comprobación

- [ ] Se abre con doble clic, sin conexión, y sus selectores funcionan.
- [ ] Los colores y las medidas, solo en `:root`, con los del sistema de
      diseño.
- [ ] Una %%UNIT%%: lo que dice su fichero y cada uno de sus estados, con
      datos verosímiles.
- [ ] Las normas de diseño, cumplidas.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el boceto hecho: la persona lo mira y decide; se ajusta hasta su sí.
- Si el boceto necesita algo que el fichero no dice: pregúntalo y escríbelo
  en el fichero. Si lo que falta es una norma de diseño, va con
  `zaius-design`.
