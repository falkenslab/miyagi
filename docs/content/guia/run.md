---
title: Encargos de una sola orden
sidebar_position: 8
description: "Cómo encargarle a miyagi una tarea concreta, o una pasada por todo el curso, sin conversar: miyagi run y sus modos."
---

# Encargos de una sola orden

El chat es para conversar. Si ya sabes lo que quieres y no necesitas ir hablando, puedes encargárselo de una vez con `miyagi run`, desde la carpeta del curso.

## Una tarea concreta: `--task`

Escribe el encargo entre comillas:

```bash
miyagi run --task "Corrige la Tarea 2"
miyagi run --task "Revisa el foro y responde las dudas sin contestar"
miyagi run --task "Crea un cuestionario de 10 preguntas sobre el tema 3"
miyagi run --task "Audita el curso y detecta problemas"
miyagi run --task "Construye un curso de introducción a HTML5 y CSS3 para 1.º de DAW"
```

Hace solo eso, con las mismas reglas que en el chat. También vale un atajo: `miyagi run --task "/miyagi:build-course Introducción a Docker, 3 temas, para FP"`.

## Una pasada por todo el curso

```bash
miyagi run
```

Sin `--task`, recorre el curso de principio a fin: corrige las entregas pendientes, atiende el foro, revisa o añade contenido si hace falta y termina con un resumen de cómo va la clase.

## Cuánto quieres supervisarlo

Antes de empezar te pregunta en qué modo quieres que trabaje:

| Modo | Qué significa |
| --- | --- |
| `guided` (recomendado) | Trabaja solo, pero te pide permiso antes de publicar cualquier cosa que vean tus estudiantes. |
| `interactive` | Te pide confirmación antes de cada paso. Útil para ver cómo trabaja. |
| `autonomous` | No pregunta nada: publica sin pedirte permiso. Solo para cursos de prueba, y necesita tu usuario y contraseña guardados. |

Para no tener que elegirlo cada vez, pásalo en la orden:

```bash
miyagi run --mode guided --task "Corrige la Tarea 2"
```

:::caution[El modo autonomous no pide permiso]
En `autonomous` nadie revisa lo que publica: notas, respuestas del foro, contenido nuevo. Úsalo solo en un curso de pruebas o cuando confíes plenamente en lo que va a hacer.
:::

## Mientras trabaja

Verás en la terminal lo que va haciendo, y en la ventana de Chrome cada página que abre. Cuando necesite tu permiso, te mostrará el mismo panel que en el chat: **Sí**, **No** o **Parar**.

Si quieres cortarlo, pulsa `Ctrl+C`: lo interrumpe y cierra la sesión con normalidad. Si lo pulsas otra vez, sale sin esperar. Lo que estuviera haciendo en ese momento puede quedar a medias (una nota sin guardar, por ejemplo); en la próxima sesión puedes pedirle que lo retome.

## Otras opciones

- `--headless`: trabaja sin mostrar la ventana de Chrome. Necesita tu usuario y contraseña guardados.
- `--plain`: muestra el progreso como texto simple, sin animaciones ni paneles. Útil si guardas la salida en un archivo.

Todas las órdenes y opciones están en la [Referencia](referencia.md).
