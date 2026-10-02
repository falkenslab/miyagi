---
title: ¿Qué es miyagi?
sidebar_position: 1
description: "Un asistente que trabaja en tu curso de Moodle como lo harías tú y te pide permiso antes de publicar nada."
---

# ¿Qué es miyagi?

miyagi es un asistente que te ayuda a llevar tu curso de Moodle. Entra con tu cuenta de profesor en una ventana de Chrome y trabaja como lo harías tú: **corrige entregas**, **responde en el foro**, **crea o revisa contenido** y te **resume cómo va la clase**.

Tú hablas con él en la terminal, con tus palabras, como hablarías con un compañero. Y **nada que vean tus estudiantes se publica sin tu permiso**: antes de guardar una nota, responder en el foro o publicar un recurso, te enseña lo que va a hacer y espera tu sí.

![miyagi en el chat: encuentra en el foro una duda de Marcos y pide permiso antes de publicar la respuesta](/img/chat.png)

## Qué hace por ti

- **Corrige con tu rúbrica.** Aplica tus criterios igual para todos y escribe una retroalimentación útil. Te enseña cada nota antes de guardarla.
- **Atiende el foro.** Encuentra las dudas sin responder, decide cuándo intervenir y contesta en el tono que elegiste. Apunta las dudas que se repiten.
- **Crea contenido.** Apuntes, tareas con su rúbrica, cuestionarios, glosarios, talleres de coevaluación, temas enteros e incluso un curso completo.
- **Te ayuda con la programación didáctica.** La escribe contigo y comprueba que el aula de Moodle está de acuerdo con ella.
- **Sigue la clase.** Te dice quién se está quedando atrás y audita el curso con recomendaciones ordenadas por prioridad.
- **Recuerda tu curso.** Toma apuntes mientras trabaja (tus criterios, las rúbricas, las dudas del foro, cómo evoluciona la clase) y en la siguiente sesión parte de ahí.

## Para quién es

Para profesores que llevan un curso en Moodle y quieren quitarse de encima el trabajo repetitivo sin perder el control de lo que ven sus alumnos. No hace falta saber programar: se instala pegando una línea en la terminal y después se usa conversando.

## Qué necesitas

- **Google Chrome**, que es el navegador con el que entra en Moodle.
- **Node.js** 20 o posterior, el programa que hace funcionar a miyagi.
- **Una suscripción de Claude Pro o Max**. miyagi es gratuito y de código abierto (licencia MIT); lo que hace funcionar al asistente es tu suscripción de Claude.
- **Un curso de Moodle en el que tengas rol de profesor**. No hay que instalar nada en el servidor de tu centro: usa Moodle desde el navegador, como tú.

## Cómo funciona, en tres pasos

1. **Lo instalas.** Una línea en la terminal, en Windows, Mac o Linux. Lo tienes en [Instalar](instalar.md).
2. **Le presentas tu curso.** `miyagi init` te pregunta la dirección del curso, tu cuenta y el tono, y puede explorar tu Moodle (sin tocar nada) para saber qué admite. Si le dejas tu programación, tus rúbricas o tus criterios, los tiene en cuenta. Lo tienes en [Primeros pasos](primeros-pasos.md).
3. **Se lo pides y apruebas.** Conversas con él en el [chat](chat.md) o le encargas una tarea de una sola orden. Cuando algo vaya a llegar a tus alumnos, te lo enseña y espera tu sí.

## Por dónde seguir

- [Instalar](instalar.md): los requisitos y la instalación paso a paso.
- [Primeros pasos](primeros-pasos.md): conectarlo a tu curso y tu primera conversación.
- [Un curso de Introducción a SQL, paso a paso](../casos-de-uso/index.md): un recorrido completo con capturas reales, desde el curso vacío hasta corregir y atender el foro.
- [Qué pedirle](ideas.md): ideas de uso, de lo más sencillo a lo más ambicioso.
- [Preguntas frecuentes](preguntas-frecuentes.md).
