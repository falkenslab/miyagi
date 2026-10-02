---
title: Preguntas frecuentes
sidebar_position: 9
description: "Lo que más se pregunta sobre miyagi: coste, seguridad, datos de los alumnos, idiomas, qué Moodle admite y más."
---

# Preguntas frecuentes

## Antes de empezar

### ¿Cuánto cuesta?

miyagi es gratuito y de código abierto, con licencia MIT. No hay planes ni cuotas. Lo que hace funcionar al asistente es tu suscripción de Claude (Pro o Max).

### ¿En qué se diferencia de preguntarle a un chat de IA?

Un chat te da un texto y el resto lo haces tú en Moodle. miyagi entra en tu curso y hace el trabajo allí: pone la nota con su retroalimentación, responde en el foro, crea la tarea con su rúbrica. Además recuerda tu curso de una sesión a otra y te pide permiso antes de que tus alumnos vean nada.

### ¿Funciona con el Moodle de mi centro?

Trabaja con el Moodle que ya usas, desde el navegador y con tu cuenta de profesor: no hay que instalar nada en el servidor. Está hecho para Moodle 4 y 5, y se prueba en Moodle 5.2. Al configurarlo, puede mirar (sin cambiar nada) qué tipos de actividad y de pregunta admite tu Moodle.

### ¿Tengo que saber programar?

No. Se instala pegando una línea en la terminal y después se usa conversando. [Instalar](instalar.md) y [Primeros pasos](primeros-pasos.md) te llevan de la mano.

## Control y seguridad

### ¿Puede publicar algo sin que me dé cuenta?

En el chat, antes de guardar una nota, responder en el foro o publicar contenido, te pide permiso con un resumen de lo que va a publicar. Si intenta pulsar un botón de publicar de Moodle sin haberlo pedido, el propio programa lo detiene y te pregunta. La única forma de que publique sin preguntar es que lo lances a propósito en modo `autonomous` con `miyagi run`.

### ¿Y si se equivoca?

Ves cada nota, cada respuesta y cada recurso antes de que llegue a tus alumnos, y puedes decir que no o pedirle que lo cambie. Lo nuevo lo prueba oculto en Moodle antes de mostrarlo. Si algo no te gusta de cómo trabaja, corrige sus apuntes o escríbeselo en `instructions.md`.

### ¿Puede borrar cosas o salirse de mi curso?

Tiene instrucciones de no borrar nada, no cambiar matrículas, no tocar la configuración de Moodle ni entrar en otros cursos. Aun así, usa el chat o el modo `guided` para revisar todo lo que publica.

### ¿Mi contraseña está segura?

Se guarda en el archivo `config.json` de la carpeta del curso, en tu ordenador. El asistente nunca la ve: escribe un marcador en el campo de contraseña y es el propio Chrome quien pone la real. Tampoco puede abrir ese archivo. Si prefieres no guardarla, deja el usuario en blanco al configurar el curso y entra tú a mano cada vez.

### ¿Qué pasa con los datos de mis alumnos?

Lee lo que tú verías en Moodle para hacer su trabajo, pero en sus apuntes no guarda fichas de alumnos concretos, solo tendencias de la clase. Tu contraseña de Moodle nunca se envía al modelo. Más detalle en [Seguridad y privacidad](../avanzado/seguridad-y-privacidad.md).

### ¿Ejecuta programas en mi ordenador?

No, salvo que actives el probador de prácticas para cursos de informática. Y entonces solo dentro de contenedores Docker, en una carpeta del curso. Lo tienes en [Prácticas en Docker](../avanzado/practicas-docker.md).

## Su forma de trabajar

### ¿Dónde están sus apuntes?

En la carpeta `knowledge` del curso: archivos de texto que puedes abrir con cualquier editor (o con [Obsidian](https://obsidian.md), que muestra cómo se enlazan). Lo tienes en [La memoria del curso](memoria.md).

### ¿Cómo prueba lo que crea antes de que lo vean los alumnos?

Lo prepara en la carpeta `drafts` del curso, lo sube a Moodle **oculto** (con tu permiso), lo prueba ahí como profesor y te pide permiso otra vez para mostrarlo. Lo que dejes oculto queda apuntado en `knowledge/drafts.md` y te lo recuerda al cerrar la sesión.

### ¿Puedo darle instrucciones propias?

Sí. Crea un archivo `instructions.md` en la carpeta del curso y escribe ahí lo que quieras que tenga siempre en cuenta: «puntúa sobre 10», «sé breve en el foro», «la ortografía cuenta un 10 %». También puedes crear atajos y habilidades propias: [Atajos e instrucciones](../avanzado/atajos-e-instrucciones.md).

### ¿En qué idioma habla?

En el que elegiste al configurar el curso, que es también el de sus menús y avisos si es español, inglés, francés o alemán. Para cambiar los menús solo una vez, añade `--language=en` (o `es`, `fr`, `de`) a la orden. Si le escribes en otro idioma, te sigue. Lo que publica en Moodle va siempre en el idioma del curso, hables tú en el que hables.

### ¿Puede descargar, comprimir o hacer PDF?

Sí, dentro de la carpeta `drafts` del curso y con sus propias herramientas, sin terminal: descarga archivos y páginas web completas, copia, comprime y descomprime (por ejemplo, para un paquete SCORM) y convierte apuntes a PDF. Por seguridad hay límites de tamaño, que puedes cambiar: [Configuración](../avanzado/configuracion.md).

### No quiero ver la ventana de Chrome

Añade `--headless` a la orden, por ejemplo `miyagi chat --headless`. Necesita tu usuario y contraseña guardados.

### ¿Puedo retomar una conversación de otro día?

Sí. `miyagi chat --continue` abre la última, y `/resume` dentro del chat te deja elegir cualquiera anterior. Lo tienes en [El chat](chat.md).

## Si venías de otra versión

### Venía usando teacher-agent

Es el mismo proyecto con otro nombre desde la versión 0.10. Instala miyagi como se explica en [Instalar](instalar.md); tu configuración (incluido el acceso a Claude) y tus carpetas de curso sirven tal cual. El comando `teacher-agent` sigue funcionando un tiempo, con un aviso. Cuando quieras, quita el paquete antiguo:

```bash
npm uninstall -g teacher-agent
```

### Venía usando moodle-agent

Tu carpeta de aula de profesor sirve tal cual: ejecuta `miyagi chat` dentro de ella y el asistente reorganizará sus apuntes al formato nuevo la primera vez.
