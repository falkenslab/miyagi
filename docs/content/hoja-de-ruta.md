---
title: Hoja de ruta
description: "Hacia dónde va miyagi: lo que ya está disponible, lo que viene, con su issue para seguirlo, y lo que miyagi no hará."
displayed_sidebar: null
---

# Hoja de ruta

:::info Es un plan
Esta página es la única de la web que habla de lo que todavía no existe. Solo lo marcado como **disponible** puedes usarlo hoy. Lo demás es la intención: puede cambiar o retrasarse. Cada punto enlaza su issue en GitHub, donde puedes seguirlo y comentar.
:::

## Disponible

Desde la versión 0.13.0:

- **Una ventana nueva, en la aplicación y en el navegador.** Una columna de iconos para las vistas, una columna de conversaciones redimensionable con búsqueda, campana y conversaciones fijadas, y el panel lateral con pestañas. Ver [La aplicación de escritorio](guia/escritorio.md).
- **Navegador integrado y barra de título propia**, solo en la aplicación de escritorio.
- **Visita guiada y trucos** al abrir una asignatura.
- **Esta documentación, por versiones:** guías y casos de uso de la aplicación, la versión web y la terminal, con capturas de las tres.

Desde la versión 0.12.0:

- **miyagi en una ventana.** La aplicación para Windows, que se instala con doble clic, con la conversación y sus paneles de aprobación, tus asignaturas por su nombre, las extensiones y tu asignatura de un vistazo. Ver [Instalar](guia/instalar.md).
- **miyagi en el navegador.** La misma página, con `miyagi web`. Ver [La versión web](guia/web.md).
- **Materiales escritos una vez.** Cuestionarios, bancos de preguntas, apuntes, tareas con su rúbrica y temas en archivos tuyos, con fechas por grupo, publicados en el aula con exportadores probados. Ver [Materiales](avanzado/materiales.md).
- **Actividades personalizadas.** Variantes equivalentes ambientadas en lo que interesa al grupo, a partir de una encuesta anónima. Ver [Habilidades](guia/habilidades.md).
- **Estilos visuales.** Lo que publica miyagi con el estilo que elijas, como extensiones, siempre accesible. Ver [Tus materiales](avanzado/materiales.md#el-estilo-de-lo-que-publicas).
- **Informes y banco de exámenes.** Informes del curso y un banco de preguntas por criterio y nivel que sirve de un curso a otro. El `.docx` con la plantilla de tu centro espera a una extensión de documentos; mientras, el informe sale como documento y PDF.
- **Esta web en inglés**, en `/en/`.

Desde la versión 0.11.0:

- **El aula, cuando tú quieras.** Puedes trabajar una asignatura sin Moodle (programación, temas, materiales) y conectar el aula más tarde. Ver [Primeros pasos](guia/primeros-pasos.md).
- **Tus asignaturas por su nombre.** Se guardan en `~/.miyagi` y las abres con `-w`, sin manejar carpetas.
- **Extensiones.** Desde el repositorio oficial de Falken's Lab o de otros que tú añadas. Ver [Extensiones](avanzado/extensiones.md).
- **Moodle sin navegador libre.** El aula se trabaja con las herramientas fijas de moodle-teacher. Inicias sesión tú, en su ventana, y los alumnos le llegan al modelo con seudónimo. moodle-teacher solo llega a los cursos de tus asignaturas.
- **Prácticas probadas en laboratorios de Docker.** Con la extensión docker-lab, y sin terminal en ningún sitio. Ver [Prácticas en Docker](avanzado/practicas-docker.md).
- **La vida de una actividad.** Para algo nuevo y complejo, un plan acordado, la construcción, la prueba oculta y servirla, con tu aprobación en cada paso y el recuento de lo que hay en marcha.
- **Tu normativa, cuando la pides.** Le das la normativa que te aplica, o le pides que la busque en las fuentes oficiales, y la programación y la evaluación la siguen, con los criterios citados tal cual.
- **Evaluación por criterios y atención a la diversidad.** La matriz de evaluación, cada nota trazada a su criterio, el DUA y las variantes de acceso, refuerzo y ampliación.
- **Llevar al curso un diseño tuyo**, por ejemplo de Canva: lo exporta en el formato que conviene y lo publica en su tema, oculto y con tu aprobación.

Lo que hace cada habilidad está en [Habilidades](guia/habilidades.md).

## Lo que viene

### Materiales y actividades

- **Videotutoriales con tu voz**, publicados en YouTube y enlazados en el aula ([#38](https://github.com/falkenslab/miyagi/issues/38)).

## Lo que miyagi no hará

- **Guardar datos personales de los alumnos.** miyagi solo trata los datos de los alumnos dentro del aula, a través de su extensión, con seudónimos, y nunca los guarda. Por eso quedan fuera la tutoría, las comunicaciones con las familias, las adaptaciones curriculares individuales, las sesiones de evaluación, corregir fuera del aula y conectarse con la gestión académica (Séneca, Pincel Ekade, Raíces, ITACA…).
- **Un catálogo de la comunidad o un sitio para compartir extensiones o actividades.** Las extensiones vienen del repositorio oficial o de los que tú añadas a sabiendas.
