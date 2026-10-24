---
name: zaius-permissions
description: Aplica los permisos de una página de la zona privada con la guía docs/guides/apply-permissions.md y lo que dice el documento aprobado de la página. Escribe su regla, una función pura con sus canX en el util de permisos de su sección, y la usa en la página, los botones, el menú y las actions, cada pieza con su test de la lista. Para si el documento no dice qué permiso decide algo.
---

# Aplicar permisos

Se usa dentro de `zaius-build`: cada paso llega con el test de la lista que
lo pide, escrito antes y visto en rojo. Aplica lo que dice el documento
aprobado de la página; un permiso que no dice no se inventa.

## Lee primero

- [Aplicar permisos](../../../docs/guides/apply-permissions.md): la guía que
  sigue esta skill.
- [Rutas y navegación](../../../docs/standards.md#rutas-y-navegación):
  la sesión, las reglas y el menú.
- [D5. Acciones](../../../docs/ux-ui/rules.md#d5-acciones): lo que no se
  permite no se ofrece.
- El documento de la página, en `docs/pages/`, aprobado, con su lista de
  tests y lo que dice en «Datos» de quién puede verla y qué puede hacer cada
  uno.

## Pasos

1. **Los `canX`,** del documento de la página: cada regla, el permiso de la
   API que mira y lo que decide. Cada una pide lo que pide el endpoint al
   que da paso, o más; nunca menos. Si el documento no lo dice, pregúntalo y
   escríbelo en él, con la fecha, antes del código.
2. **La sesión:** los permisos salen de `Astro.locals.session`, que llena el
   middleware
   ([Lo que da la sesión](../../../docs/guides/apply-permissions.md#lo-que-da-la-sesión)).
   Si aún no existe, para: llega con la primera página de la zona privada,
   la de entrar (LOGIN, `/login`), con su especificación. Una página fuera de
   la zona privada no tiene permisos, y esta skill no se aplica.
3. **La regla,** una función pura en el util de permisos de su sección
   (`src/utils/bookingPermissionUtils.ts`:
   `bookingPermissionUtils.getAccountBookingsPermissions(permissions)`), que
   recibe los permisos y devuelve los `canX`
   ([La regla](../../../docs/guides/apply-permissions.md#1-la-regla)).
4. **La página** la aplica en su frontmatter: sin `canView`, pinta el estado
   sin acceso dentro del marco, sin redirigir, y no pide lo que no se va a
   ver ([guía](../../../docs/guides/apply-permissions.md#2-la-página)). No se
   ofrece a los buscadores (`noindex`).
5. **Los botones, los enlaces y las zonas,** con los `canX` que la página
   pasa a sus componentes: lo que no se permite no se pinta, ni desactivado
   (D5); sin permiso de cambiar algo, se ve en lectura.
6. **Las actions:** cada una comprueba en su handler la sesión
   (`UNAUTHORIZED`) y su `canX` (`FORBIDDEN`) antes de llamar al service
   ([guía](../../../docs/guides/apply-permissions.md#5-las-actions)).
7. **El menú:** la entrada de la zona privada, con el mismo permiso que mira
   la página, como dice la guía; quien no la puede ver no la ve.
8. **Los tests,** los de la lista, cada uno antes que su código: la regla,
   con y sin cada permiso; la página, con la sesión del caso y sin el botón
   que no se permite; y cada action, sin sesión y sin permiso
   ([guía](../../../docs/guides/apply-permissions.md#7-los-tests-de-la-regla)).
   Si la guía pide uno que la lista no tiene, para y propón añadirlo.

## Comprobación

- [ ] Cada `canX` del documento está en la regla, con su test.
- [ ] Ninguna regla pide menos que el endpoint al que da paso.
- [ ] La página y su entrada del menú piden el mismo permiso.
- [ ] Lo que no se permite no se pinta.
- [ ] Cada action comprueba la sesión y su permiso.
- [ ] La página, con `noindex`.
- [ ] El documento de la página dice los mismos permisos que el código.
- [ ] Cada test, de la lista del documento de la página, y marcado en verde.
- [ ] `%%PM%% run typecheck`, `%%PM%% run lint` y `%%PM%% run test`, en verde.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la web, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Si falta la sesión (el middleware y `Astro.locals.session`): montarla
  necesita el OK, con la página de entrar.
- Si el documento de la página no dice qué permiso decide algo, o la API no
  lo tiene: pregunta antes de inventarlo
  ([Un permiso nuevo](../../../docs/guides/apply-permissions.md#un-permiso-nuevo)).
