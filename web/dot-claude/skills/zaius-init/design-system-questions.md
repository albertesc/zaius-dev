# Preguntas del sistema de diseño

Las preguntas de `zaius-init` para definir el sistema de diseño básico
de %%APP_NAME%%. Cada respuesta se escribe en su sección de
[design-system.md](../../../docs/ux-ui/design-system.md).

**Cómo se pregunta:**

- **Antes, las referencias:** pregunta si hay algo en lo que basar el
  diseño: una web que le guste, capturas, la guía de marca, un enlace a
  Figma. Lo que pase se guarda en `docs/ux-ui/references/` y orienta las
  respuestas: el color de la marca, por ejemplo, se saca de ahí antes que
  preguntarlo.
- **En cuatro tandas cortas,** en este orden: las piezas de las páginas
  (la 1); el color de la marca y la tipografía (la 3 y la 4); desde dónde se
  ve y el tema (la 5 y la 6); y el movimiento y los bocetos (la 9 y la 8).
- **Con palabras de la web,** como dice
  [Hablar con la persona](../../../docs/process.md#hablar-con-la-persona): la
  pregunta, como va en negrita, y cada opción, con lo que la persona notará
  en la web. Los paquetes y los ficheros de las tablas son lo que se
  escribe, no lo que se pregunta.
- **Cada pregunta, con sus opciones:** la recomendada, la primera y marcada
  «(recomendada)», y con cada una, lo que pasa si se elige; y «No lo sé»,
  que se queda con la recomendada.
- **Los tokens y los iconos no se preguntan** (la 2 y la 7): se eligen con
  su tabla, según las otras respuestas, y se dicen en una frase. Si la
  persona quiere otra cosa, se cambia.
- **Se repregunta lo que no queda claro** («azul», «la de siempre»), y nunca
  se inventa un valor. Lo que la persona prefiere dejar va como «Pendiente»
  en su sección, con lo que falta para decidirlo.
- **Cada respuesta se escribe en el momento,** en su sección: si la sesión se
  corta, la siguiente sigue por la primera pregunta sin respuesta.
- **Una respuesta que trae una dependencia** (la librería, un paquete de
  iconos o de tipografía) se instala solo con el OK.

## 1. La librería de componentes

**¿Con qué piezas se montan las páginas: los botones, las tarjetas, los
formularios?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Hechas a medida (recomendada) | Lo habitual en una web: se pinta con HTML y CSS, sin nada que descargar aparte. | Componentes `.astro` propios, con los tokens: cada fila de «Piezas por papel» dice la pieza que se creará en `src/components/` cuando la pida la primera página. |
| Unos estilos ya hechos | Se quiere partir de unos estilos hechos, sin JavaScript: Pico CSS, Open Props… | Su paquete y su versión, cómo se importa en `src/layouts/BaseLayout.astro` y, en cada fila de «Piezas por papel», el componente `.astro` que la usa. |
| Las de la empresa | La empresa ya tiene su librería. | Su paquete, cómo se instala (un registro privado, una ruta local, git) y dónde está su documentación; las piezas, leídas de sus exports o de su documentación. |

- **Si quiere unos ya hechos sin saber cuáles,** propón los que mejor
  cubran los papeles más exigentes de una web (el menú del móvil, la galería,
  el formulario) sin JavaScript y mejor convivan con los estilos con ámbito
  de los componentes, y di por qué en una frase.
- **Lo que pide para montarse** (sus estilos globales, un plugin de
  PostCSS) sale de su documentación, no se pregunta; la versión, la última
  estable.
- **Se escribe en** «Librería y cómo se monta», «Piezas por papel», «Lo que
  falta» y la línea «Sistema de diseño» de `AGENTS.md`.

## 2. Los tokens

**No se pregunta:** los colores, la tipografía, los espacios y los radios
salen de las piezas (la 1) y de la marca (la 3). Se eligen con esta tabla y
se dicen en una frase («Los colores y los espacios, del tema de la librería,
con el color de la marca»).

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Del tema de la librería | La librería tiene tema y lo expone como variables CSS. | Los valores de la marca, en su tema; en «Tokens», cómo se usan en el `<style>` de un componente. |
| Propios, en variables CSS | Sin librería, o con una sin tema. | `src/styles/tokens.css`, importado en `src/layouts/BaseLayout.astro`: el color de la marca, la tipografía, una escala neutra de grises, los espacios y los radios. |
| Provisionales | Sin librería con tema y sin marca todavía (la 3, «Todavía no se sabe»). | `tokens.css` con una escala neutra mínima, marcada en «Tokens» como provisional; se cambia con `zaius-design`. |

- **Se escribe en** «Tokens» y en la línea «Sistema de diseño» de
  `AGENTS.md` («tokens en …»).

## 3. El color de la marca

**¿Cuál es el color principal de la marca?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Uno exacto (recomendada) | Hay un logo, una web o una guía de marca. | El token de la marca con ese valor, en el tema o en `tokens.css`. |
| Uno de los de la librería | No hay marca propia. | El nombre de ese color en la paleta, como token de la marca. |
| Todavía no se sabe | No se ha decidido. | Un azul neutro, marcado en «Tokens» como provisional. |

- **Repregunta** un color sin valor («azul»): pide el logo o la web de la
  marca y saca el color de ahí, o propón uno y espera el sí.
- **Comprueba el contraste** del texto sobre la marca (4,5:1,
  [D12](../../../docs/ux-ui/rules.md#d12-accesibilidad)); si no llega, dilo
  y propón un tono más oscuro para los botones primarios.

## 4. La tipografía

**¿La marca tiene una tipografía propia?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| No: la del sistema (recomendada) | No hay una de marca. | `system-ui` y sus alternativas, sin nada que descargar. |
| No: la de la librería | No hay una de marca y la librería trae la suya. | La de su tema. |
| Sí, la de la marca | La marca tiene la suya. | Su nombre, sus pesos y cómo se carga: un paquete (con el OK) o sus ficheros en `public/`. |

- **Repregunta** si es de pago, por su licencia. Los pesos no se preguntan:
  normal y negrita.
- **Se escribe en** «Tokens»: la familia y la escala de tamaños.

## 5. Los anchos

**¿Desde dónde se va a ver la web: sobre todo desde el móvil, en el
ordenador o en pantallas grandes?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| En el móvil primero (recomendada) | Una web: la mayoría entra desde el móvil. | Se diseña a 360 px y se amplía hasta 1440 px; se revisa a 360, 768, 1280 y 1440 px. |
| Sobre todo en el ordenador | La visitan sobre todo desde el trabajo, en un portátil o un monitor. | Se diseña desde 360 px y se cuida sobre todo a 1280 px; se revisa a 360, 768 y 1280 px. |
| En pantallas grandes | Fotos grandes o mucho contenido a la vez: un portfolio, un catálogo. | Se diseña desde 360 px y se cuida sobre todo a 1440 px; se revisa a 360, 1280, 1440 y 1920 px. |

- **Siempre desde el móvil:** cada página se diseña primero a 360 px y se
  amplía; la respuesta dice en qué ancho se cuida más.
- **Se escribe en** «Anchos»: el ancho de diseño, el mínimo en el que todo
  funciona sin scroll horizontal de la página y los anchos en los que se
  revisa cada página.

## 6. El modo oscuro

**¿La web es clara, oscura o tiene los dos modos?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Solo claro (recomendada) | Lo habitual, salvo que la marca sea oscura. | «Tema»: solo claro; los tokens, con una sola paleta. |
| Solo oscuro | La marca es oscura (un grupo de música, un estudio, un evento de noche). | «Tema»: solo oscuro; los tokens, con una sola paleta, oscura. |
| Claro y oscuro | Se lee mucho rato o con poca luz (un blog largo, una carta de restaurante de noche). | «Tema»: los dos, cómo se elige (el del sistema o un interruptor) y que cada página se revisa en los dos; los tokens, con sus dos valores. |

- **Con referencias,** la recomendada es la que enseñan: si la marca es
  oscura, «Solo oscuro».

## 7. Los iconos

**No se pregunta:** se eligen con esta tabla y se dicen en una frase («Los
iconos, los de la librería»).

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Los de la librería | La librería tiene su juego de iconos. | Cómo se pasa un icono a sus piezas. |
| Astro Icon | Sin librería, o con una sin iconos: pinta como SVG, en el servidor, cualquier juego de Iconify (Lucide, Heroicons…). | `astro-icon`, con su integración en `astro.config.ts`, y el juego (`@iconify-json/lucide`), con el OK; cómo se pinta un icono (`<Icon name='lucide:check' />`) y su tamaño. |
| Un juego de SVG | Se quieren pocos iconos y ninguna dependencia más. | Los SVG del juego (Lucide, Heroicons…), copiados al proyecto e importados como componentes; dónde van y su tamaño. |

- **Se escribe en** «Iconos»: el paquete, cómo se pasa un icono a una pieza
  y su tamaño; y, en «Piezas por papel», el botón de icono.

## 8. Los bocetos

**¿Cómo quieres ver cada página antes de construirla?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Con el diseño de verdad (recomendada) | Lo habitual: se aprueba cómo se verá. | «Bocetos»: alta. |
| En grises, con las piezas | Se quiere decidir la jerarquía antes que los colores. | «Bocetos»: media. |
| Solo cajas | Al principio, cuando aún se decide qué va en cada página. | «Bocetos»: baja. |

- **Se escribe en** «Bocetos»: el nivel de partida. Cada boceto se puede ver
  también en los otros dos, con su selector
  ([Bocetos](../../../docs/ux-ui/README.md#bocetos)).

## 9. El movimiento

**¿Cuánto se mueve la web?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Lo justo (recomendada) | Una web que se lee: transiciones cortas en lo que se usa. | «Movimiento»: lo justo, de 150 a 300 ms. |
| Vistoso | Una landing o un lanzamiento: las secciones aparecen al llegar a ellas y el producto entra al cargar. | «Movimiento»: vistoso; además de lo justo, entradas de hasta 600 ms, una vez. |
| Nada | Se quiere la web quieta del todo. | «Movimiento»: nada; los cambios, sin transición. |

- **Con referencias,** la recomendada es la que enseñan.
- **Se escribe en** «Movimiento»: el nivel, sus duraciones y su curva como
  tokens (`--motion-fast`, `--motion-slow`, `--motion-ease`), y que con
  «reducir movimiento» solo queda un fundido
  ([D13](../../../docs/ux-ui/rules.md#d13-movimiento)).
