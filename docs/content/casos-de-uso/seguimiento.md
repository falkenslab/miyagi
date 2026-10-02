---
title: 9. Seguimiento y auditoría
sidebar_position: 10
description: Cómo va la clase, separando datos de interpretación, y una auditoría del curso entero con recomendaciones por prioridad.
---

# 9. Seguimiento y auditoría

## Cómo va la clase

Con las primeras notas puestas, le preguntamos por la clase con el atajo de seguimiento:

<p className="pide">/miyagi:progress</p>

Mira el calificador y el resumen de actividades, y separa lo que son datos de lo que es su interpretación:

<Shot src="/img/casos/44-progreso.webp" alt="La revisión del progreso: datos del calificador (un alumno sin entregar nada, dos suspensos en la práctica final, una alumna con 9,38, el resto de actividades aún sin vencer, el total del curso todavía no ponderado) y su interpretación (lo que más falla es HAVING, LEFT JOIN y el orden; la causa probable; el alumno de prueba); no publica ningún aviso y guarda la revisión en progress.md sin nombres.">Datos por un lado, interpretación por otro, y ningún aviso innecesario.</Shot>

Dos detalles importan aquí:

- **No publica avisos por su cuenta.** Con un solo alumno sin entregar y nada más vencido, no ve motivo para escribir a la clase.
- **No guarda fichas de alumnos.** La revisión queda en `knowledge/progress.md` como tendencia de la clase, sin nombres, para comparar con la siguiente.

## Auditar el curso entero

Antes de que empiecen las clases, una revisión completa:

<p className="pide">/miyagi:audit</p>

Recorre el curso sin cambiar nada (organización, fechas, evaluación, accesibilidad, pedagogía, con una segunda opinión del revisor pedagógico) y devuelve las recomendaciones por prioridad. Las de prioridad alta, en este caso, no eran evidentes:

<Shot src="/img/casos/45-auditoria-alta.webp" alt="La auditoría, prioridad alta: las fechas de prueba de la práctica final; que los cuestionarios no miden bien porque el segundo intento repite las preguntas y la respuesta correcta se ve al terminar el primero; y que la interpretación de la rúbrica aprobada ese día permite aprobar con una sola consulta correcta, con una alternativa.">Las tres recomendaciones de prioridad alta.</Shot>

La tercera es la más interesante: la interpretación de la rúbrica que aprobamos al corregir («los criterios de uso de SQL y legibilidad se valoran sobre lo que funciona») tiene un efecto que nadie vio entonces. Quien haga bien una sola consulta sacaría un 5,6 sin un solo `JOIN` ni `HAVING`. Lo señala, propone una alternativa y deja la decisión al profesor.

Después vienen las de prioridad media y baja: que no hay una guía del curso, que el `JOIN` llega a la nota final sin ninguna práctica corregida antes, que el Tema 4 está sobrecargado, que el seguimiento de finalización está desactivado, que la fecha de fin del curso no está puesta…

<Shot src="/img/casos/46-auditoria-media-baja.webp" alt="La auditoría, prioridad media y baja: no hay guía del curso, el Tema 4 llega al JOIN sin práctica corregida y está sobrecargado, lo práctico se evalúa solo con preguntas tipo test, el seguimiento de finalización está desactivado, y detalles como encabezados distintos en las prácticas guiadas o la fecha de fin del curso.">Prioridad media y baja, y la pregunta de por dónde empezar.</Shot>

La auditoría queda guardada con su fecha en `knowledge/course-audit.md`, así que la próxima te dirá qué ha mejorado.

## Aplicar una recomendación

Elegimos la más visible para los alumnos:

<p className="pide">Haz el punto 4: una página «Guía del curso» en General con los pesos, el calendario, la política de entregas tardías para todas las tareas y qué hacer si Docker no funciona. Lo demás lo vemos otro día.</p>

La crea oculta, la revisa como profesor y en ancho de móvil, y antes de mostrarla avisa de dos cosas que no puede decidir él:

<Shot src="/img/casos/47-guia-resumen.webp" alt="El resumen de la guía del curso: lo que contiene (pesos, calendario, entregas tardías, qué hacer si Docker no funciona, dónde preguntar), revisada en móvil, y dos avisos antes de mostrarla: las fechas de la práctica final y qué alternativa ofrecer a quien no pueda usar Docker.">La guía, lista y oculta, con dos preguntas antes de enseñarla.</Shot>

Le pedimos que devolviera la práctica final a sus fechas reales (del 5 al 15 de noviembre, sin tocar las notas) y que mostrara la guía tal cual. Así la ven los alumnos:

<Shot kind="moodle" src="/img/casos/48-guia-curso.webp" alt="La página Guía del curso vista por un alumno: cómo se calcula la nota con una tabla de pesos, el calendario de las seis semanas con temas y entregas, qué pasa si se entrega tarde en cada tipo de actividad, cómo comprobar Docker antes de la primera clase, qué hacer si Docker no funciona y dónde preguntar.">La guía del curso: pesos, calendario, entregas tardías y qué hacer si Docker falla.</Shot>

Siguiente paso: [tu propia habilidad](habilidad-propia.md).
