---
title: Instalar
sidebar_position: 3
description: "Qué necesitas, cómo instalar miyagi, cómo comprobarlo, actualizarlo y desinstalarlo, y cómo conectar tu cuenta de Claude."
---

# Instalar miyagi

Se instala una vez por ordenador. La [aplicación de escritorio](escritorio.md) se instala con un doble clic en Windows, Mac y Linux, y es la versión que te recomendamos. Si prefieres la versión web o la terminal, basta con una sola línea. No hace falta saber programar. Si dudas, mira [Elige tu versión](elegir-version.md).

## Lo que necesitas antes

1. **Un navegador** como Google Chrome o Microsoft Edge. En él inicias sesión en Moodle la primera vez que miyagi lo necesita.
2. **Node.js 20 o posterior, solo si instalas con la terminal.** Descárgalo de [nodejs.org](https://nodejs.org/), elige la versión **LTS** e instálalo con las opciones por defecto.
3. **Una suscripción de Claude Pro o Max** ([claude.ai](https://claude.ai)). Es lo que hace funcionar al asistente.
4. **Un curso de Moodle en el que seas profesor**, si quieres que trabaje en tu aula. Para probar sin miedo, mejor un curso de pruebas o una copia de uno real.

## La aplicación de escritorio {#aplicacion-windows}

Para Windows de 64 bits, Mac (con Apple Silicon o con Intel) y Linux de 64 bits. No necesita Node.js ni terminal.

1. Descarga miyagi. El botón te ofrece la de tu sistema, y debajo tienes las demás:

   <DownloadApp />

2. Instálala. Todavía no está firmada, así que tu sistema te avisará la primera vez:
   - **Windows**: abre `miyagi-setup.exe`. Windows te dirá que no reconoce la aplicación: pulsa **Más información** y luego **Ejecutar de todas formas**. Sigue los pasos; tendrás un acceso directo en el escritorio y en el menú Inicio.
   - **Mac**: abre el `.dmg` y arrastra miyagi a **Aplicaciones**. La primera vez, en Aplicaciones, haz clic derecho en miyagi y elige **Abrir**, y otra vez **Abrir**. Si macOS dice que la aplicación «está dañada», abre la Terminal y escribe esta línea, que quita la marca de descarga de internet y no cambia nada más:

     <Terminal>{`$ xattr -dr com.apple.quarantine /Applications/miyagi.app`}</Terminal>

     Si tu Mac tiene procesador Intel (los anteriores a finales de 2020), descarga la versión **Mac (Intel)**.
   - **Linux**: en Ubuntu o Debian, instala el `.deb` y tendrás miyagi entre tus aplicaciones. En otras distribuciones, usa el `.AppImage`: dale permiso de ejecución (en sus propiedades, o con `chmod +x miyagi.AppImage`) y ábrelo.

     <Terminal>{`$ sudo apt install ./miyagi.deb`}</Terminal>

3. Abre miyagi. La primera vez te pide conectar tu cuenta de Claude: inicias sesión en la página de Anthropic o usas una clave.

En [La aplicación de escritorio](escritorio.md) tienes todo lo que viene después, parte por parte.

## Instalarlo con la terminal, para la versión web y la terminal {#instalarlo}

Para quien prefiera la [versión web](web.md) o la [terminal](terminal.md), en cualquier sistema.

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

## Todas las descargas {#descargas}

Cada versión de miyagi publica sus archivos en GitHub. Estos enlaces llevan siempre a los de la última:

- **[miyagi-setup.exe](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-setup.exe)**: la aplicación de escritorio para Windows de 64 bits.
- **[miyagi-arm64.dmg](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-arm64.dmg)** y **[miyagi-x64.dmg](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-x64.dmg)**: la aplicación para Mac, con Apple Silicon (M1 y posteriores) y con Intel.
- **[miyagi.deb](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.deb)** y **[miyagi.AppImage](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.AppImage)**: la aplicación para Linux de 64 bits; el primero para Ubuntu y Debian, el segundo para cualquier otra distribución.
- **[miyagi.tgz](https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz)**: el paquete de la versión web y la terminal, para cualquier sistema con Node.js. Es el que instala la línea de arriba; si lo descargas, se instala igual con `npm install -g` y la ruta del archivo.
- **[Todas las versiones](https://github.com/falkenslab/miyagi/releases)**: qué trae cada una y sus archivos, por si necesitas volver a una anterior.

## Actualizarlo

Si usas la aplicación de escritorio, descárgala de nuevo e instálala encima; en Mac, reemplaza la que tienes en Aplicaciones.

Si lo instalaste con la terminal, repite la línea de instalación: siempre descarga la última versión.

<Terminal>{`$ npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz`}</Terminal>

Tus cursos y tu configuración se quedan como estaban.

## Desinstalarlo

La aplicación de escritorio se desinstala en Windows desde **Configuración > Aplicaciones**; en Mac, arrastrando miyagi de Aplicaciones a la papelera; en Linux, con `sudo apt remove miyagi` si instalaste el `.deb`, o borrando el `.AppImage`. Si lo instalaste con la terminal:

<Terminal>{`$ npm uninstall -g miyagi`}</Terminal>

En los dos casos, las carpetas de tus cursos no se borran: son tuyas y siguen donde las dejaste.

## Siguiente paso

Prepara tu primera asignatura: [La aplicación de escritorio](escritorio.md) o [Primeros pasos](primeros-pasos.md).
