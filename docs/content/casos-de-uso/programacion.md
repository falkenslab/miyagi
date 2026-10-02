---
title: 3. La programación didáctica
sidebar_position: 4
description: Completar la programación didáctica en el chat, con una revisión pedagógica y las decisiones que solo toma el profesor.
---

# 3. La programación didáctica

La ingesta convirtió el temario en la programación del curso (`knowledge/teaching-plan.md`), pero al temario le faltaban cosas: criterios de evaluación, un calendario y atención a la diversidad. Abrimos el chat:

```powershell
miyagi chat
```

Al arrancar, lee su memoria y nos resume lo que sabe del curso, incluida la contradicción de la penalización que encontró en el paso anterior.

<Shot src="/img/casos/05-chat-apertura.webp" alt="El chat de miyagi a pantalla completa: la cabecera con el logo, el curso Introducción a SQL y un saludo que resume lo que sabe: programación con 5 objetivos y 4 temas, práctica final del 50 %, curso aún vacío en Moodle y la contradicción de la penalización por retraso.">El chat al arrancar. Abajo, el modo (guiado) y cuánto contexto lleva usado.</Shot>

## Pedírselo

Usamos el atajo de la programación, `/miyagi:teaching-plan`, y le decimos lo que queremos con nuestras palabras:

<p className="pide">/miyagi:teaching-plan Revisa la programación que sacaste de mi temario y complétala con lo que falte: criterios de evaluación, calendario de las 6 semanas (empezamos el lunes 5 de octubre) y atención a la diversidad. La penalización por retraso la aplico yo a mano al calificar.</p>

Escribe lo que falta y, antes de darlo por bueno, lo manda a un ayudante: el **revisor pedagógico**, un experto en diseño didáctico que lee la programación entera y le devuelve un informe. No puede cambiar nada él mismo.

<Shot src="/img/casos/06-revisor.webp" alt="El chat mientras delega en pedagogy-reviewer: el ayudante lee la programación, las páginas de los cuatro temas y la de la práctica final; después miyagi edita la programación con lo que le ha señalado.">El revisor pedagógico leyendo la programación y los temas. Después, miyagi aplica sus sugerencias.</Shot>

## Lo que solo decides tú

Cuando termina, resume lo que ha hecho y pregunta lo que no le corresponde decidir: qué días hay clase (el 12 de octubre es festivo), si el reparto de semanas vale, y cómo evaluar un objetivo que se había quedado sin instrumento de evaluación.

<Shot src="/img/casos/07-programacion.webp" alt="La respuesta de miyagi: criterios CE1.1 a CE5.3, calendario de 6 semanas desde el 5 de octubre, atención a la diversidad, y tres preguntas para el profesor: los días de clase, el reparto de semanas y cómo evaluar los criterios del objetivo 1.">Lo que ha añadido, marcado como propuesta, y tres preguntas para el profesor.</Shot>

Le contestamos en el mismo chat:

<p className="pide">Las sesiones son los martes y jueves, de 1,5 horas cada una. El reparto de las semanas me vale. Para O1, añade al Tema 1 un entregable ligero: una captura de su contenedor funcionando con la base de datos tienda creada.</p>

Lo incorpora y vuelve a preguntar lo único que no puede saber: cuánto pesa ese entregable nuevo.

<Shot src="/img/casos/08-programacion-pregunta.webp" alt="miyagi confirma las sesiones de martes y jueves y el entregable del Tema 1, y pregunta si debe ser apto/no apto o restar peso a otros entregables; también avisa de dos criterios que siguen sin entregable propio.">Una pregunta concreta, con las dos opciones razonables.</Shot>

<p className="pide">Que sea apto/no apto, sin entrar en el 100 %. Lo de CE1.3 y los permisos lo cubrimos en el cuestionario del Tema 1.</p>

Con eso la programación queda cerrada. Así quedan, por ejemplo, los criterios de evaluación en `knowledge/teaching-plan.md`:

```markdown
- **CE1.1** (O1). Levanta un contenedor MariaDB 11 con `docker run` usando un volumen persistente y el puerto publicado correctamente.
- **CE1.2** (O1). Se conecta al servidor desde el cliente de línea de órdenes dentro del contenedor.
- **CE1.3** (O1). Para, arranca y borra el contenedor sin perder los datos, apoyándose en el volumen.
- **CE2.1** (O2). Crea una base de datos y un usuario con contraseña, y le concede permisos solo sobre esa base de datos (no sobre todas).
...
- **CE5.3** (O5). Combina dos o más tablas con `INNER JOIN` y `LEFT JOIN`, usando `JOIN` explícito y no comas en el `FROM`.
```

:::info La programación no se publica
La programación vive en la memoria del curso, en tu ordenador. No se sube a Moodle salvo que se lo pidas. Lo que sí hace es usarla para construir cada tema y, más adelante, para comprobar que el aula sigue cuadrando con ella (`/miyagi:align`).
:::

Siguiente paso: [el Tema 1](tema-1-mariadb-docker.md).
