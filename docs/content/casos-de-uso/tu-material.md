---
title: 2. Darle tu material
sidebar_position: 3
description: Dejar el temario y la rúbrica en sources/ y convertirlos en la memoria del curso con miyagi ingest.
---

# 2. Darle tu material

miyagi trabaja mejor cuanto más sabe de tu curso. Lo que tú ya tienes escrito (el temario, las rúbricas, las soluciones, tus criterios) va en la carpeta `sources/` del curso. Él solo lo lee: nunca cambia tus originales.

Para el aula de SQL dejamos dos documentos:

- **`temario-introduccion-sql.md`**: 6 semanas, 4 temas (MariaDB en Docker, DDL, DML y consultas), los objetivos, la base de datos de trabajo (`tienda`) y la evaluación: cuestionarios 20 %, ejercicios 30 %, práctica final 50 %, y un 20 % menos por entregar tarde.
- **`rubrica-practica-consultas.md`**: la rúbrica de la práctica final, sobre 10: resultados correctos (5), uso adecuado de SQL (3) y legibilidad (2), con qué hacer si no hay entrega.

Pueden ser PDF, Word, Markdown o incluso fotos de apuntes a mano. Después:

```powershell
miyagi ingest
```

`ingest` no abre Moodle: lee cada documento y lo convierte en páginas de su memoria del curso, enlazadas entre sí.

<Shot src="/img/casos/03-ingest.webp" title="PowerShell — miyagi ingest" alt="El resumen de miyagi ingest: dos fuentes leídas, nueve páginas creadas (resúmenes, la programación, una página por tema, la de la práctica final y la visión general) y un aviso: la penalización del 20 % por retraso no se puede configurar en la tarea de este Moodle y habrá que aplicarla a mano.">El resumen de la ingesta. Cruza tu temario con lo que vio al explorar y avisa de una contradicción: la penalización por retraso no existe en la tarea de este Moodle.</Shot>

Ese aviso es un buen ejemplo de para qué sirve la memoria: no se limita a copiar tus documentos, los relaciona con lo que sabe del curso.

## La memoria del curso

Todo queda en la carpeta `knowledge/`, en archivos de texto que puedes abrir con cualquier editor:

<Shot src="/img/casos/04-knowledge.webp" title="PowerShell — knowledge/" alt="El listado de la carpeta knowledge: index.md, log.md, moodle-capabilities.md, overview.md, teaching-plan.md, una página de actividad para la práctica final, dos resúmenes de fuentes y una página por cada uno de los cuatro temas.">La memoria tras la ingesta: un índice, un registro de cambios, la programación, una página por tema y la de la práctica final.</Shot>

Si quieres saber qué guarda cada archivo y cómo funciona la ingesta por dentro, está en [La base de conocimiento](../avanzado/base-de-conocimiento.md).

Siguiente paso: [la programación didáctica](programacion.md).
