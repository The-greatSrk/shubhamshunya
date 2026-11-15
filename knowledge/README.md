# Knowledge base for the Shunya companion

The "Ask AI Philosophical Companion" answers ONLY from the text in `knowledge/shunya/`.
If the answer is not in these files, it says so instead of guessing.

## Adding the book
1. Put the book text in `knowledge/shunya/` as `.md` or `.txt` files (one file per chapter works best).
2. Start each file with a `# Title` line, e.g. `# Chapter 1 — The Illusion of Becoming`. The title is shown as the citation.
3. Restart the server (or call `POST /api/companion/reindex` as admin). Only changed chunks are re-embedded.

The files currently here are excerpts already published on the website (sample chapter, essays,
contemplation questions). They are a starting point; the more of the real book you add, the better the answers.
