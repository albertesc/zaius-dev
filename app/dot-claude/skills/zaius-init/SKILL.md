---
name: zaius-init
description: La primera tarea del proyecto, mientras el brief no esté aprobado. Escribe con la persona el brief de la app (para qué es, quién la usa, qué entra y qué no, sus decisiones caras y sus requisitos no funcionales) y su sistema de diseño básico (su identidad, con tres direcciones para elegir, y su librería, tokens, anchos, tema e iconos), con su guía visual, y para hasta el OK de los dos. Se vuelve a lanzar para cambiar el brief.
disable-model-invocation: true
argument-hint: <de qué va la app, con tus palabras>
---

# Iniciar el proyecto

## Lee primero

- [AGENTS.md](../../../AGENTS.md), entero, y `zaius-dev.json`, en la raíz,
  con las respuestas de la instalación.
- [Cómo se trabaja con la IA](../../../docs/process.md): la persona decide,
  hablar con la persona y empezar de cero.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).
- [El brief](../../../docs/brief.md): su estado, sus apartados y lo que siga
  en «Pendiente de preguntar».
- [Sistema de diseño](../../../docs/ux-ui/design-system.md) y
  [normas](../../../docs/ux-ui/rules.md), que nombran cada pieza por su papel.
- [Las preguntas del sistema de diseño](./design-system-questions.md):
  cada una con sus opciones, la recomendada y lo que se escribe.
- [Bocetos](../../../docs/ux-ui/README.md#bocetos): la guía visual que la
  persona aprueba.

## Antes de empezar

Dónde está, por la cabecera del brief y el sistema de diseño:

- **«Estado: pendiente»:** se empieza por [la idea](#la-idea-primero).
- **«Estado: por aprobar»,** o con algo ya escrito en el brief: se sigue
  donde se quedó, con lo que digan «Dónde estamos» y «Pendiente de
  preguntar».
- **«Estado: aprobado», con el sistema de diseño aún «Pendiente de
  definir»:** se sigue por el paso 3.
- **«Estado: aprobado», con el sistema de diseño escrito:** es un cambio del
  brief, [Cambiar el brief](#cambiar-el-brief). Un cambio del sistema de
  diseño va con `zaius-design`.

## La idea, primero

El brief sale de lo que cuenta la persona, nunca del nombre del proyecto ni de
su carpeta: «Pedidos del Sur» puede ser la app de un almacén, de un
restaurante o de una tienda, y nada se pregunta dando por hecho lo que será.

- **Lo que ha escrito detrás de `/zaius-init`** es la idea. Si no ha escrito
  nada, pídesela antes de la primera pregunta, con este mensaje, entero, sin
  explicar por qué se pide (nada de «no lo deduzco del nombre»):

   ~~~markdown
   Antes de preguntarte nada, necesito que me cuentes de qué va la app.
   Copia esto, rellena lo que sepas y borra lo que no:

   ```text
   Qué es: <la empresa o el proyecto, y el problema que resuelve la app>
   Quién la usa: <cada tipo de persona y lo que hace con ella>
   Lo que tiene que hacer: <lo primero que tiene que poder hacerse con ella>
   Sus datos: <de dónde salen hoy y qué tiene que guardar la app>
   Lo que ya hay: <logo, colores, la herramienta o la hoja de cálculo que se usa hoy>
   Lo que no sé: <lo que quieres decidir con la IA>
   ```

   Un ejemplo:

   ```text
   Qué es: una cooperativa de huertos que reparte cestas de verdura cada semana.
   Quién la usa: quien prepara las cestas y quien las reparte.
   Lo que tiene que hacer: ver las cestas de la semana y marcar las entregadas.
   Sus datos: hoy están en una hoja de cálculo.
   Lo que ya hay: el logo.
   Lo que no sé: si quien reparte la usará sin conexión.
   ```

   Lo que no cuentes, te lo pregunto. Si prefieres contarlo a tu manera, también
   vale: lo importante es qué es, quién la usa y qué tiene que hacer.
   ~~~

  Con un «no sé», que lo cuente a su manera.
- **Va tal cual a «La idea»,** en el brief, con la fecha. Lo que ya dice no se
  vuelve a preguntar; lo que no dice se pregunta, sin suponerlo.

## Pasos

1. **El brief,** a partir de la idea, en tandas de 1 a 3 preguntas, por la app, cada una con la
   opción recomendada primero y «No lo sé», que se queda con la recomendada
   ([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).
   Lo que se va a preguntar se apunta en «Pendiente de preguntar», y cada
   respuesta va a su apartado de `docs/brief.md` en el momento, quitando su
   pregunta: así una sesión nueva sigue desde ahí. Lo que ya dice
   `zaius-dev.json` no se pregunta.
   - **Para qué:** el problema que resuelve y qué cambia cuando existe.
   - **Quién la usa:** cada tipo de persona, lo que hace con ella y cuántas
     son, más o menos (quien prepara los pedidos, quien los factura, quien
     administra la app).
   - **Entra** y **No entra:** lo que hará la primera versión, en una lista
     corta, y lo que se deja fuera a propósito, con su motivo.
   - **Decisiones caras,** las que cuestan mucho de cambiar después. Se
     preguntan, no se diseñan: se escribe la respuesta, con su fecha, y lo
     que supone, no cómo se hará.
<!-- kit:if backend -->
     - Varias organizaciones: «¿La usarán varias empresas, cada una con sus
       datos y sin ver los de las otras?».
     - Roles y permisos: «¿Todos pueden hacer lo mismo, o hay quien solo
       mira?», y si hay que entrar con usuario y contraseña.
<!-- kit:else -->
     - Qué guarda y dónde, porque la app no tiene API: «Lo que se crea en la
       app, ¿tiene que guardarse? ¿Basta con este dispositivo?». Las
       opciones: nada se guarda (los datos son fijos, en `constants/`); en
       este navegador (una persona y un dispositivo, y se pierde si se
       borran los datos del navegador); o entre varios dispositivos o
       personas, que pide una API. Lo decidido lo monta la primera historia
       que guarda algo, con el OK.
     - Cuentas: entrar con usuario y contraseña, o que varias personas vean
       los mismos datos, pide una API. Si hace falta, dilo antes de seguir:
       se añade con `%%KIT_RUN%% change`, con Sí a «¿La app saca sus datos de
       una API?».
<!-- kit:end -->
     - Sin conexión: «¿Se usará donde no hay internet, como en un almacén?».
     - Varios idiomas o monedas: «¿Se cobra en más de una moneda?».
<!-- kit:if i18n -->
       Los idiomas ya los dijo la instalación: %%LANGUAGES%%.
<!-- kit:else -->
       Y en qué idiomas: si es más de uno, se apunta, y cada uno se añade con
       `/zaius-languages` antes de construir pantallas.
<!-- kit:end -->
<!-- kit:if backend -->
   - **Requisitos no funcionales:** los dispositivos (dónde se usa y con
     qué ancho), la accesibilidad (si no se pide otra, WCAG 2.2 AA), el
     rendimiento (cuánto puede tardar una pantalla y cuántos datos maneja) y
     la sesión (cómo se entra, cuánto dura y qué pasa cuando caduca). Solo lo
     que la persona sepa: no se inventan cifras.
<!-- kit:else -->
   - **Requisitos no funcionales:** los dispositivos (dónde se usa y con
     qué ancho), la accesibilidad (si no se pide otra, WCAG 2.2 AA) y el
     rendimiento (cuánto puede tardar una pantalla y cuántos datos maneja).
     Solo lo que la persona sepa: no se inventan cifras.
<!-- kit:end -->
<!-- kit:if existing -->

   En un proyecto que ya existe, lo que dice el código (las pantallas que
   hay, si se entra con usuario) se lee de él y se confirma, sin
   preguntarlo.
<!-- kit:end -->
2. **El OK del brief:** con todo escrito, «Estado: por aprobar» y
   «Pendiente de preguntar», «Nada pendiente». Enséñalo entero en la pantalla,
   tal como ha quedado escrito en `docs/brief.md`, y debajo, en una línea
   por decisión cara, lo que supone; después, pregunta si lo aprueba o qué
   cambia. Lo que pida se cambia en el brief, y se vuelve a enseñar lo que ha
   cambiado, hasta su sí. Con el OK:
   - el brief, «Estado: aprobado el AAAA-MM-DD», con la fecha del OK;
   - en «Qué es %%APP_NAME%%» de `AGENTS.md`, el «Pendiente: …», cambiado
     por 2 a 4 frases: qué hace y para quién;
   - «Dónde estamos», al día: el brief, aprobado, y lo siguiente, el
     sistema de diseño.
3. **El sistema de diseño,** con las preguntas del fichero de al lado:
   antes, las referencias que haya (una web, capturas, la guía de marca, un
   Figma, una skill de diseño propia); después, cuatro tandas cortas: las
   piezas de las pantallas; la identidad, con `zaius-brand`, que propone
   tres direcciones, con su boceto, para elegir una; dónde se usa y el modo
   oscuro; y cuánto se mueve. Los anchos salen de los dispositivos del
   brief, si ya los dice. Los tokens y los iconos no se preguntan: se
   deciden con la recomendada y se dicen en una frase. Repregunta lo que no
   quede claro y no inventes valores.
4. **Lo escribe:**
   - `docs/ux-ui/design-system.md` entero, sin la línea «Pendiente de
     definir» ni las notas en cursiva, con los mismos títulos (otros
     documentos enlazan sus anclas). En «Piezas por papel», la pieza de cada
     papel: el componente de la librería del mercado, que conoces; el de la
     propia, leído de sus exports o de su documentación; sin librería, la
     pieza que se creará en `src/components/` cuando la pida la primera
     historia, con su nombre de la nomenclatura.
   - En «Diseño y UX» de `AGENTS.md`, la línea «Sistema de diseño»:
     `- **Sistema de diseño:** <librería>; tokens en <dónde>.`
   - La identidad elegida, como dice `zaius-brand`: «Identidad», el logo y
     la letra.
   - Con tokens propios, `src/styles/tokens.css` (los colores y la letra de
     la identidad, una escala neutra de grises, los espacios y los radios,
     como variables CSS), importado en `src/main.tsx`.
   - Con librería, pide el OK para instalarla (es una dependencia nueva); la
     instala, monta sus proveedores y sus estilos en `src/main.tsx` y en
     `src/tests/testUtils.tsx` (`renderWithProviders` y `renderPage`), y lo
     apunta en «Librería y cómo se monta».
<!-- kit:if existing -->
   - Lo que el proyecto ya usa se describe tal cual, sin instalar ni cambiar
     nada sin el OK.
<!-- kit:end -->
5. **La guía visual,** con `zaius-sketch`:
   `docs/ux-ui/mockups/design-system.html`, la documentación del sistema de
   diseño, con su menú lateral: la identidad (su logo, su letra y su firma),
   los fundamentos, el marco de la app (con lo principal del brief en su
   menú: Pedidos, Facturas…), cada pieza con sus estados y sus normas, y los
   cambios. Enséñasela a la persona (dónde está y que se
   abre con doble clic) y, en la pantalla, lo decidido en una tabla corta: la
   librería, la identidad (su idea y su firma), los colores, la letra, los
   anchos, el tema y las animaciones; y ajústala (con ella, `design-system.md`
   y los tokens) hasta su sí: es lo que se aprueba del sistema de diseño.
   Con el OK, su fecha, en «Bocetos» de `design-system.md`, y el boceto de
   las direcciones, borrado.
<!-- kit:if existing -->
6. **Propón seguir con `zaius-adopt`:** el análisis del código, los
   `.kit-new`, las historias que ya funcionan y el plan para traer el
   proyecto, por bloques. Con el OK, síguelo hasta el plan.
7. **Cierra:**
<!-- kit:else -->
6. **Cierra:**
<!-- kit:end -->
<!-- kit:if !existing -->
   - pasa `%%PM%% run typecheck`, `%%PM%% run lint` y `%%PM%% run test`, en
     verde (en Windows, desde PowerShell);
<!-- kit:end -->
   - pone al día «Dónde estamos»;
   - resume a la persona, en unas líneas y con palabras de la app, lo que ha
     quedado decidido: qué hace la app, para quién y cómo se verá;
<!-- kit:if !existing -->
   - dice el siguiente paso, con la orden lista para copiar:
     `/zaius-backlog` (en opencode, «usa la skill zaius-backlog»), y para:
     no escribe historias ni monta nada.
<!-- kit:else -->
   - dice el siguiente paso, el primer bloque del plan, y para hasta su OK.
     Las historias nuevas, después, con `/zaius-backlog`.
<!-- kit:end -->

## Cambiar el brief

Con el brief aprobado y el sistema de diseño escrito, el brief se cambia
así:

1. **Qué cambia,** con palabras de la app, en tandas de 1 a 3 preguntas.
2. **Qué historias toca:** las del backlog que cambian, sobran o faltan, con
   su estado. Si toca una «hecha», lo que cambia es otra historia.
3. **Para y espera el OK,** con el cambio y lo que toca. Mientras, el brief
   dice «Estado: por aprobar».
4. **Con el OK:** el brief, «Estado: aprobado el AAAA-MM-DD», con la fecha
   nueva; «Qué es %%APP_NAME%%», en `AGENTS.md`, si cambia; y «Dónde
   estamos», con las historias que toca y lo siguiente, `/zaius-backlog`,
   que lanza la persona. Esta skill no cambia el backlog.

## Comprobación

- [ ] «La idea», en el brief, con las palabras de la persona; ninguna
      pregunta que diera por hecho lo que no había dicho.
- [ ] El brief, con cada apartado escrito, «Nada pendiente» en «Pendiente de
      preguntar» y «Estado: aprobado el AAAA-MM-DD».
- [ ] «Qué es %%APP_NAME%%», en `AGENTS.md`, sin «Pendiente».
- [ ] `design-system.md`, sin «Pendiente de definir», con su «Identidad» y
      una pieza en cada fila de «Piezas por papel»; su línea en `AGENTS.md`,
      escrita.
- [ ] El logo y la letra, donde dice la pregunta de la identidad.
- [ ] La guía visual, `docs/ux-ui/mockups/design-system.html`, aprobada por
      la persona, con su fecha.
- [ ] Los tokens propios, importados en `main.tsx`; la librería, instalada
      con el OK y montada en `main.tsx` y en `testUtils`.
<!-- kit:if !existing -->
- [ ] Tipos, lint y tests, en verde.
<!-- kit:end -->
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el brief escrito: la persona lo aprueba antes del sistema de diseño.
- Con el boceto de las direcciones: la persona elige su identidad.
- Con la guía visual hecha: la persona la aprueba antes de cerrar.
- Antes de instalar la librería, un paquete de iconos o una tipografía: son
  dependencias nuevas.
- Si la persona no sabe una respuesta: propón la recomendada y espera su sí;
  si prefiere dejarla, su apartado dice «Pendiente» y lo que falta para
  decidirlo.
- Al cambiar el brief: con las historias que toca, antes de escribirlo.
- Al terminar: la skill solo escribe el brief y el sistema de diseño. No
  escribe historias ni monta nada (ni una pantalla, ni el marco, ni la
  sesión): eso llega con `/zaius-backlog` y `/zaius-spec`.
<!-- kit:if existing -->
- Antes de mover código: cada bloque del plan lleva su OK.
<!-- kit:end -->
