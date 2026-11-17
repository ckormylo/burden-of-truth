# The Burden of Truth · building the frontier map

Twelve web slides that walk through the current thinking for the paper (Kormylo, Xu & Berente). A background slide, then two parts. Part 1 (Propositions 1 to 3) is why verification falls short, each with its own figure. Part 2 (Propositions 4 to 7) is what defensibility adds, and each of those adds one element to the frontier map. A last slide says how to read the map. Same engine and file layout as the talk deck and the ITAO 40515 lecture decks. No dependencies, works offline.

## Where it goes

Drop this folder into the `burden-of-truth` repo (for example as `map/`) and it is served at `https://ckormylo.github.io/burden-of-truth/map/`. It also works as its own repo with Pages on `main`, root folder.

## Editing

All the words are in **`slides.md`**. Each slide is a block between two lines of three dashes (its settings), then speaker notes after a line that says `Notes:`. Keys ending in `[]` repeat (one line per item; fields inside a line are separated by ` | `). Never put a line of three dashes inside a slide's text.

The first block in `slides.md` (`layout: data`) is not a slide. It holds the labels drawn on the map (axis names, bar names, region names), shared by every slide.

To see edits live, double-click **`start-deck.bat`** (Windows) or **`start-deck.command`** (Mac). It opens http://localhost:5301 and reloads on every save. It also refreshes `slides.content.js`, the copy of the markdown used when `index.html` is opened by double-click. Commit `slides.content.js` along with `slides.md`. Without Node.js, run nothing and just edit `slides.md`; GitHub Pages reads `slides.md` directly.

## Presenting

→ / Space / click next · ← back · swipe on a phone · Shift+→ skip clicks · **P** presenter window (notes, timer, next slide) · **O** overview · **F** full screen · **M** reduce motion · **?** help.

Print with `index.html?print=final` (one page per slide) or `index.html?print=all` (one page per click).

## The slides

| # | Slide | What the animation does |
|---|---|---|
| 1 | Background | Six facts get ticked one by one, then four links are drawn between them |
| 2 | Part 1 divider | |
| 3 | P1 Indeterminacy | The answer key splits into several acceptable answers; the inputs outgrow the tested patch; a meter of what verification can establish shrinks |
| 4 | P2 Reliability | Each tenfold gain in reliability takes ten times the clean cases, while the people still checking thin out |
| 5 | P3 Theater | The real question cannot be verified, so the audit ticks four documents instead; it passes, decoupled from the question |
| 6 | Part 2 divider | |
| 7 | The map | Points appear, the flat verification bar is drawn, the limit of testing comes down |
| 8 | P4 Fit | Three uses credited at the same height sink to what the evidence establishes for each task |
| 9 | P5 Proportionality | The fixed bar pivots into a rising one around the use it was set for; four regions appear |
| 10 | P6 Revisability | A control on file ticks and the bar only shudders; a control that works lowers it |
| 11 | P7 Answerability | A forum beside the map asks the three link questions; the owner answers and holds, the record cannot and its position becomes unknown |
| 12 | How to read the map | Three questions, then three repair moves |

Each proposition slide shows the plain-language version as its title, the wording as it would appear in the paper underneath (`prop:` in `slides.md`), and two or three sources in the side panel (`cite[]:`). The tracker at the top right and the color (gold for Part 1, green for Part 2) show which group a proposition belongs to.

## Files

- `slides.md` the words · `slides.content.js` generated copy
- `index.html` the page · `css/theme.css` the talk deck's theme, unchanged · `css/components.css` the figures
- `js/engine.js` the deck engine, with two additions (tap and swipe navigation; `layout: data` blocks for shared labels) · `js/components/frontier.js` the map and the background figure
- `scripts/serve.mjs`, `start-deck.bat`, `start-deck.command` local server with live reload

The map is a schematic. The curve in `frontier.js` is a fixed quadratic chosen for looks. Only its direction is claimed: the bar rises with stakes, working controls lower it, and fit sets a point's height.
