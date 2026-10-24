---
name: zaius-form
description: Monta un formulario de la web (el contacto, pedir presupuesto) con una action de Astro y zod, con la guía docs/guides/create-a-form.md y lo que dice el documento aprobado de la página. Funciona sin JavaScript, con post/redirect/get, enseña el error de cada campo según D6 y manda lo que se escribe adonde dice la página, cada pieza con su test de la lista. Para si el documento no dice un campo, una regla o adónde llegan los mensajes.
---

# Crear un formulario

Se usa dentro de `zaius-build`: cada paso llega con el test de la lista que
lo pide, escrito antes y visto en rojo. Aplica lo que dice el documento
aprobado de la página; lo que no dice, no se inventa.

## Lee primero

- [Crear un formulario](../../../docs/guides/create-a-form.md): la guía
  que sigue esta skill, con
  [adónde llega el mensaje](../../../docs/guides/create-a-form.md#adónde-llega-el-mensaje)
  y [el formulario terminado](../../../docs/guides/create-a-form.md#el-formulario-terminado).
- Las normas que deciden su comportamiento:
  [D6. Formularios](../../../docs/ux-ui/rules.md#d6-formularios) y
  [D12. Accesibilidad](../../../docs/ux-ui/rules.md#d12-accesibilidad).
- [Nomenclatura](../../../docs/naming.md): los nombres de la action, el
  schema, su tipo y sus funciones.
- [Escribir tests](../../../docs/guides/write-tests.md): el test de una
  action, con `callAction`, y el de la página, con `renderAstro`.
- El documento de la página, en `docs/pages/`, aprobado, con su lista de
  tests y su apartado «Datos»: los campos, sus reglas, qué ve quien lo envía
  y adónde llega lo que se escribe.
<!-- kit:if privateArea -->
- [Aplicar permisos](../../../docs/guides/apply-permissions.md): la sesión y
  el permiso que comprueba la action de un formulario de la zona privada.
<!-- kit:end -->

## Pasos

1. **Los campos y sus reglas,** del documento de la página. Lo que no diga
   (obligatorios, máximos, el formato de un correo, un teléfono o unas
   fechas) se pregunta y se escribe en él, con la fecha, antes del código.
2. **Adónde llega,** del documento: a un correo de la casa o de la empresa,
   o a su sistema. Si no lo dice, se pregunta, con palabras de la web («¿Los
   mensajes del contacto te llegan a un correo, o a otro sitio?»), y se
   escribe en él. Un correo pide un servicio de envío de correo: es una
   dependencia nueva, con el OK, su cuenta la crea la persona, y su clave es
   secreta, nunca en el código ni en un `.env` que se versiona. Mientras se
   desarrolla, los mensajes van a una dirección de prueba
   ([guía](../../../docs/guides/create-a-form.md#adónde-llega-el-mensaje)).
3. **El schema,** `<prefijo><Qué>FormSchema`, en
   `src/actions/<prefijo>FormSchema.ts`, junto a la action que lo usa, con
   su tipo, `<Prefijo><Qué>FormValues`, por `z.infer`. Un campo vacío
   llega como `null`: el mensaje de obligatorio va en
   `z.string({ error: '…' })`, además de `.trim().min(1, '…')`
   ([guía](../../../docs/guides/create-a-form.md#1-el-schema)).
4. **Lo que se envía:** lo que ha validado el schema, entero; el correo dice
   todo lo enviado, y quien lo recibe contesta a quien lo escribió.
<!-- kit:if privateArea -->
   Si el formulario cambia algo que ya existe (en la zona privada), del
   registro al formulario y del formulario a la petición:
   `build<Prefijo><Qué>FormValues` y `build<Prefijo><Qué>Request`, en el
   objeto de utils del formulario (`accountBookingsEditFormUtils`); el alta y
   la edición usan el mismo formulario (D6).
<!-- kit:end -->
5. **El formulario,** un `<form method="POST">` con su action, en un
   componente `.astro` (`ContactForm.astro`), que funciona sin JavaScript;
   sus campos, con las piezas de
   [Piezas por papel](../../../docs/ux-ui/design-system.md#piezas-por-papel),
   cada uno con su etiqueta y su error debajo, que la página lee del
   resultado de la action
   ([guía](../../../docs/guides/create-a-form.md#2-el-formulario)).
6. **La action,** con `accept: 'form'` y el schema como `input`, en el
   fichero de su sección (`contactActions`), compuesta en
   `src/actions/index.ts`. Al enviar, post/redirect/get, que hace el
   middleware, `src/middleware.ts`, nacido con el primer formulario: si sale
   bien, redirige y la página enseña lo que pasa ahora («Te contestaremos en
   un día»), y recargar no vuelve a enviar nada; si un campo está mal, la página
   se pinta otra vez con los errores y lo escrito; si falla otra cosa, con
   el fallo encima del botón, nunca en un aviso que se va solo. «Hay N campos
   por revisar», junto al botón, y el foco, en el primer error
   ([guía](../../../docs/guides/create-a-form.md#4-enviar-el-formulario)).
   Contra el spam, el campo trampa de la guía.
<!-- kit:if privateArea -->
   En la zona privada, la action comprueba la sesión y el permiso antes de
   hacer nada
   ([Aplicar permisos](../../../docs/guides/apply-permissions.md)), y la
   variante, si la hay, va con su parte de la guía:
   [editar un registro](../../../docs/guides/create-a-form.md#editar-un-registro),
   [un modal](../../../docs/guides/create-a-form.md#formularios-en-un-modal)
   o [por partes](../../../docs/guides/create-a-form.md#formularios-por-partes).
<!-- kit:end -->
7. **Los tests,** los de la lista, cada uno antes que su código: el del
   schema; el de la action, con `callAction`, con un campo mal
   y con lo que manda adonde dice la página;
<!-- kit:if privateArea -->
   en la zona privada, también sin sesión y sin permiso;
<!-- kit:end -->
   y el de la página, con `renderAstro`, con los errores, su recuento, lo que
   se ve al enviarlo y el fallo. Si la guía pide uno que la lista no tiene,
   para y propón añadirlo.

## Comprobación

- [ ] Funciona sin JavaScript: se envía, se ven los errores y lo que pasa al
      enviarlo.
- [ ] Recargar después de enviar no vuelve a enviar nada.
- [ ] Ningún error antes del primer intento; cada campo, con su etiqueta y
      su error debajo.
- [ ] «Hay N campos por revisar» junto al botón, con el foco en el primer
      error.
- [ ] El fallo del envío se ve donde toca, con lo escrito intacto.
- [ ] Lo que se escribe llega adonde dice el documento de la página.
- [ ] Ninguna clave en el código.
- [ ] El schema y la action, con su test.
<!-- kit:if privateArea -->
- [ ] `build…FormValues` y `build…Request`, si edita algo que ya existe, con
      su test.
<!-- kit:end -->
- [ ] Cada test, de la lista del documento de la página, y marcado en verde.
- [ ] `%%PM%% run typecheck`, `%%PM%% run lint` y `%%PM%% run test`, en verde.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la web, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Si el documento de la página no dice un campo, una regla, qué ve quien lo
  envía o adónde llega: pregunta antes de escribirlo
  ([La persona decide](../../../docs/process.md#la-persona-decide)).
- Antes de añadir el servicio de envío de correo: es una dependencia nueva, y
  su cuenta la crea la persona.
- Si D6 no dice cómo se comporta algo (un campo que depende de otro, unas
  fechas): pregunta antes de escribirlo; si es una regla de diseño nueva, va
  con `zaius-design`.
- Si el sistema de diseño no tiene la pieza de un campo: apúntala en «Lo que
  falta» y pregunta antes de crearla.
