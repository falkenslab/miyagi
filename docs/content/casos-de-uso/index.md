---
title: Un aula de Introducción a SQL, de cero
sidebar_label: El aula de SQL
sidebar_position: 1
description: Un tutorial paso a paso, en la aplicación de escritorio y con capturas reales, en el que miyagi monta y lleva un aula de Introducción a SQL con MariaDB en Docker.
slug: /casos-de-uso/
---

# Un aula de Introducción a SQL, de cero

En este tutorial verás a miyagi trabajar de verdad, de principio a fin, en un aula de Moodle que empieza vacía. Es una unidad de **Introducción a SQL** para 1.º de DAM: 6 semanas, 4 temas (MariaDB en Docker, DDL, DML y consultas) y una **práctica final con 10 consultas** sobre la base de datos `tienda`. Los pesos del libro de calificaciones: 5 % cada cuestionario, 15 % cada ejercicio y 50 % la práctica final.

Está hecho en la **aplicación de escritorio**, que es la versión principal. Lo que el profesor escribe aparece así:

<Prompt>{`Corrige la Práctica final «Consultas sobre la tienda» con la rúbrica que te dejé en sources.`}</Prompt>

:::note Lo que debes saber antes de leer
Todas las capturas son reales, de la versión 0.13.0, hechas contra un Moodle de pruebas ([moodle-sandbox](https://github.com/falkenslab/moodle-sandbox)) con alumnos ficticios. Ese Moodle está en inglés, porque el sandbox no tiene el paquete de español: en las capturas verás «Course», «Grades» o «Submissions», y lo que escribe miyagi, en español.

Algunos paneles de aprobación se fotografiaron con una petición de ejemplo y luego se rechazaron; lo decimos en cada uno. El tutorial no oculta lo que falló: verás dónde se cayó el navegador y qué se quedó a medias.
:::

## Los pasos

1. [Preparar el aula](preparar-el-aula.md): crear la asignatura y vincular el curso.
2. [Darle tu material](tu-material.md): el temario y la rúbrica en Fuentes.
3. [La programación didáctica](programacion.md): completarla y decidir lo que solo decides tú.
4. [Tema 1: MariaDB en Docker](tema-1-mariadb-docker.md): el primer tema, probado en un laboratorio antes de publicarlo.
5. [Temas 2 y 3: DDL y DML](temas-ddl-dml.md): crear tablas y manipular datos.
6. [Tema 4 y práctica final](tema-4-consultas.md): consultas, cuestionario, la tarea con rúbrica y mostrarlo todo.
7. [Corregir con la rúbrica](corregir.md): las entregas de los alumnos, nota a nota, con lo que implica la protección de datos.
8. [Atender el foro](foro.md): dudas reales sobre SQL.
9. [Seguimiento y auditoría](seguimiento.md): cómo va la clase y qué mejorar del curso.
10. [Tu propia habilidad](habilidad-propia.md): enseñarle las convenciones de SQL de tu clase.

¿Usas otra versión? Mira lo mismo en la [versión web](en-web.md) o en la [terminal](en-terminal.md).

## Qué necesitas para seguirlo

- La [aplicación de escritorio](/guia/escritorio/) instalada, u otra [versión](/guia/elegir-version/).
- Un curso de Moodle en el que seas profesor. Para practicar, mejor uno de pruebas.
- Para el Tema 1 y la prueba de prácticas, [Docker Desktop](https://www.docker.com/products/docker-desktop/) y la extensión docker-lab. Son opcionales: sin Docker, miyagi monta igual el curso, pero no puede ejecutar las prácticas para comprobarlas.

:::tip Nada se publica sin tu permiso
En todo el tutorial, cada nota, cada respuesta en el foro y cada recurso que ven los alumnos pasa antes por un panel de aprobación. Lo verás en las capturas.
:::
