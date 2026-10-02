---
title: Un aula de Introducción a SQL, de cero
sidebar_label: El aula de SQL
sidebar_position: 1
description: Un tutorial paso a paso, con capturas reales, en el que miyagi monta y lleva un aula de Introducción a SQL con MariaDB en Docker.
slug: /casos-de-uso/
---

# Un aula de Introducción a SQL, de cero

En este tutorial verás a miyagi trabajar de verdad, de principio a fin, en un aula de Moodle que empieza vacía. Es una unidad de **Introducción a SQL** para 1.º de DAM: el alumnado levanta su propio servidor **MariaDB en un contenedor Docker**, administra lo justo (una base de datos y un usuario), crea tablas, mete datos y hace consultas.

Todas las capturas son reales. Se hicieron contra un Moodle de pruebas ([moodle-sandbox](https://github.com/falkenslab/moodle-sandbox)), con alumnos de prueba que entregan y preguntan en el foro, y con miyagi tal cual lo instalarías tú. Lo que el profesor escribe en el chat aparece así:

<p className="pide">Corrige la práctica final con la rúbrica que te dejé.</p>

## Lo que vas a ver

1. [Preparar el aula](preparar-el-aula.md): `miyagi init` y la exploración del Moodle.
2. [Darle tu material](tu-material.md): el temario y la rúbrica, con `miyagi ingest`.
3. [La programación didáctica](programacion.md): completarla y que la revise un experto en didáctica.
4. [Tema 1: MariaDB en Docker](tema-1-mariadb-docker.md): el primer tema, con su práctica probada en Docker antes de publicarla.
5. [Temas 2 y 3: DDL y DML](temas-ddl-dml.md): crear tablas y manipular datos.
6. [Tema 4 y práctica final](tema-4-consultas.md): consultas, cuestionario y la tarea con rúbrica.
7. [Corregir con la rúbrica](corregir.md): las entregas de los alumnos, nota a nota.
8. [Atender el foro](foro.md): dudas reales sobre SQL.
9. [Seguimiento y auditoría](seguimiento.md): cómo va la clase y qué mejorar del curso.
10. [Tu propia habilidad](habilidad-propia.md): enseñarle las convenciones de SQL de tu clase.

## Qué necesitas para seguirlo

- miyagi instalado ([Instalar](../guia/instalar.md)).
- Un curso de Moodle en el que seas profesor. Para practicar, mejor uno de pruebas.
- Para el Tema 1 y la prueba de prácticas, [Docker Desktop](https://www.docker.com/products/docker-desktop/). Es opcional: sin Docker, miyagi monta igual el curso, pero no puede ejecutar las prácticas para comprobarlas.

:::tip Nada se publica sin tu permiso
En todo el tutorial, cada nota, cada respuesta en el foro y cada recurso que ven los alumnos pasa antes por un panel de aprobación. Lo verás en las capturas.
:::
