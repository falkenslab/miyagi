---
title: 9. Seguimiento y auditoría
sidebar_position: 10
description: Cómo va la clase, separando datos de interpretación, y una auditoría del curso entero con recomendaciones por prioridad.
---

# 9. Seguimiento y auditoría

## Cómo va la clase

Con las primeras notas puestas, le preguntamos por la clase con el atajo de seguimiento:

<Prompt>{`/miyagi:progress`}</Prompt>

Mira el calificador y el resumen de actividades, y separa lo que son datos de lo que es su interpretación. También detecta que las fechas de la práctica final no coinciden, un efecto de haberlas adelantado para el tutorial:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-09-progreso.webp" alt="La revisión del progreso: la media de quienes entregaron, una tabla de fechas límite que no coinciden entre sí, los patrones detectados y su lectura, sin aviso general.">Datos por un lado, interpretación por otro, y ningún aviso innecesario.</Shot>

Dos detalles importan aquí:

- **No publica avisos por su cuenta.** Por ser un único caso, no ve motivo para escribir a la clase.
- **No guarda fichas de alumnos.** La revisión queda en su memoria sin alias ni nombres, para comparar con la siguiente.

Señala que los dos alumnos con un 4 son los del hilo sobre `WHERE` y `HAVING`, y dice que «con 4 alumnos la muestra es muy pequeña».

## Auditar el curso entero

<Prompt>{`/miyagi:audit`}</Prompt>

Recorre el curso sin cambiar nada (organización, fechas, evaluación, accesibilidad, pedagogía) y devuelve las recomendaciones por prioridad. Y dice lo que no ha podido comprobar: cómo lo ve de verdad un estudiante, que solo ha revisado 3 de los 14 bancos de preguntas y que no ha vuelto a ejecutar las prácticas.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-09-auditoria.webp" alt="La auditoría: recomendaciones de prioridad baja, lo que está bien y lo que no se ha podido comprobar.">El final de la auditoría, con lo que está bien y lo que no ha podido comprobar.</Shot>

## Aplicar una recomendación

Elegimos la más visible para los alumnos:

<Prompt>{`Haz una página «Guía del curso» en General con los pesos, el calendario, la política de entregas tardías para todas las tareas y qué hacer si Docker no funciona, y muéstrala. Devuelve la práctica final a sus fechas de la programación, sin tocar las notas. Lo demás lo vemos otro día.`}</Prompt>

La crea oculta, te pide permiso, la muestra con otro permiso y cambia las fechas con otro. Y te avisa de lo que debes decidir: la guía anuncia el cuestionario del Tema 1, que sigue oculto; promete un equipo del centro a quien no pueda usar Docker en casa, sin procedimiento todavía; y da los pesos en porcentaje, aunque Moodle sigue calculando el total sobre 70.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-09-guia-resumen.webp" alt="El resumen de la guía del curso: las secciones, las fechas de la práctica final antes y ahora, y una lista de lo que hay que tener en cuenta.">La guía, publicada, y lo que conviene arreglar.</Shot>

Así la ven los alumnos:

<Shot width="1400" height="1847" kind="moodle" src="/img/v2/moodle-alumno-guia.webp" alt="La página Guía del curso en Moodle vista por un alumno: pesos, calendario, entregas tardías y qué hacer si Docker falla.">La Guía del curso.</Shot>

La auditoría y el progreso quedan en su memoria con su fecha, así que la próxima vez te dirá qué ha cambiado.

Siguiente paso: [tu propia habilidad](habilidad-propia.md).
