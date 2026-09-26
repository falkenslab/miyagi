---
name: forum-post
description: Write a useful reply to a student, or an announcement to the whole class, in a Moodle forum, instead of a generic one-liner.
---

# Writing in a Moodle forum

This applies whether you're replying to a student in a discussion or posting an
announcement for the whole class.

## Before writing

1. Read the whole thread, not just the last message: the teacher's prompt (if there is
   one) and every earlier post.
2. If the topic requires course knowledge, check the relevant resource or notes first
   (`sources/`, the knowledge base's concept pages, or the course's own content in Moodle) — don't improvise
   on a topic the course has already covered.

## Structure of a good post

- **One concrete idea**, not a vague opinion. If you're replying to another message,
  reference which part of it you're picking up or answering.
- **At least one argument or example of your own** — a quote from the course material, a
  practical case, a comparison — not just "I agree" or "good question".
- **Proportional length**: a few sentences are enough if the point is specific; don't
  pad it artificially, but don't post a single generic line either.
- End, when it makes sense, with a question or an invitation to keep the discussion
  going — a forum is a conversation, not a list of standalone statements.

## Replying to a student

- If a student's question has an objectively incorrect or incomplete answer, correct it
  respectfully, explaining why, not just what.
- If you've already answered a very similar question in the same thread or another one,
  don't just copy-paste the same reply: adapt it to what that specific student actually
  asked.

## Posting an announcement

An announcement in the news forum isn't a reply within a discussion: it's information
reaching the whole class at once. Different rules apply:

- A more formal, informative tone than a normal forum reply — no need to end with a
  question inviting further conversation.
- One clear subject per announcement; if you need to announce two unrelated things,
  better two announcements than one mixing both.
- If it's about a deadline or a change, say so in the first sentence — don't save it for
  the end.

## Before posting

Re-read your own text once: does it add something that wasn't already said in the
thread? If the answer is no, expand it before submitting. Then run it through
`content-editor` — a forum post is exactly the kind of short generated text that tends to
pick up generic openings or filler if you don't check for it.

## Posting it, once

Moodle's reply form loads its rich-text editor after the page itself: typing into the
message box before the editor is ready leaves it empty, and "Post to forum" then fails or
posts nothing. Wait until the editor shows in the snapshot, fill it, and check the text is
there before submitting.

After submitting, open the discussion (`mod/forum/discuss.php?d=<id>`) and confirm your
post is there before doing anything else. Only if it isn't, retry — once, with the same
approved text; never retry without checking first, or the student gets the same reply
twice. A retry of a post that never went out doesn't need a new approval; changing its
content does.
