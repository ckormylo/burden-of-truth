<!--
  The Burden of Truth · building the frontier map · slide text
  ============================================================
  Same format as the talk deck and the ITAO 40515 web decks. A block between two lines of three dashes
  holds the slide's settings, then speaker notes after a line that says "Notes:".
  Keys ending in [] repeat. Fields inside a line are separated by " | ". \n is a line break.
  Never put a line of three dashes inside a slide's text.

  The first block (layout: data) is not a slide. It holds text shared by every slide: the labels drawn
  on the map, and the names of the two parts shown in the tracker at the top right.

  Proposition slides use "component: Proposition" with:
    pnum, pname   the number and short name
    title         the plain-language version (the slide title)
    prop          the wording as it would appear in the paper
    cite[]        Author (year) | what they contribute
    stage         which figure to draw (p1 ... p7)
  The figures are in js/components/frontier.js.
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
map.groundlabel: Grounding
track1: Verification falls short
track2: Defensibility adds
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

Two parts follow. Three propositions on where checking fails. Then four on what the links add, which build one map.

---
id: part1
layout: divider
part: 1
of: 2
bloom: amber
kicker: Part 1 · Propositions 1 to 3
title: Why verification falls short
context: Three propositions about what checking against fixed criteria cannot do for generative AI.
---
Notes:
Part 1 is the negative case. Nothing here is on the map yet. Each of the three has its own picture.

---
id: p1
kicker: Part 1 · Why verification falls short
title: Indeterminacy limits what verification can **establish**
bloom: amber
component: Proposition
stage: p1
pnum: 1
pname: Indeterminacy
prop: The greater the epistemic indeterminacy of an AI system's outputs, the less assurance a verification-based audit can provide about reliance on that system.
crit: Criterial | Is there one right answer?
cov: Coverage | Can tests reach the inputs?
keys: One right answer | Acceptable | Also acceptable | Depends on context
tested: Tested
asked: What it will be asked
meter: What verification can establish
cite[]: Knight (1921) | Uncertainty that cannot be reduced to measurable risk
cite[]: Lebovitz, Levina & Lifshitz-Assaf (2021) | "Ground truth" labels conceal disagreement among experts
cite[]: Raji et al. (2021) | No benchmark covers what a general-purpose system will be used for
---
Notes:
**Two kinds of indeterminacy, one consequence.**

- Click 0: The case verification was built for. Every output is compared to one answer key, and the tests cover the inputs. The bar at the bottom is full.
- Click 1: Criterial indeterminacy. The key splits. Several outputs are acceptable and which is best depends on context, so the ticks become question marks.
- Click 2: Coverage indeterminacy. The space of things the system will be asked is far larger than anything that was tested. The tested patch stays the same size while the field grows around it.

Both shrink what a verification audit can establish. This is a property of the task, so a better model does not fix it.

---
id: p2
kicker: Part 1 · Why verification falls short
title: Reliability makes the remaining errors harder to **verify**
bloom: amber
component: Proposition
stage: p2
pnum: 2
pname: Reliability
prop: The more reliable an AI system becomes, the more evidence is required to detect its remaining errors through verification, and the less human scrutiny those errors receive.
rung[]: 1 in 10 | 30
rung[]: 1 in 100 | 300
rung[]: 1 in 1,000 | 3,000
rung[]: 1 in 10,000 | 30,000
col_rate: Errors rarer than
col_cases: Clean cases needed to show it
col_watch: People still checking
cite[]: Kalra & Paddock (2016) | Demonstrating a rare failure rate takes impractically large samples
cite[]: Bainbridge (1983) | The more reliable the automation, the less able its human monitors
cite[]: Parasuraman & Manzey (2010) | Complacency rises with a system's reliability
---
Notes:
**The better the model, the more this bites.**

- Click 1: Each row is ten times more reliable than the one above and takes ten times the evidence. To show at 95% confidence that errors are rarer than 1 in 10 takes about 30 clean cases in a row. For 1 in 10,000, about 30,000. This is the rule of three for zero observed failures. The bars are not to scale. The numbers are.
- Click 2: The other column runs the opposite way. A system that is usually right gets watched less, so the rare failure is the one nobody is positioned to catch. Bainbridge's irony of automation.

So verification costs more and catches less at the moment the organization relies on the system more.

---
id: p3
kicker: Part 1 · Why verification falls short
title: Demanded anyway, verification turns into **paperwork**
bloom: amber
component: Proposition
stage: p3
pnum: 3
pname: Theater
prop: When verification is required under conditions in which it cannot provide assurance, organizations satisfy the requirement with documentation that is decoupled from whether their reliance on the system is sound.
question: Is reliance on this system sound?
blocked: Cannot be verified
still: Still unanswered
instead: So the audit checks what can be checked
doc[]: Policy adopted
doc[]: Model card filed
doc[]: Tests logged
doc[]: Sign-off recorded
checked: Each of these is true, and each can be verified
pass: Audit passed
decoupled: Decoupled
cite[]: Power (1997) | Audits gravitate to what is auditable and become rituals of verification
cite[]: Meyer & Rowan (1977) | Formal structure adopted as ceremony, decoupled from actual practice
cite[]: Brunsson (1989) | Organizations answer conflicting demands with talk separated from action
---
Notes:
**Propositions 1 and 2 cause this one.** Heng's point from the meeting. Nobody here is fabricating anything, and that is the point.

- Click 0: The question the audit exists to answer cannot be verified, for the reasons on the last two slides. An audit is required anyway.
- Click 1: So the audit moves to what can be verified. Is there a policy? Is a model card on file? Were tests logged? Did someone sign? Every one of these is true, and every one gets a tick.
- Click 2: The audit passes. The documents are real. They are decoupled from the question, which is still unanswered. Power calls this making things auditable. Meyer and Rowan call it ceremony.

Hold on to this. Proposition 7 comes back to it.

---
id: part2
layout: divider
part: 2
of: 2
bloom: teal
kicker: Part 2 · Propositions 4 to 7
title: What defensibility adds
context: Four propositions, one for each link. Each is a place where verification and defensibility give different answers, and each adds one element to the map.
---
Notes:
The turn. Part 1 said what checking cannot do. Part 2 says what arguing the links adds. From here on every slide draws on the same map.

---
id: setup
kicker: Part 2 · The map
title: Every use of a model is a point on one **map**
bloom: teal
component: FrontierMap
stage: setup
part: 2
legend[]: A point | One use of one model
legend[]: The bar | Verification. One criterion, fixed in advance, the same for every use.
legend[]: The limit | What testing can show, from Propositions 1 and 2
---
Notes:
**Read the map before building on it.**

- Click 1: Each dot is one use of a model. Further right, more rides on it. Higher up, the evidence establishes more for that use.
- Click 2: A verification audit is one bar set in advance. Above it passes, below it fails. It is the same bar wherever the dot sits. That is Part 1's subject, drawn.
- Click 3: Propositions 1 and 2 put a limit on how high testing can lift any dot.

The shape of the map is schematic. Only the directions are claimed.

---
id: p4
kicker: Part 2 · What defensibility adds
title: Evidence counts only as far as it bears on the **task**
bloom: teal
component: Proposition
stage: p4
pnum: 4
pname: Fit
prop: Evidence about an AI system justifies reliance only to the extent that it bears on the task for which the system is used. Holding the evidence constant, reliance is less defensible the further the use departs from the conditions under which that evidence was produced.
adds: Each point's true height
use[]: Tested task
use[]: Nearby task
use[]: Distant task
credited: As tested
true: What it establishes here
cite[]: Toulmin (1958) | Data support a claim only through a warrant that can be challenged
cite[]: Kane (2013) | Validity belongs to a particular use of evidence, never to the test itself
cite[]: Cartwright & Hardie (2012) | "It worked there" does not show that it will work here
---
Notes:
**The first link.**

- Click 1: One test report, three uses. A checklist asks whether a test report exists, so all three sit at the same height and all three pass.
- Click 2: Fit asks what that evidence establishes for each task. For the task it was tested on, all of it. For a nearby task, less. For a distant one, very little. Same evidence, different heights.

A general-purpose model gets used further and further from the task it was tested on. Nobody decides that. People just ask it things.

---
id: p5
kicker: Part 2 · What defensibility adds
title: The evidence required rises with the **stakes**
bloom: teal
component: Proposition
stage: p5
pnum: 5
pname: Proportionality
prop: The evidence required for reliance to be defensible increases with the stakes of the use. An audit that applies a fixed criterion therefore overstates assurance for high-stakes uses and rejects defensible low-stakes uses.
adds: A bar that rises with stakes, and four regions
cite[]: Rudner (1953) | How much evidence is enough depends on the cost of being wrong
cite[]: Douglas (2000) | Inductive risk. The stakes of error set the standard of evidence.
---
Notes:
**This is the frontier.**

- Click 1: Take the verification bar and let it answer to stakes. It pivots. The pivot is the use the checklist was written for. At that one point the two bars agree, which is why verification works for an anticipated use.
- Click 2: Everywhere else they disagree, in two directions. To the right, a use clears the fixed bar and is still not defensible, because too much rides on it. False assurance. To the left, a use fails the fixed bar and is perfectly defensible, because little rides on it. Needless refusal.

A fixed bar is wrong both ways.

---
id: p6
kicker: Part 2 · What defensibility adds
title: Only controls that **work** lower the bar
bloom: teal
component: Proposition
stage: p6
pnum: 6
pname: Revisability
prop: Controls reduce the evidence required for reliance to be defensible only to the extent that they would detect and correct a failure before its consequences are realized. The existence of a control does not by itself affect defensibility.
adds: A bar that drops when controls work
ctl_exists: A control is on file
ctl_works: The control would catch a failure
cite[]: Collingridge (1980) | Under ignorance, prefer decisions that can be detected and corrected
cite[]: Reason (1997) | Defenses have latent gaps that their existence on paper does not reveal
---
Notes:
**This answers Nick's objection** that a verification audit can look at the process too. It can. The difference is what the control does to the verdict.

- Click 0: One use, in false assurance. It clears the checklist and sits below the defensibility bar.
- Click 1: A control is on file. The checklist ticks it. Nothing moves, because a control that exists has not been shown to do anything.
- Click 2: A control that would catch and reverse a failure lowers the bar. If errors get caught, less has to be established in advance. The same dot is now defensible, without any new evidence about the model.

---
id: p7
kicker: Part 2 · What defensibility adds
title: Reliance that has to be defended resists **theater**
bloom: teal
component: Proposition
stage: p7
pnum: 7
pname: Answerability
prop: Reliance is less susceptible to audit theater when an identifiable owner decided to rely on stated grounds and can be required to justify those grounds before a competent forum than when the audit requires only a record of approval.
forum: The forum asks
ask[]: Does the evidence bear on this task?
ask[]: Is it enough for these stakes?
ask[]: Would the controls catch a failure?
owned: Owner
unowned: Record only
stamp: On file
holds: Position holds
unknown: Position unknown
cite[]: Bovens (2007) | Accountability is an actor justifying conduct to a forum that can question it
cite[]: Lerner & Tetlock (1999) | Expecting to justify a judgment to an unknown audience improves the judgment
cite[]: Nissenbaum (1996) | "Many hands" leave no one answerable for what a system does
---
Notes:
**The map is a claim. This slide is about who stands behind it.** It also closes the gap Proposition 3 opened. It is the least certain of the seven and the most empirical.

- Click 0: Two uses, both above the checklist bar. One was placed by an owner who decided on stated grounds. The other has a record of approval on file and nothing else.
- Click 1: A forum sits outside the map and reads it. Its three questions are the three links from the last three slides. Fit, proportionality, revisability.
- Click 2: The owner can answer all three, so that position holds. A record cannot answer anything. Nobody can say why that dot is where it is, so its position on the map is unknown. The paperwork from Proposition 3 does not survive being asked.

Nick's "someone vouches" is the fact. "They can explain it" is the link.

---
id: read
kicker: Part 2 · The deliverable
title: How to read the **map**
bloom: teal
component: FrontierMap
stage: read
part: 2
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
