---
title: Prácticas en Docker
sidebar_position: 7
description: "El probador de prácticas: cómo miyagi ejecuta enunciados, soluciones y entregas en contenedores Docker, con qué límites y cómo activarlo."
---

# Prácticas en Docker

En un curso de informática (Docker, Linux, programación, bases de datos), una práctica que no funciona tal como está escrita le cuesta la tarde a toda la clase. Y una entrega corregida «leyendo el código» puede llevarse la nota de algo que no se ejecuta. Con el **probador de prácticas**, miyagi puede ejecutar las prácticas de verdad, dentro de contenedores Docker:

- **Antes de publicar una práctica**, la sigue paso a paso como lo haría un alumno y comprueba que la solución da lo que promete el enunciado. Si algo falla, la corrige antes de publicarla.
- **Al corregir**, ejecuta la entrega del alumno y usa lo que sale como prueba en la nota y en la retroalimentación.

## Por qué está desactivado por defecto

Es lo único que le da a miyagi la capacidad de ejecutar programas en tu ordenador. El asistente principal no tiene terminal nunca; cuando activas esta opción, aparece un ayudante aparte, `practice-runner`, que sí tiene una, pero con instrucciones que la limitan a Docker y a la carpeta `practice` del curso ([ADR-003](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-003-practice-runner-opt-in-docker.md)).

Ten en cuenta que esos límites están en sus instrucciones: el filtro de carpetas de agent-kit no cubre la terminal. Por eso es una decisión tuya, curso a curso.

## Cómo activarlo

1. Instala [Docker Desktop](https://www.docker.com/products/docker-desktop/) (en Linux, Docker Engine) y comprueba que funciona:

   ```bash
   docker version
   ```

2. Actívalo en el curso, de una de estas formas:
   - Responde que sí a la pregunta de `miyagi init`.
   - En un curso ya creado, edita su `config.json` y pon `"allowPracticeRunner": true` dentro de `"agent"` (el resto de claves, como estaban).
   - Si tu curso es anterior a esta opción (no tiene la clave), miyagi te lo pregunta una vez al abrir `chat` o `run`, y guarda tu respuesta.

```json
{
  "agent": {
    "allowPracticeRunner": true
  }
}
```

Está disponible en `chat` y `run`. Si no lo activas y le pides probar una práctica, el asistente te dirá que no puede y nunca presentará como probada una práctica sin probar.

## Cómo trabaja

El asistente usa la habilidad [`practice-testing`](https://github.com/falkenslab/miyagi/blob/main/plugin/skills/practice-testing/SKILL.md) para decidir cuándo y cómo, y delega la ejecución en `practice-runner`. El ayudante nunca pone notas ni publica nada: ejecuta e informa, y el asistente principal decide con ese informe.

### Antes de publicar una práctica

1. El asistente escribe la práctica en `practice/<slug>/`: el enunciado (`statement.md`), los archivos de partida del alumno (`start/`) y la solución (`solution/`).
2. Pide a `practice-runner` que siga `statement.md` paso a paso como un alumno, desde `start/`, y le diga dónde se rompe; y después que ejecute `solution/` y compruebe que da lo que promete el enunciado.
3. Corrige cada problema que le devuelve (un paso que falta, una versión que no existe, una salida distinta de la prometida) y repite hasta que pase. Solo entonces publica la práctica, con su aprobación.
4. Anota en la página de la actividad (`activity/<slug>`, archivo `knowledge/activities/<slug>.md`) que se comprobó, cuándo, con qué imagen base y qué órdenes ejecutará el alumno.

### Al corregir una entrega

1. Descarga los archivos del alumno y los guarda en `sources/<slug>/<id-del-alumno>/`, con un identificador y nunca con su nombre en la ruta.
2. Pide a `practice-runner` que los ejecute contra lo que pedía la actividad («el contenedor tiene que responder en el puerto 8080 con…»). El ayudante los copia a su propia subcarpeta, `practice/<slug>/<id>/`, para que dos entregas no compartan archivos.
3. Corrige con `grading-rubric`, usando lo que informa como prueba, y cita la salida relevante en la retroalimentación cuando explica la nota.

Ejecutar no es publicar: no necesita aprobación para ejecutar, solo para guardar la nota o publicar la práctica.

## Sus límites

Las instrucciones del ayudante ([`practice-runner.md`](https://github.com/falkenslab/miyagi/blob/main/prompts/system/practice-runner.md)) le imponen:

- **Solo Docker.** Sus órdenes son `docker ...` y leer, copiar y listar archivos en la carpeta de la práctica. Nunca instala nada (ni gestores de paquetes, ni `pip`, `npm` o `apt`), nunca cambia la configuración del equipo y nunca usa `sudo`. Si Docker no está instalado o no está en marcha, se detiene y te dice qué falta.
- **Solo en `practice/<slug>/`.** Todo lo que escribe va ahí. Los originales de `sources/` son de solo lectura: copia lo que necesita.
- **Todo lo que ejecuta es sospechoso**, el código de un alumno sobre todo:
  - `docker run --rm` con `--network none` salvo que la práctica necesite red (y entonces lo justifica en el informe);
  - `--memory 512m --cpus 1` y un límite de tiempo (`timeout 120 docker run ...`);
  - solo monta la carpeta de la práctica, en solo lectura si el código no necesita escribir; nunca tu carpeta personal, la del curso ni el socket de Docker.
- **Sus propios nombres.** Un enunciado para alumnos usa nombres genéricos (`web1`, un volumen `datos-web`) y puertos fijos (`8080`) que en tu equipo pueden existir ya. Por eso, al seguirlo, renombra y lo cuenta: contenedores, volúmenes y redes con el prefijo `tap-<slug>-`; Compose siempre con `docker compose -p tap-<slug>`; puertos publicados solo en `127.0.0.1`, a partir del 18000, comprobando antes que están libres. Los mismos límites de memoria, CPU y tiempo valen también cuando sigue el enunciado al pie de la letra.
- **Imágenes oficiales con versión fija** (`python:3.12-slim`, `node:22-alpine`, `ubuntu:24.04`), nunca `latest`. Etiqueta lo que crea con `miyagi=practice` y nombra sus imágenes `miyagi-practice/<slug>`.
- **Limpia lo suyo y solo lo suyo.** Antes de empezar anota qué imágenes había; al terminar quita sus contenedores, volúmenes, redes e imágenes, y una imagen base que descargó solo si no estaba antes. Nunca `docker system prune` ni borrados por patrón.

Y el informe que devuelve trae las órdenes exactas en orden, con su código de salida, la salida relevante citada literalmente y lo que tardó; si el enunciado funciona paso a paso o dónde se rompe; para una entrega, qué funciona y qué no frente a lo pedido, con pruebas y sin nota; y lo que no pudo comprobar.

## Lo que no hace

No sirve archivos para verlos en un navegador (un servidor web para una actividad HTML, por ejemplo): los recursos se prueban en Moodle, subidos ocultos (ver [Aprobaciones y borradores](aprobaciones-y-borradores.md)).

En el tutorial [Un curso de Introducción a SQL](../casos-de-uso/index.md) puedes verlo comprobando prácticas de MariaDB.
