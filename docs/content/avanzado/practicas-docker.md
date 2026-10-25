---
title: Prácticas en Docker
sidebar_position: 7
description: "Cómo miyagi comprueba enunciados, soluciones y entregas ejecutándolos en laboratorios de la extensión docker-lab, con qué límites y cómo instalarla."
---

# Prácticas en Docker

En un curso de informática (Docker, Linux, programación, bases de datos), una práctica que no funciona tal como está escrita le cuesta la tarde a toda la clase. Y una entrega corregida «leyendo el código» puede llevarse la nota de algo que no se ejecuta. Con la extensión **docker-lab**, miyagi puede ejecutar las prácticas de verdad, dentro de laboratorios de Docker:

- **Antes de publicar una práctica**, la sigue paso a paso como lo haría un alumno y comprueba que la solución da lo que promete el enunciado. Si algo falla, la corrige antes de publicarla.
- **Al corregir**, ejecuta la entrega del alumno y usa lo que sale como prueba en la nota y en la retroalimentación.

## Qué es docker-lab

docker-lab es una [extensión](extensiones.md) del repositorio oficial ([falkenslab/agent-extensions](https://github.com/falkenslab/agent-extensions)) que pone en marcha docker-mcp, un servidor que ejecuta **laboratorios**: entornos de Docker aislados, cada uno con sus propias reglas. miyagi no tiene terminal, ni siquiera con docker-lab: todo lo que ejecuta pasa por las herramientas de los laboratorios ([ADR-024](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-024-no-shell-practices-in-docker-lab.md)).

## Cómo instalarla

1. Instala [Docker Desktop](https://www.docker.com/products/docker-desktop/) (en Linux, Docker Engine), versión 24 o posterior. Si falta, docker-lab te dice qué instalar.
2. Instala la extensión en modo `lab`, el recomendado (solo laboratorios):

   ```bash
   miyagi extension add docker-lab --set mode=lab
   ```

Como cualquier extensión, puedes instalarla para todas tus asignaturas o solo para una con `--project` (ver [Extensiones](extensiones.md)). Está disponible en `chat` y `run`.

## Los laboratorios

Un laboratorio es una carpeta dentro de la carpeta de laboratorios de docker-lab, con un `compose.yaml` y, si hace falta, un `lab.json` con su comprobación. Esa carpeta es la opción `labs_dir` de la extensión o, si no la das, `labs` dentro de la carpeta de datos de la extensión.

docker-mcp no tiene herramientas para escribir archivos, así que miyagi escribe los del laboratorio en esa carpeta: con docker-lab activada, es la única que puede escribir además de `drafts/` (ver [Seguridad y privacidad](seguridad-y-privacidad.md)). Llama a cada laboratorio `<asignatura>-<actividad>`, para que los de dos asignaturas no se mezclen, y los maneja con `lab_up` (levantarlo), `lab_exec` (ejecutar algo dentro), `lab_check` (pasar su comprobación) y `lab_down` (pararlo).

## La política de cada laboratorio

La impone docker-mcp al arrancar un laboratorio, no unas instrucciones al modelo: un laboratorio que se la salta no arranca.

- **Sin internet**, salvo que lo permitas con la opción `allow_internet` (desactivada por defecto).
- **Nada montado fuera de la carpeta del laboratorio**, y nunca el socket de Docker.
- **Límites de CPU y memoria** por servicio: las opciones `cpus` (1 por defecto) y `memory` (`512m` por defecto).
- **Sin privilegios nuevos** dentro de los contenedores.

Las opciones se dan al instalar la extensión, con `--set clave=valor`, o cuando `miyagi extension add` te las pregunta.

## Lo que miyagi bloquea

docker-mcp también tiene herramientas que trabajan con todo el Docker del ordenador: contenedores, imágenes, volúmenes, redes, proyectos de Compose y la limpieza (`prune`). miyagi se las quita siempre, sea cual sea el modo de la extensión: solo le quedan los laboratorios.

## Cómo trabaja

El asistente usa la habilidad [`practice-testing`](https://github.com/falkenslab/miyagi/blob/main/plugin/skills/practice-testing/SKILL.md) para saber qué comprobar y qué hacer con el resultado; la mecánica de montar y ejecutar un laboratorio es de las habilidades de docker-lab, `build-a-lab` y `verify-by-running`.

### Antes de publicar una práctica

1. Escribe el laboratorio: el `compose.yaml` con la imagen que usarán los alumnos (con versión fija, la que dice el enunciado), los archivos de partida, la solución si la hay y un `lab.json` cuya comprobación dice si la solución hace lo que promete el enunciado.
2. Sigue el enunciado paso a paso como un alumno, dentro del laboratorio, y anota dónde se rompe.
3. Ejecuta la solución y la comprobación. Corrige cada fallo (un paso que falta, una versión que no existe, una salida distinta de la prometida) en el enunciado o en la solución y repite hasta que pase. Solo entonces publica la práctica, con su aprobación.
4. Anota en la página de la actividad (`activity/<slug>`) que se comprobó, cuándo, con qué imagen y qué órdenes ejecutará el alumno, y para el laboratorio.

### Al corregir una entrega

1. Lleva los archivos del alumno a un laboratorio de la actividad, en una carpeta con un identificador o un alias, nunca con su nombre.
2. Ejecuta lo que pedía la actividad («el contenedor tiene que responder en el puerto 8080 con…»), con su comprobación si la tiene.
3. Corrige con `grading-rubric`, usando lo que se ejecutó como prueba, y cita la orden y la salida relevantes en la retroalimentación cuando explican la nota. Ejecutar nunca pone la nota: la pone el asistente.

Ejecutar es comprobar, no publicar: antes de levantar un laboratorio, miyagi te pide una sola aprobación con lo que va a hacer (qué laboratorio, qué imagen, qué ejecutará dentro y que lo parará al terminar), y con ese sí hace toda la comprobación sin más preguntas. Parar el laboratorio te lo confirma docker-lab. Publicar la práctica o guardar una nota llevan su propia aprobación, como siempre.

## Sin docker-lab

Si docker-lab no está instalada o está desactivada, la habilidad `practice-testing` no se ofrece. Si le pides probar una práctica, miyagi te dirá que no puede ejecutar nada y te sugerirá instalar docker-lab; nunca presentará como probada una práctica sin probar.

En el tutorial [Un curso de Introducción a SQL](../casos-de-uso/index.md) puedes verlo comprobando prácticas de MariaDB.
