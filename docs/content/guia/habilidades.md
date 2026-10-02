---
title: Sus habilidades
sidebar_position: 6
description: "Todo lo que miyagi sabe hacer, agrupado por tareas, con un ejemplo de cómo pedírselo en el chat."
---

# Sus habilidades

Una **habilidad** es un conocimiento que el asistente aplica por su cuenta cuando la tarea lo pide: cómo corregir con justicia, cómo escribir una buena pregunta de test, cómo montar un taller de coevaluación en Moodle… No hace falta llamarlas ni saberse sus nombres. Basta con pedirle el trabajo con tus palabras, y él elige las que necesita (a menudo varias a la vez).

Aquí están todas, agrupadas por lo que hacen, con un ejemplo de cómo pedírselo en el chat. Algunas tienen además un **atajo** (`/miyagi:...`) que la pone en marcha directamente.

Para verlas desde la terminal: `miyagi skills`.

## Llevar el curso día a día

### 🧭 `course-orientation` · Conocer el curso

Antes de hacer algo complejo, se sitúa: cómo está organizado el curso, cómo se evalúa, qué plazos hay, por dónde se comunica la clase y qué puede hacer realmente con tu cuenta. Busca lo justo para la tarea, sin recopilar de más, y lo apunta para no tener que volver a mirarlo.

- **Pídeselo así:** *«Antes de nada, conoce el curso: cómo se evalúa y qué entregas vienen.»*
- **Atajo:** `/miyagi:orient`

### 🗺️ `moodle-navigation` · Leer el curso tal como es

Lee la estructura real del curso en Moodle 4 y 5: secciones, actividades y recursos, restricciones de acceso, condiciones de finalización y cómo se relacionan unas actividades con otras. Así no supone qué es algo por su nombre: lo abre y lo comprueba. La usa por debajo de casi todo lo demás.

- **Pídeselo así:** *«¿Qué hace falta para que se abra el tema 3? ¿Depende de alguna actividad anterior?»*

### ✅ `grading-rubric` · Corregir con justicia

Corrige tareas, preguntas abiertas de los cuestionarios y la participación en foros evaluables con un criterio justo y **el mismo para todos**. Si le has dado tu rúbrica o tu solucionario, mandan sobre su criterio. Escribe una retroalimentación útil para cada estudiante, te enseña cada nota antes de guardarla y apunta qué criterio aplicó para mantenerlo en la siguiente corrección.

- **Pídeselo así:** *«Corrige las entregas de la Tarea 2 con la rúbrica que te dejé en sources.»*
- **Atajo:** `/miyagi:grade`

### 💬 `forum` · Llevar el foro

Decide cuándo conviene que intervenga el profesor y cuándo es mejor dejar que los estudiantes se respondan entre ellos. Escribe respuestas y correcciones útiles, publica avisos para toda la clase, se asegura de que cada mensaje se publique una sola vez y apunta las dudas que se repiten, en el tema al que pertenecen.

- **Pídeselo así:** *«¿Hay dudas sin responder en el foro? Contéstalas con tono cercano.»*
- **Atajo:** `/miyagi:forum`

### 📈 `progress-monitoring` · Ver cómo va la clase

Revisa el progreso y las calificaciones y, en lugar de darte una lista de notas, separa a quien va bien de quien se está quedando atrás, prioriza y te propone qué hacer. Compara con las revisiones anteriores, así que te dice si la clase mejora o empeora. Solo guarda tendencias de la clase, nunca fichas de estudiantes concretos.

- **Pídeselo así:** *«¿Quién se está quedando atrás y qué le está costando más a la clase?»*
- **Atajo:** `/miyagi:progress`

### 🔍 `course-auditor` · Auditar el curso

Hace una revisión completa del curso (organización, accesibilidad, coherencia pedagógica, evaluación, enlaces rotos, contenido caducado) o una pasada ligera de mantenimiento, y te da recomendaciones ordenadas por prioridad en vez de una lista sin más. También sirve para preparar una nueva edición del curso. Guarda cada auditoría con su fecha para saber qué ha mejorado desde la anterior.

- **Pídeselo así:** *«Revisa el curso y dime qué mejorarías antes de que empiece el trimestre.»*
- **Atajo:** `/miyagi:audit`

## Crear contenido y actividades

### 📝 `resource-authoring` · Escribir apuntes y recursos

Escribe o edita el contenido del curso: apuntes como página o como libro, y los recursos que los acompañan (archivos, carpetas, enlaces, áreas de texto y multimedia, resúmenes de sección). Con explicaciones y ejemplos de verdad al nivel de tus estudiantes, bien estructurados, con las fuentes citadas y coherentes con el resto del curso.

- **Pídeselo así:** *«Crea unos apuntes sobre normalización para el tema 2, con ejemplos de una tienda online.»*

### 📤 `assignment-building` · Crear tareas

Diseña y configura tareas de cualquier tipo: respuesta escrita, entrega de archivos, trabajo en grupo, hitos de un proyecto, informe de prácticas, análisis de casos, portafolio, exposición oral o en vídeo, entregas por borradores. Escribe un enunciado que pida razonar o producir algo de verdad, ajusta la entrega a lo que se pide, pone fecha límite y de corte, y le prepara su rúbrica.

- **Pídeselo así:** *«Crea una tarea para el tema 3: el modelo entidad-relación de una biblioteca, en PDF, con plazo de dos semanas.»*

### 📏 `rubric-design` · Diseñar rúbricas

Construye una rúbrica o guía de corrección desde cero cuando una actividad no la tiene: criterios que se pueden observar y niveles de desempeño claros. La deja configurada en Moodle y en sus apuntes. También detecta problemas en una rúbrica existente (criterios ambiguos, niveles que se solapan).

- **Pídeselo así:** *«La Tarea 4 no tiene rúbrica. Propónme una de cuatro criterios antes de corregir.»*

### ❓ `quiz-design` · Escribir buenas preguntas

Escribe preguntas de cuestionario bien hechas: distractores creíbles, niveles variados (recordar, aplicar, analizar), enunciados sin ambigüedades y retroalimentación útil en cada opción. También revisa un cuestionario existente en busca de preguntas triviales, repetidas o mal redactadas.

- **Pídeselo así:** *«Revisa las preguntas del cuestionario del tema 1: ¿hay alguna demasiado fácil o confusa?»*
- **Atajo:** `/miyagi:quiz <tema>` (junto con `quiz-building`)

### 🧩 `quiz-building` · Montar cuestionarios

Crea o modifica cuestionarios en Moodle: su configuración (fechas, tiempo, intentos, método de calificación, comportamiento de las preguntas, qué ve el alumno al revisar), añade las preguntas una a una o las importa de golpe en formato GIFT, y comprueba el orden y la puntuación total. Cambia los cuestionarios que ya tienen intentos con cuidado de no perjudicar a nadie.

- **Pídeselo así:** *«Crea un cuestionario de repaso de 12 preguntas sobre JOIN, sin límite de intentos.»*
- **Atajo:** `/miyagi:quiz <tema>`

### 🎲 `activity-building` · Otras actividades de Moodle

Diseña y monta el resto de actividades para que funcionen como deben: talleres de coevaluación, lecciones con itinerarios, glosarios, wikis, bases de datos, consultas, encuestas, foros evaluables y H5P. Y también las piezas que conectan las actividades: condiciones de finalización, restricciones de acceso, insignias y grupos.

- **Pídeselo así:** *«Añade un taller de coevaluación para la práctica final, con la rúbrica de la tarea.»*

### 📦 `scorm-packaging` · Actividades web como SCORM

Empaqueta una actividad web (un juego en HTML, una simulación, un ejercicio interactivo, tuyo o uno publicado en internet) como paquete SCORM para que Moodle registre si el alumno la completó y su nota en el calificador. Descarga la actividad con todos sus archivos, le añade un pequeño puente que habla con Moodle sin cambiar cómo se juega, la comprime y la sube oculta para probarla antes de mostrarla. Todo con sus propias herramientas de archivos, sin terminal.

- **Pídeselo así:** *«Empaqueta como SCORM el juego de esta dirección y súbelo al Tema 2 para que cuente para la nota.»*

### 🐳 `practice-testing` · Probar las prácticas en Docker

Comprueba una práctica **ejecutándola de verdad** en contenedores Docker: sigue el enunciado como lo haría un alumno antes de publicarlo, o ejecuta la entrega de un estudiante al corregirla y usa el resultado como prueba. Es para cursos de informática (Docker, Linux, programación, bases de datos) y solo funciona si has activado el probador de prácticas (ver [Prácticas en Docker](../avanzado/practicas-docker.md)).

- **Pídeselo así:** *«Crea una práctica de Docker Compose con una web y una base de datos, y pruébala antes de publicarla.»*

### 👀 `publish-check` · Revisar antes de publicar

La última comprobación antes de que algo llegue a tus estudiantes, y la lista con la que revisa lo que ya está publicado. Mira la redacción (sin relleno, sin repeticiones, sin afirmaciones sin comprobar, con los términos del curso), la accesibilidad (títulos, texto alternativo en imágenes, enlaces con texto claro, tablas, color) y cómo lo ve y lo usa un estudiante de verdad. Aquí están también las reglas de cuándo pedirte aprobación. Se aplica sola en cada publicación.

- **Pídeselo así:** *«Revisa la accesibilidad de los apuntes del tema 1.»*

## Diseñar y planificar

### 📐 `course-design` · Diseñar con cabeza

Los principios con los que planifica un curso o un tema antes de crear las piezas: una organización progresiva, objetivos alineados con los contenidos, las actividades y la evaluación, tipos de actividad variados y un equilibrio entre evaluación inicial, formativa y final.

- **Pídeselo así:** *«¿Cómo organizarías un tema de 3 semanas sobre seguridad web? Solo la propuesta, no lo crees todavía.»*

### 💡 `teaching-methodologies` · Elegir la metodología

Elige y aplica una metodología que encaje con lo que se quiere aprender, y la monta con las piezas de Moodle que la hacen posible: aprendizaje basado en proyectos, retos o problemas, clase invertida, gamificación, aprendizaje cooperativo, estudio de casos, aprendizaje-servicio, design thinking, indagación, rutinas de pensamiento, debate y juego de rol, evaluación formativa y diseño universal para el aprendizaje (DUA). Si tienes una en mente, pídesela.

- **Pídeselo así:** *«Quiero que el tema 5 sea aprendizaje basado en retos. Propónme cómo reorganizarlo.»*

### 📋 `teaching-plan` · Escribir la programación didáctica

Te ayuda a escribir o revisar la programación didáctica del curso (contexto, objetivos, contenidos y temas, metodología, evaluación y calificación, temporalización, atención a la diversidad, recursos) a partir de tu material y tus decisiones. Te pregunta lo que solo tú puedes decidir, como las horas, el calendario o los pesos, y marca como propuesta lo que no hayas decidido. Queda en sus apuntes, enlazada con cada tema. No se publica en Moodle salvo que se lo pidas.

- **Pídeselo así:** *«Escribe la programación a partir del borrador del departamento que te dejé en sources.»*
- **Atajo:** `/miyagi:teaching-plan`

### 🎯 `course-alignment` · Comprobar que el curso sigue la programación

Compara el curso de Moodle con la programación: objetivos o criterios que ninguna actividad evalúa, rúbricas que faltan, temas, fechas o pesos distintos de lo previsto, y cosas del curso que la programación no contempla. Te propone los cambios para alinearlos y los hace con tu aprobación.

- **Pídeselo así:** *«¿Mi aula evalúa todos los criterios de la programación?»*
- **Atajo:** `/miyagi:align`

### 🔎 `topic-research` · Investigar un tema

Investiga en internet cuando el material del curso no basta: el estado actual de una tecnología o una versión, documentación oficial, buenas prácticas, recursos didácticos, ejemplos, datos. Se apoya en su ayudante investigador, contrasta las fuentes (primero las oficiales) y guarda lo encontrado en sus apuntes con las fuentes citadas. La usa también por su cuenta antes de escribir sobre algo que puede haber cambiado.

- **Pídeselo así:** *«Investiga qué novedades de PostgreSQL 17 merece la pena contar en clase.»*
- **Atajo:** `/miyagi:research <tema>`

## Construir temas y cursos

### 🧱 `unit-building` · Construir un tema

Construye un tema completo dentro de un curso que ya existe, encajado en su programación, su calendario, sus pesos y su estilo: elige la metodología, lo planifica, lo hace revisar por el revisor pedagógico, crea los apuntes, las actividades y las rúbricas, lo comprueba como lo vería un alumno y te dice qué conviene que revises.

- **Pídeselo así:** *«Añade un tema 7 sobre MongoDB, de 3 semanas, con una práctica por parejas al final.»*
- **Atajo:** `/miyagi:build-unit <descripción>`

### 🏗️ `course-building` · Construir un curso completo

Construye un curso entero a partir de una descripción (materia, nivel, duración): primero la programación, luego la sección de bienvenida y cada tema con contenido real, actividades y rúbricas, y al final las comprobaciones de todo el curso (libro de calificaciones, calendario, vista de estudiante). Para cada tema usa `unit-building`. Está pensada para un curso vacío.

- **Pídeselo así:** *«Monta un curso de introducción a HTML5 y CSS3 para 1.º de DAW, de 5 temas.»*
- **Atajo:** `/miyagi:build-course <descripción>`

## Sus apuntes del curso

Estas cuatro mantienen la carpeta `knowledge`, donde el asistente guarda lo que aprende del curso para acordarse en la siguiente conversación. Lo tienes explicado en [La memoria del curso](memoria.md).

### 📥 `knowledge-ingest` · Incorporar documentos

Lee un documento (un archivo de `sources`, una página de Moodle) y lo incorpora a sus apuntes: escribe un resumen, crea o actualiza las páginas de los conceptos que trata y lo enlaza todo con el índice.

- **Pídeselo así:** *«Te he dejado en sources la rúbrica de la práctica final. Incorpórala.»*
- **Atajo:** `/knowledge:ingest` (o `miyagi ingest` desde la terminal)

### 🧠 `knowledge-query` · Consultar sus apuntes

Responde a una pregunta a partir de lo que tiene apuntado, con enlaces a las páginas de donde lo saca, sin abrir Moodle. Si la respuesta merece guardarse, la añade a sus apuntes.

- **Pídeselo así:** *«¿Qué criterio acordamos para las entregas fuera de plazo?»*
- **Atajo:** `/knowledge:query <pregunta>`

### 🧹 `knowledge-lint` · Revisar sus apuntes

Revisa que sus apuntes estén sanos: enlaces rotos, páginas que no están en el índice o que nadie enlaza, conceptos duplicados, contradicciones y huecos. Arregla lo mecánico y te cuenta el resto.

- **Pídeselo así:** *«Revisa tus apuntes del curso y dime si hay algo contradictorio.»*
- **Atajo:** `/knowledge:lint`

### 📄 `knowledge-pages` · El formato de sus apuntes

Las plantillas con las que escribe cada tipo de página de sus apuntes (índice, diario de cambios, resumen, concepto, síntesis), para que todas tengan la misma forma y los mismos enlaces. No hace falta pedírsela: la usa sola cada vez que escribe en `knowledge`.

## Sus ayudantes

Para algunas tareas, el asistente se apoya en ayudantes especializados que trabajan por su cuenta y le devuelven un informe. Ninguno puede publicar nada en Moodle.

| Ayudante | Qué hace | Cuándo está disponible |
| --- | --- | --- |
| Investigador | Busca en internet, lee las fuentes (primero las oficiales) y devuelve lo encontrado con enlaces y fechas. | Siempre, en `chat` y `run` |
| Revisor pedagógico | Revisa un plan o una actividad: coherencia entre objetivos, actividades y evaluación, metodología, carga de trabajo y atención a la diversidad. | Siempre, en `chat` y `run` |
| Probador de prácticas | Ejecuta las prácticas en contenedores Docker. | Solo si lo activas ([Prácticas en Docker](../avanzado/practicas-docker.md)) |

## Tus propias habilidades

Puedes enseñarle habilidades nuevas para tu asignatura sin programar: un archivo de texto con las instrucciones, escritas como se las explicarías a un profesor en prácticas. Aparecen en `miyagi skills` marcadas como `[propia]`. Cómo escribirlas, con un ejemplo completo: [Habilidades propias](../avanzado/habilidades-propias.md).
