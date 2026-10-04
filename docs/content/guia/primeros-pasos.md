---
title: Primeros pasos
sidebar_position: 3
description: "Prepara una carpeta para tu curso con miyagi init, dale tu material y empieza tu primera conversación."
---

# Primeros pasos

Ya tienes miyagi [instalado](instalar.md). Ahora vas a conectarlo a un curso. Se hace una sola vez por curso.

:::tip[El recorrido completo, con capturas]
Esta página es el resumen. Si prefieres verlo todo hecho de verdad, paso a paso y con capturas de Moodle, sigue el tutorial [Un curso de Introducción a SQL](../casos-de-uso/index.md).
:::

## 1. Una carpeta para cada curso

Cada curso tiene su propia carpeta en tu ordenador. Ahí viven su configuración, tus documentos y los apuntes del asistente. No mezcles dos cursos en la misma carpeta.

En la terminal, crea la carpeta y entra en ella:

```bash
mkdir bases-de-datos
cd bases-de-datos
```

A partir de ahora, usa miyagi siempre desde esa carpeta. Si estás en otra, puedes indicarle la del curso con `--dir`, por ejemplo `miyagi chat --dir bases-de-datos`.

## 2. Preséntale el curso: `miyagi init`

```bash
miyagi init
```

Te hará unas preguntas, una detrás de otra:

- **¿Conectar un aula Moodle ahora?** Si dices que no, miyagi te ayuda igual con la programación, los temas y los materiales, sin abrir el navegador, y se salta las preguntas de Moodle de abajo. Puedes conectarla cuando quieras volviendo a ejecutar `miyagi init` en la misma carpeta.
- **URL de Moodle.** Lo más fácil: abre tu curso en el navegador y copia la dirección completa, algo como `https://moodle.micentro.es/course/view.php?id=42`. De ahí saca él solo la dirección de tu Moodle y el número del curso.
- **ID del curso.** Solo te lo pregunta si la dirección que pegaste no lo llevaba. Es el número que aparece tras `id=` en la dirección del curso.
- **Usuario con rol de profesor.** Tu usuario de Moodle. Si prefieres no guardarlo, déjalo en blanco: cada vez que empiece, te pedirá que inicies sesión tú en la ventana de Chrome.
- **Contraseña.** Solo si has puesto usuario. Se guarda en tu ordenador y el asistente nunca la ve: es Chrome quien la escribe en Moodle.
- **Etiqueta.** Un nombre para reconocer el curso, como `Bases de Datos 1.º DAW`. Si la dejas en blanco, usa la dirección de tu Moodle y el número del curso (sin aula, el nombre de la carpeta).
- **Descripción.** Opcional, para ti.
- **Tono de voz.** Cómo hablará a tus estudiantes en el foro, en la retroalimentación y en los avisos: sin preferencia (neutro), formal, cercano, o cercano y motivador.
- **Idioma.** El idioma en el que prefieres hablar con él, por ejemplo `español`. También decide el de sus menús y avisos si es español, inglés, francés o alemán. En blanco, te responde en el idioma en que le escribas.
- **¿Probar prácticas en Docker?** Solo tiene sentido en cursos de informática y si tienes Docker instalado. Si no lo sabes, di que no: se puede activar más tarde (lo tienes en [Prácticas en Docker](../avanzado/practicas-docker.md)).
- **¿Crear `instructions.md`?** Un archivo donde escribir las instrucciones que quieres que tenga siempre en cuenta, como «puntúa sobre 10». Puedes crearlo después a mano.

Si has conectado un aula, al final te propone **explorar ahora tu Moodle**. Te recomendamos decir que sí: entra en tu curso, mira qué tipos de actividad y de pregunta admite tu centro y cómo se pueden calcular las notas, y lo apunta. No crea ni cambia nada. Si algo falla (una contraseña mal escrita, por ejemplo), el curso queda configurado igual y puedes repetirlo cuando quieras con `miyagi explore`.

Si es la primera vez que usas miyagi en este ordenador, en este momento te pedirá [conectar tu cuenta de Claude](instalar.md).

Al terminar, tu carpeta tendrá esto:

```text
bases-de-datos/
  config.json        tu Moodle y tu usuario (solo en tu ordenador; el asistente no puede leerlo)
  instructions.md    tus instrucciones fijas (si dijiste que sí)
  sources/           aquí dejas TUS documentos: programación, rúbricas, soluciones
  knowledge/         aquí escribe ÉL: sus apuntes del curso
  drafts/            lo que prepara para Moodle antes de subirlo
```

## 3. Dale tu material

Este paso es opcional, pero marca la diferencia. Copia en la carpeta `sources` lo que tengas: la programación, las rúbricas, los enunciados con su solución, tus criterios («las entregas tarde, un 20 % menos»). Sirven documentos PDF, Word, PowerPoint (también lee las notas del orador), Excel, texto e incluso fotos de apuntes a mano o de diapositivas.

Después, en la terminal:

```bash
miyagi ingest
```

Lee tus documentos sin abrir Moodle y los incorpora a sus apuntes: un resumen de cada uno, enlazado con el tema o la actividad a la que pertenece. Al corregir, **tus criterios mandan** sobre los suyos.

Cuando añadas documentos nuevos, vuelve a ejecutarlo: solo procesa los que aún no tenía. También puedes pedírselo desde el chat con `/knowledge:ingest`.

## 4. Tu primera conversación

```bash
miyagi chat
```

El chat ocupa toda la ventana de la terminal. El asistente te saluda con lo que ya sabe del curso, leyendo sus apuntes, sin abrir todavía el navegador. Si aún no sabe nada, te propone explorar el curso o leer tus documentos. Chrome se abre solo cuando lo que le pidas necesite entrar en Moodle.

Un buen primer mensaje:

```text
/miyagi:orient
```

Busca la guía del curso, la página de bienvenida o las instrucciones generales, y apunta cómo se evalúa, los plazos y por dónde se comunica la clase. A partir de ahí, pídele lo que necesites con tus palabras.

Para salir, escribe `/exit`. No hay nada que guardar: todo se va guardando solo.

## Siguiente paso

- [El chat](chat.md): cómo aprobar, rechazar, interrumpir y retomar una conversación.
- [Qué pedirle](ideas.md): ideas para empezar, de menos a más.
