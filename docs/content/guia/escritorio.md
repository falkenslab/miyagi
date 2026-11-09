---
title: La aplicación de escritorio
sidebar_position: 4
description: "miyagi en una ventana de Windows, desde cero: instalar, primer arranque, la visita guiada, crear una asignatura, vincular el aula y qué hay en cada parte de la ventana."
---

# La aplicación de escritorio

Esta es la versión principal de miyagi. En esta página la verás entera, desde el primer arranque hasta la última parte de la ventana. Solo se instala en Windows de 64 bits; si tienes otro sistema, mira la [versión web](web.md).

:::tip[El recorrido completo, con un curso de verdad]
Si prefieres verlo en acción, sigue el tutorial [Un curso de Introducción a SQL](/casos-de-uso/): está hecho en esta misma aplicación, de principio a fin.
:::

## Instalarla {#instalar}

1. Descarga el instalador:

   <DownloadWindows />

2. Ábrelo. Windows te avisará de que no reconoce la aplicación, porque el instalador todavía no está firmado: pulsa **Más información** y luego **Ejecutar de todas formas**.
3. Sigue los pasos. Al terminar se abre miyagi, y tendrás un acceso directo en el escritorio y en el menú Inicio.

La aplicación no necesita Node.js ni terminal. Para actualizarla, descarga el instalador de nuevo y ejecútalo; para desinstalarla, ve a **Configuración > Aplicaciones**. Tus asignaturas no se borran al desinstalar.

## La primera vez {#primera-vez}

Lo primero es conectar tu cuenta de Claude. Puedes iniciar sesión con tu suscripción Pro o Max en la página de Anthropic, o usar una clave de API. miyagi nunca ve tu contraseña.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-iniciar-sesion-claude.webp" alt="La pantalla Conecta miyagi con Claude: un botón para iniciar sesión con la cuenta de Claude, la nota de que miyagi nunca ve la contraseña y la opción de usar una clave de API.">Conectar tu cuenta de Claude: se hace una vez por ordenador.</Shot>

Después, sin ninguna asignatura todavía, te sale directamente el formulario para crear la primera.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-primer-arranque.webp" alt="El primer arranque de la aplicación sin asignaturas: el formulario de Nueva asignatura vacío, con nombre, descripción, idioma y tono.">El primer arranque: todavía no hay asignaturas.</Shot>

## La visita guiada y los trucos {#visita}

La primera vez que abres una asignatura, una visita guiada de 19 pasos te enseña la ventana parte por parte. Puedes saltarla y volver a abrirla cuando quieras con el icono **?** de la columna de iconos, en **Visita guiada**.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-bienvenida.webp" alt="El primer paso de la visita guiada: un globo de bienvenida sobre la vista Hoy, con los botones Saltar y Siguiente.">Paso 1 de la visita guiada.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-chat.webp" alt="Un paso de la visita guiada que ilumina el cuadro donde se escribe a miyagi y explica el botón más, la barra para atajos y el cambio de modo.">La visita ilumina cada parte de la ventana: aquí, el cuadro donde hablas con miyagi.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-buscador.webp" alt="Un paso de la visita guiada que ilumina la búsqueda de conversaciones y la campana.">Aquí, la búsqueda y la campana.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-aprobaciones.webp" alt="Un paso de la visita guiada sobre el modo y las aprobaciones, con la explicación de que en Guiado nada se publica sin tu sí.">Otro paso: el modo y las aprobaciones.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tour-barra.webp" alt="Un paso de la visita guiada que ilumina la barra de título con sus menús.">Y la barra de la ventana, solo en la aplicación.</Shot>

Al abrir una asignatura también te sale un **truco**, uno cada vez, con su imagen. Con los botones te mueves entre ellos, y si marcas **No mostrar trucos al abrir** no vuelven a aparecer.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-truco.webp" alt="La ventana de trucos: el título El menú barra tiene todos sus comandos, una captura del menú y la casilla No mostrar trucos al abrir.">Un truco al abrir la asignatura.</Shot>

## Crear una asignatura {#crear-asignatura}

Rellena el formulario de **Nueva asignatura**: el nombre, una descripción opcional, el idioma en el que prefieres que te hable, y el **tono** con el que escribirá a tus alumnos en el foro, la retroalimentación y los avisos. Marca **Vincular ya un aula de Moodle** si quieres conectar tu curso en ese momento. Se guarda en `~/.miyagi/workspaces/`, salvo que elijas otra carpeta con **Elegir carpeta**.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-nueva-asignatura.webp" alt="El formulario Nueva asignatura relleno, con la casilla Vincular ya un aula de Moodle marcada.">Nueva asignatura, con la opción de vincular el aula ya.</Shot>

Cambias de asignatura o creas otra desde el selector, arriba de la columna de conversaciones.

Sin aula, miyagi te ayuda igualmente con la programación, los temas y los materiales. Puedes vincularla después desde **Tu aula**.

## Vincular tu aula de Moodle {#vincular}

En la vista **Tu aula**, pulsa **Vincular un aula**. Son tres pasos:

1. Pegas la dirección de tu curso, la que ves en el navegador con `course/view.php?id=…`.
2. miyagi te dice qué va a hacer: instalar la extensión del aula (moodle-teacher) si no la tienes y darle tu campus y este curso, de modo que solo pueda entrar en tus cursos vinculados.
3. Queda vinculada.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-vincular-1-direccion.webp" alt="Vincular un aula, paso 1: el campo con la dirección del curso rellena.">Paso 1: la dirección de tu curso.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-vincular-2-confirmar.webp" alt="Vincular un aula, paso 2: confirma el campus y el curso, explica que instala moodle-teacher y que la primera vez se abrirá una ventana del campus para iniciar sesión.">Paso 2: lo que va a hacer, y la nota de que tú inicias sesión en una ventana del campus.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-vincular-3-hecho.webp" alt="Vincular un aula, paso 3: aula vinculada.">Paso 3: vinculada.</Shot>

Tu contraseña no pasa por miyagi: la primera vez que entre en el curso, se abre una ventana de tu campus para que inicies sesión tú, con tu usuario, tu contraseña y el doble factor si lo tienes.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tu-aula-recien-vinculada.webp" alt="La vista Tu aula recién vinculada: la dirección del Moodle, el número de curso y los atajos para orientarse, ver la clase, revisar el curso y abrir su mapa.">Tu aula, ya con su curso y sus atajos.</Shot>

## La ventana, parte por parte {#ventana}

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-hoy.webp" alt="La ventana entera en la vista Hoy: barra de título arriba, columna de iconos a la izquierda, columna de conversaciones y, a la derecha, el saludo, cuatro tarjetas y las sugerencias.">La ventana: barra de título, iconos, conversaciones y la vista abierta.</Shot>

### La barra de título {#barra-titulo}

Forma parte de la ventana. Tiene las flechas para volver a las vistas que has visitado, el botón que muestra u oculta la columna de conversaciones y los menús **Archivo**, **Editar**, **Ver** y **Ayuda**. En **Ver** están la recarga, el zoom y la pantalla completa; en **Ayuda**, esta documentación.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-barra-titulo-menu.webp" alt="La barra de título con el menú Ver abierto: Recargar, Tamaño real, Ampliar, Reducir y Pantalla completa.">El menú Ver de la barra de título.</Shot>

### La columna de iconos {#iconos}

A la izquierda del todo, cinco iconos:

- **Hoy.** Lo primero que ves: lo que miyagi te dijo al saludar, las tarjetas de resumen y las sugerencias.
- **Asignatura.** Con pestañas: **Programación**, **Temas y actividades**, **Materiales** y **En el horno**.
- **Memoria.** Con pestañas: **Base de conocimiento** y **Fuentes**.
- **Tu aula.** El curso de Moodle de esta asignatura. Un punto verde indica que está vinculada.
- **Extensiones.** Con pestañas: **Instaladas**, **Mis comandos**, **Catálogo**, **Repositorios** y **Capacidades**.

Abajo, el **?** (ayuda y visita guiada), el tema claro u oscuro, y la versión.

### La columna de conversaciones {#conversaciones}

Arriba, el selector de asignatura y, debajo, **Nueva conversación**. La búsqueda encuentra una palabra en todas las conversaciones de la asignatura.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-buscar.webp" alt="La búsqueda en la columna de conversaciones con resultados para JOIN.">Buscar en todas las conversaciones.</Shot>

La **campana** cuenta lo que te espera: una aprobación, una pregunta, fuentes sin incorporar o actividades en el horno.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-campana.webp" alt="La campana abierta: 3 fuentes por incorporar y 1 actividad en el horno.">La campana, con lo que tienes pendiente.</Shot>

Tus conversaciones aparecen por fecha y, encima, las que hayas **fijado**. Con el **⋯** de cada una la fijas. Puedes ensanchar la columna arrastrando su borde o plegarla con su botón. Al pie, si hay un trabajo en marcha, ves la tarea en curso y cuál de cuántas es.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-fijadas.webp" alt="La columna de conversaciones con dos conversaciones fijadas encima de las recientes.">Conversaciones fijadas sobre las recientes.</Shot>

### El chat {#chat}

Lo que escribes va a la derecha; lo que responde miyagi, a todo el ancho, con sus acciones plegadas en una línea que puedes abrir. Lo que nombra de tu asignatura (una fuente, un material, una página de su memoria) es un enlace que abre esa vista.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-chat.webp" alt="Una conversación: la petición del profesor y miyagi trabajando sobre la guía del curso, con sus acciones plegadas.">Una conversación real.</Shot>

En el cuadro para escribir, `Intro` envía y `Mayús+Intro` salta de línea. El **+** añade un archivo a tus fuentes, o elige una acción del catálogo. El **/** muestra los atajos:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-comandos.webp" alt="El menú de atajos abierto encima del cuadro de escritura, al pulsar la barra.">Los atajos, al escribir /.</Shot>

El **modo** dice cuánto trabaja sin preguntarte (también se cambia con `Mayús+Tab`):

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-modo.webp" alt="El selector de modo abierto: Guiado, Interactivo y Plan, con la explicación de cada uno.">Guiado, Interactivo o Plan.</Shot>

Cuando miyagi va a publicar algo, la aprobación ocupa el sitio del cuadro para escribir hasta que respondes: **Aprobar**, **Rechazar** o **Parar todo**. Si rechazas, explícale por qué en tu siguiente mensaje.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-aprobacion-publicar.webp" alt="Un panel de aprobación para crear una página oculta en la sección General, con la pestaña Actividad abierta al lado.">Una aprobación para publicar una página, con la actividad del turno al lado.</Shot>

También te pregunta cuando le hace falta una decisión tuya:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-pregunta.webp" alt="miyagi preguntando con varias opciones en el lugar del cuadro de escritura.">miyagi te pregunta con opciones.</Shot>

Mientras trabaja no se le pueden enviar mensajes nuevos: espera a que termine, o páralo con `Esc` o con el botón ■ y dile otra cosa.

### El panel lateral {#panel-lateral}

Se abre a la derecha, en pestañas, sin dejar la conversación. Tienes el botón para abrirlo arriba a la derecha. Muestra tres cosas:

- **Borradores.** Un material o un archivo que miyagi ha preparado, para revisarlo mientras conversas.
- **Actividad del turno.** Lo que está haciendo paso a paso.
- **Páginas web**, con el navegador integrado (solo en la aplicación de escritorio).

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-borrador-al-lado.webp" alt="Un borrador, ejemplos-join.html, abierto en el panel lateral junto a la conversación.">Un borrador al lado de la conversación.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-actividad-trabajando.webp" alt="La pestaña Actividad del panel lateral durante un turno de trabajo, con las acciones una a una.">La actividad del turno, una acción detrás de otra.</Shot>

### El navegador integrado {#navegador-integrado}

Con el botón de la barra del panel abres una pestaña web. Los enlaces de la conversación se abren ahí. Sirve para tener tu curso de Moodle al lado: inicias sesión una vez en una pestaña y sigues dentro aunque cierres la aplicación.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-navegador-moodle.webp" alt="El navegador integrado en el panel lateral, con el curso de Moodle abierto con la sesión del profesor, junto a la conversación.">Moodle al lado de la conversación.</Shot>

Esa sesión es solo tuya: **miyagi no la ve**, ni lo que hay en esas pestañas. miyagi entra en Moodle por su cuenta con la extensión moodle-teacher, con el inicio de sesión que hiciste en su propia ventana. Son dos sesiones distintas, y por eso puede que tengas que iniciar sesión en las dos.

### Las vistas de tu asignatura {#vistas}

Estas vistas enseñan lo que miyagi sabe y tiene preparado. Sus botones mandan a la conversación lo que pide esa acción, con las mismas aprobaciones de siempre. Cada elemento tiene su **⋯**, con lo que miyagi puede hacer con él.

**Hoy** lo tienes arriba. **Programación** es tu programación didáctica tal como está en su memoria:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-programacion.webp" alt="La vista Programación con el texto de la programación didáctica y su botón para revisarla con miyagi.">La programación didáctica.</Shot>

**Temas y actividades** muestra cada unidad con sus actividades:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-temas.webp" alt="La vista Temas y actividades: cuatro tarjetas de unidad, cada una con sus actividades.">Cuatro temas con sus actividades.</Shot>

**Materiales** es lo que miyagi prepara antes de publicar, con una vista previa:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-materiales.webp" alt="La vista Materiales: la lista de materiales y la vista previa del seleccionado.">Materiales, con su vista previa.</Shot>

**En el horno** son las actividades que van por fases: en plan, cocinándose, probándose oculta y servida.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-horno.webp" alt="La vista En el horno, con cuatro columnas y el cuestionario del Tema 1 en Probándose oculto.">En el horno, con un cuestionario probándose oculto.</Shot>

**Base de conocimiento** son las páginas que miyagi escribe y consulta sobre tu curso:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-base-conocimiento.webp" alt="La vista Base de conocimiento: la lista de páginas y el mapa del curso abierto.">Sus apuntes, con el mapa del curso abierto.</Shot>

**Fuentes** son tus documentos. Arrastra aquí los nuevos y pulsa **Pedir a miyagi que los incorpore**.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-fuentes.webp" alt="La vista Fuentes: la zona para arrastrar archivos y la lista de documentos con su estado.">Tus documentos, con su estado.</Shot>

### Tu aula {#tu-aula}

Enseña el curso de Moodle de la asignatura y si miyagi llega a él, con accesos a lo que miyagi hace con tu curso: orientarse, ver cómo va la clase, revisarlo a fondo y abrir el mapa del curso.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-tu-aula.webp" alt="La vista Tu aula de la asignatura de SQL: el aula vinculada y sus atajos.">Tu aula, en la asignatura de SQL.</Shot>

### Extensiones {#extensiones}

Las extensiones le dan a miyagi capacidades nuevas. Aquí ves las instaladas, añades otras del catálogo y creas tus propios comandos.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-extensiones-instaladas.webp" alt="La pestaña Instaladas con las tarjetas de moodle-teacher y docker-lab.">Las extensiones instaladas.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-extensiones-catalogo.webp" alt="La pestaña Catálogo con extensiones y sus botones Añadir.">El catálogo.</Shot>

Al añadir una, te enseña qué declara antes de instalarla:

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-extension-anadir.webp" alt="El diálogo Añadir docker-lab: lo que declara, servidores remotos, lo que necesita en tu ordenador y sus capacidades.">Antes de instalar, lo que declara.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-extensiones-capacidades.webp" alt="La pestaña Capacidades: una tabla de lo que miyagi puede hacer y gracias a qué.">Capacidades: lo que puede hacer y gracias a qué.</Shot>

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-mis-comandos.webp" alt="La pestaña Mis comandos, todavía sin comandos propios.">Mis comandos, para crear los tuyos.</Shot>

Los detalles están en [Extensiones](/avanzado/extensiones/).

### Tema claro u oscuro {#tema}

El icono del sol, abajo en la columna de iconos, cambia entre claro, oscuro y el del sistema.

<Shot width="1400" height="875" kind="desktop" src="/img/v2/desktop-chat-oscuro.webp" alt="Una conversación en tema oscuro, con una tabla de respuestas del foro.">El tema oscuro.</Shot>

## Cerrar y volver {#volver}

No hay nada que guardar: todo se va guardando solo. La aplicación recuerda el tamaño de su ventana y al abrirla vuelve a la última asignatura que usaste. Solo puede haber una ventana abierta a la vez.

Si una conversación no arranca en cinco minutos, se reabre sola y te avisa.

Si algo no va como esperas, mira [Consejos y problemas](problemas.md).
