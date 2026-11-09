---
title: Instalar
sidebar_position: 3
description: "Qué necesitas, cómo instalar miyagi, cómo comprobarlo, actualizarlo y desinstalarlo, y cómo conectar tu cuenta de Claude."
---

# Instalar miyagi

Se instala una vez por ordenador. En Windows, la [aplicación de escritorio](escritorio.md) se instala con un doble clic y es la versión que te recomendamos. En Mac y Linux, o si prefieres la versión web o la terminal, basta con una sola línea. No hace falta saber programar. Si dudas, mira [Elige tu versión](elegir-version.md).

## Lo que necesitas antes

1. **Un navegador** como Google Chrome o Microsoft Edge. En él inicias sesión en Moodle la primera vez que miyagi lo necesita.
2. **Node.js 20 o posterior, solo si instalas con la terminal.** Descárgalo de [nodejs.org](https://nodejs.org/), elige la versión **LTS** e instálalo con las opciones por defecto.
3. **Una suscripción de Claude Pro o Max** ([claude.ai](https://claude.ai)). Es lo que hace funcionar al asistente.
4. **Un curso de Moodle en el que seas profesor**, si quieres que trabaje en tu aula. Para probar sin miedo, mejor un curso de pruebas o una copia de uno real.

## La aplicación de escritorio, para Windows {#aplicacion-windows}

Solo en Windows de 64 bits. No necesita Node.js ni terminal.

1. Descarga el instalador de miyagi:

   <DownloadWindows />

2. Ábrelo. Windows te avisará de que no reconoce la aplicación, porque el instalador todavía no está firmado: pulsa **Más información** y luego **Ejecutar de todas formas**.
3. Sigue los pasos. Al terminar se abre miyagi, y tendrás un acceso directo en el escritorio y en el menú Inicio.
4. La primera vez te pide conectar tu cuenta de Claude: inicias sesión en la página de Anthropic o usas una clave.

En [La aplicación de escritorio](escritorio.md) tienes todo lo que viene después, parte por parte.

## Instalarlo con la terminal, para la versión web y la terminal {#instalarlo}

Para Mac, Linux y quien prefiera la [versión web](web.md) o la [terminal](terminal.md) en Windows.

1. Abre una terminal:
   - **Windows**: pulsa la tecla Windows, escribe `PowerShell` y ábrelo.
   - **Mac**: pulsa `Cmd + Espacio`, escribe `Terminal` y ábrelo.
2. Copia esta línea, pégala en la terminal y pulsa Intro:

   <Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

   Tarda uno o dos minutos. Es normal que aparezca algún aviso en amarillo (`warn`). En Mac, si da un error de permisos, ponle `sudo ` delante y escribe tu contraseña del ordenador.

## Comprobar que funciona

Con la aplicación de escritorio no hace falta: al abrirla ves la versión abajo, en la columna de iconos. Con la terminal:

<Terminal>{`$ miyagi --version`}</Terminal>

Si ves un número de versión, ya está instalado. Si la terminal dice que no conoce `miyagi`, ciérrala, ábrela de nuevo y vuelve a probar. Si sigue sin funcionar, comprueba que Node.js está instalado con `node --version` (tiene que ser 20 o más).

## Conectar tu cuenta de Claude

La primera vez que empiezas a trabajar con miyagi te dice que no has iniciado sesión en Claude y te propone hacerlo. En la aplicación y en la versión web aparece en su ventana; en la terminal, al explorar tu Moodle tras `miyagi init` o en tu primer `miyagi chat`:

1. Acepta. Se abrirá en el navegador la página de inicio de sesión de Claude.
2. Inicia sesión con tu cuenta de Claude (la de tu suscripción Pro o Max) y pulsa **Autorizar**.
3. Si la página te da un código, cópialo y pégalo donde te lo pida miyagi.

Solo se hace una vez por ordenador. La sesión la guarda Claude Code, el programa de Anthropic que miyagi lleva dentro, y no tienes que instalarlo aparte. miyagi nunca ve tu contraseña ni guarda tu sesión, porque las condiciones de Anthropic no lo permiten. Si ya usas Claude Code con tu cuenta en este ordenador, miyagi aprovecha esa sesión y no te pide nada.

Si prefieres pagar por uso en lugar de usar tu suscripción, crea una clave de API en [console.anthropic.com](https://console.anthropic.com/settings/keys) y ponla en la variable de entorno `ANTHROPIC_API_KEY` (o pégala en la aplicación o en la [versión web](web.md), que te lo ofrecen en esa misma pantalla).

## Actualizarlo

Si usas la aplicación de escritorio, descarga el instalador de nuevo y ejecútalo.

Si lo instalaste con la terminal, repite la línea de instalación: siempre descarga la última versión.

<Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

Tus cursos y tu configuración se quedan como estaban.

## Desinstalarlo

La aplicación de escritorio se desinstala desde **Configuración > Aplicaciones**. Si lo instalaste con la terminal:

<Terminal>{`$ npm uninstall -g miyagi`}</Terminal>

En los dos casos, las carpetas de tus cursos no se borran: son tuyas y siguen donde las dejaste.

## Siguiente paso

Prepara tu primera asignatura: [La aplicación de escritorio](escritorio.md) o [Primeros pasos](primeros-pasos.md).
