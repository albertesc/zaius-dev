# UX/UI

Esta carpeta guarda todo el diseño de %%APP_NAME%%: el sistema de diseño, las
normas vigentes y las propuestas para cambiarlos. Sirve para ir iterando el
diseño sin tocar el código hasta que un cambio está decidido.

**En esta página:** [Qué hay aquí](#qué-hay-aquí), [Bocetos](#bocetos), [Una skill de diseño propia](#una-skill-de-diseño-propia), [Cómo se cambia el diseño](#cómo-se-cambia-el-diseño), [Plantilla de una propuesta](#plantilla-de-una-propuesta), [Propuestas](#propuestas)

## Qué hay aquí

- **[design-system.md](./design-system.md):** con qué se construye la
  %%KIND%%: su identidad, la librería y cómo se monta, los tokens, los
  anchos, el tema, el movimiento, los iconos y qué pieza cumple cada papel.
  Lo escribe `zaius-init` al empezar, con `zaius-brand`.
- **[rules.md](./rules.md):** las normas D vigentes, con ejemplos. Dicen cómo
  se comporta y cómo se escribe cada pantalla, sea cual sea el sistema de
  diseño.
- **`proposals/`:** un fichero por propuesta de cambio, con la fecha delante:
  `proposals/AAAA-MM-DD-<topic>.md`, con el tema en inglés
  (`2026-11-03-header-filters.md`).
- **`mockups/`:** los bocetos, páginas HTML para ver algo antes de
  construirlo ([Bocetos](#bocetos)).
- **`references/`:** lo que la persona pasa para basar el diseño: una web
  que le gusta, capturas, la guía de marca, su logo, sus fotos, un enlace a
  Figma.

Las tres últimas carpetas nacen con su primer fichero.

## Bocetos

Un boceto es una página HTML que se abre con doble clic en el navegador, sin
instalar nada ni arrancar la %%KIND%%: enseña cómo será algo antes de
construirlo. Los hace la skill `zaius-sketch`, con la identidad y los tokens
del sistema de diseño y datos de ejemplo, en `mockups/`:

- **Las direcciones de la identidad,** `mockups/identity.html`: las tres
  que propone `zaius-brand`, para elegir una. Se borra cuando se aprueba la
  guía visual.
- **La guía visual,** `mockups/design-system.html`: la documentación del
  sistema de diseño, con un menú lateral para ir a cada sección: la
  identidad, los fundamentos, cada pieza con sus estados, cuándo se usa,
  sus normas y su nombre en el código, y los cambios. Nace con `zaius-init`,
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

Un boceto se ve como será de verdad: con el logo, la letra, los colores y la
firma de la [identidad](./design-system.md#identidad), y con fotos, las de
la persona o, mientras no las pasa, unas de muestra de Unsplash. Salvo la
guía, que lleva su menú, lleva arriba una barra, con los colores y la letra
del sistema de diseño, para el ancho, el tema y los estados: en el ordenador ocupa la ventana entera, y
en la tableta y el móvil va en su marco. Sin conexión se sigue viendo
ordenado, con la letra del sistema y un fondo de color en cada foto. Un
boceto se parece a lo de verdad, pero no lo es: el aspecto de una librería
de componentes se imita con CSS, y lo que vale es la revisión visual de lo
construido.

## Una skill de diseño propia

Si la persona tiene una skill de diseño (la de su empresa, o una que usa
siempre para diseñar), se añade al proyecto y el diseño la sigue:

1. **Se copia en el proyecto,** tal cual y con sus ficheros, en
   `.claude/skills/<su-nombre>/`, para que la tenga cualquier sesión, con
   cualquier IA: no basta con que esté en el ordenador de la persona. Va con
   su nombre, sin el prefijo `zaius-`, que es del kit, y con su licencia; si
   es de una empresa, con su permiso. El kit no la toca al actualizarse.
2. **Se apunta** en «Identidad», en el
   [sistema de diseño](./design-system.md#identidad), y en `AGENTS.md`: en
   «Diseño y UX», una línea `- **Skill de diseño:** <su-nombre>, en
   .claude/skills/<su-nombre>/.`, y en «Skills del proyecto», la suya.
3. **La leen** `zaius-brand` y `zaius-sketch` antes de proponer o de
   dibujar, y cualquier sesión que diseñe o construya algo que se ve.
4. **Manda lo que fija:** su marca, su letra, sus piezas o lo que prohíbe
   cuentan como pedidos por la persona, por encima de lo que propone el kit
   (las direcciones de `zaius-brand`, «Que no salga genérico»). Si choca con
   una norma de diseño, la persona decide cuál manda, y se apunta en
   «Identidad»; la accesibilidad (D12) se cumple siempre.
5. **Con el sistema de diseño ya aprobado,** la identidad se repasa con ella
   lanzando `/zaius-brand`, que va como propuesta.

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
