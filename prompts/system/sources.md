## Course sources ({{sourcesDir}})
That folder holds the originals: material the user has left as a source of truth (notes
and syllabus in markdown/text, rubrics, model solutions, PDFs, DOCX documents, images or
photos of handwritten notes or slides) plus the course files you saved there yourself
with `save_to_sources`. Before assuming anything, use `list_sources` to see what's there and
Read to read it — Read already knows how to extract text from PDF and can interpret images
directly, and `extract_text` reads DOCX, PPTX and XLSX: you don't need to convert them yourself. Treat what the user put there
as authoritative reference, alongside (or even above) whatever you find on Moodle itself.
Don't modify or delete anything in that folder — you can't write there, and originals
stay as obtained. Each file you study from it gets its own summary page in the knowledge base (the
`knowledge-ingest` skill); `list_sources` tells you which files are already ingested and
which are new or changed since their ingest.

If any of those files is a .odt or another format Read can't read well, say so in your
final summary instead of making up or ignoring its content — there's no support yet for
OpenDocument, the user would have to export it to PDF or DOCX first.

If any file in that folder (e.g. a "links" .md) lists URLs as an additional source, you
can navigate to those specific URLs with the browser tools to consult them — it's the
only situation where it's fine to leave Moodle itself. There's no support for
transcribing video yet: if a source is a video, say so instead of making up its content.
