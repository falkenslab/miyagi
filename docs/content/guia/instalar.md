---
title: Instalar
sidebar_position: 2
description: "Qué necesitas, cómo instalar miyagi, cómo comprobarlo, actualizarlo y desinstalarlo, y cómo conectar tu cuenta de Claude."
---

# Instalar miyagi

Se instala una vez por ordenador, en Windows, Mac o Linux. No hace falta saber programar: solo copiar y pegar una línea.

## Lo que necesitas antes

1. **Google Chrome.** Si no lo tienes, descárgalo de [google.com/chrome](https://www.google.com/chrome/). miyagi lo usa para entrar en Moodle.
2. **Node.js 20 o posterior.** Descárgalo de [nodejs.org](https://nodejs.org/), elige la versión **LTS** e instálalo con las opciones por defecto.
3. **Una suscripción de Claude Pro o Max** ([claude.ai](https://claude.ai)). Es lo que hace funcionar al asistente.
4. **Un curso de Moodle en el que seas profesor.** Para probar sin miedo, mejor un curso de pruebas o una copia de uno real.

## Instalarlo

1. Abre una terminal:
   - **Windows**: pulsa la tecla Windows, escribe `PowerShell` y ábrelo.
   - **Mac**: pulsa `Cmd + Espacio`, escribe `Terminal` y ábrelo.
2. Copia esta línea, pégala en la terminal y pulsa Intro:

   ```bash
   npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz
   ```

   Tarda uno o dos minutos. Es normal que aparezca algún aviso en amarillo (`warn`). En Mac, si da un error de permisos, ponle `sudo ` delante y escribe tu contraseña del ordenador.

## Comprobar que funciona

```bash
miyagi --version
```

Si ves un número de versión, ya está instalado. Si la terminal dice que no conoce `miyagi`, ciérrala, ábrela de nuevo y vuelve a probar. Si sigue sin funcionar, comprueba que Node.js está instalado con `node --version` (tiene que ser 20 o más).

## Conectar tu cuenta de Claude

La primera vez que empiezas a trabajar con miyagi (al explorar tu Moodle tras `miyagi init`, o en tu primer `miyagi chat`), te dice que no encuentra ningún acceso a Claude y te propone crearlo:

1. Acepta. Se abrirá el navegador.
2. Inicia sesión con tu cuenta de Claude (la de tu suscripción Pro o Max) y sigue las indicaciones.
3. Vuelve a la terminal.

Solo se hace una vez por ordenador: miyagi guarda ese acceso en tu carpeta personal y no te lo vuelve a pedir.

## Actualizarlo

Repite la línea de instalación: siempre descarga la última versión.

```bash
npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz
```

Tus cursos y tu configuración se quedan como estaban.

## Desinstalarlo

```bash
npm uninstall -g miyagi
```

Las carpetas de tus cursos no se borran: son tuyas y siguen donde las dejaste.

## Siguiente paso

Conéctalo a tu curso: [Primeros pasos](primeros-pasos.md).
