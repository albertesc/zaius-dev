---
name: zaius-publish
<!-- kit:if server -->
description: Publica la web en internet, con la persona eligiendo la plataforma (Vercel, la recomendada, Netlify, Cloudflare o un servidor con Node) y, con su OK, el adaptador de esa plataforma en lugar del de Node. Pone la dirección final para los buscadores (site, el mapa del sitio y robots.txt), la analítica del brief con lo que pide de cookies, comprueba que todo está en verde, para hasta el OK antes de subir nada, conecta el dominio y apunta en el README cómo se vuelve a publicar.
<!-- kit:else -->
description: Publica la web en internet, con la persona eligiendo dónde (Vercel, la recomendada, Netlify, Cloudflare o el alojamiento de la empresa): es estática, y vale cualquier alojamiento de páginas. Pone la dirección final para los buscadores (site, el mapa del sitio y robots.txt), la analítica del brief con lo que pide de cookies, comprueba que todo está en verde, para hasta el OK antes de subir nada, conecta el dominio y apunta en el README cómo se vuelve a publicar.
<!-- kit:end -->
disable-model-invocation: true
---

# Publicar

## Lee primero

- «Publicar», en `README.md`: si ya se ha publicado, dónde y cómo; y, en el
  mismo README, cómo se construye la web y dónde deja lo que se publica.
- [Cómo se trabaja con la IA](../../../docs/process.md): publicar siempre
  lleva el OK de la persona.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos) y el
  [backlog](../../../docs/backlog.md): lo que está «hecho» y lo que no.
- [El brief](../../../docs/brief.md), en «Al publicar»: el dominio, dónde
  se publica, si ya se sabe, y si se miden las visitas; y en «Idiomas y
  legales», las páginas legales y el aviso de cookies.
- [D14. Buscadores y compartir](../../../docs/ux-ui/rules.md#d14-buscadores-y-compartir)
  y [Crear una página](../../../docs/guides/create-a-page.md#buscadores-y-compartir):
  lo que necesita la dirección final.

## Pasos

1. **Si ya está publicada,** lo dice «Publicar» en el README: se vuelve a
   publicar como dice ahí, desde el paso 6. Para añadir el dominio a una ya
   publicada, el paso 10.
2. **Dónde,** con palabras de la web; si el brief ya lo dice en «Al
   publicar», se confirma:
<!-- kit:if server -->
   - la web tiene servidor (recibe lo que se escribe en sus formularios), así
     que no vale cualquier alojamiento: tiene que ser una plataforma que lo
     ejecute. «¿Dónde la quieres publicar?», con estas opciones: **Vercel**
     (recomendada: gratis para empezar, con una cuenta), Netlify, Cloudflare
     o **un servidor de la empresa** con Node, que es como funciona hoy;
<!-- kit:else -->
   - la web es estática (sus páginas se generan antes y se sirven tal cual),
     así que vale cualquier alojamiento de páginas. «¿Dónde la quieres
     publicar?», con estas opciones: **Vercel** (recomendada: gratis para
     empezar, con una cuenta), Netlify, Cloudflare o el alojamiento de la
     empresa;
<!-- kit:end -->
<!-- kit:if git -->
   - y cómo: **conectando el repositorio** (recomendada, si el proyecto está
     en GitHub, GitLab o Bitbucket: la plataforma publica sola cada cambio
     que se sube; si aún no lo está, primero `/zaius-git remoto`, que lanza
     la persona) o **desde este ordenador**, con una orden cada vez.
<!-- kit:else -->
   - y cómo: **desde este ordenador**, con una orden cada vez. Para que la
     plataforma publique sola cada cambio, conectando el repositorio, el
     proyecto tiene que guardar su historial con git: se añade con
     `%%KIT_RUN%% change`.
<!-- kit:end -->
3. **Lo que pide la plataforma,** con el OK, porque son ficheros del
   proyecto:
<!-- kit:if server -->
   - **el adaptador,** la pieza que hace funcionar el servidor de Astro en la
     plataforma. Hoy es el de Node (`@astrojs/node`), que se queda en un
     servidor de la empresa. En Vercel, Netlify o Cloudflare se cambia por el
     suyo: es cambiar una dependencia, con su OK. No se cambia a mano: lo
     cambia el kit, que así lo sabe y no lo vuelve a poner en la próxima
     actualización. La persona lanza, en la terminal, en la carpeta del
     proyecto, `%%KIT_RUN%% change` y elige la plataforma en «¿Dónde se va a
     publicar la web?»; el kit cambia la dependencia y `astro.config.ts` y
     pasa las comprobaciones. Después se sigue aquí.
<!-- kit:end -->
<!-- kit:if backend -->
   - la dirección de la API de verdad, `API_URL`, en `.env.production` o en
     las variables de la plataforma: si no está clara, se pregunta.
<!-- kit:end -->
<!-- kit:if !server -->
   - nada más: las páginas se generan en `dist/`, que es lo que se publica.
<!-- kit:end -->
4. **La dirección final,** para los buscadores y al compartir (D14): el
   dominio del brief o, sin él, la que da la plataforma, que se sabe al
   publicar la primera vez.
   - `site`, en `astro.config.ts`, con esa dirección (`https://casadelroble.es`):
     la usan la dirección canónica de cada página, su imagen para compartir y
     el mapa del sitio (`sitemap()`, que ya está), que se genera al compilar;
   - `public/robots.txt`, que señala el mapa
     (`Sitemap: https://<dirección>/sitemap-index.xml`);
   - las páginas que no se ofrecen a los buscadores (lo que dice «Buscadores
     y compartir» en el documento de cada una, y las de error), con
     `noindex` y fuera del mapa del sitio.
5. **Medir las visitas,** como dice el brief en «Al publicar»; si no lo
   dice, pregunta «¿Queréis saber cuánta gente entra y qué pulsa?», con
   estas opciones:
   - **una analítica sin cookies** (recomendada: la de Vercel, Plausible o
     Umami), que no necesita aviso de cookies;
   - **Google Analytics,** que usa cookies: pide el aviso de cookies, que
     pregunta antes de medir, y la página de cookies (COOKIES), que van al
     backlog con `/zaius-backlog` y se especifican con `/zaius-page` antes de
     publicar con ella;
   - **nada.**

   Con una, su script o su paquete va en `BaseLayout.astro`, con el OK,
   porque es una dependencia nueva; si se mide un clic concreto (el de
   «Reserva»), se apunta en el documento de su página. La elección va al
   brief, con la fecha.
6. **Comprueba:** `%%PM%% run typecheck`, `%%PM%% run lint`,
   `%%PM%% run test` y `%%PM%% run build`, en verde. Con algo en rojo, no se
   publica: se arregla antes. Y en el backlog, lo que no está «hecho»: una
   página a medias también se publica, y unas legales que pide el brief y no
   están, o unas cookies que se usan sin su aviso, se dicen antes del OK.
7. **Para y pide el OK:** qué se publica (las páginas hechas y, si las hay,
   las que están a medias), dónde, con qué dirección, si se miden las
   visitas y con qué, y que cualquiera con la dirección podrá verla y los
   buscadores la encontrarán.
8. **Publica.** La cuenta de la plataforma la crea la persona: la IA no la
   crea ni guarda contraseñas. Las órdenes que piden entrar con la cuenta
   las lanza la persona, en la terminal, en la carpeta del proyecto: se le
   dan listas para copiar.
<!-- kit:if git -->
   - **Conectando el repositorio:** la persona lo importa desde la web de la
     plataforma («Add new project», «Import»), con estos valores: la orden
     de build, `%%PM%% run build`, y la carpeta que se publica, `dist`
     (Vercel, Netlify y Cloudflare los reconocen solos, por Astro).
<!-- kit:if backend -->
     Y la variable con la dirección de la API, si no va en `.env.production`.
<!-- kit:end -->
<!-- kit:end -->
<!-- kit:if server -->
   - **Desde este ordenador,** en Vercel: `%%PM_DLX%% vercel login` la
     primera vez y después `%%PM_DLX%% vercel --prod`. En Netlify y en
<!-- kit:if git -->
     Cloudflare, con servidor, se publica conectando el repositorio
     (`/zaius-git remoto`, si aún no está).
<!-- kit:else -->
     Cloudflare, con servidor, se publica conectando el repositorio, que pide
     guardar el historial con git: se añade con `%%KIT_RUN%% change`.
<!-- kit:end -->
   - **En un servidor de la empresa:** se copia el proyecto construido
     (`dist/`, con `package.json` y las dependencias de producción) y se
     arranca con `node dist/server/entry.mjs`, detrás del servidor web de la
     empresa.
<!-- kit:else -->
   - **Desde este ordenador,** según la plataforma: en Vercel,
     `%%PM_DLX%% vercel login` la primera vez y después
     `%%PM_DLX%% vercel --prod`; en Netlify y en Cloudflare, se sube la
     carpeta `dist` desde su web (Netlify Drop, la subida directa de
     Cloudflare Pages); en el alojamiento de la empresa, se copia el
     contenido de `dist/`.
<!-- kit:end -->
9. **Comprueba la publicada:** abre la dirección y prueba la portada y una
   dirección interna, también al recargarla; `robots.txt` y
   `sitemap-index.xml` responden; y al pegar el enlace en un chat sale su
   imagen y su descripción.
<!-- kit:if server -->
   Envía una vez cada formulario y comprueba que llega adonde dice su
   página.
<!-- kit:end -->
10. **El dominio propio,** el del brief; si no lo dice, pregunta si tiene
    que verse en uno («¿Tenéis una dirección, como `casadelroble.es`, para
    la web?»). Con un sí:
    - se añade en la plataforma (en Vercel, en los ajustes del proyecto,
      «Domains»), que dice qué registros hay que poner en el dominio;
    - esos registros los pone la persona, o quien gestione el dominio, en su
      proveedor (donde se compró el dominio): se le dan exactos, con su
      tipo, su nombre y su valor, listos para copiar;
    - hasta que el cambio llega (de unos minutos a unas horas), la web sigue
      en la dirección de la plataforma; la plataforma pone sola el candado
      (HTTPS) cuando llega;
    - con el dominio, `site` y `robots.txt` pasan a él (paso 4), y se vuelve
      a publicar;
    - sin dominio, la web se queda en la dirección de la plataforma, y el
      dominio se puede añadir después con esta misma skill.
11. **Apunta en el README,** en «Publicar», sustituyendo el «Todavía no se
    ha publicado»: dónde está, su dirección (y su dominio, si lo tiene), si
    se miden las visitas y con qué, y cómo se vuelve a publicar. Y en «Dónde
    estamos», lo publicado, con la fecha.
12. **Cuéntalo:** la dirección publicada y cómo se publica la próxima vez
<!-- kit:if git -->
    (con el repositorio conectado, basta con que la persona suba los
    cambios).
<!-- kit:else -->
    (la misma orden, cada vez).
<!-- kit:end -->

## Comprobación

- [ ] Tipos, lint, tests y build, en verde antes de publicar.
<!-- kit:if server -->
- [ ] El adaptador de la plataforma, cambiado con `%%KIT_RUN%% change` y el
      OK, no a mano.
<!-- kit:end -->
<!-- kit:if backend -->
- [ ] `API_URL`, con la API de verdad, en `.env.production` o en las
      variables de la plataforma.
<!-- kit:end -->
- [ ] `site` y `robots.txt`, con la dirección final; lo que no es público,
      con `noindex` y fuera del mapa del sitio (D14).
- [ ] Con analítica de cookies, el aviso y la página de cookies, hechos.
- [ ] La dirección publicada carga, también una dirección interna al
      recargarla.
- [ ] Con dominio propio, los registros dados a la persona y el dominio
      apuntado en el README.
- [ ] «Publicar», en el README, dice dónde está y cómo se vuelve a publicar.
- [ ] Ninguna clave ni contraseña en el código: van en las variables de la
      plataforma.
- [ ] «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la web, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Antes de publicar: lo publicado se ve en internet y lo encuentran los
  buscadores.
<!-- kit:if server -->
- Antes de cambiar el adaptador: es una dependencia.
<!-- kit:end -->
- Antes de crear un fichero de la plataforma o de cambiar `.env.production`.
- Antes de añadir la analítica: es una dependencia y, con cookies, pide un
  aviso y su página.
- Si la plataforma pide pagar o un dato de la cuenta: lo decide la persona.
- Si falta algo que la web necesita publicada (unas legales, el aviso de
  cookies): dilo antes del OK.
- Antes de que la persona toque los registros de su dominio: lo que se
  cambia ahí afecta también a su correo si se equivoca, así que se le dan
  solo los registros que pide la plataforma.
