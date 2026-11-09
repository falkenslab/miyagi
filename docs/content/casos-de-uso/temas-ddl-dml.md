---
title: "5. Temas 2 y 3: DDL y DML"
sidebar_position: 6
description: Los temas de definir y manipular datos, con ejercicios con rúbrica, cuestionarios, y lo que quedó pendiente.
---

# 5. Temas 2 y 3: DDL y DML

Con el primer tema montado, le pedimos los dos siguientes en un solo encargo:

<Prompt>{`/miyagi:build-unit Temas 2 y 3, uno detrás de otro, siguiendo la programación: Tema 2 (DDL: CREATE TABLE con claves y restricciones, ALTER, DROP sobre la base de datos tienda) y Tema 3 (DML: INSERT, UPDATE, DELETE y los errores típicos). Cada uno con sus apuntes, ejercicio entregable con rúbrica, cuestionario y las prácticas probadas en Docker. El contenedor se llama siempre mariadb-tienda. Las fechas de la programación me valen. Publícalo oculto y pídeme permiso para mostrarlo.`}</Prompt>

Sigue el mismo método que en el Tema 1: prueba en un laboratorio cada `CREATE TABLE`, cada clave ajena y cada error que los apuntes van a explicar (por ejemplo, el `ERROR 1452` al insertar un pedido de un cliente que no existe). Después escribe los apuntes, la práctica guiada, el ejercicio con su rúbrica y el cuestionario, y sube cada pieza oculta, con su permiso.

<Shot width="1400" height="1141" kind="moodle" src="/img/v2/moodle-alumno-libro-t2.webp" alt="Los apuntes del Tema 2 vistos por un alumno, con las sentencias DDL en bloques de código.">Los apuntes del Tema 2.</Shot>

<Shot width="1400" height="1045" kind="moodle" src="/img/v2/moodle-alumno-libro-t3.webp" alt="Los apuntes del Tema 3 vistos por un alumno, sobre INSERT, UPDATE y DELETE.">Y los del Tema 3, sobre la misma base de datos `tienda`.</Shot>

## Ejercicios con rúbrica

Cada tema tiene un ejercicio. La rúbrica la diseña miyagi a partir de los criterios de evaluación de la programación, y te la enseña antes de guardarla, criterio a criterio y nivel a nivel:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-05-aprobacion-rubrica.webp" alt="Panel de aprobación con la rúbrica del Ejercicio del Tema 3: cuatro criterios, cada uno con sus niveles y su puntuación.">La rúbrica del ejercicio del Tema 3, antes de existir en Moodle. Esta captura es de una petición de ejemplo que luego rechazamos.</Shot>

El alumno la ve junto al enunciado, así que sabe desde el principio cómo se le va a corregir:

<Shot width="1400" height="1361" kind="moodle" src="/img/v2/moodle-alumno-ejercicio-ddl.webp" alt="El ejercicio del Tema 2 visto por un alumno: enunciado, estado de la entrega y la rúbrica.">El ejercicio de DDL con su rúbrica, desde la cuenta de un alumno.</Shot>

<Shot width="1400" height="1527" kind="moodle" src="/img/v2/moodle-profesor-preguntas-t3.webp" alt="Las preguntas del cuestionario del Tema 3 en Moodle, vistas por el profesor.">Las preguntas del cuestionario del Tema 3.</Shot>

## Lo que quedó pendiente

Al terminar, separa las pruebas que hizo, las decisiones que tomó por su cuenta y lo que queda pendiente de ti:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-05-temas-2-3.webp" alt="El resumen de los temas 2 y 3: las pruebas en Docker, las decisiones de miyagi, y lo que queda pendiente: preguntas del cuestionario del Tema 2, laboratorios en marcha y el Martes de Carnaval.">Resumen de los temas 2 y 3, con lo que queda pendiente.</Shot>

Destacamos dos cosas:

- **El cuestionario del Tema 2 quedó incompleto.** miyagi dijo que «Moodle rechaza nuevas importaciones en ese banco», pero la causa real fue que el navegador de Moodle se estaba cerrando. Se completó en el paso siguiente.
- **No puede verlo como alumno.** miyagi no tiene una vista de estudiante: te pide que lo revises tú. Y Moodle no permite restringir la entrega a `.sql`, así que el enunciado pide el nombre de archivo.

:::tip Revisa como alumno
Ninguna revisión automática sustituye a la tuya. Abre el curso con **Cambiar rol a Estudiante** de vez en cuando y díselo con tus palabras si algo no te convence: lo corrige, y lo que le enseñas queda en su memoria del curso.
:::

Siguiente paso: [el Tema 4 y la práctica final](tema-4-consultas.md).
