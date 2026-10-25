---
name: zaius-init
description: La primera tarea del proyecto, mientras el brief no esté aprobado. Escribe con la persona el brief de la web (para qué es y su acción principal, para quién, su tono, quién da el contenido, sus idiomas y legales, sus objetivos y lo que pide al publicar) y su sistema de diseño básico (su identidad, con tres direcciones para elegir, y sus piezas, tokens, anchos desde el móvil, tema, movimiento e iconos), con su guía visual, y para hasta el OK de los dos. Se vuelve a lanzar para cambiar el brief.
disable-model-invocation: true
argument-hint: <de qué va la web, con tus palabras>
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

«Antes de nada», en `AGENTS.md`, no se quita nunca: es lo que lee cada
sesión al empezar, y deja de pedir esta skill cuando el brief está aprobado.

## La idea, primero

El brief sale de lo que cuenta la persona, nunca del nombre del proyecto ni de
su carpeta: «Casa del Roble» puede ser una casa rural, un restaurante o una
tienda, y nada se pregunta dando por hecho lo que será.

- **Lo que ha escrito detrás de `/zaius-init`** es la idea. Si no ha escrito
  nada, pídesela antes de la primera pregunta, con este mensaje, entero, sin
  explicar por qué se pide (nada de «no lo deduzco del nombre»):

   ~~~markdown
   Antes de preguntarte nada, necesito que me cuentes de qué va la web.
   Copia esto, rellena lo que sepas y borra lo que no:

   ```text
   Qué es: <el negocio o el proyecto, en una o dos frases>
   Para qué es la web: <lo que tiene que conseguir: que llamen, que pidan una cita, que lean, que compren>
   Quién la visita: <quién es, qué busca al llegar y si la abre sobre todo desde el móvil>
   Lo que tiene que tener: <las páginas o las cosas que ya sabes que quieres>
   Lo que ya hay: <logo, colores, fotos, textos, una web anterior o una que te guste>
   Lo que no sé: <lo que quieres decidir con la IA>
   ```

   Un ejemplo:

   ```text
   Qué es: un taller de bicicletas de barrio, que también alquila bicis por días.
   Para qué es la web: que pidan cita para una reparación o reserven una bici por WhatsApp.
   Quién la visita: gente del barrio y turistas, casi siempre desde el móvil.
   Lo que tiene que tener: los precios de las reparaciones, las bicis de alquiler y cómo llegar.
   Lo que ya hay: el logo y fotos del taller.
   Lo que no sé: si poner un blog de rutas.
   ```

   Lo que no cuentes, te lo pregunto. Si prefieres contarlo a tu manera, también
   vale: lo importante es qué es, para qué es la web y quién la visita.
   ~~~

  Con un «no sé», que lo cuente a su manera.
- **Va tal cual a «La idea»,** en el brief, con la fecha. Lo que ya dice no se
  vuelve a preguntar; lo que no dice se pregunta, sin suponerlo.

## Pasos

1. **El brief,** a partir de la idea, en tandas de 1 a 3 preguntas, por la web, cada una con la
   opción recomendada primero y «No lo sé», que se queda con la recomendada
   ([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).
   Lo que se va a preguntar se apunta en «Pendiente de preguntar», y cada
   respuesta va a su apartado de `docs/brief.md` en el momento, quitando su
   pregunta: así una sesión nueva sigue desde ahí. Lo que ya dice
   `zaius-dev.json` (si la web recibe mensajes, si lleva blog) no se
   pregunta.
   - **Para qué:** lo que tiene que conseguir la web y su acción principal,
     lo que más importa que haga quien la visita (reservar, escribir,
     llamar), y cómo se notará que funciona (más reservas, menos llamadas
     preguntando lo mismo).
   - **Para quién:** quién la visita (una pareja que busca una escapada,
     una familia), qué busca al llegar y desde dónde la abre (el móvil, el
     ordenador).
   - **Tono:** cómo habla la web (cercana, sobria, divertida), con dos o
     tres palabras que la definen y una frase de ejemplo; de tú, salvo que
     la persona diga otra cosa.
   - **Contenido:** quién escribe los textos («¿Los textos de la web los
     tienes tú, o los propone la IA y tú los revisas?») y cuándo llegan; las
     fotos y el vídeo, de dónde salen (propias, de un fotógrafo, de un banco
     de imágenes con su licencia) y cuándo llegan. Una página no se
     construye con textos inventados.
<!-- kit:if content -->
     Y quién escribe las entradas del blog o las noticias, y cada cuánto.
<!-- kit:end -->
   - **Idiomas y legales:**
<!-- kit:if i18n -->
     los idiomas ya los dijo la instalación: %%LANGUAGES%%; se pregunta quién
     traduce los textos.
<!-- kit:else -->
     en qué idiomas: si es más de uno, se apunta, y cada uno se añade con
     `/zaius-languages` antes de construir páginas.
<!-- kit:end -->
     Y si la web necesita aviso legal, política de privacidad y de cookies
     (con un negocio detrás, casi siempre), quién da sus textos (la persona
     o quien lleve lo legal, nunca la IA) y los datos de la empresa que
     llevan.
   - **Objetivos:** la accesibilidad (si no se pide otra, WCAG 2.2 AA); los
     buscadores, con lo que alguien escribiría para encontrarla («casa rural
     con chimenea en la sierra»); y el rendimiento, lo que tarda en verse lo
     primero en un móvil normal (si no se pide otro, menos de 2,5 segundos).
     Solo lo que la persona sepa: no se inventan cifras.
   - **Al publicar:** el dominio, si ya lo tiene («¿Tenéis una dirección,
     como `casadelroble.es`, para la web?») o hay que comprarlo; dónde se
     publica, si ya lo sabe; y si quiere saber cuánta gente entra y qué
     pulsa (la analítica), que con cookies pide su aviso. Lo pone en marcha
     `/zaius-publish`.
   - **Si hay que entrar con una cuenta:** si es lo principal (usuarios,
     permisos y pantallas de gestión), lo que se construye es una app, otro
     proyecto que se instala con el kit: dilo antes de seguir. Si es una
     parte pequeña (los huéspedes ven sus reservas), se apunta en «Para
<!-- kit:if privateArea -->
     qué»: la web ya tiene su zona privada, y sus páginas las apunta
     `/zaius-backlog`.
<!-- kit:else -->
     qué», y la trae `/zaius-backlog`, con su cambio del kit.
<!-- kit:end -->
<!-- kit:if existing -->

   En un proyecto que ya existe, lo que dice el código (las páginas que
   hay, los idiomas, los textos legales) se lee de él y se confirma, sin
   preguntarlo.
<!-- kit:end -->
2. **El OK del brief:** con todo escrito, «Estado: por aprobar» y
   «Pendiente de preguntar», «Nada pendiente». Enséñalo entero en la pantalla,
   tal como ha quedado escrito en `docs/brief.md`; después, pregunta si lo
   aprueba o qué cambia. Lo que pida se cambia en el brief, y se vuelve a
   enseñar lo que ha cambiado, hasta su sí. Con el OK:
   - el brief, «Estado: aprobado el AAAA-MM-DD», con la fecha del OK;
   - en «Qué es %%APP_NAME%%» de `AGENTS.md`, el «Pendiente: …», cambiado
     por 2 a 4 frases: qué hace la web, para quién y su acción principal;
   - «Dónde estamos», al día: el brief, aprobado, y lo siguiente, el
     sistema de diseño.
3. **El sistema de diseño,** con las preguntas del fichero de al lado:
   antes, las referencias que haya (una web que le guste, capturas, la guía
   de marca, un Figma, una skill de diseño propia); después, cuatro tandas
   cortas: las piezas de las páginas; la identidad, con `zaius-brand`, que
   propone tres direcciones, con su boceto, para elegir una; desde dónde se
   ve y el tema; y cuánto se mueve. Los anchos salen de «Para quién» del
   brief, si ya dice desde dónde se abre. Los tokens y los iconos no se
   preguntan: se deciden con la recomendada y se dicen en una frase.
   Repregunta lo que no quede claro y no inventes valores.
4. **Lo escribe:**
   - `docs/ux-ui/design-system.md` entero, sin la línea «Pendiente de
     definir» ni las notas en cursiva, con los mismos títulos (otros
     documentos enlazan sus anclas). En «Piezas por papel», la pieza de cada
     papel: la de los estilos ya hechos, la de la librería de la empresa,
     leída de sus exports o de su documentación, o la pieza propia que se
     creará en `src/components/` cuando la pida la primera página, con su
     nombre de la nomenclatura.
   - En «Diseño y UX» de `AGENTS.md`, la línea «Sistema de diseño»:
     `- **Sistema de diseño:** <piezas>; tokens en <dónde>.`
   - La identidad elegida, como dice `zaius-brand`: «Identidad», el logo y
     la letra.
   - Con tokens propios, `src/styles/tokens.css` (los colores y la letra de
     la identidad, una escala neutra de grises, los espacios, los radios y el
     movimiento, como variables CSS), importado en
     `src/layouts/BaseLayout.astro`.
   - Con una librería o unos estilos ya hechos, pide el OK para instalarlos
     (es una dependencia nueva); los instala, importa sus estilos en
     `src/layouts/BaseLayout.astro` y lo apunta en «Librería y cómo se
     monta».
<!-- kit:if existing -->
   - Lo que el proyecto ya usa se describe tal cual, sin instalar ni cambiar
     nada sin el OK.
<!-- kit:end -->
5. **La guía visual,** con `zaius-sketch`:
   `docs/ux-ui/mockups/design-system.html`, la documentación del sistema de
   diseño, con su menú lateral: la identidad (su logo, su letra, sus fotos y
   su firma), los fundamentos, el marco de la web (la cabecera con su menú,
   el pie), cada pieza con sus estados y sus normas, y los cambios. En el
   menú del marco, lo principal del brief (Habitaciones, El entorno,
   Contacto), como ejemplo: las páginas las decide `/zaius-backlog`. Enséñasela a la persona en el móvil y en el
   ancho mayor (dónde está y que se abre con doble clic), con lo decidido en
   una tabla corta en la pantalla: la librería, la identidad (su idea y su
   firma), los colores, la letra, los anchos, el tema y las animaciones; y
   ajústala (con ella, `design-system.md` y los tokens) hasta su sí: es lo
   que se aprueba del sistema de diseño. Con el OK, su fecha, en «Bocetos»
   de `design-system.md`, y el boceto de las direcciones, borrado.
<!-- kit:if existing -->
6. **Propón seguir con `zaius-adopt`:** el análisis del código, los
   `.kit-new`, las páginas que ya funcionan y el plan para traer el
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
   - resume a la persona, en unas líneas y con palabras de la web, lo que ha
     quedado decidido: qué hace la web, para quién y cómo se verá;
<!-- kit:if !existing -->
   - dice el siguiente paso, con la orden lista para copiar:
     `/zaius-backlog` (en opencode, «usa la skill zaius-backlog»), que
     decide las páginas y el mapa del sitio, y para: no apunta páginas ni
     monta nada.
<!-- kit:else -->
   - dice el siguiente paso, el primer bloque del plan, y para hasta su OK.
     Las páginas nuevas, después, con `/zaius-backlog`.
<!-- kit:end -->

## Cambiar el brief

Con el brief aprobado y el sistema de diseño escrito, el brief se cambia
así:

1. **Qué cambia,** con palabras de la web, en tandas de 1 a 3 preguntas.
2. **Qué páginas toca:** las del backlog que cambian, sobran o faltan, con
   su estado. Una «hecha» que cambia lo hace después con
   `/zaius-page <NOMBRE>`.
3. **Para y espera el OK,** con el cambio y lo que toca. Mientras, el brief
   dice «Estado: por aprobar».
4. **Con el OK:** el brief, «Estado: aprobado el AAAA-MM-DD», con la fecha
   nueva; «Qué es %%APP_NAME%%», en `AGENTS.md`, si cambia; y «Dónde
   estamos», con las páginas que toca y lo siguiente, `/zaius-backlog`, que
   lanza la persona. Esta skill no cambia el backlog.

## Comprobación

- [ ] «La idea», en el brief, con las palabras de la persona; ninguna
      pregunta que diera por hecho lo que no había dicho.
- [ ] El brief, con cada apartado escrito, «Nada pendiente» en «Pendiente de
      preguntar» y «Estado: aprobado el AAAA-MM-DD».
- [ ] «Qué es %%APP_NAME%%», en `AGENTS.md`, sin «Pendiente».
- [ ] «Antes de nada», en `AGENTS.md`, sin tocar.
- [ ] `design-system.md`, sin «Pendiente de definir», con su «Identidad» y
      una pieza en cada fila de «Piezas por papel»; su línea en `AGENTS.md`,
      escrita.
- [ ] El logo y la letra, donde dice la pregunta de la identidad.
- [ ] La guía visual, `docs/ux-ui/mockups/design-system.html`, desde el
      móvil y aprobada por la persona, con su fecha.
- [ ] Los tokens propios o los estilos ya hechos, instalados con el OK,
      importados en `BaseLayout.astro`.
<!-- kit:if !existing -->
- [ ] Tipos, lint y tests, en verde.
<!-- kit:end -->
- [ ] Ninguna página apuntada: eso es el backlog.
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la web, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el brief escrito: la persona lo aprueba antes del sistema de diseño.
- Con el boceto de las direcciones: la persona elige su identidad.
- Con la guía visual hecha: la persona la aprueba antes de cerrar.
- Antes de instalar una librería, unos estilos, un paquete de iconos o una
  tipografía: son dependencias nuevas.
- Si la persona no sabe una respuesta: propón la recomendada y espera su sí;
  si prefiere dejarla, su apartado dice «Pendiente» y lo que falta para
  decidirlo.
- Si lo principal es entrar con una cuenta: dilo antes de seguir; es una app.
- Al cambiar el brief: con las páginas que toca, antes de escribirlo.
- Al terminar: la skill solo escribe el brief y el sistema de diseño. No
  apunta páginas ni monta nada (ni una página, ni el marco): eso llega con
  `/zaius-backlog` y `/zaius-page`.
<!-- kit:if existing -->
- Antes de mover código: cada bloque del plan lleva su OK.
<!-- kit:end -->
