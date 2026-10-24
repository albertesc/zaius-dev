# Backlog

Estado: pendiente

Lo que hay que construir en %%APP_NAME%%: el mapa del sitio y las páginas, en
el orden en que se hacen, cada una con su estado. Sale del [brief](./brief.md)
y lo escribe `/zaius-backlog`, que también añade, cambia, parte, ordena o
quita páginas, con el OK. Su estado va en la cabecera, como el del brief:
«pendiente», «por aprobar» mientras la persona lo revisa y «aprobado», con la
fecha del OK.

- **Una página** es una URL de la web, que se entrega entera: lo que se ve,
  su contenido, sus datos y lo que se puede hacer en ella. Su nombre es el
  prefijo de su URL en mayúsculas, con un guion entre palabras: `/` es HOME;
  `/rooms`, ROOMS; `/legal/notice`, LEGAL-NOTICE
  ([El nombre y el fichero](./pages/README.md#el-nombre-y-el-fichero)).
- **Cada página tiene su fichero** en `docs/pages/`, que empieza por su
  nombre (`docs/pages/ROOMS.md`). Lo crea `/zaius-backlog` al apuntarla, en
  «pendiente», y lo completa `/zaius-page`. Con `@`, Claude Code y opencode
  las listan (`/zaius-page @docs/pages/RO`).
- **Su estado** va en la cabecera de su fichero, con la fecha, y se repite
  aquí: pendiente → por aprobar → aprobada → en curso → por cerrar → hecha
  ([Los estados](./process.md#los-estados-de-una-página)).
- **La primera página es HOME:** con ella nacen el marco (la cabecera, el
  menú y el pie) y lo que comparten todas, y las demás crecen sobre ella.

**En esta página:** [Cómo se escribe](#cómo-se-escribe) · [Mapa del sitio](#mapa-del-sitio) · [Páginas](#páginas) · [Quitadas](#quitadas)

## Cómo se escribe

En «Mapa del sitio», lo que lleva el menú y lo que lleva el pie, en su orden,
con el texto de cada entrada y su página. En «Páginas», una línea por página,
en el orden en que se hacen:

```markdown
## Mapa del sitio

- **Menú:** «Inicio» (HOME) · «Habitaciones» (ROOMS) · «El entorno» (AREA) · «Contacto» (CONTACT)
- **Pie:** «Aviso legal» (LEGAL-NOTICE) · «Privacidad» (PRIVACY) · «Cookies» (COOKIES)

## Páginas

- **HOME** `/` Conocer la casa y llegar a las habitaciones. Datos: constants/ · pendiente
- **ROOMS** `/rooms` Elegir habitación y pedir disponibilidad. Datos: constants/ · pendiente
<!-- kit:if server -->
- **CONTACT** `/contact` Pedir unas fechas o preguntar, y que la casa conteste. Datos: formulario (servidor) · pendiente
<!-- kit:else -->
- **CONTACT** `/contact` Pedir unas fechas o preguntar, por teléfono o por correo. Datos: la página · pendiente
<!-- kit:end -->
```

- **La página,** con su nombre en negrita y su URL.
- **Para qué,** en una frase, con las palabras de quien visita la web: lo
  que viene a hacer en ella.
- **Datos:** de dónde sale lo que enseña, con estas palabras: «la página»
  (sus textos), «constants/» (los datos que se repiten o cambian),
<!-- kit:if content -->
  «colección» (las entradas de contenido),
<!-- kit:end -->
<!-- kit:if backend -->
  «la API» (otro sistema),
<!-- kit:end -->
<!-- kit:if server -->
  «formulario (servidor)» (lo que escribe quien la visita),
<!-- kit:end -->
  o varias, separadas por comas.
- **El estado,** al final, detrás de «·», el mismo que dice su fichero.

## Mapa del sitio

Pendiente: lo escribe `/zaius-backlog`.

## Páginas

Pendiente: lo escribe `/zaius-backlog`.

## Quitadas

Las páginas que se han quitado, con su nombre, la fecha y el porqué. Ninguna
todavía.
