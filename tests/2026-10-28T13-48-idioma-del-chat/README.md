# El chat, entero en español

Verificación de la #26 con agent-kit 0.31.0, que repite el idioma de respuesta junto a cada resultado de herramienta (agent-kit#85). Cinco sesiones en español, sin aula, que leen fuentes con `Read` y cargan skills: lo que antes hacía que algunas frases de la narración salieran en inglés.

| Dato | Valor |
| --- | --- |
| Fecha | 28 oct 2026, 13:48–13:55 (hora de Canarias, UTC+0) |
| Entorno | Windows 11, sin aula |
| Versiones | miyagi `main` en c1eb08f (agent-kit 0.31.0) |
| Cuenta | la suscripción de Claude del desarrollador |
| Asignatura | nueva en el scratchpad, `agent.language: "español"`; en `sources/`, el temario del tema 1 y la rúbrica de la Tarea 1 de `smoke-ingest` |

## Veredicto

**Superada.** Ninguna línea en inglés en la narración de las cinco sesiones: ni tras leer los originales en inglés de las skills, ni tras los resultados de `Read`, de las herramientas de la base de conocimiento o del revisor pedagógico. Antes, el 25 de octubre, una sesión corta escribió dos frases en inglés justo después de un `Read`.

## Qué se ejecutó

| Sesión | Encargo | Duración | Llamadas | Resultado |
| --- | --- | --- | --- | --- |
| `ingest` | Las dos fuentes | 1,7 min | 20 (`knowledge-ingest` y `knowledge-lint`, 2 `Read`) | 8 páginas y el `overview` |
| `run` | La programación del tema 1, con su evaluación según la rúbrica, leyendo las fuentes completas | 3,4 min | 39 (`teaching-plan`, 4 `Read`, 11 lecturas de la base, delegación en `pedagogy-reviewer`) | `course/teaching-plan` revisada, y lo que el docente debe decidir |
| `run` | La unidad del tema 1 en borradores: apuntes y el enunciado de la Tarea 1 | 1,5 min | 22 (`materials-format`, 4 validaciones, 2 exportaciones) | 4 materiales válidos y su vista previa en `drafts/` |
| `run` | La nota y la retroalimentación de una entrega inventada, con la rúbrica | 0,3 min | 7 (1 `Read`) | 4,5 sobre 10, por criterio, con lo que falla y cómo mejorarlo |
| `run` | Los errores frecuentes del temario, buscados en el original | 0,3 min | 5 (1 `Read`) | Los tres errores citados tal cual, con el objetivo al que afectan |

Las cuatro sesiones `run` en modo `autonomous`, que sin aula no publica nada.

## Cómo se comprobó

- Leída la narración entera de los cinco registros de consola: todo en español, incluidas las frases cortas entre herramientas («Leídos ambos. Consulto las plantillas…», «Plan escrito. Lo paso al revisor pedagógico.», «Valido los materiales.»).
- Búsqueda de palabras frecuentes del inglés (`the`, `and`, `I'll`, `let me`, `now I`, `reading`, `creating`, `writing`) en las líneas del agente, sin las de acciones y tareas: 0 coincidencias.

## Hallazgos

Ninguno.

## Qué no cubrió

- Sesiones con aula, cuyos resultados de moodle-mcp también llegan en inglés.
- Sesiones largas (más de 4 minutos) y el `chat` interactivo.
