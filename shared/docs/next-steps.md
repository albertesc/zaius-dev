# Próximos pasos

Dónde va el trabajo de %%APP_NAME%%. Lo que hay que construir, con el estado
de cada %%UNIT%%, está en el [backlog](./backlog.md); aquí, dónde estamos y lo
que queda abierto. Cualquier sesión, con cualquier IA o persona, empieza
leyendo esto ([Empezar de cero](./process.md#empezar-de-cero-en-cualquier-punto)).

## Dónde estamos

Se pone al día en cada paso, antes de parar: lo hecho, lo que está en curso, lo
siguiente y, si hay una pregunta abierta, la pregunta.

**Al día el %%DATE%%.** Está instalado el kit zaius-dev %%KIT_VERSION%%.
<!-- kit:if !existing -->
Con él llegan el código base y las comprobaciones, en verde: los tipos, el
lint, los tests y la comprobación de la estructura.

**Lo siguiente:** `/zaius-init`, que deja el brief y el sistema de diseño.
<!-- kit:else -->
Sobre el proyecto que ya existía, solo la documentación y las skills: el código
base y la comprobación de la estructura llegan al terminar de traerlo, con
`%%KIT_RUN%% change`.

**Lo siguiente:** `/zaius-init`, que deja el brief y el sistema de diseño y
propone cómo traer el proyecto, por bloques.
<!-- kit:end -->

**En curso:** nada.

**Pregunta abierta:** ninguna.

## Decisiones pendientes

Ninguna todavía. Cada una es una casilla con lo que hay que decidir y antes de
qué; al decidirla, se marca con lo decidido, la fecha y el documento que
cambia.
