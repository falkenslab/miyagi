---
title: 1. Preparar el aula
sidebar_position: 2
description: Conectar miyagi a un curso vacío de Moodle con miyagi init y dejar que explore qué admite ese Moodle.
---

# 1. Preparar el aula

Partimos de un curso de Moodle vacío, «Introducción a SQL», en el que tenemos rol de profesor. Solo tiene la sección General y una sección nueva sin nada dentro.

<Shot kind="moodle" src="/img/casos/00-curso-vacio.webp" alt="El curso Introducción a SQL en Moodle, visto por el profesor: solo las secciones General y Nueva sección, vacías.">El punto de partida: un curso vacío.</Shot>

## Una carpeta para la asignatura

Cada asignatura tiene su carpeta en tu ordenador. Ahí guarda miyagi la configuración, tus documentos y sus apuntes. Sin más, `miyagi init` la crea en la carpeta de miyagi (`~/.miyagi/workspaces/`) y luego la abres por su nombre con `-w`. Aquí preferimos tenerla a mano, así que abrimos una terminal, creamos la carpeta y se la indicamos con `--dir`:

```powershell
mkdir cursos\intro-sql
cd cursos\intro-sql
miyagi init --dir .
```

Dentro de esa carpeta, los demás comandos (`miyagi ingest`, `miyagi chat`) usan esa asignatura sin tener que nombrarla.

## Las preguntas de `miyagi init`

Primero pregunta por la asignatura y, al final, por el aula de Moodle. Estas son las respuestas para el aula de SQL:

- **Nombre y descripción** de la asignatura: «Introducción a SQL», «Módulo de bases de datos de 1.º de DAM: SQL con MariaDB».
- **Tono**: cercano. Es como hablará a los alumnos en el foro y en la retroalimentación.
- **Idioma**: español.
- **¿Crear `instructions.md`?** Por ahora no. Lo veremos en el [último paso](habilidad-propia.md).
- **¿Conectar un aula Moodle ahora?** Sí (por defecto dice que no: sin aula te ayuda igual con la programación y los materiales, y puedes conectarla más tarde volviendo a ejecutar `miyagi init` en su carpeta).
- **URL de Moodle**: la dirección completa del curso, copiada del navegador. Así saca él solo el número de curso. No pide usuario ni contraseña.

Con eso instala la extensión **moodle-teacher**, que es la que trabaja en Moodle con tu sesión de profesor, y apunta en ella la dirección de tu Moodle.

<Shot src="/img/casos/01-init.webp" title="PowerShell — miyagi init" alt="La terminal con miyagi init: nombre Introducción a SQL, descripción 1.º DAM, tono Cercano, idioma español, sin instructions.md, aula conectada con la URL del curso, la asignatura creada en la carpeta de miyagi, moodle-teacher instalado con el sitio y la pregunta de si explorar ahora" />

## Explorar el Moodle

Después propone explorar el Moodle, y decimos que sí. Como es la primera vez, moodle-teacher abre una ventana del navegador para que entres en Moodle tú mismo, con tu usuario y tu contraseña: ni miyagi ni el asistente la ven. La extensión guarda la sesión, así que las siguientes veces no vuelve a pedirla hasta que caduque.

Ya dentro, miyagi mira qué tipos de actividad y de pregunta admite este Moodle, sin crear ni cambiar nada. Lo apunta en su memoria (la página `course/moodle-capabilities`) para no proponer luego algo que el centro no tiene.

:::note
La exploración solo usa las herramientas de lectura de moodle-teacher. Estas no listan todos los tipos de pregunta que tiene activados el Moodle, solo los que ya hay en los bancos del curso; en un curso vacío, esa parte queda por comprobar.
:::

## Las prácticas, en laboratorios de Docker

El curso va de MariaDB en Docker y queremos que miyagi compruebe las prácticas antes de publicarlas. Para eso instalamos la extensión **docker-lab**, con la que miyagi comprueba cada práctica en un laboratorio de Docker, aislado y sin tocar nada más del ordenador. Necesita Docker Desktop instalado:

```powershell
miyagi extension add docker-lab --set mode=lab
```

Lo tienes explicado en [Prácticas en Docker](../avanzado/practicas-docker.md).

Siguiente paso: [darle tu material](tu-material.md).
