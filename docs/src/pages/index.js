// The landing page, for teachers with no technical background: what miyagi does, how it keeps
// the teacher in control, how to install it, and where to see it working (the SQL course).
import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Logo from "@site/src/components/Logo";
import s from "./index.module.css";

const INSTALL = "npm install -g https://github.com/falkenslab/miyagi/releases/latest/download/miyagi.tgz";

const SCENES = [
  {
    id: "corregir",
    label: "Corregir",
    you: "Corrige la Tarea 2 con la rúbrica del tema",
    tools: ["Leyendo tu rúbrica y tus criterios", "Abriendo las entregas de la Tarea 2", "Corrigiendo 3 entregas, criterio a criterio"],
    agent: "Las tres están corregidas, con el desglose por criterio. Empiezo por la de Lucía: un 7,5.",
    ask: "Hace falta tu confirmación antes de publicar",
    what: "Guardar la nota de Lucía (7,5) y su retroalimentación: la consulta funciona, pero no valida la entrada; le explico cómo hacerlo.",
  },
  {
    id: "foro",
    label: "Foro",
    you: "¿Hay algo nuevo en el foro?",
    tools: ["Abriendo el foro de dudas", "Leyendo los temas sin respuesta"],
    agent: "Hay una duda nueva de Marcos: «¿Qué diferencia hay entre break y continue?». Es la segunda vez que sale: quizá el Tema 3 necesite un ejemplo más.",
    ask: "Hace falta tu confirmación antes de publicar",
    what: "Responder a Marcos en el foro: break sale del bucle; continue salta a la siguiente vuelta, con dos ejemplos de código.",
  },
  {
    id: "tema",
    label: "Crear un tema",
    you: "Añade un tema 4 sobre seguridad, planteado como un reto por equipos",
    tools: ["Leyendo tu programación didáctica", "Preparando apuntes, reto, rúbrica y cuestionario", "Subiendo el tema oculto y probándolo como profesor"],
    agent: "El Tema 4 está listo y oculto: apuntes, el reto por equipos con su rúbrica y un cuestionario de repaso. Lo he probado y todo funciona.",
    ask: "Hace falta tu confirmación antes de mostrarlo",
    what: "Hacer visible para los alumnos la sección «Tema 4: Seguridad», con sus cuatro actividades.",
  },
];

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
  ["¿Funciona con el Moodle de mi centro?", "Trabaja con el Moodle que ya usas, desde el navegador y con tu cuenta de profesor: no hay que instalar nada en el servidor. Está hecho para Moodle 4 y 5, y se prueba en Moodle 5.2. Al configurarlo, puede mirar (sin cambiar nada) qué tipos de actividad y de pregunta admite tu Moodle."],
  ["¿Tengo que saber programar?", "No. Se instala pegando una línea en la terminal, y después se usa conversando. La guía te lleva de la mano, y el aula de ejemplo lo enseña paso a paso con capturas reales."],
  ["¿Puede publicar algo sin que me dé cuenta?", "En el chat, antes de guardar una nota, responder en el foro o publicar contenido, te pide permiso con un resumen de lo que va a publicar. Si intenta publicar sin haberlo pedido, lo detiene y te pregunta."],
  ["¿Y si se equivoca?", "Ves cada nota, cada respuesta y cada recurso antes de que llegue a tus alumnos, y puedes decir que no o pedirle que lo cambie. Lo nuevo lo prueba oculto antes de mostrarlo. Si algo no te gusta de cómo trabaja, corrige sus apuntes o escríbeselo en instructions.md."],
  ["¿Qué pasa con los datos de mis alumnos?", "Lee lo que tú verías en Moodle para hacer su trabajo, pero en sus apuntes no guarda fichas de alumnos concretos, solo tendencias de la clase. Tu contraseña de Moodle nunca se envía al modelo."],
  ["¿Puedo darle mis propias instrucciones?", "Sí. Escribe en un archivo instructions.md de la carpeta del curso lo que quieras que tenga siempre en cuenta: «puntúa sobre 10», «sé breve en el foro», «la ortografía cuenta un 10 %». Y si quieres ir más allá, puedes enseñarle habilidades propias."],
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return reduced;
}

// The terminal plays one example: the request is typed, then each line appears, and it stops at
// the approval. Without JS or with reduced motion, the example is shown whole.
function Terminal() {
  const reduced = useReducedMotion();
  const [scene, setScene] = useState(SCENES[0].id);
  const [typed, setTyped] = useState(null);
  const [shown, setShown] = useState(Infinity);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (reduced || !("IntersectionObserver" in window)) return setStarted(true);
    setShown(0);
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        seen.disconnect();
        setStarted(true);
      }
    });
    seen.observe(ref.current);
    return () => seen.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!started) return undefined;
    const current = SCENES.find((x) => x.id === scene);
    if (reduced) {
      setTyped(null);
      setShown(Infinity);
      return undefined;
    }
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    setTyped("");
    setShown(1);
    const perChar = 38;
    for (let i = 1; i <= current.you.length; i++) later(() => setTyped(current.you.slice(0, i)), 300 + i * perChar);
    const typedAt = 300 + current.you.length * perChar + 350;
    later(() => setTyped(null), typedAt);
    const lines = current.tools.length + 2;
    for (let i = 0; i < lines; i++) later(() => setShown(2 + i), typedAt + i * 650);
    return () => timers.forEach(clearTimeout);
  }, [scene, started, reduced]);

  const current = SCENES.find((x) => x.id === scene);
  const lineClass = (i, base) => `${base} ${i < shown ? s.shown : ""}`;
  return (
    <div className={s.demo}>
      <div className={s.terminal} ref={ref}>
        <div className={s.bar} aria-hidden="true"><Logo width={26} height={28} />miyagi</div>
        <ol className={`${s.scene} ${reduced ? "" : s.animated}`} aria-label={`Ejemplo: ${current.label.toLowerCase()}`}>
          <li className={lineClass(0, s.tYou)}>
            <b>tú&gt;</b> <span className={typed !== null ? s.typing : ""}>{typed ?? current.you}</span>
          </li>
          {current.tools.map((tool, i) => <li key={tool} className={lineClass(i + 1, s.tTool)}>{tool}</li>)}
          <li className={lineClass(current.tools.length + 1, s.tAgent)}>{current.agent}</li>
          <li className={lineClass(current.tools.length + 2, s.tPanel)}>
            <strong>{current.ask}</strong>
            {current.what}
            <ul className={s.opts}><li className={s.on}>❯ 1. Sí</li><li>&nbsp; 2. No</li><li>&nbsp; 3. Parar</li></ul>
          </li>
        </ol>
      </div>
      <div className={s.scenes} role="group" aria-label="Ver otro ejemplo">
        {SCENES.map((x) => (
          <button key={x.id} type="button" aria-pressed={x.id === scene} onClick={() => setScene(x.id)}>{x.label}</button>
        ))}
      </div>
    </div>
  );
}

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
  const shot = useBaseUrl("/img/casos/40-aprobacion-foro.webp");
  return (
    <Layout title="El asistente que lleva tu curso de Moodle" description="miyagi entra en tu curso de Moodle con tu cuenta de profesor: corrige con tu rúbrica, atiende el foro, monta temas, cuestionarios y juegos, escribe tu programación y te dice cómo va la clase. Nada llega a tus alumnos sin tu permiso.">
      <main className={s.landing}>
        <section className={s.hero} aria-labelledby="titulo">
          <div className={s.wrap}>
            <p className={s.heroBrand}><Logo />miyagi</p>
            <div>
              <p className={s.kicker}>Asistente de IA de gestión de aulas Moodle para profesores</p>
              <h1 id="titulo">Tu curso de Moodle lo lleva miyagi. Tú das el visto bueno.</h1>
              <p className={s.lead}>Corrige con tu rúbrica, atiende el foro, monta temas, cuestionarios y juegos, y te dice cómo va la clase. Puedes enseñarle habilidades nuevas para adaptarlo a tu asignatura. Entra con tu cuenta de profesor y no publica nada sin tu permiso.</p>
              <div className={s.actions}>
                <Link className={`${s.button} ${s.primary}`} to="/guia/instalar/">Instalar miyagi</Link>
                <Link className={s.button} to="/casos-de-uso/">Verlo en un aula real</Link>
              </div>
              <p className={s.fine}>Gratis y de código abierto (licencia MIT). Funciona con tu suscripción de Claude.</p>
            </div>
            <Terminal />
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
            <p className={s.answer}><span>miyagi se encarga de esa parte.</span> Tú decides qué llega a tus alumnos.</p>
          </div>
        </section>

        <section id="que-hace" className={s.board} aria-labelledby="que-hace-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="que-hace-t">Qué hace por ti</h2>
              <p>Se lo pides con tus palabras, como a un compañero. Él trabaja en tu Moodle como lo harías tú.</p>
            </div>
            <Tabs />
          </div>
        </section>

        <section id="como" aria-labelledby="como-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="como-t">Cómo funciona</h2>
              <p>Sin instalar nada en el servidor de tu centro: usa Moodle desde Chrome, con tu cuenta, como tú.</p>
            </div>
            <ol className={s.how}>
              <li><h3>Instálalo</h3><p>Una línea en la terminal, en Windows, Mac o Linux.</p></li>
              <li><h3>Preséntale tu curso</h3><p><code>miyagi init</code> te pregunta la dirección del curso, tu cuenta y el tono. Explora tu Moodle, sin tocar nada, para saber qué admite. Si le dejas tu programación, tus rúbricas o tus criterios, los tiene en cuenta.</p></li>
              <li><h3>Pídeselo y aprueba</h3><p>Conversa con él o déjale recorrer el curso de una vez. Cuando algo vaya a llegar a tus alumnos, te lo enseña y espera tu sí.</p></li>
            </ol>
          </div>
        </section>

        <section id="control" className={s.board} aria-labelledby="control-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="control-t">Tú decides qué llega a tus alumnos</h2>
              <p>Trabaja con tu cuenta en tu curso real, así que está hecho para no dar pasos por su cuenta donde tus alumnos lo verían.</p>
            </div>
            <div className={s.control}>
              <div className={s.points}>
                <div className={s.point}>
                  <h3>Te pide permiso, cada vez</h3>
                  <p>Antes de guardar una nota, responder en el foro, publicar un recurso o cambiar una actividad, te enseña exactamente qué va a hacer y espera tu sí. Si dices que no, no lo hace. Y no depende solo de que se acuerde: el propio programa vigila los botones de publicar de Moodle y detiene lo que no hayas aprobado.</p>
                </div>
                <div className={s.point}>
                  <h3>Te recuerda lo pendiente</h3>
                  <p>Si algo se queda oculto a medio revisar, te lo recuerda al cerrar, para que nada se quede olvidado ni salga antes de tiempo.</p>
                </div>
              </div>
              <div>
                <h3>Lo nuevo, probado antes de mostrarlo</h3>
                <ol className={s.flow}>
                  <li><strong>Lo prepara</strong> en borradores, en tu ordenador.</li>
                  <li><strong>Lo sube oculto</strong> a tu curso.</li>
                  <li><strong>Lo prueba</strong> como profesor y como lo vería un alumno: redacción, accesibilidad, que funcione.</li>
                  <li><strong>Lo muestra</strong> solo cuando tú dices sí.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="nunca-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="nunca-t">Lo que nunca hace</h2>
              <p>Hay cosas que un asistente no debería hacer en tu curso. miyagi no las hace.</p>
            </div>
            <ul className={s.nevers}>
              <li><strong>No borra nada.</strong> Ni recursos, ni actividades, ni mensajes.</li>
              <li><strong>No toca las matrículas</strong> ni la configuración del sitio de Moodle.</li>
              <li><strong>No sale de tu curso.</strong> No entra en otros cursos.</li>
              <li><strong>No ve tu contraseña.</strong> Escribe un marcador y es Chrome quien pone la real.</li>
              <li><strong>No guarda fichas de alumnos.</strong> En sus apuntes solo hay tendencias de la clase.</li>
              <li><strong>No ejecuta programas en tu ordenador.</strong> Salvo que actives la prueba de prácticas, y entonces solo dentro de contenedores Docker.</li>
            </ul>
          </div>
        </section>

        <section className={s.tinted} aria-labelledby="real-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="real-t">Míralo trabajar en un aula real</h2>
              <p>Un aula de «Introducción a SQL» montada de cero con miyagi, paso a paso y con capturas reales: de la programación a la corrección.</p>
            </div>
            <figure className={s.shot}>
              <div className={s.window}>
                <div className={s.windowBar} aria-hidden="true"><span className={s.windowDots}><i /><i /><i /></span><span className={s.windowTitle}>miyagi — Introducción a SQL</span></div>
                <a href={shot}>
                  <img src={shot} width="1400" height="1037" loading="lazy" alt="El chat de miyagi pidiendo permiso para publicar dos respuestas en el foro del aula de SQL: una pista para un ERROR 1452 de clave ajena y la corrección de la respuesta equivocada de una compañera sobre WHERE y HAVING, con los textos completos." />
                </a>
              </div>
              <figcaption>Una sesión real del aula de SQL: antes de responder en el foro, enseña los dos mensajes completos y espera tu sí.</figcaption>
            </figure>
            <div className={s.actions}>
              <Link className={`${s.button} ${s.primary}`} to="/casos-de-uso/">Ver el aula de SQL paso a paso</Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="metodo-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}>
              <h2 id="metodo-t">Enseña como tú quieras enseñar</h2>
              <p>Le dices cómo quieres dar el tema y lo monta con piezas de Moodle que existen de verdad: talleres de coevaluación, lecciones con itinerarios, insignias, grupos, restricciones. Después, un revisor pedagógico lo repasa.</p>
            </div>
            <ul className={s.chips}>{METHODS.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        </section>

        <section className={s.tinted} aria-labelledby="memoria-t">
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

        <section aria-labelledby="ayudantes-t">
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

        <section className={s.tinted} aria-labelledby="manera-t">
          <div className={s.wrap}>
            <div className={s.sectionIntro}><h2 id="manera-t">A tu manera</h2></div>
            <div className={`${s.cards} ${s.four}`}>
              <div className={s.card}><h3>Con tu tono</h3><p>Formal, cercano o motivador: tú eliges cómo habla con tus alumnos en el foro y en la retroalimentación.</p></div>
              <div className={s.card}><h3>En tu idioma</h3><p>Te atiende en español, inglés, francés o alemán. Lo que publica sigue siempre el idioma de tu curso.</p></div>
              <div className={s.card}><h3>Conversa o delega</h3><p>Un chat que puedes retomar otro día, o una pasada por todo el curso. Pulsa Esc y para lo que esté haciendo.</p></div>
              <div className={s.card}><h3>Hazlo tuyo</h3><p>Instrucciones que siempre respeta («puntúa sobre 10»), <Link to="/avanzado/habilidades-propias/">habilidades</Link> y atajos propios. Todo en archivos de texto, sin programar.</p></div>
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
              <h2 id="instalar-t">Instálalo en tres pasos</h2>
              <p>En Windows, Mac o Linux. No hace falta saber programar.</p>
            </div>
            <ol className={s.steps}>
              <li><div><h3>Instala Google Chrome</h3><p>Si no lo tienes ya, desde <a href="https://www.google.com/chrome/">google.com/chrome</a>. miyagi lo usa para entrar en Moodle.</p></div></li>
              <li><div><h3>Instala Node.js</h3><p>La versión LTS desde <a href="https://nodejs.org/">nodejs.org</a>, con las opciones por defecto.</p></div></li>
              <li>
                <div>
                  <h3>Instala miyagi</h3>
                  <p>Abre una terminal (PowerShell en Windows, Terminal en Mac), pega esta línea y pulsa Intro:</p>
                  <CopyCommand />
                  <p>Después, escribe <code>miyagi init</code> en la carpeta que quieras usar para tu curso y responde a sus preguntas.</p>
                </div>
              </li>
            </ol>
            <p className={s.needs}>Necesitas un curso de Moodle en el que tengas rol de profesor y una suscripción de Claude Pro o Max. La <Link to="/guia/primeros-pasos/">guía de primeros pasos</Link> lo explica todo con ejemplos.</p>
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
            <h2 id="final-t">Dar cera, pulir cera: eso, para miyagi</h2>
            <p>Tú te quedas con lo que importa, que es enseñar.</p>
            <div className={s.actions}>
              <Link className={`${s.button} ${s.primary}`} to="/guia/instalar/">Instalar miyagi</Link>
              <a className={s.button} href="https://github.com/falkenslab/miyagi">Ver el código en GitHub</a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
