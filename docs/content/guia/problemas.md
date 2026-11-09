---
title: Consejos y problemas
sidebar_position: 14
description: "Consejos para sacarle partido a miyagi y qué hacer cuando algo no funciona."
---

# Consejos y problemas

## Consejos

- **Empieza en un curso de pruebas**, y por preguntas que no publican nada (el nivel 1 de [Qué pedirle](ideas.md)). Cuando veas cómo trabaja, pasa a uno real.
- **Dale tu material.** Una rúbrica en Fuentes vale más que diez explicaciones en la conversación.
- **Sé concreto.** *«Corrige la Tarea 2 de 1.º A»* mejor que *«corrige lo de la semana pasada»*.
- **Rechazar también enseña.** Si dices que no a algo, explícale por qué.
- **Lee bien cada permiso** las primeras veces: el resumen te dice exactamente qué va a cambiar en Moodle.
- **Una carpeta por curso**, y no mezcles cursos en la misma.

## Si algo falla

| Problema | Solución |
| --- | --- |
| Windows avisa de que no reconoce la aplicación al instalar | El instalador todavía no está firmado. Pulsa **Más información** y **Ejecutar de todas formas**. |
| La terminal no reconoce `miyagi` | Cierra y abre la terminal. Comprueba `node --version` (tiene que ser 20 o más) y repite la instalación. |
| Dice que aquí no hay ninguna asignatura (terminal) | Estás fuera de la carpeta de una asignatura. Añade `-w <nombre>` a la orden (`miyagi workspaces` te da los nombres), o usa `miyagi` a secas para elegirla. |
| Espera a que inicies sesión en Moodle | Entra tú en la ventana del navegador que ha abierto la extensión moodle-teacher. Solo pasa la primera vez o cuando la sesión caduca. Esa ventana es distinta del navegador integrado del panel lateral. |
| Dice que el navegador de Moodle se ha cerrado a medias o que una herramienta no responde | Puede pasar: el navegador con el que moodle-teacher trabaja en Moodle a veces se cae durante un trabajo largo. Antes de repetir un paso, miyagi comprueba si el cambio llegó a guardarse, para no aplicarlo dos veces. Si no se recupera, dile que siga cuando quieras («sigue donde lo dejaste»), y revisa lo que haya publicado: un cuestionario puede quedarse con menos preguntas de las pedidas (y miyagi puede culpar a Moodle cuando la causa es el navegador). Mira si tienes Edge o Chrome actualizado. |
| Una conversación tarda en arrancar y se reabre | Si no arranca en cinco minutos, se abre otra y te avisa. Vuelve a pedírselo; si se repite, comprueba tu conexión. |
| No puede leer una entrega que es un archivo | Con la protección de datos por defecto, moodle-teacher no le deja a miyagi descargar archivos de los alumnos. Te pedirá que le pases cada uno bajo un alias: lo verás en [el tutorial](/casos-de-uso/corregir/). Las entregas de texto sí le llegan. |
| La exploración del Moodle falló al conectar el aula | La asignatura ya está configurada. Comprueba que iniciaste sesión en la ventana y repite con `miyagi explore`. |
| Te pregunta «¿Pasar ahora esta aula a moodle-teacher?» | El aula se conectó con el sistema anterior, que ya no existe. Di que sí: instala moodle-teacher y borra de `config.json` el usuario y la contraseña guardados. Si dices que no, esa sesión trabaja sin el aula (solo planes y borradores). |
| Avisa de que trabaja sin el aula | La extensión moodle-teacher no está instalada o está desactivada. En la aplicación vuelve a conectar el aula en **Tu aula**, o en la terminal con `miyagi init -w <nombre>`, o actívala (ver [Extensiones](/avanzado/extensiones/)). |
| Los menús salen en otro idioma | En la terminal añade `--language=es` (o `en`, `fr`, `de`), o pon el idioma en `config.json` (ver [Configuración](/avanzado/configuracion/)). |
| Está haciendo algo que no quería | Pulsa `Esc` o el botón ■ (en `run`, `Ctrl+C`) y dile qué hacer en su lugar. |
| Recuerda algo mal | Díselo en la conversación o edita la página de `knowledge`. |
| No lee un documento de `sources` | Comprueba el formato. Los de OpenDocument (`.odt`) no los lee bien: expórtalos a PDF o DOCX. Los vídeos tampoco los puede transcribir. |
| Dice que no puede probar una práctica | Falta la extensión docker-lab (o está desactivada) o falta Docker. Ver [Prácticas en Docker](/avanzado/practicas-docker/). |
| Al cerrar dice «En el horno: …» | Son las actividades que tiene a medias: en plan, construyéndose o subidas ocultas para probarlas, que tus alumnos aún no ven. Las ves en la vista **En el horno** y en `knowledge/drafts.md`: pídele que siga con ellas, que las muestre o que las descarte. |
| Venía de moodle-agent | Abre esa asignatura con `miyagi chat` en su carpeta: reorganiza sus apuntes solo. |

Si el problema sigue, puedes contarlo en [GitHub](https://github.com/falkenslab/miyagi/issues).
