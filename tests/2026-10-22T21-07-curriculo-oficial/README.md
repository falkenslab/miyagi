# El currículo oficial de Bases de Datos de DAM en Canarias

Prueba de la habilidad `official-curriculum` y del cambio en `teaching-plan` (#31), en dos sesiones `run` sin aula. En la primera, el encargo de siempre (una programación de Bases de Datos de 1.º DAM) no debía buscar normativa por su cuenta; en la segunda, `/miyagi:curriculum` debía encontrar el currículo vigente del módulo 0484 en Canarias, guardar los originales y las páginas `curriculum/` con los resultados de aprendizaje y criterios literales, y escribir la programación siguiéndolos.

| Dato | Valor |
| --- | --- |
| Fecha | 22 oct 2026, 22:07–22:37 (hora de Canarias, UTC+1) |
| Entorno | Windows 11, sin aula (sin Moodle), con acceso a internet |
| Asignatura | Bases de Datos (0484), CFGS Desarrollo de Aplicaciones Multiplataforma, Canarias, curso 2026-2027 |
| Versiones | miyagi `main` sobre 94971f4, con los cambios de #17, #26 y #31 sin commit; agent-kit 0.28.0 |
| Cuenta | la suscripción de Claude del desarrollador |
| Espacios | dos asignaturas nuevas y vacías en el scratchpad, `language: español`, `sources/` vacío |

## Veredicto

**Superada con hallazgos.** Sin el sí del docente no buscó normativa: escribió sus propios criterios y, al final, ofreció una vez buscar el currículo oficial. Con `/miyagi:curriculum` encontró las cinco normas que cuentan (tres del BOE y dos del BOC) y comprobó su vigencia y sus modificaciones. También vio que Canarias no tiene currículo propio de DAM y remite al estatal. Guardó los originales y copió los criterios tal cual: las 129 citas de `curriculum/bases-de-datos-0484` están, palabra por palabra, en el texto descargado del BOE. Hubo un hallazgo: el ayudante `researcher` se quedó sin turnos con la búsqueda entera, y el agente tuvo que seguir él mismo.

## Qué se ejecutó

| Sesión | Encargo | Duración | Llamadas | Resultado |
| --- | --- | --- | --- | --- |
| A | `run --mode autonomous --task "Diseña la programación didáctica de un módulo de Bases de Datos de 1.º DAM con 4 temas (SQL básico)…"` | 4,1 min | 23 (1 skill: `teaching-plan`; 1 delegación: `pedagogy-reviewer`; ninguna búsqueda web) | Programación con RA y CE propios, marcados como propuesta |
| B | `run --mode autonomous --task "/miyagi:curriculum Módulo profesional Bases de Datos (0484)… en Canarias, curso 2026-2027. Después, escribe la programación…"` | 24,5 min | 157 (skills `official-curriculum` y `teaching-plan`; 9 WebSearch, 51 WebFetch, 7 `download_to_sources`, 35 Read) | 5 normas guardadas, 2 páginas `curriculum/`, 6 resúmenes, programación y 8 unidades |

## Lo esperado y lo que hizo

### Sin el sí del docente (sesión A)

| Esperado | Hecho |
| --- | --- |
| No busca normativa | Ninguna llamada a WebSearch, WebFetch ni `researcher`; dijo «Base de conocimiento vacía y sin fuentes del docente: redactaré un borrador con las propuestas marcadas» |
| La ofrece una vez | Primera de sus siete preguntas al final: «si quieres que busque el currículo oficial (el real decreto del título y la norma autonómica, que parece ser la de Canarias) para poner el texto literal de los RA y criterios» |

Con la regla anterior, el mismo encargo (lanzado en otra asignatura una hora antes, para la #26) dijo «consulto el currículo oficial antes de redactar» y descargó el RD 405/2023 sin que nadie se lo pidiera.

### Con `/miyagi:curriculum` (sesión B)

| Esperado | Hecho |
| --- | --- |
| La norma estatal, en vigor | RD 450/2010 (BOE-A-2010-8067), vigente con modificaciones, comprobado en su ficha del BOE: modificado por el RD 405/2023 (BOE-A-2023-13221), que reescribe el módulo 0484 (el RA7 pasa a bases de datos no relacionales), y por el RD 500/2024 (BOE-A-2024-10685) |
| La norma autonómica | Resolución de 30/10/2024 (BOC 226, anuncio 3747): el 0484 tiene 170 horas, a razón de 5 h/semana, en 1.º. Remite al real decreto para los RA y los criterios, porque Canarias no tiene orden de currículo propia para DAM, y así lo explica la página. Resolución de evaluación de 9/06/2025 (BOC 118, anuncio 2219), con su modificación de 3/12/2025, comprobado que no afecta al grado superior |
| Originales en `sources/curriculum/` | 11 archivos (PDF, HTML y su copia en markdown) de las cinco normas y la estructura modular de la Consejería |
| `curriculum/provisions` con url, fecha, vigencia y consulta | Sí, con `url`, `date: 2010-04-16`, `consulted: 2026-10-22`, y para cada norma cómo se comprobó; al final, lo pendiente: el calendario escolar (solo en prensa, sin verificar en el BOC), una resolución de FEOE citada y no descargada, y un decreto canario anunciado que aún no existe |
| `curriculum/<módulo>` literal con numeración oficial | `curriculum/bases-de-datos-0484`: RA1–RA7 con sus criterios (1a…), 129 citas; un script comparó cada una, sin marcas de markdown ni espacios de más, con el texto descargado: 129 de 129 están tal cual |
| La programación los sigue | `course/teaching-plan` enlaza `curriculum/` y usa RA1–RA7 con su numeración, ponderados por RA (RA1 8 %, RA2 13 %, RA3 20 %…), con el peso de cada CE dentro de su RA marcado como propuesta |
| `check-knowledge.mjs` | Sale bien: todas las páginas `curriculum/` tienen `url`, `date` y `consulted` |

## Aprobaciones

No hubo: las sesiones fueron `autonomous` y sin aula, así que nada se publicó.

## Hallazgos

1. **El ayudante se quedó sin turnos.** El agente le encargó a `researcher` toda la búsqueda (estatal y autonómica) en una sola petición, y el ayudante agotó sus 40 turnos sin informe. El agente siguió solo con las mismas reglas, y llegó. *Corregido:* `official-curriculum` pide ahora una búsqueda por norma y, si el ayudante vuelve sin ella, que siga él (`plugin/skills/official-curriculum/SKILL.md`).
2. **Una fuente de prensa.** Para el calendario escolar citó un periódico, pero lo marcó «sin verificar en el BOC» y dejó las fechas como aproximadas. No es currículo y la habilidad ya pide fuentes oficiales: *sin cambio*.

## Qué se añadió

- La habilidad `official-curriculum` y el atajo `/miyagi:curriculum`; el tipo de página `curriculum` (`src/knowledgeTypes.ts`); en `teaching-plan`, «ofrécelo una vez y búscalo solo con un sí» y la programación con la numeración oficial; en `check-knowledge.mjs`, que cada página `curriculum/` tenga `url`, `date` y `consulted`.

## Lo que no cubrió

- Un chat: la oferta se vio en `run` (como pregunta final), no la conversación en la que el docente dice que sí.
- Otra comunidad con currículo propio (por ejemplo, una orden autonómica que reescribe los criterios) ni ESO o Bachillerato.
- La comparación «a mano» con el boletín se hizo contra el texto descargado del BOE, no leyendo la página oficial en el navegador.
