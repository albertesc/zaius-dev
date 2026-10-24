---
name: zaius-permissions
description: Aplica los permisos de una pantalla con la guía docs/guides/apply-permissions.md y lo que dice la especificación aprobada de la historia. Escribe su regla <feature>Permissions con sus canX y la usa en la guarda de la ruta, los botones, el menú y las peticiones, cada pieza con su test de la lista. Para si la especificación no dice qué permiso decide algo.
---

# Aplicar permisos

Se usa dentro de `zaius-build`: cada paso llega con el test de la lista que
lo pide, escrito antes y visto en rojo. Aplica lo que dicen la
especificación y el documento de la pantalla; un permiso que no dicen no se
inventa.

## Lee primero

- [Aplicar permisos](../../../docs/guides/apply-permissions.md): la guía que
  sigue esta skill.
- [Rutas, permisos y navegación](../../../docs/standards.md#rutas-permisos-y-navegación):
  las guardas, las reglas y el menú.
- [D5. Acciones](../../../docs/ux-ui/rules.md#d5-acciones), lo que no se
  permite no se ofrece, y
  [D7](../../../docs/ux-ui/rules.md#d7-un-registro-una-pantalla), sin
  permiso de editar, la gestión en lectura.
- La especificación de la historia, en `docs/specs/`, aprobada, con su
  lista de tests, y el apartado «Permisos» del documento de la pantalla, en
  `docs/features/`.
<!-- kit:if api -->
- El permiso de cada endpoint, en `docs/api/<zona>.md`.
<!-- kit:end -->

## Pasos

1. **Los `canX`,** del documento de la pantalla: cada regla, el permiso de
   la API que mira y lo que decide. Cada una pide lo que pide el endpoint al
   que da paso, o más; nunca menos. Si el documento no lo dice, pregúntalo y
   escríbelo en él, con la fecha, antes del código.
2. **La sesión:** los permisos salen del dominio `session`
   ([Lo que da la sesión](../../../docs/guides/apply-permissions.md#lo-que-da-la-sesión)).
   Si aún no existe, para: llega con la primera historia que pide entrar con
   usuario y contraseña (la de Acceso), con su especificación. Una app sin
   login no tiene permisos, y esta skill no se aplica.
3. **La regla,** `<feature>Permissions`, en `<feature>Permissions.ts`, junto
   a `<feature>Routes.tsx`: una función pura que recibe los permisos y
   devuelve los `canX`
   ([La regla](../../../docs/guides/apply-permissions.md#la-regla)). Si solo
   la usa la ruta, va en línea en `allowed`.
4. **La guarda:** la ruta cuelga de `SessionPermissionGuard`, con el `canView`
   de la regla en `allowed`.
5. **Los botones, las acciones de fila, las pestañas y las zonas,** con
   `useSessionPermissions(<feature>Permissions)`: lo que no se permite no se
   pinta, ni desactivado (D5); sin permiso de editar, la gestión se abre en
   lectura (D7).
6. **Las peticiones:** `enabled` con su `canX` en la consulta que pide un
   permiso, para no pedir lo que no se ve
   ([guía](../../../docs/guides/apply-permissions.md#7-las-peticiones)).
7. **El menú:** la entrada de `navigation.config.ts`, con su `allowed`, que
   repite el permiso de la ruta, porque el menú no importa de la feature.
8. **Los tests,** los de la lista, cada uno antes que su código: la regla,
   con y sin cada permiso; la página, con la sesión del caso y sin el botón
   que no se permite
   ([guía](../../../docs/guides/apply-permissions.md#9-los-tests-de-la-regla)).
   Si la guía pide uno que la lista no tiene, para y propón añadirlo.

Una regla nunca se importa de otra feature: si dos necesitan la misma, cada
una tiene la suya.

## Comprobación

- [ ] Cada `canX` del documento está en la regla, con su test.
- [ ] Ninguna regla pide menos que el endpoint al que da paso.
- [ ] Ninguna feature importa la regla de otra.
- [ ] La ruta y su entrada del menú piden el mismo permiso.
- [ ] Lo que no se permite no se pinta.
- [ ] Las consultas que piden un permiso llevan `enabled`.
- [ ] El documento de la pantalla dice los mismos permisos que el código.
- [ ] Cada test, de la lista de la especificación, y marcado en verde.
- [ ] `%%PM%% run typecheck`, `%%PM%% run lint` y `%%PM%% run test`, en verde.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Si falta el dominio `session`: un dominio nuevo necesita el OK.
- Si la especificación o el documento de la pantalla no dicen qué permiso
  decide algo, o la API no lo tiene: pregunta antes de inventarlo
  ([Un permiso nuevo](../../../docs/guides/apply-permissions.md#un-permiso-nuevo)).
<!-- kit:if api -->
  Lo que hay que pedir a la API va a `docs/api-requests.md`.
<!-- kit:end -->
