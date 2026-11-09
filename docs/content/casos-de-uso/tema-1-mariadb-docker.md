---
title: "4. Tema 1: MariaDB en Docker"
sidebar_position: 5
description: miyagi construye el primer tema (apuntes, práctica guiada, entregable y cuestionario), prueba la práctica en un laboratorio y lo publica oculto, con un permiso por cada pieza.
---

# 4. Tema 1: MariaDB en Docker

Con la programación cerrada, toca construir el curso en Moodle. Empezamos por el primer tema en una conversación nueva, con el atajo `/miyagi:build-unit`:

<Prompt>{`/miyagi:build-unit Tema 1: MariaDB en Docker, siguiendo la programación. Con unos apuntes que expliquen paso a paso cómo levantar el contenedor, conectarse con el cliente, crear la base de datos tienda y un usuario con permisos solo sobre ella; la práctica guiada, con los comandos en bloques de código, probada en Docker antes de publicarla; el entregable apto/no apto y el cuestionario del tema. Las fechas que propongas me valen. El contenedor se llama siempre mariadb-tienda.`}</Prompt>

## Primero, comprobar que funciona

Antes de publicar nada, miyagi prueba la práctica en un **laboratorio de docker-lab**: levanta un MariaDB de verdad, sigue cada paso que luego leerán los alumnos, provoca los errores que los apuntes van a explicar y comprueba que falla cuando aún no se ha hecho nada. Te avisa antes de arrancar el laboratorio, y te pregunta antes de pararlo porque sus datos se pierden.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-04-laboratorio.webp" alt="La conversación: el laboratorio arranca, comprueba que la verificación falla antes de hacer nada, sigue la práctica, y al publicar aparece que el navegador de Moodle se ha cerrado a medias y miyagi comprueba si el cambio se guardó.">La práctica, probada paso a paso en el laboratorio.</Shot>

En esta captura el profesor le dice que el laboratorio «ya está en la carpeta labs», porque en esa ejecución se copió a mano. Desde entonces miyagi puede escribir en esa carpeta sin reiniciar. Fíjate también en lo que pasa después: el navegador con el que moodle-teacher trabaja en Moodle se cae, y miyagi comprueba si el cambio se guardó antes de repetirlo, para no aplicarlo dos veces.

## Cada pieza, con su permiso

miyagi construye el tema pieza a pieza. Primero la deja en `materials/` y en `drafts/`, después la sube a Moodle **oculta** y al final te pide permiso para mostrarla. Cada panel dice exactamente qué va a publicar. En el Tema 1: la sección, una página de cómo instalar y comprobar Docker, los apuntes en un libro de 7 capítulos, la práctica guiada, una escala «apto/no apto» (ese Moodle solo traía escalas en inglés), el entregable, el cuestionario, sus 20 preguntas y, al final, mostrarlo.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-04-aprobacion-libro.webp" alt="Panel de aprobación para añadir un capítulo oculto al libro de apuntes del Tema 1, con el texto completo del capítulo y los botones Parar todo, Rechazar y Aprobar.">Un panel de aprobación para añadir un capítulo. Esta captura es de una petición de ejemplo que luego rechazamos: el libro ya estaba subido.</Shot>

:::caution Y si intenta publicar sin preguntar
La aprobación no depende solo de que el agente se acuerde. El programa vigila cada cambio que va a hacer en Moodle y, si no ha pedido permiso justo antes, lo detiene y te pregunta. Borrar o quitar algo te lo pregunta siempre, aunque lo hayas aprobado antes.
:::

## Lo que falló

Publicar el tema costó más de lo previsto, porque el navegador de Moodle se cerró varias veces durante el trabajo. miyagi siguió adelante, comprobando en Moodle qué se había guardado antes de repetir cada paso, y al final de la conversación te dice qué ha hecho y qué queda.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-04-tema1-resumen.webp" alt="La conversación del Tema 1: miyagi publica cada pieza oculta, avisa de que el navegador de Moodle se ha cerrado a medias y da errores intermitentes, comprueba si cada cambio se guardó para no duplicarlo y lanza las operaciones de una en una.">Mientras publica: el navegador falla a ratos y miyagi comprueba antes de repetir.</Shot>

El cuestionario se quedó a medias en este primer intento: faltaban preguntas por importar. Se completó más tarde, en el [paso 6](tema-4-consultas.md). Te contamos qué hacer cuando pasa esto en [Consejos y problemas](/guia/problemas/).

## El resultado

Así ve el tema un alumno:

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-alumno-tema1.webp" alt="Moodle en inglés visto por un alumno: el Tema 1 con su resumen y sus actividades con fechas.">El Tema 1 desde la cuenta de un alumno.</Shot>

<Shot width="1400" height="888" kind="moodle" src="/img/v2/moodle-alumno-libro.webp" alt="El primer capítulo del libro de apuntes del Tema 1 en Moodle, visto por un alumno.">Los apuntes, en un libro de Moodle.</Shot>

<Shot width="1400" height="1361" kind="moodle" src="/img/v2/moodle-alumno-practica-guiada.webp" alt="La práctica guiada del Tema 1 vista por un alumno, con cada comando en un bloque de código.">La práctica guiada, con cada comando en su bloque de código.</Shot>

Y así lo ve el profesor:

<Shot width="1400" height="875" kind="moodle" src="/img/v2/moodle-profesor-tema.webp" alt="El Tema 1 visto por el profesor en Moodle, con sus actividades.">El Tema 1 desde la cuenta del profesor.</Shot>

<Shot width="1400" height="1458" kind="moodle" src="/img/v2/moodle-profesor-banco.webp" alt="El banco de preguntas del curso en Moodle, con las preguntas T1-01 y siguientes.">El banco de preguntas, con las del Tema 1.</Shot>

<Shot width="1400" height="1527" kind="moodle" src="/img/v2/moodle-profesor-preguntas-t1.webp" alt="Las preguntas del cuestionario del Tema 1 en Moodle: huecos aleatorios por criterio de evaluación.">El cuestionario del Tema 1: 10 huecos aleatorios por criterio, sobre 20 preguntas.</Shot>

:::note
El cuestionario del Tema 1 se quedó oculto hasta el final: lo veremos en la vista **En el horno**, en el [paso 6](tema-4-consultas.md).
:::

Siguiente paso: [temas 2 y 3](temas-ddl-dml.md).
