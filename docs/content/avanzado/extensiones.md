---
title: Extensiones
sidebar_position: 10
description: "Cómo añadir capacidades a miyagi con extensiones del repositorio oficial de Falken's Lab: instalarlas para todas tus asignaturas o solo para una, configurarlas, desactivarlas y qué pasa con los repositorios de otros."
---

# Extensiones

Una **extensión** le da a miyagi algo que no trae de serie: herramientas nuevas (por ejemplo, probar código en un laboratorio de Docker) o saber hacer algo de una manera concreta (por ejemplo, un estilo visual para lo que publica). Cada extensión aporta sus propias habilidades, que el asistente usa como las suyas.

Las extensiones las gestiona agent-kit, la base sobre la que está hecho miyagi. miyagi solo decide de dónde vienen y cuáles te enseña.

Cuando le pides algo que ninguna de las que tienes hace bien (comprobar una práctica en Docker, dar estilo a tus apuntes), miyagi mira el catálogo y te dice cuál te serviría, qué necesita y cómo instalarla, por ejemplo `/extensions install docker-lab@falkenslab`. Nunca la instala él: lo haces tú.

## De dónde salen

- **El repositorio oficial**, [`falkenslab/agent-extensions`](https://github.com/falkenslab/agent-extensions), lo publica Falken's Lab. miyagi ya lo conoce, y lo que instalas de ahí no te pide confirmación. El catálogo te enseña solo las extensiones pensadas para miyagi.
- **Otros repositorios** los puedes añadir tú, pero antes miyagi te avisa: su código se ejecuta en tu ordenador con tus permisos, y no es de Falken's Lab. Tienes que escribir su nombre para confirmarlo, y al instalar algo de ahí te vuelve a preguntar. No hay catálogo de la comunidad.

## Las que van con miyagi

Del repositorio oficial, pensadas para miyagi:

- **moodle-teacher**: tu aula de Moodle, con tu sesión y los alumnos con seudónimo. miyagi la instala al conectar el aula (ver [Configuración](configuracion.md)).
- **docker-lab**: probar las prácticas en laboratorios de Docker (ver [Prácticas en Docker](practicas-docker.md)).
- **moodle-ui-kit**: un estilo visual para lo que publica en Moodle.

## Para todas tus asignaturas o solo para una

- **Para todas** (lo normal): se instala en `~/.miyagi/extensions/`.
- **Solo para una**, con `--project`: la asignatura guarda solo un `extensions/extensions.lock.json` con qué extensión usa y en qué versión, y el código va igualmente a `~/.miyagi/`. Si compartes la carpeta de la asignatura con un compañero, `miyagi extension restore` le descarga lo mismo, y `miyagi extension trust` le pregunta antes de dejar que se ejecute.

## Las órdenes

Todas aceptan `--dir <carpeta>` para trabajar sobre esa asignatura.

| Orden | Qué hace |
| --- | --- |
| `miyagi extension search [palabras]` | Lo que ofrece el catálogo. |
| `miyagi extension add <nombre> [--project]` | La instala y te pide sus ajustes, si los tiene (`--set clave=valor` los da sin preguntar). |
| `miyagi extension list` | Las instaladas, dónde y si están activas. |
| `miyagi extension info <nombre>` | Qué ofrece y qué necesita en tu ordenador. |
| `miyagi extension config <nombre> [clave=valor…]` | Ver o cambiar sus ajustes. Un secreto se pide sin que se vea lo que escribes. |
| `miyagi extension enable` / `disable <nombre>` | Activarla o desactivarla sin quitarla. |
| `miyagi extension update [nombre]` | Pasar a la versión que ofrece ahora su repositorio, conservando sus datos y ajustes. |
| `miyagi extension remove <nombre>` | Quitarla. Te pregunta si borra también sus datos. |
| `miyagi extension marketplace add` / `list` / `remove` | Gestionar los repositorios de otros. |

`miyagi extension` a secas explica cada una. Dentro del chat, `/extensions` muestra con qué extensiones está trabajando, y activar o desactivar una desde ahí abre de nuevo la sesión sin perder la conversación.

En la [aplicación de escritorio y en la versión web](navegador.md#extensiones) todo esto está en **Extensiones**, sin escribir órdenes, y lo que instalas desde ahí se pone en marcha en la conversación abierta. Con docker-lab, además, miyagi puede escribir en la carpeta de sus laboratorios desde esa misma conversación, sin reiniciar la aplicación.

En la terminal, una extensión instalada o cambiada se nota en la siguiente sesión, no en la que ya está abierta. `miyagi skills` lista sus habilidades con el nombre de la extensión entre corchetes.

Una habilidad de una extensión puede ser también un botón de la página: si su encabezado trae `label`, sale como acción con las mismas claves que un [atajo propio](atajos-e-instrucciones.md#dónde-sale-y-qué-pregunta) (`icon`, `group`, `needs-classroom`, `applies-to`…). Así, moodle-teacher pone en **Hoy** «Esta semana» y «Ver qué hay por corregir» cuando tienes un aula vinculada. Las que no lo traen las sigue usando miyagi cuando hacen falta, sin botón.

## Lo que una extensión no puede saltarse

Venga de donde venga, una extensión no cambia las reglas de miyagi ([Seguridad y privacidad](seguridad-y-privacidad.md)):

- cualquier herramienta suya que pueda cambiar algo pide tu aprobación, como las de miyagi;
- sus secretos solo le llegan a ella, y sus programas arrancan sin tus variables de entorno (ni tu acceso a Claude);
- lo que devuelven sus herramientas se trata como datos, nunca como órdenes;
- nada sobre un alumno concreto va a la base de conocimiento.
