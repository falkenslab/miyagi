---
title: 6. Tema 4 y práctica final
sidebar_position: 7
description: El tema de consultas con SELECT, un cuestionario, la práctica final con la rúbrica del profesor, el foro de dudas y los pesos del calificador.
---

# 6. Tema 4 y práctica final

El último tema es el que más pesa: consultas con `SELECT` y la práctica final, que vale el 50 % de la nota. Se lo pedimos todo de una vez, oculto hasta revisarlo:

<p className="pide">/miyagi:build-unit Tema 4: Consultar con SELECT, siguiendo la programación (filtros, orden, agregados con GROUP BY y HAVING, INNER y LEFT JOIN), con el ejercicio formativo de la semana 5, el cuestionario y la Práctica final «Consultas sobre la tienda»: una tarea con un único archivo consultas.sql y la rúbrica que te dejé en sources, con un script de datos de la tienda para que todos consulten lo mismo. Pruébalo todo en Docker. Y crea en la sección General un «Foro de dudas» para todo el curso. Todo oculto hasta que lo revises y me pidas permiso para mostrarlo.</p>

## Oculto, probado y con permiso

Esta vez cada pieza se crea oculta, con su aprobación, empezando por la propia sección:

<Shot src="/img/casos/29-t4-seccion-oculta.webp" alt="Panel de aprobación: crear la sección del Tema 4 oculta, para probarla, con su nombre y su resumen de las semanas 5 y 6.">Primero la sección, oculta.</Shot>

Antes de escribir nada, el probador de prácticas carga en MariaDB unos datos comunes de la tienda (8 clientes, 10 productos, 12 pedidos y 21 líneas) y ejecuta cada consulta de los apuntes, del ejercicio formativo y de la práctica final. Ese script de datos se publica también, para que toda la clase consulte lo mismo y pueda comparar resultados.

La práctica final usa tu rúbrica de `sources/`. miyagi la traduce a una rúbrica de Moodle (una línea por consulta, de 0,625 puntos, y los criterios de uso de SQL y legibilidad) y te dice qué ha redactado él:

<Shot src="/img/casos/30-t4-rubrica.webp" alt="Panel de aprobación: guardar la rúbrica de la práctica final, basada en la rúbrica del profesor: ocho criterios de resultado de 0, 0,3125 o 0,625 puntos, uso adecuado de SQL de 0 a 3 y legibilidad de 0 a 2, con la nota de que los niveles intermedios de los dos últimos los ha redactado él.">La rúbrica del profesor, convertida en una rúbrica de Moodle.</Shot>

El revisor pedagógico también pasó por aquí: cambió la consulta 8 de la práctica, que era casi igual que un ejemplo de los apuntes, y la 5, que se podía resolver sin `HAVING`.

Cuando todo está construido y comprobado, pide permiso una sola vez para mostrarlo, enumerando cada pieza y sus fechas:

<Shot src="/img/casos/31-t4-mostrar-todo.webp" alt="Panel de aprobación: mostrar a los alumnos la sección del Tema 4 con sus seis elementos (datos comunes, apuntes, práctica guiada, ejercicio formativo, cuestionario y práctica final con su rúbrica) y el Foro de dudas de la sección General, recordando que las fechas de apertura siguen en vigor.">Una aprobación que enumera todo lo que va a ver la clase.</Shot>

## Lo que decides tú

Al terminar, separa lo que cambió por la revisión pedagógica, las decisiones que tomó por su cuenta y lo que queda pendiente de ti:

<Shot src="/img/casos/32-t4-resumen.webp" alt="El resumen del Tema 4: cambios por la revisión pedagógica, decisiones suyas para revisar (cómo montó la rúbrica, un compromiso a nombre del profesor en el enunciado del formativo, la hora de apertura del cuestionario) y dos pendientes: los pesos del calificador y si dar el número de filas esperado.">Decisiones suyas que conviene revisar, y dos preguntas.</Shot>

Fíjate en el segundo punto: el enunciado del ejercicio formativo dice que repasarás en clase los fallos más comunes. Es un compromiso a tu nombre, y te lo avisa. Contestamos a los dos pendientes:

<p className="pide">Sí, ajusta los pesos del libro de calificaciones: 20 % los cuatro cuestionarios, 15 % cada bloque de ejercicios (Tema 2 y Tema 3) y 50 % la práctica final; el formativo y el entregable del Tema 1 no cuentan. El número de filas esperado no lo des: que lo comprueben ellos.</p>

<Shot src="/img/casos/33-pesos.webp" alt="La tabla final de pesos del libro de calificaciones: cuestionarios, ejercicios DDL 15 %, ejercicios DML 15 %, práctica final 50 % y entregable apto/no apto 0 %; el formativo no aparece porque no tiene nota.">Los pesos del calificador, tal como dice la programación.</Shot>

## El curso, terminado

Así ve el curso completo un alumno: el foro de dudas en la sección General y los cuatro temas con sus apuntes, prácticas, entregables y cuestionarios.

<Shot kind="moodle" src="/img/casos/35-curso-completo-alumno.webp" alt="El curso completo visto por un alumno: el Foro de dudas con su descripción en General y los temas 1 a 4, cada uno con su resumen, el orden a seguir y sus actividades con fechas; el Tema 4 con los datos comunes, apuntes, práctica guiada, ejercicio formativo, cuestionario y práctica final.">Introducción a SQL, de principio a fin.</Shot>

Y la práctica final, con su enunciado, cómo se califica y la rúbrica a la vista:

<Shot kind="moodle" src="/img/casos/34-practica-final-alumno.webp" alt="La práctica final vista por una alumna que ya ha entregado: el enunciado con las 8 consultas, cómo se califica, el plazo, el estado de la entrega con su archivo consultas.sql y la rúbrica con los diez criterios.">La práctica final, desde la cuenta de una alumna que ya ha entregado.</Shot>

:::note Para el tutorial adelantamos el calendario
La práctica final abría el 5 de noviembre. Para poder seguir con la corrección, en el Moodle de pruebas movimos sus fechas: tres alumnas y alumnos de prueba entregaron a tiempo y después dimos el plazo por vencido.
:::

Siguiente paso: [corregir con la rúbrica](corregir.md).
