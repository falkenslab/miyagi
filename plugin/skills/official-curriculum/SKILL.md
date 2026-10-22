---
name: official-curriculum
description: Find the official curriculum of a subject in Spain - the state provision (BOE) and the region's (BOC, BOJA, DOGC, BOCM, DOGV...) - check it's in force, keep the originals in sources/curriculum/ and its learning outcomes and criteria verbatim, with their official numbering, in curriculum/ pages of the knowledge base, so the teaching plan can follow it. Use only when the teacher asks for it or says yes when offered; never search for regulations on your own.
---

# The official curriculum

> Talk to the human in the conversation's language, not in this skill's English: every short line between tool calls too. What you publish follows the course's language.

A teaching plan that follows the official curriculum quotes it: the same learning outcomes and
criteria, with the same numbers, from the provision in force in the teacher's region. A criterion
paraphrased, completed from memory or taken from another region is worse than none: the plan
looks official and isn't. So this skill searches only with the teacher's yes, quotes only what it
read in the gazette, and says plainly what it couldn't find.

**Only with the teacher's yes.** Offer it once, in a chat, when it fits (writing the plan of a
vocational module, an ESO or Bachillerato subject); search only if they say yes, or ask for it.

## 1. What to look for

From `sources/` and the knowledge base first; ask only what's missing, in one question:

- **Stage**: FP básica, grado medio, grado superior, curso de especialización; ESO; Bachillerato.
- **Title and module**, or **subject** and year.
- **Region** (comunidad autónoma) and **school year**: the curriculum in force that year.

## 2. Search

Delegate to `researcher` one search per provision (the state one, then the region's), each
with exactly what to find and these rules: a single request for all of them ran out of turns
before reporting (`tests/2026-10-22T21-07-curriculo-oficial/`). If it comes back without the
provision, go on yourself with WebSearch and WebFetch, under the same rules.

- **State provision**, in the BOE: for FP, the title's Real Decreto (its learning outcomes,
  criteria, minimum contents and hours), within LO 3/2022 and its regulation; for ESO and
  Bachillerato, the minimum teachings' Real Decreto.
- **Regional provision**: the region's order or decree that sets that title's or subject's
  curriculum, in its gazette (BOC, BOJA, BOA, BOPA, BOIB, BOCM, BORM, BOCYL, DOCM, DOE, DOG,
  DOGC, DOGV, BON, BOPV, BOR, BOCCE, BOME). It usually adds contents and hours, and may reword
  or add criteria: for the region, it's the one that counts.
- **The consolidated version first** (the BOE's "texto consolidado", the gazette's own), and
  check it's **in force** and not replaced by a later one. For a provision in the BOE, its open
  data say so: `https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/<BOE-A-…>/metadatos`
  (`estatus_derogacion`, `vigencia_agotada`, `url_html_consolidada`).
- Only official sources (the gazettes, the ministry's and the region's education sites); never
  a school's copy, a blog or a summary.

Keep each provision's original in `sources/curriculum/` with `download_to_sources` (its PDF, or
its consolidated page, which is also kept as markdown to quote literally), and read the
outcomes and criteria from there, never from a search result's summary.

## 3. Keep it

With `knowledge_create` / `knowledge_edit`, pages of type `curriculum`:

- **`curriculum/provisions`**: one entry per provision: its type and number, date, gazette, URL,
  whether it's in force (and how you checked), the date you consulted it (`current_time`), and
  whether it's state or regional. Fields `url` (the main provision's), `date` (its date) and
  `consulted`.
- **`curriculum/<module>`**, one per module or subject: its learning outcomes and evaluation
  criteria **verbatim**, with their official numbering (FP: RA1, CE1a…; ESO and Bachillerato:
  specific competences, criteria, basic knowledge), its hours and its basic contents, each block
  citing the provision and article or annex it comes from. Fields `url`, `date`, `consulted`.

Verbatim text is always marked as such (a quote, the provision cited) and kept apart from your
summary or comments. When the region rewords the state's criteria, the region's wording goes in,
and the page says it does.

## 4. Never

- Invent, complete or "improve" a learning outcome or criterion.
- Mix regions, or a region's provision with another title's.
- Assume a provision is in force because you found it.

If you can't find it, or can't tell whether it's in force, say so to the teacher and note the
search in `curriculum/provisions` (what you searched, where, the date): the next session doesn't
repeat it blind.

## 5. Then

Tell the teacher what you found and what's missing. `teaching-plan` uses these pages: objectives
and criteria with the official numbering, grading weighted by learning outcome.
