---
name: zaius-build
<!-- kit:if git -->
description: Construye en pareja con la persona una %%UNIT%% aprobada (o un refactor aprobado): un test de su lista, rojo, el mínimo código, verde, y para. Marca cada test en verde, apunta en la especificación lo que se decide, para ante lo que no está en el plan y no hace el commit si la persona no se lo pide.
<!-- kit:else -->
description: Construye en pareja con la persona una %%UNIT%% aprobada (o un refactor aprobado): un test de su lista, rojo, el mínimo código, verde, y para. Marca cada test en verde, apunta en la especificación lo que se decide y para ante lo que no está en el plan.
<!-- kit:end -->
disable-model-invocation: true
argument-hint: <%%UNIT_EXAMPLE%%>
---

# Construir en pareja

La IA conduce y la persona navega: la IA escribe el test y el código, de uno
en uno, y la persona decide en cada parada.

## Lee primero

- [AGENTS.md](../../../AGENTS.md), entero, y
  [Cómo se trabaja con la IA](../../../docs/process.md): la persona decide,
  iterar y empezar de cero.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).
- El fichero de la %%UNIT%%, en `%%UNIT_DOCS%%/`, con su lista de tests, y los
  documentos que enlaza; o, si es un refactor, su propuesta, en
  `docs/refactors/`.
- [Normativa](../../../docs/standards.md),
  [Nomenclatura](../../../docs/naming.md) y la guía de lo que se va a hacer,
  en `docs/guides/`.

## Antes de empezar

1. **La %%UNIT%%:** su código o su ruta (`/zaius-build %%UNIT_EXAMPLE%%`, o
   eligiéndola con `@`); un refactor, por su fichero de `docs/refactors/`. Sin
   ninguna, propón la que está «en curso» o la primera «aprobada» del backlog,
   y espera.
2. **Su estado:** «aprobada» o «en curso». Si está «pendiente» o «por
   aprobar», para: primero, `/%%SPEC_SKILL%% <código>` (o, un refactor,
   `/zaius-refactor`) y su OK.
3. **El plan, contra el código de hoy:** si algo del plan ya no encaja con lo
   que hay, dilo antes de empezar.
4. **«En curso»:** el estado, en su fichero y en el backlog, con la fecha, y
   «Dónde estamos» al día.
<!-- kit:if git -->
5. **Su rama,** si el proyecto trabaja con ramas
   ([Git](../../../AGENTS.md#git)): la %%UNIT%% va en la suya. Si aún no está,
   dile a la persona cuál crear, o créala si te lo pide.
<!-- kit:end -->

## El ciclo

1. **El primer test sin marcar** de la lista. Lo que la lista marca como
   «verificación manual» no se automatiza: se deja para `zaius-review`.
2. **El test, escrito y pasado:** tiene que fallar (rojo), y por lo que dice
   el test, no por un error de otra cosa.
3. **El mínimo código** que lo hace pasar, con la normativa y la
   nomenclatura. Nada que el test no pida: ni una prop, ni una variante, ni
   un mecanismo que no use nada de la %%UNIT%%.
4. **Todos los tests, en verde** (`%%PM%% run test`). El test, marcado en la
   lista, con «sí» en «En verde».
5. **Para y cuéntalo:**

   ```text
   Pasa «<test>». <Lo que has hecho, en una línea> (<fichero>:<línea>).
   Decidido: <el detalle de código que has decidido, si hay alguno>
   Marcado en la lista: N de M.
   ¿Cambio algo o sigo con «<siguiente test>»?
   ```

«Haz 3» son tres ciclos enteros, cada uno con su test primero; nunca tres
tests y después el código. «Hazla entera», todos, parando solo donde dice
«Para y pregunta».

## Los tests

- **El valor esperado sale del criterio o del documento,** nunca calculado
  con la misma lógica que el código.
- **Por lo que se ve o se usa:** lo que pinta la pantalla, lo que devuelve la
  función que se llama, no cómo lo hace por dentro.
- **Un test no se manipula para que pase**
  ([Un test no se manipula](../../../docs/guides/write-tests.md#un-test-no-se-manipula)):
  si falla, se arregla el código. Ni se cambia lo que espera por lo que
  sale, ni se afloja, ni se salta, ni se simula lo que prueba, ni se calla a
  las comprobaciones. Si el test está mal, para y pregunta.

## Para y pregunta

En el momento, aunque sea a mitad de un «haz 3»:

- una decisión que no está en el plan ni en el documento;
- algo que no se ha pedido;
- cambiar, saltar o borrar un test;
- dos intentos sin llegar a verde;
- un paso de más de unas 50 líneas o de más de 3 ficheros: propón partirlo;
- una dependencia nueva, un tipo de componente o un verbo nuevo, o una norma
  de diseño;
- un contenido o un dato que falta y el documento no dice qué poner.

Antes de preguntar, apunta la pregunta en «Dónde estamos». Con la respuesta,
escribe lo decidido en la especificación, con la fecha (y su test en la lista,
si hace falta), y sigue.

## Con la lista en verde

1. **Los refactors que veas,** con su señal en el código (algo que ya se
   repite, un fichero que crece): proponlos, y hazlos solo con el OK, con los
<!-- kit:if git -->
   tests en verde y como un cambio aparte, con su propio commit.
2. **El commit:** lo hace la persona, con el mensaje que propone
   `/zaius-review` al cerrar la %%UNIT%%. Hazlo tú solo si te lo pide
   expresamente, con `zaius-git`.
3. **«Dónde estamos»:** la lista en verde y lo siguiente,
   `/zaius-review <código>`, que lanza la persona.
<!-- kit:else -->
   tests en verde y como un cambio aparte.
2. **«Dónde estamos»:** la lista en verde y lo siguiente,
   `/zaius-review <código>`, que lanza la persona.
<!-- kit:end -->

## Comprobación

- [ ] Cada test, escrito antes que su código y visto en rojo.
- [ ] La lista, con los tests en verde marcados.
- [ ] Lo decidido en las paradas, escrito en la especificación.
- [ ] Nada «por si acaso»: ningún fichero, prop o variante que no use la
      %%UNIT%%.
- [ ] `%%PM%% run test` en verde.
<!-- kit:if git -->
- [ ] Ningún commit que la persona no haya pedido.
<!-- kit:end -->
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Después de cada ciclo, salvo «haz N» o «hazla entera».
- En cualquiera de los casos de «Para y pregunta».
- Antes de un refactor.
