# Un diseño de Canva, al curso

Aceptación de la #52: la skill `designed-material`, que pide `design-export` y `lms-content`, con canva 0.2.2 y moodle-teacher 0.4.0 instaladas. Se le pidió llevar a la sección «Tema 2: estructuras de control» del sandbox uno de los diseños del docente que sirviera como ficha o póster.

| Dato | Valor |
| --- | --- |
| Fecha | 25 oct 2026, 18:37–18:43 (hora de Canarias, UTC+0) |
| Entorno | moodle-sandbox · Moodle 5.2.4 · Docker, en Windows 11; la cuenta de Canva del docente |
| Curso | `sandbox-course` (id 2) |
| Versiones | miyagi `main` en 7d86cb8, con la #52 sin commit; agent-kit 0.30.1; canva 0.2.2; moodle-teacher 0.4.0 |
| Cómo | `miyagi chat` en un pseudoterminal; la aprobación, respondida «Sí» por un script; la elección del diseño, escrita a mano |

## Veredicto

**Superada.**

- Cargó `designed-material` antes que las skills de las extensiones.
- No encontró ningún diseño sobre el tema y, en vez de elegir uno, preguntó con la lista de los que podían servir.
- Con el elegido, una infografía, comprobó los formatos, lo exportó como PNG, lo guardó en `drafts/` y lo publicó como imagen dentro de una página oculta. La página lleva texto alternativo, una línea para los alumnos y, debajo, los comandos en texto.
- Pidió una aprobación antes de publicar, y nada se hizo visible.

## Qué se ejecutó

| Sesión | Encargo | Duración | Llamadas | Resultado |
| --- | --- | --- | --- | --- |
| chat | «Sube a la sección «Tema 2: estructuras de control» del curso uno de mis diseños de Canva que sirva a los alumnos como ficha o póster…»; después, «Usa la infografía vertical «Chuleta básica de Git» como póster, aunque no sea del tema» | 5,7 min | 26 (skills `designed-material`, `canva:designs`, `canva:export`, `moodle-teacher:course-content`, `publish-check`, `moodle-teacher:publishing`) | Página 1875 «Póster: chuleta básica de Git», oculta, con la imagen |

## Lo esperado y lo que hizo

| Esperado | Hecho |
| --- | --- |
| Encontrar el diseño, y preguntar si hay duda | Buscó por el tema y entre los 20 diseños más recientes; no había ninguno del tema y propuso los que podían servir (una chuleta de Git, chuletas de CSS3, una ficha del ciclo del agua) |
| El formato según el uso | `get-export-formats` y luego PNG de 1200 px, para verlo en una página |
| El archivo guardado antes de publicar | `drafts/poster-git-tema2/chuleta-basica-git.png` (2,1 MB), descargado con la caja de herramientas de borradores y comprobado con `drafts_info` |
| Publicado como el recurso que encaja, oculto | Una página (`create_activity` con `visibility: hidden`) en la sección del tema 2: `visible = 0`, la imagen guardada en la propia página (`@@PLUGINFILE@@/chuleta-basica-git.png`) |
| Accesible y sin datos de alumnos | Texto alternativo que describe los seis bloques y el esquema; los comandos repetidos en texto; comprobó que el póster solo lleva los ejemplos «Tu Nombre» y «tu@correo.com» |
| Con la aprobación del docente | Una, antes de crear la página: «Crear en la sección «Tema 2: estructuras de control» del curso 2 una página OCULTA, solo para probarla…» |

## Lo que no cubrió

- Mostrar la página y verla como alumno.
- Un PDF como recurso de archivo (una ficha para imprimir).
- Que la skill no se ofrezca sin una de las dos extensiones: lo garantiza el kit, que quita de la lista una skill cuyo `requires` no cubre ninguna extensión activa (`skillList()`), pero no se probó en una sesión.
