---
title: Aprobaciones y borradores
sidebar_position: 6
description: "Cómo se controla lo que llega a los alumnos: la aprobación antes de publicar, el gancho que la hace cumplir, los borradores ocultos, la revisión del GIFT y lo que nunca hace."
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

Que el asistente pida permiso no depende solo de que se acuerde. En una sesión real, antes de existir este gancho, un recurso de tipo Archivo quedó visible para los alumnos unos 35 segundos antes de que el asistente se diera cuenta y lo ocultara ([ADR-008](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-008-publish-gate.md)). Desde entonces, en modo `guided`, un gancho del programa revisa cada herramienta de una extensión (moodle-teacher, docker-lab) antes de que se ejecute. Es el de agent-kit, en el que se apoya miyagi:

- Si es una herramienta que cambia algo y no hay una aprobación vigente, la detiene y te muestra el panel «¿Dejas que moodle-teacher haga esto?» con la herramienta y sus parámetros. Respondes **Sí** (esa llamada), **Sí, en esta sesión** (esa herramienta, hasta que cierres la sesión), **Sí, siempre**, **No** o **No, nunca**. Con un no se bloquea y se le indica al asistente que no la repita sin preguntarte antes. «Siempre» y «nunca» se guardan para las siguientes sesiones.
- Una aprobación vale hasta la siguiente petición de aprobación o hasta tu siguiente mensaje, para que una aprobación de seis notas, con el resumen enumerándolas todas, cubra las seis llamadas.
- Borrar o quitar nunca queda cubierto por una aprobación anterior: esas herramientas siempre te preguntan, aunque acabes de aprobar otra cosa, y no te ofrecen «Sí, siempre».
- Para ver o olvidar lo que respondiste con «siempre» o «nunca»: `miyagi extension config moodle-teacher confirm=reset` (o `/extensions config` en el chat). `confirm=off` hace que esa extensión no pregunte nunca: decisión tuya, y no la recomendamos para Moodle.

**Qué cuenta como publicar**: cualquier herramienta de una extensión que no esté marcada como de solo lectura. moodle-mcp marca así las que solo leen (consultar el curso, las entregas, el foro) y las de su sesión, que nunca preguntan, y marca como destructivas las que borran o quitan, que preguntan siempre. Lo que no está marcado pregunta: un falso positivo solo cuesta un panel de más.

**Cuándo actúa**: solo en `guided`, que es el modo del chat y el recomendado para `run`. En `interactive` ya se te pregunta antes de cada herramienta, en `plan` no cambia nada en Moodle, y `autonomous` publica sin preguntar por diseño. Si en el chat cambias de modo con `Shift+Tab`, el gancho lo sigue al momento. Los ayudantes no tienen herramientas de Moodle.

## Lo nuevo, primero oculto: los borradores

Todo recurso nuevo (una página, un archivo, un cuestionario, un H5P, una tarea, un tema entero) se prueba en Moodle antes de que lo vean los alumnos ([ADR-009](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-009-hidden-drafts.md)):

1. **Lo construye en `drafts/<slug>/`**: el código fuente editable (el HTML, el archivo GIFT, el texto de la página, sus imágenes).
2. **Lo pone oculto en el aula**, desde el primer guardado (o oculta la sección si es un tema nuevo). El resumen de la aprobación dice que va **oculto, para probarlo**. No avisa a los alumnos del cambio. Cómo se hace en Moodle lo trae la habilidad de publicación de moodle-teacher.
3. **Lo prueba como profesor**: lee lo que ha guardado el aula y comprueba que funciona como lo usaría un alumno: el cuestionario, el H5P, cada enlace y cada parte interactiva, y la página en un ancho estrecho. Lo que sus herramientas no pueden probar, te pide que lo pruebes tú, con su enlace. Si algo falla, lo corrige en `drafts/` y lo reemplaza (con otra aprobación).
4. **Lo apunta en la página `course/drafts`** (`knowledge/drafts.md`): una línea por borrador, que empieza por su fase (`hidden`), con su enlace y lo que falta.
5. **Te cuenta qué ha probado y te pide permiso para mostrarlo.** Mostrarlo es otra publicación, con su propia aprobación. Después marca su línea como `served` y lo revisa ya como lo vería un alumno, hasta donde le deja la extensión (o te pide que lo mires con la vista de estudiante).

Si prefieres no mostrarlo todavía, se queda oculto y en `drafts.md`.

## Las actividades en marcha

`course/drafts` es el registro de todo lo que está en marcha, no solo de lo oculto: una línea por actividad, con su fase primero, entre comillas invertidas, para que el programa pueda contarlas:

- `planning`: con su plan en `drafts/<slug>/plan.md`, a la espera de que lo apruebes.
- `building`: construyéndose en `drafts/<slug>/`.
- `hidden`: subida oculta al aula, probándose.
- `served`: ya la ven los alumnos; la siguiente sesión te lo dice y la quita.

Las tres primeras fases las recorre la habilidad `activity-lifecycle` con algo nuevo y complejo, con una aprobación para pasar de cada fase a la siguiente; un borrador oculto sin ese proceso es una línea `hidden`. Una página de antes, sin fases, cuenta todo como `hidden`. Al cerrar la sesión, miyagi te dice cuántas hay en cada fase («En el horno: 1 en plan, 2 cocinándose, 1 probándose oculto»), y el siguiente chat te lo cuenta al saludar.

Los cambios en algo que los alumnos ya ven (una errata, una fecha, un enlace roto) no pasan por borrador: se guardan en su sitio, con su aprobación.

En su primera prueba, este flujo encontró dos fallos reales que los alumnos no llegaron a ver: la importación GIFT perdía la sangría del código y una actividad HTML incrustada se veía en una caja de 500×400 px en el móvil ([informe](https://github.com/falkenslab/miyagi/blob/main/tests/2026-09-28T15-41-draft-testing/README.md)).

## La revisión del GIFT

Antes de que moodle-teacher importe preguntas en formato GIFT a un banco (`import_questions`, con el GIFT como texto o como archivo), otro gancho ([`src/uploadGate.ts`](https://github.com/falkenslab/miyagi/blob/main/src/uploadGate.ts)) lo revisa con código. Si encuentra errores, rechaza la importación con la lista (línea a línea) para que el asistente corrija el GIFT en `drafts/` y lo vuelva a importar. Los avisos dejan pasar la importación pero le llegan al asistente. Actúa en todos los modos: un banco roto nunca se quiere, lo haya aprobado quien lo haya aprobado.

**En un GIFT**, lo que el importador de Moodle rechazaría o leería mal:

- llaves `{ }` desequilibradas o más de un bloque de respuestas por pregunta;
- un nombre de pregunta (`::nombre::`) sin cerrar o repetido;
- `=` o `~` sin escapar dentro de una respuesta, o más de un `#` sin escapar;
- opción múltiple sin respuesta correcta, o con varias `=`;
- pesos fuera de -100…100, o respuestas correctas cuyos pesos no suman 100 % (aviso);
- respuestas numéricas mal escritas (por ejemplo, con coma decimal);
- preguntas de emparejamiento a las que les falta `->`, o con menos de 3 pares (aviso);
- líneas con sangría, que el importador pierde: el código debe ir como `[html]` con `&nbsp;` dentro de `<pre>`.

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

- **borrar** en Moodle nada que no haya creado él: lo que deja oculto se queda oculto hasta que tú lo muestres o lo quites;
- **cambiar matrículas** de ningún estudiante, ni los grupos;
- **tocar la configuración de la plataforma** Moodle;
- **salir de tu curso** o entrar en otros cursos de Moodle.

Lo que moodle-teacher no tiene herramienta para hacer, no lo intenta por otro camino: te lo dice, lo prepara en `drafts/` y te da los pasos para hacerlo tú.

Aun así, usa `guided` (o el chat) para revisar lo que publica: la regla está en las instrucciones, y el gancho de publicación detendría también un borrado sin aprobar.
