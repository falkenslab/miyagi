# Informes de pruebas

Cada prueba de principio a fin de teacher-agent contra un Moodle real queda aquí, en su propia carpeta `AAAA-MM-DDTHH-MM-<nombre>/`, con el informe completo (`README.md`) y sus capturas (`assets/`). Las más recientes van arriba.

| Fecha | Prueba | Entorno | Resultado | Hallazgos |
| --- | --- | --- | --- | --- |
| 27 sep 2026 | [Curso "Introducción a HTML5 y CSS3" construido por el agente](2026-09-27T10-54-course-html-css-intro/README.md): 6 unidades con apuntes, cuestionarios, prácticas con rúbrica y proyecto por hitos desde una sola frase, con la programación redactada por el agente | moodle-sandbox · Moodle 5.2 · Docker 29 | Superada con hallazgos | 7 (5 convertidos en regla, 1 abierto en agent-kit, 1 aceptado) |
| 26 sep 2026 | [Programación didáctica, alineación y un tema por retos](2026-09-26T22-01-teaching-plan-and-unit/README.md): la programación desde un borrador del profesor, el aula alineada con ella y un tema 4 con reto por equipos, coevaluación e insignia; primeros `researcher` y `pedagogy-reviewer` | moodle-sandbox · Moodle 5.2 · Docker 29 | Superada con hallazgos menores | 7 (6 corregidos o convertidos en regla, 1 del sandbox) |
| 26 sep 2026 | [Curso "Introducción a Docker" construido por el agente](2026-09-26T13-52-course-docker-intro/README.md): un curso completo desde una descripción (`--task`), prácticas comprobadas en Docker con `practice-runner` y rúbricas añadidas después | moodle-sandbox · Moodle 5.2 · Docker 29 | Superada con hallazgos | 7 (6 corregidos o convertidos en regla, 1 aceptado) |
| 26 sep 2026 | [Aula experimental del profesor](2026-09-26T12-53-guided-run/README.md): `explore`, `ingest` y `run --mode guided` sobre una tarea, un foro y un cuestionario sembrados | moodle-sandbox · Moodle 5.2 | Superada | 5 (todos corregidos o convertidos en regla) |

Cómo se hacen y se guardan estos informes: [CLAUDE.md](CLAUDE.md).
