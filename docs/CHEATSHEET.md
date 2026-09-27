# teacher-agent · chuleta

Referencia rápida para tener junto a la terminal. La guía completa está en el
[README](../README.md).

### 1. Instalar o actualizar

```bash
npm install -g https://github.com/falkenslab/teacher-agent/releases/latest/download/teacher-agent.tgz
teacher-agent --version
```

Necesitas Google Chrome, Node.js 20 o posterior y una suscripción de Claude Pro o Max.

### 2. Preparar un aula (una vez por curso)

```bash
mkdir mi-curso && cd mi-curso
teacher-agent init        # URL del curso, usuario de profesor, tono e idioma
teacher-agent explore     # qué actividades y preguntas admite tu Moodle
```

Todas las órdenes trabajan sobre la carpeta actual, o sobre la que indiques con `--dir <carpeta>`.

### 3. Conversar con el asistente

```bash
teacher-agent chat
```

Pídeselo con tus palabras, o usa un atajo:

| Atajo | Para qué |
| --- | --- |
| `/teacher-agent:orient` | Conocer el aula: evaluación, plazos, canales |
| `/teacher-agent:grade` | Corregir las entregas pendientes |
| `/teacher-agent:forum` | Revisar el foro e intervenir si hace falta |
| `/teacher-agent:progress` | Ver cómo va la clase y quién se queda atrás |
| `/teacher-agent:quiz <tema>` | Crear un cuestionario sobre un tema |
| `/teacher-agent:build-unit <descripción>` | Construir un tema dentro del curso |
| `/teacher-agent:build-course <descripción>` | Construir un curso completo |
| `/teacher-agent:teaching-plan` | Escribir o revisar la programación didáctica |
| `/teacher-agent:align` | Comprobar que el aula sigue la programación |
| `/teacher-agent:audit` | Auditar el aula y proponer mejoras |
| `/teacher-agent:research <tema>` | Investigar un tema con fuentes |

Antes de publicar algo te pide aprobación: **Intro** o `y` para aprobar, `n` para rechazar.
`Esc` corta la respuesta en curso; `/exit` sale.

### 4. Ejemplos directos desde la terminal

Puedes ejecutar tareas sin entrar en el chat interactivo:

```bash
# Corregir una actividad
teacher-agent run --task "Corrige la Tarea 2"

# Crear apuntes
teacher-agent run --task "Crea apuntes sobre Docker"

# Crear una actividad
teacher-agent run --task "Crea una práctica sobre SQL"

# Analizar un aula existente
teacher-agent run --task "Analiza y conoce este curso"

# Auditar el aula
teacher-agent run --task "Audita el curso y detecta problemas"

# Construir un curso completo
teacher-agent run --task "Construye un curso de introducción a HTML5 y CSS3 para 1.º de DAW"
```

### 5. Modos de ejecución

| Modo | Comportamiento |
| --- | --- |
| `interactive` | Confirma cada paso |
| `guided` | Autónomo, pero solicita aprobación antes de publicar |
| `autonomous` | Ejecuta sin confirmaciones |

```bash
teacher-agent run --mode guided
```

Para gestionar aulas reales, utiliza `guided`. `--headless` oculta la ventana de Chrome (necesita
el usuario y la contraseña guardados).

### 6. Memoria y conocimiento

| Comando | Función |
| --- | --- |
| `/knowledge:ingest` | Incorporar documentos |
| `/knowledge:query` | Consultar conocimiento |
| `/knowledge:lint` | Comprobar la memoria |
| `/teacher-agent:map` | Consultar el mapa del aula |

Puedes depositar programaciones, rúbricas, apuntes y soluciones en `sources/` y ejecutar
`teacher-agent ingest` para incorporarlos. Sus apuntes quedan en `knowledge/`; tus instrucciones
fijas para el curso, en `instructions.md`.

### 7. Flujo recomendado para un aula existente

| Paso | Qué | Cómo |
| --- | --- | --- |
| 1 | Inicializar | `teacher-agent init` |
| 2 | Explorar Moodle | `teacher-agent explore` |
| 3 | Conocer el aula | `/teacher-agent:orient` |
| 4 | Incorporar documentación | `/knowledge:ingest` |
| 5 | Auditar el aula | `/teacher-agent:audit` |
| 6 | Comprobar la programación | `/teacher-agent:align` |
| 7 | Aplicar mejoras | Pedir los cambios al agente |

Esta secuencia permite al agente comprender primero cómo trabaja el profesor, detectar problemas
y proponer mejoras antes de modificar el aula. Si todavía no tienes la programación en
`knowledge/`, antes del paso 6 usa `/teacher-agent:teaching-plan`.

### 8. Flujo para un aula nueva

| Paso | Qué | Cómo |
| --- | --- | --- |
| 1 | Inicializar y explorar | `teacher-agent init` + `teacher-agent explore` |
| 2 | Aportar tu material | Programación, apuntes y rúbricas en `sources/`, y `teacher-agent ingest` |
| 3 | Escribir la programación | `/teacher-agent:teaching-plan` |
| 4 | Construir el curso | `/teacher-agent:build-course <descripción>`, o tema a tema con `/teacher-agent:build-unit` |
| 5 | Revisarlo | `/teacher-agent:align` y `/teacher-agent:audit` |

### 9. Otras órdenes

| Orden | Para qué |
| --- | --- |
| `teacher-agent` | Pregunta si quieres `run` o `chat` |
| `teacher-agent skills` | Lista las habilidades, incluidas las tuyas |
| `teacher-agent commands` | Lista los atajos del chat, incluidos los tuyos |
| `teacher-agent --help` | Todas las opciones |

---

### Para profundizar

**Ayudantes** (trabajan por su cuenta y no publican nada): el *investigador* busca con fuentes
citadas; el *revisor pedagógico* da una segunda opinión sobre planes y actividades; el *probador
de prácticas* las ejecuta en Docker (opcional: `"allowPracticeRunner": true` en `config.json`).

**Habilidades**, agrupadas por lo que hacen (`teacher-agent skills` para verlas todas):

- **Construir**: `course-building`, `unit-building`, `resource-authoring`,
  `assignment-building`, `activity-building`, `quiz-design`, `quiz-building`, `rubric-design`,
  `practice-testing`, `publish-check`.
- **Diseñar**: `course-design`, `teaching-methodologies`, `teaching-plan`, `course-alignment`,
  `topic-research`.
- **Llevar el curso**: `course-orientation`, `moodle-navigation`, `grading-rubric`, `forum`,
  `progress-monitoring`, `course-auditor`.

**Habilidades y atajos propios**: una carpeta `.claude/skills/<nombre>/SKILL.md` o un archivo
`.claude/commands/<nombre>.md` en la carpeta del curso. Ver "Avanzado" en el
[README](../README.md#avanzado-enséñale-habilidades-nuevas).
