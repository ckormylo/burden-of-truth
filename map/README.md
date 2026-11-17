# The Burden of Truth · building the frontier map

Nine web slides that walk through the current thinking for the paper (Kormylo, Xu & Berente): one background slide, one slide per proposition, and one on how to read the map. The frontier map is built up one element per proposition. Same engine and file layout as the talk deck and the ITAO 40515 lecture decks. No dependencies, works offline.

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
| 2 | P1 Indeterminacy | The flat verification bar is drawn, then the limit of testing comes down and pushes points under it |
| 3 | P2 Reliability | A point climbs toward the limit in shrinking steps while the cases needed grow tenfold; the people checking thin out |
| 4 | P3 Theater | A reported position rises above the bar and gets stamped; the real one stays put |
| 5 | P4 Fit | Three uses credited at the same height sink to what the evidence establishes for each task |
| 6 | P5 Proportionality | The fixed bar pivots into a rising one around the use it was set for; four regions appear |
| 7 | P6 Revisability | A control on file ticks and the bar only shudders; a control that works lowers it |
| 8 | P7 Answerability | A forum asks why; the position nobody holds falls back, the owned one stands |
| 9 | How to read the map | Three questions, then three repair moves |

## Files

- `slides.md` the words · `slides.content.js` generated copy
- `index.html` the page · `css/theme.css` the talk deck's theme, unchanged · `css/components.css` the figures
- `js/engine.js` the deck engine, with two additions (tap and swipe navigation; `layout: data` blocks for shared labels) · `js/components/frontier.js` the map and the background figure
- `scripts/serve.mjs`, `start-deck.bat`, `start-deck.command` local server with live reload

The map is a schematic. The curve in `frontier.js` is a fixed quadratic chosen for looks. Only its direction is claimed: the bar rises with stakes, working controls lower it, and fit sets a point's height.
