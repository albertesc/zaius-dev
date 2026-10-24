# API

Lo que la API tiene hoy, endpoint a endpoint: qué pide, qué devuelve, qué
errores da y qué rarezas tiene, agrupado por zona. Cada endpoint sale del
código del servidor o de lo que se ha visto contra la API en marcha, y se
contrasta con lo que hace la app (la sección «Datos» de cada feature). Si un
documento de feature contradice al servidor, vale el servidor.

Lo que la app necesita que cambie está aparte, en
[Peticiones a la API](../api-requests.md): aquí no se repite, se enlaza desde
la rareza que lo motiva.
<!-- kit:if mocks -->
Los mocks imitan lo que dice este documento, y lo que la app usa y la API aún
no tiene lo responde un mock que imita el contrato propuesto
([Lo propuesto](#lo-propuesto)).
<!-- kit:end -->

<!-- kit:if mocks -->
Cada documento basta para escribir, sin mirar el servidor, un service con el
schema de su respuesta y un mock fiel de cada endpoint de su zona. Las
convenciones que valen para todos están en este documento, una sola vez.
<!-- kit:else -->
Cada documento basta para escribir, sin mirar el servidor, un service con el
schema de su respuesta para cada endpoint de su zona. Las convenciones que
valen para todos están en este documento, una sola vez.
<!-- kit:end -->

Lo escribe y lo pone al día la skill `zaius-api`.

**En esta página:** [Cómo se lee un documento](#cómo-se-lee-un-documento) · [Sin verificar](#sin-verificar) · [Base y cabeceras](#base-y-cabeceras) · [Sesión y token](#sesión-y-token) · [Errores](#errores) · [Fechas](#fechas) · [Paginación](#paginación) · [Idioma](#idioma) · [Ficheros](#ficheros) · [Las zonas](#las-zonas) · [Lo propuesto](#lo-propuesto)

## Cómo se lee un documento

Todos tienen la misma forma, un fichero por zona (`docs/api/<zona>.md`):

```text
# API: <zona>

<Qué sirven estos endpoints.>

**En esta página:** Endpoints · Rarezas comunes · <cada grupo> · Propuestos (no existen)

## Endpoints

| Método | Ruta | Permiso | Para qué | Lo usan |
|---|---|---|---|---|
| `GET` | `/orders/{id}` | `ORDERS.VIEW` | Leer un pedido entero | `ordersEdit`, `orders` |

## Rarezas comunes

<Lo que vale para todos los endpoints de la zona.>

## <grupo de endpoints>

### `GET /orders/{id}`

- **Pide.** …
- **Devuelve.** …
- **Errores.** …
- **Rarezas.** …

## Propuestos (no existen)
```

- **Ruta.** Como la enruta el servidor, en la forma que usa la app. `{id}` es
  un parámetro de ruta y `?x=`, un `query`.
- **Permiso.** El código que pide el servidor (`ORDERS.VIEW`); con varios, se
  dice si vale cualquiera o hacen falta todos. «Solo sesión» pide un token
  válido y ningún permiso; «sin sesión», ni eso.
- **Lo usan.** Las features que lo llaman, por su nombre (`orders`);
  «ninguna» si hoy no lo llama ninguna.
- **Rarezas comunes.** Lo que vale para toda la zona, una vez, en lugar de en
  cada endpoint.
- **Pide y devuelve.** En bloques `ts` con solo tipos, uno por forma, y la
  explicación en viñetas debajo. `T | null` es un campo que llega y puede ser
  `null`; `campo?:` es uno que puede no mandarse. Los nombres son los que
  viajan, con sus erratas.
- **Errores.** El estado y el código de cada uno, y cuándo salen. Los que
  valen para todos no se repiten ([Errores](#errores)).
- **Rarezas.** Lo observable: qué ignora, qué pisa, qué no valida, qué hace a
  medias. Si ya hay una petición, se enlaza.
- **Textos de la interfaz.** Entre «», como se leen en la pantalla.
- **Tamaño.** Un documento de más de unas 500 líneas se parte en
  `<zona><Parte>.md`, con las partes enlazadas entre sí.

## Sin verificar

Nunca se adivina. Lo que no se ha podido comprobar en el código del servidor
ni contra la API en marcha se escribe con «Sin verificar» y lo que falta para
comprobarlo («Sin verificar: qué estado devuelve al pasarse del tamaño
máximo»). Cada documento dice al principio de dónde sale y cuándo se
comprobó; al comprobarlo, la marca se quita y el texto dice lo que se vio.

## Base y cabeceras

Pendiente: de dónde cuelgan las rutas (`VITE_API_URL`, con prefijo o versión),
las cabeceras que se mandan y cómo responde lo que no tiene cuerpo.

## Sesión y token

Pendiente: cómo se entra y qué devuelve la entrada, dónde va el token y cuánto
dura, qué endpoints no lo piden, cómo son los permisos y qué estado da el
servidor sin sesión o sin un permiso.

## Errores

Pendiente: la forma del cuerpo de un error, qué estado da cada clase de fallo,
qué código trae y en qué idioma llega el mensaje.

## Fechas

Pendiente: cómo viaja una fecha y una fecha con hora (texto ISO, milisegundos),
en qué zona horaria, y cómo viajan los enumerados y los nulos.

## Paginación

Pendiente: el cuerpo de una petición paginada (página, tamaño, búsqueda,
orden y filtros), sus límites y la forma de la página que devuelve.

## Idioma

Pendiente: cómo elige el servidor el idioma de sus textos (una cabecera, un
parámetro, una cookie) y qué traduce.

## Ficheros

Pendiente: cómo se sube un fichero (multipart o dentro de un JSON), el tamaño
máximo y cómo llega una descarga.

Cuando una convención no es la que espera el transporte de la app (la forma
del error, qué cierra la sesión, la forma de una página o el idioma que se
manda), se adapta el transporte (`src/utils/api*Utils.ts`) como dice
[Añadir un servicio](../guides/add-a-service.md), no cada service.

## Las zonas

| Zona | Documento | Qué tiene |
|---|---|---|

## Lo propuesto

<!-- kit:if mocks -->
Un endpoint que la app usa y el servidor no tiene (lo responde un mock) no
está en las tablas de lo que hay. Va al final de su zona, en «Propuestos (no
existen)», con su contrato completo (lo que la app manda y espera) y el
enlace a su petición en [Peticiones a la API](../api-requests.md). El mock
imita ese contrato.
<!-- kit:else -->
Un endpoint que la app necesita y el servidor no tiene no está en las tablas
de lo que hay. Va al final de su zona, en «Propuestos (no existen)», con su
contrato completo (lo que la app mandará y espera) y el enlace a su petición
en [Peticiones a la API](../api-requests.md).
<!-- kit:end -->

Un endpoint que existe pero hay que cambiar sí está en la tabla de lo que hay,
y la petición se enlaza en sus rarezas. Cuando la API cumple una petición, se
marca en ese documento y el cambio pasa a la zona que corresponde.
