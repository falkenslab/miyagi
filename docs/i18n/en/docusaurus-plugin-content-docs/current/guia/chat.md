---
title: The chat
sidebar_position: 4
description: "How to talk to miyagi: approve or reject what it publishes, ask it for a plan before it acts, interrupt it, pick up a conversation again and use the shortcuts."
---

# The chat {#el-chat}

`miyagi chat` is the most comfortable way to work with the assistant: you ask for things in your own words and it shows you what it's doing as it goes. Open it with your subject's name, `miyagi chat -w <name>`, from anywhere (or without `-w`, inside its folder).

## The chat in a minute {#el-chat-en-un-minuto}

| What you want | What you do |
| --- | --- |
| Ask it for something | Type it in your own words and press Enter |
| Write on several lines | `\` then Enter, or `Ctrl+J` |
| Approve what it's about to publish | Enter, `1` or `y` |
| Reject it | `2` or `n`, and tell it what to change |
| Stop everything at an approval | `3` (Stop) |
| Cut short what it's doing without leaving | `Esc` |
| Have it check with you at every step, not just what it publishes | `Shift+Tab` (switches from guided to interactive) |
| Have it suggest a plan first, without changing anything | `/plan`, or `Shift+Tab` until you reach plan |
| See what has scrolled off the screen | Mouse wheel or `PgUp`/`PgDn` |
| Copy text | Drag over it with the mouse and right-click |
| Copy its last reply | `/copy` |
| Sum up the tools it used in one line, or see them one by one again | `Ctrl+O` |
| Mention a file in the course folder | `@` and the file name |
| Bring back a message you already wrote | Up and down arrows, or `Ctrl+R` to search |
| See all the keyboard shortcuts | `?` with an empty message |
| Exit | `/exit` (everything saves itself) |
| Continue the last conversation | `miyagi chat --continue` |
| Choose an earlier conversation | `/resume` inside the chat |

## How it asks for permission {#cómo-te-pide-permiso}

Before saving a grade, replying in the forum, publishing content or changing an activity's settings, it shows you a panel with a summary of what it's going to publish and three options: **Yes**, **No** and **Stop**.

- **Yes** (Enter, `1` or `y`): it publishes it.
- **No** (`2` or `n`): it doesn't publish it. Explain why in your next message; it takes it into account, for example, for the rest of the grades for the same assignment.
- **Stop** (`3`): it halts what it was doing.

A single approval can cover a batch (for example, six grades), but only if the summary lists each one with what is going to be published.

And it doesn't depend only on it remembering to ask: if it tries to change something in Moodle without having asked you, the program itself stops it and asks you. To delete, remove or restore something it always asks you again. It's explained in depth in [Approvals and drafts](../avanzado/aprobaciones-y-borradores.md).

## Three ways to work with it {#tres-formas-de-trabajar-con-él}

The chat always starts in **guided** mode: it works on its own and asks your permission only before publishing something your students will see.

If you want to see how it works step by step, press `Shift+Tab`: it switches to **interactive** mode and will check with you before every action, even if it's only reading something in Moodle.

Press it again and it switches to **plan** mode: it reads your documents and its notes, searches online if needed and prepares a plan for you, without changing anything and without opening Moodle. When it has it, it shows it to you and you choose:

- **Run it**: it goes back to the previous mode and gets to work.
- **Keep planning**: tell it what to change and it presents another one.
- **Cancel**: it does nothing and asks you what you'd prefer.

It's useful before a big job, such as building a whole unit. You can also type `/plan` to enter plan mode, and `/plan` again to leave it. A third `Shift+Tab` takes you back to guided.

## What you'll see while it works {#lo-que-verás-mientras-trabaja}

- **Its task list.** In a long job, the list of what it's going to do appears above the text box: `☐` pending, `◼` in progress, `☑` done. It disappears when it has finished everything.
- **Questions with options.** When it needs you to decide something (how many sessions to give a unit, which approach to take), it shows you the options in a panel. Choose with the arrows and press Enter; if it lets you tick several, tick them with the space bar. The last option, “Other”, lets you type your own answer.
- **Correct dates.** The dates it notes and the deadlines it works out come from your computer's clock, not from what the model thinks today is.

## Interrupting and picking up again {#interrumpir-y-retomar}

- **`Esc`** cuts short what it's doing without closing the chat. Then tell it what to do instead.
- **`/exit`** closes the session. There's nothing to save: everything is written to disk as it goes. When you exit it tells you where the conversation and its notes are kept and, if it has left something hidden in Moodle without showing it to students, it reminds you.
- **`miyagi chat --continue`** opens the chat with that course's last conversation: it remembers what you talked about.
- **`/resume`** inside the chat lets you choose any earlier conversation from the course.

Even if you start a new conversation, the assistant doesn't start from scratch: it reads its [course notes](memoria.md) when it starts.

## Shortcuts {#atajos}

They're ready-made instructions. Type them in the chat, with whatever you need after them.

| Shortcut | What for |
| --- | --- |
| `/miyagi:orient` | Get to know the classroom: assessment, deadlines and communication channels |
| `/miyagi:grade` | Grade pending submissions with fair, consistent criteria |
| `/miyagi:forum` | Review the forum and decide whether the teacher needs to step in |
| `/miyagi:progress` | See how the class is doing and who is falling behind |
| `/miyagi:quiz <unit>` | Create a quiz on that topic, or add questions to it |
| `/miyagi:exam <quiz>` | Print a quiz as a paper exam, in several versions |
| `/miyagi:publish <material or unit>` | Publish materials or a whole unit from `materials/` to the classroom |
| `/miyagi:build-unit <description>` | Build a unit inside the course |
| `/miyagi:build-course <description>` | Build a complete course |
| `/miyagi:teaching-plan` | Write or review the teaching plan |
| `/miyagi:align` | Check that the classroom follows the teaching plan and fix what doesn't |
| `/miyagi:audit` | Audit the classroom and suggest improvements by priority |
| `/miyagi:research <unit>` | Research a topic online and save what it finds with its sources |
| `/miyagi:map` | See where each section and activity of the course is: its number and its link |
| `/knowledge:ingest` | Add the new documents in `sources` to its notes |
| `/knowledge:query <question>` | Answer from its notes, without opening Moodle |
| `/knowledge:lint` | Check that its notes are complete and well linked |

Shortcuts are just a convenience: *“grade what's pending”* works the same as `/miyagi:grade`. To see them from the terminal, `miyagi commands`. You can also create [your own shortcuts](../avanzado/atajos-e-instrucciones.md).

## If you don't want full screen {#si-no-quieres-pantalla-completa}

- `miyagi chat --inline` leaves the conversation in the terminal's normal history, instead of taking up the whole window.
- `miyagi chat --plain` uses a simple text chat, without panels.
