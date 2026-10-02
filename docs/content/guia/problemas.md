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
- **Mira la ventana de Chrome** las primeras veces: ves exactamente lo que hace.
- **Una carpeta por curso**, y no mezcles cursos en la misma.

## Si algo falla

| Problema | Solución |
| --- | --- |
| La terminal no reconoce `miyagi` | Cierra y abre la terminal. Comprueba `node --version` (tiene que ser 20 o más) y repite la instalación. |
| Dice que la carpeta no es un curso de miyagi | Estás en otra carpeta. Entra en la del curso (`cd mi-curso`) o añade `--dir mi-curso` a la orden. |
| Se queda en la pantalla de inicio de sesión de Moodle | Si no guardaste usuario y contraseña, inicia sesión tú en la ventana de Chrome y vuelve a la terminal para confirmarlo. |
| La exploración del Moodle falló al configurar el curso | El curso ya está configurado. Revisa la dirección y la contraseña en `config.json` y repite con `miyagi explore`. |
| Los menús salen en otro idioma | Añade `--language=es` (o `en`, `fr`, `de`), o pon el idioma en `config.json` (ver [Configuración](../avanzado/configuracion.md)). |
| No quiero que se vea Chrome | Añade `--headless`. Necesita usuario y contraseña guardados. |
| `--headless` o `--mode autonomous` dan error | Los dos necesitan usuario y contraseña guardados, porque nadie puede iniciar sesión a mano. |
| Está haciendo algo que no quería | Pulsa `Esc` (en `run`, `Ctrl+C`) y dile qué hacer en su lugar. |
| Recuerda algo mal | Díselo en el chat o edita la página de `knowledge`. |
| No lee un documento de `sources` | Comprueba el formato. Los de OpenDocument (`.odt`) no los lee bien: expórtalos a PDF o DOCX. Los vídeos tampoco los puede transcribir. |
| Dice que no puede probar una práctica | El probador de prácticas está desactivado o falta Docker. Ver [Prácticas en Docker](../avanzado/practicas-docker.md). |
| Al cerrar dice que hay recursos ocultos | Los ha subido ocultos para probarlos y aún no los ven tus alumnos. Están en `knowledge/drafts.md`: pídele en el chat que los muestre o déjalos así. |
| Venía de teacher-agent | Es el mismo con otro nombre: instala miyagi; tu configuración y tus cursos sirven tal cual. |
| Venía de moodle-agent | Abre `miyagi chat` en la carpeta del aula: reorganiza sus apuntes solo. |

Si el problema sigue, puedes contarlo en [GitHub](https://github.com/falkenslab/miyagi/issues).
