---
name: zaius-publish
description: Publica la app en internet, con la persona eligiendo dónde (Vercel, la recomendada, u otra). La deja lista como app de una sola página, con la dirección de la API de producción, comprueba que todo está en verde, para hasta el OK antes de subir nada, conecta el dominio de la empresa si lo hay, da la dirección publicada y apunta en el README cómo se vuelve a publicar.
disable-model-invocation: true
---

# Publicar

## Lee primero

- «Publicar», en `README.md`: si ya se ha publicado, dónde y cómo.
- «Arrancar la app», en `README.md`: el build, los `.env` de cada modo y
  dónde deja lo que se publica.
- [Cómo se trabaja con la IA](../../../docs/process.md): publicar siempre
  lleva el OK de la persona.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos) y el
  [backlog](../../../docs/backlog.md): lo que está «hecho» y lo que no.
<!-- kit:if api -->
- [API](../../../docs/api/README.md), en «Base y cabeceras»: la dirección de
  la API, y [Peticiones a la API](../../../docs/api-requests.md): lo que la
  API aún no da.
<!-- kit:end -->

## Pasos

1. **Si ya está publicada,** lo dice «Publicar» en el README: se vuelve a
   publicar como dice ahí, desde el paso 4. Para añadir el dominio a una ya
   publicada, el paso 8.
2. **Dónde,** con palabras de la app:
   - «¿Dónde la quieres publicar?», con estas opciones: **Vercel**
     (recomendada: gratis para empezar, con una cuenta), Netlify, Cloudflare
     o un servidor de la empresa;
   - y cómo: **conectando el repositorio** (recomendada, si el proyecto está
     en GitHub, GitLab o Bitbucket: la plataforma publica sola cada cambio
     que se sube) o **desde este ordenador**, con una orden cada vez.
3. **Lo que pide la plataforma,** con el OK, porque son ficheros del
   proyecto:
   - es una app de una sola página: cada dirección tiene que llegar a
     `index.html`. En Vercel, un `vercel.json` con
     `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`;
     en Netlify, `public/_redirects` con `/* /index.html 200`; Cloudflare lo
     hace solo; en un servidor propio, su regla equivalente;
   - la dirección de la API de producción, `VITE_API_URL`, en
     `.env.production`: si no está clara, se pregunta. Si la API está en
     otro dominio, tiene que aceptar las llamadas de la app (lo que se llama
     CORS): lo cambia quien lleva la API, y se le dice;
<!-- kit:if mocks -->
   - sin los datos de ejemplo: `VITE_USE_MOCKS=false` en `.env.production`.
     Lo que hoy solo funciona con los mocks, porque la API aún no lo da, no
     funcionará publicado: se dice antes del OK, con la lista.
<!-- kit:end -->
4. **Comprueba:** `%%PM%% run typecheck`, `%%PM%% run lint`,
   `%%PM%% run test` y `%%PM%% run build`, en verde. Con algo en rojo, no se
   publica: se arregla antes.
<!-- kit:if mocks -->
   El build no lleva los mocks: en `dist/assets/` no sale ningún
   `apiMockUtils`.
<!-- kit:end -->
5. **Para y pide el OK:** qué se publica (la versión de hoy, con las
   historias hechas hasta ahora y sin las que están a medias), dónde, contra
   qué API y que cualquiera con la dirección podrá abrirla.
6. **Publica.** La cuenta de la plataforma la crea la persona: la IA no la
   crea ni guarda contraseñas. Las órdenes que piden entrar con la cuenta
   las lanza la persona, en la terminal, en la carpeta del proyecto: se le
   dan listas para copiar.
   - **Conectando el repositorio:** la persona lo importa desde la web de la
     plataforma («Add new project», «Import»), con estos valores: la orden
     de build, `%%PM%% run build`, y la carpeta que se publica, `dist`
     (Vercel y Netlify los reconocen solos, por Vite);
     y la variable con la dirección de la API, si no va en `.env.production`.
   - **Desde este ordenador,** según la plataforma: en Vercel,
     `%%PM_DLX%% vercel login` la primera vez y después
     `%%PM_DLX%% vercel --prod`; en Netlify y en Cloudflare, se sube la
     carpeta `dist` desde su web (Netlify Drop, la subida directa de
     Cloudflare Pages); en un servidor de la empresa, se copia el contenido
     de `dist/`.
7. **Comprueba la publicada:** abre la dirección que da la plataforma y
   prueba la entrada, una dirección interna, también al recargarla, y que los
   datos llegan de la API de verdad.
8. **El dominio propio:** pregunta si tiene que verse en un dominio de la
   empresa («¿Tenéis un dominio, como `pedidos.empresa.es`, para la app?»).
   Con un sí:
   - se añade en la plataforma (en Vercel, en los ajustes del proyecto,
     «Domains»), que dice qué registros hay que poner en el dominio;
   - esos registros los pone la persona, o quien gestione el dominio, en su
     proveedor (donde se compró el dominio): se le dan exactos, con su tipo,
     su nombre y su valor, listos para copiar;
   - hasta que el cambio llega (de unos minutos a unas horas), la app sigue
     en la dirección de la plataforma; la plataforma pone sola el candado
     (HTTPS) cuando llega;
   - sin dominio, la app se queda en la dirección de la plataforma, y el
     dominio se puede añadir después con esta misma skill.
9. **Apunta en el README,** en «Publicar», sustituyendo el «Todavía no se
   ha publicado»: dónde está, su dirección (y su dominio, si lo tiene),
   contra qué API y cómo se vuelve a publicar. Y en «Dónde estamos», lo
   publicado, con la fecha.
10. **Cuéntalo:** la dirección publicada y cómo se publica la próxima vez
    (con el repositorio conectado, basta con subir los cambios).

## Comprobación

- [ ] Tipos, lint, tests y build, en verde antes de publicar.
- [ ] `VITE_API_URL`, con la API de producción, en `.env.production` o en
      las variables de la plataforma.
<!-- kit:if mocks -->
- [ ] El build, sin los mocks.
<!-- kit:end -->
- [ ] La dirección publicada carga, también una dirección interna al
      recargarla, con los datos de la API de verdad.
- [ ] Con dominio propio, los registros dados a la persona y el dominio
      apuntado en el README.
- [ ] «Publicar», en el README, dice dónde está y cómo se vuelve a publicar.
- [ ] Ninguna clave ni contraseña en el código: van en las variables de la
      plataforma.
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la app, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Antes de publicar: lo publicado se ve en internet.
- Antes de crear un fichero de la plataforma o de cambiar `.env.production`.
- Si la plataforma pide pagar o un dato de la cuenta: lo decide la persona.
- Si algo de lo hecho no funcionará publicado (la API aún no lo da): dilo
  antes del OK.
- Antes de que la persona toque los registros de su dominio: lo que se
  cambia ahí afecta también a su correo si se equivoca, así que se le dan
  solo los registros que pide la plataforma.
