<!--
  The Burden of Truth · 15-minute talk · slide text
  ================================================
  Same format as the ITAO 40515 web decks. A block between two lines of three dashes holds the slide's
  settings, then the slide text, "Click N:" captions, and speaker notes after a line that says "Notes:".
  Keys ending in [] repeat. Fields inside a repeated key are separated by " | ". \n is a line break.
  Never put a line of three dashes inside a slide's text.
  Components (the animated figures) are in js/components/talk.js; "component:" names one.
  Save this file and the open deck reloads (when started with start-deck). The "Click N:" lines are the
  italic caption at the bottom of the slide; the speech is in Notes (press P for the presenter window).
-->

---
id: title
layout: title
kicker: A theory of defensibility for AI audits
title: The Burden\nof Truth
subtitle: What an audit can still establish when there is no right answer to check against
meta: **Cam Kormylo** · Heng Xu · Nicholas Berente\nMendoza College of Business · University of Notre Dame
component: TitleStamps
compfull: 1
---
Notes:
**0:00.** Let the stamps run for a beat. "Every audit passed" is the first line of the talk and the last.

---
id: audited
kicker: The running example
title: Meta content moderation, the most audited AI system in the world
bloom: amber
component: AuditStack
check[]: Quarterly enforcement metrics | Prevalence, proactive rate, and since 2025 a count of "mistakes"
check[]: Independent audit under the EU Digital Services Act | EY, 2024. 54 sub-articles. Over 90% fully compliant. No adverse conclusions.
check[]: A standing review body | The Oversight Board. Twenty-plus members. Binding on individual posts.
harm[]: 2015 · Myanmar | Two Burmese-speaking reviewers for a country that ran on Facebook. The UN later said the platform's role bore the hallmarks of genocide.
harm[]: 2020 · Ethiopia | Five years later, with Myanmar as evidence, no hate-speech classifier in Amharic or Oromo as a civil war began.
source: Meta, "Meta's Progress Implementing the Digital Services Act," Nov 2024 · Reuters, "Why Facebook is losing the war on hate speech in Myanmar," Aug 2018 · Facebook Files (CNN, WSJ), Oct 2021
---
Notes:
**0:10. About 90 seconds.** Build the stack slowly. Click 1 to 3: it reports its own numbers every quarter; it is audited by a Big Four firm against European law; it has a supreme court for posts. The three checks are real and I am not mocking them; they are what a well-run audit regime looks like. Click 4: and in 2015 the whole of Myanmar was reviewed by two people. Click 5: five years later, the same thing in Ethiopia, with Myanmar on the record as evidence. Do not explain yet. End on: "Every one of those audits passed, before and after. I want to talk about what they were checking."
---
id: claim
kicker: The claim
title: The predominant approach asks whether the system is **correct**
bloom: teal
component: TwoQuestions
left: Is it correct? | The predominant approach · Verification | Compare the system's outputs to a standard fixed in advance. The logic IS audit inherited from financial audit.
right: Was reliance justified? | The alternative · Defensibility | Examine the organization's judgment to depend on the system, given the evidence, the uncertainty, the people responsible, and the stakes.
---
Notes:
**1:40. About 50 seconds.** Click 0: the predominant approach. Sixty years of IS audit have asked whether the system is correct, by comparing outputs to a standard fixed in advance. Click 1: the alternative. "For a large class of generative AI deployments, including content moderation at scale, there is no correct output to verify against. We propose that the audit ask instead whether the organization was justified in relying on the system. That is the standard we develop, and we call it defensibility." Then the signpost, spoken: why the predominant approach stops working, what the alternative requires, and two audits of one deployment.

Said aloud, per click:
- Click 0: The predominant approach: is the system correct?
- Click 1: The alternative: was reliance on the system justified?
---
id: pillars
kicker: Part 1 · The problem
title: Verification rests on four requirements
bloom: amber
component: FourPillars
pillar[]: Assertions | that can be true or false
pillar[]: Evidence | that confirms or disconfirms them
pillar[]: Determinate states | a subject matter with facts to compare against
pillar[]: Criteria | established in advance
source: Committee on Basic Auditing Concepts (Silvoso, 1972) · Power (1997) · Kroll et al. (2017), Raji et al. (2020), NIST AI RMF (2023), EU AI Act (2024)
---
Notes:
**2:30. About 45 seconds.** Fast. Verification is a fine logic with preconditions, not a mistake. A ledger reconciles or it doesn't; a transaction meets its specification or it doesn't; a known abuse image hash-matches or it doesn't. Every AI audit framework of the last decade widened what gets checked without changing the logic of checking.

Said aloud, per click:
- Click 0: The 1972 definition of auditing presupposes four things.
- Click 1: Assertions that can be evaluated for truth.
- Click 2: Evidence capable of confirming or disconfirming them.
- Click 3: A subject matter with determinate states, so evidence can connect to assertion.
- Click 4: Criteria established before the audit begins.
---
id: indeterminacy
kicker: Part 1 · The problem
title: A post is not a ledger entry
bloom: signal
component: Annotators
post: "Clean the cockroaches."
postmeta: Translated from Amharic. Posted during the Tigray war, 2020 to 2022.
reader[]: Annotator 1 | Remove | Dehumanizing term for Tigrayans in this dialect
reader[]: Annotator 2 | Keep | Idiom. No target named. Could be about pests.
reader[]: Annotator 3 | Remove | Context: posted in a militia group
reader[]: Annotator 4 | Unsure | Depends who is reading and when
term: Epistemic indeterminacy
definition: There is no answer, fixed independently of the context of use, against which the adequacy of an output can be checked.
source: DAIR Institute study of moderation during the Tigray war (2025) · Lebovitz, Levina & Lifshitz-Assaf, MISQ (2021) · Goodman et al., JAMA (2024)
---
Notes:
**3:15. About 75 seconds.** This is the slide that earns the rest. The study's authors found that dialect knowledge, including slang, was crucial, and that this post was not flagged by all annotators. Whether a post is incitement is settled by readers in a place and a moment. Lebovitz and colleagues found the same thing in hospital ML: the accuracy figures hid the uncertainty inside the labels. Click 3 brings in the definition. Say that it removes the one requirement the other three depend on, determinate states, and that it is a property of the task, not a defect of the model. Discharge summaries, legal summaries, translations, code against an unspecified requirement all share it.

Said aloud, per click:
- Click 0: One post from the Tigray war, as a study of moderation in that conflict translated it.
- Click 1: Four fluent annotators. Three answers.
- Click 2: There is no fact of the matter for a classifier to be checked against. The "ground truth" is other people's judgment.
---
id: reflexes
kicker: Part 1 · The problem
title: Two common responses
bloom: signal
component: Reflexes
measure: Measure it | "Our LLMs make 13% fewer errors than human reviewers." | Fewer errors measured against what? Against the human labels. The contested thing is the yardstick.
wait: Wait for it to improve | 97.4% of hate-speech removals on Instagram were automated in Q1 2025. | The better the system, the fewer humans ever see the rare failure in the rare language. Showing a 1-in-1,000 error rate takes about 3,000 clean cases.
source: Financial Times reporting on Meta's LLM moderation (2026) · Meta Q1 2025 Integrity Report via Wired · Kalra & Paddock (2016) · Bainbridge (1983) · Parasuraman & Manzey (2010)
---
Notes:
**4:30. About 60 seconds.** The 13% figure is Meta's own, reported to the FT. Do not dispute it. Ask what it is measured against. Knight would call this uncertainty wearing the clothes of risk. The 97.4% figure is from Meta's Q1 2025 integrity report. Then the arithmetic: to show with 95% confidence that an error occurs less than once in a hundred cases you need about 300 consecutive clean cases; for one in a thousand, about 3,000. Kalra and Paddock ran this for autonomous vehicles. Close the slide with: so verification costs more and catches less at exactly the moment the organization relies on it more. This is Proposition 2 in the paper.

Said aloud, per click:
- Click 0: Two standard responses to indeterminacy.
- Click 1: Treat it as a measurement problem.
- Click 2: Measured against what? The labels, which are the judgment in dispute.
- Click 3: Or wait. The systems are improving.
- Click 4: Rare errors need huge samples to detect, and the humans who should notice them attend less to a system that is usually right.
---
id: ritual
kicker: Part 1 · The problem
title: What verification produces when it cannot verify
bloom: amber
component: CopyPaste
statute: Art. 34(1). Providers of very large online platforms shall diligently identify, analyse and assess any systemic risks in the Union stemming from the design or functioning of their service…
quote[]: "EY will not provide … opinions of legal interpretation." | Service agreement, audit report appendix
quote[]: "Making interpretations, defining ambiguous terms" is Meta's responsibility. | EY assurance report
quote[]: "Some of these kinds of self-assessments have become box-checking exercises that miss significant risks." | Former Meta executive, to NPR, 2025
ritual: Ritual of verification
ritualsub: Power, 1997
source: DSA Observatory, "Shortcomings of the first DSA audits," June 2025 · NPR, May 31 2025 · Power, The Audit Society (1997) · Bovens (2007) · Edelman (1992)
---
Notes:
**5:30. About 60 seconds.** The copy animation is the argument. The auditor pasted the legal text as its criteria and disclaimed interpretation; Meta defined the terms; the conclusion followed. The Commission then opened proceedings anyway. Click 4 blurs the whole thing under the label. Say: Power called this a ritual of verification. No bad faith is needed. Bovens: accountability needs a forum able to evaluate the account; a forum that cannot judge reliability judges the paperwork, and organizations rationally produce paperwork. The former executive's line is from NPR's reporting on Meta automating its own risk reviews, which we come back to.

Said aloud, per click:
- Click 0: The DSA audit report, as the DSA Observatory read it.
- Click 1: The audit criteria are the statute, copied.
- Click 2: The conclusion: fully compliant.
- Click 3: Who decides what the ambiguous terms mean? The auditee.
---
id: pivot
kicker: Part 2 · The solution
title: Audit the judgment to rely, not the output
bloom: teal
component: ObjectShift
output: The post | Remove or keep?
judgment: The decision to rely | on automated detection, at full scale, in Amharic, during a civil war
part[]: Evidence | What did they know?
part[]: Actors | Who can answer for it?
part[]: Threshold | How sure did they have to be?
simon: "Probably the strictest standard we can generally satisfy with real-world problems of this complexity."
source: Simon, The Sciences of the Artificial (1996, p. 146) · Toulmin (2003) · Rudner (1953) · Douglas (2009) · Bovens (2007)
---
Notes:
**6:30. About 60 seconds.** The move: shift the audit object from the output to the justification for relying on it. The reasoning behind a decision is fixed at the time it was made and can be reconstructed from the artifacts (Simon's procedural rationality, Baron and Hershey on outcome bias). Verification stays, as one input to the justification. Then the three constituents. Each is a condition in the paper: evidential sufficiency, epistemic answerability, proportional threshold. Simon's line pre-empts "isn't this a weak standard."

Said aloud, per click:
- Click 0: Every check rests on prior choices: what to check, against what, how much is enough.
- Click 1: For a hash database those choices are a specification. For Amharic in a war they are judgments by particular people. That is where responsibility lives, and it is what an auditor can examine even when correctness is unavailable.
- Click 2: A justification has three constituents, and each replaces one of verification's requirements.
- Click 3: Simon, on defensibility as a standard.
---
id: evidence
kicker: Condition 1
title: Evidential sufficiency
bloom: teal
component: EvidenceTimeline
event[]: Jun 2020 | Internal audit | "Significant gaps in our coverage (especially in Myanmar & Ethiopia) … our current signals may be inadequate." No classifier for Amharic or Oromo.
event[]: Nov 2020 | War begins | Tigray conflict starts. Reliance on automated detection continues at full scale.
event[]: Mar 2021 | Internal report | Headline in bold: "Current mitigation strategies are not enough."
event[]: 2021 | Internal roadmap | Ethiopia rated in "dire" risk of violence. Own capacity rated 0 out of 3.
test[]: Relevant to this deployment | yes
test[]: Read in light of its limits | yes
test[]: Affected the decision | no
source: Facebook Files via CNN and WSJ, Oct 2021 · Wired, Dec 2022 (Kenyan lawsuit filings) · Council on Foreign Relations, 2022
---
Notes:
**7:30. About 60 seconds.** The principle: evidence chosen for its relevance to the specific deployment, read in light of its known limits, and it affected the decision. Click 1: Meta's own teams produced the evidence. Click 2: the war began and the line of reliance did not move. Click 3: nine months later, in bold. Click 4: by the roadmap's own scale, zero. Click 5: two of three clauses met; verification never tests the third, because the third is about the judgment. Read the quotes, no adjectives. The flat line is the point. Fit, not volume.

Said aloud, per click:
- Click 0: Did the evidence bear on this deployment, and did it change the decision?
---
id: answerability
kicker: Condition 2
title: Epistemic answerability
bloom: lilac
component: ManyHands
hand[]: Policy team | explains the policy
hand[]: Classifier team | explains the languages it covers
hand[]: Nairobi review hub | explains the queue
hand[]: Two fact-check partners | five people, four languages
hand[]: Regional operations | explains the escalation path
hand[]: Headquarters | explains the strategy
center: The decision to run at full scale in a civil war with capacity rated zero
ask: Oversight Board, Dec 2021 | Recommended an independent human-rights assessment of Meta's role in Ethiopia
answer: Meta, Jan 2022 | Would "assess the feasibility" of commissioning one
source: Oversight Board decision 2021-014-FB-UA · Reuters, Jan 2022 · Nissenbaum (1996) · Bovens (2007) · Lerner & Tetlock (1999)
---
Notes:
**8:30. About 60 seconds.** Click 1: every party can explain its own part. Click 2: nobody is positioned to answer for the center; Nissenbaum's problem of many hands. Click 3: the forum asked. Click 4: the organization answered with a feasibility study, which is nominal responsibility without the capacity to give an account. A signature chain is formal accountability; answerability is being able to say what the evidence showed and what would have changed the decision. Lerner and Tetlock: people who expect to answer beforehand reason more self-critically; those called afterward defend. The Myanmar assessment in 2018 and the Ethiopia request in 2021 were both afterward.

Said aloud, per click:
- Click 0: Can identifiable actors defend the judgment as a whole, including what would have changed it?
---
id: threshold
kicker: Condition 3
title: Proportional threshold
bloom: teal
component: Spike
after: "Break the glass" | Dozens of enforcement levers pulled during exceptionally inciteful events
before: A threshold | Conditions for restricting virality in a country at war, fixed before the spike, with a named group authorized to pull them
contrast: January 2025: Meta publicly raised confidence thresholds and tiered automated enforcement by severity. Whatever one thinks of the policy, that is a threshold stated in advance. Whether the tiers fit the stakes is exactly what a forum should examine.
source: Wired, Dec 2022 (internal "break the glass" documents) · Meta, Jan 7 2025 · Bernoulli (1713) · Douglas (2009)
---
Notes:
**9:30. About 60 seconds.** Click 1: incitement during a conflict does not arrive on a schedule. Click 2: Meta's instruments are "break the glass" measures, levers pulled after the spike; a threshold inferred from the results. Click 3: a proportional threshold is drawn beforehand: here is the level, who pulls the lever, what the lever does. A threshold need not be a number. Click 4: one contrast and one caution. Bernoulli: fix the standard publicly and in advance so the judge cannot bend it to the case. Douglas: the certainty required rises with the consequences of error. The January 2025 beat is deliberately neutral; the framework is indifferent to which direction a threshold moves. Say that once and move on.

Said aloud, per click:
- Click 0: Was the required confidence fixed in advance, scaled to the harm, and backed by a way to restrict?
---
id: joint
kicker: Part 2 · The solution
title: Three parts of one justification
bloom: teal
component: Arch
stone[]: Evidence
stone[]: Actors
stone[]: Threshold
---
Notes:
**10:30. About 30 seconds.** Click 3: a finding of defensible reliance does not say the platform is safe; it says the decision was justified on what was knowable at the time. Quick. Non-compensatory, which separates this from maturity models. Baron and Hershey: judge the decision on what was knowable when it was made, not on how it turned out.

Said aloud, per click:
- Click 0: The three conditions are constituents of a single justification.
- Click 1: Remove any one and the justification does not stand. Strong evidence does not compensate for no one who can answer for it.
- Click 2: A justification missing a part is incomplete, which is a different defect from weak. This is not a scorecard that sums across dimensions.
---
id: twoaudits
kicker: Part 3 · Two audits of one deployment
title: What would have changed?
bloom: signal
component: TwoAudits
vitem[]: Proactive detection rate high
vitem[]: Community Standards translated into Amharic and Oromo
vitem[]: Ethiopia assigned to the highest risk tier
vitem[]: Transparency reports filed on schedule
ditem[]: Evidence fit the deployment and was ignored
ditem[]: No one positioned to answer for the whole
ditem[]: No threshold before the spike, only levers after
require[]: Demonstrate classifier performance in the four languages before relying at scale
require[]: Name a group with authority to restrict virality in the country
require[]: Fix the restriction conditions before the conflict, not during it
source: Amnesty International, "A death sentence for my father," Oct 2023 · Wired, Dec 2022 · Facebook Files, Oct 2021
---
Notes:
**11:00. About 90 seconds.** This is the payoff and the answer to "so what would you have done." The verification audit is unaffected by the harm because it cannot detect it. The defensibility audit is unaffected because its finding was made on contemporaneous evidence in 2020. Click 5: what defensible reliance would have required is exactly what Meta did later, and what Amnesty says came too late. Do not claim the war would have gone differently. Claim that the reliance which produced the failure was identifiable before the failure, and that the fix was known. The forum that did eventually form was a Kenyan court, in a suit brought by the professor's son and an Amnesty adviser. Courts arrive when audits don't.

Said aloud, per click:
- Click 0: Mid-2020. Two audits of the same deployment.
- Click 1: Verification: everything it can check is in order.
- Click 2: Defensibility: all three conditions fail while every metric looks fine.
- Click 3: November 2021. Run both again.
- Click 4: Same two findings. Neither needed the harm.
---
id: now
kicker: Part 3 · Right now
title: The judgment is being made again
bloom: signal
component: NowDial
stage[]: 2024 | Human reviewers decide; LLMs give a "second opinion" | 100
stage[]: 2025 | Roughly half of human review requests replaced by LLMs | 50
stage[]: End of 2026 | Target: LLMs handle over 90% for some content types | 10
risk: Up to 90% of Meta's own product risk assessments to be automated. Product teams fill in a questionnaire and receive an "instant decision." Areas include AI safety, youth risk, and integrity.
source: Financial Times, 2026 · NPR, "Meta plans to replace humans with AI to assess privacy and societal risks," May 31 2025
---
Notes:
**12:30. About 45 seconds.** Trim here if behind; the slide works with click 1 and click 3 alone. Staff told the FT the rollout is too fast to oversee. The organization that most needs a justification structure is handing the construction of its justification to the same kind of system the justification is supposed to govern. The model behind moderation was swapped mid-stream (from Gemini to Meta's own). Each of those reopens the deployment judgment. Close with: reliance is renewed every day; is the justification?

Said aloud, per click:
- Click 0: The reliance decision is not history.
- Click 1: Half of human review requests went to language models in 2025. Nine in ten is the target.
- Click 2: And the risk review itself is becoming an instant decision.
---
id: forum
kicker: Implications
title: The forum, and what it should ask
bloom: lilac
component: ForumQuestions
forum[]: Oversight Board | Judges individual posts | Was the evidence fit for this deployment, and did it change the decision?
forum[]: European Commission | Judges compliance with the statute | Who can account for the whole judgment, and what would have changed it?
forum[]: Courts | Judge the harm, afterward | Was the threshold set before the results, and did it match the stakes?
limit[]: Not a guarantee of safety or correctness
limit[]: Not a replacement for technical evaluation or compliance
limit[]: Not a theory of whether the platform should exist at all
---
Notes:
**13:15. About 50 seconds.** Click 3: three limits, stated fast. For auditors: interpretive competence, cross-examine the reasoning rather than inventory the files. For organizations: defensibility is built before the audit; accounts composed afterward tend toward self-defense. For regulators: a statement of what procedures must establish. The hazard is that defensibility becomes a new ritual; the safeguards are a contemporaneous record and defense under live questioning.

Said aloud, per click:
- Click 0: Three forums already sit in judgment of Meta.
- Click 1: Each judges something other than the deployment judgment.
- Click 2: Each could ask one question per condition. None of them is positioned to today.
---
id: close
kicker: The burden of truth
title:
bloom: amber
component: Close
line1: When the truth cannot be established, the burden shifts to those who act. They must be able to show why relying on the system was justified.
meta: ckormylo@nd.edu · Slides at ckormylo.github.io/burden-of-truth
---
Notes:
**14:05. Finish by 14:45.** Read the line slowly. Then, spoken: Meta passed every audit it was given. Nobody gave it the one that asked whether anyone was right to rely. Then stop talking.