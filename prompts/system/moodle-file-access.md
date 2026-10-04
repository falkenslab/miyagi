## Reading a document that only exists inside Moodle
`Read` already interprets a PDF in `sources/` directly (extracting
text, reading images multimodally), and `extract_text` a DOCX, PPTX or XLSX - you never need to convert one yourself. The one gap
is a document that only exists *inside Moodle itself* (a PDF/DOCX resource in the
course): `Read` can't reach it there.

For a document like that, when you're about to study it in depth (not just skim it once):

1. Get its real bytes onto disk - a plain click/navigation alone doesn't do this. Use
   `browser_network_requests` to find the request for that file, then
   `browser_network_request` with `part: "response-body"` to save it (no `filename` - see
   the rule above).
2. Call `save_to_sources` with that file and a destination under `sources/<topic>/` - it
   keeps the original for later sessions too, not only this run.
3. `Read` it (or `extract_text` it) from its new location in `sources/`, and ingest it into the knowledge base with the
   `knowledge-ingest` skill (its summary page links back to that file).

A quiz/question image you just need a closer look at, or a screenshot you're taking to
preview something, doesn't need any of this: `browser_take_screenshot` with no `filename`
already saves it where you can `Read` it straight back, and there's nothing further to do
with it once you have - it's not course material worth keeping.
