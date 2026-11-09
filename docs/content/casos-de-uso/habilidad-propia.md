---
title: 10. Tu propia habilidad
sidebar_position: 11
description: Enseñarle a miyagi las convenciones de SQL de tu clase con una habilidad propia, y verla aplicada sin pedírselo.
---

# 10. Tu propia habilidad

miyagi trae sus habilidades de serie, pero cada asignatura tiene sus manías. En este curso queremos que todo el SQL que vean los alumnos siga las mismas convenciones: palabras reservadas en mayúsculas, una cláusula por línea, alias con `AS`, `JOIN` siempre explícito, `INSERT` siempre con la lista de columnas… Los alumnos aprenden imitando.

Para eso no hay que programar: basta un archivo de texto con una **habilidad propia**.

## Escribirla

En la carpeta de la asignatura, `.claude/skills/estilo-sql/SKILL.md`:

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

La línea `description` es la que decide **cuándo** la usa: dice qué hace y en qué situaciones. El archivo completo, con el ejemplo de referencia y qué hacer al corregir, está en [Habilidades propias](/avanzado/habilidades-propias/).

En la terminal, `miyagi skills` la muestra al final de la lista, marcada como `[propia]`. Lo puedes ver en [Casos de uso en la terminal](en-terminal.md).

## Verla en acción

No hace falta nombrarla. Le pedimos algo donde va a escribir SQL para los alumnos:

<Prompt>{`Para la clase del martes, escribe en drafts tres ejemplos de JOIN sobre la tienda, de menos a más, con su explicación, para proyectar en clase. No publiques nada.`}</Prompt>

Lee sus apuntes, escribe los ejemplos siguiendo las convenciones, los ejecuta en el laboratorio contra los datos de la tienda y prepara una página para proyectar con los resultados reales. En la corrección del [paso 7](corregir.md) ya la habías visto aplicarse sola: «Aplicando la skill estilo-sql».

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-10-habilidad-en-uso.webp" alt="La conversación de los ejemplos de JOIN: la petición, los pasos, y la tabla con los tres ejemplos.">Tres ejemplos, de menos a más.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-10-ejemplos-join.webp" alt="La misma conversación con la tabla de ejemplos y, en el panel lateral, la página ejemplos-join.html lista para proyectar.">La página para proyectar, en el panel lateral junto a la conversación.</Shot>

Y hace una pregunta sensata: el `JOIN` se explica el jueves, no el martes, según el calendario. Los ejemplos valen para las dos sesiones, pero te lo dice.

:::tip Lo que una habilidad puede y no puede hacer
Una habilidad le enseña **cómo** hacer algo con lo que ya tiene. No le da herramientas nuevas ni le salta las aprobaciones. Lo que vale para todo el curso, en todas las tareas («puntúa sobre 10»), va mejor en `instructions.md`: lo explica [Atajos e instrucciones](/avanzado/atajos-e-instrucciones/).
:::

## Y hasta aquí

Desde un curso vacío hasta un aula de Introducción a SQL completa: programación, cuatro temas con apuntes, prácticas probadas en Docker, ejercicios con rúbrica, cuestionarios, una práctica final corregida, un foro atendido, un seguimiento, una auditoría y una guía del curso. Cada cosa que vieron los alumnos pasó antes por un panel de aprobación. Y también viste lo que falló: el navegador que se cae, los cuestionarios que se quedan a medias, y que para corregir archivos, hoy, tienes que hacer tú de puente.

Para hacerlo en tu curso, empieza por [Instalar](/guia/instalar/) y [La aplicación de escritorio](/guia/escritorio/).
