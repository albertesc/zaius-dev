# Features

Cada pantalla de %%APP_NAME%% (cada feature) tiene aquí su documento, que
dice lo que hace hoy: qué se puede ver y hacer en ella, sus páginas, sus
permisos, sus zonas, los datos que pide y las decisiones de producto que hay
que respetar. Es lo que se lee para saber cómo es una pantalla sin abrir el
código.

- **Lo crea o lo pone al día `zaius-spec`,** cuando una historia toca la
  pantalla: con lo que la historia añade o cambia, y se aprueba con ella.
- **Lo deja al día `zaius-review`,** al cerrar la historia: dice lo que hace
  el código, escrito como si siempre hubiera sido así, sin «antes» ni
  «ahora».

Lo que falta por hacer no va aquí, sino en el [backlog](../backlog.md), como
historias: estos documentos no tienen estados. Mientras una historia que toca
la pantalla no está «hecha», su documento ya dice cómo quedará con ella, y la
historia sale en su apartado «Historias».

Los documentos van en una carpeta por familia, como el código: `orders/`,
`invoices/`, `shipments/`… Una feature sin familia va directa en esta carpeta.

Lo que depende de un documento cambia con él:
<!-- kit:if api -->
[la API](../api/README.md), las [peticiones a la API](../api-requests.md),
<!-- kit:end -->
las normas y las guías.

**En esta página:** [Plantilla](#plantilla) · [Cómo se escribe](#cómo-se-escribe) · [Índice](#índice) · [Lo que no es feature](#lo-que-no-es-feature)

## Plantilla

El documento de una feature es `docs/features/<familia>/<feature>.md` (sin
familia, `docs/features/<feature>.md`). Lo escribe `zaius-spec` con la primera
historia que la toca, como dice
[Crear una feature](../guides/create-a-feature.md#1-el-documento). Se escribe
sin dudas abiertas: las que salen se resuelven con la persona al especificar
la historia y quedan como decisiones. Todos los documentos tienen los mismos
apartados, en este orden:

1. **Qué hace:** lo que la persona puede ver y hacer.
2. **URL y páginas:** cada ruta con su página y su miga de pan. Debajo, cómo
   se llega a la pantalla y adónde se vuelve.
3. **Permisos:** la regla `<feature>Permissions` y el permiso de la API que
   mira cada `canX`, con lo que decide.
4. **Zonas de la pantalla:** cada zona, de arriba abajo, con el nombre de su
   componente, lo que muestra y la pieza de cada papel que usa
   ([Piezas por papel](../ux-ui/design-system.md#piezas-por-papel)). Lo
   que no es de la feature dice de dónde sale: «(raíz)», «(dominio
   `products`)», «(familia, `orders/common`)».
5. **Datos:** los métodos de service que usa, con su endpoint y su alcance, y
   qué se cachea, se invalida o se guarda en el store.
6. **Raíz, dominios, familia y específico:** de dónde sale cada pieza que usa,
   en cuatro tablas, de lo más general a lo más concreto. La sección empieza
   directamente por las tablas: los grupos se explican aquí, no en cada
   documento.
   - **raíz:** lo genérico, sin negocio (la raíz de `src/` o el sistema de
     diseño), con nombres que dicen lo que es (`TableSearch`);
   - **dominios:** cada pieza con su [dominio](../standards.md#dominios)
     (`session`, `products`…), con la entidad delante (`ProductStatsSection`);
   - **familia:** el `common` de su familia, con la entidad delante
     (`OrderStatusBadge`);
   - **específico:** solo la feature, con su prefijo (`OrdersEdit…`).

   Las tres primeras dicen quién más usa cada pieza (`| Tipo | Pieza | Dónde
   vive | También lo usan |`; la de dominios añade la columna del dominio). La
   de lo específico es `| Tipo | Piezas |`. Lo que no es específico se escribe
   pensando en todas las features que lo usan: su nombre, sus props y sus
   datos no dependen de la pantalla.
7. **Decisiones de producto:** las reglas propias de la feature.
8. **Historias:** las que la han hecho o cambiado, por su código y con su
   enlace a `docs/specs/`, de la primera a la última. Su estado está en el
   backlog, no aquí.
9. **Pendiente:** solo lo que la persona decide dejar abierto a propósito. Un
   documento no se da por escrito con dudas: cada una se resuelve con ella al
   escribirlo y queda como decisión de producto. Lo que falta por hacer en la
   pantalla es una historia del backlog, y aquí se cita por su código. Lo que
   depende de otro (la API, el sistema de diseño) se escribe como decisión
   («en cuanto la API devuelva los pedidos anulados, el filtro Estado los
   ofrecerá»).
<!-- kit:if api -->
   Su petición va a [Peticiones a la API](../api-requests.md).
<!-- kit:end -->
   Si no queda nada, «Nada pendiente».

El esqueleto, con los apartados en su orden y las cabeceras de sus tablas:

```markdown
# ordersEdit

La gestión de un pedido: una sola pantalla para seguirlo y corregirlo de
principio a fin. Es para quien lleva los pedidos, con el permiso `ORDERS.EDIT`.

**En esta página:** Qué hace · URL y páginas · Permisos · Zonas de la pantalla · Datos · Raíz, dominios, familia y específico · Decisiones de producto · Historias · Pendiente

## Qué hace

- Cambiar el estado del pedido y editar todos sus datos con un solo botón
  para guardar.

## URL y páginas

| Ruta | Página | Miga de pan |
|---|---|---|
| `/orders/:id/edit` | `OrdersEditPage` | «Pedidos › Gestión de pedidos › Pedido #1287» |

## Permisos

`ordersEditPermissions` (`ordersEditPermissions.ts`, junto a las rutas):

| Regla | Permiso de la API | Qué decide |
|---|---|---|
| `canView` | `ORDERS.VIEW` | La ruta. |
| `canEdit` | `ORDERS.EDIT` | Sin él, la gestión se abre en lectura. |

## Zonas de la pantalla

### Cabecera
### Barra de acciones

## Datos

| Método | Endpoint | Para qué | Alcance |
|---|---|---|---|
| `getOrderDetail` | `GET /orders/{id}` | El pedido entero. | Familia: también `orders` |

- **Claves.** …
- **Qué se invalida.** …

## Raíz, dominios, familia y específico

### Raíz

| Tipo | Pieza | Dónde vive | También lo usan |
|---|---|---|---|

### Dominios

| Dominio | Tipo | Pieza | También lo usan |
|---|---|---|---|

### Familia

| Tipo | Pieza | Dónde vive | También lo usan |
|---|---|---|---|

### Específico

| Tipo | Piezas |
|---|---|

## Decisiones de producto

## Historias

- [ORD003](../../specs/ORD003-edit-an-order.md) Corregir un pedido

## Pendiente

Nada pendiente.
```

## Cómo se escribe

- **Idioma.** La prosa va en castellano. Los textos de la interfaz van entre
  «», tal como se leen en la pantalla («Cierra el pedido»), y los nombres de
  estado, tal cual (Abierto, Enviado, Cerrado).
- **Tamaño.** Unas 500 líneas como máximo, con las líneas cortadas a 80
  caracteres. Una gestión que no cabe se parte en un documento por pestaña, con
  el nombre de la feature y la pestaña detrás (`ordersEditLines.md`): el
  principal tiene lo común y enlaza las partes, y cada parte lleva su zona, sus
  datos, sus piezas y sus decisiones.
- **Cada regla se escribe una vez.** Las zonas dicen qué es cada pieza y qué
  muestra; las decisiones, la regla (en qué estado sale una acción, qué pasa si
  falla), sin repetir la zona. Lo que ya dicen las
  [normas de diseño](../ux-ui/rules.md) no se repite: se enlaza la norma.
<!-- kit:if api -->
- **Datos.** El contrato del endpoint (permiso, campos, errores y rarezas) está
  en [API](../api/README.md); la feature solo dice cómo lo usa. Tras la tabla,
  la lista va en este orden, saltando lo que no aplique: Cuerpo, Claves,
  Cuándo se pide (también lo que se pide solo cuando hace falta), Sin
  caducidad o Catálogos, Idioma, Guardar o exportar, Errores, Qué se
  invalida, Refresco y Store. Cada punto empieza por su rótulo en negrita,
  acabado en punto.
<!-- kit:else -->
- **Datos.** La feature dice el endpoint de cada método y cómo lo usa. Tras la
  tabla, la lista va en este orden, saltando lo que no aplique: Cuerpo,
  Claves, Cuándo se pide (también lo que se pide solo cuando hace falta), Sin
  caducidad o Catálogos, Idioma, Guardar o exportar, Errores, Qué se
  invalida, Refresco y Store. Cada punto empieza por su rótulo en negrita,
  acabado en punto.
<!-- kit:end -->
- **Utils.** Un objeto por tema, con el nombre del objeto y sus funciones
  (`orderCloseUtils.buildOrderCloseRequest`)
  ([Nomenclatura](../naming.md#ficheros)). Lo que solo declara va a
  `constants/`.
- **Decisiones de un dashboard** (`ordersDashboard`), en este orden: la
  relación con su listado, el ámbito, los filtros, una por tarjeta y los
  gráficos que filtran (qué tarjetas y con qué filtro).
- **Decisiones de un listado** (`orders`), en este orden: la relación con
  su dashboard, el ámbito, los filtros, las columnas, el orden, la búsqueda,
  las celdas, las acciones, la exportación, si la tiene, y el vacío.
- **El dashboard y el listado de una familia** son dos documentos que se
  enlazan por su nombre. Cada uno dice solo lo suyo; lo que comparten (la
  cabecera, la barra de filtros y los filtros aplicados) está en «Familia» de
  los dos.
- **Decisiones de una gestión larga** (`ordersEdit`): agrupadas con subtítulos
  por zona (estado, formulario…), y las de cada pestaña, en su parte.

## Índice

Una feature entra en esta tabla con su documento, cuando `zaius-spec`
especifica la primera historia que la toca, y su nombre enlaza el documento.

| Familia | Feature | URL |
|---|---|---|

## Lo que no es feature

Las pestañas, los paneles, los modales y demás piezas de una pantalla no son
features: van en el documento de la suya. Los que ya tienen nombre aunque aún
no existen están en
[Nomenclatura](../naming.md#lo-que-no-es-feature-pero-ya-tiene-nombre).
