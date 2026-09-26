# teacher-agent

Un asistente que te ayuda a gestionar tu curso de Moodle. Entra con tu cuenta de profesor
en una ventana de Chrome y trabaja como lo harías tú: **corrige entregas**, **responde
en el foro**, **crea o revisa contenido** y te **resume cómo va la clase**. Antes de
publicar nada que vean tus estudiantes (una nota, una respuesta, un recurso nuevo), te
pide permiso.

Además, va tomando apuntes del curso (criterios de corrección, rúbricas, dudas que se
repiten, cómo evoluciona la clase) para acordarse de todo en la siguiente sesión.

---

## 1. Qué necesitas

Antes de instalarlo, comprueba que tienes estas tres cosas:

1. **Google Chrome**. Si no lo tienes: [google.com/chrome](https://www.google.com/chrome/).
2. **Node.js** (versión 20 o posterior). Descárgalo de [nodejs.org](https://nodejs.org/),
   elige la versión **LTS** e instálalo con las opciones por defecto.
3. **Una suscripción de Claude Pro o Max** ([claude.ai](https://claude.ai)). Es lo que
   hace funcionar al asistente.

Y, por supuesto, un curso de Moodle en el que tengas rol de **profesor**.

## 2. Instalación

1. Abre una terminal:
   - **Windows**: pulsa la tecla Windows, escribe `PowerShell` y ábrelo.
   - **Mac**: pulsa `Cmd + Espacio`, escribe `Terminal` y ábrelo.
2. Copia esta línea, pégala en la terminal y pulsa Intro:

   ```
   npm install -g https://github.com/falkenslab/teacher-agent/releases/latest/download/teacher-agent.tgz
   ```

   Tarda uno o dos minutos. Es normal que aparezca algún aviso en amarillo (`warn`).
   En Mac, si da un error de permisos, ponle `sudo ` delante y escribe tu contraseña.
3. Comprueba que ha funcionado:

   ```
   teacher-agent --version
   ```

   Si ves un número de versión (por ejemplo `0.1.0`), ya está instalado.

Para **actualizarlo** más adelante, repite el paso 2. Para **desinstalarlo**:
`npm uninstall -g teacher-agent`.

## 3. Prepara tu curso (solo la primera vez)

Cada curso tiene su propia carpeta. En ella el asistente guarda los datos del curso y sus
apuntes.

1. Crea una carpeta para el curso y entra en ella. En la terminal:

   ```
   mkdir mi-curso
   cd mi-curso
   ```

2. Configúrala:

   ```
   teacher-agent init
   ```

   Te hará unas preguntas:
   - **URL de Moodle**: lo más fácil es abrir tu curso en el navegador y copiar la
     dirección completa (algo como `https://moodle.micentro.es/course/view.php?id=4`).
   - **Usuario y contraseña** de profesor. Si prefieres no guardarlos, déjalos en blanco:
     cada vez que empiece, el asistente te pedirá que inicies sesión tú en la ventana
     de Chrome.
   - **Tono** (formal, cercano...) e **idioma** en el que quieres hablar con él.

   Al final te propone **explorar** tu Moodle: entra, mira qué tipos de actividades y de
   preguntas permite tu centro y lo apunta. No crea ni cambia nada. Te recomendamos
   decir que sí.

3. **La primera vez**, te pedirá conectar tu cuenta de Claude: acepta, se abrirá el
   navegador, inicia sesión en Claude y vuelve a la terminal. Solo se hace una vez.

> 💡 Si tienes el programa de la asignatura, rúbricas, soluciones de los ejercicios o tus
> criterios de corrección, cópialos en la carpeta `sources` que se ha creado dentro de la
> del curso. El asistente los tendrá en cuenta y, al corregir, **tus criterios mandan**.

## 4. Úsalo

Siempre desde la carpeta del curso (`cd mi-curso`).

### Conversar con el asistente (recomendado para empezar)

```
teacher-agent chat
```

Se abre Chrome, entra en tu curso y te pregunta qué necesitas. Pídeselo con tus palabras,
por ejemplo:

- *"¿Qué entregas tengo pendientes de corregir?"*
- *"Corrige las entregas de la Tarea 2 con la rúbrica que te he dejado."*
- *"¿Hay preguntas sin responder en el foro?"*
- *"Crea un cuestionario de 10 preguntas sobre el tema 3."*
- *"¿Qué alumnos se están quedando atrás?"*
- *"Revisa el curso y dime qué mejorarías."*

Antes de guardar una nota, responder en el foro o publicar algo, te mostrará lo que va a
hacer y esperará tu respuesta: pulsa **Intro** (o escribe `y`) para aprobarlo, o escribe
`n` para rechazarlo. Para salir, escribe `/exit`. Si quieres cortar lo que está haciendo
sin salir, pulsa `Esc`. Al terminar no hay nada que guardar: todo se va guardando solo.

### Dejar que gestione el curso entero

```
teacher-agent run
```

Recorre el curso de principio a fin: corrige lo pendiente, atiende el foro, revisa el
contenido y termina con un resumen de cómo va la clase. Te preguntará cuánto quieres
supervisarlo:

| Opción | Qué significa |
| --- | --- |
| **guided** (recomendada) | Trabaja solo, pero te pide permiso antes de publicar cualquier cosa que vean tus estudiantes. |
| **interactive** | Te pide confirmación antes de cada paso. Útil para ver cómo trabaja. |
| **autonomous** | No pregunta nada. Solo si confías plenamente y has guardado usuario y contraseña. |

### Otras órdenes

| Orden | Para qué |
| --- | --- |
| `teacher-agent explore` | Vuelve a comprobar qué actividades y tipos de pregunta permite tu Moodle. |
| `teacher-agent ingest` | Lee los documentos que hayas puesto en `sources` y toma apuntes, sin abrir Moodle. |
| `teacher-agent --help` | Muestra todas las opciones. |

Dentro del chat también puedes usar atajos: `/teacher-agent:grade` (corregir),
`/teacher-agent:forum` (revisar el foro), `/teacher-agent:quiz` (crear preguntas),
`/teacher-agent:pending` (quién va retrasado), `/teacher-agent:audit` (revisar el curso).
`teacher-agent commands` los lista todos.

---

## Preguntas frecuentes

**¿Mi contraseña está segura?** Se guarda en el archivo `config.json` de la carpeta del
curso, en tu ordenador. El asistente nunca la ve: escribe un marcador en el campo de
contraseña y es el propio Chrome quien pone la real. Tampoco puede abrir ese archivo.

**¿Puede borrar cosas o salirse de mi curso?** Tiene instrucciones de no borrar nada, no
cambiar matrículas, no tocar la configuración de Moodle ni entrar en otros cursos. Aun
así, usa el modo **guided** (o el chat) para revisar todo lo que publica.

**¿Dónde están sus apuntes?** En la carpeta `knowledge` del curso: archivos de texto que
puedes abrir con cualquier editor (o con [Obsidian](https://obsidian.md), que muestra
cómo se enlazan). No guarda fichas de estudiantes concretos, solo tendencias de la clase.

**¿Puedo darle instrucciones propias?** Sí. Crea un archivo `instructions.md` en la
carpeta del curso y escribe ahí lo que quieras que tenga siempre en cuenta ("puntúa
sobre 10", "sé breve en el foro", "la ortografía cuenta un 10 %"...).

**No quiero ver la ventana de Chrome.** Añade `--headless` (por ejemplo
`teacher-agent run --headless`). Necesita el usuario y la contraseña guardados.

**Venía usando moodle-agent.** Tu carpeta de aula de profesor sirve tal cual: ejecuta
`teacher-agent chat` dentro de ella y el asistente reorganizará sus apuntes al formato
nuevo la primera vez.

---

## Para desarrolladores

teacher-agent está construido sobre [`@falkenslab/agent-kit`](https://github.com/falkenslab/agent-kit),
igual que [student-agent](https://github.com/falkenslab/student-agent). Sus habilidades,
comandos y prompts proceden del rol de profesor de moodle-agent. Ver [CLAUDE.md](CLAUDE.md)
para la arquitectura.

```
git clone https://github.com/falkenslab/teacher-agent.git
cd teacher-agent
npm install
npm start -- chat --dir <carpeta-del-curso>
npm run typecheck && npm run lint
npm run build && npm link     # comando global teacher-agent desde este clon
npm pack                      # genera el .tgz que se publica en cada release
```
