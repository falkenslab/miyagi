// The landing page, for teachers with no technical background: the desktop app first (download
// for Windows, its capture), what miyagi does, the three versions with a capture of each, how it
// keeps the teacher in control and how to install it. The English copy is in
// i18n/en/docusaurus-plugin-content-pages/index.js.
import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import s from "./index.module.css";

const INSTALL = "npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz";
const INSTALLER = "https://github.com/falkenslab/miyagi/releases/latest/download/miyagi-setup.exe";

const TABS = [
  {
    id: "crear", label: "Crear cursos", title: "Monta cursos y temas enteros",
    text: "Le describes el curso o el tema y lo construye: primero la programación, luego cada tema con apuntes de verdad, prácticas con su rúbrica y cuestionarios, y al final lo revisa como lo vería un alumno.",
    says: "«Monta un curso de introducción a SQL de cuatro temas para 1.º de DAM»",
    ticks: ["Apuntes como páginas o libros, con sus fuentes citadas", "Tareas de todo tipo: escritas, en grupo, por borradores, portafolio", "Talleres de coevaluación, lecciones con itinerarios, glosarios, wikis y H5P", "Finalización, restricciones de acceso, insignias y grupos", "Descarga materiales, los comprime o los pasa a PDF"],
  },
  {
    id: "cuestionarios", label: "Cuestionarios y juegos", title: "Cuestionarios que enseñan, y juegos que puntúan",
    text: "Escribe preguntas con distractores creíbles, niveles variados y una retroalimentación que explica, y las importa de golpe. Si tienes un juego o una simulación web, lo empaqueta para que la nota llegue sola al calificador.",
    says: "«Crea un cuestionario de 10 preguntas sobre el tema 3»",
    ticks: ["Configura fechas, intentos y opciones de revisión", "Importa las preguntas en bloque (formato GIFT)", "Revisa y mejora los cuestionarios que ya tienes", "Juegos y simulaciones como paquete SCORM, con nota y finalización"],
  },
  {
    id: "corregir", label: "Corregir", title: "Corrige con tu rúbrica, igual para todos",
    text: "Aplica tu rúbrica y tus criterios con el mismo rasero a toda la clase, y escribe una retroalimentación que dice qué falló y cómo mejorarlo. Te enseña cada nota antes de guardarla.",
    says: "«Corrige la Tarea 2 con la rúbrica del tema»",
    ticks: ["Tareas, respuestas abiertas de cuestionarios y foros calificados", "Tus criterios mandan sobre los suyos", "Retroalimentación con el desglose por criterio", "Diseña rúbricas con criterios observables y niveles claros", "En cursos de informática, puede ejecutar la práctica entregada y usar el resultado como prueba"],
  },
  {
    id: "foro", label: "Foro", title: "Atiende el foro sin que se le escape nada",
    text: "Encuentra las dudas sin responder, decide cuándo intervenir y cuándo dejar que la clase se ayude, y contesta en el tono que elegiste. Si una duda se repite, te avisa: es que a los apuntes les falta algo.",
    says: "«¿Hay algo nuevo en el foro?»",
    ticks: ["Respuestas y correcciones con ejemplos", "Avisos a toda la clase", "Cada mensaje se publica una sola vez", "Recuerda las dudas que se repiten"],
  },
  {
    id: "programacion", label: "Programación", title: "Tu programación didáctica, escrita y cumplida",
    text: "La escribe contigo a partir de tu material, te pregunta lo que solo tú decides (horas, calendario, pesos) y la hace revisar por un experto en didáctica. Luego comprueba que el aula está acorde: que cada criterio se evalúa y que fechas y pesos cuadran.",
    says: "«Ayúdame con mi programación y dime si el aula está acorde»",
    ticks: ["Objetivos, temas, metodología, evaluación y atención a la diversidad", "Enlazada con cada tema en sus apuntes", "Propone los arreglos del aula y los aplica con tu permiso", "No se publica en Moodle salvo que se lo pidas"],
  },
  {
    id: "seguimiento", label: "Seguimiento", title: "Sigue la clase y revisa el curso",
    text: "Te cuenta cómo va la clase empezando por quien se está quedando atrás, y audita el curso entero con recomendaciones ordenadas por prioridad.",
    says: "«¿Qué alumnos se están quedando atrás?»",
    ticks: ["Entregas, notas y qué temas cuestan más", "Organización, pedagogía y evaluación del curso", "Accesibilidad: encabezados, textos alternativos, enlaces, colores", "Enlaces rotos y contenido desfasado"],
  },
];

const METHODS = ["Aprendizaje basado en proyectos", "Retos y problemas", "Clase invertida", "Gamificación", "Aprendizaje cooperativo", "Estudio de casos", "Aprendizaje-servicio", "Design thinking", "Aprendizaje por indagación", "Rutinas de pensamiento", "Debate, rol y simulación", "Evaluación formativa", "Diseño universal para el aprendizaje (DUA)"];

const FAQ = [
  ["¿Cuánto cuesta?", "miyagi es gratuito y de código abierto. Lo que hace funcionar al asistente es tu suscripción de Claude (Pro o Max)."],
  ["¿En qué se diferencia de preguntarle a un chat de IA?", "Un chat te da un texto y el resto lo haces tú en Moodle. miyagi entra en tu curso y hace el trabajo allí: pone la nota con su retroalimentación, responde en el foro, crea la tarea con su rúbrica. Además recuerda tu curso de una sesión a otra y te pide permiso antes de que tus alumnos vean nada."],
  ["¿Funciona con el Moodle de mi centro?", "Trabaja con el Moodle que ya usas, con la extensión moodle-teacher y tu sesión de profesor: entras tú en Moodle una vez, en su ventana, y no hay que instalar nada en el servidor. Está hecho para Moodle 4 y 5, y se prueba en Moodle 5.2."],
  ["¿En qué sistemas funciona?", "La aplicación de escritorio, la versión principal, solo en Windows de 64 bits. La versión web y la terminal funcionan también en Mac y Linux, con Node.js."],
  ["¿Tengo que saber programar?", "No. En Windows se instala con un doble clic, y después se usa conversando. La guía te lleva de la mano, y el aula de ejemplo lo enseña paso a paso con capturas reales."],
  ["¿Puede publicar algo sin que me dé cuenta?", "En el chat, antes de guardar una nota, responder en el foro o publicar contenido, te pide permiso con un resumen de lo que va a publicar. Si intenta publicar sin haberlo pedido, lo detiene y te pregunta."],
  ["¿Y si se equivoca?", "Ves cada nota, cada respuesta y cada recurso antes de que llegue a tus alumnos, y puedes decir que no o pedirle que lo cambie. Lo nuevo lo prueba oculto antes de mostrarlo. Si algo no te gusta de cómo trabaja, corrige sus apuntes o escríbeselo en instructions.md."],
  ["¿Qué pasa con los datos de mis alumnos?", "Lee lo que tú verías en Moodle para hacer su trabajo, pero en sus apuntes no guarda fichas de alumnos concretos, solo tendencias de la clase. Por defecto, los alumnos le llegan con un alias («A-7KQ2XM»), nunca por su nombre. Tu contraseña de Moodle no la ve: entras tú, en la ventana de la extensión."],
  ["¿Puedo darle mis propias instrucciones?", "Sí. Escribe en un archivo instructions.md de la carpeta del curso lo que quieras que tenga siempre en cuenta: «puntúa sobre 10», «sé breve en el foro», «la ortografía cuenta un 10 %». Y si quieres ir más allá, puedes enseñarle habilidades propias."],
];

// What it does: tabs named after the teacher's verbs (ARIA tabs pattern).
function Tabs() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const select = (i, focus) => {
    const next = (i + TABS.length) % TABS.length;
    setActive(next);
    if (focus) refs.current[next]?.focus();
  };
  const onKey = (event, i) => {
    const moves = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  };
  return (
    <div>
      <div className={s.tablist} role="tablist" aria-label="Qué hace">
        {TABS.map((tab, i) => (
          <button key={tab.id} ref={(el) => (refs.current[i] = el)} type="button" role="tab" id={`tab-${tab.id}`} aria-controls={`panel-${tab.id}`} aria-selected={i === active} tabIndex={i === active ? 0 : -1} onClick={() => select(i, false)} onKeyDown={(e) => onKey(e, i)}>{tab.label}</button>
        ))}
      </div>
      {TABS.map((tab, i) => (
        <div key={tab.id} className={s.panel} role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} tabIndex={0} hidden={i !== active}>
          <div>
            <h3>{tab.title}</h3>
            <p>{tab.text}</p>
            <span className={s.says}>{tab.says}</span>
          </div>
          <ul className={s.ticks}>{tab.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

function CopyCommand() {
  const [label, setLabel] = useState("Copiar");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setLabel("Copiado");
    } catch {
      setLabel("Selecciónalo y cópialo");
    }
    setTimeout(() => setLabel("Copiar"), 2000);
  };
  return (
    <div className={s.command}>
      <code>{INSTALL}</code>
      <button className={s.copy} type="button" onClick={copy}>{label}</button>
    </div>
  );
}

// The latest release, from GitHub; if it can't be fetched, nothing is shown.
function LatestRelease() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch("https://api.github.com/repos/falkenslab/miyagi/releases/latest")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((r) => {
        const date = new Date(r.published_at).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
        setText(`Última versión: ${r.tag_name} (${date})`);
      })
      .catch(() => {});
  }, []);
  return text ? <span className={s.release}>{text}</span> : null;
}

export default function Home() {
  const heroLight = useBaseUrl("/img/v2/desktop-navegador-moodle.webp");
  const heroDark = useBaseUrl("/img/v2/desktop-hoy-oscuro.webp");
  const heroLight480 = useBaseUrl("/img/v2/desktop-navegador-moodle-480.webp");
  const heroLight820 = useBaseUrl("/img/v2/desktop-navegador-moodle-820.webp");
  const heroDark480 = useBaseUrl("/img/v2/desktop-hoy-oscuro-480.webp");
  const heroDark820 = useBaseUrl("/img/v2/desktop-hoy-oscuro-820.webp");
  const desktopShot = useBaseUrl("/img/v2/desktop-hoy.webp");
  const webShot = useBaseUrl("/img/v2/web-hoy.webp");
  const terminalShot = useBaseUrl("/img/v2/terminal-chat.webp");
  const realShot = useBaseUrl("/img/v2/tutorial-08-foro-resumen.webp");
  return (
    <Layout title="Tú enseñas, y miyagi se ocupa del resto" description="miyagi prepara tu asignatura contigo y trabaja en tu curso de Moodle con tu sesión de profesor: corrige con tu rúbrica, atiende el foro, monta temas, cuestionarios y juegos y te dice cómo va la clase. Nada llega a tus alumnos sin tu permiso.">
      <main className={s.landing}>
        <section className={s.hero} aria-labelledby="titulo">
          <div className={s.wrap}>
            <div>
              <p className={s.kicker}>Asistente de IA para docentes</p>
              <h1 id="titulo">Tú enseñas, y <span className={s.brandWord}>miyagi</span> se ocupa del resto.</h1>
              <p className={s.lead}>Una aplicación de escritorio que prepara tu asignatura contigo y, si conectas tu curso de Moodle, corrige con tu rúbrica, atiende el foro, monta temas y cuestionarios y te dice cómo va la clase. Nada llega a tus alumnos sin tu permiso.</p>
              <div className={s.actions}>
                <a className={`${s.button} ${s.primary}`} href={INSTALLER}>Descargar para Windows</a>
                <Link className={s.button} to="/casos-de-uso/">Verlo en un aula real</Link>
              </div>
              <p className={s.fine}>Windows de 64 bits. <Link to="/guia/instalar/#aplicacion-windows">El instalador aún no está firmado</Link> y Windows te avisará. ¿Mac o Linux? Mira las <a href="#versiones">otras versiones</a>. Gratis y de código abierto (MIT); funciona con tu suscripción de Claude.</p>
            </div>
            <figure className={s.heroShot}>
              <img className={s.imgLight} src={heroLight} srcSet={`${heroLight480} 480w, ${heroLight820} 820w, ${heroLight} 1400w`} sizes="(max-width: 1020px) calc(100vw - 40px), 980px" width="1400" height="875" fetchPriority="high" decoding="async" alt="La aplicación de escritorio de miyagi: la columna de iconos, las conversaciones de la asignatura Introducción a SQL, el chat, y al lado el curso de Moodle abierto en el navegador integrado." />
              <img className={s.imgDark} src={heroDark} srcSet={`${heroDark480} 480w, ${heroDark820} 820w, ${heroDark} 1400w`} sizes="(max-width: 1020px) calc(100vw - 40px), 980px" width="1400" height="875" loading="lazy" decoding="async" alt="La aplicación de escritorio de miyagi en tema oscuro, en la vista Hoy de la asignatura Introducción a SQL: el saludo, cuatro tarjetas de resumen y sugerencias." />
            </figure>
          </div>
        </section>

        <section aria-labelledby="problema-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="problema-t">La parte del curso que no es enseñar</h2>
              <p>Es trabajo necesario, se repite cada semana y se come las tardes.</p>
            </div>
            <ul className={s.chores}>
              <li><strong>Montones de entregas.</strong> Treinta prácticas con la misma rúbrica, y cada una merece una retroalimentación que sirva.</li>
              <li><strong>La misma duda, otra vez.</strong> El foro pregunta lo que ya se respondió, y la duda nueva se pierde entre las viejas.</li>
              <li><strong>Moodle, clic a clic.</strong> Un tema con apuntes, tarea, rúbrica y cuestionario son decenas de formularios.</li>
              <li><strong>La programación, en un cajón.</strong> Comprobar que el aula sigue cuadrando con lo que prometiste casi nunca da tiempo.</li>
            </ul>
            <p className={s.answer}><span>miyagi se encarga de esa parte.</span> Tú, de enseñar.</p>
          </div>
        </section>

        <section id="que-hace" className={s.board} aria-labelledby="que-hace-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="que-hace-t">Qué hace por ti</h2>
              <p>Se lo pides con tus palabras, como a un compañero. Él hace el trabajo en tu Moodle, con tu sesión de profesor.</p>
            </div>
            <Tabs />
          </div>
        </section>

        <section id="como" aria-labelledby="como-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="como-t">Cómo funciona</h2>
              <p>Sin instalar nada en el servidor de tu centro: trabaja en tu Moodle con la extensión moodle-teacher y tu sesión de profesor.</p>
            </div>
            <ol className={s.how}>
              <li><h3>Instálalo</h3><p>En Windows, un doble clic en el instalador. Abre la aplicación y conecta tu cuenta de Claude.</p></li>
              <li><h3>Preséntale tu curso</h3><p>Crea una asignatura: nombre, tono e idioma, y si quieres la dirección de tu curso de Moodle. Entras tú en Moodle una vez, en su ventana, y miyagi nunca ve tu contraseña. Déjale tu programación, tus rúbricas o tus criterios en Fuentes y los tendrá en cuenta.</p></li>
              <li><h3>Pídeselo y aprueba</h3><p>Conversa con él con tus palabras. Cuando algo vaya a llegar a tus alumnos, te lo enseña y espera tu sí.</p></li>
            </ol>
          </div>
        </section>

        <section id="versiones" className={s.tinted} aria-labelledby="versiones-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="versiones-t">Tres versiones, un mismo asistente</h2>
              <p>Las mismas asignaturas, la misma memoria del curso y los mismos permisos antes de publicar. Te recomendamos la aplicación de escritorio.</p>
            </div>
            <div className={s.versions}>
              <article className={s.versionMain}>
                <figure className={s.versionShot}><img src={desktopShot} width="1400" height="875" loading="lazy" decoding="async" alt="La aplicación de escritorio en la vista Hoy: columna de iconos, conversaciones, el saludo de miyagi, tarjetas de resumen y sugerencias." /></figure>
                <div>
                  <p className={s.badge}>Recomendada</p>
                  <h3>Aplicación de escritorio</h3>
                  <p>Para la mayoría de docentes, en Windows. Se instala con un doble clic, sin terminal ni Node.js. Tiene su propia barra de ventana y un navegador integrado para tener Moodle al lado de la conversación.</p>
                  <div className={s.actions}>
                    <a className={`${s.button} ${s.primary}`} href={INSTALLER}>Descargar para Windows</a>
                    <Link className={s.button} to="/guia/escritorio/">Ver la guía</Link>
                  </div>
                </div>
              </article>
              <article className={s.version}>
                <figure className={s.versionShot}><img src={webShot} width="1400" height="875" loading="lazy" decoding="async" alt="La versión web de miyagi en una pestaña del navegador: la misma página que la aplicación, en la vista Hoy." /></figure>
                <h3>Versión web</h3>
                <p>La misma página, en una pestaña de tu navegador, en Windows, Mac o Linux. Se abre con <code>miyagi web</code> y solo funciona en tu ordenador. Necesita Node.js.</p>
                <p><Link to="/guia/web/">Ver la guía</Link></p>
              </article>
              <article className={s.version}>
                <figure className={s.versionShot}><img src={terminalShot} width="1400" height="1122" loading="lazy" decoding="async" alt="El chat de miyagi en la terminal con una respuesta en forma de tabla y el modo guiado abajo." /></figure>
                <h3>Terminal</h3>
                <p>Para quien prefiere el teclado o quiere encargos de una sola orden: <code>miyagi chat</code>, <code>miyagi run</code>, <code>miyagi ingest</code>. Necesita Node.js.</p>
                <p><Link to="/guia/terminal/">Ver la guía</Link></p>
              </article>
            </div>
          </div>
        </section>

        <section aria-labelledby="real-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="real-t">Míralo trabajar en un aula real</h2>
              <p>Un aula de «Introducción a SQL» montada de cero con miyagi, paso a paso y con capturas reales: de la programación a la corrección.</p>
            </div>
            <figure className={s.shot}>
              <a href={realShot}>
                <img src={realShot} width="1400" height="875" loading="lazy" decoding="async" alt="La aplicación de escritorio tras atender el foro: un resumen de los dos hilos, qué pasaba en cada uno y qué ha hecho miyagi, y una propuesta para la próxima clase." />
              </a>
              <figcaption>Una sesión real del aula de SQL: después de responder en el foro, resume cada hilo y relaciona lo que ve con la corrección. Antes, cada mensaje pasó por tu aprobación.</figcaption>
            </figure>
            <div className={s.actions}>
              <Link className={`${s.button} ${s.primary}`} to="/casos-de-uso/">Ver el aula de SQL paso a paso</Link>
            </div>
          </div>
        </section>

        <section className={s.tinted} aria-labelledby="metodo-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="metodo-t">Enseña como tú quieras enseñar</h2>
              <p>Le dices cómo quieres dar el tema y lo monta con piezas de Moodle que existen de verdad: talleres de coevaluación, lecciones con itinerarios, insignias, grupos, restricciones. Después, un revisor pedagógico lo repasa.</p>
            </div>
            <ul className={s.chips}>{METHODS.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        </section>

        <section aria-labelledby="memoria-t">
          <div className={`${s.wrap} ${s.split}`}>
            <div>
              <h2 id="memoria-t">Recuerda tu curso</h2>
              <p>Va tomando apuntes mientras trabaja: tus criterios de corrección, las rúbricas, la programación, las dudas que se repiten, cómo evoluciona la clase. En la siguiente sesión empieza por ahí y solo abre Moodle cuando le hace falta.</p>
              <p>Si le dejas documentos (el programa de la asignatura, rúbricas, soluciones), los lee y los incorpora a sus apuntes. Son archivos de texto en la carpeta de tu curso: puedes abrirlos y corregirlos con cualquier editor. <Link to="/avanzado/base-de-conocimiento/">Cómo funciona por dentro</Link>.</p>
            </div>
            <figure className={s.tree} aria-label="La carpeta de un curso">
              <pre><code>{"mi-curso/\n├─ sources/         "}<span>tus documentos: programación, rúbricas</span>{"\n├─ knowledge/       "}<span>sus apuntes del curso</span>{"\n│  ├─ teaching-plan.md\n│  ├─ progress.md\n│  └─ drafts.md\n├─ drafts/          "}<span>lo que prepara antes de subir</span>{"\n└─ instructions.md  "}<span>lo que debe tener siempre en cuenta</span></code></pre>
            </figure>
          </div>
        </section>

        <section className={s.tinted} aria-labelledby="ayudantes-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="ayudantes-t">Trabaja con ayudantes</h2>
              <p>Para algunas tareas se apoya en especialistas que le devuelven un informe. Ninguno puede publicar nada en Moodle.</p>
            </div>
            <div className={s.cards}>
              <div className={s.card}><h3>Investigador</h3><p>Busca en internet, lee primero las fuentes oficiales, las contrasta y guarda lo que encuentra con sus enlaces. Para que tus apuntes estén al día.</p><span className={s.says}>«Investiga qué ha cambiado en MariaDB 11»</span></div>
              <div className={s.card}><h3>Revisor pedagógico</h3><p>Revisa una programación o una actividad: coherencia entre objetivos, actividades y evaluación, metodología, carga de trabajo y atención a la diversidad.</p></div>
              <div className={s.card}><h3>Probador de prácticas</h3><p>Opcional, para cursos de informática: sigue la práctica paso a paso en contenedores Docker antes de publicarla, porque una práctica que no funciona le cuesta la tarde a toda la clase.</p></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="manera-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}><h2 id="manera-t">A tu manera</h2></div>
            <div className={`${s.cards} ${s.four}`}>
              <div className={s.card}><h3>Con tu tono</h3><p>Formal, cercano o motivador: tú eliges cómo habla con tus alumnos en el foro y en la retroalimentación.</p></div>
              <div className={s.card}><h3>En tu idioma</h3><p>Te atiende en español, inglés, francés o alemán. Lo que publica sigue siempre el idioma de tu curso.</p></div>
              <div className={s.card}><h3>Conversa, y retoma</h3><p>Una conversación que puedes retomar otro día, con búsqueda entre todas las anteriores. Pulsa Esc y para lo que esté haciendo.</p></div>
              <div className={s.card}><h3>Hazlo tuyo</h3><p>Instrucciones que siempre respeta («puntúa sobre 10»), <Link to="/avanzado/habilidades-propias/">habilidades</Link> y atajos propios. Todo en archivos de texto, sin programar.</p></div>
            </div>
          </div>
        </section>

        <section id="control" className={s.tinted} aria-labelledby="control-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="control-t">Con tu visto bueno</h2>
              <p>Trabaja con tu sesión en tu curso real, así que te consulta antes de lo que verían tus alumnos.</p>
            </div>
            <div className={s.cards}>
              <div className={s.card}><h3>Te pide permiso</h3><p>Antes de guardar una nota, responder en el foro o publicar algo, te enseña qué va a hacer y espera tu sí. Además, el programa vigila cada cambio que va a hacer en Moodle y para lo que no hayas aprobado.</p></div>
              <div className={s.card}><h3>Lo nuevo, primero oculto</h3><p>Lo prepara en borradores, lo sube oculto, lo prueba como lo vería un alumno y lo muestra cuando tú dices sí. Lo que quede a medias te lo recuerda al cerrar.</p></div>
              <div className={s.card}><h3>Lo que no hace</h3><p>No borra contenido sin preguntarte, no toca matrículas ni la configuración del sitio, no sale de tu curso, no ve tu contraseña y no guarda fichas de alumnos.</p></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="abierto-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}><h2 id="abierto-t">Libre, abierto y probado en un Moodle de verdad</h2></div>
            <div className={s.cards}>
              <div className={s.card}><h3>Gratis, con licencia MIT</h3><p>No hay planes ni cuotas. Lo que hace funcionar al asistente es tu suscripción de Claude.</p></div>
              <div className={s.card}><h3>Todo el código, a la vista</h3><p>Puedes leer qué hace y cómo, y proponer mejoras en <a href="https://github.com/falkenslab/miyagi">GitHub</a>. <LatestRelease /></p></div>
              <div className={s.card}><h3>Probado antes de publicarse</h3><p>Cada cambio en su forma de trabajar se prueba en un Moodle de pruebas con alumnos, entregas y dudas, y el informe queda publicado con sus <a href="https://github.com/falkenslab/miyagi/blob/main/tests/README.md">capturas</a>.</p></div>
            </div>
          </div>
        </section>

        <section id="instalar" className={s.tinted} aria-labelledby="instalar-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="instalar-t">Instálalo</h2>
              <p>No hace falta saber programar. Necesitas una suscripción de Claude Pro o Max y, para trabajar en tu aula, un curso de Moodle en el que tengas rol de profesor.</p>
            </div>
            <ol className={s.steps}>
              <li>
                <div>
                  <h3>En Windows: la aplicación de escritorio</h3>
                  <p>Windows de 64 bits, sin terminal ni Node.js. Descarga el instalador y ábrelo. Como todavía no está firmado, Windows te avisará: pulsa <strong>Más información</strong> y <strong>Ejecutar de todas formas</strong>.</p>
                  <div className={s.actions}><a className={`${s.button} ${s.primary}`} href={INSTALLER}>Descargar para Windows</a></div>
                </div>
              </li>
              <li>
                <div>
                  <h3>En Mac, Linux o desde la terminal: Node.js y una línea</h3>
                  <p>Instala <a href="https://nodejs.org/">Node.js</a> (la versión LTS, 20 o posterior). Abre una terminal, pega esta línea y pulsa Intro:</p>
                  <CopyCommand />
                  <p>Después, <code>miyagi web</code> abre la versión web y <code>miyagi init</code> prepara tu asignatura en la terminal.</p>
                </div>
              </li>
            </ol>
            <p className={s.needs}>La <Link to="/guia/primeros-pasos/">guía de primeros pasos</Link> lo explica todo con ejemplos, y puedes <Link to="/guia/elegir-version/">comparar las tres versiones</Link>.</p>
          </div>
        </section>

        <section id="preguntas" className={s.faq} aria-labelledby="preguntas-t">
          <div className={s.wrap}>
            <h2 id="preguntas-t">Preguntas frecuentes</h2>
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
            <p className={s.needs}>Más respuestas en las <Link to="/guia/preguntas-frecuentes/">preguntas frecuentes</Link> de la guía.</p>
          </div>
        </section>

        <section className={s.closing} aria-labelledby="final-t">
          <div className={s.wrap}>
            <h2 id="final-t"><span className={s.motto}>Lo repetitivo</span>, para miyagi.</h2>
            <p>Tú te quedas con lo que importa, que es enseñar.</p>
            <div className={s.actions}>
              <a className={`${s.button} ${s.primary}`} href={INSTALLER}>Descargar para Windows</a>
              <Link className={s.button} to="/guia/instalar/">Otras formas de instalarlo</Link>
              <a className={s.button} href="https://github.com/falkenslab/miyagi">Ver el código en GitHub</a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
