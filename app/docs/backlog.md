# Backlog

Estado: pendiente

Lo que hay que construir en %%APP_NAME%%: las épicas y sus historias, en el
orden en que se hacen, cada una con su estado. Sale del [brief](./brief.md) y
lo escribe `/zaius-backlog`, que también añade, cambia, parte, ordena o quita
historias, con el OK. Su estado va en la cabecera, como el del brief:
«pendiente», «por aprobar» mientras la persona lo revisa y «aprobado», con la
fecha del OK.

- **Una épica** es un tema grande de la app, con un código de tres letras en
  mayúsculas, de su nombre en inglés: Pedidos, `ORD`; Facturas, `INV`;
  Envíos, `SHP`; Clientes, `CUS`; Acceso, `ACC`. No es una familia de
  pantallas: una historia de Pedidos puede tocar pantallas de varias
  familias.
- **Una historia** es algo que una persona puede hacer con la app y que se
  entrega entero. Su código son las tres letras de su épica y tres cifras:
  `ORD001`, `ORD002`. Las letras no cambian y los números no se reutilizan:
  el de una historia que se quita no lo vuelve a usar ninguna.
- **Cada historia tiene su fichero** en `docs/specs/`, que empieza por su
  código y sigue con su tema en inglés (`docs/specs/ORD001-list-orders.md`).
  Lo crea `/zaius-backlog` al apuntarla, en «pendiente», y lo completa
  `/zaius-spec`. Con `@`, Claude Code y opencode las listan
  (`/zaius-spec @docs/specs/ORD`).
- **Su estado** va en la cabecera de su fichero, con la fecha, y se repite
  aquí: pendiente, por aprobar, aprobada, en curso, por cerrar y hecha
  ([Los estados](./process.md#los-estados-de-una-historia)).
- **La primera historia es el esqueleto que anda:** la parte más pequeña de
  la app que ya funciona de principio a fin (el marco, una pantalla con sus
  datos y, si hay login, la entrada), sobre la que crecen las demás.

**En esta página:** [Cómo se escribe](#cómo-se-escribe), [Épicas](#épicas), [Quitadas](#quitadas)

## Cómo se escribe

Se escribe para que se entienda sin saber programar: es lo que la persona
aprueba. En «Épicas», una sección por épica, en el orden en que se empiezan,
y debajo una línea por historia, en el orden en que se hacen:

```markdown
### Pedidos (ORD)

- **ORD001** Como responsable de almacén, quiero ver los pedidos de mi almacén, para saber cuáles hay que preparar hoy. Estado: pendiente.
- **ORD002** Como responsable de almacén, quiero filtrar los pedidos por estado, para encontrar los atrasados. Requiere: ORD001. Estado: pendiente.
```

- **La historia,** en una frase: «Como <quién>, quiero <qué>, para <para
  qué>.», con las palabras de quien usa la app, sin jerga. El quién es el
  tipo de usuario («Como responsable de almacén») o, si hay uno solo, «Como
  usuario».
- **Requiere:** las historias que tienen que estar hechas antes, por su
  código. Si no requiere ninguna, no lo lleva.
- **El estado,** al final, como «Estado: <estado>.», el mismo que dice su
  fichero.

## Épicas

Pendiente: lo escribe `/zaius-backlog`.

## Quitadas

Las historias que se han quitado, con su código, la fecha y el porqué: así su
número no lo vuelve a usar ninguna. Ninguna todavía.
