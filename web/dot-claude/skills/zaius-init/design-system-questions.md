# Preguntas del sistema de diseño

Las preguntas de `zaius-init` para definir el sistema de diseño básico
de %%APP_NAME%%. Cada respuesta se escribe en su sección de
[design-system.md](../../../docs/ux-ui/design-system.md).

**Cómo se pregunta:**

- **Antes, las referencias:** pregunta si hay algo en lo que basar el
  diseño: una web que le guste, capturas, la guía de marca, un enlace a
  Figma. Lo que pase se guarda en `docs/ux-ui/references/` y orienta las
  respuestas y la identidad: el color de la marca, por ejemplo, se saca de
  ahí antes que preguntarlo. Y si tiene una skill de diseño propia (la de
  su empresa, una que usa siempre): se añade como dice
  [Una skill de diseño propia](../../../docs/ux-ui/README.md#una-skill-de-diseño-propia),
  y manda en lo que fija.
- **En cuatro tandas cortas,** en este orden: las piezas de las páginas
  (la 1); la identidad, con `zaius-brand` (la 3); desde dónde se ve y el
  tema (la 4 y la 5); y las animaciones (la 7).
- **Con palabras de la web,** como dice
  [Hablar con la persona](../../../docs/process.md#hablar-con-la-persona): la
  pregunta, como va en negrita, y cada opción, con lo que la persona notará
  en la web. Los paquetes y los ficheros de las tablas son lo que se
  escribe, no lo que se pregunta.
- **Cada pregunta, con sus opciones:** la recomendada, la primera y marcada
  «(recomendada)», y con cada una, lo que pasa si se elige; y «No lo sé»,
  que se queda con la recomendada.
- **Los tokens y los iconos no se preguntan** (la 2 y la 6): se eligen con
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
salen de las piezas (la 1) y de la identidad (la 3). Se eligen con esta tabla y
se dicen en una frase («Los colores y los espacios, del tema de la librería,
con el color de la marca»).

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Del tema de la librería | La librería tiene tema y lo expone como variables CSS. | Los valores de la marca, en su tema; en «Tokens», cómo se usan en el `<style>` de un componente. |
| Propios, en variables CSS | Sin librería, o con una sin tema. | `src/styles/tokens.css`, importado en `src/layouts/BaseLayout.astro`: el color de la marca, la tipografía, una escala neutra de grises, los espacios y los radios. |

- **Se escribe en** «Tokens» y en la línea «Sistema de diseño» de
  `AGENTS.md` («tokens en …»).

## 3. La identidad

**¿Cuál de estas tres direcciones se parece más a lo que quieres?**

No se pregunta en frío: la skill `zaius-brand` propone tres direcciones,
cada una con su idea, su logo, sus colores, su letra, sus fotos y su firma,
y las enseña en un boceto, `docs/ux-ui/mockups/identity.html`.

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| La recomendada | La que mejor encaja con el tono y con quien visita la web, según el brief. | «Identidad», y sus colores y su letra en «Tokens». |
| Otra de las tres | La persona prefiere otra. | Lo mismo, con la elegida. |
| Mezclar | Le gusta algo de cada una («los colores de la primera, la letra de la segunda»). | Lo mismo, con la mezcla, enseñada antes en el boceto. |
| Ninguna | No le encaja ninguna, y dice qué no le gusta. | Nada todavía: salen tres nuevas. |

- **El boceto de las direcciones** enseña, en el móvil y en el ordenador, la
  cabecera con el logo y el menú, la portada de la página de inicio, con su
  foto y su llamada a la acción, y una sección debajo, con fotos, para ver
  cómo se compone. Debajo, fuera de la web, su ficha: la idea, la firma,
  los colores (con su nombre, su valor, su papel y su contraste), la letra y
  el logo, a varios tamaños.
- **Con una marca** (una guía, un logo, unos colores, una letra) o con unos
  estilos ya hechos, las tres respetan lo que fijan y cambian lo demás.
- **La letra** se sirve desde la propia web, con las tipografías de Astro:
  su familia, en `fonts` de `astro.config.ts`, con el proveedor de Google
  (`fontProviders.google()`), que la descarga al construir; y
  `<Font cssVariable='--font-…' />`, en `src/layouts/BaseLayout.astro`. Sin
  paquetes. Solo los pesos que se usan, el subconjunto `latin` y sus
  letras de repuesto (`fallbacks`); se precarga la de los títulos (`preload`).
  En `tokens.css`, la letra se nombra con su variable y su repuesto
  (`var(--font-young-serif, Georgia, serif)`). Una de pago, con sus
  ficheros, su licencia y el proveedor local.
- **El logo:** el símbolo, en `src/assets/logo.svg`, en un solo color
  (`currentColor`). La cabecera lo importa como componente, y el icono de la
  pestaña (`public/favicon.svg`) sale de él, cuando los pide la primera
  página.
- **El contraste** del texto sobre la marca, 4,5:1
  ([D12](../../../docs/ux-ui/rules.md#d12-accesibilidad)); si no llega, un
  tono más oscuro para los botones primarios.
- **Se escribe en** «Identidad» y «Tokens».

## 4. Los anchos

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

## 5. El modo oscuro

**¿La web es clara, oscura o tiene los dos modos?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Solo claro (recomendada) | Lo habitual, salvo que la marca sea oscura. | «Tema»: solo claro; los tokens, con una sola paleta. |
| Solo oscuro | La marca es oscura (un grupo de música, un estudio, un evento de noche). | «Tema»: solo oscuro; los tokens, con una sola paleta, oscura. |
| Claro y oscuro | Se lee mucho rato o con poca luz (un blog largo, una carta de restaurante de noche). | «Tema»: los dos, cómo se elige (el del sistema o un interruptor) y que cada página se revisa en los dos; los tokens, con sus dos valores. |

- **Con referencias,** la recomendada es la que enseñan: si la marca es
  oscura, «Solo oscuro».

## 6. Los iconos

**No se pregunta:** se eligen con esta tabla y se dicen en una frase («Los
iconos, los de la librería»).

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Los de la librería | La librería tiene su juego de iconos. | Cómo se pasa un icono a sus piezas. |
| Astro Icon | Sin librería, o con una sin iconos: pinta como SVG, en el servidor, cualquier juego de Iconify (Lucide, Heroicons…). | `astro-icon`, con su integración en `astro.config.ts`, y el juego (`@iconify-json/lucide`), con el OK; cómo se pinta un icono (`<Icon name='lucide:check' />`) y su tamaño. |
| Un juego de SVG | Se quieren pocos iconos y ninguna dependencia más. | Los SVG del juego (Lucide, Heroicons…), copiados al proyecto e importados como componentes; dónde van y su tamaño. |

- **Se escribe en** «Iconos»: el paquete, cómo se pasa un icono a una pieza
  y su tamaño; y, en «Piezas por papel», el botón de icono.

## 7. Las animaciones

**¿Qué animaciones quieres en la web?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Pocas y suaves (recomendada) | Una web que se lee: lo que se pulsa responde con una animación corta, al pasar por encima o al abrirse. | «Movimiento»: lo justo, de 150 a 300 ms. |
| Vistosas | Una landing o un lanzamiento: las secciones aparecen al llegar a ellas y el producto entra al cargar. | «Movimiento»: vistoso; además de lo justo, entradas de hasta 600 ms, una vez. |
| Ninguna | Se quiere la web sin animaciones. | «Movimiento»: nada; los cambios, sin transición. |

- **Con referencias,** la recomendada es la que enseñan.
- **Se escribe en** «Movimiento»: el nivel, sus duraciones y su curva como
  tokens (`--motion-fast`, `--motion-slow`, `--motion-ease`), cómo responde
  lo que se pulsa al pasar por encima y con el foco (su color, su fondo o un
  pequeño desplazamiento), y que con «reducir movimiento» solo queda un
  fundido ([D13](../../../docs/ux-ui/rules.md#d13-movimiento)).
