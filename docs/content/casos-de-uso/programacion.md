---
title: 3. La programación didáctica
sidebar_position: 4
description: Completar la programación didáctica en la conversación y decidir lo que solo decide el profesor.
---

# 3. La programación didáctica

La ingesta convirtió el temario en la programación del curso, pero le faltaban cosas: criterios de evaluación, un calendario y atención a la diversidad. Usamos el atajo de la programación y le decimos lo que queremos, contestando de paso a sus dudas:

<Prompt>{`/miyagi:teaching-plan Revisa la programación que sacaste de mi temario y complétala con lo que falte: criterios de evaluación, calendario de las 6 semanas (empezamos el lunes 5 de octubre) y atención a la diversidad. La penalización por retraso la aplico yo a mano al calificar. Las sesiones son los martes y jueves, de 1,5 horas cada una. En «Resultados correctos» un 2 o un 4 son estados intermedios, a tu criterio. Las entregas tardías se admiten hasta una semana después. Los cuestionarios pesan igual entre sí, y los ejercicios también. Para O1, añade al Tema 1 un entregable ligero, apto o no apto, sin entrar en el 100 %: una captura de su contenedor funcionando con la base de datos tienda creada.`}</Prompt>

## Lo que solo decides tú

Escribe lo que falta y deja anotado lo que no le corresponde decidir. Como la fecha del 5 de octubre ya había pasado, le pedimos un calendario para otra edición:

<Prompt>{`Es para otra edición: empezamos el lunes 1 de febrero de 2027, recalcula el calendario con esa fecha y da por buenos los festivos nacionales. Un ejercicio por tema, 15 % cada uno, en los temas 2 y 3. El retraso no vale para cuestionarios. Los criterios me valen como están. Un no apto se corrige y se vuelve a comprobar, sin efecto en la nota. Sin nota mínima por ahora. Lo demás, como propones.`}</Prompt>

Lo recalcula y te dice lo que queda en el aire: que el martes 9 de febrero es Martes de Carnaval y coincide con una sesión y con el límite del entregable, que el fin de la admisión tardía de la práctica final cae en Semana Santa y que la recuperación y el cierre de actas siguen sin fijar.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-03-programacion-respuesta.webp" alt="La respuesta de miyagi: una tabla con fechas límite y hasta cuándo se admite la entrega tardía de cada evaluable, y las dudas que quedan: Martes de Carnaval, Semana Santa, recuperación y cierre de actas, cuestionarios sin intento.">El calendario de evaluables y las dudas, sin prisa, para que las decidas tú.</Shot>

:::info La programación no se publica
La programación vive en la memoria del curso, en tu ordenador. No se sube a Moodle salvo que se lo pidas. Lo que sí hace es usarla para construir cada tema y, más adelante, para comprobar que el aula sigue cuadrando con ella (`/miyagi:align`).
:::

## Verla

En la vista **Asignatura**, pestaña **Programación**, está tal como quedó, con **Revisar con miyagi** y **Comprobar el aula**:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-03-programacion.webp" alt="La vista Programación con el texto de la programación didáctica de Introducción a SQL.">La programación didáctica.</Shot>

Y en **Temas y actividades**, las cuatro unidades que acaba de planificar:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-03-temas.webp" alt="La vista Temas y actividades con cuatro tarjetas de unidad.">Los cuatro temas, antes de construirlos en Moodle.</Shot>

Siguiente paso: [el Tema 1](tema-1-mariadb-docker.md).
