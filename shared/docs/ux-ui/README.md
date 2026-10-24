# UX/UI

Esta carpeta guarda todo el diseño de %%APP_NAME%%: el sistema de diseño, las
normas vigentes y las propuestas para cambiarlos. Sirve para ir iterando el
diseño sin tocar el código hasta que un cambio está decidido.

**En esta página:** [Qué hay aquí](#qué-hay-aquí) · [Bocetos](#bocetos) · [Cómo se cambia el diseño](#cómo-se-cambia-el-diseño) · [Plantilla de una propuesta](#plantilla-de-una-propuesta) · [Propuestas](#propuestas)

## Qué hay aquí

- **[design-system.md](./design-system.md):** con qué se construye la
  %%KIND%%: la librería y cómo se monta, los tokens, los anchos, el tema, el
  movimiento, los iconos y qué pieza cumple cada papel. Lo escribe
  `zaius-init` al empezar.
- **[rules.md](./rules.md):** las normas D vigentes, con ejemplos. Dicen cómo
  se comporta y cómo se escribe cada pantalla, sea cual sea el sistema de
  diseño.
- **`proposals/`:** un fichero por propuesta de cambio, con la fecha delante:
  `proposals/AAAA-MM-DD-<topic>.md`, con el tema en inglés
  (`2026-11-03-header-filters.md`).
- **`mockups/`:** los bocetos, páginas HTML para ver algo antes de
  construirlo ([Bocetos](#bocetos)).
- **`references/`:** lo que la persona pasa para basar el diseño: una web
  que le gusta, capturas, la guía de marca, un enlace a Figma.

Las tres últimas carpetas nacen con su primer fichero.

## Bocetos

Un boceto es una página HTML que se abre con doble clic en el navegador, sin
instalar nada ni arrancar la %%KIND%%: enseña cómo será algo antes de
construirlo. Los hace la skill `zaius-sketch`, con los tokens del sistema de
diseño y datos de ejemplo, en `mockups/`:

- **La guía visual,** `mockups/design-system.html`: el marco y las piezas del
  sistema de diseño, con sus colores y su tipografía. Nace con `zaius-init`,
  se aprueba antes de la primera %%UNIT%% y se pone al día con cada cambio
  aceptado del sistema de diseño.
- **El de una %%UNIT%%,** `mockups/%%UNIT_EXAMPLE%%.html`, con el código de la
  %%UNIT%%: nace con su especificación, se aprueba con ella y se borra cuando
  la %%UNIT%% está hecha. Desde entonces manda lo de verdad.
- **El de un refactor,** `mockups/%%UNIT_EXAMPLE%%-refactor.html`: el antes y
  el después de lo que se ve, si el refactor toca piezas que se ven. Se borra
  al cerrarlo.
- **El de una propuesta,** `mockups/AAAA-MM-DD-<topic>.html`: el antes y el
  después de una propuesta de diseño. Se queda con ella.

| Nivel | Qué se ve | Para decidir |
|---|---|---|
| Baja | Cajas y grises, sin la marca; los textos y los datos, de verdad. | Qué hay y dónde va. |
| Media | La tipografía, los espacios y las piezas, en grises. | La jerarquía y qué pieza va en cada sitio. |
| Alta | Todo el sistema de diseño: los colores, la tipografía y los iconos. | Cómo se verá. |

El nivel de partida de los bocetos es el de «Bocetos», en el
[sistema de diseño](./design-system.md#bocetos), y la guía visual va siempre
en alta. Cada boceto lleva arriba un selector para pasar de un nivel a otro, y
otros para el ancho, el tema y los estados. Un boceto se parece a lo de verdad,
pero no lo es: el aspecto de una librería de componentes se imita con CSS, y lo
que vale es la revisión visual de lo construido.

## Cómo se cambia el diseño

1. **Se escribe una propuesta** en `proposals/AAAA-MM-DD-<topic>.md`, con la
   plantilla de abajo, y se añade al índice con el estado «en revisión». La
   skill `zaius-design` la escribe sin tocar el código.
2. **Se revisa con la persona.** La propuesta puede cambiar varias veces: se
   reescribe en el mismo fichero hasta que está clara.
3. **Se decide:**
   - **Aceptada:** con el OK, la norma pasa a [rules.md](./rules.md) y a la
     sección «Diseño y UX» de `AGENTS.md`, o el cambio del sistema de diseño,
     a [design-system.md](./design-system.md). Desde ese momento se aplica en
     el código, y sus tareas se apuntan en
     [Próximos pasos](../next-steps.md).
   - **Descartada:** el fichero se queda con su motivo, en «Decisión», para no
     volver a discutirla.
   - **Sustituida:** otra propuesta aceptada la cambia; el índice dice cuál.

Una propuesta que no está aceptada no se aplica en el código.

## Plantilla de una propuesta

```markdown
# <Tema>

- **Estado:** en revisión | aceptada | descartada | sustituida
- **Fecha:** AAAA-MM-DD

## Problema
Qué no funciona hoy y dónde se ve.

## Propuesta
El cambio, con un ejemplo de antes y después y, si se ve, su boceto.

## Afecta a
Las %%UNITS%% y las piezas que cambian.

## Alternativas
Lo que se ha considerado y por qué no.

## Decisión
Qué se decidió y cuándo, y qué norma cambia; si se descarta, su motivo; si
se sustituye, por cuál.
```

## Propuestas

| Fecha | Propuesta | Estado | Norma |
|---|---|---|---|

Todavía no hay ninguna propuesta. Cada una nueva se añade al final de la
tabla, con un enlace a su fichero, y su estado se cambia aquí y en el propio
fichero a la vez. En «Norma», las normas que cambia («D5», «D8 (nueva)») o,
si se sustituye, la propuesta que la sustituye.
