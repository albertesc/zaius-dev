# Changelog

## Sin publicar

- El kit, con dos caminos: webs (Astro) y apps (React + Vite). Lo que deja en
  un proyecto está en `AGENTS.md`; el plan, por bloques, en `next-steps.md`.
- El instalador (`bin/`, `cli/`): la primera pregunta es el
  tipo, web o app, y el stack va con él; las respuestas de una web (`server`,
  `content` y, con `change`, `privateArea`) y las de una app (`api`, `mocks`);
  la plantilla en `shared/`, `web/` y `app/`, con su `package.fragment.json`
  cada una. Los tests no se preguntan: todo proyecto los lleva. Un cambio de
  respuestas
  que no cambia ningún fichero también se apunta en `zaius-dev.json`.
- Lo común de la plantilla (`shared/`): `docs/process.md`, con cómo se trabaja
  con la IA (el flujo, quién decide, iterar, empezar de cero y los estados de
  una unidad); las semillas de `docs/next-steps.md` y `docs/ux-ui/README.md`;
  y las skills `zaius-build` (la pareja, test a test), `zaius-review` (que
  también cierra, sin `zaius-close`), `zaius-refactor`, `zaius-sketch`,
  `zaius-design`, `zaius-rename`, `zaius-merge` y `zaius-adopt`. Valores nuevos
  para lo que cambia según el tipo: `%%KIND%%`, `%%UNIT%%`, `%%UNITS%%`,
  `%%UNIT_EXAMPLE%%`, `%%UNIT_DOCS%%` y `%%SPEC_SKILL%%`.
- El camino Apps (`app/`): el código base de React, su configuración y sus
  documentos, con las historias de usuario como unidad de trabajo; las
  semillas `docs/brief.md` y `docs/backlog.md`; y las skills `zaius-init`,
  `zaius-backlog` y `zaius-spec` (nuevas), `zaius-publish`, `zaius-service`,
  `zaius-form`, `zaius-permissions`, `zaius-languages` y `zaius-api`. Las
  historias se nombran `XXX999` (las tres letras de su épica), y su fichero va
  en `docs/specs/`.
- El camino Webs (`web/`): el código base de Astro, su configuración y sus
  documentos, con la página como unidad de trabajo y Casa del Roble de
  ejemplo; las semillas `docs/brief.md`, `docs/backlog.md` (con el mapa del
  sitio) y `docs/pages/`; y las skills `zaius-init`, `zaius-backlog` y
  `zaius-page` (nuevas), `zaius-publish`, `zaius-form`, `zaius-service`,
  `zaius-permissions` y `zaius-languages`. Las páginas se nombran por su
  prefijo en mayúsculas (`HOME`, `LEGAL-NOTICE`).
- Una web pide con `change`, cuando hacen falta, la API (`backend`), la zona
  privada (`privateArea`, que trae el servidor y la API) y la plataforma en la
  que se publica (`platform`: Node, Vercel, Netlify o Cloudflare), que cambia
  su adaptador sin `.kit-new`.
- Una condición de `templateFiles.json` que empieza por su carpeta
  (`web/docs/guides/create-a-form.md`) solo cuenta en ella. zod solo llega
  donde se usa, y el `.gitignore`, solo a los proyectos nuevos.
- `npm run verify` (`scripts/verifyKit.mjs`): instala desde el paquete de
  `npm pack` cada combinación de las apps y de las webs (también un proyecto
  existente de cada tipo, una web que crece con `change` y cada plataforma),
  pasa tipos, lint, tests, build y los tests del código base, y busca lo que
  queda sin resolver, los enlaces rotos y lo que habla de una pieza que no se
  ha pedido; `--docs`, solo los ficheros. El README del kit, `CLAUDE.md` y la
  skill `contribute-to-kit`.
- Lo que se aprueba se enseña en la pantalla antes de pedir el OK, nunca solo
  «está en el fichero»: el brief y el backlog, enteros; de una especificación,
  lo que decide (los criterios o las secciones, lo que queda fuera y la lista
  de tests); las propuestas de refactor y de diseño, enteras; y del sistema de
  diseño, una tabla con lo decidido junto a la guía visual
  (`docs/process.md`, «Hablar con la persona», y `zaius-init`,
  `zaius-backlog`, `zaius-spec`, `zaius-page`, `zaius-refactor` y
  `zaius-design`). Visto en la prueba de principio a fin: el brief no salía
  en la pantalla.
- La barra de los bocetos, nueva (`mockup.html` de `zaius-sketch`, en los dos
  caminos): con los colores, la letra y las esquinas del sistema de diseño
  (`--bar-…`), y botones de opciones en lugar de desplegables. En «Ordenador», el boceto ocupa la ventana entera, sin fondo
  alrededor; en «Tableta» (nueva en los dos) y «Móvil», va en un marco sobre
  un fondo. En un móvil, las opciones se desplazan en una fila. El nombre de
  cada estado va en una o dos palabras (`zaius-sketch`,
  `docs/ux-ui/README.md`). Visto en la
  prueba: la barra era oscura, con desplegables, y el fondo salía siempre.
- El backlog de una web se escribe para que se entienda sin saber programar:
  un apartado por página, con su nombre y su título, su para qué, su
  dirección web, lo que enseña, con palabras de la web («sus textos», «los
  datos de …», «las entradas de …», «un formulario», «lo que da …»), y su
  estado. Antes era una línea con «Datos: constants/» (`web/docs/backlog.md`,
  `zaius-backlog`, `zaius-page` y `docs/naming.md`). En los dos caminos, el
  backlog que se aprueba se enseña copiado del fichero, sin «Cómo se
  escribe», y si hace falta un «cómo leerlo», le falta algo al backlog. Un
  backlog «por aprobar» se retoma desde el OK al volver a lanzar
  `/zaius-backlog`. En `docs/process.md`: «Lo que se aprueba se escribe para
  la persona». `docs/backlog.md` es una semilla: en un proyecto ya instalado,
  su «Cómo se escribe» se copia a mano. Visto en la prueba: el backlog salía
  en líneas con códigos y carpetas, con un «cómo leerlo» debajo.
- El «Para qué» de cada página de una web es su historia: «Como <quién>,
  quiero <qué>, para <para qué>.», con quien la visita según el brief. Va en
  el backlog y en el fichero de la página, que añade su llamada a la acción.
  Una página no se parte en historias: se entrega entera
  (`web/docs/backlog.md`, `docs/pages/README.md`, `zaius-backlog`,
  `zaius-page`, `AGENTS.md` y `README.md`). Visto en la prueba: se esperaba
  el backlog como una lista de historias de usuario.
- La identidad, con `zaius-brand` (nueva, en los dos caminos): tres
  direcciones distintas, cada una con su idea, su logo (un símbolo en SVG),
  sus colores, su letra de Google Fonts, sus fotos, su firma y cómo se
  compone, en un boceto (`mockups/identity.html`) para elegir una, mezclarlas
  o pedir otras. Con «Que no salga genérico», lo que delata un diseño hecho
  por IA (en parte, de la skill `frontend-design` de Anthropic). En
  `zaius-init`, la pregunta de la identidad sustituye a las del color y la
  letra, y `design-system.md` tiene «Identidad». La letra se sirve desde el
  propio proyecto: en una web, con las tipografías de Astro; en una app, con
  Fontsource. Con el sistema de diseño ya escrito, una identidad nueva va
  como propuesta. Visto en la prueba: los diseños salían simples, con la
  letra del sistema, sin logo y con las fotos en gris.
- Los bocetos, como serán de verdad: con el logo, la letra y la firma de la
  identidad, y con fotos, las de la persona o de muestra de Unsplash, cada
  una comprobada y apuntada («Fotos de muestra», en `zaius-sketch`); antes de
  enseñarlo, se mira en una captura. Sin conexión se siguen viendo
  ordenados. Sin niveles (baja, media y alta): ni en la barra, ni en
  «Bocetos» del sistema de diseño, ni en las preguntas de `zaius-init`.
  Pedido en la prueba.
- La guía visual, como la documentación del sistema de diseño
  (`zaius-sketch/guide.html`, nueva plantilla en los dos caminos): un menú
  lateral por grupos, que marca la sección en la que se está y en el móvil
  va en su botón; la identidad (la idea, el logo, los colores, la letra y
  las fotos), los fundamentos, el marco y cada pieza, con sus estados a la
  vista, cuándo se usa, sus normas y su nombre en el código; una frase por
  norma; y «Cambios», con cada cambio aceptado. Un cambio del sistema de
  diseño toca solo su sección (`zaius-sketch`, `zaius-init`, `zaius-design`,
  `docs/ux-ui/README.md`). Pedido en la prueba: una guía bonita, con normas
  y documentación, que se pueda iterar.
- Dos normas de diseño nuevas, en los dos caminos (`rules.md` y su frase en
  `AGENTS.md`). «Jerarquía, espacios y columnas» (D15 en una web, D14 en
  una app): lo que más importa, primero y más grande, con pocos niveles bien
  distintos; lo que va junto, cerca, y lo que no, separado, con el mismo
  token para la misma relación; una rejilla para toda la página, con la
  cabecera y el pie alineados con el contenido y el pie en columnas. «Lo que
  no se hace» (D16 y D15): salvo que la persona lo pida, ni un borde de
  color a la izquierda ni lo que delata un diseño hecho por IA (la lista,
  que estaba en `zaius-brand`). Se repasan en el boceto (`zaius-sketch`,
  paso 6) y en la revisión visual (`docs/standards.md`), y los espacios del
  sistema de diseño dicen lo que separa cada uno. Pedido en la prueba.
- Lo que se pulsa responde al pasar por encima y con el foco (D13, en los
  dos caminos): cada botón, enlace, tarjeta que lleva a otra página y enlace
  del menú cambia su color, su fondo o su sitio, con `--motion-fast`; con
  «nada», sin transición. Los bocetos lo enseñan (`zaius-sketch` y sus
  plantillas, donde las tarjetas de ejemplo pasan a ser enlaces), la revisión
  visual lo mira y «Movimiento», en el sistema de diseño, dice cómo es.
  Visto en la prueba: los bocetos no tenían estados al pasar por encima.
- Una skill de diseño propia (`docs/ux-ui/README.md`, «Una skill de diseño
  propia»): si la persona tiene una (la de su empresa, una que usa siempre),
  se copia en el proyecto, en `.claude/skills/<su-nombre>/`, sin el prefijo
  del kit, y se apunta en «Identidad» y en `AGENTS.md`. La leen `zaius-brand`
  y `zaius-sketch`, y lo que fija manda sobre lo que propone el kit; si
  choca con una norma, decide la persona, y la accesibilidad se cumple
  siempre. `zaius-init` la pide con las referencias. Pedido en la prueba.
- Los textos de los tests salen del catálogo: `testUtils.translate(clave,
  opciones)` (nuevo, en los dos caminos) da el texto del idioma por defecto, con sus valores y su plural, y falla si falta la clave
  o su forma para ese número. Nunca escritos a mano, leídos del JSON ni
  arreglados con `replace`; un componente que recibe sus textos por props
  los recibe así en su test. `docs/guides/write-tests.md` y sus ejemplos, y
  los de `add-an-island.md`, lo hacen así; lo revisa `zaius-review`. Visto
  en la prueba: los tests escribían los textos a mano, o leían el JSON y
  armaban el plural con `replace`.
- Un test no se manipula para que pase (`docs/guides/write-tests.md`, «Un
  test no se manipula», en `process.md`, `zaius-build`, «Qué se revisa» y
  `AGENTS.md`): ni se cambia lo que espera por lo que sale, ni se afloja, ni
  se salta o se borra, ni se simula lo que prueba, ni se esconde el fallo,
  ni se calla a las comprobaciones. Si el test está mal, se pregunta, y con
  el OK cambia primero el documento. Pedido en la prueba.
- Los textos van siempre en un catálogo, con i18next, también con un solo
  idioma: nunca escritos en el código, para que añadir un idioma sea solo
  traducir. `src/i18n/` (en una app, la carpeta `i18n/` de cada feature),
  `languageUtils`, las direcciones de cada idioma en `astro.config.ts` y la
  paridad de idiomas llegan a todo proyecto; i18next (y react-i18next en una
  app), siempre en sus dependencias. La respuesta «¿Va a estar en más de un
  idioma?» (`i18n`) solo decide lo que tiene sentido con varios: quién
  traduce, cambiar de idioma, el idioma en lo que se pide a la API.
  `zaius-languages` pasa a añadir un idioma: lo apunta con `change` y
  traduce sus catálogos, sin mover textos. Pedido en la prueba.
- git, a elegir y con su skill. Nueva pregunta, «¿Guardamos el historial de
  cambios con git?» (`git`): con Sí, el instalador hace `git init`, sin
  ningún commit; una carpeta que ya está en un repositorio lo tiene sin
  preguntar, y sin git instalado va sin él. Se añade después con `change`, y
  `update` la toma del repositorio. Los commits y los push los hace la
  persona: la IA propone el mensaje al cerrar cada unidad y solo los hace si
  se lo piden expresamente (`process.md`, la sección «Git» de `AGENTS.md`,
  con la forma del mensaje y cómo trabaja el proyecto). La skill `zaius-git`
  (nueva) conecta el remoto (GitHub, GitLab, Bitbucket), apunta las ramas
  que decide cada proyecto, monta el CI si se pide y, cuando se le pide,
  hace el commit, el push o el pull request y contesta con un resumen fijo,
  con el texto del pull request. Sin git, ni commits propuestos ni `git mv`;
  `zaius-publish` publica desde el ordenador. Pedido en la prueba.
- Escribir como una persona (`docs/process.md`, nueva sección, enlazada desde
  D11, «Qué se revisa» y `AGENTS.md`): nada de lo que escribe la IA lleva los
  signos que la delatan (el punto medio, las flechas, la raya y el guion
  medio, las marcas de verificación, los signos de matemáticas, el dibujo de
  cajas, los emojis), las aperturas de un chatbot, sus frases ni sus
  muletillas («no solo…, sino también…», las cosas de tres en tres). Salen
  de la plantilla entera: los árboles de carpetas van con espacios; la
  pestaña dice «<título> - <web>»; la cabecera de una página, «ROOMS: Las
  habitaciones»; una épica, «Pedidos (ORD)», y el estado de una historia,
  «Estado: pendiente.»; la columna de la lista de tests es «En verde», con
  «sí»; los resúmenes de `zaius-build`, `zaius-review` y `zaius-git`, con
  palabras. La comprobación de la estructura falla si un catálogo lleva uno
  de esos signos, y `verify`, si un documento lo lleva fuera de una cita. El
  instalador y `verify` tampoco los escriben. Pedido en la prueba, con la
  lista de Pangram.
- Una app puede no tener API. El instalador pregunta primero «¿La app saca
  sus datos de una API?» (`backend`, como en una web) y, solo con ella, por
  los mocks; con API, la API se documenta siempre (`docs/api/` y
  `api-requests.md`), y desaparece la pregunta de documentarla. Sin API no
  llegan el transporte, los services, los mocks, la sesión, los permisos ni
  TanStack Query (`main.tsx` y `testUtils` montan solo el router), y los
  documentos de la app lo dicen así. Lo que guarda una app sin API lo decide
  cada una en `zaius-init` («Qué guarda y dónde», en sus decisiones caras), y
  lo monta la primera historia que lo necesita, con el OK. `change` avisa si
  una app deja la API. Pedido en la prueba.
- `zaius-init` parte de lo que cuenta la persona, nunca del nombre del
  proyecto: lo que escribe detrás de `/zaius-init` va tal cual a «La idea»,
  un apartado nuevo del brief, y sin nada se le pide antes de la primera
  pregunta. El README de cada proyecto trae «Contar de qué va», una plantilla
  para escribirlo, con un ejemplo, y el instalador la nombra al terminar.
  Pedido en la prueba.
- `zaius-init` pregunta por las animaciones de la web o la app («¿Qué
  animaciones quieres en la web?»: pocas y suaves, vistosas o ninguna), no
  por «cuánto se mueve»; lo que se escribe en «Movimiento» no cambia. Pedido
  en la prueba.
- Las historias del backlog nombran al usuario: «Como usuario, quiero…» si la
  app tiene un solo tipo, «Como responsable de almacén» si hay varios, y en
  una web «Como visitante» o quien diga el brief; nunca «Como quien usa la
  app». Visto en la prueba.
- Cada OK acaba con lo siguiente (`process.md`, «Hablar con la persona»): al
  terminar la especificación, `zaius-spec` y `zaius-page` cierran el mensaje,
  después de lo que se aprueba, con qué pasa si encaja (aprobada, y después
  `/zaius-build`) y cómo se pide un cambio; con el sí, dicen en una línea que
  queda aprobada y qué sigue. Pedido en la prueba.
- Con la especificación aprobada, `zaius-spec` y `zaius-page` dan las dos
  salidas: construirla ahora (`/zaius-build`) o especificar antes la
  siguiente pendiente del backlog. Pedido en la prueba.
- La IA no firma los commits ni los pull requests de un proyecto: ni
  `Co-Authored-By`, ni «Generated with…», ni un enlace a la sesión
  (`AGENTS.md`, «Git», y `zaius-git`). Con git, el proyecto lleva
  `.claude/settings.json` con `attribution` vacío, que lo apaga en Claude
  Code. Pedido en la prueba.
- En una app, nada nace antes de que lo pida un caso: la miga de pan, con la
  primera pantalla que la pinta (una familia con varias pantallas o la
  gestión de un registro); el menú, con dos pantallas que se abren desde él;
  y el layout raíz, la carga con `lazy` y la recarga de la página de error,
  con la segunda pantalla. La pestaña del navegador la pone cada pantalla con
  el `<title>` de React, sin pasar por la miga. «Nada por si acaso» abarca
  también las props, las variantes y los estados que no usa nadie, y lo
  miran `zaius-spec`, `zaius-build` y la revisión. Visto en la prueba: una
  app de una pantalla tenía el hook de la miga solo para el título de la
  pestaña.
