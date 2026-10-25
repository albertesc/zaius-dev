---
name: zaius-sketch
description: Crea un boceto en HTML, que se abre con doble clic en el navegador, de las direcciones de la identidad, de la guía visual del sistema de diseño, de una %%UNIT%%, de un refactor o de una propuesta de diseño, con la identidad de la %%KIND%% (su logo, su letra, sus fotos y su firma) y la plantilla de al lado. Lo usan zaius-brand, zaius-init, %%SPEC_SKILL%%, zaius-refactor y zaius-design; también se puede pedir suelto.
argument-hint: [<%%UNIT_EXAMPLE%%>]
---

# Crear un boceto

## Lee primero

- [Bocetos](../../../docs/ux-ui/README.md#bocetos): qué son y cuándo se
  borran.
- [Sistema de diseño](../../../docs/ux-ui/design-system.md): la identidad,
  los tokens, los anchos, el tema, el movimiento y las piezas por papel.
- [Normas](../../../docs/ux-ui/rules.md): un boceto ya las cumple, sobre
  todo «Jerarquía, espacios y columnas» y «Lo que no se hace».
- [Que no salga genérico](../zaius-brand/SKILL.md#que-no-salga-genérico),
  en `zaius-brand`, y la skill de diseño de la persona, si la nombra
  «Identidad»: manda en lo que fija.
- Las plantillas, que se copian: [guide.html](./guide.html), para la guía
  visual, y [mockup.html](./mockup.html), con el marco de esta %%KIND%%, para
  lo demás.
- Para una %%UNIT%%, su fichero, en `%%UNIT_DOCS%%/`: lo que se ve, sus
  datos, sus acciones y sus estados.
- Las referencias de `docs/ux-ui/references/`, con las fotos de la persona,
  si las hay.

## Pasos

1. **Qué boceto y dónde,** en `docs/ux-ui/mockups/`:
   - las direcciones de la identidad, `identity.html`, para `zaius-brand`;
   - la guía visual, `design-system.html`, con `guide.html`;
   - una %%UNIT%%, `<código>.html` (`%%UNIT_EXAMPLE%%.html`);
   - un refactor, `<código>-refactor.html`, con el antes y el después;
   - una propuesta de diseño, `AAAA-MM-DD-<topic>.html`, con el nombre de su
     propuesta, con el antes y el después.
2. **Copia su plantilla** y ajusta su arranque:
   - en `:root`, los tokens del sistema de diseño, con sus nombres y sus
     valores (los de `tokens.css` o los del tema de la librería) y los
     anchos de «Anchos». Los de la plantilla (`--brand`, `--surface`…) se
     cambian por ellos en todo el fichero, también donde apuntan los
     `--bar-…` (o, en la guía, los `--doc-…`);
   - la letra de la identidad, con su `<link>` de Google Fonts, y en los
     tokens, con la del sistema detrás, por si no carga; el peso de los
     títulos, `--font-display-weight`, el que tenga su letra (sin negrita
     falsa);
   - `data-width`, el ancho con el que se diseña («Anchos»), y `data-theme`,
     el tema («Tema»); en «Ancho», una opción por cada ancho de «Anchos»,
     quitando las que no se usan, y con un solo tema, quita su selector;
   - lo demás que pida la plantilla, que lo dice en su comentario de arriba.

   El de las direcciones va antes de «Anchos» y «Tema»: Móvil y Ordenador,
   un solo tema, sin selector de movimiento, y su selector de estados se
   llama «Dirección». Su barra toma los colores de cada dirección.

   La barra de arriba y lo de alrededor son los de la plantilla, y no se
   cambian: toman de los `--bar-…` los colores, la letra y las esquinas del
   sistema de diseño. En «Ordenador», el boceto ocupa la ventana entera, sin
   nada alrededor; en «Tableta» y «Móvil», va en su marco, sobre un fondo. Un
   ancho mayor que el del ordenador va como él, con su `min-width`. En la
   guía, lo mismo con su menú lateral y su página, que toman de los
   `--doc-…`.
3. **El contenido:**
   - **las direcciones:** una por estado (`data-for-state`, con su nombre
     en `data-label`), con sus tokens en `:root[data-state='<dirección>']` y
     su composición en reglas que empiezan por
     `[data-for-state='<dirección>']`; lo que enseña cada una lo dice
     [la pregunta de la identidad](../zaius-init/design-system-questions.md#3-la-identidad);
   - **la guía:** la documentación del sistema de diseño, con una sección
     por tema, cada una con su `id` y su enlace en el menú lateral, por
     grupos:
     - la identidad: la idea, con su firma dibujada como se verá y un «Así
       sí» y un «Así no»; el logo, con el nombre, solo y a su tamaño mínimo;
       los colores, con su papel y su contraste; la letra, con su escala; y
       las fotos;
     - los fundamentos: los espacios y las esquinas, el movimiento, los
       anchos y los iconos;
     - las piezas: el marco, en el móvil y en el ordenador, con el menú de
       las primeras %%UNITS%% del backlog (si aún no hay, lo principal del
       brief); y una sección por familia de «Piezas por papel», de 8 a 14,
       como las usa la persona (los textos, los botones, los formularios,
       los avisos y los estados, la navegación y las propias de la
       %%KIND%%), no una por fila. Cada una, con cada estado a la vista,
       cuándo se usa, sus normas (su número y una frase) y su nombre en el
       código, o que nace con la primera %%UNIT%% que la pida; las que aún
       no usa ninguna, también, con su nota;
     - las normas, una frase por cada una de `rules.md`, con su número; y
       los cambios, cada uno aceptado, con su fecha y su propuesta.

     Un cambio del sistema de diseño toca solo su sección y añade su fila a
     «Cambios»;
   - **una %%UNIT%%:** el marco y lo que dice su fichero, en su orden, con una
     sección por estado (`data-for-state`, con su `data-label`, de una o dos
     palabras, que es su opción en la barra): con datos y, si el fichero los
     tiene, cargando, vacío, error o sin permiso;
   - **un refactor o una propuesta:** el antes y el después de lo que cambia,
     uno al lado del otro o como dos estados.
4. **Como será de verdad,** con la identidad:
   - **el logo** de «Identidad», en SVG, dentro del boceto;
   - **las fotos:** las de la persona, si están en las referencias
     (`../references/<foto>`); si no, [de muestra](#fotos-de-muestra). Nunca
     un hueco gris. Cada una, en su caja con su proporción (`.photo`, como
     en la plantilla), que sin conexión guarda su tamaño;
   - **los textos y los datos, de esta %%KIND%%,** del brief y del fichero,
     nunca los de ejemplo de la plantilla: nombres, fechas y cifras que
     podrían ser reales, con el formato de las normas; nunca «Lorem ipsum»;
   - **lo que se pulsa responde:** cada botón, enlace, tarjeta o enlace del
     menú, con su estado al pasar por encima y con el foco, y la transición
     de «Movimiento» (la norma de movimiento);
   - **la firma** de la identidad, donde toque, y las normas de diseño, ya
     cumplidas.
5. **HTML y CSS,** con su plantilla: sin librerías ni más JavaScript que el
   suyo, y sin estilos en línea: cada muestra, con su clase. De fuera, solo las fotos de muestra y la letra de Google Fonts: sin
   conexión, el boceto se ve igual de ordenado, con la letra del sistema y
   cada foto con su tamaño y un fondo de color.
6. **Míralo antes de enseñarlo.** Si puedes hacer una captura (un navegador
   sin ventana), mira el boceto en el móvil y en el ordenador, también sin
   conexión. Una página larga, como la guía, por partes, yendo a cada
   ancla: una captura no pasa de unos 16 000 px de alto. El móvil de la
   guía, dentro de un `<iframe>` de 390 px de ancho, porque una ventana así
   no baja de 500. Repásalo, ancho a ancho:
   - **la jerarquía:** se ve primero lo que más importa, y cada nivel se
     distingue del siguiente;
   - **los espacios:** lo que va junto, cerca, y lo que no, separado, con
     el mismo token para la misma relación; nada pegado;
   - **las columnas:** la cabecera, las secciones y el pie, en la misma
     rejilla, con los bordes de los bloques en las mismas líneas;
   - **nada de «Lo que no se hace»** ni de
     [Que no salga genérico](../zaius-brand/SKILL.md#que-no-salga-genérico):
     lo que podría ser de cualquier otra %%KIND%%, se cambia.

   Las tres primeras son la norma «Jerarquía, espacios y columnas» de las
   [normas](../../../docs/ux-ui/rules.md); la última, «Lo que no se hace».
7. **Enséñalo:** dónde está y cómo se abre (doble clic, o arrastrarlo al
   navegador), qué mirar y qué se ha decidido; si puedes abrirlo tú, ábrelo.
   Lo que pida la persona se cambia en el mismo fichero hasta su sí.

## Fotos de muestra

Mientras la persona no pasa las suyas, de [Unsplash](https://unsplash.com),
que se pueden usar gratis. Una dirección de una foto nunca se inventa: una
inventada no carga.

1. **Búscala:** lee `https://unsplash.com/s/photos/<palabras-en-inglés>`
   («stone-farmhouse-garden») con la herramienta de leer páginas de la IA
   (con `curl` responde 401): da unas veinte fotos, con lo que enseñan y si
   son de pago (Unsplash+). Si no, con una búsqueda en internet y
   `site:unsplash.com/photos`. Su código son los 11 caracteres del final de
   su dirección (`…/photos/a-stone-building-with-a-tree-in-front-of-it-uzQPblEd7_c`
   es `uzQPblEd7_c`). Unsplash no tiene de todo: si no hay de su sitio, la
   más parecida en luz y en materiales.
2. **Saca su dirección:** `https://unsplash.com/photos/<código>/download`
   responde con una redirección a `https://images.unsplash.com/photo-…`
   (`curl -sI`, en su cabecera `location`); se queda la dirección sin lo que
   va detrás de `?`. Si responde 403, es de pago (Unsplash+), y si responde
   404, ya no está: otra.
3. **Ponla a su tamaño:** `<dirección>?w=1600&q=80&auto=format&fit=crop`
   (`w=800` para una tarjeta), con `width`, `height` y un texto alternativo
   que diga lo que se ve.
4. **Comprueba que carga** (`curl -sI` de la dirección final: 200 y
   `image/…`) y que enseña lo que toca: si puedes, ponlas todas en una
   página de prueba, con su código, y mírala en una captura.
5. **Apúntala** en el comentario de arriba del boceto, con la dirección de
   su página en Unsplash. Son de muestra: la %%KIND%% de verdad lleva las de
   la persona, o las de muestra que elija, descargadas al proyecto.

## Comprobación

- [ ] Se abre con doble clic y sus selectores funcionan; sin conexión, se ve
      ordenado.
- [ ] La guía: el menú lateral lleva a cada sección y marca dónde se está;
      cada pieza, con sus estados, sus normas y su nombre en el código.
- [ ] La barra, con los colores y la letra del sistema de diseño; en
      «Ordenador», sin fondo alrededor.
- [ ] Los colores, solo en los tokens (en `:root`, y en el de las
      direcciones, en los de cada una), con los del sistema de diseño.
- [ ] El logo, la letra y la firma de la identidad; ninguna foto gris, y
      cada foto de muestra, comprobada y apuntada.
- [ ] Una %%UNIT%%: lo que dice su fichero y cada uno de sus estados, con
      datos verosímiles.
- [ ] La jerarquía, los espacios y las columnas, repasados en cada ancho.
- [ ] Lo que se pulsa, con su estado al pasar por encima y con el foco.
- [ ] Nada de «Lo que no se hace» ni de «Que no salga genérico», y las
      normas de diseño, cumplidas.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el boceto hecho: la persona lo mira y decide; se ajusta hasta su sí.
- Si el boceto necesita algo que el fichero no dice: pregúntalo y escríbelo
  en el fichero. Si lo que falta es una norma de diseño, va con
  `zaius-design`.
