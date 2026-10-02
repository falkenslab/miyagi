---
title: 7. Corregir con la rúbrica
sidebar_position: 8
description: miyagi corrige la práctica final ejecutando cada entrega en Docker y aplicando la rúbrica del profesor, y enseña cada nota antes de guardarla.
---

# 7. Corregir con la rúbrica

Tres alumnos de prueba han entregado la práctica final, cada uno con un nivel distinto:

- **Lucía**: las ocho consultas, bien escritas.
- **Marcos**: solo cinco, en minúsculas y con una combinación de tablas por comas en el `FROM`.
- **Sara**: las ocho, pero con errores de concepto: un agregado en el `WHERE`, un `INNER JOIN` donde hacía falta `LEFT JOIN` y un recuento sin `GROUP BY`.
- **Alumno Demo** no ha entregado, y el plazo ha vencido.

En un chat nuevo, con el atajo de corregir:

<p className="pide">/miyagi:grade Corrige la Práctica final «Consultas sobre la tienda» con la rúbrica que te dejé en sources. Ejecuta las entregas en Docker contra los datos de la tienda para comprobar los resultados.</p>

## Ejecutar antes de juzgar

En vez de leer el SQL y suponer qué devuelve, miyagi pide al probador de prácticas que cargue los datos comunes de la tienda en un MariaDB limpio, ejecute cada `consultas.sql` y compare cada resultado con su solución de referencia. Así una consulta que parece correcta pero devuelve otras filas no se escapa, ni una que da error.

## Cada nota, antes de guardarla

Con los resultados, aplica la rúbrica y te enseña todas las notas en una sola aprobación: el desglose por criterio de cada alumno, el resumen de su retroalimentación y cómo ha interpretado tu rúbrica donde no era explícita.

<Shot src="/img/casos/36-aprobacion-notas.webp" alt="Panel de aprobación: calificar la práctica final con la rúbrica de Moodle; todas las entregas en plazo, ejecutadas en Docker y comparadas con la solución; la interpretación de la rúbrica (un solo fallo vale la mitad, dos o más valen 0); Lucía 9,375 con los fallos de las consultas 5 y 8; Marcos 3,875 con tres consultas sin entregar; Sara 4,875.">Las notas de la clase, con su desglose, antes de que existan en Moodle.</Shot>

Las notas coinciden con lo que vale cada entrega:

- **Lucía, 9,375.** Encontró dos detalles reales: la consulta 5 devuelve el nombre del producto en lugar del id que pedía el enunciado, y a la 8 le falta el desempate por nombre.
- **Marcos, 3,875.** Le faltan tres consultas; las que entregó tienen fallos de orden y de estilo, y la combinación por comas resta en «uso adecuado de SQL».
- **Sara, 4,875.** La consulta 5 da error (agregado en el `WHERE`), la 8 pierde los productos sin pedidos por usar `INNER JOIN` y la 4 no agrupa.
- **Alumno Demo, 0**, con el comentario «No se ha recibido entrega», porque el plazo ya ha vencido. Antes de esa fecha no habría puesto un 0.

Al terminar, avisa de lo que debes saber: no ha notificado a los alumnos (lo dejó desmarcado), qué dos interpretaciones de la rúbrica conviene que confirmes y que las fechas de la tarea en Moodle no coinciden con las de su programación. Esto último era cierto: para el tutorial habíamos adelantado el plazo.

<Shot src="/img/casos/37-correccion-resumen.webp" alt="El resumen de la corrección: no ha notificado a los alumnos, dos interpretaciones de la rúbrica para revisar (la mitad por un único fallo y que una consulta que falta no resta en uso de SQL), lo que más falla en la clase (HAVING, LEFT JOIN y el orden pedido) y el aviso de que las fechas de la tarea no coinciden con sus notas.">Lo que conviene que revises, y lo que más falla en la clase.</Shot>

## Lo que ve el alumno

Cada alumno ve su nota, la rúbrica con los niveles marcados y una retroalimentación que dice qué falla en cada consulta y cómo arreglarlo, con la consulta corregida:

<Shot kind="moodle" src="/img/casos/38-retro-sara.webp" alt="La calificación de Sara en Moodle: 4,88 sobre 10 y un comentario que repasa cada consulta que falla (orden al revés en la 1, falta GROUP BY en la 4, el error Invalid use of group function en la 5 con su explicación, falta el filtro de cancelados en la 7, INNER JOIN en lugar de LEFT JOIN en la 8), la consulta 5 corregida y el desglose de la rúbrica con los niveles marcados.">La retroalimentación de Sara: cada fallo, su porqué y la consulta 5 corregida.</Shot>

Y el profesor, la tabla de calificaciones de la tarea:

<Shot kind="moodle" src="/img/casos/39-calificaciones.webp" alt="La tabla de entregas y calificaciones de la práctica final en Moodle, vista por el profesor, con las notas de los cuatro alumnos.">Las calificaciones, ya guardadas.</Shot>

:::info Tus criterios mandan
La rúbrica era la de tu carpeta `sources/`, y donde no decía algo (qué pasa con dos fallos en una consulta) miyagi lo interpretó y te lo dijo. Si no estás de acuerdo, díselo: recalifica con tu criterio y lo apunta en su memoria para la próxima vez.
:::

Siguiente paso: [atender el foro](foro.md).
