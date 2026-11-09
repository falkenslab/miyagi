---
title: ¿Qué es miyagi?
sidebar_position: 1
description: "Un asistente que prepara tu asignatura contigo y, si conectas tu curso de Moodle, trabaja en él y te pide permiso antes de publicar nada."
---

# ¿Qué es miyagi?

miyagi es un asistente para docentes. Te ayuda a preparar tu asignatura (programación, temas, materiales, rúbricas, cuestionarios) y, si conectas tu curso de Moodle, también a llevarlo: **corrige entregas**, **responde en el foro**, **crea o revisa contenido** y te **resume cómo va la clase**. En Moodle trabaja con tu propia sesión de profesor, a través de la extensión moodle-teacher.

Hablas con él con tus palabras, como hablarías con un compañero. Y **nada que vean tus estudiantes se publica sin tu permiso**: antes de guardar una nota, responder en el foro o publicar un recurso, te enseña lo que va a hacer y espera tu sí.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-navegador-moodle.webp" alt="La aplicación de escritorio de miyagi: a la izquierda los iconos, las conversaciones de la asignatura Introducción a SQL y el chat; a la derecha, en una pestaña, el curso de Moodle abierto con la sesión del profesor.">La aplicación de escritorio de miyagi: la conversación y, al lado, tu curso de Moodle abierto en su navegador integrado.</Shot>

## Tres versiones, una sola forma de trabajar {#tres-versiones}

miyagi se usa de tres maneras. Todas abren las mismas asignaturas y te piden permiso igual:

- **La aplicación de escritorio** es la versión principal y la que te recomendamos. Se instala en Windows con un doble clic, sin terminal y sin Node.js, y es la más completa: tiene su propia barra de ventana y un navegador integrado para tener Moodle al lado de la conversación.
- **La versión web** es la misma página, abierta en una pestaña de tu navegador con `miyagi web`. Sirve en Windows, Mac y Linux.
- **La terminal** es la de siempre: `miyagi chat` y los encargos de una sola orden, para quien prefiere el teclado.

¿No sabes cuál? Te ayudamos a [elegir versión](elegir-version.md). Si tienes Windows, empieza por la [aplicación de escritorio](escritorio.md).

## Qué hace por ti

- **Corrige con tu rúbrica.** Aplica tus criterios igual para todos y escribe una retroalimentación útil. Te enseña cada nota antes de guardarla. Las entregas de texto le llegan directamente; las que son un archivo, con la protección de datos por defecto, no: te lo explicamos en el [tutorial](/casos-de-uso/corregir/).
- **Atiende el foro.** Encuentra las dudas sin responder, decide cuándo intervenir y contesta en el tono que elegiste. Apunta las dudas que se repiten.
- **Crea contenido.** Apuntes, tareas con su rúbrica, cuestionarios, glosarios, talleres de coevaluación, temas enteros e incluso un curso completo.
- **Te ayuda con la programación didáctica.** La escribe contigo y comprueba que el aula de Moodle está de acuerdo con ella.
- **Sigue la clase.** Te dice quién se está quedando atrás y audita el curso con recomendaciones ordenadas por prioridad.
- **Recuerda tu curso.** Toma apuntes mientras trabaja (tus criterios, las rúbricas, las dudas del foro, cómo evoluciona la clase) y en la siguiente conversación parte de ahí.

## Para quién es

Para profesores que llevan un curso en Moodle y quieren quitarse de encima el trabajo repetitivo sin perder el control de lo que ven sus alumnos. No hace falta saber programar: en Windows se instala con un doble clic y después se usa conversando.

El aula es opcional. Sin conectar Moodle, miyagi te ayuda igualmente con la programación, los temas y los materiales.

## Qué necesitas

- **Una suscripción de Claude Pro o Max**, o una clave de API. miyagi es gratuito y de código abierto (licencia MIT); lo que hace funcionar al asistente es Claude.
- **La aplicación de Windows** (Windows de 64 bits) o, para la versión web y la terminal, **Node.js** 20 o posterior.
- **Un navegador** como Chrome o Edge, para iniciar sesión en Moodle.
- **Un curso de Moodle en el que tengas rol de profesor**, si quieres que trabaje en tu aula. No hay que instalar nada en el servidor de tu centro: trabaja con tu sesión, como tú.

## Cómo funciona, en tres pasos

1. **Lo instalas.** En Windows, un instalador. En Mac y Linux, una línea en la terminal. Lo tienes en [Instalar](instalar.md).
2. **Creas tu asignatura.** Le das un nombre, el tono y el idioma y, si quieres, la dirección de tu curso de Moodle (nunca tu contraseña: inicias sesión tú en una ventana del navegador). Si le dejas tu programación, tus rúbricas o tus criterios, los tiene en cuenta. Lo tienes en [Primeros pasos](primeros-pasos.md).
3. **Se lo pides y apruebas.** Conversas con él o le encargas una tarea. Cuando algo vaya a llegar a tus alumnos, te lo enseña y espera tu sí.

## Por dónde seguir

- [Elige tu versión](elegir-version.md): desktop, web o terminal, qué necesita cada una.
- [La aplicación de escritorio](escritorio.md): desde la instalación hasta la última parte de la ventana.
- [Instalar](instalar.md): los requisitos y la instalación paso a paso.
- [Un curso de Introducción a SQL, paso a paso](/casos-de-uso/): un recorrido completo con capturas reales, de la asignatura vacía a corregir y atender el foro.
- [Qué pedirle](ideas.md): ideas de uso, de lo más sencillo a lo más ambicioso.
- [Preguntas frecuentes](preguntas-frecuentes.md).
