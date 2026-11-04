---
title: Atajos e instrucciones
sidebar_position: 3
description: "Atajos propios para el chat en .claude/commands/, atajos con formulario que miyagi escribe contigo, y las instrucciones generales del curso en instructions.md, con ejemplos."
---

# Atajos e instrucciones

Además de las [habilidades propias](habilidades-propias.md), hay otras dos formas de adaptar miyagi a tu curso sin programar: los **atajos propios**, para lo que le pides a menudo, y las **instrucciones generales**, para lo que debe tener en cuenta siempre.

## Cuál usar

- **`instructions.md`**: reglas que valen para todo lo que hace en este curso. «Puntúa sobre 10 con un decimal.»
- **Un atajo propio**: una petición que repites a menudo y no quieres volver a escribir. «Revisa lo entregado esta semana en...»
- **Una habilidad propia**: un procedimiento que debe seguir cuando toque, aunque no se lo pidas con esas palabras. «Así se corrigen las prácticas de este curso.»

## Instrucciones generales: `instructions.md`

Es un archivo en la carpeta del curso (junto a `config.json`). `miyagi init` puede crearlo vacío si respondes que sí a su pregunta, pero también puedes crearlo tú a mano.

miyagi lo lee al empezar cada sesión y lo añade **al final** de sus propias instrucciones, como un ajuste para este curso: no las sustituye. Por eso sirve para matices (criterios, tono, prioridades, excepciones), no para quitarle sus reglas: las aprobaciones, por ejemplo, siguen ahí digas lo que digas.

Un ejemplo:

```markdown
- Puntúa sobre 10 con un decimal.
- La ortografía cuenta un 10 % en todas las tareas escritas.
- En el foro, respuestas breves y termina animando a seguir preguntando.
- Los ejemplos de los apuntes, con datos de una tienda online, que es el proyecto del curso.
- Antes de crear cualquier actividad evaluable, dime a qué criterio de la programación responde.
- No publiques nada los fines de semana sin avisarme.
```

Si el archivo está vacío, no añade nada. Los cambios se aplican en la siguiente sesión que abras.

:::tip
Si te encuentras escribiendo en `instructions.md` un procedimiento largo que solo vale para una tarea (cómo corregir un tipo de práctica, por ejemplo), conviértelo en una [habilidad propia](habilidades-propias.md): así solo lo carga cuando hace falta.
:::

## Atajos propios: `.claude/commands/`

Un atajo es un archivo Markdown en la carpeta `.claude/commands` del curso. El nombre del archivo es el nombre del atajo:

```text
mi-curso/
  .claude/
    commands/
      semana.md
```

`semana.md` se usa en el chat como `/semana`. A diferencia de los incorporados (`/miyagi:...`), los tuyos no llevan prefijo.

El contenido es la instrucción que quieres darle. Donde escribas `$ARGUMENTS`, el chat pone lo que escribas detrás del atajo. Opcionalmente, un encabezado con `description` hace que `miyagi commands` muestre para qué sirve:

```markdown
---
description: Resumen de lo entregado esta semana en una tarea, con los errores más repetidos
---

Revisa lo entregado esta semana en $ARGUMENTS, resume los errores más repetidos y propónme un aviso para la clase.
```

En el chat:

```text
/semana Tarea 3
```

Funciona igual que si hubieras escrito la frase completa con «Tarea 3» en lugar de `$ARGUMENTS`: se aplican las mismas reglas y las mismas aprobaciones.

### Más ejemplos

Un atajo para las dudas del foro de un tema, `.claude/commands/dudas.md`:

```markdown
---
description: Responder las dudas sin contestar del foro sobre un tema, con un ejemplo de código en cada respuesta
---

Revisa el foro de dudas y responde solo las preguntas sin contestar sobre $ARGUMENTS. Cada respuesta, con un ejemplo de código corto que siga el estilo SQL del curso. Después, dime si alguna duda se repite y qué añadirías a los apuntes de ese tema.
```

Uso: `/dudas JOIN`.

Un atajo sin argumentos, `.claude/commands/lunes.md`:

```markdown
---
description: Resumen del lunes - lo que ha pasado desde el viernes y lo que vence esta semana
---

¿Qué ha pasado en el curso desde el viernes? Entregas nuevas, mensajes en el foro y lo que vence esta semana. No publiques nada: solo el resumen.
```

Uso: `/lunes`.

### Comprobar que los ve

<Terminal>{`$ miyagi commands`}</Terminal>

Lista todos los atajos: los incorporados, marcados `[incorporada]`, y los tuyos, marcados `[propia]`. Igual que las habilidades, los atajos se leen al arrancar: si los creas con el chat abierto, ciérralo y vuelve a abrirlo.

## Atajos con formulario: pídeselo a miyagi

Si lo que repites cambia cada vez en unos pocos datos (la temática, cuántas palabras, cuáles, el nivel), no hace falta escribir el archivo a mano: pídele a miyagi que te haga el comando, o pulsa **🛠️ Crear un comando propio** en el ＋ del chat (también `/miyagi:new-command`).

<Prompt>{`Quiero un comando para hacer sopas de letras: la temática, el número de palabras y las palabras.`}</Prompt>

miyagi te pregunta lo que no sepa (en qué elementos debe salir, si es para esta asignatura o para todas), parte de una plantilla si alguna encaja (sopa de letras, crucigrama, relacionar parejas, ordenar pasos, tarjetas de repaso) y te enseña cómo quedará: su nombre y su icono, dónde sale y el formulario, campo a campo. **Solo lo guarda si le das el visto bueno**, y puedes pedirle que lo cambie después de la misma manera.

Desde la siguiente conversación (✎), el comando sale en el catálogo del ＋ y en el menú **⋯** de los elementos a los que se aplica. Al lanzarlo, la página te pide sus datos en un formulario, con el tema ya puesto si lo abriste desde un tema, y comprueba lo obligatorio y los números antes de enviarlo. En la conversación lo ves con su nombre (🔤 Sopa de letras · …) y miyagi lo hace con las mismas aprobaciones de siempre; lo que prepara queda en **Materiales**.

Dónde se guarda:

- **Para esta asignatura**: en `.claude/commands/` de su carpeta, como los atajos de arriba; se usa como `/sopa-de-letras`.
- **Para todas tus asignaturas**: en `~/.miyagi/own/commands/`; se usa como `/own:sopa-de-letras` y sale en todas ellas.

Un comando con formulario es un atajo con un encabezado más largo: su nombre en cada idioma (`label`), su icono, en qué grupo del catálogo va (`group`), en qué elementos sale (`applies-to`: un tema, una fuente, una página, un material…) y sus `parameters`, cada uno con su nombre, su etiqueta, su tipo (texto, número, una opción de una lista, una lista de palabras, un tema, una fuente o una página), si es obligatorio, su valor por defecto y sus límites. Lo que rellenas llega donde las instrucciones dicen `$ARGUMENTS`, como `topic: UT3 Modelo E-R; count: 10`.

:::info Lo que un comando no puede hacer
Un comando son instrucciones, nada más: corre con las mismas aprobaciones, los mismos permisos y las mismas comprobaciones que cualquier cosa que le pidas en el chat. Por eso miyagi no guarda uno que intente darse herramientas propias (`allowed-tools`), ejecutar una orden en la consola (una línea con !`…`) o meter un archivo con @ruta.
:::

## Material de referencia

Para que tenga en cuenta tu material (rúbricas, soluciones, apuntes, la programación), no hace falta ni atajo ni instrucción: déjalo en `sources` y ejecuta `miyagi ingest`. Lo tienes en [La base de conocimiento](base-de-conocimiento.md).
