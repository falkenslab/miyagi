---
title: 8. Atender el foro
sidebar_position: 9
description: miyagi responde dudas reales sobre SQL en el foro y corrige con respeto la respuesta equivocada de una compañera.
---

# 8. Atender el foro

En el Foro de dudas que creó con el Tema 4 hay dos hilos:

- **Lucía**: al insertar un pedido le sale `ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails`.
- **Marcos**: no ve la diferencia entre `WHERE` y `HAVING`. Y Sara le ha contestado algo **equivocado**: que son lo mismo y que `HAVING` se usa cuando hay `ORDER BY`.

Basta con pedírselo:

<Prompt>{`Ahora mira el Foro de dudas.`}</Prompt>

Lee los dos hilos, prepara dos respuestas y te las enseña completas, palabra por palabra, en una sola aprobación. En la de Marcos, corrige la idea errónea sin señalar a nadie.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-08-aprobacion-foro.webp" alt="Panel de aprobación para publicar un mensaje en el hilo de WHERE y HAVING, con la advertencia de que el elogio general podría leerse también sobre una aportación errónea ya corregida.">Una aprobación del foro. Es de otra petición, de ejemplo y luego rechazada, y muestra hasta dónde llega: avisa de que un elogio general se podría leer sobre la respuesta equivocada de una alumna.</Shot>

## Lo que ve la clase

A Lucía le explica que el `INSERT` no está mal: el cliente no existe. Cómo comprobarlo con un `SELECT`, qué dos caminos tiene y dónde está en los apuntes.

<Shot width="1400" height="1138" kind="moodle" src="/img/v2/moodle-alumno-foro-1452.webp" alt="El hilo del ERROR 1452 en el foro: la pregunta de Lucía y la respuesta del profesor con la explicación de la clave ajena, cómo comprobarlo y los dos caminos.">La respuesta a Lucía.</Shot>

En el hilo de Marcos deja claro qué filtra cada cláusula y en qué momento, y que `ORDER BY` no tiene nada que ver.

<Shot width="1400" height="1270" kind="moodle" src="/img/v2/moodle-alumno-foro-having.webp" alt="El hilo de la diferencia entre WHERE y HAVING: la pregunta de Marcos, la respuesta equivocada de Sara y la respuesta del profesor con la corrección.">La corrección, respetuosa.</Shot>

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-profesor-foro.webp" alt="La lista de hilos del Foro de dudas vista por el profesor.">Los hilos del foro, desde la cuenta del profesor.</Shot>

## Relaciona lo que ve

Al terminar, comprueba que cada respuesta aparece una sola vez en su hilo. Une el foro con lo que vio al corregir: la confusión entre `WHERE` y `HAVING` es la misma que hizo fallar una entrega de la práctica final, y propone un repaso breve en clase. Y avisa de que al publicar Moodle te ha suscrito a esos hilos.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-08-foro-resumen.webp" alt="El resumen del foro: una tabla con los dos hilos, qué pasaba y qué ha hecho, una propuesta para tu próxima clase y el aviso sobre la suscripción a los hilos.">El resumen del foro, relacionado con la corrección.</Shot>

Apunta las dos dudas en las páginas de los temas 3 y 4 de su memoria, sin datos de ningún alumno.

Siguiente paso: [seguimiento y auditoría](seguimiento.md).
