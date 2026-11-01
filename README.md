# The Burden of Truth · talk deck

Web slides for the 15-minute talk on *The Burden of Truth: A Theory of Defensibility for AI Audits* (Kormylo, Xu & Berente). Same engine and file layout as the ITAO 40515 lecture decks, with a new theme. 16 slides, no dependencies, works offline.

**Public copy:** served by GitHub Pages from this repository (see the repository's Pages URL).

## Editing

All the words are in **`slides.md`**. Each slide is a block between two lines of three dashes (its settings), followed by the slide text, `Click N:` captions, and speaker notes after a line that says `Notes:`. Keys ending in `[]` repeat (one line per item; fields inside a line are separated by ` | `). `\n` is a line break. Never put a line of three dashes inside a slide's text.

To see edits live, double-click **`start-deck.bat`** (Windows) or **`start-deck.command`** (Mac). It opens http://localhost:5300 and reloads the deck every time you save `slides.md`, anything in `css/`, or anything in `js/`. It also refreshes `slides.content.js`, the copy of the markdown that the page uses when opened by double-clicking `index.html` and when served by GitHub Pages. Commit `slides.content.js` along with `slides.md`.

If Node.js is not installed, you can still edit `slides.md` and open `index.html` directly, but then run `node scripts/serve.mjs --once` (or just paste the markdown into `slides.content.js` by hand) before publishing, since the double-click and Pages copies read `slides.content.js`.

## Presenting

→ / Space next · ← back · Shift+→ skip clicks · **P** presenter window (notes, timer, next slide) · **O** overview · **F** full screen · **M** reduce motion · **?** help. The address bar keeps your place (`#/slide/click`).

Timing cues are in the notes. The deck runs about 15 minutes with the cuts marked in the notes for slides 4, 14 and 15.

## Printing

Open `index.html?print=final` for one page per slide, or `index.html?print=all` for one page per click state, then print to PDF with landscape, no margins, background graphics on. A ready-made PDF of the final states is in this folder.

## Files

- `slides.md` the talk · `slides.content.js` generated copy of it
- `index.html` the page · `css/theme.css` colors, type, frame · `css/components.css` the figures
- `js/engine.js` the deck engine (parsing, clicks, presenter window, overview, print) · `js/components/talk.js` the sixteen animated figures, one per slide, each reading its text from `slides.md`
- `scripts/serve.mjs` local server with live reload · `start-deck.bat` / `start-deck.command`

## Theme

Dark stage, warm ink. Three role colors carry meaning across every slide: **amber** is verification (checks, stamps, metrics), **signal red** is failure and harm, **teal** is defensibility. Lilac marks the forum.

## Sources

Every slide that cites a fact carries a `source:` line, rendered small at the bottom of the slide. The Ethiopia and Myanmar material comes from the Facebook Files (CNN, WSJ, Oct 2021), Reuters (Aug 2018), Wired (Dec 2022), Amnesty International (Oct 2023), the Oversight Board's decision 2021-014-FB-UA, and the DAIR Institute's study of Tigray-war moderation. The 2024 to 2026 material comes from Meta's DSA audit report, the DSA Observatory, the Financial Times, NPR, and Wired.
