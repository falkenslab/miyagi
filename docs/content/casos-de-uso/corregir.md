---
title: 7. Corregir con la rúbrica
sidebar_position: 8
description: miyagi corrige la práctica final aplicando la rúbrica del profesor, con lo que implica la protección de datos para las entregas que son archivos, y enseña cada nota antes de guardarla.
---

# 7. Corregir con la rúbrica

Tres alumnos de prueba han entregado la práctica final, cada uno con un nivel distinto: Lucía las 10 consultas correctas; Marcos, solo algunas; Sara, las 10 con errores de concepto. Alumno Demo no ha entregado.

En una conversación nueva, con el atajo de corregir:

<Prompt>{`/miyagi:grade Corrige la Práctica final «Consultas sobre la tienda» con la rúbrica que te dejé en sources. Ejecuta las entregas en Docker contra los datos de la tienda para comprobar los resultados. El plazo lo he adelantado para esta prueba y ya ha vencido.`}</Prompt>

## Las entregas en archivo {#archivos}

Este es el paso que más conviene leer antes de usarlo con tu clase.

Para proteger a tus alumnos, la extensión moodle-teacher trabaja por defecto con `student_data: pseudonymize`: al modelo le llegan los alumnos con un alias («A-6KTXW8») y nunca con su nombre. Las entregas de **texto** le llegan así. Las que son **archivos** no las lee desde Moodle: para leerlas, miyagi te pide guardarlas en tu ordenador, una carpeta por alumno bajo su alias y con nombres de archivo neutros.

Te lo pregunta en un panel de la extensión del aula, con la carpeta donde las guardará: `submissions`, dentro de la asignatura. Puedes decir que no, y entonces no las lee.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-guardar-entregas.webp" alt="El panel de moodle: guardar los archivos entregados en la tarea 1939 en la carpeta submissions de la asignatura, una carpeta por alumno, avisando de que un nombre escrito dentro de un PDF, un documento o una imagen no se oculta; con la casilla Sí, hazlo y los botones Cancelar, No y Enviar.">miyagi pide permiso para guardar las entregas en tu ordenador.</Shot>

:::caution Lo que no se oculta
En los archivos de texto, como un `.sql`, los nombres se cambian por el alias. Pero **un nombre escrito dentro de un PDF, un documento o una imagen no se oculta**, y el modelo lo verá. Si tus alumnos firman sus trabajos dentro del archivo, tenlo en cuenta antes de decir que sí.
:::

Con tu permiso, las lee en `submissions`, copia al laboratorio las que tiene que ejecutar y las ejecuta contra los datos de la tienda, comparando cada consulta con la solución. Al acabar la corrección **borra todas las copias**, las de la asignatura y las del laboratorio, y te lo dice en su resumen. Si la corrección se corta a medias, lo que quede se borra la próxima vez que abras la asignatura.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-entregas-borradas.webp" alt="El final del resumen de una corrección: qué falló en cada entrega, una decisión pendiente sobre el alumno que no entregó y la línea He parado el laboratorio y he borrado las copias de las entregas.">Al final del resumen, el laboratorio parado y las copias borradas.</Shot>

Lo que tú ves no es lo que ve el modelo. **En la app y en la versión web ves a cada alumno por su nombre**: miyagi lo pone en la pantalla donde el modelo tiene su alias, sin que el nombre salga de tu ordenador. Y si le hablas de un alumno por su nombre completo (por ejemplo «¿qué le falta a Sara Gil?»), al modelo le llega su alias. Para proyectar en clase, el botón del ojo de arriba a la derecha vuelve a los alias. En la terminal se ven siempre los alias.

## Cada nota, antes de guardarla

Con los resultados, aplica la rúbrica y te enseña las notas en una sola aprobación, con el desglose por criterio de cada alumno y su comentario.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-aprobacion-nota.webp" alt="Panel de aprobación de la corrección: Sara Gil (A-WS3G1P) 4/10 y Marcos López (A-N1XSAP) 4/10, con los niveles de la rúbrica, las observaciones y el comentario de cada uno.">El detalle de cada nota antes de guardarla, con el nombre de cada alumno junto a su alias.</Shot>

La nota de cada alumno, la misma que verás luego en Moodle:

- **Lucía, 10.** Las 10 consultas correctas.
- **Marcos, 4.** Le faltan consultas (las cuenta como no entregadas) y las que tiene fallan en orden y en estilo.
- **Sara, 4.** Muy bien presentado, pero con errores de concepto: un agregado en el `WHERE` (error 1111), un `INNER JOIN` donde hacía falta `LEFT JOIN` y un recuento sin `GROUP BY`.
- **Alumno Demo, sin nota.** No ha entregado, pero el plazo sigue abierto, así que no le pone un 0 todavía.

Al terminar, miyagi resume lo que ha hecho. Dice que ha leído de vuelta cada nota en Moodle, que los alumnos ya la ven porque la tarea no usa el flujo de calificación, y que ha parado el laboratorio y borrado las entregas. También avisa de lo que le parece raro, como unas fechas de entrega anteriores a la apertura de la tarea, en vez de decidirlo por ti.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-correccion-resumen.webp" alt="El resumen de la corrección guardada: Lucía Martín 10, Sara Gil 4 y Marcos López 4; Alumno Demo sin calificar porque el plazo sigue abierto, el laboratorio parado y las entregas borradas.">La tabla de notas, con el nombre de cada alumno.</Shot>

## Lo que ve cada uno

El profesor ve en Moodle las notas con sus nombres:

<Shot width="1400" height="1386" kind="moodle" src="/img/v2/moodle-profesor-entregas.webp" alt="La tabla de entregas de la Práctica final en Moodle: Lucía 10, Marcos 4, Sara 4 y Alumno Demo 0, con sus archivos y sus comentarios.">Las entregas y sus notas. El 0 de Alumno Demo es de una corrección anterior, con el plazo ya vencido.</Shot>

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-profesor-corrector.webp" alt="El corrector de Moodle con la entrega de Sara Gil, su rúbrica y el panel de revisión plegado.">El corrector, con la rúbrica aplicada.</Shot>

<Shot width="1400" height="595" kind="moodle" src="/img/v2/moodle-profesor-calificaciones.webp" alt="El informe de calificaciones de Moodle para el profesor, con las notas de la práctica final.">El informe de calificaciones.</Shot>

Y el alumno ve su nota, la rúbrica con los niveles marcados y una retroalimentación que dice qué falla:

<Shot width="1400" height="2528" kind="moodle" src="/img/v2/moodle-alumna-practica-final.webp" alt="La práctica final vista por Sara: su entrega, la rúbrica, la nota 4 sobre 10, el comentario y el desglose de la rúbrica con los niveles marcados.">La calificación de Sara. La fecha de la tarea es la real, porque la devolvimos a su sitio en el paso 9: por eso la entrega aparece «127 días antes».</Shot>

<Shot width="1400" height="1361" kind="moodle" src="/img/v2/moodle-alumna-notas.webp" alt="El libro de calificaciones de Sara en Moodle, con sus notas.">Sus notas, en su libro de calificaciones.</Shot>

:::info Tus criterios mandan
La rúbrica era la de tu carpeta de Fuentes, y donde no decía algo miyagi lo interpretó y te lo enseñó. Si no estás de acuerdo, díselo: recalifica con tu criterio y lo apunta en su memoria para la próxima vez.
:::

Siguiente paso: [atender el foro](foro.md).
