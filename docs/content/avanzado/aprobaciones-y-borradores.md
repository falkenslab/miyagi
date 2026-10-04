---
title: Aprobaciones y borradores
sidebar_position: 6
description: "Cómo se controla lo que llega a los alumnos: la aprobación antes de publicar, el gancho que la hace cumplir, los borradores ocultos, la validación de subidas y lo que nunca hace."
---

# Aprobaciones y borradores

miyagi trabaja con tu cuenta en tu curso real. Todo su diseño gira alrededor de una regla: **el profesor aprueba cada cambio que verán los alumnos**. Esta página explica las piezas que la hacen cumplir.

## La aprobación

Justo antes de guardar una nota o una retroalimentación, publicar en el foro, publicar contenido nuevo o guardar un cambio en la configuración de una actividad o del curso, el asistente llama a su herramienta `request_human_approval` con un resumen de lo que va a publicar. Tú ves un panel con ese resumen y tres opciones: **Sí**, **No** o **Parar**. Si dices que no, no lo publica y te cuenta qué ha pasado.

Las reglas de cuándo y cómo pedirla están en la habilidad [`publish-check`](https://github.com/falkenslab/miyagi/blob/main/plugin/skills/publish-check/SKILL.md):

- **Un elemento por aprobación cuando es contenido nuevo**: el texto de una sección, una página, un enunciado, un conjunto de preguntas (enumerando cada una), una rúbrica. Tres secciones son tres aprobaciones; crear un cuestionario e importar sus preguntas son dos.
- **Un lote solo si el resumen lo enumera todo**: varias notas pueden ir en una aprobación si el resumen nombra a cada estudiante con su nota y lo esencial de la retroalimentación.
- **El mismo cambio de configuración** en varios elementos (intentos ilimitados en tres cuestionarios, por ejemplo) puede compartir aprobación si el resumen nombra cada elemento y el cambio exacto.
- **Compromisos en tu nombre** (un plazo de respuesta en el foro, retroalimentación para una fecha, material extra) son decisión tuya: si no los has hecho tú, los deja fuera de lo que leen los alumnos o los nombra uno a uno en el resumen para que los apruebes sabiéndolo.

El resumen te habla en tu idioma, y cita tal cual, en el idioma del curso, el texto que se va a publicar.

## El gancho que la hace cumplir

Que el asistente pida permiso no depende solo de que se acuerde. En una sesión real, antes de existir este gancho, un recurso de tipo Archivo quedó visible para los alumnos unos 35 segundos antes de que el asistente se diera cuenta y lo ocultara ([ADR-008](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-008-publish-gate.md)). Desde entonces, en modo `guided`, un gancho del programa ([`src/publishGate.ts`](https://github.com/falkenslab/miyagi/blob/main/src/publishGate.ts)) revisa cada acción del navegador antes de que se ejecute:

- Si es una acción que publica y no hay una aprobación vigente, la detiene y te muestra el panel «Publicación sin aprobación previa» con lo que iba a hacer. Si dices que sí, se ejecuta esa acción y solo esa. Si dices que no, se bloquea y se le indica al asistente que no la repita sin pedir aprobación antes.
- Una aprobación vale hasta la siguiente petición de aprobación o hasta tu siguiente mensaje, para que una aprobación de seis notas cubra los seis «Guardar cambios».
- Un borrado nunca queda cubierto por una aprobación anterior: pulsar «Eliminar» o «Borrar» siempre te pregunta, aunque acabes de aprobar otra cosa.

**Qué cuenta como publicar** (`isPublishAction()`):

- Pulsar un botón o elemento de menú de Moodle cuyo nombre indica que guarda, envía, publica, importa, duplica, oculta, muestra, amplía un plazo, hace disponible o borra algo, en inglés o en español (con los textos de Moodle 5.2): «Guardar cambios», «Enviar al foro», «Importar», «Ocultar», «Mostrar en la página del curso», «Ampliar plazo»… No cuentan «Cancelar», «Buscar» ni «Filtrar».
- Escribir en un campo y enviar con Intro, salvo en el formulario de inicio de sesión o en un buscador.
- Un script en la página que envía un formulario, pulsa un botón de enviar o hace una petición POST a Moodle.
- Abrir una dirección con `sesskey`, que es como Moodle firma sus enlaces de acción (ocultar, mostrar, mover).

Un falso positivo solo cuesta un panel de más; por eso la lista es generosa. Pulsar Intro suelto no lo detecta el gancho (no lleva destino para distinguir un buscador de un formulario); ahí sigue valiendo la regla de las instrucciones.

**Cuándo actúa**: solo en `guided`, que es el modo del chat y el recomendado para `run`. En `interactive` ya se te pregunta antes de cada acción, en `plan` no puede usar el navegador, y `autonomous` publica sin preguntar por diseño. Si en el chat cambias de modo con `Shift+Tab`, el gancho lo sigue al momento. No revisa lo que hacen los ayudantes, que no pueden publicar.

## Lo nuevo, primero oculto: los borradores

Todo recurso nuevo (una página, un archivo, un cuestionario, un H5P, una tarea, un tema entero) se prueba en Moodle antes de que lo vean los alumnos ([ADR-009](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-009-hidden-drafts.md)):

1. **Lo construye en `drafts/<slug>/`**: el código fuente editable (el HTML, el archivo GIFT, el texto de la página, sus imágenes).
2. **Lo sube oculto.** Marca «Ocultar en la página del curso» antes del primer guardado (o oculta la sección si es un tema nuevo). El resumen de la aprobación dice que sube **oculto, para probarlo**. No envía notificación de cambio de contenido.
3. **Lo prueba como profesor, en Moodle**: lo abre y lo usa como lo haría un alumno: la vista previa del cuestionario, el H5P, cada enlace y cada parte interactiva, y la página en una ventana estrecha. Si algo falla, lo corrige en `drafts/` y lo reemplaza (con otra aprobación).
4. **Lo apunta en la página `course/drafts`** (`knowledge/drafts.md`): una línea por borrador oculto, con su enlace y lo que falta.
5. **Te cuenta qué ha probado y te pide permiso para mostrarlo.** Mostrarlo es otra publicación, con su propia aprobación. Después lo quita de `drafts.md` y lo revisa ya como alumno («Cambiar rol a… Estudiante»).

Si prefieres no mostrarlo todavía, se queda oculto y en `drafts.md`. Al cerrar la sesión, miyagi te avisa de que hay recursos ocultos sin mostrar, y en el siguiente chat te los menciona al saludar.

Los cambios en algo que los alumnos ya ven (una errata, una fecha, un enlace roto) no pasan por borrador: se guardan en su sitio, con su aprobación.

En su primera prueba, este flujo encontró dos fallos reales que los alumnos no llegaron a ver: la importación GIFT perdía la sangría del código y una actividad HTML incrustada se veía en una caja de 500×400 px en el móvil ([informe](https://github.com/falkenslab/miyagi/blob/main/tests/2026-09-28T15-41-draft-testing/README.md)).

## La validación de subidas

Antes de que el navegador suba a Moodle un archivo `.gift` o `.html`, otro gancho ([`src/uploadGate.ts`](https://github.com/falkenslab/miyagi/blob/main/src/uploadGate.ts)) lo revisa con código. Si encuentra errores, rechaza la subida con la lista (línea a línea) para que el asistente corrija el archivo en `drafts/` y lo vuelva a subir. Los avisos dejan pasar la subida pero le llegan al asistente. Actúa en todos los modos: un archivo roto nunca se quiere, lo haya aprobado quien lo haya aprobado.

**En un GIFT**, lo que el importador de Moodle rechazaría o leería mal:

- llaves `{ }` desequilibradas o más de un bloque de respuestas por pregunta;
- un nombre de pregunta (`::nombre::`) sin cerrar o repetido;
- `=` o `~` sin escapar dentro de una respuesta, o más de un `#` sin escapar;
- opción múltiple sin respuesta correcta, o con varias `=`;
- pesos fuera de -100…100, o respuestas correctas cuyos pesos no suman 100 % (aviso);
- respuestas numéricas mal escritas (por ejemplo, con coma decimal);
- preguntas de emparejamiento a las que les falta `->`, o con menos de 3 pares (aviso);
- líneas con sangría, que el importador pierde: el código debe ir como `[html]` con `&nbsp;` dentro de `<pre>`.

**En un HTML**:

- sin `<meta name="viewport">`, que en el móvil lo deja diminuto e ilegible (error);
- un archivo local referenciado (imagen, script, hoja de estilos) que no existe junto a la página (error);
- sin `lang` en `<html>`, que hace que los lectores de pantalla lo lean en otro idioma (aviso);
- scripts u hojas de estilo cargados desde otro sitio, que pueden bloquearse o cambiar (aviso).

## La caja de herramientas de `drafts/`

El asistente principal no tiene terminal. Para trabajar con archivos dentro de `drafts/` tiene un servidor propio ([`src/drafts/`](https://github.com/falkenslab/miyagi/tree/main/src/drafts)), disponible en `chat` y `run`:

| Herramienta | Qué hace |
| --- | --- |
| `drafts_list` | Lista una carpeta de `drafts/` con tamaño y fecha de cada elemento. |
| `drafts_mkdir` | Crea una carpeta. |
| `drafts_copy` | Copia un archivo o una carpeta, binarios incluidos. |
| `drafts_move` | Mueve o renombra un archivo o una carpeta. |
| `drafts_delete` | Borra un archivo o una carpeta dentro de `drafts/` (nunca `drafts/` misma). |
| `drafts_download` | Descarga una dirección http o https a un archivo, con límite de tamaño y de 60 segundos. |
| `drafts_fetch_site` | Carga una página web en un navegador sin ventana y la guarda con todo lo que carga (HTML, CSS, JS, imágenes, fuentes), manteniendo los enlaces relativos. |
| `drafts_unzip` | Descomprime un ZIP en una carpeta de `drafts/`. |
| `drafts_zip` | Comprime una carpeta en un ZIP (por ejemplo, un paquete SCORM). |
| `drafts_pdf` | Imprime un HTML o un Markdown a PDF (A4). |
| `drafts_info` | Dice el tipo real de un archivo (por su contenido, no por su nombre), su tamaño, las dimensiones si es una imagen y su SHA-256. |

Sus garantías: toda ruta se resuelve dentro de `drafts/` (sin `..`, rutas absolutas ni enlaces que salgan); solo descarga por http y https; un ZIP no puede escribir fuera de su carpeta ni pasar de los límites de tamaño y de número de archivos; nada se ejecuta. La página web y el PDF se generan con el mismo Chrome del sistema, sin ventana. Los límites se cambian en [`draftsLimits`](configuracion.md).

## Lo que nunca hace

Sus instrucciones, en todos los modos, le prohíben:

- **borrar** nada en Moodle (recursos, actividades, mensajes): lo que deja oculto se queda oculto hasta que tú lo muestres o lo quites;
- **cambiar matrículas** de ningún estudiante;
- **tocar la configuración de la plataforma** Moodle;
- **salir de tu curso** o entrar en otros cursos de Moodle.

Aun así, usa `guided` (o el chat) para revisar lo que publica: la regla está en las instrucciones, y el gancho de publicación detendría también un borrado sin aprobar.
