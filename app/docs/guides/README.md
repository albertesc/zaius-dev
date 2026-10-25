# Guías

Las guías de construcción de %%APP_NAME%%. Cada una es un paso a paso: lleva
una tarea de principio a fin, con las partes en el orden en que se hacen y un
ejemplo que se puede copiar. No hace falta leerlas enteras para usarlas: se
abre la que corresponde a la tarea y se sigue desde el paso que toca.

Lo que no es un paso a paso está fuera de esta carpeta: dónde va cada cosa
([Normativa](../standards.md)), cómo se llama
([Nomenclatura](../naming.md)), cómo tiene que verse
([UX/UI](../ux-ui/README.md)) y qué hace cada pantalla
([Features](../features/README.md)).

**En esta página:** [Las guías](#las-guías), [Cómo están escritas](#cómo-están-escritas), [Escribir una guía nueva](#escribir-una-guía-nueva)

## Las guías

| Guía | Qué hace |
|---|---|
<!-- kit:if backend -->
| [Crear una feature](./create-a-feature.md) | Monta una feature de principio a fin: su documento, la carpeta, las rutas, la página, los textos, el menú, los permisos y los datos. |
<!-- kit:if mocks -->
| [Añadir un servicio](./add-a-service.md) | Añade una llamada a la API: el método del service, el schema de su respuesta, el mock y la consulta. Dice también dónde se adapta el transporte a la API del proyecto. |
<!-- kit:else -->
| [Añadir un servicio](./add-a-service.md) | Añade una llamada a la API: el método del service, el schema de su respuesta y la consulta. Dice también dónde se adapta el transporte a la API del proyecto. |
<!-- kit:end -->
| [Cargar y guardar datos](./load-and-save-data.md) | Pide los datos del servidor desde una feature y los guarda: consultas y sus estados, catálogos, varios datos a la vez, stores que sobreviven a recargar, listas paginadas, refresco, mutaciones, qué se vuelve a pedir y la exportación. |
<!-- kit:else -->
| [Crear una feature](./create-a-feature.md) | Monta una feature de principio a fin: su documento, la carpeta, las rutas, la página, los textos, el menú y los datos. |
<!-- kit:end -->
| [Crear un formulario](./create-a-form.md) | Monta un formulario con su schema, sus campos, cuándo se valida y los cambios sin guardar, y sus variantes: editar un registro, un modal, las filas de una tabla y los asistentes. |
<!-- kit:if backend -->
| [Aplicar permisos](./apply-permissions.md) | Decide qué ve y qué puede hacer cada persona: lo que tiene que dar la sesión, la regla de la feature y su uso en rutas, botones, acciones de fila, pestañas, peticiones y menú. |
<!-- kit:end -->
| [Escribir tests](./write-tests.md) | Prueba lo que se ha construido: qué se prueba, dónde va cada test y cómo se escribe según el tipo de fichero. |

## Cómo están escritas

- **Un paso a paso por tarea.** El título dice la tarea (un verbo y su
  objeto), la página lleva su índice «En esta página» y los pasos van
  numerados en el orden en que se hacen.
<!-- kit:if backend -->
- **Los ejemplos son de un dominio inventado, `orders`,** una gestión de
  pedidos: el listado (`orders`), el análisis (`ordersDashboard`), la
  gestión de un pedido (`ordersEdit`) y su alta (`ordersNew`), con otras
  familias de apoyo (`invoices`, `incidents`) y dominios (`session`,
  `warehouses`, `company`). Sirven de modelo hasta que el proyecto tenga sus
  features; si un ejemplo y el documento de una feature se contradicen, manda
  el documento de la feature.
<!-- kit:else -->
- **Los ejemplos son de un dominio inventado, `orders`,** una gestión de
  pedidos: el listado (`orders`), el análisis (`ordersDashboard`), la
  gestión de un pedido (`ordersEdit`) y su alta (`ordersNew`), con otras
  familias de apoyo (`invoices`, `incidents`) y dominios (`warehouses`,
  `company`). Sirven de modelo hasta que el proyecto tenga sus features; si
  un ejemplo y el documento de una feature se contradicen, manda el
  documento de la feature.
<!-- kit:end -->
- **Un tema tiene su ejemplo en un solo sitio.** Las demás guías enlazan en
  vez de copiarlo.
<!-- kit:if backend -->
- **Las piezas visuales llevan el nombre de su papel** (`PageHeader`, `Table`,
  `Modal`, `PageAlert`…), sin su import, porque son las del sistema de diseño
  del proyecto: las suyas están en
  [Piezas por papel](../ux-ui/design-system.md#piezas-por-papel). Lo que
  no es visual (hooks, services, schemas, stores y rutas) es código real, con
  sus imports.
- **Algunas piezas nacen con la primera feature que las usa** y no vienen
  hechas: los schemas comunes (`src/schemas/commonSchema.ts`), las funciones
  de formato (`formatUtils`), el dominio `session` y los layouts. Cada guía
  dice cómo son cuando las nombra.
<!-- kit:else -->
- **Las piezas visuales llevan el nombre de su papel** (`PageHeader`, `Table`,
  `Modal`, `PageAlert`…), sin su import, porque son las del sistema de diseño
  del proyecto: las suyas están en
  [Piezas por papel](../ux-ui/design-system.md#piezas-por-papel). Lo que
  no es visual (hooks, schemas, stores y rutas) es código real, con sus
  imports.
- **Algunas piezas nacen con la primera feature que las usa** y no vienen
  hechas: los schemas comunes (`src/schemas/commonSchema.ts`), las funciones
  de formato (`formatUtils`) y los layouts. Cada guía dice cómo son cuando
  las nombra.
<!-- kit:end -->

## Escribir una guía nueva

Una guía nueva sigue la forma de [Crear una feature](./create-a-feature.md):

1. **Un nombre de tarea:** el fichero y el título empiezan por un verbo; el
   fichero, en inglés, y el título, en el idioma de la documentación
   (`create-a-feature.md`, «Crear una feature»).
2. **Un primer párrafo** que empieza «Esta guía…» y dice qué hace, con qué
   ejemplo y para quién sirve.
3. **«En esta página»** con un punto por paso.
4. **Pasos numerados** (`## 1. El documento`), con títulos cortos, en el orden
   en que se hacen. Las variantes van después como partes con sus propios
   pasos, y los casos especiales, como cierres cortos sin número.
5. **«Errores comunes»** al final, con una tabla de síntoma y causa.

Además de la guía, se refleja en esta página, en
[la documentación](../../README.md) y en la tabla «Qué leer» de `AGENTS.md`.
