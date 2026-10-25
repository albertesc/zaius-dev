---
name: zaius-git
description: El repositorio git de la %%KIND%%, cuando la persona lo pide. Conecta el remoto (GitHub, GitLab, Bitbucket), apunta cómo se trabaja con ramas, monta el CI y, solo si se le pide expresamente, hace el commit, el push o el pull request, con su mensaje y un resumen de lo hecho. Cada paso, con el OK; nunca reescribe el historial.
disable-model-invocation: true
argument-hint: <remoto | ramas | ci | commit | push | pr>
---

# El repositorio git

Los commits y los push los hace la persona: la IA propone el mensaje al cerrar
cada %%UNIT%% y solo los hace si se lo piden. Esta skill es para lo que se
monta una vez (el remoto, las ramas, el CI) y para cuando la persona pide
expresamente un commit, un push o un pull request.

## Lee primero

- [Git](../../../AGENTS.md#git), en `AGENTS.md`: las reglas y cómo trabaja
  este proyecto (el remoto, las ramas, el CI).
- [La persona decide](../../../docs/process.md#la-persona-decide) y
  [Hablar con la persona](../../../docs/process.md#hablar-con-la-persona).
- [Comprobar un cambio](../../../AGENTS.md#comprobar-un-cambio): las
  comprobaciones, que van en verde antes de un commit y en el CI.
- [Dónde estamos](../../../docs/next-steps.md#dónde-estamos).

## Qué se pide

Lo que dice la persona: `/zaius-git remoto`, `ramas`, `ci`, `commit`, `push`
o `pr`, o con sus palabras («súbelo a GitHub», «haz el commit y súbelo»). Sin
nada, cuenta cómo está (el paso 1) y pregunta qué quiere, con lo que falta
como opciones.

1. **Cómo está,** sin cambiar nada: `git status`, la rama
   (`git branch --show-current`), el último commit (`git log -1 --oneline`;
   sin ninguno, dilo), el remoto (`git remote -v`), los ficheros del CI
   (`.github/workflows/`, `.gitlab-ci.yml`, `bitbucket-pipelines.yml`) y
   [Git](../../../AGENTS.md#git).
2. **Lo que se pide,** con su apartado de abajo.
3. **[Git](../../../AGENTS.md#git), al día** con lo decidido, y «Dónde
   estamos», con lo que sigue. Para.

## El remoto

Para tener una copia fuera de este ordenador, trabajar entre varias personas
o publicar «conectando el repositorio» (`/zaius-publish`).

1. **Si ya hay uno** (`git remote -v`), apúntalo en Git y termina.
2. **Dónde,** con palabras de la %%KIND%%: «¿Dónde guardamos la copia del
   proyecto?», con **GitHub** (recomendada: gratis, y las plataformas en las
   que se publica lo conectan solas), GitLab, Bitbucket o el servidor de la
   empresa. Y si se ve: **privado** (recomendada: solo quien invites) o
   público.
3. **El repositorio vacío:** la cuenta y el repositorio los crea la persona,
   en la web de la plataforma, sin README, `.gitignore` ni licencia (el
   proyecto ya los tiene), y te pega su dirección. Con GitHub y la orden `gh`
   instalada y con la sesión abierta (`gh auth status`), puedes ofrecerte a
   crearlo tú, con el OK: `gh repo create <nombre> --private --source .
   --remote origin`, que no sube nada.
4. **Conectarlo,** con el OK: `git remote add origin <dirección>`. La
   dirección va sin usuario ni contraseña: la IA nunca pide, escribe ni
   guarda una contraseña o un token; la sesión la abre la persona (con
   `gh auth login` o con lo que le pida git la primera vez).
5. **La primera subida:** sin ningún commit no hay nada que subir. Dale las
   órdenes, listas para copiar en la terminal, en la carpeta del proyecto
   (`git add -A`, `git commit -m "<mensaje>"` y
   `git push -u origin <rama>`), o hazlo tú si te lo pide (Un commit, un push o
   un pull request).

## Las ramas

Cómo se trabaja depende del proyecto: pregunta, con lo que cambia con cada
opción.

- **Todo en la rama principal** (recomendada si trabaja una persona sola):
  cada %%UNIT%% cerrada, un commit en ella.
- **Una rama por %%UNIT%%,** que se une a la principal con un pull request
  cuando está hecha (si trabajan varias personas o alguien revisa antes): su
  nombre, el código y el título corto de la %%UNIT%%, en minúsculas y con
  guiones.
- **La que ya usa la empresa:** se apunta tal cual, con sus nombres y quién
  une las ramas.

Lo decidido va a Git. Con ramas, `zaius-build` lo recuerda al empezar cada
%%UNIT%%: la rama la crea la persona, o la IA si se lo pide.

## El CI

Solo si se pide: las comprobaciones de
[Comprobar un cambio](../../../AGENTS.md#comprobar-un-cambio) pasan solas en
la plataforma con cada subida y cada pull request, y la plataforma avisa si
algo falla. Es un fichero del proyecto: con el OK.

- **En GitHub,** `.github/workflows/checks.yml`. Las versiones de las
  acciones, las últimas: se miran en su página antes de escribirlo.

  ```yaml
  name: Comprobaciones
  on: [push, pull_request]
  jobs:
    checks:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v6
<!-- kit:if pnpm -->
        - uses: pnpm/action-setup@v6
          with:
            version: <la de pnpm --version>
<!-- kit:end -->
<!-- kit:if bun -->
        - uses: oven-sh/setup-bun@v2
<!-- kit:else -->
<!-- kit:if yarn -->
        - run: corepack enable
<!-- kit:end -->
        - uses: actions/setup-node@v6
          with:
            node-version: lts/*
            cache: %%PM%%
<!-- kit:end -->
<!-- kit:if npm -->
        - run: npm ci
<!-- kit:end -->
<!-- kit:if pnpm -->
        - run: pnpm install --frozen-lockfile
<!-- kit:end -->
<!-- kit:if yarn -->
        - run: yarn install --immutable
<!-- kit:end -->
<!-- kit:if bun -->
        - run: bun install --frozen-lockfile
<!-- kit:end -->
        - run: %%PM%% run typecheck
        - run: %%PM%% run lint
        - run: %%PM%% run test
        - run: %%PM%% run build
  ```

<!-- kit:if yarn -->
  Con Yarn 1, la instalación es `yarn install --frozen-lockfile`.
<!-- kit:end -->
- **En GitLab,** `.gitlab-ci.yml`, con la imagen `node:lts` y las mismas
  órdenes; **en Bitbucket,** `bitbucket-pipelines.yml`, igual.
- **Lo que necesita la build** que no está en el repositorio (una variable
  de `.env*.local`) va en los secretos de la plataforma: lo pone la persona,
  con su nombre y sin su valor en el chat.
- **La primera vez,** la persona sube el fichero y mira en la plataforma que
  sale en verde («Actions», en GitHub). Si falla, que te pegue el error.

## Un commit, un push o un pull request

Solo cuando la persona lo pide expresamente, y para lo que pide: «haz el
commit» no es «súbelo», y lo pedido vale para esa vez.

1. **Lo que entra:** `git status` y `git diff`. Entra lo de la %%UNIT%% o el
   cambio del que se habla. Para y pregunta si hay algo más: cambios que no
   son de esto, un `.kit-new`, un fichero con contraseñas o claves
   (`.env*.local`) o algo que `.gitignore` debería dejar fuera.
2. **Las comprobaciones,** en verde: `%%PM%% run typecheck`,
   `%%PM%% run lint`, `%%PM%% run test` y `%%PM%% run build`. Con algo en
   rojo no hay commit: dilo, y solo se hace si la persona lo pide sabiéndolo
   (y el mensaje lo dice).
3. **La rama:** la que toca según Git. Si el proyecto trabaja con ramas y se
   está en la principal, para y pregunta.
4. **El mensaje,** como dice [Git](../../../AGENTS.md#git): el que propuso
   `zaius-review` o, si no, uno nuevo con esa forma. Sin ninguna línea de la
   IA: ni `Co-Authored-By` ni «Generated with…».
5. **El commit:** `git add` con cada fichero por su nombre, nunca a ciegas, y
   `git commit`.
6. **El push,** si lo ha pedido: `git push` (la primera vez de una rama,
   `git push -u origin <rama>`). Si lo rechaza porque el remoto tiene cambios
   que no están aquí, para: nunca `--force`. Cuéntalo y propón traerlos
   (`git pull`), con su OK.
7. **El pull request,** si lo ha pedido y el proyecto trabaja con ramas: con
   `gh pr create --title "<título>" --body-file <fichero>` si `gh` está
   instalado y con la sesión abierta; si no, el enlace para abrirlo en la web
   y el texto, listo para pegar.
8. **Cuéntalo,** así:

   ```text
   Hecho: <commit | commit y push | commit, push y pull request> de <código> <título>.
   Commit <hash corto> en <rama>: «<primera línea del mensaje>».
   Entran <N> ficheros: <lo que entra, con palabras de la %%KIND%%: la %%UNIT%%, sus tests, su documento, el backlog>.
   Tipos, lint, tests y build, en verde antes del commit.
   Subido a <remoto>, en <rama>: <enlace a la rama o al commit>.
   Pull request: <enlace>.
   Fuera del commit: <lo que se ha dejado y por qué, o «nada»>.
   Lo siguiente: <unir el pull request cuando lo revisen, publicar o la próxima %%UNIT%%>.
   ```

   Sin push, sin pull request o sin nada fuera, esas líneas no van.

El texto del pull request, también sin ninguna línea de la IA:

```markdown
## <código> <título>

<Para qué: una o dos frases, con palabras de la %%KIND%%.>

### Qué cambia

- <lo que se ve o se puede hacer ahora>

### Cómo se ha comprobado

- [x] Tipos, lint, tests (<N> nuevos) y build, en verde
- [x] Revisión contra las normas, sin el contexto de la conversación (`/zaius-review`)
- [ ] <lo que falta verificar a mano, de su fichero>

### Para verlo

<la dirección de la vista previa, si la plataforma la da; si no, cómo
arrancarlo y adónde ir>

### Documentos

- <el fichero de la %%UNIT%%, en %%UNIT_DOCS%%/, y lo demás que cambia>
```

**Nunca,** aunque se pida de pasada: `git push --force`, `git rebase` o
`git commit --amend` de algo ya subido, `git reset --hard`, borrar una rama
que no es de esta %%UNIT%%, ni subir contraseñas o claves. Si la persona los
pide, explica qué se pierde y espera un OK para eso en concreto.

## Comprobación

- [ ] Ningún commit, push, rama ni pull request que la persona no haya pedido
      expresamente.
- [ ] Nada reescrito ni forzado; ninguna contraseña o token pedido ni
      guardado.
- [ ] Ni el commit ni el pull request llevan líneas de la IA.
- [ ] Antes de un commit, las comprobaciones en verde y lo que entra,
      revisado.
- [ ] El resumen, con la forma de arriba.
- [ ] [Git](../../../AGENTS.md#git) y «Dónde estamos», al día.

## Para y pide el OK

Cada pregunta y cada OK van con palabras de la %%KIND%%, sin jerga
([Hablar con la persona](../../../docs/process.md#hablar-con-la-persona)).

- Con el remoto elegido, antes de crearlo o de conectarlo.
- Con la forma de trabajar con ramas, antes de apuntarla.
- Con el fichero del CI escrito, antes de darlo por bueno.
- Antes de un commit, si entra algo que no es de lo pedido.
