---
title: 1. Preparar el aula
sidebar_position: 2
description: Conectar miyagi a un curso vacío de Moodle con miyagi init y dejar que explore qué admite ese Moodle.
---

# 1. Preparar el aula

Partimos de un curso de Moodle vacío, «Introducción a SQL», en el que tenemos rol de profesor. Solo tiene la sección General y una sección nueva sin nada dentro.

<Shot kind="moodle" src="/img/casos/00-curso-vacio.webp" alt="El curso Introducción a SQL en Moodle, visto por el profesor: solo las secciones General y Nueva sección, vacías.">El punto de partida: un curso vacío.</Shot>

## Una carpeta para el curso

Cada curso tiene su carpeta en tu ordenador. Ahí guarda miyagi la configuración, tus documentos y sus apuntes. Abre una terminal y crea una:

```powershell
mkdir cursos\intro-sql
cd cursos\intro-sql
miyagi init
```

## Las preguntas de `miyagi init`

Te hace unas pocas preguntas. Estas son las que contestamos para el aula de SQL:

- **URL de Moodle**: la dirección completa del curso, copiada del navegador. Así saca él solo el número de curso.
- **Usuario y contraseña** de profesor. La contraseña se queda en tu ordenador: el asistente nunca la ve.
- **Etiqueta y descripción**: para reconocer la carpeta («Introducción a SQL», «Módulo de bases de datos de 1.º de DAM: SQL con MariaDB»).
- **Tono**: cercano. Es como hablará a los alumnos en el foro y en la retroalimentación.
- **Idioma**: español.
- **¿Probar prácticas en Docker?** Sí, porque el curso va de MariaDB en Docker y queremos que compruebe las prácticas antes de publicarlas. Necesita Docker Desktop instalado.
- **¿Crear `instructions.md`?** Por ahora no. Lo veremos en el [último paso](habilidad-propia.md).

<Shot src="/img/casos/01-init.webp" title="PowerShell — miyagi init" alt="La terminal con miyagi init: URL del curso, usuario profesor, contraseña oculta con asteriscos, etiqueta Introducción a SQL, tono Cercano, idioma español, pruebas en Docker activadas y la pregunta de si explorar ahora el Moodle.">Las respuestas de `miyagi init`. Al final propone explorar el Moodle.</Shot>

## Explorar el Moodle

A la última pregunta decimos que sí. miyagi abre Chrome, entra en el curso con la cuenta de profesor y mira qué tipos de actividad y de pregunta admite este Moodle, sin crear ni cambiar nada. Lo apunta en su memoria (`knowledge/moodle-capabilities.md`) para no proponer luego algo que el centro no tiene.

<Shot src="/img/casos/02-explore.webp" title="PowerShell — miyagi explore" alt="El resumen de la exploración: los 19 tipos de actividad del Moodle, que el curso aún no tiene banco de preguntas, que la calificación solo admite Suma y que la tarea no tiene penalización por retraso; no ha creado ni modificado nada.">El resumen de la exploración. Fíjate en el detalle: la tarea de este Moodle no tiene penalización por retraso, algo que importará más adelante.</Shot>

:::note
El Moodle de pruebas de estas capturas corre en Docker sobre Windows y va lento; por eso la exploración avisa de páginas que tardan en cargar. En el Moodle de un centro irá más rápido.
:::

Siguiente paso: [darle tu material](tu-material.md).
