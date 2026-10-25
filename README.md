<h1>
  <img src="docs/static/img/miyagi-wordmark.svg" width="300" alt="miyagi: la cara de un maestro con su cinta en la frente y el nombre al lado">
</h1>

[![Web](https://img.shields.io/badge/web-falkenslab.github.io%2Fmiyagi-1f3129)](https://falkenslab.github.io/miyagi/) [![Version](https://img.shields.io/github/v/release/falkenslab/miyagi?label=version)](https://github.com/falkenslab/miyagi/releases/latest) [![Downloads](https://img.shields.io/github/downloads/falkenslab/miyagi/total?label=downloads)](https://github.com/falkenslab/miyagi/releases) [![verify](https://github.com/falkenslab/miyagi/actions/workflows/verify.yml/badge.svg)](https://github.com/falkenslab/miyagi/actions/workflows/verify.yml) [![docs](https://github.com/falkenslab/miyagi/actions/workflows/pages.yml/badge.svg)](https://github.com/falkenslab/miyagi/actions/workflows/pages.yml) [![Docusaurus](https://img.shields.io/badge/docs-Docusaurus-3ecc5f?logo=docusaurus&logoColor=white)](https://falkenslab.github.io/miyagi/) [![Claude](https://img.shields.io/badge/Claude-Agent%20SDK-d97757?logo=claude&logoColor=white)](https://docs.claude.com/en/api/agent-sdk/overview) [![Idioma](https://img.shields.io/badge/idioma-espa%C3%B1ol-c60b1e)](https://falkenslab.github.io/miyagi/) [![Moodle](https://img.shields.io/badge/Moodle-5.2-f98012?logo=moodle&logoColor=white)](https://github.com/falkenslab/moodle-sandbox) [![License](https://img.shields.io/github/license/falkenslab/miyagi?label=license)](LICENSE) [![agent-kit](https://img.shields.io/github/package-json/dependency-version/falkenslab/miyagi/@falkenslab/agent-kit?label=agent-kit)](https://www.npmjs.com/package/@falkenslab/agent-kit) [![Node](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Ffalkenslab%2Fmiyagi%2Fmain%2Fpackage.json&query=%24.engines.node&label=node&logo=node.js&logoColor=white&color=339933)](https://nodejs.org) [![Issues](https://img.shields.io/github/issues/falkenslab/miyagi?label=issues)](https://github.com/falkenslab/miyagi/issues) [![Last commit](https://img.shields.io/github/last-commit/falkenslab/miyagi?label=last%20commit)](https://github.com/falkenslab/miyagi/commits/main)

**Asistente de IA para docentes. Tú enseñas, y miyagi se ocupa del resto.**

Te ayuda a preparar tu asignatura (la programación didáctica, los temas, los materiales, las rúbricas y los cuestionarios) y, si conectas tu curso de Moodle, también a llevarlo: corrige con tu rúbrica, atiende el foro, publica lo que prepara y te dice cómo va la clase. En Moodle trabaja con la extensión moodle-teacher, con tu propia sesión: nunca ve tu contraseña, tus alumnos le llegan con un alias y te consulta antes de publicar lo que verán. Toma apuntes de la asignatura para acordarse de todo en la siguiente sesión, y puedes enseñarle habilidades nuevas o darle más capacidades con extensiones.

![El chat de miyagi al terminar el Tema 4 de un aula de Introducción a SQL: los cambios que pidió el revisor pedagógico, las decisiones que tomó por su cuenta para que las revises y lo que queda pendiente](docs/static/img/casos/32-t4-resumen.webp)

## Documentación

Todo está en **[falkenslab.github.io/miyagi](https://falkenslab.github.io/miyagi/)**:

- **[Guía](https://falkenslab.github.io/miyagi/guia/)**: instalación, primeros pasos, el chat, qué pedirle, sus habilidades y preguntas frecuentes.
- **[Casos de uso](https://falkenslab.github.io/miyagi/casos-de-uso/)**: un aula de Introducción a SQL montada de cero, paso a paso y con capturas reales, de la programación a la corrección.
- **[Avanzado](https://falkenslab.github.io/miyagi/avanzado/)**: habilidades propias, la base de conocimiento, la configuración, las aprobaciones, las prácticas con Docker y la seguridad.

## Instalación

Necesitas [Node.js](https://nodejs.org/) 20 o posterior (la versión LTS), una suscripción de Claude Pro o Max y un navegador como Google Chrome o Microsoft Edge. Para trabajar en tu aula, además, un curso de Moodle en el que seas profesor. En una terminal (PowerShell en Windows, Terminal en Mac):

```
npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz
```

Para actualizarlo, repite la misma línea; para desinstalarlo, `npm uninstall -g miyagi`. Los detalles, en [Instalar](https://falkenslab.github.io/miyagi/guia/instalar/).

## Primeros pasos

```
miyagi init                # la asignatura (nombre, tono, idioma) y, si quieres, la dirección de tu curso de Moodle
miyagi ingest -w <nombre>  # opcional: incorpora lo que dejes en sources/ (programación, rúbricas...)
miyagi chat -w <nombre>    # y pídeselo con tus palabras
```

La asignatura se guarda en `~/.miyagi/workspaces/<nombre>/`, y `miyagi workspaces` te dice dónde está. Si conectas Moodle, la primera vez inicias sesión tú en la ventana que abre moodle-teacher.

Por ejemplo: *«¿Qué entregas tengo sin corregir?»*, *«Corrige la Tarea 2 con la rúbrica que te dejé»*, *«¿Hay dudas sin responder en el foro?»* o *«Monta un tema sobre consultas SQL con su práctica y un cuestionario»*. Más ideas en [Qué pedirle](https://falkenslab.github.io/miyagi/guia/ideas/) y todas las órdenes en la [Referencia](https://falkenslab.github.io/miyagi/guia/referencia/).

## Para desarrolladores

miyagi está construido sobre [`@falkenslab/agent-kit`](https://github.com/falkenslab/agent-kit), igual que [padawan](https://github.com/falkenslab/padawan), y trabaja en Moodle con la extensión moodle-teacher de [agent-extensions](https://github.com/falkenslab/agent-extensions). La especificación del proyecto (qué es, arquitectura, stack, convenciones y decisiones) está en [.minispec/](.minispec/README.md), y [CLAUDE.md](CLAUDE.md) explica cómo trabajar en el repo.

```
git clone https://github.com/falkenslab/miyagi.git
cd miyagi
npm install
npm start -- chat --dir <carpeta-del-curso>
npm run build                 # compila dist/ (necesario para npm link y las skills de prueba)
npm run typecheck && npm run lint
npm link                      # comando global miyagi desde este clon
npm pack                      # genera el .tgz que se publica en cada release
cd docs && npm ci && npm start   # el sitio de documentación, en local
```

### Skills de desarrollo

En `.claude/skills/`, para trabajar en este repositorio con Claude Code (no las usa el asistente):

| Skill | Para qué |
| --- | --- |
| `verify` | Comprobación completa: tipos, lint, compilación, los prompts de cada tipo de sesión, el catálogo y que la documentación lo recoja todo. |
| `update-docs` | Poner al día el sitio de documentación con cada cambio, antes de hacer commit o publicar una versión. |
| `commit` / `release` | Commits con las convenciones del repo y publicación de una versión con su paquete. |
| `sandbox-e2e` | Probar el asistente de principio a fin contra [moodle-sandbox](https://github.com/falkenslab/moodle-sandbox). |
| `simulate-course <descripción>` | Simular que el asistente construye un curso completo en el sandbox y dejar el informe. |
| `test-report` | Escribir el informe de una prueba en `tests/` con sus capturas. |
| `smoke-ingest` | Probar `ingest` con un temario y una rúbrica de ejemplo. |
| `student-impact-review` | Revisar cambios que afectan a lo que ven los estudiantes. |
| `upgrade-agent-kit` / `try-agent-kit-local` | Actualizar agent-kit o probar cambios suyos sin publicar. |

### Informes de pruebas

Cada prueba de principio a fin queda en [`tests/`](tests/README.md): una carpeta por prueba con el informe completo y sus capturas, y un índice.

## Licencia

[MIT](LICENSE).
