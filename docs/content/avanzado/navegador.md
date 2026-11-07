---
title: miyagi en el navegador
sidebar_position: 11
description: "miyagi web: el chat de miyagi en tu navegador, solo en tu ordenador, con una llave en la dirección; qué protege y qué no si lo abres desde fuera."
---

# miyagi en el navegador

Además del chat en la terminal, miyagi tiene una página: la misma conversación, con sus paneles de aprobación, las conversaciones anteriores, el modo y tus asignaturas, en una ventana del navegador. Es la misma página que abre la aplicación de escritorio.

## Abrirla

<Terminal>{`$ miyagi web`}</Terminal>

miyagi abre la asignatura que usaste por última vez (o la que le digas con `-w <nombre>` o `--dir <ruta>`) y te enseña una dirección como esta:

```
http://127.0.0.1:52341/?token=…
```

Ábrela en tu navegador. `Ctrl+C` en la terminal lo cierra. Con `--port <n>` eliges el puerto. Sin ninguna asignatura todavía, la página te deja crear una.

## Qué ves

A la izquierda, la **barra lateral**, ordenada como la de la app de Claude: **Nueva conversación**, tu asignatura (para cambiar a otra o crear una nueva, y si tiene aula), **Hoy** y **Tu aula**, las vistas de la asignatura y de su memoria y las **Extensiones**, tus conversaciones **Recientes**, cada una con la fecha de su última actividad y tus primeras palabras en ella (las que solo tienen el saludo de miyagi no se guardan en la lista; la abierta, resaltada mientras estás en ella y con un punto cuando estás en otra vista; pulsa una para retomarla) y, abajo, las versiones y el tema claro, oscuro o el del sistema. En una pantalla estrecha, como la de un móvil, se abre con el botón ☰, y las vistas de la asignatura, de su memoria y de miyagi se pliegan en una línea que las despliega.

Desde el selector de asignaturas (o la pantalla de inicio, si no tienes ninguna):

- **Nueva asignatura** te hace las preguntas de `miyagi init`: nombre, descripción, idioma, tono, y si quieres vincular ya un aula. Va a la carpeta de miyagi, salvo que pulses **Elegir carpeta** y le des una vacía o nueva (por ejemplo, en tu nube).
- **Abrir una carpeta** añade a tu lista una asignatura que ya tienes en el disco, por ejemplo copiada de un compañero.
- Una asignatura cuya carpeta se movió aparece como no encontrada: **Localizar** la apunta a su carpeta nueva y **Olvidar** la quita de la lista sin tocar su carpeta.

Donde te pide una carpeta (la de una asignatura nueva, **Abrir una carpeta**, **Localizar** o un repositorio de extensiones en tu disco), **📁 Examinar…** abre el diálogo de carpetas de tu sistema: la que elijas rellena el campo, que puedes seguir cambiando.

Son las mismas asignaturas que ves en la terminal con `miyagi workspaces`.

Arriba, en cada vista, su título; en la conversación, el título de la conversación y el botón ✎ para empezar una nueva.

Abajo, mientras miyagi o la propia página están haciendo algo, la **barra de estado** lo dice en cualquier vista: al abrir la asignatura, que está leyendo lo que sabe de ella para saludarte; durante un turno, qué está haciendo y cuánto lleva, con **Ir a la conversación**; una aprobación o una pregunta que te espera, resaltada; y lo que hace la página, como instalar una extensión o conectar el aula. Lo que tiene que esperar a que miyagi termine se queda desactivado y, al pasar por encima, te dice por qué; las vistas se pueden seguir mirando mientras tanto.

En la conversación:

- **Una conversación nueva** te saluda y te propone lo que pides a menudo: construir una unidad, incorporar tus documentos (con cuántos faltan) y, con el aula, corregir lo pendiente y revisar el foro; sin aula, vincularla. miyagi recibe lo que pulses como si lo escribieras.
- **El chat**: lo que escribes, a la derecha; lo que responde miyagi, a todo el ancho, con **Copiar** y lo que tardó debajo; y sus acciones plegadas en una línea tenue (ábrela para ver cada una). Cuando le encarga algo a uno de sus ayudantes, como el investigador, debajo ves qué está haciendo el ayudante en cada momento, cuánto lleva y cuántas acciones ha hecho. Si subes a leer algo anterior, el botón ↓ te devuelve al final. Lo que miyagi nombra de tu asignatura (un documento de tus fuentes, un material, una página de su memoria, la programación o lo que hay en el horno) es un enlace que abre su vista en ese elemento; lo que no existe se queda como texto. Si seleccionas un trozo de una respuesta, un menú pequeño te ofrece **Investigar esto**, **Preguntas sobre esto** y **Citar en el chat**.
- **El cuadro para escribir**: `Intro` envía, `Mayús+Intro` salta de línea, `Esc` para a miyagi mientras trabaja (también el botón ■), `/` abre los atajos y `↑`/`↓` recorren lo que ya escribiste. Debajo del texto, **＋** (añadir un archivo a las fuentes, las **Capacidades** y el catálogo de todo lo que miyagi sabe hacer, agrupado en Día a día, Crear, Planificar, Memoria y Tu aula; lo que necesita el aula sale apagado sin ella, y lo que necesita un dato, como «¿Sobre qué tema?», te lo pide en el mismo menú) y el **modo** (también con `Mayús+Tab`). Las tareas del turno se pliegan encima en una línea con la que está en curso; púlsala para ver la lista.
- **Las aprobaciones y las preguntas** de miyagi ocupan el sitio del cuadro para escribir hasta que respondes, igual que en la terminal, y la conversación sigue a la vista encima por si quieres releer algo. En el móvil, como una hoja que sube desde abajo. Si estabas en otra vista, la página vuelve a la conversación.
- **Archivos para las fuentes**: desde **＋**, o arrastrándolos al cuadro para escribir, van a `sources/` de la asignatura.

La primera vez, si no has iniciado sesión en Claude, la página te ofrece dos caminos:

- **Iniciar sesión con tu cuenta de Claude.** Se abre en tu navegador la página de Anthropic. Inicias sesión, autorizas y, si te da un código, lo pegas en la casilla de miyagi. La sesión la guarda Claude Code, que va dentro de miyagi; miyagi nunca la ve.
- **Usar una clave de API** (`sk-ant-api…`, de [console.anthropic.com](https://console.anthropic.com/settings/keys)), que se paga por uso. Se guarda en `~/.miyagi/config.json`.

Un token de suscripción (`sk-ant-oat…`) ya no se puede pegar: las condiciones de Anthropic no dejan que miyagi lo guarde. Si una versión anterior lo había guardado, miyagi lo borra y te pide iniciar sesión una vez.

## Tu asignatura, de un vistazo

Estas vistas solo enseñan lo que miyagi sabe y tiene preparado: no cambian nada por su cuenta. Sus botones mandan a la conversación el comando de miyagi que corresponde, como si lo escribieras tú, y miyagi trabaja allí con las mismas aprobaciones de siempre. En la conversación lo ves con su nombre (por ejemplo, ❓ Hacer un cuestionario · Tema 2) y, debajo y en pequeño, el comando que se envió.

Cada tema, material, documento de tus fuentes, página de su memoria, actividad del horno y la programación tiene su botón **⋯** con lo que miyagi puede hacer con él: en un tema, construir la unidad, hacer un cuestionario, investigar y alinear el aula; en un cuestionario, el examen en papel; en un material, publicarlo; en una fuente, incorporarla o sacar preguntas de ella. Todos acaban con **Preguntar a miyagi sobre esto**, que te deja el principio de la pregunta escrito en el cuadro. El mismo menú sale con el botón derecho, con `Mayús+F10` o la tecla de menú, y en el móvil manteniendo pulsado, como una hoja que sube desde abajo.

- **Hoy**, lo primero que ves: lo que miyagi te dijo al saludar, cuántas páginas tiene su memoria, las fuentes que faltan por incorporar, lo que hay en el horno, cuántos materiales tiene preparados, sugerencias según cómo está la asignatura (incorporar tus documentos, escribir la programación, vincular el aula, corregir…) y lo último que anotó.
- **Programación**: tu programación didáctica tal como está en su memoria, con **Revisar con miyagi** (y **Comprobar el aula** si la tienes vinculada). Sin programación todavía, un botón para escribirla con él.
- **Temas y actividades**: las unidades de la programación, por orden y con sus fechas y horas, y los demás temas de su memoria, cada uno con sus actividades; un clic lleva a su página. Una unidad que aún no tiene página sale igual, con **Prepararlo con miyagi**.
- **Materiales**: lo que miyagi prepara antes de publicarlo, en `materials/` (bancos de preguntas, cuestionarios, apuntes, tareas y rúbricas) y en `drafts/` (lo exportado, páginas, sitios), con una vista previa (los Markdown se ven ya formateados y los HTML sin ejecutar nada de su código; una actividad HTML, como una sopa de letras, se juega con **▶ Jugar en el navegador**, que la abre en el navegador del ordenador) y, con el aula vinculada, **Publicar…**.
- **En el horno**: las actividades que van por fases (en plan, cocinándose, probándose oculta, servida), con su siguiente paso: **Mostrar a los alumnos** lo que está probado y oculto, y **Seguir con ello** te deja escrito en el cuadro cómo retomarla.
- **Base de conocimiento**: sus páginas por secciones, con buscador y los enlaces entre ellas; **Revisar la base** le pide que la compruebe.
- **Fuentes**: tus documentos, con si ya están incorporados, han cambiado o son nuevos. Arrastra aquí los nuevos y pulsa **Pedir a miyagi que los incorpore**.

## Tu aula

**Tu aula** enseña el curso de Moodle de la asignatura y si miyagi llega a él. Sin aula, **Vincular un aula** lo hace en tres pasos:

1. Pegas la dirección de tu curso (la que ves en el navegador, con `course/view.php?id=…`).
2. miyagi te dice lo que va a hacer: instalar la extensión del aula (moodle-teacher) la primera vez y darle tu campus y este curso, de modo que solo pueda entrar en tus cursos vinculados.
3. Queda vinculada, y la conversación empieza de nuevo ya con el aula.

Tu contraseña no pasa por miyagi: la primera vez que entre en el curso se abre una ventana de tu campus para que inicies sesión tú, como siempre.

Con el aula vinculada, la vista ofrece lo que miyagi hace con tu curso: orientarse en él, ver cómo va la clase, revisarlo a fondo y abrir el mapa del curso (este último solo abre su página en la memoria, sin pedirle nada a miyagi).

## Extensiones

**Extensiones** tiene cuatro pestañas:

- **Instaladas**: una tarjeta por extensión, con su interruptor para encenderla o apagarla, si está al día (y el botón para actualizarla si no) y **Qué declara**: sus servidores remotos, si los tiene, qué necesita en tu ordenador, qué capacidades aporta, sus opciones y el botón para quitarla (te pregunta si borra también sus datos). Las opciones secretas, como un token, no se muestran nunca: solo si están guardadas.
- **Catálogo**: las extensiones pensadas para miyagi, con su logo, qué hacen y qué necesitan. **Añadir** te enseña antes lo que declara; una de un repositorio que no es el oficial lleva la marca «sin revisar» y te avisa antes de instalarse. Lo que instalas se pone en marcha en la conversación abierta.
- **Repositorios**: el oficial, que no se puede quitar, y los que añadas tú. Para añadir uno, miyagi lo revisa, te avisa de que su código se ejecuta en tu ordenador y te pide que escribas su nombre.
- **Capacidades** (también desde **＋**, en el cuadro para escribir): una tabla con lo que miyagi puede hacer y gracias a qué, lo que tu ordenador no le deja (por ejemplo, sin Docker) y lo que le falta, con un botón para añadir la extensión que se lo daría.

## Qué la protege

- **Solo en tu ordenador.** La página escucha en `127.0.0.1`, la dirección de tu propio equipo: nadie de tu red llega a ella.
- **Con una llave.** La parte `?token=…` de la dirección es aleatoria y cambia cada vez que la abres. Sin ella, la página no responde. Quien tenga la dirección completa puede usar miyagi con tu cuenta: no la compartas.
- **Una ventana a la vez.** Si la abres en otra pestaña, la anterior se entera y deja de funcionar.
- **Las mismas reglas que en la terminal.** Los modos, las aprobaciones antes de publicar, lo que miyagi puede leer y escribir: todo lo decide miyagi, no la página. Desde la página solo se puede abrir una asignatura de tu lista, nunca una carpeta cualquiera.

## Desde otro equipo

La página no está pensada para abrirse desde fuera. Si aun así lo haces con un túnel (cloudflared, ngrok, Tailscale), la llave de la dirección es lo único que la protege: quien la tenga usa miyagi con tu cuenta de Claude y, si tienes el aula conectada, con tu sesión de Moodle. Hazlo solo con un túnel que exija iniciar sesión, y ciérralo al terminar.
