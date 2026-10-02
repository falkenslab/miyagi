---
title: "5. Temas 2 y 3: DDL y DML"
sidebar_position: 6
description: Los temas de definir y manipular datos, con entregables con rúbrica, cuestionarios, y qué hacer cuando miyagi se salta un paso.
---

# 5. Temas 2 y 3: DDL y DML

Con el primer tema montado y revisado, le pedimos los dos siguientes en un solo encargo:

<p className="pide">/miyagi:build-unit Temas 2 y 3, uno detrás de otro, siguiendo la programación: Tema 2 (DDL: CREATE TABLE con claves y restricciones, ALTER, DROP sobre la base de datos tienda) y Tema 3 (DML: INSERT, UPDATE, DELETE y los errores típicos). Cada uno con sus apuntes, ejercicios entregables, cuestionario y las prácticas probadas en Docker.</p>

Sigue el mismo método que en el Tema 1: el probador de prácticas ejecuta en MariaDB cada `CREATE TABLE`, cada clave ajena y cada `ALTER TABLE` con datos ya dentro, y cada error que los apuntes van a explicar (por ejemplo, el `ERROR 1452` al insertar un pedido de un cliente que no existe). Después escribe los apuntes, la práctica guiada, los ejercicios con su rúbrica y el cuestionario.

## Lo que aprendió del Tema 1

Los apuntes del Tema 2 salieron ya con el código en bloques y los nombres de tablas y columnas en formato de código, a la primera. Fue la lección que dejamos en sus habilidades al arreglar la práctica guiada del Tema 1.

<Shot kind="moodle" src="/img/casos/22-t2-libro.webp" alt="El primer capítulo de los apuntes del Tema 2 visto por un alumno: qué es DDL, las tres sentencias CREATE TABLE, ALTER TABLE y DROP TABLE en formato de código, y el comando para entrar en el contenedor en un bloque de código; a la derecha, la tabla de contenidos con los seis capítulos.">Los apuntes del Tema 2: seis capítulos, del qué es DDL a `DROP TABLE` y `SHOW CREATE TABLE`.</Shot>

<Shot kind="moodle" src="/img/casos/24-t3-libro.webp" alt="El primer capítulo de los apuntes del Tema 3: qué es DML y en qué se diferencia de DDL, con INSERT, UPDATE y DELETE y las tablas de la tienda en formato de código.">Y los del Tema 3, sobre la misma base de datos `tienda`.</Shot>

## Entregables con rúbrica

Cada tema tiene un entregable: un fichero `.sql` que debe ejecutarse entero sobre un MariaDB limpio. La rúbrica la diseña miyagi a partir de los criterios de evaluación de la programación, y te la enseña antes de guardarla:

<Shot src="/img/casos/26-aprobacion-rubrica-dml.webp" alt="Panel de aprobación: publicar la rúbrica de Ejercicios DML sobre 10 puntos, con cuatro criterios: INSERT correcto, UPDATE y DELETE con WHERE, explicación del error de clave ajena al borrar, y ejecutable y legible, cada uno con sus niveles.">La rúbrica de los ejercicios DML, criterio a criterio y nivel a nivel, antes de existir en Moodle.</Shot>

El alumno la ve junto al enunciado, así que sabe desde el principio cómo se le va a corregir:

<Shot kind="moodle" src="/img/casos/23-t2-ejercicios-rubrica.webp" alt="La tarea Ejercicios DDL vista por un alumno: el enunciado con los cuatro pasos (las cuatro tablas, una tabla categorías, dos ALTER TABLE), las fechas, el estado de la entrega y la rúbrica con tres criterios: tablas y restricciones (5 puntos), ampliación con ALTER TABLE (3) y ejecutable y legible (2).">El enunciado de los ejercicios DDL y su rúbrica, desde la cuenta de un alumno.</Shot>

Y un cuestionario de diez preguntas por tema, importadas en GIFT y ordenadas:

<Shot kind="moodle" src="/img/casos/25-t3-quiz.webp" alt="Las diez preguntas del Cuestionario del Tema 3 en Moodle, de T3-01 a T3-10, un punto cada una, sobre INSERT, UPDATE, DELETE y los errores de clave ajena, NOT NULL y CHECK.">El cuestionario del Tema 3.</Shot>

## Cuando se salta un paso

En estos dos temas, miyagi no siguió del todo su propio método. En el Tema 1 subía cada pieza oculta, la revisaba y te pedía permiso para mostrarla. Aquí guardó los apuntes, las prácticas y las tareas directamente visibles. El vigilante de publicación paró cada uno de esos guardados para preguntar, pero sin el resumen detallado de una aprobación normal. Además, el cuestionario del Tema 3 quedó visible antes de estar completo.

Lo detectamos al revisar el curso y se lo dijimos tal cual:

<p className="pide">Seguimos. Antes de nada: en los temas 2 y 3 todo quedó visible para los alumnos sin que me pidieras permiso para mostrarlo, y el cuestionario del Tema 3 está visible a medias. Oculta ese cuestionario, termina de añadirle las preguntas en orden, revísalo y pídeme permiso para mostrarlo. Y una cosa más: el Tema 1 llama al contenedor mariadb-tienda y el Tema 2 mi-mariadb; unifícalo con mariadb-tienda.</p>

Ocultó el cuestionario, lo terminó, comprobó las preguntas y pidió permiso, esta vez con todo el detalle:

<Shot src="/img/casos/28-aprobacion-mostrar-quiz.webp" alt="Panel de aprobación: mostrar a los alumnos el Cuestionario del Tema 3, ya completo, con 10 preguntas de opción múltiple sobre INSERT, UPDATE y DELETE y los errores típicos, 2 intentos, retroalimentación inmediata, abre el 29 de octubre y cierra el 1 de noviembre.">Mostrar el cuestionario, ahora con su resumen.</Shot>

Y respondió con lo que había hecho, reconociendo el fallo de proceso y ofreciendo ocultar el resto para revisarlo pieza por pieza:

<Shot src="/img/casos/27-correccion-proceso.webp" alt="La respuesta de miyagi: el cuestionario del Tema 3 oculto, completado, revisado y mostrado con permiso; el contenedor unificado como mariadb-tienda en los apuntes del Tema 2; y el reconocimiento de que el libro, la página y la tarea de los temas 2 y 3 se publicaron sin pasar por ocultar, revisar y pedir permiso, con la oferta de ocultarlos para revisarlos.">miyagi explica qué ha corregido y qué hizo mal.</Shot>

:::tip Revisa como alumno
Ninguna revisión automática sustituye a la tuya. Abre el curso con la vista de alumno de vez en cuando y díselo con tus palabras si algo no te convence: lo corrige, y lo que le enseñas queda en su memoria del curso.
:::

Siguiente paso: [el Tema 4 y la práctica final](tema-4-consultas.md).
