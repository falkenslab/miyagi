---
title: La versión web
sidebar_position: 5
description: "miyagi web: la misma página que la aplicación, abierta en una pestaña de tu navegador, en Windows, Mac o Linux y solo en tu ordenador."
---

# La versión web

`miyagi web` abre la misma página que la aplicación de escritorio en una pestaña de tu navegador. Sirve en Windows, Mac y Linux. Todo lo que ves y haces está explicado en [La aplicación de escritorio](escritorio.md): aquí solo verás lo que cambia y sus usos principales.

## Abrirla

Necesitas [instalar miyagi con la terminal](instalar.md#instalarlo). Después:

<Terminal>{`$ miyagi web`}</Terminal>

miyagi abre la asignatura que usaste por última vez (o la que le digas con `-w <nombre>` o `--dir <carpeta>`) y te enseña una dirección como `http://127.0.0.1:52341/?token=…`. Ábrela en tu navegador. Para cerrarla, pulsa `Ctrl+C` en la terminal.

<Shot width="1400" height="875" kind="web" src="/img/v2/web-hoy.webp" alt="La versión web en la vista Hoy a tamaño de escritorio, con el saludo, las tarjetas de resumen y las sugerencias.">La vista Hoy en el navegador.</Shot>

La página funciona solo en tu ordenador, y esa dirección lleva una llave aleatoria que cambia cada vez. No la compartas: [lo que protege y lo que no](/avanzado/navegador/#que-la-protege).

## Qué cambia respecto a la aplicación

- No hay **barra de título** con menús Archivo, Editar, Ver y Ayuda: la ventana es tu navegador.
- No hay **navegador integrado**: el panel lateral muestra borradores y actividad, y los enlaces se abren en tu navegador.
- Hay que tenerla abierta desde una **terminal**, y al cerrar la terminal se cierra.
- **Solo una pestaña a la vez**: si la abres en otra, la anterior deja de funcionar.

La visita guiada, los trucos, las aprobaciones y los modos son los mismos.

## Conversar y aprobar

La conversación, las aprobaciones y las vistas funcionan igual que en la aplicación.

<Shot width="1400" height="875" kind="web" src="/img/v2/web-chat.webp" alt="Una conversación en la versión web con el resumen de las respuestas del foro.">Una conversación en la pestaña del navegador.</Shot>

<Shot width="1400" height="875" kind="web" src="/img/v2/web-aprobacion.webp" alt="Un panel de aprobación en la versión web para publicar en el foro, con los botones Aprobar, Rechazar y Parar todo.">La aprobación, con las mismas tres opciones: Aprobar, Rechazar y Parar todo.</Shot>

## En una pantalla pequeña

En una pantalla estrecha, la columna de iconos y las conversaciones se abren con el botón del menú ☰, y la conversación ocupa toda la pantalla.

<Shot width="780" height="1688" kind="web" src="/img/v2/web-movil-hoy.webp" alt="La versión web en un ancho de teléfono, en la vista Hoy.">La versión web a 390 píxeles de ancho.</Shot>

<Shot width="780" height="1688" kind="web" src="/img/v2/web-movil-menu.webp" alt="El menú lateral abierto a 390 píxeles, con la columna de iconos, la asignatura, Nueva conversación y las conversaciones.">El menú, abierto.</Shot>

La página escucha solo en tu ordenador, así que para usarla desde otro dispositivo haría falta un túnel, y no lo recomendamos sin una protección adicional: [lo explicamos aquí](/avanzado/navegador/#desde-otro-equipo).

## Usos principales

Lo mismo que en la aplicación: [crear una asignatura](escritorio.md#crear-asignatura), [vincular el aula](escritorio.md#vincular), dejarle tus documentos en Fuentes y conversar. Y lo tienes en tareas concretas en [Casos de uso en la versión web](/casos-de-uso/en-web/).

Para Windows, la [aplicación de escritorio](escritorio.md) es más cómoda: tiene su propia ventana y su navegador integrado.
