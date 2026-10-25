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
  aquí: pendiente, por aprobar, aprobada, en curso, por cerrar y hecha
  ([Los estados](./process.md#los-estados-de-una-página)).
- **La primera página es HOME:** con ella nacen el marco (la cabecera, el
  menú y el pie) y lo que comparten todas, y las demás crecen sobre ella.

**En esta página:** [Cómo se escribe](#cómo-se-escribe), [Mapa del sitio](#mapa-del-sitio), [Páginas](#páginas), [Quitadas](#quitadas)

## Cómo se escribe

Se escribe para que se entienda sin saber programar: es lo que la persona
aprueba. En «Mapa del sitio», lo que lleva el menú y lo que lleva el pie, en
su orden, con el texto de cada entrada y su página. En «Páginas», un apartado
por página, en el orden en que se hacen:

```markdown
## Mapa del sitio

- **Menú:** «Inicio» (HOME), «Habitaciones» (ROOMS), «El entorno» (AREA), «Contacto» (CONTACT)
- **Pie:** «Aviso legal» (LEGAL-NOTICE), «Privacidad» (PRIVACY), «Cookies» (COOKIES)

## Páginas

### HOME: Inicio

- **Para qué:** como pareja que busca una escapada, quiero conocer la casa de un vistazo, para saber si es lo que busco y llegar a las habitaciones.
- **Dirección web:** `/`
- **Lo que enseña:** sus textos y los datos de la casa (cuántos caben, el teléfono).
- **Estado:** pendiente

### ROOMS: Las habitaciones

- **Para qué:** como pareja que busca una escapada, quiero ver cada habitación con sus fotos, cuántos caben y su precio, para elegir la mía y pedir disponibilidad.
- **Dirección web:** `/rooms`
- **Lo que enseña:** los datos de las habitaciones (sus fotos, cuántos caben y su precio).
- **Estado:** pendiente

### CONTACT: Contacto

<!-- kit:if server -->
- **Para qué:** como pareja que busca una escapada, quiero pedir unas fechas o preguntar, para que la casa me conteste.
- **Dirección web:** `/contact`
- **Lo que enseña:** sus textos y un formulario.
<!-- kit:else -->
- **Para qué:** como pareja que busca una escapada, quiero llamar o escribir a la casa, para pedir unas fechas o preguntar.
- **Dirección web:** `/contact`
- **Lo que enseña:** sus textos y los datos de la casa (el teléfono, el correo).
<!-- kit:end -->
- **Estado:** pendiente
```

- **El título:** su nombre y el título que se ve, como en la cabecera de su
  fichero («ROOMS: Las habitaciones»).
- **Para qué:** su historia, en una frase: «Como <quién>, quiero <qué>,
  para <para qué>.», con quien la visita, como lo dice el brief («Como
  pareja que busca una escapada») o, si no se distingue, «Como visitante», y
  sus palabras: lo que viene a hacer en ella. Una página no se parte en
  historias: se entrega entera.
- **Dirección web:** su URL.
- **Lo que enseña:** de dónde sale lo que se ve, con estas palabras, una o
  varias, cada una con lo que es:
  - «sus textos»: los de la propia página;
  - «los datos de …»: unos pocos que se repiten o cambian de vez en cuando;
<!-- kit:if content -->
  - «las entradas de …»: las del blog, una a una;
<!-- kit:end -->
<!-- kit:if backend -->
  - «lo que da …»: lo que da otro sistema, en el momento;
<!-- kit:end -->
<!-- kit:if server -->
  - «un formulario»: lo que escribe quien la visita.
<!-- kit:end -->
- **El estado,** el mismo que dice su fichero.

## Mapa del sitio

Pendiente: lo escribe `/zaius-backlog`.

## Páginas

Pendiente: lo escribe `/zaius-backlog`.

## Quitadas

Las páginas que se han quitado, con su nombre, la fecha y el porqué. Ninguna
todavía.
