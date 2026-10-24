---
name: zaius-backlog
description: Escribe con la persona el backlog de la app, después de zaius-init. Habla la idea, pregunta las decisiones caras que falten en el brief y propone las épicas, cada una con sus tres letras, y sus historias de usuario («Como…, quiero…, para…»), verticales y sin historias técnicas, la primera el esqueleto que ya se usa de punta a punta. Deja docs/backlog.md y el fichero de cada historia en docs/specs/, «pendiente», y para hasta el OK. Se vuelve a lanzar para añadir, cambiar, partir, ordenar o quitar historias.
disable-model-invocation: true
---

# Escribir el backlog

El backlog es la lista de lo que se va a construir, en historias de usuario:
lo que alguien quiere hacer con la app y para qué. Cada historia se refina
después, de una en una, con `/zaius-spec`.

## Lee primero

- [AGENTS.md](../../../AGENTS.md), entero, y
  [Cómo se trabaja con la IA](../../../docs/process.md): la persona decide,
  hablar con la persona e iterar.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).
- [El brief](../../../docs/brief.md): para qué es la app, quién la usa, qué
  entra y qué no, y sus decisiones caras.
- [El backlog](../../../docs/backlog.md), con su forma, y los ficheros de
  `docs/specs/`, si ya hay historias.
- El [índice de pantallas](../../../docs/features/README.md) y su código, si
  ya hay pantallas hechas.

## Antes de empezar

1. **El brief:** si su cabecera no dice «Estado: aprobado el …», para:
   primero, `/zaius-init`.
2. **Lo que se pide:** sin historias en el backlog, se escribe entero, desde
   el paso 1. Con historias, es un cambio:
   [Cambiar el backlog](#cambiar-el-backlog).
<!-- kit:if existing -->
3. **Lo que ya existe:** las historias que el proyecto ya tenía las apunta
   `zaius-adopt`, «hechas». Las nuevas van detrás, con el número siguiente
   de su épica.
<!-- kit:end -->

## Cómo es una épica

- **Un tema de la app,** por lo que se consigue en él: Pedidos, Facturas,
  Envíos, Clientes, Acceso. No es una familia de pantallas: una épica puede
  tocar varias pantallas, y una pantalla, varias épicas.
- **Sus tres letras,** en mayúsculas, de su nombre en inglés: ORD (Pedidos),
  INV (Facturas), SHP (Envíos), CUS (Clientes), ACC (Acceso). No cambian
  nunca, aunque cambie su nombre.

## Cómo es una historia

- **Una línea:** «Como <quién>, quiero <qué>, para <para qué>.» Sin criterios
  ni estimaciones: los criterios llegan con `/zaius-spec`.
- **Vertical:** atraviesa todo lo que hace falta para usarla (lo que se ve,
  sus datos, lo que se guarda), y al terminarla alguien la puede usar. «La
  tabla de pedidos», sin sus datos, no es una historia; «ver los pedidos de
  mi almacén», sí.
- **Nunca técnica:** quien la pide es alguien que usa la app (quien lleva los
  pedidos, quien factura, un cliente), nunca quien la programa ni «el
  sistema». Lo de debajo (el menú, la conexión con la API, una pieza
  compartida) se construye dentro de la primera historia que lo necesita.
- **La primera, el esqueleto que anda:** lo más pequeño que ya funciona de
  principio a fin (el marco, una pantalla con sus datos y, si hay login, la
  entrada), sin filtros ni detalle. Las demás crecen sobre ella.
- **Pocas al principio:** de 10 a 15. Las demás llegan cuando se sepa más.
- **«Requiere»,** solo cuando una no tiene sentido sin otra, que tiene que
  estar hecha antes («Requiere: ORD001»). Sin ninguna, no lo lleva: el orden
  del backlog ya dice qué va antes.
- **Su código:** las tres letras de su épica y tres cifras, seguidas dentro
  de la épica (ORD001, ORD002). Un número no se vuelve a usar, aunque la
  historia se quite.
- **Sin pantallas:** sus nombres, sus URL y sus familias llegan con
  `/zaius-spec`.

## Pasos

1. **La idea, hablada,** una pregunta cada vez, con la opción recomendada
   primero y «No lo sé», que se queda con la recomendada: quién hace qué con
   la app, qué necesita hacer primero y qué puede esperar. Lo que ya dice el
   brief no se vuelve a preguntar. Nunca se inventa una historia que nadie ha
   pedido: si parece que falta algo, se pregunta.
2. **Las decisiones caras,** en un proyecto nuevo, si el brief aún no las
   tiene: si la usarán varias organizaciones, cada una con sus datos; si hay
   roles y permisos; si se usa sin conexión; si va en varios idiomas o
   monedas. Se preguntan, con lo que cambia con cada respuesta, y no se
   diseñan. Cada respuesta va al brief en el momento, con la fecha.
3. **Las épicas y sus historias,** en el orden en que se construirían, la
   primera el esqueleto, escritas en el backlog en cuanto hay una primera
   versión, con «Estado: por aprobar» debajo del título, como en el brief,
   y ajustadas en él con la persona: así una sesión nueva sigue desde ahí.
   - `docs/backlog.md`, con la forma de su «Cómo se escribe»: el
     «Pendiente» de «Épicas», cambiado por una sección por épica,
     `### <Épica> · <XXX>`, con una línea por historia y su estado al final:

     ```markdown
     ### Pedidos · ORD

     - **ORD001** Como responsable de almacén, quiero ver los pedidos de mi almacén, para saber cuáles hay que preparar hoy. · pendiente
     - **ORD002** Como responsable de almacén, quiero filtrar los pedidos por estado, para encontrar los atrasados. Requiere: ORD001 · pendiente

     ### Facturas · INV

     - **INV001** Como responsable de facturación, quiero facturar un pedido entregado, para cobrarlo. Requiere: ORD001 · pendiente
     ```

   - el fichero de cada historia, `docs/specs/<código>-<tema>.md`, con el
     tema en inglés, en minúsculas y con guiones
     (`docs/specs/ORD001-list-orders.md`): su cabecera y su historia, nada
     más; lo demás lo escribe `/zaius-spec`. Empieza por el código para que
     el `@` las liste (`/zaius-spec @docs/specs/ORD`). «Requiere», en la
     cabecera, solo si lo lleva en el backlog
     («Épica: Pedidos (ORD) · Requiere: ORD001 · Estado: …»).

     ```markdown
     # ORD001 Ver los pedidos del almacén

     Épica: Pedidos (ORD) · Estado: pendiente el AAAA-MM-DD

     ## Historia

     Como responsable de almacén, quiero ver los pedidos de mi almacén, para
     saber cuáles hay que preparar hoy.
     ```

4. **El OK:** cuéntale a la persona, en unas líneas, las épicas, cuántas
   historias hay, la primera y lo que se podrá hacer con ella, y dónde está
   el backlog. Lo que pida se cambia en el mismo fichero hasta su sí. Con el
   OK, «Estado: aprobado el AAAA-MM-DD», con su fecha. Las historias siguen
   «pendiente».
5. **«Dónde estamos»:** el backlog aprobado, con su fecha, y lo siguiente,
   `/zaius-spec ORD001` con la primera historia, que lanza la persona. Para:
   no especifica ninguna historia.

## Cambiar el backlog

Cada cambio va en el backlog y en el fichero de la historia. Mientras
espera el OK, el backlog dice «Estado: por aprobar»; con el OK, «aprobado»,
con la fecha nueva, y «Dónde estamos», al día.

- **Añadir:** el número siguiente de su épica (el más alto que se haya
  usado, contando las quitadas), «pendiente», con su fichero. Una épica
  nueva, con sus tres letras.
- **Cambiar:** su línea y la historia de su fichero. Si ya tiene
  especificación, el cambio se hace con `/zaius-spec <código>`. Una «hecha»
  no se cambia: lo nuevo es otra historia.
- **Partir:** la historia se queda con su código y su primera parte; las
  demás, con el número siguiente, «pendiente», con «Requiere» si lo
  necesitan. Si ya tenía especificación, lo que se va a otra parte sale de
  ella.
- **Ordenar:** se mueven las líneas; los códigos no cambian.
- **Quitar:** una «pendiente», con su línea y su fichero. Si tiene trabajo
  hecho (desde «por aprobar»), pregunta antes, con lo que se pierde: su
  especificación, su boceto y, si ya lo hay, su código, que se quita con otra
  historia. Su código no se vuelve a usar: su línea pasa a «Quitadas», al
  final del backlog, con la fecha y el porqué.

## Comprobación

- [ ] Cada historia, en una línea, «Como…, quiero…, para…», con quien usa la
      app delante; ninguna técnica.
- [ ] La primera, el esqueleto, que ya se usa de punta a punta.
- [ ] Cada código, con las tres letras de su épica; ninguno repetido ni
      reutilizado.
- [ ] Cada historia, con su fichero en `docs/specs/`, que empieza por su
      código, y el mismo estado en el fichero y en el backlog.
- [ ] «Requiere», solo donde una no tiene sentido sin otra.
- [ ] Ningún criterio, estimación ni pantalla.
- [ ] Las decisiones caras, en el brief.
- [ ] El OK, con su fecha, y «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el backlog escrito: la persona lo aprueba o pide cambios, en el mismo
  fichero hasta su sí.
- Antes de quitar una historia con trabajo hecho.
- Si una historia pide algo que el brief deja fuera: dilo. O se cambia el
  brief, con `/zaius-init`, o la historia se queda fuera.
- Si no está claro quién la usa o para qué: pregunta; no lo inventes.
- Al terminar: no especifica ni construye nada. La etapa siguiente la lanza
  la persona.
