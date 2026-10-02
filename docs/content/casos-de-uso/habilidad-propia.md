---
title: 10. Tu propia habilidad
sidebar_position: 11
description: Enseñarle a miyagi las convenciones de SQL de tu clase con una habilidad propia, y verla aplicada sin pedírselo.
---

# 10. Tu propia habilidad

miyagi trae sus habilidades de serie, pero cada asignatura tiene sus manías. En este curso queremos que todo el SQL que vean los alumnos siga las mismas convenciones: palabras reservadas en mayúsculas, una cláusula por línea, alias con `AS`, `JOIN` siempre explícito, `INSERT` siempre con la lista de columnas… Los alumnos aprenden imitando.

Para eso no hay que programar: basta un archivo de texto con una **habilidad propia**.

## Escribirla

En la carpeta del curso, `.claude/skills/estilo-sql/SKILL.md`:

```markdown
---
name: estilo-sql
description: Convenciones de estilo SQL de este curso (MariaDB) - úsala siempre que escribas o revises SQL que vayan a ver los alumnos (apuntes, enunciados, soluciones, preguntas de cuestionario, respuestas del foro) y al corregir entregas con SQL.
---

# Estilo SQL del curso

Todo el SQL que publiques en este curso sigue estas convenciones, sin excepciones.

## Convenciones

1. Palabras reservadas en MAYÚSCULAS.
2. Nombres de tablas y columnas en snake_case y minúsculas: clientes, fecha_alta, id_cliente.
3. Una cláusula por línea, y las columnas de un SELECT largo, una por línea con cuatro espacios.
4. INSERT siempre con la lista de columnas explícita.
...
```

La línea `description` es la que decide **cuándo** la usa: dice qué hace y en qué situaciones. El archivo completo, con el ejemplo de referencia y qué hacer al corregir, está en [Habilidades propias](../avanzado/habilidades-propias.md).

## Comprobar que la ve

```powershell
miyagi skills
```

Aparece al final de la lista, marcada como `[propia]`:

<Shot src="/img/casos/49-skills-propia.webp" title="PowerShell — miyagi skills" alt="La salida de miyagi skills: las habilidades incorporadas con su descripción y, al final, estilo-sql marcada como propia, con su descripción.">Las habilidades de miyagi, y la nuestra al final.</Shot>

## Verla en acción

No hace falta nombrarla. Le pedimos algo donde va a escribir SQL para los alumnos:

<p className="pide">Para la clase del martes, escribe en drafts tres ejemplos de JOIN sobre la tienda, de menos a más, con su explicación, para proyectar en clase. No publiques nada.</p>

Antes de escribir una línea, la carga por su cuenta:

<Shot src="/img/casos/50-skill-carga.webp" alt="El chat: tras leer la página del Tema 4, aplica la skill estilo-sql; después lee los datos de la tienda, los capítulos de JOIN de los apuntes y la solución de la práctica final para no repetirlos, escribe ejemplos-join.sql y anuncia que lo comprobará en Docker.">«Aplicando la skill estilo-sql», sin que se lo pidiéramos.</Shot>

Lee los apuntes y la solución de la práctica final para no repetir sus ejemplos, escribe las consultas siguiendo las convenciones, las ejecuta en Docker sobre los datos de la tienda y prepara una página para proyectar, con los resultados reales:

<Shot src="/img/casos/52-ejemplos-join.webp" title="ejemplos-join.html" alt="La página para proyectar: tres ejemplos de JOIN sobre la tienda; el primero, qué lleva el pedido 6, con las tablas de partida, la consulta escrita en mayúsculas con una cláusula por línea y alias con AS, el resultado real y qué hay que ver.">Lo que preparó en `drafts/` para la clase: consultas con nuestro estilo y resultados reales.</Shot>

<Shot src="/img/casos/51-skill-resumen.webp" alt="El resumen: los tres ejemplos de menos a más (INNER JOIN de dos tablas, el filtro de un LEFT JOIN en el ON o en el WHERE, tres tablas con COUNT DISTINCT), todo ejecutado en Docker sin errores, siguiendo el estilo SQL del curso, y la pregunta de si la clase es la del martes 10 de noviembre, que es cuando toca JOIN según el calendario.">Y una pregunta sensata: según el calendario, el JOIN toca el martes 10 de noviembre, no este martes.</Shot>

:::tip Lo que una habilidad puede y no puede hacer
Una habilidad le enseña **cómo** hacer algo con lo que ya tiene. No le da herramientas nuevas ni le salta las aprobaciones. Lo que vale para todo el curso, en todas las tareas («puntúa sobre 10»), va mejor en `instructions.md`: lo explica [Atajos e instrucciones](../avanzado/atajos-e-instrucciones.md).
:::

## Y hasta aquí

Desde un curso vacío hasta un aula de Introducción a SQL completa: programación, cuatro temas con apuntes, prácticas probadas en Docker, entregables con rúbrica, cuestionarios, una práctica final corregida, un foro atendido, un seguimiento, una auditoría y una guía del curso. Cada cosa que vieron los alumnos pasó antes por un panel de aprobación.

Para hacerlo en tu curso, empieza por [Instalar](../guia/instalar.md) y [Primeros pasos](../guia/primeros-pasos.md).
