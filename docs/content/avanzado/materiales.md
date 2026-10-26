---
title: Tus materiales
sidebar_position: 6.5
description: "Las preguntas, los cuestionarios, los apuntes, las tareas con sus rúbricas y los temas de tu asignatura, escritos una vez en materials/ como texto que puedes leer y editar, y publicados en el aula por código: el formato, lo que se comprueba, los exámenes en papel y el registro de lo publicado."
---

# Tus materiales

Las preguntas, los cuestionarios, los apuntes, las tareas con sus rúbricas y los temas de tu asignatura se escriben una vez, en la carpeta `materials/`, como texto que puedes abrir y editar con cualquier editor. Esa es la versión buena. Lo que el aula importa (el GIFT de un banco de preguntas, el HTML de unos apuntes) lo genera miyagi a partir de ella con código, no a mano: así no hay escapes mal puestos, código que pierde su sangría, preguntas sin respuesta correcta ni imágenes sin texto alternativo.

Cada asignatura tiene su `materials/` al lado de `sources/` y `drafts/`. Es tuya: miyagi escribe en ella, tú también, y no se ignora si versionas la carpeta con git.

## Un banco de preguntas

Un archivo `.questions.md`, por ejemplo `materials/tema-1/variables.questions.md`:

````markdown
---
title: Tema 1 · Variables
category: Tema 1
---

## T1-01 Qué guarda una variable
type: single · points: 1

¿Qué guarda una variable en un programa?

- [x] Un valor que puede cambiar mientras se ejecuta
- [ ] Siempre el mismo valor
  > Eso es una constante: una variable puede cambiar.
- [ ] El nombre del programa
  > El nombre del programa no se guarda en una variable.

> Una variable es un nombre para un valor que puede cambiar.

## T1-02 Traza
¿Qué muestra este programa?

```python
for i in range(2):
    print(i)
```

- [x] 0 y 1
- [ ] 1 y 2
  > range(2) empieza en 0.
````

- Cada pregunta empieza con `##` y su nombre, que no se repite.
- La línea `type: … · points: …` es opcional: si no está, el tipo se deduce de las respuestas. También puede llevar `criteria: 1.1` (los criterios de los que da evidencia) y `level: basic` (`basic`, `intermediate` o `advanced`), para usar los bancos como banco de exámenes.
- El enunciado es texto normal; el código va en un bloque, con su sangría, tal cual.
- Las respuestas son la última lista: `- [x]` las correctas, `- [ ]` las demás. Debajo de cada opción, con sangría y `>`, por qué es incorrecta. Al final, también con `>`, la explicación general.
- Tipos: una respuesta (`single`), varias (`multiple`), verdadero o falso (`answer: true`), respuesta corta (`- def`), numérica (`answer: 3.5 · tolerance: 0.1`), emparejar (`- int -> 3`), ordenar (lista numerada, solo en papel) y redacción (sin lista).

## Un cuestionario

Un archivo `.quiz.md` dice para qué es, cómo quieres que funcione y qué preguntas toma de qué bancos (todas, unas concretas o un número al azar):

```markdown
---
title: Repaso del tema 1
purpose: practice
settings:
  attempts: unlimited
  time limit: none
questions:
  - bank: variables.questions.md
    pick: all
---
Diez preguntas para repasar las variables antes del examen.
```

Cada banco del cuestionario puede filtrarse con `criteria: [1.1]` y `level: basic`: toma solo esas preguntas, todas o un número de ellas. Un número con filtro se sortea al exportar y sale igual para todos los alumnos; para un sorteo distinto por alumno, esas preguntas van en su propio banco.

## Unos apuntes

Un archivo `.notes.md`, como página o como libro (`as: book`, con un capítulo por cada `##`):

```markdown
---
title: Variables y tipos
as: page
---
Una **variable** es un nombre para un valor que puede cambiar.

## Tipos básicos

![Tabla con los tipos int, float y str](tipos.png)
```

Los títulos empiezan en `##` (el aula ya muestra el título de la página). Las imágenes van junto al archivo, cada una con lo que muestra como texto alternativo, y los enlaces dicen adónde llevan. miyagi los convierte en HTML accesible: títulos en orden, código con su sangría, tablas con su cabecera, y las imágenes copiadas al lado para subirlas con la página.

## Una tarea y su rúbrica

La tarea (`.assignment.md`) lleva su enunciado como texto y, arriba, lo que pide: nota, tipo de entrega, formatos, fechas y su rúbrica. Las fechas pueden ser reales (`2026-11-20 23:59`) o relativas al comienzo de cada grupo (`semana 3 viernes 23:59`).

```markdown
---
title: "Tarea 1: explica qué es una variable"
grade: 10
rubric: tarea-1.rubric.md
submission: file
formats: [pdf]
due: semana 3 viernes 23:59
---
## Qué tienes que hacer
…
```

La rúbrica (`.rubric.md`) tiene un `##` por criterio y sus niveles con su puntuación delante:

```markdown
---
title: Rúbrica de la Tarea 1
total: 10
---
## Explica el concepto
- 4: Explica con sus palabras qué es y para qué sirve
- 2: Lo explica de forma incompleta
- 0: No lo explica, o es incorrecto
```

miyagi comprueba que cada criterio tenga al menos dos niveles, que no se repitan puntuaciones y que los mejores niveles sumen el total. La exporta tal como la espera el formulario de calificación del aula, y también como una tabla para imprimir. Al corregir, usa la versión publicada: si cambiaste la rúbrica después, te avisa antes.

## Un tema, el calendario y la calificación

- **`materials/<tema>/unit.md`**: los materiales del tema en el orden en que los ve el alumno, y qué abre cada uno (`2. tarea-1.assignment.md · after: variables.notes.md viewed`). miyagi comprueba que cada condición se refiera a algo anterior.
- **`materials/course.md`**: cuándo empieza cada grupo, los festivos y las evaluaciones. Con él, «semana 3 viernes 23:59» es una fecha real para cada grupo; si cae en festivo o en fin de semana, pasa al día lectivo anterior y te lo dice.
- **`materials/grading.md`**: las categorías con su peso (que deben sumar 100 %) y sus actividades. De ahí salen el plan del libro de calificaciones y una hoja de cálculo para calificar fuera del aula, sin ningún alumno dentro.

Con `/miyagi:publish` publicas un material o un tema entero: lo comprueba, lo exporta, lo sube oculto en su orden y con sus restricciones, lo prueba y te pide aprobación para mostrarlo. También puede leer un curso que ya tienes en el aula y pasarlo a `materials/`, sin publicar nada.

## Lo que hace miyagi con ellos

- **Los comprueba** antes de nada: que cada pregunta de una respuesta tenga exactamente una correcta, que haya opciones suficientes, que los nombres no se repitan, que los bancos de un cuestionario existan, que los criterios que citas estén en tu programación, y en los apuntes que cada imagen tenga su texto alternativo y que los títulos no se salten niveles. Te dice qué falla y en qué línea.
- **Los exporta** al formato del aula, en `drafts/materials/`, y comprueba lo que ha generado. Lo que ese formato no puede expresar sin cambiar una pregunta (ordenar, por ejemplo) no lo cambia por su cuenta: te pregunta. Lo que se pierde sin cambiarla (la puntuación de cada pregunta, que la pone el cuestionario) aparece escrito por código en la aprobación que te pide antes de publicar.
- **Lleva un registro de lo publicado**, con una huella de cada versión: sabe qué materiales están en el aula, cuáles has cambiado desde entonces y cuáles no se han publicado nunca.
- **Imprime exámenes en papel**: versiones A, B… con las preguntas y las opciones en otro orden, cada una con su hoja de respuestas, en `drafts/exams/`. Guarda la semilla, así que puede volver a imprimir exactamente las mismas. Pídeselo con `/miyagi:exam` o con tus palabras.
- **Convierte tus bancos GIFT** (los que dejes en `sources/` o los que ya hizo en `drafts/`) en archivos `.questions.md`, para que los edites a partir de entonces.

## Una encuesta de intereses y las variantes de una actividad

Una encuesta va en `materials/surveys/<nombre>.survey.md`: su título, para qué es (`purpose`, lo primero que leen los alumnos), `anonymous: true`, su grupo de `course.md` y unas pocas preguntas con `## nombre`, `type: single`, `multiple` o `text` y sus opciones como lista. Si no es anónima o pregunta algo que identifica a un alumno o algo delicado, no pasa la validación.

Una tarea o un cuestionario lista sus variantes con `variants: [tarea-2.musica.assignment.md, tarea-2.deporte.assignment.md]`, de dos a cuatro, cada una en su archivo junto a la neutra. La validación compara cada variante con la neutra y no deja pasar ninguna que cambie algo más que el contexto: la nota, la rúbrica, los criterios, la entrega, las fechas o, en un cuestionario, el tipo, los puntos, los criterios o el nivel de cada pregunta.

## El estilo de lo que publicas

Lo que exporta es HTML accesible que toma el tema de tu aula. Si quieres otro aspecto (una cabecera con el título, el enunciado en un recuadro, el código con un rótulo para copiarlo, la retroalimentación en un marco de color), instala una extensión de estilo, como `moodle-ui-kit`, y pídele que la use: «usa el estilo moodle-ui-kit». Queda guardado en `appearance` (ver [Configuración](configuracion.md)), y «vuelve al estilo de mi aula» lo deshace.

Un estilo es una carpeta `style/` con una plantilla HTML por tipo (`page`, `assignment`, `code`, `question` y `feedback`) y marcadores como `{{title}}`, `{{body}}` o `{{code}}`, que rellena el exportador. Puedes hacer el tuyo. Venga de donde venga, miyagi lo hace accesible al rellenarlo: convierte en encabezados los párrafos en negrita que hacen de título, oculta los emojis al lector de pantalla y quita la fuente y el fondo propios y los colores que no contrastan. Si arregla algo, te lo dice. Después de publicar comprueba que el aula ha conservado los estilos: si los quita, te lo cuenta y publica sin estilo.

El código está en [`src/materials/`](https://github.com/falkenslab/miyagi/tree/main/src/materials) y tiene sus pruebas en [`test/`](https://github.com/falkenslab/miyagi/tree/main/test).
