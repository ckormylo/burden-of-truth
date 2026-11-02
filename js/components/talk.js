/* Components for "The Burden of Truth" talk. Each exports { steps, mount(host, ctx) -> { update(click, animate), destroy? } }.
   All text comes from slides.md front matter (ctx.fm); the figures here only arrange and animate it.
   Sizes are stage pixels: the content area is 1456 x 624 (left 72, top 160) unless compfull is set (1600 x 900). */
(function () {
  "use strict";
  const { h, s, svg } = Deck;
  const split = (line) => String(line).split("|").map((x) => x.trim());
  const on = (el, visible, cls) => el.classList.toggle(cls || "off-up", !visible);
  const stamp = (text, cls) => h("div", { class: "stamp " + (cls || "") }, text);
  const inline = (t) => Deck.inline(t || "");
  const C = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#000";

  /* ---------- Title: a ledger of checks, each stamped in turn ---------- */
  Deck.components.TitleStamps = {
    steps: 0,
    mount(host, ctx) {
      const rows = ["Prevalence report · Q1", "Proactive rate · hate speech", "DSA Art. 34 risk assessment", "Independent audit · Art. 37", "Oversight Board · case 2021-014", "Transparency report · H2", "Community Standards · translated", "Risk tier · assigned", "Enforcement mistakes · counted"];
      const ledger = h("div", { class: "ledger" });
      host.appendChild(ledger);
      const stamps = rows.map((r, i) => {
        const row = h("div", { class: "lrow" }, h("span", { class: "lt" }, r), h("span", { class: "ldots" }));
        const st = stamp("PASS", "pass hidden");
        row.appendChild(st);
        ledger.appendChild(row);
        return st;
      });
      const timers = [];
      if (ctx.print || ctx.preview || Deck.reduced) stamps.forEach((st) => st.classList.remove("hidden"));
      else stamps.forEach((st, i) => timers.push(setTimeout(() => st.classList.remove("hidden"), 500 + i * 420)));
      return { update() {}, destroy() { timers.forEach(clearTimeout); } };
    },
  };

  /* ---------- Every audit passed: three checks stamped, two harms ---------- */
  Deck.components.AuditStack = {
    steps: 5,
    mount(host, ctx) {
      const checks = (ctx.fm.check || []).map(split), harms = (ctx.fm.harm || []).map(split);
      const cards = checks.map(([t, d], i) => {
        const c = h("div", { class: "chk show-on off-up", style: `top:${i * 150}px` }, h("div", { class: "chk-n" }, String(i + 1)), h("div", {}, h("div", { class: "chk-t" }, t), h("div", { class: "chk-d" }, d)), stamp("PASS", "pass"));
        host.appendChild(c); return c;
      });
      const hs = harms.map(([y, d], i) => {
        const c = h("div", { class: "harm show-on off-up", style: `top:${i * 150}px` }, h("div", { class: "harm-y" }, y), h("div", { class: "harm-d" }, d));
        host.appendChild(c); return c;
      });
      return { update(k) { cards.forEach((c, i) => on(c, k >= i + 1)); hs.forEach((c, i) => on(c, k >= i + 4)); } };
    },
  };

  /* ---------- Two questions ---------- */
  Deck.components.TwoQuestions = {
    steps: 1,
    mount(host, ctx) {
      const L = split(ctx.fm.left), R = split(ctx.fm.right);
      const mk = (q, cls, x) => {
        const [qq, name, d] = q;
        const el = h("div", { class: "tq " + cls, style: `left:${x}px` }, h("div", { class: "tq-q" }, qq), h("div", { class: "tq-n" }, name), h("div", { class: "tq-d" }, d));
        host.appendChild(el); return el;
      };
      const l = mk(L, "amber", 0), r = mk(R, "teal", 748);
      r.classList.add("show-on");
      return { update(k) { on(r, k >= 1); } };
    },
  };

  /* ---------- Four pillars under a beam ---------- */
  Deck.components.FourPillars = {
    steps: 4,
    mount(host, ctx) {
      const P = (ctx.fm.pillar || []).map(split), E = ctx.fm.example || [];
      const beam = h("div", { class: "beam" }, "Verification");
      host.appendChild(beam);
      const pillars = P.map(([t, d], i) => { const el = h("div", { class: "pillar", style: `left:${40 + i * 350}px` }, h("div", { class: "pl-t" }, t), h("div", { class: "pl-d" }, d)); host.appendChild(el); return el; });
      return { update(k) { pillars.forEach((p, i) => p.classList.toggle("lit", k >= i + 1)); } };
    },
  };

  /* ---------- Annotators: one post, four readings ---------- */
  Deck.components.Annotators = {
    steps: 3,
    mount(host, ctx) {
      const post = h("div", { class: "post show-on off-up" }, h("div", { class: "post-q" }, ctx.fm.post || ""), h("div", { class: "post-m" }, ctx.fm.postmeta || ""));
      host.appendChild(post);
      const readers = (ctx.fm.reader || []).map(split).map(([who, v, why], i) => {
        const el = h("div", { class: "reader show-on off-up", style: `left:${i * 364}px` }, h("div", { class: "rd-who" }, who), h("div", { class: "verdict " + v.toLowerCase() }, v), h("div", { class: "rd-why" }, why));
        host.appendChild(el); return el;
      });
      const gt = h("div", { class: "gt show-on off-up" }, h("span", { class: "gt-k" }, "Ground truth"), h("span", {}, "= whichever of these the labeler happened to be"));
      host.appendChild(gt);
      const defn = h("div", { class: "defn show-on off-up" }, h("div", { class: "defn-t" }, ctx.fm.term || "Epistemic indeterminacy"), h("div", { class: "defn-d" }, ctx.fm.definition || ""));
      host.appendChild(defn);
      return { update(k) { on(post, k >= 1); readers.forEach((r, i) => on(r, k >= 2)); on(gt, k >= 2); on(defn, k >= 3); } };
    },
  };

  /* ---------- Two reflexes ---------- */
  Deck.components.Reflexes = {
    steps: 4,
    mount(host, ctx) {
      const M = split(ctx.fm.measure), W = split(ctx.fm.wait);
      const col = (x, [t, claim, reveal], cls, art) => {
        const el = h("div", { class: "rx show-on off-up " + cls, style: `left:${x}px` }, h("div", { class: "rx-t" }, t), h("div", { class: "rx-claim" }, claim), art, h("div", { class: "rx-reveal show-on off-up" }, reveal));
        host.appendChild(el); return el;
      };
      // art for "measure": a ruler whose ticks are labels
      const ruler = h("div", { class: "ruler" }, h("div", { class: "ruler-lab" }, "yardstick: human labels"), h("div", { class: "ruler-bar" }, ...Array.from({ length: 11 }, (_, i) => h("i", { style: `left:${i * 10}%` }))), h("div", { class: "ruler-obj" }, "LLM errors"));
      // art for "wait": a share bar plus a row of people figures that thins out
      const share = h("div", { class: "share" }, h("div", { class: "share-bar" }, h("div", { class: "share-auto" }, h("span", {}, "automated")), h("div", { class: "share-hum" }, h("span", {}, "human"))), h("div", { class: "share-legend" }, h("span", {}, h("b", {}, "97.4%"), " automated"), h("span", {}, "2.6% reached a person")), h("div", { class: "people" }, ...Array.from({ length: 24 }, () => h("i", {}))));
      const m = col(0, M, "amber", ruler), w = col(748, W, "signal", share);
      return {
        update(k) {
          on(m, k >= 1); on(m.querySelector(".rx-reveal"), k >= 2); ruler.classList.toggle("wobble", k >= 2);
          on(w, k >= 3); on(w.querySelector(".rx-reveal"), k >= 4);
          share.classList.toggle("go", k >= 3); share.classList.toggle("thin", k >= 4);
        },
      };
    },
  };

  /* ---------- Copy-paste ritual ---------- */
  Deck.components.CopyPaste = {
    steps: 4,
    mount(host, ctx) {
      const statute = ctx.fm.statute || "", Q = (ctx.fm.quote || []).map(split);
      const left = h("div", { class: "doc left" }, h("div", { class: "doc-h" }, "Regulation (EU) 2022/2065 · the Digital Services Act"), h("div", { class: "doc-b" }, statute));
      const right = h("div", { class: "doc right" }, h("div", { class: "doc-h" }, "Independent audit report · Audit criteria"), h("div", { class: "doc-b typed" }), stamp("Fully compliant", "pass big hidden"));
      const arrow = h("div", { class: "cp-arrow show-on off-up" }, "copy");
      host.append(left, right, arrow);
      const quotes = Q.map(([q, who], i) => { const el = h("div", { class: "cp-q show-on off-up", style: `left:${i * 492}px` }, h("div", { class: "cp-qt" }, q), h("div", { class: "cp-qw" }, who)); host.appendChild(el); return el; });
      const typed = right.querySelector(".typed");
      const content = h("div", { class: "cp-content" });
      while (host.firstChild) content.appendChild(host.firstChild);
      host.appendChild(content);
      const ov = h("div", { class: "ritual" });
      const frame = svg(1456, 624, ov, { style: "position:absolute;inset:0;overflow:visible" });
      const rect = s("rect", { x: 3, y: 3, width: 1450, height: 618, rx: 14, fill: "none", stroke: C("--amber-d"), "stroke-width": 5 }, frame);
      const RL = 2 * (1450 + 618); rect.style.strokeDasharray = RL; rect.style.strokeDashoffset = RL;
      ov.append(h("div", { class: "ritual-t" }, ctx.fm.ritual || "Ritual of verification"), h("div", { class: "ritual-s" }, ctx.fm.ritualsub || ""));
      host.appendChild(ov);
      let cancel = () => {}, cancel2 = () => {};
      let typedTo = 0;
      return {
        update(k, animate) {
          cancel();
          on(arrow, k >= 1);
          const target = k >= 1 ? statute.length : 0;
          if (!animate || !k || typedTo === target) { typed.textContent = statute.slice(0, target); typedTo = target; }
          else cancel = Deck.tween((t) => { const n = Math.round(Deck.lerp(typedTo, target, t)); typed.textContent = statute.slice(0, n); if (t === 1) typedTo = target; }, 900);
          right.querySelector(".stamp").classList.toggle("hidden", k < 2);
          quotes.forEach((q, i) => on(q, i < 2 ? k >= 3 : k >= 3));
          cancel2();
          content.classList.toggle("blurred", k >= 4);
          ov.classList.toggle("show", k >= 4);
          if (k >= 4) { if (animate) cancel2 = Deck.tween((t) => { rect.style.strokeDashoffset = String(RL * (1 - t)); }, 1100); else rect.style.strokeDashoffset = "0"; }
          else rect.style.strokeDashoffset = String(RL);
        },
        destroy() { cancel(); cancel2(); },
      };
    },
  };

  /* ---------- Object shift: the lens moves from the post to the judgment ---------- */
  Deck.components.ObjectShift = {
    steps: 3,
    mount(host, ctx) {
      const O = split(ctx.fm.output), J = split(ctx.fm.judgment), P = (ctx.fm.part || []).map(split);
      const post = h("div", { class: "os-post" }, h("div", { class: "os-k" }, "The audit object, today"), h("div", { class: "os-t" }, O[0]), h("div", { class: "os-d" }, O[1]));
      const judge = h("div", { class: "os-judge show-on off-up" }, h("div", { class: "os-k" }, "The audit object, proposed"), h("div", { class: "os-t" }, J[0]), h("div", { class: "os-d" }, J[1]));
      const lens = h("div", { class: "lens" });
      const parts = h("div", { class: "os-parts show-on off-up" }, ...P.map(([t, d], i) => h("div", { class: "os-part", style: `--i:${i}` }, h("div", { class: "os-pt" }, t), h("div", { class: "os-pd" }, d))));
      const simon = h("div", { class: "simon show-on off-up" }, h("span", { class: "simon-q" }, ctx.fm.simon || ""), h("span", { class: "simon-w" }, "Herbert Simon, 1996"));
      host.append(post, judge, lens, parts, simon);
      return { update(k) { lens.classList.toggle("moved", k >= 1); post.classList.toggle("dim", k >= 1); on(judge, k >= 1); on(parts, k >= 2); on(simon, k >= 3); } };
    },
  };

  /* ---------- Evidence timeline with a flat line of reliance ---------- */
  Deck.components.EvidenceTimeline = {
    steps: 5,
    mount(host, ctx) {
      const E = (ctx.fm.event || []).map(split), T = (ctx.fm.test || []).map(split);
      const W = 1456;
      const g = svg(W, 400, host, { style: "position:absolute;left:0;top:0;width:1456px;height:400px;overflow:visible" });
      // reliance line
      s("line", { x1: 40, y1: 46, x2: W - 40, y2: 46, stroke: C("--signal"), "stroke-width": 4 }, g);
      s("text", { x: 40, y: 30, class: "lab", text: "RELIANCE ON AUTOMATED DETECTION · FULL SCALE · UNCHANGED", style: "font-size:12px;letter-spacing:.14em;font-weight:500;font-family:var(--font-code);fill:" + C("--signal-d") }, g);
      // axis
      s("line", { x1: 40, y1: 230, x2: W - 40, y2: 230, stroke: C("--rule-2"), "stroke-width": 2 }, g);
      const xs = [220, 560, 900, 1240];
      const cards = E.map(([when, what, text], i) => {
        const x = xs[i];
        s("circle", { cx: x, cy: 230, r: 8, fill: C("--panel"), stroke: C("--teal"), "stroke-width": 3, class: "ev-dot d" + i }, g);
        s("line", { x1: x, y1: 60, x2: x, y2: 222, stroke: C("--teal"), "stroke-width": 2, "stroke-dasharray": "4 6", class: "ev-stem d" + i, opacity: 0 }, g);
        const c = h("div", { class: "evc show-on off-up" + (i === 1 ? " war" : ""), style: `left:${x - 160}px` }, h("div", { class: "evc-w" }, when), h("div", { class: "evc-k" }, what), h("div", { class: "evc-t" }, text));
        host.appendChild(c); return c;
      });
      const tests = h("div", { class: "tests show-on off-up" }, ...T.map(([t, v]) => h("div", { class: "test " + v }, h("i", {}), h("span", {}, t), h("b", {}, v))));
      host.appendChild(tests);
      const stems = g.querySelectorAll(".ev-stem");
      return { update(k) { cards.forEach((c, i) => { on(c, k >= i + 1); stems[i].setAttribute("opacity", k >= i + 1 ? 1 : 0); }); on(tests, k >= 5); } };
    },
  };

  /* ---------- Many hands around an empty center ---------- */
  Deck.components.ManyHands = {
    steps: 4,
    mount(host, ctx) {
      const H = (ctx.fm.hand || []).map(split);
      const cx = 400, cy = 300, r = 232;
      const g = svg(1456, 624, host, { style: "position:absolute;inset:0;overflow:visible" });
      const nodes = H.map(([t, d], i) => {
        const a = -Math.PI / 2 + (i / H.length) * Math.PI * 2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        s("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: C("--rule-2"), "stroke-width": 2, "stroke-dasharray": "3 7" }, g);
        const n = h("div", { class: "hand", style: `left:${x - 120}px;top:${y - 40}px` }, h("div", { class: "hand-t" }, t), h("div", { class: "hand-d show-on off-up" }, d));
        host.appendChild(n); return n;
      });
      const center = h("div", { class: "center show-on off-up", style: `left:${cx - 150}px;top:${cy - 78}px` }, h("div", { class: "center-q" }, "?"), h("div", { class: "center-t" }, ctx.fm.center || ""));
      host.appendChild(center);
      const A = split(ctx.fm.ask), B = split(ctx.fm.answer);
      const ask = h("div", { class: "ask show-on off-up" }, h("div", { class: "ask-w" }, A[0]), h("div", { class: "ask-t" }, A[1]));
      const ans = h("div", { class: "ans show-on off-up" }, h("div", { class: "ask-w" }, B[0]), h("div", { class: "ask-t" }, B[1]));
      host.append(ask, ans);
      return { update(k) { nodes.forEach((n) => { n.classList.toggle("lit", k >= 1); on(n.querySelector(".hand-d"), k >= 1); }); on(center, k >= 2); on(ask, k >= 3); on(ans, k >= 4); } };
    },
  };

  /* ---------- Spike: a threshold set before, levers pulled after ---------- */
  Deck.components.Spike = {
    steps: 4,
    mount(ctx_host, ctx) {
      const host = ctx_host;
      const A = split(ctx.fm.after), B = split(ctx.fm.before);
      const W = 900, Hh = 480;
      const g = svg(W, Hh, host, { style: `position:absolute;left:0;top:20px;width:${W}px;height:${Hh}px;overflow:visible` });
      // axes
      s("line", { x1: 60, y1: 420, x2: W - 20, y2: 420, stroke: C("--rule-2"), "stroke-width": 2 }, g);
      s("line", { x1: 60, y1: 40, x2: 60, y2: 420, stroke: C("--rule-2"), "stroke-width": 2 }, g);
      s("text", { x: 64, y: 448, class: "muted", text: "time, during a conflict", style: "font-size:15px" }, g);
      s("text", { x: 20, y: 36, class: "muted", text: "incitement reaching feeds", style: "font-size:15px" }, g);
      // curve: calm, rise, spike, decay
      const pts = []; for (let i = 0; i <= 100; i++) { const x = 60 + (i / 100) * (W - 100); const t = i / 100; let y = 0.12 + 0.05 * Math.sin(t * 9); if (t > 0.45) y += Math.exp(-Math.pow((t - 0.62) / 0.07, 2)) * 0.78; if (t > 0.62) y += 0.1 * Math.exp(-(t - 0.62) * 6); pts.push([x, 420 - y * 360]); }
      const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
      const curve = s("path", { d, fill: "none", stroke: C("--ink"), "stroke-width": 3.5, class: "curve" }, g);
      const len = curve.getTotalLength ? 2600 : 2600; curve.style.strokeDasharray = len; curve.style.strokeDashoffset = len;
      // levers after the spike
      const levers = s("g", { class: "levers fade", opacity: 0 }, g);
      [0.70, 0.75, 0.80, 0.86].forEach((t, i) => { const x = 60 + t * (W - 100); s("line", { x1: x, y1: 100 + i * 10, x2: x, y2: 420, stroke: C("--signal"), "stroke-width": 3 }, levers); s("rect", { x: x - 7, y: 86 + i * 10, width: 14, height: 14, rx: 3, fill: C("--signal") }, levers); });
      s("text", { x: 60 + 0.70 * (W - 100), y: 72, text: A[0], style: "font-size:17px;font-weight:700;fill:" + C("--signal-d") }, levers);
      // threshold before
      const thr = s("g", { class: "thr fade", opacity: 0 }, g);
      const ty = 420 - 0.38 * 360;
      s("line", { x1: 60, y1: ty, x2: W - 20, y2: ty, stroke: C("--teal"), "stroke-width": 3, "stroke-dasharray": "10 8" }, thr);
      const cross = pts.find((p, i) => i > 45 && p[1] <= ty);
      if (cross) { s("circle", { cx: cross[0], cy: cross[1], r: 11, fill: C("--teal") }, thr); s("line", { x1: cross[0], y1: cross[1], x2: cross[0], y2: 420, stroke: C("--teal"), "stroke-width": 3 }, thr); s("text", { x: cross[0] - 12, y: 440, text: "restrict here", style: "font-size:15px;font-weight:700;fill:" + C("--teal-d") + ";text-anchor:end" }, thr); }
      s("text", { x: 66, y: ty - 10, text: B[0] + " · set before", style: "font-size:17px;font-weight:700;fill:" + C("--teal-d") }, thr);
      // side cards
      const after = h("div", { class: "sp-card signal show-on off-up" }, h("div", { class: "sp-k" }, A[0]), h("div", { class: "sp-d" }, A[1]));
      const before = h("div", { class: "sp-card teal show-on off-up" }, h("div", { class: "sp-k" }, B[0]), h("div", { class: "sp-d" }, B[1]));
      const contrast = h("div", { class: "sp-contrast show-on off-up" }, ctx.fm.contrast || "");
      host.append(after, before, contrast);
      let cancel = () => {};
      return {
        update(k, animate) {
          cancel();
          if (k >= 1) { if (animate && curve.style.strokeDashoffset !== "0") cancel = Deck.tween((t) => { curve.style.strokeDashoffset = String(len * (1 - t)); }, 1400); else curve.style.strokeDashoffset = "0"; }
          else curve.style.strokeDashoffset = String(len);
          levers.setAttribute("opacity", k >= 2 ? 1 : 0); on(after, k >= 2);
          thr.setAttribute("opacity", k >= 3 ? 1 : 0); on(before, k >= 3);
          on(contrast, k >= 4);
        },
        destroy() { cancel(); },
      };
    },
  };

  /* ---------- Arch: three stones, remove one ---------- */
  Deck.components.Arch = {
    steps: 3,
    mount(host, ctx) {
      const S = ctx.fm.stone || ["Evidence", "Actors", "Threshold"];
      const wrap = h("div", { class: "arch show-on off-up" });
      const left = h("div", { class: "stone pier left" }, S[0]), right = h("div", { class: "stone pier right" }, S[1]), key = h("div", { class: "stone key" }, S[2]);
      const beam = h("div", { class: "arch-beam" }, "Justified reliance");
      wrap.append(beam, left, key, right);
      host.appendChild(wrap);
      const note = h("div", { class: "arch-note show-on off-up" }, h("div", {}, h("b", {}, "Incomplete"), " is a different defect from ", h("b", {}, "weak"), "."), h("div", { class: "arch-sub" }, "Non-compensatory. Not a scorecard that sums across dimensions."));
      const note2 = h("div", { class: "arch-note two show-on off-up" }, h("div", {}, h("b", { class: "teal" }, "Defensible"), " does not mean ", h("b", {}, "safe"), "."), h("div", { class: "arch-sub" }, "The finding concerns the decision, on what was knowable when it was made."));
      host.append(note, note2);
      return { update(k) { on(wrap, k >= 1); wrap.classList.toggle("fall", k === 2); on(note, k >= 2); on(note2, k >= 3); } };
    },
  };

  /* ---------- Two audits of one deployment ---------- */
  Deck.components.TwoAudits = {
    steps: 5,
    mount(host, ctx) {
      const V = ctx.fm.vitem || [], D = ctx.fm.ditem || [], R = ctx.fm.require || [];
      const col = (x, title, cls, items, mark) => {
        const el = h("div", { class: "au " + cls, style: `left:${x}px` }, h("div", { class: "au-h" }, title), h("div", { class: "au-items show-on off-up" }, ...items.map((t) => h("div", { class: "au-i" }, h("i", { class: mark }), t))), h("div", { class: "au-stamps" }, stamp(cls === "amber" ? "Conforms" : "Indefensible", (cls === "amber" ? "pass" : "fail") + " hidden"), stamp(cls === "amber" ? "Conforms" : "Indefensible", (cls === "amber" ? "pass" : "fail") + " hidden second")));
        host.appendChild(el); return el;
      };
      const v = col(0, "Verification audit · mid-2020", "amber", V, "ok"), d = col(748, "Defensibility audit · mid-2020", "teal", D, "no");
      const band = h("div", { class: "band-date show-on off-up" }, h("b", {}, "November 2021"), h("span", {}, "A professor is shot outside his home after posts naming him circulated for weeks. Run both audits again."));
      const req = h("div", { class: "require show-on off-up" }, h("div", { class: "req-h" }, "What defensible reliance would have required"), ...R.map((t) => h("div", { class: "req-i" }, h("i", {}), t)));
      host.append(band, req);
      const st = (el, n) => el.querySelectorAll(".stamp")[n];
      return {
        update(k) {
          on(v.querySelector(".au-items"), k >= 1); st(v, 0).classList.toggle("hidden", k < 1);
          on(d.querySelector(".au-items"), k >= 2); st(d, 0).classList.toggle("hidden", k < 2);
          on(band, k >= 3 && k < 5);
          st(v, 1).classList.toggle("hidden", k < 4); st(d, 1).classList.toggle("hidden", k < 4);
          on(req, k >= 5);
        },
      };
    },
  };

  /* ---------- Now: human share falling, risk review automated ---------- */
  Deck.components.NowDial = {
    steps: 3,
    mount(host, ctx) {
      const S = (ctx.fm.stage || []).map(split);
      const rows = S.map(([y, t, pct], i) => {
        const el = h("div", { class: "nd-row" + (i ? " show-on off-up" : ""), style: `top:${i * 118}px;--p:${pct}%` }, h("div", { class: "nd-y" }, y), h("div", {}, h("div", { class: "nd-bar" }, h("div", { class: "nd-llm" }, h("span", {}, "LLM")), h("div", { class: "nd-hum" }, h("span", {}, "human"))), h("div", { class: "nd-t" }, t)));
        host.appendChild(el); return el;
      });
      const risk = h("div", { class: "nd-risk show-on off-up" }, h("div", { class: "nd-rk" }, "And the risk review itself"), h("div", { class: "nd-big" }, "instant decision"), h("div", { class: "nd-rt" }, ctx.fm.risk || ""));
      const prop = h("div", { class: "nd-prop show-on off-up" }, h("b", {}, "Proposition 2."), " As reliability rises, the evidence needed to verify grows and human scrutiny falls, so the justification for reliance needs more support, not less.");
      host.append(risk, prop);
      return { update(k) { rows.forEach((r, i) => { if (i) on(r, k >= 1); r.classList.toggle("go", k >= 1 || i === 0); }); on(risk, k >= 2); on(prop, k >= 3); } };
    },
  };

  /* ---------- Forums and the questions they would need to ask ---------- */
  Deck.components.ForumQuestions = {
    steps: 3,
    mount(host, ctx) {
      const F = (ctx.fm.forum || []).map(split), L = ctx.fm.limit || [];
      const cols = F.map(([name, judges, q], i) => { const el = h("div", { class: "fq", style: `left:${i * 492}px` }, h("div", { class: "fq-n" }, name), h("div", { class: "fq-j show-on off-up" }, h("span", { class: "fq-k" }, "today"), judges), h("div", { class: "fq-q show-on off-up" }, h("span", { class: "fq-k teal" }, "could ask"), q)); host.appendChild(el); return el; });
      const lim = h("div", { class: "limits show-on off-up" }, ...L.map((t) => h("span", {}, t)));
      host.appendChild(lim);
      return { update(k) { cols.forEach((c) => { on(c.querySelector(".fq-j"), k >= 1); on(c.querySelector(".fq-q"), k >= 2); }); on(lim, k >= 3); } };
    },
  };

  /* ---------- Close ---------- */
  Deck.components.Close = {
    steps(fm) { return fm.line3 ? 2 : fm.line2 ? 1 : 0; },
    mount(host, ctx) {
      const l1 = h("div", { class: "cl-1" }, ctx.fm.line1 || ""), l2 = h("div", { class: "cl-2 show-on off-up" }, ctx.fm.line2 || ""), l3 = h("div", { class: "cl-3 show-on off-up" }, ctx.fm.line3 || "");
      const meta = h("div", { class: "cl-meta", html: inline(ctx.fm.meta || "") });
      host.append(l1, l2, l3, meta);
      return { update(k) { on(l2, k >= 1 && !!ctx.fm.line2); on(l3, k >= 2 && !!ctx.fm.line3); } };
    },
  };
})();
