---
title: miyagi en el navegador
sidebar_position: 11
description: "miyagi web: el chat de miyagi en tu navegador, solo en tu ordenador, con una llave en la dirección; qué protege y qué no si lo abres desde fuera."
---

# miyagi en el navegador

Además del chat en la terminal, miyagi tiene una página: la misma conversación, con sus paneles de aprobación, las conversaciones anteriores, el modo y tus asignaturas, en una ventana del navegador. Es la misma página que abre la aplicación de escritorio.

## Abrirla

```bash
miyagi web
```

miyagi abre la asignatura que usaste por última vez (o la que le digas con `-w <nombre>` o `--dir <ruta>`) y te enseña una dirección como esta:

```
http://127.0.0.1:52341/?token=…
```

Ábrela en tu navegador. `Ctrl+C` en la terminal lo cierra. Con `--port <n>` eliges el puerto. Sin ninguna asignatura todavía, la página te deja crear una.

## Qué ves

- **El chat**: lo que miyagi escribe, con sus acciones plegadas en una línea (ábrela para ver cada una), las tareas del turno flotando encima y la barra para escribir. `Intro` envía, `Mayús+Intro` salta de línea, `Esc` para a miyagi mientras trabaja, `/` abre los atajos y `↑`/`↓` recorren lo que ya escribiste.
- **Las aprobaciones y las preguntas** de miyagi, en una ventana que no se cierra hasta que respondes, igual que en la terminal.
- **Archivos para las fuentes**: con el clip, o arrastrándolos a la barra, van a `sources/` de la asignatura.
- **Arriba**: tu asignatura (para cambiar a otra o crear una nueva), las conversaciones (para retomar una o empezar otra), el modo (también con `Mayús+Tab`) y el tema claro, oscuro o el del sistema.

La primera vez, si miyagi no tiene tu clave de Claude, la página te la pide: pega tu token (empieza por `sk-ant-oat`, lo sacas con `claude setup-token` en una terminal) o una clave de API (`sk-ant-api`). Se guarda en `~/.miyagi/config.json`, como en la terminal.

## Qué la protege

- **Solo en tu ordenador.** La página escucha en `127.0.0.1`, la dirección de tu propio equipo: nadie de tu red llega a ella.
- **Con una llave.** La parte `?token=…` de la dirección es aleatoria y cambia cada vez que la abres. Sin ella, la página no responde. Quien tenga la dirección completa puede usar miyagi con tu cuenta: no la compartas.
- **Una ventana a la vez.** Si la abres en otra pestaña, la anterior se entera y deja de funcionar.
- **Las mismas reglas que en la terminal.** Los modos, las aprobaciones antes de publicar, lo que miyagi puede leer y escribir: todo lo decide miyagi, no la página. Desde la página solo se puede abrir una asignatura de tu lista, nunca una carpeta cualquiera.

## Desde otro equipo

La página no está pensada para abrirse desde fuera. Si aun así lo haces con un túnel (cloudflared, ngrok, Tailscale), la llave de la dirección es lo único que la protege: quien la tenga usa miyagi con tu cuenta de Claude y, si tienes el aula conectada, con tu sesión de Moodle. Hazlo solo con un túnel que exija iniciar sesión, y ciérralo al terminar.
