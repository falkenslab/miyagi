---
title: Habilidades propias
sidebar_position: 2
description: "Cómo enseñarle a miyagi una habilidad nueva para tu asignatura con un archivo SKILL.md, con un ejemplo completo de convenciones de estilo SQL."
---

# Habilidades propias

Si en tu asignatura hay algo que el asistente debería hacer siempre de una manera concreta, puedes escribírselo como una **habilidad propia**: un archivo de texto con instrucciones que el asistente carga cuando la tarea lo pide, igual que [las suyas](../guia/habilidades.md). No hace falta programar.

## Dónde va

Dentro de la carpeta del curso, una carpeta por habilidad con un archivo `SKILL.md`:

```text
mi-curso/
  .claude/
    skills/
      estilo-sql/
        SKILL.md
```

La carpeta `.claude` empieza por punto, así que en Mac y Linux puede quedar oculta en el explorador de archivos. Créala igualmente; miyagi la busca en la carpeta del curso cada vez que arranca.

## Qué forma tiene

El archivo empieza con un encabezado (frontmatter) entre dos líneas `---` y sigue con las instrucciones en Markdown:

```markdown
---
name: estilo-sql
description: Una línea que dice qué hace y cuándo usarla.
---

# Título

Las instrucciones, paso a paso.
```

- **`name`**: el nombre de la habilidad. Usa el mismo que la carpeta, en minúsculas y con guiones.
- **`description`**: la parte más importante. El asistente ve el nombre y la descripción de todas sus habilidades, y por la descripción decide **cuándo** cargar el resto del archivo. Di qué hace y en qué situaciones se usa («úsala al escribir...», «cuando se pida corregir...»). Escríbela en una sola línea: `miyagi skills` solo muestra descripciones de una línea.
- **El cuerpo**: los pasos, como se los explicarías a un profesor en prácticas. Sé concreto: rutas de archivos, criterios, ejemplos, lo que no debe hacer.

## Un ejemplo completo: el estilo SQL del curso

En un curso de Introducción a SQL, quieres que todo el SQL que vean los alumnos (apuntes, enunciados, soluciones, preguntas de cuestionario, respuestas del foro) siga las mismas convenciones, y que al corregir se tengan en cuenta. Crea `.claude/skills/estilo-sql/SKILL.md` con esto:

````markdown
---
name: estilo-sql
description: Convenciones de estilo SQL de este curso (MariaDB) - úsala siempre que escribas o revises SQL que vayan a ver los alumnos (apuntes, enunciados, soluciones, preguntas de cuestionario, respuestas del foro) y al corregir entregas con SQL.
---

# Estilo SQL del curso

Todo el SQL que publiques en este curso sigue estas convenciones, sin excepciones. Los alumnos
aprenden imitando: un ejemplo con otro estilo les enseña ese otro estilo.

## Convenciones

1. Palabras reservadas en MAYÚSCULAS: `SELECT`, `FROM`, `WHERE`, `INSERT INTO`, `VARCHAR`,
   `PRIMARY KEY`, `NOT NULL`...
2. Nombres de tablas y columnas en snake_case y minúsculas, sin tildes ni eñes:
   `clientes`, `fecha_alta`, `id_cliente`. Tablas en plural, como en la base de datos `tienda`.
3. Una cláusula por línea (`SELECT`, `FROM`, `JOIN`, `WHERE`, `GROUP BY`, `HAVING`,
   `ORDER BY`), y las columnas de un `SELECT` largo, una por línea con cuatro espacios.
4. `INSERT` siempre con la lista de columnas explícita. Nunca `INSERT INTO alumno VALUES (...)`.
5. Nunca `SELECT *` en soluciones ni en apuntes, salvo en el primer ejemplo del tema 4, donde se
   explica qué hace y por qué no se usa.
6. `JOIN` siempre explícito con `ON`; nunca la coma en el `FROM` con la condición en el `WHERE`.
7. Alias de tabla cortos y con `AS`: `FROM clientes AS c`.
8. Cada sentencia termina en punto y coma.
9. Comentarios con `--` y un espacio, en español.

## Ejemplo de referencia

```sql
-- Pedidos de cada cliente, de más a menos
SELECT
    c.nombre AS cliente,
    COUNT(p.id_pedido) AS pedidos
FROM clientes AS c
LEFT JOIN pedidos AS p ON p.id_cliente = c.id_cliente
GROUP BY c.id_cliente, c.nombre
ORDER BY pedidos DESC;

INSERT INTO clientes (nombre, email, ciudad)
VALUES ('Ana Pérez', 'ana@ejemplo.com', 'La Laguna');
```

## Al escribir para los alumnos

- Antes de publicar cualquier bloque SQL, repásalo contra la lista de arriba.
- En el editor de Moodle, el SQL va en un bloque de código (`<pre>`), con su sangría.
- En las preguntas de cuestionario con código, el código cumple estas convenciones también
  en los distractores: que una opción sea incorrecta por su lógica, no por su estilo.

## Al corregir

- El estilo no cambia la nota salvo que la rúbrica de la actividad lo diga (la de la práctica
  final, sources/rubrica-practica-consultas.md, lo puntúa en «Legibilidad»). Si no lo dice,
  menciónalo solo en la retroalimentación, con la línea concreta y cómo quedaría.
- Un `INSERT` sin lista de columnas sí es un error, no de estilo: se rompe en cuanto la tabla
  cambia. Explícalo así en la retroalimentación.

## Lo que no debes hacer

- No reescribas el SQL que un alumno escribió en el foro: si respondes, muestra tu versión
  aparte.
- No cambies estas convenciones por tu cuenta. Si una no encaja en un caso, pregúntame.
````

El tutorial [Un curso de Introducción a SQL](../casos-de-uso/index.md) muestra esta habilidad en acción.

## Comprobar que la ve

Desde la terminal, en la carpeta del curso:

```bash
miyagi skills
```

Tu habilidad aparece en la lista con la marca `[propia]` y su descripción. Después, pruébala en el chat pidiéndole justo esa tarea, por ejemplo *«escribe tres ejemplos de JOIN para los apuntes del tema 4»*. Si la tarea encaja con la descripción, la cargará; si no, ajusta la descripción para que nombre esa situación.

Las habilidades se leen al arrancar miyagi: si tenías el chat abierto, ciérralo con `/exit` y vuelve a abrirlo (con `--continue` si quieres seguir la misma conversación).

## Lo que una habilidad puede y no puede hacer

Una habilidad le enseña **cómo** hacer algo con las herramientas que ya tiene: el navegador con tu Moodle, sus apuntes, la carpeta `drafts`, los documentos de `sources` y, si lo has activado, el probador de prácticas. **No le da herramientas nuevas.**

- **Puede**: fijar criterios, pasos, convenciones, plantillas y ejemplos; decirle qué documento de `sources` leer; apoyarse en otras habilidades (por ejemplo, «corrige con `grading-rubric`» o «pruébalo con `practice-testing`»).
- **No puede**: darle una terminal, permitirle escribir fuera de `knowledge`, `drafts` y `practice`, leer `config.json` o `.env`, saltarse las aprobaciones ni conectarlo a otros servicios.

Por eso una habilidad que diga «ejecuta este programa» solo funcionará si has activado el [probador de prácticas](practicas-docker.md), y entonces a través de él, dentro de Docker. Sin esa opción, el asistente te dirá que no puede.

## Otro ejemplo: corregir prácticas de Docker Compose

Una habilidad que se apoya en el probador de prácticas:

```markdown
---
name: corregir-practicas-docker
description: Corregir las prácticas de Docker Compose de este curso ejecutándolas - úsala al corregir cualquier tarea cuyo nombre empiece por "Práctica".
---

# Corregir una práctica de Docker Compose

1. Descarga los archivos de la entrega y guárdalos en sources/<práctica>/<id-del-alumno>/.
2. Con la habilidad practice-testing, pide que se ejecute `docker compose up -d` con esos
   archivos y que se compruebe que el servicio web responde en el puerto 8080 con la página
   del enunciado.
3. Aplica la rúbrica de la práctica (sources/rubricas/):
   - Arranca sin errores: 4 puntos.
   - Responde en el 8080 con lo pedido: 4 puntos.
   - Usa volúmenes para los datos, como pide el enunciado: 2 puntos.
4. En la retroalimentación, copia la línea exacta del error si algo no arranca.
```

## Consejos

- **Una habilidad, un oficio.** Mejor `estilo-sql` y `corregir-practicas-docker` por separado que una sola que lo mezcle todo: la descripción de cada una dice con claridad cuándo usarla.
- **Lo que vale siempre, en `instructions.md`.** Si no depende de la tarea («puntúa sobre 10»), no es una habilidad: es una [instrucción general](atajos-e-instrucciones.md).
- **Tus documentos, en `sources`.** Una habilidad puede remitir a tu rúbrica en vez de copiarla.
- **Nada de datos personales.** No escribas nombres de alumnos en una habilidad: es un archivo que el asistente lee cada vez que la usa.
