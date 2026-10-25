---
name: zaius-brand
description: Propone la identidad de la %%KIND%% en tres direcciones distintas, cada una con su idea, su logo, sus colores, su letra, sus fotos y lo que la hace reconocible, con un boceto para compararlas, y escribe la elegida en el sistema de diseño. La lanza zaius-init al definir el sistema de diseño; después, se lanza para cambiar la identidad, como una propuesta de diseño.
---

# Proponer la identidad

Que %%APP_NAME%% no se parezca a cualquier otra %%KIND%%: la identidad sale
de lo que es (su sitio, su gente, sus cosas), no de cómo suelen ser las de
su sector.

## Lee primero

- [El brief](../../../docs/brief.md): para qué es, para quién, su tono y de
  dónde salen las fotos.
- [Sistema de diseño](../../../docs/ux-ui/design-system.md): «Identidad» y
  «Tokens», si ya están escritos, y la librería, si la hay.
- Las referencias de `docs/ux-ui/references/`: la guía de marca, el logo,
  las fotos de la persona y lo que le gusta.
- Su skill de diseño, si la tiene (la nombra «Identidad»; si la pasa ahora,
  se añade como dice
  [Una skill de diseño propia](../../../docs/ux-ui/README.md#una-skill-de-diseño-propia)):
  manda en lo que fija.
- [La pregunta de la identidad](../zaius-init/design-system-questions.md#3-la-identidad):
  qué enseña el boceto en esta %%KIND%% y qué se escribe.
- [zaius-sketch](../zaius-sketch/SKILL.md): la plantilla y
  [las fotos de muestra](../zaius-sketch/SKILL.md#fotos-de-muestra).

## Antes de empezar

- **Con el sistema de diseño «Pendiente de definir»:** la lanza
  `zaius-init`, en el paso del sistema de diseño, y al terminar se vuelve a
  él.
- **Con el sistema de diseño escrito:** una identidad nueva lo cambia. Los
  pasos son los mismos, y lo elegido va como propuesta (`zaius-design`), con
  el boceto de las direcciones como su boceto; se escribe al aceptarla. Un
  `design-system.md` sin «Identidad» la recibe entonces, antes de «Librería
  y cómo se monta».

## Pasos

1. **Lo que ya hay y lo que falta.** La marca que tenga la persona (el
   logo, los colores, la letra, en las referencias, en la guía de marca o en
   su skill de diseño) se respeta: las direcciones cambian lo demás. En una tanda, lo que el brief
   no diga:
   - cómo es su mundo de verdad, en dos o tres preguntas con un ejemplo
     cada una: de qué está hecho, qué se ve desde él, qué recuerda quien lo
     usa o lo visita y qué lo hace distinto de los demás. Sin eso, las
     direcciones se inventan;
   - las fotos: «¿Tienes ya fotos de <lo de la %%KIND%%>? Si las dejas en
     `docs/ux-ui/references/`, los bocetos van con ellas; si no, con fotos
     de muestra, que se cambian por las tuyas».
2. **De qué está hecho su mundo,** sacado del brief, en una lista corta para
   ti: el sitio, los materiales, los objetos, la gente, la luz y las
   palabras de su oficio (de una casa rural: la piedra, el roble, la piscina
   en verano, el humo de la barbacoa, los letreros pintados de la comarca).
   De ahí salen las decisiones, no de «una %%KIND%% de <sector>»; lo que no
   está en el brief ni en las respuestas no se supone.
3. **Tres direcciones, distintas entre sí,** cada una con:
   - **su nombre,** de dos o tres palabras, y **su idea,** en una frase que
     se apoya en el brief;
   - **sus colores:** de 4 a 6, con nombre y valor, uno que domina y un
     acento; cada pareja de texto y fondo, con su contraste (4,5:1 el texto,
     3:1 lo que se pulsa); si la marca no llega, un tono más oscuro para los
     botones;
   - **su letra:** una o dos familias de Google Fonts (libres), cada una con
     su papel, y su escala de tamaños; si son dos, bien distintas;
   - **su logo:** el símbolo, en SVG, dibujado con formas simples a partir
     de algo concreto de su mundo (una hoja, una inicial, una silueta), que
     se lee a 24 px y en un solo color; y el nombre, con la letra de los
     títulos, en texto al lado;
   - **sus fotos:** qué enseñan y cómo (el encuadre, la luz, el
     tratamiento), con dos a cuatro de la persona o de muestra;
   - **su firma:** lo único que se recordará (una foto enorme cortada por una
     forma, los títulos muy grandes, una textura dibujada, una línea que
     recorre la página). Solo una; lo demás, tranquilo y ordenado;
   - **cómo se compone:** en una frase, dónde va el peso, cómo se alinea y
     qué ritmo llevan las secciones.

   La recomendada es la que mejor encaja con el tono y con quien la usa;
   di por qué en una frase.
4. **Repásalas con [Que no salga genérico](#que-no-salga-genérico)** antes
   de dibujarlas: lo que podría ser de cualquier otra %%KIND%% parecida se
   cambia. Apunta para ti qué has cambiado y por qué.
5. **El boceto de las direcciones,** con `zaius-sketch`:
   `docs/ux-ui/mockups/identity.html`, con una dirección por estado (su
   nombre, en `data-label`), sus tokens en `:root[data-state='<dirección>']`
   y lo que dice la pregunta de la identidad para esta %%KIND%%, con los
   textos que saldrían del brief (su acción principal, su tono): el backlog
   todavía no existe. Míralo como dice `zaius-sketch`, en el móvil y en el
   ordenador, con el logo a 16, 24 y 64 px, y corrige lo que no se distinga
   de una plantilla.
6. **Para y pide que elija.** En la pantalla, una tabla corta: cada
   dirección con su idea, sus colores (por su nombre: los valores van en el
   boceto), su letra y su firma; debajo, dónde está el boceto y que se abre
   con doble clic. Las opciones: las tres, con la recomendada primero;
   «Mezclar», que dice qué toma de cada una; «Ninguna», que dice lo que no
   le encaja, y salen tres nuevas; y «No lo sé», que se queda con la
   recomendada. Se ajusta en el mismo boceto hasta su sí.
7. **Lo escribe,** con el OK (con el sistema de diseño ya escrito, al
   aceptar la propuesta):
   - «Identidad», en `design-system.md`: la idea, el logo (dónde está y, si
     es de la IA, «provisional» hasta que la persona lo da por bueno o pasa
     el suyo), los colores y su papel, la letra y cómo se carga, las fotos
     (qué enseñan, cómo, y si son suyas o de muestra), la firma, cómo se
     compone y «Lo que no», lo genérico que esta %%KIND%% evita;
   - los colores y la letra, en «Tokens» y en los tokens del proyecto, con
     su contraste, y lo que en el resto de `design-system.md` los nombre (el
     tema, las piezas, lo que falta);
   - el símbolo del logo, en el fichero que dice la pregunta de la
     identidad, que la cabecera usa cuando la pide la primera %%UNIT%%;
   - la letra, como dice la pregunta de la identidad: desde la propia
     %%KIND%%, nunca desde los servidores de Google (en Europa, sin el
     consentimiento de quien visita, no se puede);
   - los bocetos de las %%UNITS%% que no están hechas, con la identidad
     nueva, o apuntados en «Dónde estamos» para ponerlos al día;
   - «Dónde estamos», al día.

   El boceto de las direcciones se borra cuando se aprueba la guía visual:
   desde entonces, manda ella.

## Que no salga genérico

- **Sale de su mundo, no de su sector:** los colores, las formas y las fotos
  vienen de la lista del paso 2.
- **La letra lleva la personalidad:** elegida para esta marca, nunca la de
  siempre (Inter, Roboto, Arial, Open Sans, Montserrat, Poppins o la del
  sistema) por no decidir. Los títulos son parte del diseño, por su tamaño,
  su peso y su espacio, no solo texto más grande.
- **Un color manda,** con un acento; no cinco a partes iguales.
- **Una sola firma,** con un referente claro: una forma que no se reconoce
  (una mancha, una nube, un borde ondulado) se lee como adorno de
  plantilla. Lo memorable va en un sitio; antes de darlo por bueno, quita un
  adorno.
- **Fotos de verdad,** o de muestra que podrían serlo, con un mismo
  tratamiento; nunca un hueco gris.
- **Nada de «Lo que no se hace»,** de las
  [normas de diseño](../../../docs/ux-ui/rules.md): ni un borde de color a la
  izquierda ni lo que delata un diseño hecho por IA, salvo que la persona lo
  pida.
- **La jerarquía, los espacios y las columnas,** como dice su norma: lo que
  más importa, primero y más grande; lo que va junto, cerca, y lo que no,
  separado; y una rejilla para toda la %%KIND%%, con la cabecera y el pie
  alineados con el contenido.
- **Lo de siempre, sin decirlo:** desde el móvil, el foco visible, «reducir
  movimiento» y el contraste de las normas.
- **Los textos, de la %%KIND%%:** concretos y con las palabras del brief, no
  de anuncio.

Parte de esta lista y de «Lo que no se hace» sale de la skill
`frontend-design` de Anthropic
([anthropics/skills](https://github.com/anthropics/skills), Apache 2.0).

## Comprobación

- [ ] Tres direcciones distintas entre sí, cada una con su idea, sus
      colores, su letra, su logo, sus fotos, su firma y cómo se compone.
- [ ] Ninguna cae en «Que no salga genérico» ni en «Lo que no se hace», salvo
      que lo pida la persona.
- [ ] La marca que ya había, respetada en las tres.
- [ ] Las fotos, de la persona o de muestra comprobadas; ninguna dirección
      de una foto, inventada.
- [ ] El contraste de cada pareja de texto y fondo.
- [ ] Con el OK: «Identidad», los tokens, el logo y la letra, escritos.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el boceto de las direcciones: la persona elige, mezcla o pide otras.
- El logo de la IA es provisional: se dice, y la persona lo da por bueno o
  pasa el suyo.
- Antes de instalar un paquete para la letra: es una dependencia nueva.
