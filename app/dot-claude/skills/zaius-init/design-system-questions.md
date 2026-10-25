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
- **En cuatro tandas cortas,** en este orden: las piezas de las pantallas
  (la 1); la identidad, con `zaius-brand` (la 3); dónde se usa y el modo
  oscuro (la 4 y la 5); y las animaciones (la 7).
- **Con palabras de la app,** como dice
  [Hablar con la persona](../../../docs/process.md#hablar-con-la-persona): la
  pregunta, como va en negrita, y cada opción, con lo que la persona notará
  en la app. Los paquetes y los ficheros de las tablas son lo que se escribe,
  no lo que se pregunta.
- **Cada pregunta, con sus opciones:** la recomendada, la primera y marcada
  «(recomendada)», y con cada una, lo que pasa si se elige; y «No lo sé», que
  se queda con la recomendada.
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

**¿Con qué piezas se montan las pantallas: los botones, las tablas, los
formularios?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Unas ya hechas (recomendada) | No hay unas propias: una librería del mercado, como MUI, Mantine, Chakra UI, Ant Design, shadcn/ui… | Su paquete y su versión, cómo se monta y, en cada fila de «Piezas por papel», su componente. |
| Las de la empresa | La empresa ya tiene su librería. | Su paquete, cómo se instala (un registro privado, una ruta local, git) y dónde está su documentación; las piezas, leídas de sus exports o de su documentación. |
| Hechas a medida | Se quiere controlar cada pieza, o la app es pequeña. | Componentes propios sobre HTML: cada fila de «Piezas por papel» dice la pieza que se creará en `src/components/` cuando la pida la primera historia. |

- **Si elige unas ya hechas sin saber cuáles,** propón la librería que mejor
  cubra los papeles más exigentes (la tabla, la fecha, la selección múltiple)
  y mejor conviva con CSS Modules, y di por qué en una frase.
- **Lo que pide para montarse** (un proveedor, sus estilos globales, un
  plugin de PostCSS) sale de su documentación, no se pregunta; la versión, la
  última estable. shadcn/ui copia sus componentes al proyecto y pide
  Tailwind, otra dependencia.
- **Se escribe en** «Librería y cómo se monta», «Piezas por papel», «Lo que
  falta» y la línea «Sistema de diseño» de `AGENTS.md`.

## 2. Los tokens

**No se pregunta:** los colores, la tipografía, los espacios y los radios
salen de las piezas (la 1) y de la identidad (la 3). Se eligen con esta tabla y
se dicen en una frase («Los colores y los espacios, del tema de la librería,
con el color de la marca»).

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Del tema de la librería | La librería tiene tema y lo expone como variables CSS. | Los valores de la marca, en su tema; en «Tokens», cómo se usan en un `.module.css`. |
| Propios, en variables CSS | Sin librería, o con una sin tema. | `src/styles/tokens.css`, importado en `src/main.tsx`: el color de la marca, la tipografía, una escala neutra de grises, los espacios y los radios. |

- **Se escribe en** «Tokens» y en la línea «Sistema de diseño» de
  `AGENTS.md` («tokens en …»).

## 3. La identidad

**¿Cuál de estas tres direcciones se parece más a lo que quieres?**

No se pregunta en frío: la skill `zaius-brand` propone tres direcciones,
cada una con su idea, su logo, sus colores, su letra, sus fotos y su firma,
y las enseña en un boceto, `docs/ux-ui/mockups/identity.html`.

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| La recomendada | La que mejor encaja con el tono y con quien usa la app, según el brief. | «Identidad», y sus colores y su letra en «Tokens». |
| Otra de las tres | La persona prefiere otra. | Lo mismo, con la elegida. |
| Mezclar | Le gusta algo de cada una («los colores de la primera, la letra de la segunda»). | Lo mismo, con la mezcla, enseñada antes en el boceto. |
| Ninguna | No le encaja ninguna, y dice qué no le gusta. | Nada todavía: salen tres nuevas. |

- **El boceto de las direcciones** enseña, en el ancho en el que más se usa,
  el marco (la cabecera o el menú lateral, con el logo), la pantalla
  principal con datos de ejemplo y, si se entra con una cuenta, la pantalla
  de entrar, con su foto o su dibujo. Debajo, fuera de la app, su ficha: la
  idea, la firma, los colores (con su nombre, su valor, su papel y su
  contraste), la letra y el logo, a varios tamaños. En una app, la firma es
  más callada: va en el marco, en la entrada y en los estados vacíos, no en
  cada tabla.
- **Con una marca** (una guía, un logo, unos colores, una letra) o con una
  librería, las tres respetan lo que fijan y cambian lo demás.
- **La letra** se sirve desde la propia app, con su paquete de Fontsource
  (`@fontsource-variable/<familia>`, con el OK: es una dependencia),
  importado en `src/main.tsx`; con una librería con tema, también en su
  tema. Solo los pesos que se usan; en `tokens.css`, la letra se nombra con
  su repuesto (`'Instrument Sans Variable', system-ui, sans-serif`). Una de
  pago, con sus ficheros y su licencia.
- **El logo:** el símbolo, en `public/logo.svg`, con los colores de la
  marca. La cabecera (`AppLogoImage`) y el icono de la pestaña lo usan
  cuando los pide la primera historia.
- **El contraste** del texto sobre la marca, 4,5:1
  ([D12](../../../docs/ux-ui/rules.md#d12-accesibilidad)); si no llega, un
  tono más oscuro para los botones primarios.
- **Se escribe en** «Identidad» y «Tokens».

## 4. Los anchos

**¿Dónde se va a usar la app: en el ordenador, en pantallas grandes o
también en el móvil?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| En el ordenador (recomendada) | Una app de gestión, en un portátil o un monitor normal. | Se diseña a 1280 px, con 1024 px de mínimo, y se revisa a 1024, 1280 y 1440 px. |
| En pantallas grandes | Monitores grandes y tablas anchas. | Se diseña a 1440 px, con 1280 px de mínimo, y se revisa a 1280, 1440 y 1920 px. |
| También en el móvil | Se usa también en el móvil. | Se diseña a 1280 px, con 360 px de mínimo, y se revisa a 360, 768 y 1280 px; las tablas y los formularios cambian de forma en el móvil. |

- **Se escribe en** «Anchos»: el ancho de diseño, el mínimo en el que todo
  funciona sin scroll horizontal de la página y los anchos en los que se
  revisa cada pantalla.

## 5. El modo oscuro

**¿La app tiene modo oscuro?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Solo claro (recomendada) | Lo habitual en una app de gestión. | «Tema»: solo claro; los tokens, con una sola paleta. |
| Solo oscuro | La marca es oscura (un grupo de música, un estudio, un evento de noche). | «Tema»: solo oscuro; los tokens, con una sola paleta, oscura. |
| Claro y oscuro | Se usa muchas horas seguidas o con poca luz. | «Tema»: los dos, cómo se elige (el del sistema o un interruptor) y que cada pantalla se revisa en los dos; los tokens, con sus dos valores. |

- **Con referencias,** la recomendada es la que enseñan: si la marca es
  oscura, «Solo oscuro».

## 6. Los iconos

**No se pregunta:** se eligen con esta tabla y se dicen en una frase («Los
iconos, los de la librería»).

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Los de la librería | La librería tiene su juego de iconos. | Cómo se pasa un icono a sus piezas. |
| Lucide | Sin librería, o con una sin iconos: es el juego más amplio. | `lucide-react` (con el OK), cómo se importa un icono y su tamaño. |
| Heroicons | La persona prefiere un juego más corto. | `@heroicons/react` (con el OK), cómo se importa un icono y su tamaño. |

- **Se escribe en** «Iconos»: el paquete, cómo se pasa un icono a una pieza
  y su tamaño; y, en «Piezas por papel», el botón de icono.

## 7. Las animaciones

**¿Qué animaciones quieres en la app?**

| Opción | Cuándo | Qué se escribe |
|---|---|---|
| Pocas y cortas (recomendada) | Una app de trabajo: una animación corta explica qué ha pasado (un panel que se abre, una fila que se guarda) y lo que se pulsa responde al pasar por encima. | «Movimiento»: lo justo, de 150 a 250 ms. |
| Ninguna | Se quiere la app sin animaciones. | «Movimiento»: nada; los cambios, sin transición. |

- **Con referencias,** la recomendada es la que enseñan.
- **Se escribe en** «Movimiento»: el nivel, sus duraciones y su curva como
  tokens (`--motion-fast`, `--motion-slow`, `--motion-ease`), cómo responde
  lo que se pulsa al pasar por encima y con el foco (su color, su fondo o un
  pequeño desplazamiento), y que con «reducir movimiento» solo queda un
  fundido ([D13](../../../docs/ux-ui/rules.md#d13-movimiento)).
