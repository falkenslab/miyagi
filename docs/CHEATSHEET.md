# teacher-agent · CheatSheet

**teacher-agent** es un asistente que lleva contigo tu curso de Moodle. Entra con tu cuenta de profesor en una ventana de Chrome y trabaja como lo harías tú: corrige entregas, responde en el foro, crea apuntes y cuestionarios, revisa el curso y te dice cómo va la clase. Tú hablas con él en la terminal, con tus palabras, y **nada que vean tus estudiantes se publica sin tu permiso**.

Esta CheatSheet está pensada para empezar a usarlo hoy mismo: instalarlo, conectarlo a un curso y probarlo con casos de uso que van de lo más sencillo a lo más ambicioso. La guía completa está en el [README](../README.md).

## Índice

1. [Por qué merece la pena](#1-por-qué-merece-la-pena)
2. [Instalación paso a paso](#2-instalación-paso-a-paso)
3. [Conectarlo a tu curso: un ejemplo completo](#3-conectarlo-a-tu-curso-un-ejemplo-completo)
4. [El chat en un minuto](#4-el-chat-en-un-minuto)
5. [Casos de uso, de menos a más](#5-casos-de-uso-de-menos-a-más)
   - [Nivel 1 · Preguntar sin tocar nada](#nivel-1--preguntar-sin-tocar-nada)
   - [Nivel 2 · El día a día del profesor](#nivel-2--el-día-a-día-del-profesor)
   - [Nivel 3 · Crear contenido](#nivel-3--crear-contenido)
   - [Nivel 4 · Diseñar y revisar el curso](#nivel-4--diseñar-y-revisar-el-curso)
   - [Nivel 5 · Construir temas y cursos enteros](#nivel-5--construir-temas-y-cursos-enteros)
   - [Nivel 6 · Adaptarlo a tu forma de trabajar](#nivel-6--adaptarlo-a-tu-forma-de-trabajar)
6. [La memoria: se acuerda de tu curso](#6-la-memoria-se-acuerda-de-tu-curso)
7. [Una semana con teacher-agent](#7-una-semana-con-teacher-agent)
8. [Fuera del chat: tareas de una sola orden](#8-fuera-del-chat-tareas-de-una-sola-orden)
9. [Consejos y problemas frecuentes](#9-consejos-y-problemas-frecuentes)
10. [Referencia rápida](#10-referencia-rápida)

## 1. Por qué merece la pena

- 🧭 **Trabaja en tu Moodle real.** No se inventa nada: para responder, abre las páginas del curso y lee lo que hay de verdad (entregas, calificaciones, foro, informes). Puedes ver en la ventana de Chrome todo lo que hace.
- 🧠 **Tiene memoria.** Toma apuntes del curso mientras trabaja: tus criterios de corrección, las rúbricas, las dudas que se repiten en el foro, cómo evoluciona la clase, qué ha creado y por qué. En la siguiente conversación, aunque sea semanas después, parte de ahí. [Más abajo](#6-la-memoria-se-acuerda-de-tu-curso) se explica cómo.
- ✋ **Te pide permiso.** Antes de guardar una nota, responder en el foro, publicar un recurso o cambiar una actividad, te enseña lo que va a hacer y espera tu sí. Nunca borra nada, no toca matrículas ni sale de tu curso.
- 📏 **Tus criterios mandan.** Si le das tu rúbrica, tu solucionario o tu política de entregas tardías, corrige con ellos, igual para todos, y apunta cuál aplicó.
- 🎓 **Sabe de pedagogía.** Diseña con objetivos y criterios de evaluación, elige metodologías (proyectos, retos, clase invertida, gamificación…), escribe preguntas con distractores creíbles y revisa lo que publica como lo vería un alumno, incluida la accesibilidad.
- 🤝 **Tiene ayudantes.** Un *investigador* que busca en internet con fuentes citadas, un *revisor pedagógico* que da una segunda opinión y, si lo activas, un *probador de prácticas* que las ejecuta en Docker antes de publicarlas.
- 🔒 **Tu contraseña no la ve.** Se queda en tu ordenador; es Chrome quien la escribe en Moodle. El asistente no puede leer ese archivo.
- 🗣️ **Habla como tú quieras.** Eliges su tono con los estudiantes (formal, cercano, motivador) y el idioma.

## 2. Instalación paso a paso

**Necesitas**:

1. **Google Chrome** ([google.com/chrome](https://www.google.com/chrome/)).
2. **Node.js 20 o posterior**: descarga la versión **LTS** de [nodejs.org](https://nodejs.org/) e instálala con las opciones por defecto.
3. **Una suscripción de Claude Pro o Max** ([claude.ai](https://claude.ai)).
4. Un curso de Moodle en el que seas **profesor**. Para probar sin miedo, mejor un curso de pruebas o una copia de uno real.

**Instálalo**:

1. Abre una terminal: en **Windows**, tecla Windows → escribe `PowerShell`; en **Mac**, `Cmd + Espacio` → escribe `Terminal`.
2. Pega esta línea y pulsa Intro (tarda uno o dos minutos; los avisos amarillos `warn` son normales):

   ```bash
   npm install -g https://github.com/falkenslab/teacher-agent/releases/latest/download/teacher-agent.tgz
   ```

   En Mac, si da un error de permisos, ponle `sudo ` delante.
3. Comprueba que está:

   ```bash
   teacher-agent --version
   ```

Para **actualizarlo**, repite el paso 2. Para **desinstalarlo**: `npm uninstall -g teacher-agent`.

## 3. Conectarlo a tu curso: un ejemplo completo

Supongamos que das **Bases de Datos** en 1.º de DAW y tu curso está en `https://moodle.iesejemplo.es/course/view.php?id=42`.

### Paso 1 · Una carpeta para el curso

Cada curso tiene su carpeta: ahí viven su configuración, tus documentos y la memoria del asistente.

```bash
mkdir bases-de-datos
cd bases-de-datos
```

### Paso 2 · `teacher-agent init`

```bash
teacher-agent init
```

Responde a sus preguntas (esto es lo que contestaría nuestro profesor):

| Te pregunta | Respuesta de ejemplo | Consejo |
| --- | --- | --- |
| URL de Moodle | `https://moodle.iesejemplo.es/course/view.php?id=42` | Abre el curso en el navegador y copia la dirección entera: saca de ahí el número de curso. |
| Usuario con rol de profesor | `mgarcia` | En blanco si prefieres iniciar sesión tú cada vez en la ventana de Chrome. |
| Contraseña | `********` | Solo si has puesto usuario. |
| Etiqueta / descripción | `Bases de Datos 1.º DAW` | Solo para reconocer la carpeta. |
| Tono de voz | Cercano | Es como hablará a tus estudiantes en el foro y en la retroalimentación. |
| Idioma | `español` | En blanco, te responde en el idioma en que le escribas. |
| ¿Probar prácticas en Docker? | No | Actívalo más tarde si das informática y tienes Docker. |
| ¿Crear `instructions.md`? | Sí | Un archivo para tus instrucciones fijas ([nivel 6](#nivel-6--adaptarlo-a-tu-forma-de-trabajar)). |
| ¿Explorar ahora este Moodle? | **Sí** | Mira qué tipos de actividad y de pregunta admite tu centro, sin crear ni cambiar nada. |

**La primera vez** te pedirá conectar tu cuenta de Claude: se abre el navegador, inicias sesión y vuelves a la terminal. Solo una vez por ordenador.

Al terminar tendrás:

```
bases-de-datos/
  config.json        tu Moodle y tu usuario (solo en tu ordenador; el asistente no puede leerlo)
  instructions.md    tus instrucciones fijas para este curso
  sources/           aquí dejas TUS documentos: programación, rúbricas, soluciones, apuntes
  knowledge/         aquí escribe ÉL: su memoria del curso
  drafts/            lo que construye para Moodle (actividades, cuestionarios…), editable
```

### Paso 3 · Dale tu material (opcional, pero marca la diferencia)

Copia en `sources/` lo que tengas: la programación, las rúbricas, los enunciados con su solución, tus criterios ("las entregas tarde, un 20 % menos"). Luego:

```bash
teacher-agent ingest
```

Los lee sin abrir Moodle y los incorpora a su memoria. También puedes hacerlo desde el chat con `/knowledge:ingest`.

### Paso 4 · Tu primera conversación

```bash
teacher-agent chat
```

Se abre Chrome, entra en el curso y te pregunta qué necesitas. Buen primer mensaje:

> **Tú:** /teacher-agent:orient
>
> **Asistente:** *(recorre la página del curso, la guía docente y el calificador)* El curso tiene 6 temas y se evalúa con 4 tareas (60 %) y 2 cuestionarios (40 %). La próxima entrega es la Tarea 3, el día 14. Los avisos van por el foro de Novedades y las dudas por el foro general. Lo he apuntado en mis notas del curso.

A partir de aquí, sigue con los casos de uso. 👇

## 4. El chat en un minuto

Siempre desde la carpeta del curso: `teacher-agent chat` (o `teacher-agent chat --dir <carpeta>` desde cualquier sitio).

| Qué quieres | Qué haces |
| --- | --- |
| Pedirle algo | Escríbelo con tus palabras y pulsa Intro |
| Aprobar lo que va a publicar | **Intro**, `1` o `y` |
| Rechazarlo | `2` o `n` (y dile qué cambiar) |
| Cortar lo que está haciendo sin salir | `Esc` |
| Que te consulte cada paso, no solo lo que publica | `Shift+Tab` (pasa de guided a interactive y vuelta) |
| Ver lo que ya ha salido de pantalla | Rueda del ratón o `RePág`/`AvPág` |
| Copiar texto | Arrástralo con el ratón y haz clic derecho |
| Ver los atajos de teclado | `?` con el prompt vacío |
| Salir | `/exit` (todo se guarda solo) |
| Ver los atajos disponibles | `teacher-agent commands` (fuera del chat) |

**Atajos** (escríbelos con lo que necesites detrás):

| Atajo | Para qué |
| --- | --- |
| `/teacher-agent:orient` | Conocer el aula: evaluación, plazos, canales |
| `/teacher-agent:grade` | Corregir las entregas pendientes |
| `/teacher-agent:forum` | Revisar el foro e intervenir si hace falta |
| `/teacher-agent:progress` | Ver cómo va la clase y quién se queda atrás |
| `/teacher-agent:quiz <tema>` | Crear un cuestionario |
| `/teacher-agent:build-unit <descripción>` | Construir un tema |
| `/teacher-agent:build-course <descripción>` | Construir un curso completo |
| `/teacher-agent:teaching-plan` | Escribir o revisar la programación didáctica |
| `/teacher-agent:align` | Comprobar que el aula sigue la programación |
| `/teacher-agent:audit` | Auditar el aula y proponer mejoras |
| `/teacher-agent:research <tema>` | Investigar un tema con fuentes |
| `/teacher-agent:map` | Ver las direcciones del curso que tiene apuntadas |
| `/knowledge:ingest` | Incorporar a su memoria los documentos nuevos de `sources/` |
| `/knowledge:query <pregunta>` | Responder a partir de su memoria del curso, sin abrir Moodle |
| `/knowledge:lint` | Revisar que su memoria esté completa y bien enlazada |

Los atajos son solo comodidad: *"corrige lo pendiente"* funciona igual que `/teacher-agent:grade`.

## 5. Casos de uso, de menos a más

Cada caso tiene la **situación**, lo que **le escribes** y lo que **hace**. Empieza por el nivel 1: no publica nada y te sirve para ver cómo trabaja.

### Nivel 1 · Preguntar sin tocar nada

Todo lo de este nivel es solo lectura: ideal para ganar confianza.

**Ponerte al día al volver de unos días fuera**

> ¿Qué ha pasado en el curso desde el lunes? Entregas nuevas, mensajes en el foro y lo que vence esta semana.

Recorre el curso y te hace un resumen con enlaces. No cambia nada.

**Saber qué tienes pendiente**

> ¿Qué entregas tengo sin corregir, de qué tareas y desde cuándo?

**Localizar algo en un curso grande**

> ¿Dónde está el cuestionario del tema 4 y qué configuración tiene (intentos, tiempo, cuándo se ve la nota)?

**Consultar su memoria, sin abrir Moodle**

> /knowledge:query ¿Qué criterio acordamos para las entregas fuera de plazo?

Responde a partir de sus apuntes, citando de dónde lo sacó.

**Ver qué admite tu Moodle**

> ¿Puedo hacer un taller de coevaluación aquí? ¿Y preguntas de arrastrar y soltar?

Lo mira en lo que apuntó al explorar tu Moodle.

### Nivel 2 · El día a día del profesor

Aquí ya actúa, y cada publicación te la enseña antes.

**Corregir una tarea con tu rúbrica**

> Corrige las entregas de la Tarea 2 con la rúbrica que te dejé en sources.

Lee cada entrega, aplica la rúbrica igual para todos y, para cada estudiante, te muestra la nota y la retroalimentación antes de guardarla. Si no te convence una, di `n` y explícale por qué: lo tiene en cuenta para el resto.

**Corregir cuando no hay rúbrica**

> Corrige la Tarea 3. No tengo rúbrica: propónme una antes de empezar.

Te propone criterios, espera tu visto bueno, los guarda en su memoria y los aplica. La próxima vez que corrijas esa tarea (o una parecida) los recordará.

**Atender el foro**

> /teacher-agent:forum

Revisa los hilos recientes y decide si hace falta intervenir: responder una duda sin contestar, animar la participación o dejar que los estudiantes sigan entre ellos. Cada respuesta, con tu aprobación. Apunta las dudas que se repiten, para el tema correspondiente.

**Mandar un aviso a la clase**

> Publica un aviso en Novedades: la entrega de la Tarea 3 se amplía hasta el viernes a las 23:59. Tono cercano.

**Ver quién se queda atrás**

> /teacher-agent:progress

Mira el informe de progreso y las calificaciones, separa a quien va bien de quien se está descolgando y te propone qué hacer. Apunta la tendencia de la clase (no fichas personales), así que la próxima vez te dirá si ha mejorado.

**Ajustar una actividad**

> Amplía el plazo del cuestionario del tema 2 una semana y deja dos intentos en vez de uno.

### Nivel 3 · Crear contenido

**Un cuestionario**

> /teacher-agent:quiz tema 3, consultas SQL con JOIN, 12 preguntas, de repaso (no puntúa)

Escribe las preguntas (distractores creíbles, niveles variados, retroalimentación por opción), te las enseña todas y las importa de golpe. Guarda una copia en su memoria para reutilizarlas.

**Apuntes de un tema**

> Crea unos apuntes sobre normalización (1FN, 2FN, 3FN) para el tema 2, con ejemplos de tablas de una tienda online.

Los redacta, los revisa como lo vería un alumno (legibilidad, accesibilidad) y te pide permiso antes de publicarlos.

**Una tarea con su rúbrica**

> Crea una tarea para el tema 3: diseñar el modelo entidad-relación de una biblioteca. Con rúbrica de 4 criterios, entrega en PDF, plazo dos semanas.

**Un glosario, un foro de dudas o una consulta**

> Añade al tema 1 un glosario colaborativo donde los alumnos definan los términos clave, y una encuesta rápida para saber qué gestor de bases de datos conocen.

**Reciclar lo que ya tienes**

> En sources tienes mis apuntes del año pasado del tema 5 en PDF. Conviértelos en una página de Moodle actualizada y añade tres ejercicios al final.

### Nivel 4 · Diseñar y revisar el curso

**Auditar el curso**

> /teacher-agent:audit

Revisa organización, accesibilidad, coherencia pedagógica, evaluación, fechas y recursos caducados, y te da recomendaciones ordenadas por prioridad. Guarda cada auditoría con su fecha, así que la siguiente te dirá qué ha mejorado desde la anterior.

**Escribir la programación didáctica**

> /teacher-agent:teaching-plan Tengo en sources el borrador del departamento. 6 horas semanales, de septiembre a junio.

La escribe a partir de tu material, te pregunta lo que solo tú puedes decidir (pesos, calendario) y la hace revisar por el revisor pedagógico. Queda en su memoria, no se publica salvo que se lo pidas.

**Comprobar que el aula cumple la programación**

> /teacher-agent:align

Busca criterios que ninguna actividad evalúa, rúbricas que faltan, pesos o fechas que no cuadran, temas sin construir. Te propone cada cambio y lo hace con tu aprobación.

**Pedir una segunda opinión pedagógica**

> ¿Qué te parece la Tarea 4? Pídele al revisor pedagógico que la mire: carga de trabajo, si evalúa lo que dice la programación, si es accesible.

**Cambiar de metodología**

> Quiero que el tema 5 sea aprendizaje basado en retos. Propónme cómo reorganizarlo con lo que ya hay.

**Investigar antes de enseñar**

> /teacher-agent:research novedades de PostgreSQL 17 que merezca la pena contar en clase

Delega en el investigador, contrasta fuentes oficiales y guarda lo encontrado con sus enlaces y fechas.

### Nivel 5 · Construir temas y cursos enteros

**Un tema nuevo, encajado en lo que ya hay**

> /teacher-agent:build-unit Tema 7: bases de datos NoSQL con MongoDB, 3 semanas, con una práctica por parejas al final

Lee el curso y su programación, planifica el tema, lo hace revisar, lo construye (apuntes, actividades, cuestionario, rúbricas), lo mira como un alumno y te dice qué conviene que revises.

**Un curso completo desde cero** (sobre un curso vacío)

> /teacher-agent:build-course Introducción a HTML5 y CSS3 para 1.º de DAW, 5 temas, con un proyecto final de página web personal

Planifica primero en su memoria, luego crea sección a sección con contenido de verdad y termina con una revisión. Es la tarea más larga: déjala en marcha y ve aprobando.

**Prácticas que funcionan de verdad** (informática, con Docker)

> Crea una práctica de Docker Compose con una web y una base de datos, y pruébala antes de publicarla.

Con el probador de prácticas activado, la sigue paso a paso en contenedores como lo haría un alumno y corrige lo que falle antes de publicarla. Al corregir, puede ejecutar las entregas. Se activa con `"allowPracticeRunner": true` en `config.json` (ver el [README](../README.md#probar-prácticas-con-docker)).

### Nivel 6 · Adaptarlo a tu forma de trabajar

**Instrucciones fijas para el curso**: escribe en `instructions.md` lo que debe tener siempre en cuenta.

```markdown
- Puntúa sobre 10 con un decimal.
- La ortografía cuenta un 10 % en todas las tareas escritas.
- En el foro, respuestas breves y termina animando a seguir preguntando.
- No publiques nada los fines de semana sin avisarme.
```

**Atajos propios**: `.claude/commands/semana.md` en la carpeta del curso con

```markdown
Revisa lo entregado esta semana en $ARGUMENTS, resume los errores más repetidos y propónme un aviso para la clase.
```

y en el chat: `/semana Tarea 3`.

**Habilidades propias**: `.claude/skills/<nombre>/SKILL.md` para enseñarle a hacer algo siempre de una manera concreta (por ejemplo, cómo corregir tus prácticas). Ver [el README](../README.md#avanzado-enséñale-habilidades-nuevas). Comprueba que las ve con `teacher-agent skills`.

## 6. La memoria: se acuerda de tu curso

Cada conversación empieza de cero en el chat, pero **no en el conocimiento**: el asistente mantiene una memoria del curso en la carpeta `knowledge/`, que lee al empezar y que va ampliando mientras trabaja. Por eso cuanto más lo usas, mejor te conoce.

**Qué recuerda**:

| Recuerda | Dónde |
| --- | --- |
| Cómo se evalúa, plazos y canales del curso | `orientation.md` |
| Las direcciones de cada actividad y recurso | `course-map.md` |
| Qué admite tu Moodle | `moodle-capabilities.md` |
| Tu programación didáctica | `teaching-plan.md` |
| Cada tema: objetivos, lo que creó, las dudas que se repiten en el foro | `topics/<tema>.md` |
| Cada actividad: criterios que aplicó, rúbrica, preguntas importadas | `activities/<actividad>.md` |
| La evolución de la clase, revisión a revisión | `progress.md` |
| Las auditorías, con su fecha | `course-audit.md` |
| Un resumen de cada documento que le diste | `summaries/` |
| Todo enlazado, con un índice y un diario de cambios | `index.md`, `log.md` |

**Cómo se nota en la práctica**:

> *(Lunes)* **Tú:** Corrige la Tarea 2. Las entregas tarde, un 20 % menos, y valora mucho que comenten el código.
>
> *(Tres semanas después, en otra conversación)* **Tú:** Corrige la Tarea 4.
>
> **Asistente:** Aplico el mismo criterio que en la Tarea 2: un 20 % menos por entregar tarde y peso alto a los comentarios del código. ¿Te parece bien o esta tarea es distinta?

> **Tú:** ¿Cómo va la clase comparado con la última vez?
>
> **Asistente:** En la revisión del día 3 había 6 estudiantes sin entregar nada del tema 2; hoy son 3. Pero el cuestionario del tema 3 tiene la media más baja del curso…

**Lo que debes saber**:

- Son archivos de texto normales: ábrelos con cualquier editor, o con [Obsidian](https://obsidian.md) para ver cómo se enlazan. Puedes corregir lo que quieras.
- **Tus documentos** van en `sources/` (él solo los lee); **sus apuntes** en `knowledge/`; **lo que construye para Moodle** en `drafts/`.
- No guarda fichas de estudiantes concretos: solo tendencias de la clase.
- Cada curso tiene su propia memoria, en su carpeta.

## 7. Una semana con teacher-agent

Un ejemplo de cómo encaja en la rutina, siempre con `teacher-agent chat`:

| Día | Le pides | Tiempo tuyo |
| --- | --- | --- |
| **Lunes** | *"¿Qué ha pasado este fin de semana y qué vence esta semana?"* + `/teacher-agent:forum` | 5 min leyendo y aprobando respuestas |
| **Martes** | `/teacher-agent:quiz` del tema que empieza, de repaso | Revisar las preguntas |
| **Miércoles** | *"Corrige la Tarea 3 con su rúbrica"* | Aprobar notas y ajustar alguna |
| **Jueves** | `/teacher-agent:progress` y *"escribe un aviso animando a quien va retrasado, sin señalar a nadie"* | Un par de minutos |
| **Viernes** | *"Prepara el tema de la semana que viene: apuntes y una práctica"* | Revisar y aprobar |
| **Cada mes** | `/teacher-agent:audit` y `/teacher-agent:align` | Decidir qué mejoras aplicar |

## 8. Fuera del chat: tareas de una sola orden

Para encargos concretos sin conversación, `run --task`. Se aplican las mismas reglas y aprobaciones.

```bash
teacher-agent run --task "Corrige la Tarea 2"
teacher-agent run --task "Revisa el foro y responde las dudas sin contestar"
teacher-agent run --task "Crea un cuestionario de 10 preguntas sobre el tema 3"
teacher-agent run --task "Audita el curso y detecta problemas"
teacher-agent run --task "Construye un curso de introducción a HTML5 y CSS3 para 1.º de DAW"
```

`teacher-agent run` sin `--task` recorre el curso entero: corrige, atiende el foro, revisa el contenido y termina con un resumen de la clase. Te pregunta cuánto supervisarlo:

| Modo | Comportamiento |
| --- | --- |
| `guided` (recomendado) | Autónomo, pero pide aprobación antes de publicar |
| `interactive` | Confirma cada paso: útil para ver cómo trabaja |
| `autonomous` | No pregunta nada. Solo en cursos de prueba |

```bash
teacher-agent run --mode guided
```

## 9. Consejos y problemas frecuentes

**Consejos**

- **Empieza en un curso de pruebas** y por el nivel 1. Cuando veas cómo trabaja, pasa a uno real.
- **Dale tu material**: una rúbrica en `sources/` vale más que diez explicaciones en el chat.
- **Sé concreto**: *"corrige la Tarea 2 de 1.º A"* mejor que *"corrige lo de la semana pasada"*.
- **Rechazar también enseña**: si dices `n`, explica por qué; lo aplica al resto de la tarea.
- **Mira la ventana de Chrome** las primeras veces: ves exactamente lo que hace.
- **Una carpeta por curso**, y no mezcles cursos en la misma.

**Si algo falla**

| Problema | Solución |
| --- | --- |
| `teacher-agent` no se reconoce | Cierra y abre la terminal; comprueba `node --version` (20 o más) |
| Se queda en la pantalla de inicio de sesión | Sin usuario guardado, inicia sesión tú en la ventana de Chrome |
| Quiero que no se vea Chrome | `teacher-agent chat --headless` (necesita usuario y contraseña guardados) |
| Está haciendo algo que no quería | `Esc`, y dile qué hacer en su lugar |
| Recuerda algo mal | Díselo en el chat o edita la página de `knowledge/` |
| Venía de moodle-agent | Abre `teacher-agent chat` en la carpeta del aula: reorganiza sus apuntes solo |

## 10. Referencia rápida

| Orden | Para qué |
| --- | --- |
| `teacher-agent init` | Preparar la carpeta de un curso (y explorar su Moodle) |
| `teacher-agent chat` | Conversar con el asistente |
| `teacher-agent run [--task "…"] [--mode …]` | Gestionar el curso o hacer un encargo de una vez |
| `teacher-agent explore` | Ver qué admite tu Moodle, sin cambiar nada |
| `teacher-agent ingest [archivos…]` | Incorporar tus documentos a su memoria, sin abrir Moodle |
| `teacher-agent skills` | Listar las habilidades, incluidas las tuyas |
| `teacher-agent commands` | Listar los atajos del chat, incluidos los tuyos |
| `teacher-agent --help` | Ver todas las órdenes y opciones |
| `teacher-agent --version` | Ver la versión instalada |

Todas aceptan `--dir <carpeta>`; `chat`, `run` y `explore`, también `--headless`.

**Habilidades** que aplica solo cuando la tarea lo pide (`teacher-agent skills` para verlas; cada una explicada con ejemplos en [skills.md](skills.md)):

- **Construir**: `course-building`, `unit-building`, `resource-authoring`, `assignment-building`, `activity-building`, `quiz-design`, `quiz-building`, `rubric-design`, `practice-testing`, `publish-check`.
- **Diseñar**: `course-design`, `teaching-methodologies`, `teaching-plan`, `course-alignment`, `topic-research`.
- **Llevar el curso**: `course-orientation`, `moodle-navigation`, `grading-rubric`, `forum`, `progress-monitoring`, `course-auditor`.
- **Memoria**: `knowledge-ingest`, `knowledge-query`, `knowledge-lint`, `knowledge-pages`.
