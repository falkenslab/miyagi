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

A la izquierda, la **barra lateral**: tu asignatura (para cambiar a otra o crear una nueva, y si tiene aula), **Hoy**, la **Conversación**, las vistas de la asignatura y de su memoria, **Tu aula**, las **Extensiones**, tus conversaciones anteriores (para retomar una o empezar otra) y, abajo, las versiones y el tema claro, oscuro o el del sistema. En una pantalla estrecha se abre con el botón ☰.

Desde el selector de asignaturas (o la pantalla de inicio, si no tienes ninguna):

- **Nueva asignatura** te hace las preguntas de `miyagi init`: nombre, descripción, idioma, tono, y si quieres vincular ya un aula. Va a la carpeta de miyagi, salvo que pulses **Elegir carpeta** y le des una vacía o nueva (por ejemplo, en tu nube).
- **Abrir una carpeta** añade a tu lista una asignatura que ya tienes en el disco, por ejemplo copiada de un compañero.
- Una asignatura cuya carpeta se movió aparece como no encontrada: **Localizar** la apunta a su carpeta nueva y **Olvidar** la quita de la lista sin tocar su carpeta.

Son las mismas asignaturas que ves en la terminal con `miyagi workspaces`.

Arriba, en cada vista: su título, el **modo** (también con `Mayús+Tab`), las **Acciones** (lo que pides a menudo, como preparar el próximo tema o, con el aula, corregir lo pendiente; miyagi lo recibe como si lo escribieras) y las **Capacidades**.

En la conversación:

- **El chat**: lo que miyagi escribe, con sus acciones plegadas en una línea (ábrela para ver cada una), las tareas del turno flotando encima y la barra para escribir. `Intro` envía, `Mayús+Intro` salta de línea, `Esc` para a miyagi mientras trabaja, `/` abre los atajos y `↑`/`↓` recorren lo que ya escribiste.
- **Las aprobaciones y las preguntas** de miyagi, en una ventana que no se cierra hasta que respondes, igual que en la terminal. Si estabas en otra vista, la página vuelve a la conversación.
- **Archivos para las fuentes**: con el clip, o arrastrándolos a la barra, van a `sources/` de la asignatura.

La primera vez, si no has iniciado sesión en Claude, la página te ofrece dos caminos:

- **Iniciar sesión con tu cuenta de Claude.** Se abre en tu navegador la página de Anthropic. Inicias sesión, autorizas y, si te da un código, lo pegas en la casilla de miyagi. La sesión la guarda Claude Code, que va dentro de miyagi; miyagi nunca la ve.
- **Usar una clave de API** (`sk-ant-api…`, de [console.anthropic.com](https://console.anthropic.com/settings/keys)), que se paga por uso. Se guarda en `~/.miyagi/config.json`.

Un token de suscripción (`sk-ant-oat…`) ya no se puede pegar: las condiciones de Anthropic no dejan que miyagi lo guarde. Si una versión anterior lo había guardado, miyagi lo borra y te pide iniciar sesión una vez.

## Tu asignatura, de un vistazo

Estas vistas solo enseñan lo que miyagi sabe y tiene preparado: no cambian nada por su cuenta. Sus botones mandan una petición a la conversación, como si la escribieras tú, y miyagi trabaja allí con las mismas aprobaciones de siempre.

- **Hoy**, lo primero que ves: lo que miyagi te dijo al saludar, cuántas páginas tiene su memoria, las fuentes que faltan por incorporar, lo que hay en el horno y en `drafts/`, sugerencias según cómo está la asignatura (incorporar tus documentos, escribir la programación, vincular el aula, corregir…) y lo último que anotó.
- **Programación**: tu programación didáctica tal como está en su memoria, con **Revisar con miyagi** (y **Comprobar el aula** si la tienes vinculada). Sin programación todavía, un botón para escribirla con él.
- **Temas y actividades**: cada tema con sus actividades; un clic lleva a su página.
- **Materiales**: lo que miyagi prepara en `drafts/` antes de publicarlo, con una vista previa (los HTML se ven sin ejecutar nada de su código) y, con el aula vinculada, **Publicar…**.
- **En el horno**: las actividades que van por fases (en plan, cocinándose, probándose oculta, servida), con su siguiente paso.
- **Base de conocimiento**: sus páginas por secciones, con buscador y los enlaces entre ellas; **Revisar la base** le pide que la compruebe.
- **Fuentes**: tus documentos, con si ya están incorporados, han cambiado o son nuevos. Arrastra aquí los nuevos y pulsa **Pedir a miyagi que los incorpore**.

## Tu aula

**Tu aula** enseña el curso de Moodle de la asignatura y si miyagi llega a él. Sin aula, **Vincular un aula** lo hace en tres pasos:

1. Pegas la dirección de tu curso (la que ves en el navegador, con `course/view.php?id=…`).
2. miyagi te dice lo que va a hacer: instalar la extensión del aula (moodle-teacher) la primera vez y darle tu campus y este curso, de modo que solo pueda entrar en tus cursos vinculados.
3. Queda vinculada, y la conversación empieza de nuevo ya con el aula.

Tu contraseña no pasa por miyagi: la primera vez que entre en el curso se abre una ventana de tu campus para que inicies sesión tú, como siempre.

## Extensiones

**Extensiones** tiene cuatro pestañas:

- **Instaladas**: una tarjeta por extensión, con su interruptor para encenderla o apagarla, si está al día (y el botón para actualizarla si no) y **Qué declara**: sus servidores remotos, si los tiene, qué necesita en tu ordenador, qué capacidades aporta, sus opciones y el botón para quitarla (te pregunta si borra también sus datos). Las opciones secretas, como un token, no se muestran nunca: solo si están guardadas.
- **Catálogo**: las extensiones pensadas para miyagi, con su logo, qué hacen y qué necesitan. **Añadir** te enseña antes lo que declara; una de un repositorio que no es el oficial lleva la marca «sin revisar» y te avisa antes de instalarse. Lo que instalas se pone en marcha en la conversación abierta.
- **Repositorios**: el oficial, que no se puede quitar, y los que añadas tú. Para añadir uno, miyagi lo revisa, te avisa de que su código se ejecuta en tu ordenador y te pide que escribas su nombre.
- **Capacidades** (también con el botón de arriba): una tabla con lo que miyagi puede hacer y gracias a qué, lo que tu ordenador no le deja (por ejemplo, sin Docker) y lo que le falta, con un botón para añadir la extensión que se lo daría.

## Qué la protege

- **Solo en tu ordenador.** La página escucha en `127.0.0.1`, la dirección de tu propio equipo: nadie de tu red llega a ella.
- **Con una llave.** La parte `?token=…` de la dirección es aleatoria y cambia cada vez que la abres. Sin ella, la página no responde. Quien tenga la dirección completa puede usar miyagi con tu cuenta: no la compartas.
- **Una ventana a la vez.** Si la abres en otra pestaña, la anterior se entera y deja de funcionar.
- **Las mismas reglas que en la terminal.** Los modos, las aprobaciones antes de publicar, lo que miyagi puede leer y escribir: todo lo decide miyagi, no la página. Desde la página solo se puede abrir una asignatura de tu lista, nunca una carpeta cualquiera.

## Desde otro equipo

La página no está pensada para abrirse desde fuera. Si aun así lo haces con un túnel (cloudflared, ngrok, Tailscale), la llave de la dirección es lo único que la protege: quien la tenga usa miyagi con tu cuenta de Claude y, si tienes el aula conectada, con tu sesión de Moodle. Hazlo solo con un túnel que exija iniciar sesión, y ciérralo al terminar.
