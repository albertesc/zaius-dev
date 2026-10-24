# Guías

Las guías de construcción de %%APP_NAME%%. Cada una es un paso a paso: lleva
una tarea de principio a fin, con las partes en el orden en que se hacen y un
ejemplo que se puede copiar. No hace falta leerlas enteras para usarlas: se
abre la que corresponde a la tarea y se sigue desde el paso que toca.

Lo que no es un paso a paso está fuera de esta carpeta: dónde va cada cosa
([Normativa](../standards.md)), cómo se llama
([Nomenclatura](../naming.md)), cómo tiene que verse
([UX/UI](../ux-ui/README.md)) y qué hace cada página
([Páginas](../pages/README.md)).

**En esta página:** [Las guías](#las-guías) · [Cómo están escritas](#cómo-están-escritas) · [Escribir una guía nueva](#escribir-una-guía-nueva)

## Las guías

| Guía | Qué hace |
|---|---|
| [Crear una página](./create-a-page.md) | Monta una página de principio a fin: su documento, la URL y el nombre, la página y sus componentes, los textos, el menú y los datos, con lo que piden los buscadores, las imágenes y el movimiento. |
<!-- kit:if server -->
| [Crear un formulario](./create-a-form.md) | Monta un formulario con su schema, su action, sus campos y el aviso de lo que no se ha enviado, y dice adónde llega lo que se envía. |
<!-- kit:end -->
<!-- kit:if content -->
| [Añadir contenido](./add-content.md) | Publica contenido en Markdown o MDX: la colección y su schema, las entradas y las páginas que las leen. |
<!-- kit:end -->
<!-- kit:if backend -->
| [Añadir un servicio](./add-a-service.md) | Añade una llamada a la API: el método del service, el schema de su respuesta, el mock y su uso en la página. Dice también dónde se adapta el transporte a la API del proyecto. |
| [Cargar y guardar datos](./load-and-save-data.md) | Lee los datos de la API en una página: un dato y sus estados, catálogos y varios datos a la vez. |
<!-- kit:end -->
<!-- kit:if privateArea -->
| [Aplicar permisos](./apply-permissions.md) | Decide qué ve y qué puede hacer cada persona en la zona privada: lo que tiene que dar la sesión, la regla y su uso en la página, los botones, las zonas, las actions y el menú. |
<!-- kit:end -->
| [Añadir una isla](./add-an-island.md) | Decide si una zona necesita JavaScript que un `<script>` no lleva bien y, si hace falta, trae React con la primera isla y la monta. |
| [Escribir tests](./write-tests.md) | Prueba lo que se ha construido: qué se prueba, dónde va cada test y cómo se escribe según el tipo de fichero. |

## Cómo están escritas

- **Un paso a paso por tarea.** El título dice la tarea (un verbo y su
  objeto), la página lleva su índice «En esta página» y los pasos van
  numerados en el orden en que se hacen.
- **Los ejemplos son de un negocio inventado, «Casa del Roble»,** una casa
  rural: la portada (HOME), las habitaciones (ROOMS), el entorno (AREA), el
  contacto (CONTACT) y los textos legales (LEGAL-NOTICE, PRIVACY, COOKIES).
<!-- kit:if content -->
  El blog, con sus entradas (BLOG y BLOG-POST).
<!-- kit:end -->
<!-- kit:if privateArea -->
  En la zona privada, las reservas de cada huésped (ACCOUNT-BOOKINGS).
<!-- kit:end -->
  Sirven de modelo hasta que el proyecto tenga sus páginas; si un ejemplo
  y el documento de una página se contradicen, manda el documento de la
  página.
- **Un tema tiene su ejemplo en un solo sitio.** Las demás guías enlazan en
  vez de copiarlo.
- **Las piezas visuales llevan el nombre de su papel** (`PageHeader`,
  `EmptyState`, `CallToAction`…), sin su import, porque son las del sistema
  de diseño del proyecto: las suyas están en
  [Piezas por papel](../ux-ui/design-system.md#piezas-por-papel). Lo que
<!-- kit:if backend -->
  no es visual (páginas, services, schemas y utils) es código real, con sus
  imports.
<!-- kit:else -->
  no es visual (páginas, constantes y utils) es código real, con sus
  imports.
<!-- kit:end -->
- **Algunas piezas nacen con la primera página que las usa** y no vienen
  hechas: el marco de la web (`AppLayout.astro`), el menú
  (`appNavigation.ts`) y las funciones de formato (`formatUtils`). Cada guía
  dice cómo son cuando las nombra.

## Escribir una guía nueva

Una guía nueva sigue la forma de [Crear una página](./create-a-page.md):

1. **Un nombre de tarea:** el fichero y el título empiezan por un verbo; el
   fichero, en inglés, y el título, en el idioma de la documentación
   (`create-a-page.md`, «Crear una página»).
2. **Un primer párrafo** que empieza «Esta guía…» y dice qué hace, con qué
   ejemplo y para quién sirve.
3. **«En esta página»** con un punto por paso.
4. **Pasos numerados** (`## 1. El documento`), con títulos cortos, en el orden
   en que se hacen. Las variantes van después como partes con sus propios
   pasos, y los casos especiales, como cierres cortos sin número.
5. **«Errores comunes»** al final, con una tabla de síntoma y causa.

Además de la guía, se refleja en esta página, en
[la documentación](../../README.md) y en la tabla «Qué leer»
de `AGENTS.md`.
