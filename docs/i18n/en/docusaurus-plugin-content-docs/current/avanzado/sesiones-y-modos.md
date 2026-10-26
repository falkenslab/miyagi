---
title: Sessions and modes
sidebar_position: 8
description: "The four session kinds (chat, run, ingest, explore), the supervision modes and plan mode, how a chat is resumed and what's kept in sessions/."
---

# Sessions and modes {#sesiones-y-modos}

## Session kinds {#tipos-de-sesión}

Each command opens a kind of session, with its own system instructions ([`prompts/system/`](https://github.com/falkenslab/miyagi/tree/main/prompts/system)) and its own tools:

| Session | What for | Moodle | Mode |
| --- | --- | --- | --- |
| `chat` | A conversation, full screen by default, that can be resumed | Yes, with moodle-teacher when needed | Starts in `guided`; `Shift+Tab` switches to `interactive` and to `plan` |
| `run` | One pass through the whole course, or the `--task` job | Yes, with moodle-teacher | The one from `--mode`, or it asks (without an interactive terminal, `guided`) |
| `ingest` | Adding documents from `sources/` to the knowledge base | No | Publishes nothing: doesn't ask |
| `explore` | Noting which kinds of activity and question your Moodle supports (only with a classroom) | Yes, read only | `guided`, 80 turns at most |

With no classroom connected (no `classroom` in `config.json`), no session goes into Moodle: `chat` and `run` work with the teaching plan, the units and the materials in `drafts/`, with nothing to publish or approve, and the mission of `run` without `--task` is to go over the subject matter (take in what's new in `sources/` and review the teaching plan).

Some details:

- **`chat`** greets you with what it already knows, looking at the knowledge base's catalog (`knowledge_index`) and its overview (`overview`), without going into Moodle, and says how recent the latest is. If there are hidden drafts, it mentions them. If the knowledge base is empty, it offers to explore the course or take in your documents. Then it waits for your instructions.
- **`run`** without `--task` manages the course on four fronts: grading what's pending, attending to the forum, creating or fixing content and summarizing the class's progress. With `--task "…"`, that job replaces the general mission, with all the other rules (approvals included).
- **`ingest`** without files processes everything in `sources/` that doesn't have a summary page yet; with files, only those (paths relative to the current folder). See [The knowledge base](base-de-conocimiento.md).
- **`explore`** uses only moodle-teacher's read tools, without changing anything. It writes the `course/moodle-capabilities` page (`knowledge/moodle-capabilities.md`) with the activity types, the question types it could see and how grades can work. Those tools don't list the question types enabled in your Moodle, only the ones already in the course's question banks ([falkenslab/moodle-mcp#49](https://github.com/falkenslab/moodle-mcp/issues/49)).

The `drafts/` tools, the helpers (`researcher`, `pedagogy-reviewer`) and the docker-lab labs ([Practicals in Docker](practicas-docker.md)) only exist in `chat` and `run`.

## Supervision modes {#modos-de-supervisión}

- **`guided`**: works on its own and asks for approval before each publication. The [publishing hook](aprobaciones-y-borradores.md) stops any moodle-teacher tool that changes something and hasn't been approved.
- **`interactive`**: before every tool it uses (reading a file, querying the course, publishing something) it shows you which one and with what parameters, and waits for your yes. Useful for seeing how it works.
- **`autonomous`**: asks nothing and has no way to ask you for help. It publishes without approval. When grading, it decides and saves the grade on its own.
- **`plan`** (chat only): thinks before building. An agent-kit hook only lets it read (your documents with `Read`, `list_sources` and `extract_text`, the knowledge base with its read tools, the web), delegate to the helpers and ask you, and write only an activity's plan (`drafts/<slug>/plan.md`, see `activity-lifecycle`); any other tool is denied, except listing and inspecting `drafts/`; of moodle-teacher's, only those the extension itself declares read-only get through, so in this mode nothing changes in Moodle. When it has the plan, it presents it with `present_plan` and you choose: **Run it** (it goes back to the previous mode and gets on with it), **Keep planning** (you tell it what to change) or **Cancel**.

In the chat, `Shift+Tab` cycles `guided` → `interactive` → `plan` at any time, and `/plan` (also in the plain-text chat) enters plan mode and, typed again, goes back to the previous mode. The chat never runs in `autonomous`; `run` doesn't support `plan`.

## What the chat shows and asks you {#lo-que-el-chat-te-muestra-y-te-pregunta}

- **Task list.** In a long job, the assistant keeps a task list (the SDK's `TodoWrite` tool) that the chat draws above the text box: `☐` pending, `◼` in progress, `☑` done. It stays while any remain and disappears when they're all done.
- **Choosing between options.** When it needs you to decide something, it can ask you with `ask_human`: a panel with two to eight options (one or several, depending on the question) and a last one, “Other (type your own answer)”, to type your answer. In the plain-text chat, the options come out numbered and you answer with the numbers.
- **Date and time.** The dated entries in the knowledge base and the deadlines (“in 10 days”) come from the system clock, with `current_time` and `date_math`, never from the model's memory.

## Resuming a chat {#retomar-un-chat}

Each chat is its own folder in `sessions/` with the whole conversation ([ADR-011](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-011-resumable-chats.md)):

- `miyagi chat --continue` opens the chat with the course's last conversation.
- `/resume`, inside the chat, lists the earlier conversations (`↑`/`↓` to choose, Enter to resume, `Esc` to cancel).

A resumed chat **never gets its approvals back**: every time miyagi starts, the publishing hook starts with no approval in force.

Even if you start a new conversation, the course's memory is still there: the [knowledge base](base-de-conocimiento.md) is independent of the conversations.

## What's kept in `sessions/` {#qué-queda-en-sessions}

```text
sessions/
  history.jsonl                       los mensajes que has escrito en el chat (para ↑ y Ctrl+R)
  <date-time>/                       un chat
    session.log                       la conversación, en texto plano
    transcript.jsonl                  cada acción del asistente y su resultado
    conversation.jsonl                la conversación completa, para retomarla
    session.json
    subagents/                        lo que hicieron los ayudantes
  <date-time>-run/                   una sesión de run (igual con -ingest y -explore)
    transcript.jsonl
    ...
```

The conversation saved for resuming the chat isn't filtered, so `sessions/` is in the `.gitignore` that `init` creates. In addition, the Claude Agent SDK keeps its own copy of the conversation in `~/.claude/projects/` (it can't be turned off while this storage is used).

When any session closes, miyagi reminds you where everything ended up and that nothing is left to save: everything is written to disk as it goes.

## Full screen, inline or plain text {#pantalla-completa-en-línea-o-texto-simple}

- By default, the chat takes up the whole terminal window ([ADR-007](https://github.com/falkenslab/miyagi/blob/main/.minispec/decisions/ADR-007-full-screen-ink-chat.md)), with the reply written live, each tool with the first line of its result (`Ctrl+O` folds each group into a summary line and unfolds it again), panels for the approvals and mouse selection.
- `--inline` keeps the same chat but inside the terminal's normal history.
- `--plain` uses a line-by-line plain-text chat; in `run`, `ingest` and `explore`, plain text with no animation or panels. It turns on by itself if the input or output isn't a terminal (for example, if you redirect the output to a file).

## Long context: auto-compaction {#contexto-largo-autocompactado}

If a conversation fills the model's context, the SDK summarizes it automatically so it can go on. It's on by default; it's turned off with `"autoCompactEnabled": false` in `~/.miyagi/config.json`.

## Interrupting {#interrumpir}

- In the chat, `Esc` cuts off the reply in progress without closing the session; `/exit` (or `Ctrl+C` with no reply in progress) closes it.
- In `run`, `ingest` and `explore`, the first `Ctrl+C` interrupts and closes normally; the second exits without waiting. Whatever was half done (a grade not saved, a reply not published) may stay that way: in the next session you can ask it to pick it up again.
