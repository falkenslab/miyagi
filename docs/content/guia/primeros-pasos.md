---
title: Primeros pasos
sidebar_position: 7
description: "Prepara tu primera asignatura en la aplicación de escritorio, en la versión web o en la terminal, dale tu material y empieza tu primera conversación."
---

# Primeros pasos

Ya tienes miyagi [instalado](instalar.md). Ahora vas a preparar una asignatura y, si quieres, conectarla a tu curso de Moodle. Se hace una sola vez por asignatura.

Esta página cuenta primero el camino de la **aplicación de escritorio**, y al final el de la versión web y la terminal, que hacen lo mismo con otras órdenes. Si prefieres verlo todo hecho de verdad, sigue el tutorial [Un curso de Introducción a SQL](/casos-de-uso/).

## 1. Crea tu asignatura

En la aplicación, sin ninguna asignatura todavía, te sale el formulario de **Nueva asignatura**. Con alguna ya creada, ábrelo desde el selector de arriba de la columna de conversaciones. Te pregunta:

- **Nombre de la asignatura.** Un nombre para reconocerla, como `Bases de Datos 1.º DAW`.
- **Descripción.** Opcional, para ti.
- **Idioma.** En el que prefieres que te hable. En blanco, te responde en el idioma en que le escribas. Si es español, inglés, francés o alemán, también decide el de sus menús y avisos.
- **Tono de voz.** Cómo hablará a tus estudiantes en el foro, en la retroalimentación y en los avisos: sin preferencia (neutro), formal, cercano, o cercano y motivador.
- **Vincular ya un aula de Moodle.** Puedes dejarlo para después.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-nueva-asignatura.webp" alt="El formulario Nueva asignatura relleno, con nombre, descripción, idioma, tono y la casilla Vincular ya un aula de Moodle marcada.">Crear una asignatura en la aplicación.</Shot>

La asignatura se guarda en la carpeta de miyagi (`~/.miyagi/workspaces/<nombre>/`, en Windows `C:\Users\<tu-usuario>\.miyagi\workspaces\`), fuera de las carpetas que se sincronizan con la nube. Con **Elegir carpeta** puedes dejarla en otra.

Dentro quedará esto:

```text
bases-de-datos/
  config.json        tu asignatura y la dirección de tu Moodle (el asistente no puede leerlo)
  instructions.md    tus instrucciones fijas, si las creas
  sources/           aquí dejas TUS documentos: programación, rúbricas, soluciones
  knowledge/         aquí escribe ÉL: sus apuntes del curso
  drafts/            lo que prepara para Moodle antes de subirlo
```

## 2. Vincula tu aula (opcional) {#vincular}

En **Tu aula**, pulsa **Vincular un aula** y pega la dirección de tu curso, la que ves en el navegador, algo como `https://moodle.micentro.es/course/view.php?id=42`. De ahí saca la dirección de tu Moodle y el número del curso. Te lo explicamos con capturas en [Vincular tu aula de Moodle](escritorio.md#vincular).

No te pide usuario ni contraseña. miyagi instala la [extensión](/avanzado/extensiones/) **moodle-teacher**, que trabaja en Moodle con tu propia sesión: la primera vez que entra en el curso se abre una ventana del navegador para que inicies sesión tú, y nunca ve tu contraseña. Por defecto puede cambiar tu curso, siempre pidiéndote permiso antes, y tus alumnos le llegan con un alias, nunca con su nombre.

Sin aula, miyagi te ayuda igual con la programación, los temas y los materiales.

## 3. Dale tu material

Este paso es opcional, pero marca la diferencia. En la vista **Memoria**, pestaña **Fuentes**, arrastra lo que tengas: la programación, las rúbricas, los enunciados con su solución, tus criterios («las entregas tarde, un 20 % menos»). Sirven documentos PDF, Word, PowerPoint (también lee las notas del orador), Excel, texto e incluso fotos de apuntes a mano o de diapositivas. Después pulsa **Pedir a miyagi que los incorpore**.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/tutorial-02-fuentes.webp" alt="La vista Fuentes: la zona para arrastrar documentos, los botones Elegir archivos, Abrir la carpeta y Pedir a miyagi que los incorpore, y la lista de archivos con su estado.">Tus documentos y si ya están incorporados.</Shot>

Lee tus documentos sin abrir Moodle y los incorpora a sus apuntes: un resumen de cada uno, enlazado con el tema o la actividad a la que pertenece. Al corregir, **tus criterios mandan** sobre los suyos.

Cuando añadas documentos nuevos, vuelve a pedírselo: solo procesa los que aún no tenía.

## 4. Tu primera conversación

Pulsa **Hablar con miyagi** en **Hoy**, o **Nueva conversación**. Te saluda con lo que ya sabe del curso, sin entrar todavía en Moodle. Si aún no sabe nada, te propone explorar el curso o leer tus documentos.

Un buen primer mensaje, si conectaste el aula:

<Prompt>{`/miyagi:orient`}</Prompt>

Busca la guía del curso, la página de bienvenida o las instrucciones generales, y apunta cómo se evalúa, los plazos y por dónde se comunica la clase. A partir de ahí, pídele lo que necesites con tus palabras.

No hay nada que guardar: todo se va guardando solo.

## En la versión web o en la terminal

La [versión web](web.md) es la misma página: `miyagi web` y sigue los mismos pasos.

En la [terminal](terminal.md), estos son los equivalentes.

### Crear la asignatura: `miyagi init`

<Terminal>{`$ miyagi init`}</Terminal>

Te hace estas preguntas, una detrás de otra:

- **Nombre de la asignatura**, que es también el que usarás con `-w`.
- **Descripción**, opcional.
- **Tono de voz**.
- **Idioma**.
- **¿Crear `instructions.md`?** Un archivo donde escribir las instrucciones que quieres que tenga siempre en cuenta, como «puntúa sobre 10». Puedes crearlo después a mano.
- **¿Conectar un aula Moodle ahora?** Por defecto, no. Puedes conectarla cuando quieras con `miyagi init -w <nombre>`. Si dices que sí, te pide:
  - **URL de Moodle.** Lo más fácil: copia la dirección completa de tu curso. De ahí saca la dirección de tu Moodle y el número del curso.
  - **ID del curso.** Solo si la dirección que pegaste no lo llevaba: el número tras `id=`.

Si has conectado un aula, al final te propone **explorar ahora tu Moodle**. Te recomendamos decir que sí: entra en tu curso, mira qué tipos de actividad y de pregunta ve en él y cómo se calculan las notas, y lo apunta. No crea ni cambia nada. Si algo falla (no llegas a iniciar sesión en la ventana, por ejemplo), la asignatura queda configurada igual y puedes repetirlo cuando quieras con `miyagi explore`.

Si es la primera vez que usas miyagi en este ordenador, en este momento te pedirá [conectar tu cuenta de Claude](instalar.md#conectar-tu-cuenta-de-claude).

Después la abres por su nombre desde cualquier sitio, por ejemplo `miyagi chat -w bases-de-datos`. Con `miyagi` a secas te pregunta con cuál quieres trabajar, y `miyagi workspaces` te dice cuáles tienes y en qué carpeta está cada una. Si prefieres una carpeta tuya, créala con `miyagi init --dir <carpeta>`: también queda en la lista, y dentro de esa carpeta miyagi la usa sin que se lo digas.

### Darle tu material: `miyagi ingest`

Copia tus documentos en la carpeta `sources` de la asignatura y:

<Terminal>{`$ miyagi ingest`}</Terminal>

También puedes pedírselo desde el chat con `/knowledge:ingest`.

### Conversar: `miyagi chat`

<Terminal>{`$ miyagi chat`}</Terminal>

Para salir, escribe `/exit`. No hay nada que guardar: todo se va guardando solo.

## Siguiente paso

- [El chat](chat.md): cómo aprobar, rechazar, interrumpir y retomar una conversación.
- [Qué pedirle](ideas.md): ideas para empezar, de menos a más.
