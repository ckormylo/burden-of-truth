<!--
  The Burden of Truth · building the frontier map · slide text
  ============================================================
  Same format as the talk deck and the ITAO 40515 web decks. A block between two lines of three dashes
  holds the slide's settings, then speaker notes after a line that says "Notes:".
  Keys ending in [] repeat. Fields inside a line are separated by " | ". \n is a line break.
  Never put a line of three dashes inside a slide's text.

  The first block (layout: data) is not a slide. It holds the labels drawn on the map, shared by every slide.
  The figures are in js/components/frontier.js. "component: FrontierMap" plus "stage:" picks one build of the map.
-->

---
layout: data
map.x: Stakes
map.xsub: what rides on this use
map.y: Warrant
map.ysub: what the evidence establishes for this use
map.flat: Verification bar
map.ceiling: Limit of what testing can show
map.curve: Defensibility bar
map.cross: The use the bar was set for
map.fa: False assurance | passes the checklist | not defensible
map.nr: Needless refusal | fails the checklist | still defensible
map.accept: Both accept
map.reject: Both reject
map.addslabel: Adds to the map
---

---
id: background
kicker: Background
title: Verification checks the facts. Defensibility asks whether they **add up**.
bloom: slate
component: FactsLinks
fact[]: The task | What it does
fact[]: Model evidence | Tests, known failures
fact[]: The stakes | Harm, who bears it
fact[]: The controls | Review, monitoring, stop
fact[]: The owner | Holds these reasons
fact[]: The decision to rely | Made before use, on record
link[]: Fit | Does it bear on the task?
link[]: Proportionality | Enough for these stakes?
link[]: Revisability | Would controls catch it?
link[]: Answerability | Decided on these grounds?
row_top: The use
row_bottom: What the organization has
frame: The argument
tag_v: Verification | Each fact, against a criterion set in advance
tag_d: Defensibility | The links between the facts, argued before a forum
---
Notes:
**The whole idea on one slide.** Six facts surround any use of a model. All six can be checked.

- Click 1: A verification audit checks each one against a criterion fixed in advance. Every box gets a tick.
- Click 2: The ticks do not say whether relying is acceptable. That depends on how the facts connect. Does the evidence bear on this task (fit)? Is it enough for these stakes (proportionality)? Would the controls catch a failure (revisability)? Did the owner decide on these grounds (answerability)? Those four are links. They can be listed, but they cannot be ticked. They have to be argued.

Toulmin is the theorist here. Verification treats reliance as an analytic argument, where the conclusion follows from the facts. It is a substantial one, where the step from facts to conclusion needs a warrant that can be challenged.

The next seven slides build one picture. Three propositions show where checking fails. Four show what the links add.

---
id: p1
kicker: Why verification falls short · Proposition 1 · Indeterminacy
title: The more indeterminate the outputs, the less verification can **establish**
bloom: amber
component: FrontierMap
stage: p1
adds: The verification bar, and a limit on what testing can show
row[]: Verification | Needs an answer key and tests that cover the inputs | amber
row[]: Generative AI | Has no single right answer and no boundable set of inputs | signal
---
Notes:
**Set up the map first.** Every dot is one use of a model. Further right, more rides on it. Higher up, the evidence establishes more for that use.

- Click 1: A verification audit is one bar, set in advance. Above it passes, below it fails. It is the same bar wherever the dot sits.
- Click 2: Indeterminacy puts a limit on how high testing can lift any dot. There is no answer key to score against (criterial indeterminacy), and no test set can cover what the model will be asked (coverage indeterminacy). The more indeterminate the outputs, the lower this limit comes.

The shape of the map is schematic. Only the directions are claimed.

---
id: p2
kicker: Why verification falls short · Proposition 2 · Reliability
title: The more reliable the system, the harder its remaining errors are to **verify**
bloom: amber
component: FrontierMap
stage: p2
adds: The cost of each step toward the limit
rung[]: 1 in 10 | 30
rung[]: 1 in 100 | 300
rung[]: 1 in 1,000 | 3,000
rung[]: 1 in 10,000 | 30,000
col_rate: Error rate below
col_cases: Clean cases needed
watch: Still checking
row[]: Rarer | Ten times rarer takes ten times the clean cases | signal
row[]: Less watched | A system that is usually right gets checked less | signal
source: Rule of three for zero observed failures at 95% confidence · Kalra & Paddock (2016) · Bainbridge (1983)
---
Notes:
**The better the model, the more this bites.**

- Click 1: Each step up costs ten times the last. To show at 95% confidence that errors are rarer than 1 in 10 takes about 30 clean cases in a row. For 1 in 100, about 300. For 1 in 1,000, about 3,000. The dot crawls toward the limit and never reaches it.
- Click 2: At the same time, fewer people are looking. A system that is usually right gets watched less, so the rare failure is the one nobody is positioned to catch. That is Bainbridge's irony of automation.

So verification costs more and catches less at the moment the organization relies on the system more.

---
id: p3
kicker: Why verification falls short · Proposition 3 · Theater
title: When verification is demanded where it cannot deliver, organizations supply **paperwork**
bloom: amber
component: FrontierMap
stage: p3
adds: A reported position above the real one
stamp: Pass
reported: Reported
real: Real
gap: Paperwork
row[]: The demand | Clear the bar | amber
row[]: The response | Clear it on paper | signal
source: Power (1997) · Brunsson (1989)
---
Notes:
**Propositions 1 and 2 cause this one.** Heng's point from the meeting.

- Click 0: Three uses sit below the bar. Testing cannot lift them (Proposition 1), or lifting them costs too much (Proposition 2).
- Click 1: The bar still has to be cleared. So a second position appears above it. This is the one that gets reported.
- Click 2: It passes. The distance between the reported dot and the real dot is the paperwork. Power calls this the audit society's rituals of verification.

Hold on to the hollow dots. Proposition 7 comes back for them.

---
id: p4
kicker: What defensibility adds · Proposition 4 · Fit
title: Evidence counts only as far as it bears on the **task**
bloom: teal
component: FrontierMap
stage: p4
adds: Each point's true height
use[]: Tested task
use[]: Nearby task
use[]: Distant task
credited: As tested
true: What it establishes here
row[]: Verification | Credits evidence whatever task it came from | amber
row[]: Defensibility | Counts it only where it bears on this task | teal
---
Notes:
**The first link.** From here on, each proposition is a place where verification and defensibility give different answers.

- Click 1: One test report, three uses. A checklist asks whether a test report exists, so all three sit at the same height and all three pass.
- Click 2: Fit asks what that evidence establishes for each task. For the task it was tested on, all of it. For a nearby task, less. For a distant one, very little. Same evidence, different heights.

A general-purpose model gets used further and further from the task it was tested on. Nobody decides that. People just ask it things.

---
id: p5
kicker: What defensibility adds · Proposition 5 · Proportionality
title: The evidence required rises with the **stakes**
bloom: teal
component: FrontierMap
stage: p5
adds: A bar that rises with stakes, and four regions
row[]: Verification | Holds one bar for every use | amber
row[]: Defensibility | Asks for more as more is at stake | teal
source: Rudner (1953) · Douglas (2000)
---
Notes:
**This is the frontier.**

- Click 1: Take the verification bar and let it answer to stakes. It pivots. The pivot is the use the checklist was written for. At that one point the two bars agree, which is why verification works for an anticipated use.
- Click 2: Everywhere else they disagree, in two directions. To the right, a use clears the fixed bar and is still not defensible, because too much rides on it. False assurance. To the left, a use fails the fixed bar and is perfectly defensible, because little rides on it. Needless refusal.

A fixed bar is wrong both ways. Rudner and Douglas are the grounding. How much evidence is enough depends on the cost of being wrong.

---
id: p6
kicker: What defensibility adds · Proposition 6 · Revisability
title: Controls that would catch a failure lower the bar. Controls that merely **exist** do not.
bloom: teal
component: FrontierMap
stage: p6
adds: A bar that drops when controls work
ctl_exists: A control is on file
ctl_works: The control would catch a failure
row[]: Verification | Checks that controls exist | amber
row[]: Defensibility | Asks whether they would catch a failure | teal
---
Notes:
**This answers Nick's objection** that a verification audit can look at the process too. It can. The difference is what the control does to the verdict.

- Click 0: One use, in false assurance. It clears the checklist and sits below the defensibility bar.
- Click 1: A control is on file. The checklist ticks it. Nothing moves, because a control that exists has not been shown to do anything.
- Click 2: A control that would catch and reverse a failure lowers the bar. If errors get caught, less has to be established in advance. The same dot is now defensible, without any new evidence about the model.

---
id: p7
kicker: What defensibility adds · Proposition 7 · Answerability
title: Reliance that has to be defended resists **theater**
bloom: teal
component: FrontierMap
stage: p7
adds: A point someone has to defend
stamp: Pass
forum: Forum
ask: Why?
unowned: No owner
owned: Owner
reported: Reported
row[]: Verification | Accepts a record | amber
row[]: Defensibility | Requires an owner who can answer a challenge | teal
source: Bovens (2007) · Lerner & Tetlock (1999)
---
Notes:
**This closes the gap Proposition 3 opened.** It is also the least certain of the seven and the most empirical.

- Click 0: Two uses. On the left, a reported position with nobody behind it. On the right, a position an owner placed and holds the reasons for.
- Click 1: A forum asks why. The question is why the dot is where you say it is. Whether a record exists is a separate matter.
- Click 2: The reported position with no owner cannot answer, and it falls back to where the use really sits. The owned one holds.

Nick's "someone vouches" is the fact. "They can explain it" is the link. The mechanism is Lerner and Tetlock. People who expect to justify a judgment to an audience they cannot predict reason more carefully before they make it.

---
id: read
kicker: The deliverable
title: How to read the **map**
bloom: teal
component: FrontierMap
stage: read
q[]: Is a checklist enough here? | Only near the use it was written for.
q[]: If not, which way is it wrong? | False assurance to the right. Needless refusal to the left.
q[]: How is it repaired? | Better evidence, a narrower use, or stronger controls.
fix[]: ↑ | Better evidence
fix[]: ← | Narrower use
fix[]: ↓ | Stronger controls
---
Notes:
**Three questions for any deployment.**

- Click 1: Is a checklist enough? Only near the pivot. The further a use drifts from what the checklist anticipated, the less the tick means.
- Click 2: If not, which way is it wrong? Right of the pivot, the risk is false assurance. Left of it, the risk is refusing something harmless.
- Click 3: How is it repaired? Three moves. Raise the point with better evidence, which only goes as far as the limit of testing. Move it left by narrowing the use. Or lower the bar with controls that work. A fixed bar only recognizes the first.

What is still open. The shape of the bar is schematic and we claim only its direction. Forum competence is undefined. And we need the answer to "this is just risk-based regulation" (risk tiers are a staircase with fixed checks inside each step).
