---
title: 1. Preparar el aula
sidebar_position: 2
description: Crear la asignatura en la aplicación de escritorio, vincular un curso vacío de Moodle y añadir docker-lab para probar las prácticas.
---

# 1. Preparar el aula

Partimos de un curso de Moodle vacío, «Introducción a SQL», en el que tenemos rol de profesor. Todo lo demás se hace desde la [aplicación de escritorio](/guia/escritorio/).

## Crear la asignatura

Pulsamos **Nueva asignatura** y rellenamos el formulario: nombre, una descripción, el idioma y el tono (Cercano, que es como hablará a los alumnos en el foro y en la retroalimentación).

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-nueva-asignatura.webp" alt="El formulario Nueva asignatura relleno: Introducción a SQL, Unidad de Introducción a SQL con MariaDB en Docker, 1.º de DAM, idioma español, tono Cercano.">La asignatura «Introducción a SQL».</Shot>

## Vincular el curso

En **Tu aula** pulsamos **Vincular un aula** y pegamos la dirección del curso, la que vemos en el navegador.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-vincular-direccion.webp" alt="Vincular un aula, paso 1: el campo con la dirección del curso del Moodle de pruebas rellena.">Paso 1: la dirección del curso.</Shot>

miyagi nos dice qué va a hacer: instalar la extensión del aula (moodle-teacher) y darle este campus y este curso, de modo que solo pueda entrar en los cursos vinculados.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-vincular-confirmar.webp" alt="Vincular un aula, paso 2: la confirmación del campus y el curso, y la nota de que la primera vez se abrirá una ventana del campus para iniciar sesión.">Paso 2: lo que va a hacer, antes de hacerlo.</Shot>

La primera vez que miyagi necesita entrar en Moodle se abre una ventana de ese Moodle para que inicies sesión tú, con tu usuario y tu contraseña. Ni miyagi ni el modelo la ven. moodle-teacher guarda esa sesión, así que no vuelve a pedirla hasta que caduque.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-aula-vinculada.webp" alt="La vista Tu aula con el aula vinculada, la dirección del Moodle y el número de curso.">El aula, vinculada.</Shot>

## Las prácticas, en laboratorios de Docker

El curso va de MariaDB en Docker y queremos que miyagi compruebe las prácticas antes de publicarlas. Para eso, en **Extensiones > Catálogo** añadimos **docker-lab**: miyagi comprueba cada práctica en un laboratorio de Docker, aislado y sin tocar nada más del ordenador. Necesita Docker Desktop instalado.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-01-extension-docker-lab.webp" alt="El diálogo Añadir docker-lab del catálogo: qué hace, sin servidores remotos, necesita Docker y sus capacidades, con los botones Cancelar y Añadir.">Antes de instalarla, lo que declara la extensión.</Shot>

Lo tienes explicado en [Prácticas en Docker](/avanzado/practicas-docker/).

Siguiente paso: [darle tu material](tu-material.md).
