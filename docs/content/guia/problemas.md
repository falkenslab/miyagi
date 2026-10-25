---
title: Consejos y problemas
sidebar_position: 10
description: "Consejos para sacarle partido a miyagi y qué hacer cuando algo no funciona."
---

# Consejos y problemas

## Consejos

- **Empieza en un curso de pruebas**, y por preguntas que no publican nada (el nivel 1 de [Qué pedirle](ideas.md)). Cuando veas cómo trabaja, pasa a uno real.
- **Dale tu material.** Una rúbrica en `sources` vale más que diez explicaciones en el chat.
- **Sé concreto.** *«Corrige la Tarea 2 de 1.º A»* mejor que *«corrige lo de la semana pasada»*.
- **Rechazar también enseña.** Si dices que no a algo, explícale por qué.
- **Lee bien cada permiso** las primeras veces: el resumen te dice exactamente qué va a cambiar en Moodle.
- **Una carpeta por curso**, y no mezcles cursos en la misma.

## Si algo falla

| Problema | Solución |
| --- | --- |
| La terminal no reconoce `miyagi` | Cierra y abre la terminal. Comprueba `node --version` (tiene que ser 20 o más) y repite la instalación. |
| Dice que aquí no hay ninguna asignatura | Estás fuera de la carpeta de una asignatura. Añade `-w <nombre>` a la orden (`miyagi workspaces` te da los nombres), o usa `miyagi` a secas para elegirla. |
| Espera a que inicies sesión en Moodle | Entra tú en la ventana del navegador que ha abierto la extensión moodle-teacher. Solo pasa la primera vez o cuando la sesión caduca. |
| La exploración del Moodle falló al conectar el aula | La asignatura ya está configurada. Comprueba que iniciaste sesión en la ventana y repite con `miyagi explore`. |
| Te pregunta «¿Pasar ahora esta aula a moodle-teacher?» | El aula se conectó con el sistema anterior, que ya no existe. Di que sí: instala moodle-teacher y borra de `config.json` el usuario y la contraseña guardados. Si dices que no, esa sesión trabaja sin el aula (solo planes y borradores). |
| Avisa de que trabaja sin el aula | La extensión moodle-teacher no está instalada o está desactivada. Vuelve a conectar el aula con `miyagi init -w <nombre>` (o en la aplicación, en Tu aula), o actívala (ver [Extensiones](../avanzado/extensiones.md)). |
| Los menús salen en otro idioma | Añade `--language=es` (o `en`, `fr`, `de`), o pon el idioma en `config.json` (ver [Configuración](../avanzado/configuracion.md)). |
| Está haciendo algo que no quería | Pulsa `Esc` (en `run`, `Ctrl+C`) y dile qué hacer en su lugar. |
| Recuerda algo mal | Díselo en el chat o edita la página de `knowledge`. |
| No lee un documento de `sources` | Comprueba el formato. Los de OpenDocument (`.odt`) no los lee bien: expórtalos a PDF o DOCX. Los vídeos tampoco los puede transcribir. |
| Dice que no puede probar una práctica | Falta la extensión docker-lab (o está desactivada) o falta Docker. Ver [Prácticas en Docker](../avanzado/practicas-docker.md). |
| Al cerrar dice «En el horno: …» | Son las actividades que tiene a medias: en plan, construyéndose o subidas ocultas para probarlas, que tus alumnos aún no ven. Están en `knowledge/drafts.md`: pídele en el chat que siga con ellas, que las muestre o que las descarte. |
| Venía de teacher-agent | Es el mismo con otro nombre: instala miyagi; tu configuración y tus cursos sirven tal cual. |
| Venía de moodle-agent | Abre `miyagi chat` en la carpeta del aula: reorganiza sus apuntes solo. |

Si el problema sigue, puedes contarlo en [GitHub](https://github.com/falkenslab/miyagi/issues).
