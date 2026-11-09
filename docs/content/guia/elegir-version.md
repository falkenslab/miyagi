---
title: Elige tu versión
sidebar_position: 2
description: "La aplicación de escritorio, la versión web y la terminal de miyagi: para qué sirve cada una, qué necesita y cuál te conviene."
---

# Elige tu versión

miyagi es el mismo asistente en las tres versiones: las mismas asignaturas, los mismos permisos antes de publicar, la misma memoria del curso. Cambia cómo lo abres y qué tienes alrededor.

**Si tienes Windows, usa la aplicación de escritorio.** Es la versión principal: la más fácil de instalar y la más completa.

## Aplicación de escritorio {#escritorio}

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-hoy.webp" alt="La aplicación de escritorio en la vista Hoy: la columna de iconos, la lista de conversaciones, el saludo de miyagi con lo que sabe de la asignatura, cuatro tarjetas de resumen y sugerencias para hoy.">La aplicación de escritorio, en la vista Hoy.</Shot>

- **Para quién.** Para la mayoría de docentes. No hace falta tocar la terminal ni instalar Node.js.
- **Dónde.** Solo Windows de 64 bits.
- **Qué tiene de más.** Su propia barra de ventana con los menús Archivo, Editar, Ver y Ayuda, y un navegador web integrado en el panel lateral, con pestañas, para tener Moodle junto a la conversación.
- **Cómo se instala.** Con un instalador: lo tienes en [Instalar](instalar.md#aplicacion-windows). Todavía no está firmado, así que Windows te avisará la primera vez.
- **Guía:** [La aplicación de escritorio](escritorio.md).

## Versión web {#web}

<Shot width="1400" height="875" kind="web" src="/img/v2/web-hoy.webp" alt="La versión web de miyagi en una pestaña del navegador, en la vista Hoy, con la misma interfaz que la aplicación de escritorio.">La versión web es la misma página que la aplicación, en una pestaña de tu navegador.</Shot>

- **Para quién.** Si usas Mac o Linux, o si prefieres no instalar la aplicación.
- **Dónde.** Windows, Mac y Linux. Se abre desde una terminal y funciona solo en tu ordenador.
- **Qué no tiene.** Ni la barra de ventana propia ni el navegador integrado: los enlaces se abren en tu navegador.
- **Cómo se instala.** Con Node.js y una línea en la terminal, y se abre con `miyagi web`.
- **Guía:** [La versión web](web.md).

## Terminal {#terminal}

<Shot width="1400" height="1122" kind="terminal" src="/img/v2/terminal-chat.webp" alt="El chat de miyagi en la terminal: el saludo con la asignatura y el curso, una respuesta con una tabla de alias y el estado de sus entregas, y el modo guiado abajo.">El chat de miyagi en la terminal, con la misma conversación y las mismas aprobaciones.</Shot>

- **Para quién.** Para quien se maneja bien en la terminal, o quiere encargos de una sola orden (`miyagi run`).
- **Dónde.** Windows, Mac y Linux, con Node.js.
- **Qué tiene de más.** Las órdenes `init`, `run`, `ingest`, `explore`, `skills` y `extension`, y los atajos de teclado del chat.
- **Guía:** [La terminal](terminal.md).

## De un vistazo

| Qué | Aplicación | Web | Terminal |
| --- | --- | --- | --- |
| Sistema | Windows de 64 bits | Windows, Mac, Linux | Windows, Mac, Linux |
| Necesita Node.js | No | Sí (20 o posterior) | Sí (20 o posterior) |
| Cómo se abre | El icono de miyagi | `miyagi web` y la dirección que te da | `miyagi chat` |
| Qué asignatura abre | La última que usaste | La última, o la de `-w` o `--dir` | La de `-w`, la de `--dir` o la carpeta actual |
| Menús de ventana | Sí | No | No |
| Navegador integrado | Sí | No | No |
| Visita guiada y trucos | Sí | Sí | No |
| Enlaces de la conversación | Se abren en el panel lateral | Se abren en tu navegador | Salen como texto; se abren desde la terminal |

Puedes cambiar cuando quieras: las tres trabajan con las mismas carpetas (`~/.miyagi`, en Windows `C:\Users\<tu-usuario>\.miyagi`), así que una asignatura creada en la aplicación se abre también desde la terminal, y al revés. Lo que no conviene es tener dos versiones abiertas a la vez sobre la misma asignatura.

## ¿Y si no tengo Windows?

La aplicación solo se instala en Windows. En Mac o Linux, instala con Node.js y usa la [versión web](web.md): verás lo mismo, sin los menús de ventana ni el navegador integrado.
