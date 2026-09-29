# teacher-agent

```text
  ____
 /___/|
 {o,o}'
 |)__)
 -"-"-
```

[![Versión](https://img.shields.io/github/v/release/falkenslab/teacher-agent?label=versi%C3%B3n)](https://github.com/falkenslab/teacher-agent/releases/latest) [![Descargas](https://img.shields.io/github/downloads/falkenslab/teacher-agent/total?label=descargas)](https://github.com/falkenslab/teacher-agent/releases) [![verify](https://github.com/falkenslab/teacher-agent/actions/workflows/verify.yml/badge.svg)](https://github.com/falkenslab/teacher-agent/actions/workflows/verify.yml) [![Moodle](https://img.shields.io/badge/Moodle-5.2-f98012?logo=moodle&logoColor=white)](https://github.com/falkenslab/moodle-sandbox) [![Licencia](https://img.shields.io/github/license/falkenslab/teacher-agent?label=licencia)](LICENSE) [![agent-kit](https://img.shields.io/github/package-json/dependency-version/falkenslab/teacher-agent/@falkenslab/agent-kit?label=agent-kit)](https://www.npmjs.com/package/@falkenslab/agent-kit) [![Node](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Ffalkenslab%2Fteacher-agent%2Fmain%2Fpackage.json&query=%24.engines.node&label=node&logo=node.js&logoColor=white&color=339933)](https://nodejs.org) [![Issues](https://img.shields.io/github/issues/falkenslab/teacher-agent?label=issues)](https://github.com/falkenslab/teacher-agent/issues) [![Último commit](https://img.shields.io/github/last-commit/falkenslab/teacher-agent?label=%C3%BAltimo%20commit)](https://github.com/falkenslab/teacher-agent/commits/main)

Un asistente que te ayuda a gestionar tu curso de Moodle. Entra con tu cuenta de profesor en una ventana de Chrome y trabaja como lo harías tú: **corrige entregas**, **responde en el foro**, **crea o revisa contenido** y te **resume cómo va la clase**. Antes de publicar nada que vean tus estudiantes (una nota, una respuesta, un recurso nuevo), te pide permiso.

Además, va tomando apuntes del curso (criterios de corrección, rúbricas, dudas que se repiten, cómo evoluciona la clase) para acordarse de todo en la siguiente sesión.

> 📋 **¿Quieres empezar rápido?** La [CheatSheet](docs/CHEATSHEET.md) explica paso a paso cómo instalarlo y conectarlo a un curso, y recorre casos de uso en el chat de menos a más.

## 1. Qué necesitas

Antes de instalarlo, comprueba que tienes estas tres cosas:

1. **Google Chrome**. Si no lo tienes: [google.com/chrome](https://www.google.com/chrome/).
2. **Node.js** (versión 20 o posterior). Descárgalo de [nodejs.org](https://nodejs.org/), elige la versión **LTS** e instálalo con las opciones por defecto.
3. **Una suscripción de Claude Pro o Max** ([claude.ai](https://claude.ai)). Es lo que hace funcionar al asistente.

Y, por supuesto, un curso de Moodle en el que tengas rol de **profesor**.

## 2. Instalación

1. Abre una terminal:
   - **Windows**: pulsa la tecla Windows, escribe `PowerShell` y ábrelo.
   - **Mac**: pulsa `Cmd + Espacio`, escribe `Terminal` y ábrelo.
2. Copia esta línea, pégala en la terminal y pulsa Intro:

   ```
   npm install -g https://github.com/falkenslab/teacher-agent/releases/latest/download/teacher-agent.tgz
   ```

   Tarda uno o dos minutos. Es normal que aparezca algún aviso en amarillo (`warn`). En Mac, si da un error de permisos, ponle `sudo ` delante y escribe tu contraseña.
3. Comprueba que ha funcionado:

   ```
   teacher-agent --version
   ```

   Si ves un número de versión (por ejemplo `0.1.0`), ya está instalado.

Para **actualizarlo** más adelante, repite el paso 2. Para **desinstalarlo**: `npm uninstall -g teacher-agent`.

## 3. Prepara tu curso (solo la primera vez)

Cada curso tiene su propia carpeta. En ella el asistente guarda los datos del curso y sus apuntes.

1. Crea una carpeta para el curso y entra en ella. En la terminal:

   ```
   mkdir mi-curso
   cd mi-curso
   ```

2. Configúrala:

   ```
   teacher-agent init
   ```

   Te hará unas preguntas:
   - **URL de Moodle**: lo más fácil es abrir tu curso en el navegador y copiar la dirección completa (algo como `https://moodle.micentro.es/course/view.php?id=4`).
   - **Usuario y contraseña** de profesor. Si prefieres no guardarlos, déjalos en blanco: cada vez que empiece, el asistente te pedirá que inicies sesión tú en la ventana de Chrome.
   - **Tono** (formal, cercano...) e **idioma** en el que quieres hablar con él.
   - Si quieres que **pruebe las actividades prácticas con Docker** (solo tiene sentido en cursos de informática, y necesitas Docker instalado): ver [Probar prácticas con Docker](#probar-prácticas-con-docker). Si no lo sabes, di que no; puedes activarlo más adelante.

   Al final te propone **explorar** tu Moodle: entra, mira qué tipos de actividades y de preguntas permite tu centro y lo apunta. No crea ni cambia nada. Te recomendamos decir que sí.

3. **La primera vez**, te pedirá conectar tu cuenta de Claude: acepta, se abrirá el navegador, inicia sesión en Claude y vuelve a la terminal. Solo se hace una vez.

> 💡 Si tienes el programa de la asignatura, rúbricas, soluciones de los ejercicios o tus criterios de corrección, cópialos en la carpeta `sources` que se ha creado dentro de la del curso. El asistente los tendrá en cuenta y, al corregir, **tus criterios mandan**.

## 4. Úsalo

Siempre desde la carpeta del curso (`cd mi-curso`).

### Conversar con el asistente (recomendado para empezar)

```
teacher-agent chat
```

El chat ocupa toda la terminal y se abre Chrome, que entra en tu curso; el asistente te pregunta qué necesitas. Pídeselo con tus palabras, por ejemplo:

- *"¿Qué entregas tengo pendientes de corregir?"*
- *"Corrige las entregas de la Tarea 2 con la rúbrica que te he dejado."*
- *"¿Hay preguntas sin responder en el foro?"*
- *"Crea un cuestionario de 10 preguntas sobre el tema 3."*
- *"¿Qué alumnos se están quedando atrás?"*
- *"Revisa el curso y dime qué mejorarías."*
- *"Monta un curso completo de introducción a Docker de tres temas."*
- *"Añade un tema 4 sobre seguridad, planteado como un reto por equipos."*
- *"Ayúdame a escribir mi programación didáctica y dime si el aula está acorde con ella."*
- *"Investiga qué ha cambiado en Docker Compose este año."*

Antes de guardar una nota, responder en el foro, publicar algo o cambiar la configuración de una actividad, te mostrará lo que va a hacer y esperará tu respuesta: pulsa **Intro** (o escribe `y`) para aprobarlo, o escribe `n` para rechazarlo. Para salir, escribe `/exit`. Si quieres cortar lo que está haciendo sin salir, pulsa `Esc`. Al terminar no hay nada que guardar: todo se va guardando solo.

### Dejar que gestione el curso entero

```
teacher-agent run
```

Recorre el curso de principio a fin: corrige lo pendiente, atiende el foro, revisa el contenido y termina con un resumen de cómo va la clase. Te preguntará cuánto quieres supervisarlo:

| Opción | Qué significa |
| --- | --- |
| **guided** (recomendada) | Trabaja solo, pero te pide permiso antes de publicar cualquier cosa que vean tus estudiantes. |
| **interactive** | Te pide confirmación antes de cada paso. Útil para ver cómo trabaja. |
| **autonomous** | No pregunta nada. Solo si confías plenamente y has guardado usuario y contraseña. |

### Encargarle una sola tarea

```
teacher-agent run --task "corrige las entregas de la Tarea 2"
teacher-agent run --task "construye un curso de introducción a Docker de tres temas para FP"
```

Hace solo eso, con las mismas reglas (y las mismas aprobaciones) que el resto.

## Referencia

### Órdenes

Todas aceptan `--dir <carpeta>` para trabajar con un curso sin entrar en su carpeta.

| Orden | Qué hace | Opciones |
| --- | --- | --- |
| `teacher-agent init` | Prepara una carpeta nueva para un curso (las preguntas del paso 3) y ofrece explorar tu Moodle. | |
| `teacher-agent chat` | Conversación con el asistente a pantalla completa, siempre pidiendo permiso antes de publicar. Dentro, `/resume` retoma una conversación anterior. | `--headless`, `--inline` (sin pantalla completa), `--plain` (chat de texto simple), `--continue` (retoma la última conversación) |
| `teacher-agent run` | Gestiona el curso entero de una sentada: corregir, foro, contenido y resumen del progreso. | `--mode guided\|interactive\|autonomous`, `--task "…"`, `--headless` |
| `teacher-agent explore` | Mira (sin crear nada) qué tipos de actividad y de pregunta admite tu Moodle y lo apunta. | `--headless` |
| `teacher-agent ingest` | Lee los documentos de `sources` (o los que indiques) y toma apuntes, sin abrir Moodle. | `[archivos…]` |
| `teacher-agent skills` | Lista las habilidades del asistente, incluidas las tuyas. | |
| `teacher-agent commands` | Lista los atajos que puedes usar dentro del chat. | |
| `teacher-agent --help` / `--version` | Ayuda y versión instalada. | |

Sin ninguna orden (`teacher-agent` a secas) te pregunta si quieres `run` o `chat`. Si la carpeta aún no es un curso, primero te hace las preguntas del paso 3, guarda la configuración y termina: vuelve a lanzarlo para empezar.

### Atajos dentro del chat

Escríbelos en el chat, con lo que necesites detrás.

| Atajo | Qué hace |
| --- | --- |
| `/teacher-agent:grade` | Corrige las entregas pendientes con un criterio justo y coherente. |
| `/teacher-agent:forum` | Revisa el foro y decide si hace falta que intervenga el profesor. |
| `/teacher-agent:quiz <tema>` | Crea un cuestionario sobre ese tema (o le añade preguntas), con preguntas bien escritas importadas de golpe. |
| `/teacher-agent:build-course <descripción>` | Construye un curso completo: planifica, crea cada sección con apuntes, prácticas y cuestionarios, y lo revisa como lo vería un alumno. |
| `/teacher-agent:build-unit <descripción>` | Construye un solo tema dentro del curso, encajado en su programación, su calendario y su estilo. |
| `/teacher-agent:teaching-plan` | Escribe o revisa tu programación didáctica a partir de tu material y tus decisiones. |
| `/teacher-agent:align` | Comprueba si el aula está acorde con tu programación y corrige lo que no. |
| `/teacher-agent:research <tema>` | Investiga un tema en internet y guarda lo que encuentra con sus fuentes. |
| `/teacher-agent:progress` | Revisa cómo va la clase y quién se está quedando atrás. |
| `/teacher-agent:audit` | Auditoría completa del curso con recomendaciones priorizadas. |
| `/teacher-agent:orient` | Se orienta en el curso: evaluación, plazos, canales de comunicación. |
| `/teacher-agent:map` | Muestra las direcciones del curso que tiene apuntadas. |
| `/knowledge:ingest` | Incorpora a sus apuntes lo que haya en `sources` sin procesar. |
| `/knowledge:query <pregunta>` | Responde a partir de sus apuntes del curso. |
| `/knowledge:lint` | Revisa que sus apuntes estén completos y bien enlazados. |

### Habilidades

Son los conocimientos que el asistente aplica por su cuenta cuando la tarea lo pide. No hace falta invocarlas: basta con pedirle el trabajo.

| Habilidad | Para qué la usa |
| --- | --- |
| **Construir** | |
| `course-building` | Un curso completo desde una descripción: la programación, la bienvenida, cada tema y las comprobaciones finales. |
| `unit-building` | Un tema dentro de un curso que ya existe, encajado en su programación, calendario y estilo. |
| `resource-authoring` | Los apuntes y recursos del curso (páginas, libros, archivos, enlaces) con explicaciones y ejemplos de verdad. |
| `assignment-building` | Tareas de cualquier tipo (escritas, archivos, en grupo, por borradores, portafolio, exposición…): enunciado, ajustes y rúbrica. |
| `activity-building` | Talleres de coevaluación, lecciones con itinerarios, glosarios, wikis, bases de datos, consultas, encuestas, H5P, y finalización, restricciones, insignias y grupos. |
| `quiz-design` | Escribir buenas preguntas (distractores plausibles, niveles variados) y revisar cuestionarios. |
| `quiz-building` | Configurar el cuestionario, añadir o importar sus preguntas (GIFT) y dejarlas en orden. |
| `rubric-design` | Construir la rúbrica de una actividad y dejarla en Moodle. |
| `practice-testing` | Probar las prácticas en Docker antes de publicarlas, o ejecutar una entrega al corregirla (ver abajo). |
| `publish-check` | La comprobación antes de publicar cualquier cosa: redacción, accesibilidad y cómo lo ve un alumno. |
| **Diseñar** | |
| `course-design` | Principios de diseño: objetivos, secuencia, tipos de actividad y equilibrio de la evaluación. |
| `teaching-methodologies` | Elegir y aplicar metodologías: proyectos, retos, clase invertida, gamificación, cooperativo, casos, aprendizaje-servicio, design thinking, DUA… |
| `teaching-plan` | Redactar la programación didáctica: objetivos, temas, metodología, evaluación, calificación, atención a la diversidad. |
| `course-alignment` | Comparar el aula con la programación y cerrar los huecos. |
| `topic-research` | Investigar un tema en internet con fuentes contrastadas y citadas. |
| **Llevar el curso** | |
| `course-orientation` | Orientarse en un curso antes de hacer nada complejo: estructura, evaluación, plazos y lo que su cuenta puede hacer. |
| `moodle-navigation` | Leer la estructura real del curso y moverse por Moodle 4/5. |
| `grading-rubric` | Corregir con un criterio justo y el mismo para todos, con retroalimentación útil. |
| `forum` | Llevar el foro: cuándo intervenir, cómo responder y corregir, avisos a la clase. |
| `progress-monitoring` | Revisar el progreso de la clase priorizando a quien se queda atrás. |
| `course-auditor` | Auditar el curso (organización, accesibilidad, pedagogía, evaluación) con recomendaciones. |
| `knowledge-ingest`, `knowledge-query`, `knowledge-lint`, `knowledge-pages` | Mantener sus apuntes del curso (la carpeta `knowledge`). |

### Ayudantes

Para algunas tareas, el asistente se apoya en ayudantes especializados que trabajan por su cuenta y le devuelven un informe. Ninguno puede publicar nada en Moodle.

| Ayudante | Qué hace | Cuándo está disponible |
| --- | --- | --- |
| Investigador | Busca en internet, lee las fuentes (primero las oficiales) y devuelve lo encontrado con enlaces y fechas. | Siempre (en `chat` y `run`) |
| Revisor pedagógico | Experto en diseño didáctico y metodologías: revisa un plan o una actividad y señala qué mejorar (coherencia entre objetivos, actividades y evaluación, metodología, carga de trabajo, diversidad). | Siempre (en `chat` y `run`) |
| Probador de prácticas | Ejecuta las prácticas en Docker. | Solo si lo activas (ver abajo) |

## Programación didáctica y metodologías

El asistente puede ayudarte a escribir tu **programación didáctica** y a que tu aula de Moodle esté de acuerdo con ella:

1. Deja en `sources` lo que tengas: un borrador, la programación del año pasado, los criterios del departamento. Si quieres que siga una normativa concreta, déjala también o díselo.
2. En el chat, `/teacher-agent:teaching-plan`. La escribe a partir de tu material, te pregunta lo que solo tú puedes decidir (horas, calendario, pesos) y la hace revisar por el revisor pedagógico. Queda en sus apuntes (`knowledge/teaching-plan.md`, enlazada con cada tema), no se publica en Moodle salvo que se lo pidas.
3. `/teacher-agent:align` compara el aula con la programación: criterios que ninguna actividad evalúa, rúbricas que faltan, pesos o fechas distintos, temas sin construir. Te propone los cambios y los hace con tu aprobación.
4. `/teacher-agent:build-unit` construye los temas que falten.

Al diseñar un tema o una actividad elige una metodología que encaje con lo que se quiere aprender (aprendizaje basado en proyectos o en retos, clase invertida, gamificación con insignias y niveles, trabajo cooperativo, estudio de casos…) y la monta con las piezas de Moodle que la hacen posible. Si tienes una en mente, pídesela.

## Probar prácticas con Docker

En un curso de informática (Docker, Linux, programación, bases de datos), una práctica que no funciona tal como está escrita le cuesta la tarde a toda la clase. Con esta opción, el asistente puede **ejecutar** las prácticas en contenedores Docker:

- **Antes de publicar una práctica**, la sigue paso a paso como lo haría un alumno y comprueba que la solución da lo que promete el enunciado. Si algo falla, lo corrige antes de publicarla.
- **Al corregir**, ejecuta la entrega del alumno y usa lo que sale como prueba en la nota y en la retroalimentación.

Está **desactivada por defecto**, porque es lo único que le da acceso a ejecutar programas en tu ordenador. Cuando la activas, lo hace una parte separada del asistente que solo puede usar Docker: siempre dentro de contenedores, sin red salvo que la práctica la necesite, con límites de memoria, CPU y tiempo, y trabajando solo en la carpeta `practice` del curso. Nunca instala nada: si falta Docker, te lo dice.

Para activarla:

1. Instala [Docker Desktop](https://www.docker.com/products/docker-desktop/) (en Linux, Docker Engine) y comprueba que funciona con `docker version`.
2. Responde que sí a la pregunta de `teacher-agent init`, o en un curso ya creado edita su `config.json` y añade `"allowPracticeRunner": true` dentro de `"agent"`.

## Preguntas frecuentes

**¿Mi contraseña está segura?** Se guarda en el archivo `config.json` de la carpeta del curso, en tu ordenador. El asistente nunca la ve: escribe un marcador en el campo de contraseña y es el propio Chrome quien pone la real. Tampoco puede abrir ese archivo.

**¿Puede borrar cosas o salirse de mi curso?** Tiene instrucciones de no borrar nada, no cambiar matrículas, no tocar la configuración de Moodle ni entrar en otros cursos. Aun así, usa el modo **guided** (o el chat) para revisar todo lo que publica.

**¿Dónde están sus apuntes?** En la carpeta `knowledge` del curso: archivos de texto que puedes abrir con cualquier editor (o con [Obsidian](https://obsidian.md), que muestra cómo se enlazan). No guarda fichas de estudiantes concretos, solo tendencias de la clase.

**¿Cómo prueba lo que crea antes de que lo vean los alumnos?** Lo construye en la carpeta `drafts` del curso, lo sube a Moodle **oculto** (con tu permiso), lo prueba ahí como profesor y te pide permiso otra vez para mostrarlo. Lo que dejes oculto queda apuntado en `knowledge/drafts.md` y te lo recuerda al cerrar la sesión.

**¿Puedo darle instrucciones propias?** Sí. Crea un archivo `instructions.md` en la carpeta del curso y escribe ahí lo que quieras que tenga siempre en cuenta ("puntúa sobre 10", "sé breve en el foro", "la ortografía cuenta un 10 %"...).

**¿En qué idioma habla?** En el que elegiste al crear el curso, que es también el de sus menús y avisos (español, inglés, francés o alemán). Para cambiarlo solo una vez, añade `--language=en` (o `es`, `fr`, `de`); si le escribes en otro idioma, te sigue.

**No quiero ver la ventana de Chrome.** Añade `--headless` (por ejemplo `teacher-agent run --headless`). Necesita el usuario y la contraseña guardados.

**Venía usando moodle-agent.** Tu carpeta de aula de profesor sirve tal cual: ejecuta `teacher-agent chat` dentro de ella y el asistente reorganizará sus apuntes al formato nuevo la primera vez.

## Avanzado: enséñale habilidades nuevas

Si en tu asignatura hay algo que el asistente debería hacer siempre de una manera concreta, puedes escribírselo como una **habilidad propia**: un archivo de texto con instrucciones que el asistente carga cuando la tarea lo pide, igual que las suyas. No hace falta programar.

### Dónde va y qué forma tiene

Dentro de la carpeta del curso, crea una carpeta por habilidad con un archivo `SKILL.md`:

```
mi-curso/
  .claude/
    skills/
      corregir-practicas-docker/
        SKILL.md
```

El archivo empieza con un pequeño encabezado y sigue con las instrucciones:

```markdown
---
name: corregir-practicas-docker
description: Corregir las prácticas de Docker Compose de este curso ejecutándolas - úsala al corregir cualquier tarea cuyo nombre empiece por "Práctica".
---

# Corregir una práctica de Docker Compose

1. Descarga los archivos de la entrega y guárdalos en sources/<práctica>/<id-del-alumno>/.
2. Con la habilidad practice-testing, pide que se ejecute `docker compose up -d` con esos
   archivos y que se compruebe que el servicio web responde en el puerto 8080 con la página
   del enunciado.
3. Aplica la rúbrica de la práctica (sources/rubricas/):
   - Arranca sin errores: 4 puntos.
   - Responde en el 8080 con lo pedido: 4 puntos.
   - Usa volúmenes para los datos, como pide el enunciado: 2 puntos.
4. En la retroalimentación, copia la línea exacta del error si algo no arranca.
```

- **`name`**: el nombre de la carpeta, en minúsculas y con guiones.
- **`description`**: la parte más importante. Es lo que el asistente lee para decidir **cuándo** usarla, así que di qué hace y en qué situaciones ("úsala al corregir...", "cuando se pida crear...").
- **El cuerpo**: los pasos, como se los explicarías a un profesor en prácticas. Sé concreto: rutas de archivos, criterios, lo que no debe hacer.

Comprueba que la ve con `teacher-agent skills` (aparece como `[propia]`) y pruébala en el chat pidiéndole justo esa tarea.

### Lo que una habilidad puede y no puede hacer

Una habilidad le enseña **cómo** hacer algo con las herramientas que ya tiene: el navegador con tu Moodle, sus apuntes y los documentos de `sources`. **No le da herramientas nuevas.** Por eso el ejemplo de arriba se apoya en `practice-testing`: ejecutar Docker solo es posible si has activado [Probar prácticas con Docker](#probar-prácticas-con-docker). Una habilidad que diga "ejecuta este programa" sin esa opción no funcionará, y el asistente te lo dirá.

### Otras formas de adaptarlo

- **Atajos propios para el chat**: un archivo `.claude/commands/<nombre>.md` con la instrucción (puedes usar `$ARGUMENTS` para lo que escribas detrás). Por ejemplo, `.claude/commands/semana.md` con *"Revisa lo que se ha entregado esta semana en las prácticas de $ARGUMENTS y resume qué falla más"* se usa como `/semana Docker Compose`.
- **Instrucciones generales**: `instructions.md` en la carpeta del curso, para lo que debe tener en cuenta siempre, no solo en una tarea.
- **Material de referencia**: tus rúbricas, soluciones y apuntes en `sources`; ejecuta `teacher-agent ingest` para que los incorpore.

## Para desarrolladores

teacher-agent está construido sobre [`@falkenslab/agent-kit`](https://github.com/falkenslab/agent-kit), igual que [student-agent](https://github.com/falkenslab/student-agent). Sus habilidades, comandos y prompts proceden del rol de profesor de moodle-agent. La especificación del proyecto (qué es, arquitectura, stack, convenciones y decisiones) está en [.minispec/](.minispec/README.md), y [CLAUDE.md](CLAUDE.md) explica cómo trabajar en el repo.

```
git clone https://github.com/falkenslab/teacher-agent.git
cd teacher-agent
npm install
npm start -- chat --dir <carpeta-del-curso>
npm run build                 # compila dist/ (necesario para npm link y las skills de prueba)
npm run typecheck && npm run lint
npm link                      # comando global teacher-agent desde este clon
npm pack                      # genera el .tgz que se publica en cada release
```

### Skills de desarrollo

En `.claude/skills/`, para trabajar en este repositorio con Claude Code (no las usa el asistente):

| Skill | Para qué |
| --- | --- |
| `verify` | Comprobación completa: tipos, lint, compilación, los prompts de cada tipo de sesión y el catálogo. |
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
