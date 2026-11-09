---
title: 7. Corregir con la rúbrica
sidebar_position: 8
description: miyagi corrige la práctica final aplicando la rúbrica del profesor, con lo que implica la protección de datos para las entregas que son archivos, y enseña cada nota antes de guardarla.
---

# 7. Corregir con la rúbrica

Tres alumnos de prueba han entregado la práctica final, cada uno con un nivel distinto: Lucía las 10 consultas correctas; Marcos, solo algunas; Sara, las 10 con errores de concepto. Alumno Demo no ha entregado, y el plazo ha vencido.

En una conversación nueva, con el atajo de corregir:

<Prompt>{`/miyagi:grade Corrige la Práctica final «Consultas sobre la tienda» con la rúbrica que te dejé en sources. Ejecuta las entregas en Docker contra los datos de la tienda para comprobar los resultados. El plazo lo he adelantado para esta prueba y ya ha vencido.`}</Prompt>

## miyagi no puede leer los archivos entregados {#archivos}

Este es el paso que más conviene leer antes de usarlo con tu clase.

:::caution Importante: con la protección de datos por defecto, las entregas que son archivos no le llegan a miyagi
Para proteger a tus alumnos, la extensión moodle-teacher trabaja por defecto con `student_data: pseudonymize`: al modelo le llegan los alumnos con un alias («A-6KTXW8») y nunca con su nombre. Eso tiene una consecuencia práctica: **miyagi puede leer una entrega de texto, pero no un archivo adjunto**, porque el contenido de un archivo no se puede pseudonimizar. Las entregas de **texto** sí le llegan.

Si la tarea se entrega en archivo, miyagi te lo dice y te pide que le pases cada entrega tú, con su alias. Y aquí está el problema: en Moodle tú ves a los alumnos por su nombre, y miyagi solo te da el alias. **La única forma de saber qué alias es de qué alumno es comparando la hora de cada entrega**. Es incómodo, se presta a errores y lo estamos resolviendo ([issue #95](https://github.com/falkenslab/miyagi/issues/95)). Antes de corregir de verdad con archivos, tenlo en cuenta.
:::

En el tutorial, miyagi lo dice nada más empezar:

> No puedo descargar las 3 entregas desde Moodle (A-Z63WCA, A-6KTXW8 y A-5MTSQM). ¿Cómo seguimos?

Las opciones que propone son pasárselas tú, cambiar la configuración del servidor de Moodle o dejar solo el 0 de quien no entregó. Elegimos pasárselas. Te las pide de una en una, en este panel, y te recuerda que compruebes que el archivo no lleve el nombre del alumno en los comentarios.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-entrega-con-alias.webp" alt="El panel El agente pide un fichero: necesito el archivo consultas.sql que entregó A-Z63WCA en la Práctica final; un cuadro para arrastrar el archivo y el botón Responder.">El panel que te pide el archivo de cada alias.</Shot>

Lo contrario también pasa: si le hablas de un alumno por su nombre, no sabe cuál es su alias. Te lo pregunta enseñándote qué notas tiene cada alias, y son tus ojos en Moodle los que hacen de puente.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-alias-que-alumno.webp" alt="miyagi pregunta qué alias es el de Sara Gil, con cuatro alias y su nota actual como opciones.">miyagi pregunta qué alias es el de la alumna que le nombramos. Se ve en Moodle comparando las horas de entrega.</Shot>

Con los archivos en su sitio, los guarda en Fuentes bajo el alias y los ejecuta en un laboratorio contra los datos de la tienda, comparando cada consulta con la solución.

## Cada nota, antes de guardarla

Con los resultados, aplica la rúbrica y te enseña las cuatro notas en una sola aprobación, con el desglose por criterio de cada alumno y su comentario.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-aprobacion-nota.webp" alt="Panel de aprobación para guardar la corrección de A-Z63WCA: resultados correctos 1 de 5, uso de SQL 1 de 3, legibilidad 2 de 2, y el comentario al alumno con cada consulta que falla.">El detalle de una nota antes de guardarla. Esta captura es de una petición de ejemplo que luego rechazamos.</Shot>

La nota queda clara para cada alias, y es lo que luego verás en Moodle con su nombre:

- **Lucía, 10.** Las 10 consultas correctas.
- **Marcos, 4.** Le faltan consultas (las cuenta como no entregadas) y las que tiene fallan en orden y en estilo.
- **Sara, 4.** Muy bien presentado, pero con errores de concepto: un agregado en el `WHERE` (error 1111), un `INNER JOIN` donde hacía falta `LEFT JOIN` y un recuento sin `GROUP BY`.
- **Alumno Demo, 0**, con el comentario «No se ha recibido ninguna entrega», porque el plazo ha vencido.

Al terminar, miyagi resume lo que ha hecho. Avisa de que no ha enviado notificaciones y de que el descuento por retraso lo aplicas tú. Y es honesto con lo que no ha podido confirmar: que Moodle no le devuelve las observaciones por criterio al guardar.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-07-correccion-resumen.webp" alt="El resumen de la corrección: una tabla con alias, consultas correctas, puntos por criterio y nota: A-5MTSQM 10, A-Z63WCA 4, A-6KTXW8 4, A-8BY92W 0.">La tabla de notas, por alias.</Shot>

## Lo que ve cada uno

El profesor ve en Moodle las notas con sus nombres:

<Shot width="1400" height="1386" kind="moodle" src="/img/v2/moodle-profesor-entregas.webp" alt="La tabla de entregas de la Práctica final en Moodle: Lucía 10, Marcos 4, Sara 4 y Alumno Demo 0, con sus archivos y sus comentarios.">Las entregas y sus notas. Las horas de entrega son lo único que permite casar cada alias con cada alumno.</Shot>

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-profesor-corrector.webp" alt="El corrector de Moodle con la entrega de Sara Gil, su rúbrica y el panel de revisión plegado.">El corrector, con la rúbrica aplicada.</Shot>

<Shot width="1400" height="595" kind="moodle" src="/img/v2/moodle-profesor-calificaciones.webp" alt="El informe de calificaciones de Moodle para el profesor, con las notas de la práctica final.">El informe de calificaciones.</Shot>

Y el alumno ve su nota, la rúbrica con los niveles marcados y una retroalimentación que dice qué falla:

<Shot width="1400" height="2528" kind="moodle" src="/img/v2/moodle-alumna-practica-final.webp" alt="La práctica final vista por Sara: su entrega, la rúbrica, la nota 4 sobre 10, el comentario y el desglose de la rúbrica con los niveles marcados.">La calificación de Sara. La fecha de la tarea es la real, porque la devolvimos a su sitio en el paso 9: por eso la entrega aparece «127 días antes».</Shot>

<Shot width="1400" height="1361" kind="moodle" src="/img/v2/moodle-alumna-notas.webp" alt="El libro de calificaciones de Sara en Moodle, con sus notas.">Sus notas, en su libro de calificaciones.</Shot>

:::info Tus criterios mandan
La rúbrica era la de tu carpeta de Fuentes, y donde no decía algo miyagi lo interpretó y te lo enseñó. Si no estás de acuerdo, díselo: recalifica con tu criterio y lo apunta en su memoria para la próxima vez.
:::

Siguiente paso: [atender el foro](foro.md).
