# CLAUDE.md

Este fichero orienta a Claude Code (claude.ai/code) en este repositorio.

Lo que el kit deja en un proyecto, cómo funciona la plantilla y las reglas para
editarlo están en [AGENTS.md](./AGENTS.md); dónde va el trabajo, por bloques,
en [next-steps.md](./next-steps.md). Se leen los dos antes de tocar nada.

## Órdenes

```sh
npm test                                   # los tests del instalador (node:test, cli/*.test.mjs)
node --test cli/templateRender.test.mjs    # un solo fichero de tests
node --test --test-name-pattern="bloques anidados" cli/templateRender.test.mjs   # un solo test, por su nombre
npm run verify                             # instala cada combinación y pasa sus comprobaciones
npm run verify -- --only=web-todo-si --keep   # una combinación, dejando el proyecto en la carpeta temporal
npm run verify -- --only=web-              # las que empiezan así (o una lista: app-todo-si,web-api)
npm run verify -- --docs                   # solo los ficheros, sin instalar: segundos
```

- Las combinaciones de `verify` (en [scripts/verifyKit.mjs](./scripts/verifyKit.mjs))
  son las de las apps (`app-…`) y las de las webs (`web-…`), con sus gestores;
  las de un gestor que no está instalado se saltan, avisando. Cada una instala
  las dependencias en un proyecto de verdad, desde el paquete de `npm pack`:
  tarda y necesita red. Pasa también los tests de `templateTests/`, el código
  base de la plantilla, que no llegan al proyecto. Con `--docs` solo mira los
  ficheros: nada sin resolver, enlaces y anclas, y lo que habla de una pieza
  que no se ha pedido (`findAnswerLeaks`).

- Para probar el instalador sin preguntas ni `npm install`:
  `node bin/zaiusDev.mjs init --cwd <carpeta> --config <respuestas.json> --yes --skip-install`.
  Un proyecto nuevo queda en `<carpeta>/<nombre-del-proyecto>`. Las preguntas
  con flechas solo salen en una terminal de verdad.
- El kit no tiene build ni lint propios. El código sigue el estilo de standard
  (sin punto y coma, espacio antes del paréntesis al declarar una función) y
  cada función lleva su JSDoc en castellano.

## Cómo funciona el instalador

Todas las órdenes que escriben (`init`, `change`, `update`) acaban en el mismo
camino:

1. [bin/zaiusDev.mjs](./bin/zaiusDev.mjs) lee los argumentos y elige la orden
   (`chooseCommand` si no hay ninguna).
2. [cli/cliCommands.mjs](./cli/cliCommands.mjs) consigue las respuestas: del
   `--config`, las de por defecto con `--yes`, las del manifiesto (`update`) o
   preguntando. Las de por defecto salen de `detectProject`: el gestor, del
   campo `packageManager` o del lockfile; el tipo, de sus dependencias (Astro es
   una web, React una app) y, en una web, el servidor y el contenido, de su
   configuración ([cli/typeDetection.mjs](./cli/typeDetection.mjs)). Las
   preguntas ([cli/installQuestions.mjs](./cli/installQuestions.mjs)) no
   preguntan lo que ya se sabe. `normalizeAnswers` las completa y las comprueba;
   las de un tipo son `null` en el otro. En `change`, el tipo no cambia en un
   proyecto con el código del kit (`findFixedAnswerChange`), y una web pregunta
   además por la zona privada. En `init`, un proyecto nuevo va en una carpeta
   nueva con su nombre (`slugifyName`), y no se instala si esa carpeta ya tiene
   ficheros que no son ocultos.
3. [cli/installFlow.mjs](./cli/installFlow.mjs) llama a `installProject` dos
   veces: primero en seco (`dryRun`) para el resumen y la confirmación, y luego
   de verdad. Después apunta los `.kit-new` en el `docs/next-steps.md` del
   proyecto y, en un proyecto nuevo, instala las dependencias y pasa tipos,
   lint y tests con el gestor del proyecto
   ([cli/packageManagers.mjs](./cli/packageManagers.mjs)).
4. [cli/projectInstall.mjs](./cli/projectInstall.mjs) (`installProject`):
   - la versión del kit sale de su `package.json`;
   - `renderTemplate` genera en memoria todos los ficheros del proyecto: los de
     `shared/` y los de la carpeta de su tipo (`resolveTemplateRoots`), con las
     condiciones de `templateFiles.json` y los bloques y valores de cada
     fichero. Si dos ficheros de la plantilla dan la misma ruta, para con un
     error;
   - `planProjectFiles` decide qué hacer con cada uno;
   - el `package.json` del proyecto se arma con el `package.fragment.json` de
     cada carpeta (cada `when` añade dependencias según una condición) y
     `mergePackage`, que no pisa un valor del proyecto y quita lo que el kit puso
     antes y ya no pone. En un proyecto existente no se toca;
   - al final escribe `zaius-dev.json`: las respuestas, lo que el kit añadió a
     `package.json`, las semillas y la huella de cada fichero.

### Qué se hace con cada fichero

`planProjectFiles` ([cli/projectManifest.mjs](./cli/projectManifest.mjs))
compara tres huellas (SHA-256, igual con LF que con CRLF): la del fichero que da
el kit, la del que hay en el proyecto y la que apuntó el manifiesto la última
vez.

| Acción | Cuándo |
|---|---|
| `create` | El fichero no existe en el proyecto. |
| `same` | El del proyecto ya es igual que el del kit. |
| `keep` | Es una semilla, o el kit no ha cambiado ese fichero desde la última vez. |
| `replace` | El kit lo ha cambiado y el proyecto no lo había tocado. |
| `kitNew` | Los dos lo han cambiado: la versión del kit va al lado, en `<fichero>.kit-new`. |
| `remove` | El kit ya no lo da y el proyecto no lo había tocado. |
| `orphan` | El kit ya no lo da, pero el proyecto lo cambió: se deja. |

Un fichero que pasa a depender de una condición se borra en los proyectos que no
la cumplen (si no lo habían tocado), y una semilla no vuelve a llegar nunca a un
proyecto ya instalado.

## Los tests del instalador

- Cada test monta un kit falso en una carpeta temporal (`package.json`,
  `templateFiles.json` y unos pocos ficheros en `shared/`, `web/` o `app/`) y
  un proyecto vacío al lado; no usan la plantilla de verdad.
- Las preguntas y los mensajes llegan siempre como un objeto `prompts` (en el
  programa, `@clack/prompts` pasado por `createConsolePrompts`). Los tests le
  pasan uno falso que contesta lo que se le da y apunta lo que se escribe.

## En cualquier sistema y con cualquier gestor

- Las rutas se arman con `node:path` y, para compararlas o guardarlas en el
  manifiesto, se pasan a `/` (`replaceAll('\\', '/')`).
- `runCommand` lanza las órdenes con `shell: true` (en Windows, `npm` y `npx`
  son `.cmd`) y con los argumentos unidos por espacios: una ruta va ya entre
  comillas dobles.
- `yarn exec tsc -b` en yarn 1 no lanza `tsc`: los binarios van con
  `yarn run`. `bun test` es el runner de bun: los tests van con `bun run test`.
  yarn no instala los peers: un peer que se usa va declarado.
- `npm install` encima de los `node_modules` de pnpm falla: el instalador nunca
  lanza un gestor distinto del del proyecto.

## Desde git

El kit no se publica en npm (`"private": true`): se lanza desde su repositorio
con `npx github:albertesc/zaius-dev#vX.Y.Z`, y cada versión es una etiqueta. La
orden sale de `repository` en `package.json` (`readKitInfo` y
`buildKitCommand`); sin `repository` (los kits falsos de los tests), es
`zaius-dev`. npm instala desde git empaquetando el repositorio como `npm pack`:
solo llega lo que dice `files`.
