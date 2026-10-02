---
title: 8. Atender el foro
sidebar_position: 9
description: miyagi responde dudas reales sobre SQL en el foro y corrige con respeto la respuesta equivocada de un compañero.
---

# 8. Atender el foro

En el Foro de dudas que creó con el Tema 4 hay dos hilos de alumnos:

- **Lucía**: al insertar un pedido le sale `ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails`, y no entiende por qué si el `INSERT` está bien escrito.
- **Marcos**: no ve la diferencia entre `WHERE` y `HAVING`. Y Sara le ha contestado algo **equivocado**: que son lo mismo y que `HAVING` se usa cuando hay `ORDER BY`.

Basta con pedírselo:

<p className="pide">Ahora mira el Foro de dudas.</p>

## Una sola aprobación, con los textos enteros

Lee los dos hilos y decide cómo intervenir. En el de Lucía no hay respuesta: le da una pista para que lo resuelva ella. En el de Marcos hay que corregir a una compañera, con respeto y sin dejar la idea equivocada en pie. Te enseña los dos mensajes completos antes de publicar nada:

<Shot src="/img/casos/40-aprobacion-foro.webp" alt="Panel de aprobación: publicar dos respuestas en el Foro de dudas, con el texto completo de la respuesta a Lucía sobre el ERROR 1452 (la clave ajena exige que el cliente exista, cómo comprobarlo y el orden correcto) y el comienzo de la respuesta al hilo de Marcos, donde Sara había contestado algo incorrecto.">Las dos respuestas, palabra por palabra, antes de publicarlas.</Shot>

## Lo que ve la clase

A Lucía le explica qué significa el error (no está mal escrito: el cliente 7 no existe en su tabla), cómo comprobarlo, qué dos caminos tiene y dónde está en los apuntes. Sin resolverle el ejercicio.

<Shot kind="moodle" src="/img/casos/42-foro-1452.webp" alt="El hilo ERROR 1452 en el foro: la pregunta de Lucía con el INSERT y el error, y la respuesta del profesor explicando la clave ajena, cómo comprobarlo con SELECT, insertar primero el cliente y que los ids con AUTO_INCREMENT no tienen por qué ser consecutivos.">La respuesta a Lucía: una pista, no la solución.</Shot>

En el hilo de Marcos, agradece a Sara que se animara a responder y corrige la idea: `WHERE` filtra filas antes de agrupar, `HAVING` filtra grupos y admite agregados, y `ORDER BY` no tiene nada que ver. Con un ejemplo sobre la tienda, una regla rápida y una propuesta para practicar:

<Shot kind="moodle" src="/img/casos/41-foro-having.webp" alt="El hilo Diferencia entre WHERE y HAVING: la pregunta de Marcos, la respuesta equivocada de Sara y la respuesta del profesor, que agradece a Sara, explica qué filtra cada cláusula y cuándo, el error Invalid use of group function, una consulta de ejemplo con WHERE, GROUP BY, HAVING y ORDER BY sobre la tienda y una regla rápida.">La corrección a Sara, respetuosa y con ejemplo.</Shot>

## Relaciona lo que ve

Al terminar, une el foro con lo que vio al corregir: la confusión entre `WHERE` y `HAVING` es la misma que hizo fallar a Sara en la práctica final. Te propone dedicarle unos minutos en clase, y apunta las dos dudas en las páginas de los temas 3 y 4 de su memoria, para la próxima vez que construya o revise esos temas.

<Shot src="/img/casos/43-foro-resumen.webp" alt="El resumen del foro: una respuesta en cada hilo, la pista a Lucía sin resolverle el ejercicio, la corrección a Sara agradeciéndole la ayuda, y la observación de que la confusión entre WHERE y HAVING es la misma que apareció al corregir la práctica final.">El foro y la corrección, relacionados.</Shot>

Siguiente paso: [seguimiento y auditoría](seguimiento.md).
