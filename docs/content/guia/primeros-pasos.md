---
title: Primeros pasos
sidebar_position: 3
description: "Prepara una carpeta para tu curso con miyagi init, dale tu material y empieza tu primera conversación."
---

# Primeros pasos

Ya tienes miyagi [instalado](instalar.md). Ahora vas a preparar una asignatura y, si quieres, conectarla a tu curso de Moodle. Se hace una sola vez por asignatura.

:::tip[El recorrido completo, con capturas]
Esta página es el resumen. Si prefieres verlo todo hecho de verdad, paso a paso y con capturas de Moodle, sigue el tutorial [Un curso de Introducción a SQL](../casos-de-uso/index.md).
:::

## 1. Una asignatura para cada curso

Cada asignatura que preparas con miyagi tiene su propia carpeta, con su configuración, tus documentos y los apuntes del asistente. No tienes que crearla ni recordar dónde está: `miyagi init` la guarda dentro de la carpeta de miyagi (`~/.miyagi/workspaces/<nombre>/`, en Windows `C:\Users\<tu-usuario>\.miyagi\workspaces\`), fuera de las carpetas que se sincronizan con la nube, y la apunta en tu lista de asignaturas.

Después la abres por su nombre desde cualquier sitio, por ejemplo `miyagi chat -w bases-de-datos`. Con `miyagi` a secas te pregunta con cuál quieres trabajar. `miyagi workspaces` te dice cuáles tienes y en qué carpeta está cada una.

Si prefieres una carpeta tuya, créala con `miyagi init --dir <carpeta>`. También queda en la lista, y dentro de esa carpeta miyagi la usa sin que se lo digas.

## 2. Preséntale el curso: `miyagi init`

<Terminal>{`$ miyagi init`}</Terminal>

Te hará unas preguntas, una detrás de otra:

- **Nombre de la asignatura.** Un nombre para reconocerla, como `Bases de Datos 1.º DAW`. Es también el que usarás con `-w`.
- **Descripción.** Opcional, para ti.
- **Tono de voz.** Cómo hablará a tus estudiantes en el foro, en la retroalimentación y en los avisos: sin preferencia (neutro), formal, cercano, o cercano y motivador.
- **Idioma.** El idioma en el que prefieres hablar con él, por ejemplo `español`. También decide el de sus menús y avisos si es español, inglés, francés o alemán. En blanco, te responde en el idioma en que le escribas.
- **¿Crear `instructions.md`?** Un archivo donde escribir las instrucciones que quieres que tenga siempre en cuenta, como «puntúa sobre 10». Puedes crearlo después a mano.
- **¿Conectar un aula Moodle ahora?** Por defecto, no: miyagi te ayuda igual con la programación, los temas y los materiales. Puedes conectarla cuando quieras con `miyagi init -w <nombre>`, o en la aplicación desde **Tu aula** ([Tu aula](../avanzado/navegador.md#tu-aula)). Si dices que sí, te pide:
  - **URL de Moodle.** Lo más fácil: abre tu curso en el navegador y copia la dirección completa, algo como `https://moodle.micentro.es/course/view.php?id=42`. De ahí saca él solo la dirección de tu Moodle y el número del curso.
  - **ID del curso.** Solo si la dirección que pegaste no lo llevaba: el número tras `id=`.

  No te pide usuario ni contraseña. miyagi instala la [extensión](../avanzado/extensiones.md) **moodle-teacher**, que trabaja en Moodle con tu propia sesión: la primera vez que la necesita abre una ventana del navegador para que entres tú, y nunca ve tu contraseña. Por defecto puede cambiar tu curso, siempre pidiéndote permiso antes, y tus alumnos le llegan con un alias, nunca con su nombre.

Si has conectado un aula, al final te propone **explorar ahora tu Moodle**. Te recomendamos decir que sí: entra en tu curso, mira qué tipos de actividad y de pregunta ve en él y cómo se calculan las notas, y lo apunta. No crea ni cambia nada. Si algo falla (no llegas a iniciar sesión en la ventana, por ejemplo), la asignatura queda configurada igual y puedes repetirlo cuando quieras con `miyagi explore`.

Si es la primera vez que usas miyagi en este ordenador, en este momento te pedirá [conectar tu cuenta de Claude](instalar.md).

Al terminar, la carpeta de tu asignatura tendrá esto:

```text
bases-de-datos/
  config.json        tu asignatura y la dirección de tu Moodle (el asistente no puede leerlo)
  instructions.md    tus instrucciones fijas (si dijiste que sí)
  sources/           aquí dejas TUS documentos: programación, rúbricas, soluciones
  knowledge/         aquí escribe ÉL: sus apuntes del curso
  drafts/            lo que prepara para Moodle antes de subirlo
```

## 3. Dale tu material

Este paso es opcional, pero marca la diferencia. Copia en la carpeta `sources` lo que tengas: la programación, las rúbricas, los enunciados con su solución, tus criterios («las entregas tarde, un 20 % menos»). Sirven documentos PDF, Word, PowerPoint (también lee las notas del orador), Excel, texto e incluso fotos de apuntes a mano o de diapositivas.

Después, en la terminal:

<Terminal>{`$ miyagi ingest`}</Terminal>

Lee tus documentos sin abrir Moodle y los incorpora a sus apuntes: un resumen de cada uno, enlazado con el tema o la actividad a la que pertenece. Al corregir, **tus criterios mandan** sobre los suyos.

Cuando añadas documentos nuevos, vuelve a ejecutarlo: solo procesa los que aún no tenía. También puedes pedírselo desde el chat con `/knowledge:ingest`.

## 4. Tu primera conversación

<Terminal>{`$ miyagi chat`}</Terminal>

El chat ocupa toda la ventana de la terminal. El asistente te saluda con lo que ya sabe del curso, leyendo sus apuntes, sin entrar todavía en Moodle. Si aún no sabe nada, te propone explorar el curso o leer tus documentos. La primera vez que lo que le pidas necesite entrar en Moodle, se abre una ventana del navegador para que inicies sesión tú; después trabaja sin ventana.

Un buen primer mensaje:

```text
/miyagi:orient
```

Busca la guía del curso, la página de bienvenida o las instrucciones generales, y apunta cómo se evalúa, los plazos y por dónde se comunica la clase. A partir de ahí, pídele lo que necesites con tus palabras.

Para salir, escribe `/exit`. No hay nada que guardar: todo se va guardando solo.

## Siguiente paso

- [El chat](chat.md): cómo aprobar, rechazar, interrumpir y retomar una conversación.
- [Qué pedirle](ideas.md): ideas para empezar, de menos a más.
