---
title: 6. Tema 4 y práctica final
sidebar_position: 7
description: El tema de consultas con SELECT, un cuestionario, la práctica final de 10 consultas con la rúbrica del profesor, el foro de dudas, los pesos del calificador y mostrarlo todo.
---

# 6. Tema 4 y práctica final

El último tema es el que más pesa: consultas con `SELECT` y la práctica final, que vale el 50 % de la nota. Se lo pedimos todo de una vez, oculto hasta revisarlo:

<Prompt>{`/miyagi:build-unit Tema 4: Consultar con SELECT, siguiendo la programación (filtros, orden, agregados con GROUP BY y HAVING, INNER y LEFT JOIN), con el cuestionario y la Práctica final «Consultas sobre la tienda»: una tarea con un único archivo consultas.sql y la rúbrica que te dejé en sources, con un script de datos de la tienda para que todos consulten lo mismo. Pruébalo todo en Docker. Y crea en la sección General un «Foro de dudas» para todo el curso. Ajusta los pesos del libro de calificaciones: 20 % los cuatro cuestionarios, 15 % cada ejercicio (Tema 2 y Tema 3) y 50 % la práctica final; el entregable del Tema 1 no cuenta. Todo oculto hasta que lo revises y me pidas permiso para mostrarlo.`}</Prompt>

Prueba las consultas en un laboratorio contra los datos de la tienda antes de escribir el enunciado. Te hace dos preguntas sobre la rúbrica y sobre cómo plantear la autoría de una práctica que vale la mitad de la nota.

## Cuando se corta

Este encargo no salió de una sola vez. La conexión se cortó, y el navegador de Moodle volvió a cerrarse. Bastó con decirle dónde seguir:

<Prompt>{`Se ha cortado la conexión mientras el revisor terminaba. Sigue con la construcción del Tema 4 donde lo dejaste, con el mismo encargo: apuntes, cuestionario, Práctica final, Foro de dudas y pesos del libro de calificaciones, todo oculto.`}</Prompt>

Retomó el plan del tema desde su memoria, y publicó el Tema 4 oculto. También completó, con su permiso, los cuestionarios de los temas 1 y 2 que se habían quedado a medias. Los pesos, con su propia aprobación, quedaron: 5 % cada cuestionario, 15 % cada ejercicio, 50 % la práctica final y 0 % el entregable del Tema 1.

## La práctica final

La tarea tiene un único archivo, `consultas.sql`, con **10 consultas** sobre `tienda_practica`. La rúbrica la pusimos en Fuentes, y miyagi la convirtió en una rúbrica de Moodle: resultados correctos (5 puntos), uso adecuado de SQL (3) y legibilidad (2).

<Shot width="1400" height="1476" kind="moodle" src="/img/v2/moodle-profesor-rubrica.webp" alt="La rúbrica de la Práctica final en Moodle, vista por el profesor: los tres criterios con sus niveles y puntos.">La rúbrica en el formulario de calificación de la tarea.</Shot>

## Mostrarlo a los alumnos

Revisamos el curso nosotros y se lo decimos:

<Prompt>{`Lo he revisado y me vale. Muestra a los alumnos los temas 2, 3 y 4 con todas sus actividades, y también el Foro de dudas. Deja el filtro de tipos de archivo como está.`}</Prompt>

Pide permiso una sola vez, enumerando las 3 secciones y las 16 actividades. Dice que solo cambia la visibilidad y que no avisa a nadie. Las evaluables aparecen en el curso, pero se abren en su fecha.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-06-mostrar-a-alumnos.webp" alt="La respuesta tras mostrar los temas: lo que pueden ver desde hoy, una tabla con la fecha en la que abre cada evaluable en 2027, y la decisión pendiente: el Cuestionario del Tema 1 sigue oculto.">Temas mostrados, cada evaluable con su fecha de apertura, y una decisión para ti.</Shot>

Lo único que sigue oculto es el Cuestionario del Tema 1, porque no lo mencionamos, y miyagi lo recuerda. Queda en **Borradores**, con un botón para mostrarlo:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-06-horno.webp" alt="La vista Borradores: el Cuestionario del Tema 1 en la columna Probándose oculto, con el botón Mostrar a los alumnos.">En el horno, el cuestionario que falta.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-06-aprobacion-mostrar.webp" alt="Panel de aprobación para mostrar el Cuestionario del Tema 1: solo cambia la visibilidad, sin aviso; 10 preguntas al azar, 20 minutos, 2 intentos, pesa un 5 %.">Antes de mostrarlo: qué verán y qué no ha podido comprobar. Esta captura se hizo para el tutorial y luego la rechazamos.</Shot>

## El curso, terminado

Así queda el curso completo:

<Shot width="1400" height="1458" kind="moodle" src="/img/v2/moodle-profesor-curso.webp" alt="El curso completo en Moodle visto por el profesor, con General, el Foro de dudas y los cuatro temas.">Desde la cuenta del profesor.</Shot>

<Shot width="1400" height="2333" kind="moodle" src="/img/v2/moodle-alumno-curso.webp" alt="El curso visto por una alumna, con las secciones y las actividades con sus fechas.">Y desde la cuenta de una alumna.</Shot>

:::note Para el tutorial adelantamos el calendario
La práctica final se abre en marzo de 2027. Para poder seguir con la corrección, en el Moodle de pruebas movimos sus fechas: tres alumnos de prueba entregaron y dimos el plazo por vencido. En el [paso 9](seguimiento.md) la devolvemos a sus fechas reales.
:::

Siguiente paso: [corregir con la rúbrica](corregir.md).
