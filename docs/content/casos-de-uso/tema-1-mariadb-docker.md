---
title: "4. Tema 1: MariaDB en Docker"
sidebar_position: 5
description: miyagi construye el primer tema (apuntes, práctica guiada, entregable y cuestionario) y prueba la práctica en Docker antes de publicarla.
---

# 4. Tema 1: MariaDB en Docker

Con la programación cerrada, toca construir el curso en Moodle. Empezamos por el primer tema en un chat nuevo, con el atajo `/miyagi:build-unit`:

<p className="pide">/miyagi:build-unit Tema 1: MariaDB en Docker, siguiendo la programación. Con unos apuntes que expliquen paso a paso cómo levantar el contenedor, conectarse con el cliente, crear la base de datos tienda y un usuario con permisos solo sobre ella; la práctica guiada, probada en Docker antes de publicarla; el entregable apto/no apto y el cuestionario del tema.</p>

## Primero, comprobar que funciona

Antes de escribir una línea de los apuntes, miyagi delega en su **probador de prácticas** (lo activamos en `miyagi init`). Este ayudante solo puede usar Docker: levanta un contenedor `mariadb:11` de verdad, se conecta, crea la base de datos y el usuario, para, arranca y borra el contenedor, y comprueba que los datos sobreviven gracias al volumen.

<Shot src="/img/casos/10-practice-runner.webp" alt="El chat mientras delega en practice-runner: lee la programación y la página del tema y ejecuta en Docker la conexión con el usuario tienda_app, docker stop, docker rm y la limpieza del contenedor.">El probador de prácticas ejecutando en Docker cada paso que luego leerán los alumnos.</Shot>

Su informe no se queda en «funciona»: trae lo que un alumno se encontrará de verdad. Por ejemplo, que la primera vez MariaDB tarda entre 6 y 14 segundos en estar listo, que el cliente se llama `mariadb` y no `mysql`, o que en los registros aparece un aviso sobre `io_uring` que no es un error. Todo eso acaba en los apuntes.

Después, el **revisor pedagógico** repasa el plan del tema. En este caso señaló siete mejoras, entre ellas comprobar Docker antes de la primera sesión y dar una segunda oportunidad a quien saque «no apto». miyagi las aplica antes de tocar Moodle.

## Lo que hacen tus alumnos

Estos son los comandos que acaban en la práctica, comprobados en Docker por el probador (y también al escribir este tutorial):

```bash
# Un volumen para los datos y el servidor MariaDB 11
docker volume create datos-tienda
docker run -d --name mariadb-tienda -e MARIADB_ROOT_PASSWORD=TuContraseñaSegura -v datos-tienda:/var/lib/mysql -p 3306:3306 mariadb:11
docker logs mariadb-tienda          # esperar a "ready for connections"

# Entrar con el cliente como root
docker exec -it mariadb-tienda mariadb -u root -p
```

```sql
-- La base de datos y un usuario que solo puede usarla a ella
CREATE DATABASE tienda;
CREATE USER 'tienda_app'@'%' IDENTIFIED BY 'TuContraseñaDeUsuario';
GRANT ALL PRIVILEGES ON tienda.* TO 'tienda_app'@'%';
SHOW GRANTS FOR 'tienda_app'@'%';
```

```bash
# Parar, arrancar y recrear el contenedor sin perder los datos
docker stop mariadb-tienda
docker start mariadb-tienda
docker rm -f mariadb-tienda          # el volumen datos-tienda sigue ahí
```

## Cada cosa, con tu permiso

miyagi construye el tema pieza a pieza: lo sube **oculto**, lo revisa como lo vería un alumno y solo entonces te pide permiso para mostrarlo. Cada panel dice exactamente qué va a publicar.

<Shot src="/img/casos/13-aprobacion-libro.webp" alt="Panel de aprobación: publicar el libro Apuntes: MariaDB en Docker con sus 6 capítulos, del SGBD a parar, arrancar y borrar el contenedor; todos los comandos verificados en Docker.">Antes de mostrar los apuntes: un libro de 6 capítulos, con los comandos ya verificados.</Shot>

El cuestionario se escribe en formato GIFT y se importa de golpe. El panel enseña cada pregunta con su respuesta correcta y sus distractores, para que puedas revisarlas antes de que existan en Moodle:

<Shot src="/img/casos/14-aprobacion-gift.webp" alt="Panel de aprobación: importar 10 preguntas GIFT al banco del cuestionario del Tema 1, cada una con su enunciado, la respuesta correcta y los distractores, por ejemplo qué comando borra los datos para siempre: docker volume rm.">Diez preguntas que se centran en lo que el entregable no comprueba: parar, arrancar y borrar sin perder datos, y los permisos.</Shot>

En total, el Tema 1 pasó por diez aprobaciones: el nombre y el resumen de la sección, los apuntes, la práctica guiada, una escala «Apto / No apto» (el Moodle solo traía escalas en inglés), el entregable, las preguntas, el cuestionario y el peso del entregable en el libro de calificaciones (0 %, porque decidimos que no entra en la nota).

:::caution Y si intenta publicar sin preguntar
La aprobación no depende solo de que el agente se acuerde. El programa vigila los botones de Moodle que publican algo y, si el agente pulsa uno sin haber pedido permiso, lo detiene y te pregunta. Ocurrió al renombrar la sección:

<Shot src="/img/casos/11-publish-gate.webp" alt="Panel Publicación sin aprobación previa: el agente va a escribir el nuevo nombre de la sección sin haber pedido aprobación antes; opciones Sí, No y Parar.">El vigilante de publicación, parando un cambio que el agente no había pedido.</Shot>
:::

## El resultado

Así ve el tema un alumno: la sección con su resumen y el orden a seguir, y las cuatro piezas con sus fechas.

<Shot kind="moodle" src="/img/casos/17-tema1-alumno.webp" alt="El curso visto por un alumno: la sección Tema 1. MariaDB en Docker con su resumen y orden a seguir, y cuatro elementos: Apuntes (libro), Práctica guiada (página), Entregable apto/no apto con apertura el 6 y cierre el 8 de octubre, y Cuestionario del Tema 1 que abre el 6 y cierra el 11 de octubre.">El Tema 1 desde la cuenta de un alumno.</Shot>

<Shot kind="moodle" src="/img/casos/20-quiz-preguntas.webp" alt="Las 10 preguntas del Cuestionario del Tema 1 en Moodle, de T1-01 Borrar datos para siempre a T1-10 Puerto ocupado, un punto cada una, puntuación total 10.">Las diez preguntas, ya en el cuestionario, en su orden.</Shot>

Al terminar, resume lo que ha hecho, las decisiones que tomó por su cuenta y lo que conviene que revises:

<Shot src="/img/casos/15-tema1-resumen.webp" alt="El resumen final del Tema 1: las cuatro piezas creadas, las decisiones tomadas por su cuenta (la escala Apto / No apto, el reparto por sesiones), lo que cambió tras la revisión pedagógica y qué revisar: las fechas y el peso del cuestionario.">El resumen del tema, con lo que debes revisar tú.</Shot>

## Revisar y pedir cambios

Revisar como alumno sirve. Al abrir la práctica guiada vimos que los comandos estaban dentro del texto, sin formato de código: no se podían copiar bien.

<Shot kind="moodle" src="/img/casos/18-practica-antes.webp" alt="La práctica guiada con los nueve pasos como párrafos de texto normal, con los comandos mezclados en la frase.">Antes: los comandos, perdidos dentro del texto.</Shot>

Se lo dijimos con nuestras palabras:

<p className="pide">Las fechas me valen. Una cosa: en la Práctica guiada los comandos salen como texto normal dentro del párrafo. Ponlos en bloques de código, uno por paso, para que se puedan copiar.</p>

Rehízo la página desde la vista de código fuente del editor, la volvió a revisar y la guardó con nuestro permiso:

<Shot kind="moodle" src="/img/casos/19-practica-despues.webp" alt="La práctica guiada corregida: cada paso con su título en negrita y su comando en un bloque de código monoespaciado, listo para copiar.">Después: cada paso con su comando en un bloque de código.</Shot>

Le pedimos lo mismo para los apuntes y lo aplicó en todos los capítulos. La lección quedó además en las habilidades de miyagi, para que los próximos temas salgan bien a la primera.

:::note
Un tema completo en este Moodle de pruebas, lento, llevó más de una hora y llegó al límite de turnos de una sesión. Bastó con decirle «sigue donde lo dejaste»: retomó el plan del tema desde su memoria y lo terminó.
:::

Siguiente paso: [temas 2 y 3](temas-ddl-dml.md).
