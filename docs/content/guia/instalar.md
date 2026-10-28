---
title: Instalar
sidebar_position: 2
description: "Qué necesitas, cómo instalar miyagi, cómo comprobarlo, actualizarlo y desinstalarlo, y cómo conectar tu cuenta de Claude."
---

# Instalar miyagi

Se instala una vez por ordenador, en Windows, Mac o Linux. No hace falta saber programar: solo copiar y pegar una línea.

## Lo que necesitas antes

1. **Un navegador** como Google Chrome o Microsoft Edge. En él inicias sesión en Moodle la primera vez que miyagi lo necesita.
2. **Node.js 20 o posterior.** Descárgalo de [nodejs.org](https://nodejs.org/), elige la versión **LTS** e instálalo con las opciones por defecto.
3. **Una suscripción de Claude Pro o Max** ([claude.ai](https://claude.ai)). Es lo que hace funcionar al asistente.
4. **Un curso de Moodle en el que seas profesor**, si quieres que trabaje en tu aula. Para probar sin miedo, mejor un curso de pruebas o una copia de uno real.

## Instalarlo

1. Abre una terminal:
   - **Windows**: pulsa la tecla Windows, escribe `PowerShell` y ábrelo.
   - **Mac**: pulsa `Cmd + Espacio`, escribe `Terminal` y ábrelo.
2. Copia esta línea, pégala en la terminal y pulsa Intro:

   <Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

   Tarda uno o dos minutos. Es normal que aparezca algún aviso en amarillo (`warn`). En Mac, si da un error de permisos, ponle `sudo ` delante y escribe tu contraseña del ordenador.

## Comprobar que funciona

<Terminal>{`$ miyagi --version`}</Terminal>

Si ves un número de versión, ya está instalado. Si la terminal dice que no conoce `miyagi`, ciérrala, ábrela de nuevo y vuelve a probar. Si sigue sin funcionar, comprueba que Node.js está instalado con `node --version` (tiene que ser 20 o más).

## Conectar tu cuenta de Claude

La primera vez que empiezas a trabajar con miyagi (al explorar tu Moodle tras `miyagi init`, o en tu primer `miyagi chat`), te dice que no has iniciado sesión en Claude y te propone hacerlo:

1. Acepta. Se abrirá en el navegador la página de inicio de sesión de Claude.
2. Inicia sesión con tu cuenta de Claude (la de tu suscripción Pro o Max) y pulsa **Autorizar**.
3. Si la página te da un código, cópialo y pégalo en la terminal.

Solo se hace una vez por ordenador. La sesión la guarda Claude Code, el programa de Anthropic que miyagi lleva dentro, y no tienes que instalarlo aparte. miyagi nunca ve tu contraseña ni guarda tu sesión, porque las condiciones de Anthropic no lo permiten. Si ya usas Claude Code con tu cuenta en este ordenador, miyagi aprovecha esa sesión y no te pide nada.

Si prefieres pagar por uso en lugar de usar tu suscripción, crea una clave de API en [console.anthropic.com](https://console.anthropic.com/settings/keys) y ponla en la variable de entorno `ANTHROPIC_API_KEY` (o pégala en la [página de miyagi](../avanzado/navegador.md)).

## Actualizarlo

Repite la línea de instalación: siempre descarga la última versión.

<Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

Tus cursos y tu configuración se quedan como estaban.

## Desinstalarlo

<Terminal>{`$ npm uninstall -g miyagi`}</Terminal>

Las carpetas de tus cursos no se borran: son tuyas y siguen donde las dejaste.

## Siguiente paso

Prepara tu primera asignatura: [Primeros pasos](primeros-pasos.md).
