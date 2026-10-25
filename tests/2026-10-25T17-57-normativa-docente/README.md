# La normativa que trae el docente

Aceptación de la #55: la skill `regulations`, sin ningún país dentro, con normas reales de Canarias. Tres sesiones sin aula:
- un `ingest` con la resolución de evaluación de FP en `sources/`;
- un `run` que pide la programación de Bases de Datos de 1.º de DAM con su evaluación, que busque el calendario escolar y fije las fechas, y una pregunta sobre faltas que depende de otra norma;
- tras corregir la skill, un `run` corto con la misma pregunta y sin permiso para buscar nada.

| Dato | Valor |
| --- | --- |
| Fecha | 25 oct 2026, 17:57–18:25 (hora de Canarias, ya en horario de invierno, UTC+0) |
| Entorno | Windows 11, sin aula, con acceso a internet |
| Asignatura | Bases de Datos (0484), 1.º de DAM, Canarias, curso 2026-2027 |
| Versiones | miyagi `main` en 942e4e7, con la #55 sin commit; agent-kit 0.30.1 |
| Cuenta | la suscripción de Claude del desarrollador |
| Espacios | dos asignaturas nuevas en el scratchpad; en `sources/`, solo la Resolución de 9 de junio de 2025 de la DGFPERE (evaluación en FP, BOC n.º 118), en su versión HTML pasada a markdown |

## Veredicto

**Superada con hallazgos.**

- **`ingest`:** convirtió la resolución en una página `regulation/` con su rango, quién la dicta, su vigencia y lo que obliga, punto por punto y citado tal cual.
- **La programación:**
  - evalúa como dice la resolución;
  - pone fechas a las unidades en los días lectivos del calendario oficial, que encontró a petición;
  - separa lo que impone la norma de lo que propone, y pide lo que no sabe.
- **Dos fallos en la primera versión de la skill**, corregidos:
  - buscó por su cuenta dos normas que no se le habían pedido;
  - dio por festivo un día que el calendario no recoge.

  Repetida la pregunta con la skill corregida, respondió lo que decide la norma que tenía y pidió las demás, sin buscarlas.

## Qué se ejecutó

| Sesión | Encargo | Duración | Llamadas | Resultado |
| --- | --- | --- | --- | --- |
| `ingest` | La resolución de evaluación en `sources/` | 2,4 min | 23 (`regulations`; 5 Read; 1 WebSearch para comprobar la vigencia) | `regulation/evaluacion-fp-grados-d-e-canarias-2025`, un resumen, 4 conceptos, 2 entidades |
| `run` | «Escribe la programación… con su evaluación según la normativa que te dejé. Busca también la resolución del calendario escolar 2026-2027 de Canarias y pon fechas… Y dime cuántas faltas…» | 21,7 min | 189 (4 delegaciones en `researcher` y `pedagogy-reviewer`, 21 WebSearch, 63 WebFetch, 5 `download_to_sources`) | Programación, 8 unidades fechadas, matriz de evaluación, `curriculum/` y 3 `regulation/` |
| `run` (repetición) | «Con la normativa que te dejé en sources: ¿cuántas faltas… ? ¿Y qué días son festivos…?» | 1,3 min | 14 (ninguna búsqueda web) | Responde lo que fija la resolución y pide el calendario y la norma de faltas |

## Lo esperado y lo que hizo

### La norma en `sources/` (ingest)

| Esperado | Hecho |
| --- | --- |
| Reconocer que es una norma | «Una sola fuente, una resolución del BOC (norma de evaluación). Cargo la skill de normativa y leo el original completo» (1053 líneas) |
| Rango, emisor, fecha, vigencia | Resolución (instrucciones de servicio), DGFPERE, 9/06/2025. Detectó una modificación de 3/12/2025 que no estaba en `sources/` y la dejó como pendiente. Avisó de que la copia es la versión HTML, que el BOC declara no oficial |
| Lo que obliga, citado | Sesiones de evaluación (inicial sin nota, dos parciales, final), promoción («no supongan en su conjunto más del 20% de la carga horaria del primer curso»), calificación («numérica entre 1 y 10, sin decimales»), FEOE desde el segundo trimestre, informe de recuperación, reclamaciones; cada punto con su instrucción |
| `url`, `date`, `consulted` | Sí |

### La programación con su normativa (run)

| Esperado | Hecho |
| --- | --- |
| La evaluación según la resolución, citándola | Por resultados de aprendizaje, nota de 1 a 10 sin decimales, aprobado con 5, evaluación inicial sin nota, dos parciales y final, refuerzo revisado en cada sesión |
| El calendario, buscado porque se pidió | Resolución de 17/03/2026 (BOC n.º 61) y su corrección de 10/04/2026 (BOC n.º 75), en `sources/normativa/`. `regulation/calendario-escolar-canarias-2026-2027` |
| Unidades en días lectivos | 178 días lectivos (66, 50 y 62 por trimestre) con `date_math`; las 8 unidades fechadas; la 1.ª parcial antes de Navidad y la 2.ª antes de Semana Santa |
| Lo que no sabe, pedido | Las horas del módulo en Canarias, el centro y la isla (fiestas insulares y locales, días de libre disposición), el porcentaje de faltas de la PGA, si hay formación en empresa en 1.º |
| Propuestas separadas de lo que impone la norma | «Todos los RA aprobados para superar el módulo… Esta regla no la impone la norma» |
| No buscar normas no pedidas | **No:** buscó también el currículo del módulo (RD 450/2010 y su sustitución por el RD 405/2023) y el Decreto 174/2018 de absentismo para la pregunta de las faltas |
| No dar por supuesto un festivo | **No:** «El 12-10 no figura en la resolución; lo cuento como festivo por ser fiesta nacional» |

### La repetición, sin permiso para buscar

| Esperado | Hecho |
| --- | --- |
| Responder lo que decide la norma que tiene | Citó la instrucción («asistencia regular… asistencia mínima establecida») y explicó que el 10 % que aparece es de la modalidad semipresencial |
| Decir qué norma falta y pedirla, sin buscarla | «La resolución no da ninguna cifra»; remite a la Orden de 20/10/2000 o al Decreto 174/2018, y al calendario. «¿Quieres que busque estas normas en el BOC y en la web de la Consejería, o prefieres dejarlas tú en `sources/`?» Ninguna búsqueda web |

## Hallazgos

1. **Buscaba normas no pedidas.** El permiso para buscar el calendario lo tomó como permiso general. *Corregido* en `plugin/skills/regulations/SKILL.md`:
   - la petición cubre solo la norma que el docente nombra, y lo que la modificó después;
   - una norma de la que depende una decisión o una pregunta, incluidas las que otra norma cita, se pide y no se busca.

   Verificado en la repetición.
2. **Daba por supuesto un festivo.** *Corregido* en la skill: un día que el calendario no recoge se lista para que lo confirme el docente.
3. **`curriculum/provisions` sin `url` ni `date`.** Esa página lista varias normas, y `check-knowledge.mjs` lo detectó. *Corregido* en la skill: lleva los de la norma principal, la que fija el currículo.
4. **Líneas en inglés.** En la repetición se escaparon dos frases de narración («I'll read the whole document in parts to get the context right.»). *Abierto*: la #26 no está resuelta del todo; la línea al principio de cada skill no basta siempre.

## Lo que no cubrió

- Un currículo traído por el docente, en vez de buscado.
- Un choque entre las instrucciones del docente y una norma.
- La programación con la skill corregida: la repetición solo hizo la pregunta de las faltas y los festivos.
- Otra comunidad u otro país.
