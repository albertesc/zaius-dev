# Peticiones a la API

Lo que la app necesita que cambie la API, por feature. Lo que la API hace hoy
está en [API](./api/README.md). Cada documento de feature dice cómo se
comporta la app mientras tanto.
<!-- kit:if mocks -->
Mientras tanto, lo que la app ya usa y la API aún no da lo responde un mock
que imita el contrato propuesto, escrito en «Propuestos (no existen)» de su
zona.
<!-- kit:end -->
Lo que queda por hacer en la app está en el [backlog](./backlog.md).

**En esta página:** [Cómo se escribe una petición](#cómo-se-escribe-una-petición) · [Cómo se cierra una petición](#cómo-se-cierra-una-petición) · [Varias features](#varias-features)

## Cómo se escribe una petición

- **Una sección por feature,** `## Para <feature>` (`## Para ordersEdit`), en
  el orden en que se hacen las features. Lo que piden varias va en
  [Varias features](#varias-features), al principio.
- **Una casilla por petición,** `- [ ]`, en una sola línea, con:
  - el endpoint, con su método (`PUT /orders/close/{id}`);
  - qué se pide, dicho como lo que debe hacer la API;
  - «Hoy…»: qué hace ahora y qué consecuencia tiene en la app;
  - cuándo se comprobó: contra la API en marcha o en el código del servidor,
    con la fecha;
  - los enlaces: a la rareza de su zona en [API](./api/README.md), a la
    decisión de la feature que la motiva y, si la hay, a la historia que la
    espera, por su código.
- **Una petición con varias partes** lleva sus partes en viñetas debajo de la
  casilla.

```markdown
## Para ordersEdit

- [ ] `PUT /orders/close/{id}`: avisar a la persona asignada del cierre. Hoy cierra el pedido sin avisar a nadie, y la pantalla no puede decir a quién ha llegado; comprobado contra la API en marcha el AAAA-MM-DD ([API](./api/orders.md#put-ordersclose-id), [ordersEdit](./features/orders/ordersEdit.md#decisiones-de-producto)).
```

## Cómo se cierra una petición

- **Cuando la API la cumple,** se marca (`- [x]`) y se reescribe con lo que
  hace ahora: «Lo hace».
- **Ese mismo día, el cambio pasa a [API](./api/README.md):** el endpoint se
  describe como es, la rareza se quita y, si era un propuesto, sale de
  «Propuestos (no existen)» y entra en la tabla de su zona.
<!-- kit:if mocks -->
- **El mock pasa a imitar** lo que responde la API, no lo que se propuso.
<!-- kit:end -->
- **La feature deja de esperar:** su decisión («en cuanto la API…») se
  reescribe como es, y lo que dependía de ella va al
  [backlog](./backlog.md), como una historia, con el OK.

## Varias features

Ninguna todavía.
