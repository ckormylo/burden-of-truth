/* Components for the frontier-map deck. Each exports { steps, mount(host, ctx) -> { update(click, animate), destroy } }.
   FactsLinks  : the background slide (six facts, four links).
   Proposition : a proposition slide. Draws the tracker, the formal wording and the grounding, plus one figure
                 ("stage:" picks it). p1 to p3 are their own figures; p4 to p7 each add to the map.
   FrontierMap : the map without a proposition (stage: setup, read).
   Every stage is a pure function render(k, p): k is the click, p in 0..1 is progress of the move into click k.
   That keeps back, skip, print and the presenter preview exact: they all call render(k, 1).
   All words come from slides.md (the slide's own keys, or the shared "layout: data" block). */
(function () {
  "use strict";
  const { h, s } = Deck;
  const split = (line) => String(line == null ? "" : line).split("|").map((x) => x.trim());
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const E = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const pop = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  /* progress of something that happens during click `step`, between fractions a and b of that click's move */
  const prog = (k, p, step, a, b) => (k > step ? 1 : k < step ? 0 : E(seg(p, a == null ? 0 : a, b == null ? 1 : b)));
  const lin = (k, p, step, a, b) => (k > step ? 1 : k < step ? 0 : seg(p, a == null ? 0 : a, b == null ? 1 : b));
  const T = (fm, key, dflt) => (fm[key] != null ? fm[key] : (Deck.shared || {})[key] != null ? Deck.shared[key] : dflt);
  const op = (el, o) => { el.style.opacity = o; };
  const txt = (p, x, y, str, cls, anchor) => s("text", { x, y, class: "fm-t " + (cls || ""), "text-anchor": anchor || "start", text: str }, p);
  const dot = (p, x, y, cls, r) => s("circle", { cx: x, cy: y, r: r || 10, class: "fm-dot " + (cls || "") }, p);
  const cls = (el, c) => el.setAttribute("class", c);

  function runner(render, durs, ctx) {
    let cancel = null;
    return {
      update(k, animate) {
        if (cancel) { cancel(); cancel = null; }
        const ms = (durs && durs[k]) || 900;
        if (!animate || ctx.print || ctx.preview || Deck.reduced || k === 0) { render(k, 1); return; }
        let raf, dead = false;
        const t0 = performance.now();
        const step = (now) => {
          if (dead) return;
          const t = Math.min(1, (now - t0) / ms);
          render(k, t);
          if (t < 1) raf = requestAnimationFrame(step);
        };
        render(k, 0);
        raf = requestAnimationFrame(step);
        cancel = () => { dead = true; cancelAnimationFrame(raf); };
      },
      destroy() { if (cancel) cancel(); },
    };
  }

  function arrow(p, c) {
    const g = s("g", { class: "fm-arrow " + (c || "") }, p), ln = s("line", {}, g), hd = s("path", {}, g);
    g.set = (x1, y1, x2, y2) => {
      ln.setAttribute("x1", x1); ln.setAttribute("y1", y1); ln.setAttribute("x2", x2); ln.setAttribute("y2", y2);
      const a = Math.atan2(y2 - y1, x2 - x1), L = 12, w = 0.5;
      hd.setAttribute("d", `M${x2 - L * Math.cos(a - w)} ${y2 - L * Math.sin(a - w)}L${x2} ${y2}L${x2 - L * Math.cos(a + w)} ${y2 - L * Math.sin(a + w)}`);
    };
    return g;
  }
  function stamp(p, x, y, label, w, hh, tcls) {
    w = w || 84; hh = hh || 34;
    const g = s("g", { class: "fm-stamp" }, p);
    s("rect", { x: -w / 2, y: -hh / 2, width: w, height: hh, rx: 5 }, g);
    txt(g, 0, hh > 40 ? 12 : 7, label, tcls || "fm-stamp-t", "middle");
    g.set = (o, sc, xx, yy) => { g.style.opacity = o; g.setAttribute("transform", `translate(${xx == null ? x : xx} ${yy == null ? y : yy}) rotate(-6) scale(${sc == null ? 1 : sc})`); };
    g.set(0, 1);
    return g;
  }

  /* ================================================================ the map's geometry (viewBox 1010 x 624) */
  const G = { x0: 90, x1: 960, yA: 540, yT: 40, flat: 330, ceil: 150 };
  const cx = (t) => 90 + 660 * t + 210 * t * t;          // the defensibility bar is a quadratic curve,
  const cy = (t) => 520 - 440 * t + 30 * t * t;          // schematic: only its direction is claimed
  const tOfX = (x) => (-660 + Math.sqrt(660 * 660 + 840 * (x - 90))) / 420;
  const ss = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
  const dropAt = (t, drop) => (drop || 0) * ss(t / 0.8);   // a lowered bar still starts at the origin
  const yBar = (x, drop) => { const t = tOfX(x); return cy(t) + dropAt(t, drop); };
  const TC = (440 - Math.sqrt(440 * 440 - 4 * 30 * 190)) / 60, XC = cx(TC);   // where the two bars cross
  function barPath(a, drop) {
    let d = "";
    for (let i = 0; i <= 60; i++) {
      const t = i / 60, y = lerp(G.flat, cy(t), a) + dropAt(t, drop) * a;
      d += (i ? "L" : "M") + cx(t).toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  }
  function regionPaths(drop) {
    const fa = [], nr = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120, x = cx(t), y = cy(t) + dropAt(t, drop);
      (y <= G.flat ? fa : nr).push(x.toFixed(1) + " " + y.toFixed(1));
    }
    const fx = fa.length ? fa[0].split(" ")[0] : G.x1, nx = nr.length ? nr[nr.length - 1].split(" ")[0] : G.x0;
    return {
      fa: fa.length ? "M" + fa.join("L") + `L${G.x1} ${G.flat}L${fx} ${G.flat}Z` : "",
      nr: nr.length ? `M${G.x0} ${G.flat}L${nx} ${G.flat}L` + nr.slice().reverse().join("L") + "Z" : "",
    };
  }

  function base(svgEl, fm) {
    const L = (k, d) => T(fm, "map." + k, d);
    const defs = s("defs", {}, svgEl);
    const pat = s("pattern", { id: "fm-hatch", width: 12, height: 12, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
    s("line", { x1: 0, y1: 0, x2: 0, y2: 12, class: "fm-hatchline" }, pat);
    const gReg = s("g", {}, svgEl), gAx = s("g", {}, svgEl), gBars = s("g", {}, svgEl), layer = s("g", {}, svgEl), gLab = s("g", {}, svgEl), top = s("g", {}, svgEl);

    const fa = s("path", { class: "fm-reg fa" }, gReg), nr = s("path", { class: "fm-reg nr" }, gReg);
    const hatch = s("rect", { x: G.x0, y: G.yT, width: G.x1 - G.x0, height: 1, fill: "url(#fm-hatch)" }, gReg);

    const ax = arrow(gAx, "axis"), ay = arrow(gAx, "axis");
    ax.set(G.x0, G.yA, G.x1 + 14, G.yA); ay.set(G.x0, G.yA, G.x0, G.yT - 14);
    txt(gAx, G.x0 + 16, 31, L("y", "Warrant"), "fm-axis");
    txt(gAx, G.x0 + 16 + String(L("y", "Warrant")).length * 11.5 + 14, 31, L("ysub", ""), "fm-axis-sub");
    txt(gAx, G.x1, 574, L("x", "Stakes"), "fm-axis", "end");
    txt(gAx, G.x1 - String(L("x", "Stakes")).length * 11.5 - 14, 574, L("xsub", ""), "fm-axis-sub", "end");

    const ghost = s("path", { class: "fm-curve ghost", d: barPath(1, 0) }, gBars);
    const ceilLine = s("line", { x1: G.x0, x2: G.x1, class: "fm-ceil" }, gBars);
    const flatLine = s("line", { x1: G.x0, y1: G.flat, y2: G.flat, class: "fm-flat" }, gBars);
    const curve = s("path", { class: "fm-curve" }, gBars);
    const cross = s("circle", { cx: XC, cy: G.flat, r: 9, class: "fm-cross" }, gBars);

    const ceilLab = txt(gLab, G.x0 + 10, G.ceil - 10, L("ceiling", ""), "fm-mono slate halo");
    const flatLab = txt(gLab, G.x1 - 4, G.flat + 22, L("flat", ""), "fm-mono amber halo", "end");
    const curveLab = txt(gLab, G.x1 - 4, 92, L("curve", ""), "fm-mono teal halo", "end");
    const crossLab = txt(gLab, XC - 14, G.flat - 12, L("cross", ""), "fm-mono halo", "end");
    const faL = s("g", {}, gLab), nrL = s("g", {}, gLab), quiet = s("g", {}, gLab);
    const F = split(L("fa", "")), N = split(L("nr", ""));
    txt(faL, 812, 250, F[0] || "", "fm-reg-t coral halo", "middle"); txt(faL, 812, 272, F[1] || "", "fm-mono halo", "middle"); txt(faL, 812, 289, F[2] || "", "fm-mono halo", "middle");
    txt(nrL, 104, 366, N[0] || "", "fm-reg-t amber halo"); txt(nrL, 104, 386, N[1] || "", "fm-mono halo"); txt(nrL, 104, 403, N[2] || "", "fm-mono halo");
    txt(quiet, 110, 232, L("accept", ""), "fm-quiet halo"); txt(quiet, 700, 484, L("reject", ""), "fm-quiet halo");

    const api = {
      svg: svgEl, layer, top, labels: gLab,
      flat(o, frac, lo) { op(flatLine, o); flatLine.setAttribute("x2", lerp(G.x0, G.x1, frac == null ? 1 : frac)); op(flatLab, lo == null ? o : lo); },
      ceil(y, o, ho, lo) {
        ceilLine.setAttribute("y1", y); ceilLine.setAttribute("y2", y); op(ceilLine, o);
        hatch.setAttribute("height", Math.max(1, y - G.yT)); op(hatch, ho == null ? o * 0.6 : ho);
        ceilLab.setAttribute("y", y - 10); op(ceilLab, lo == null ? o : lo);
      },
      curve(a, drop, o, lo) { curve.setAttribute("d", barPath(a, drop)); op(curve, o); op(curveLab, lo == null ? o : lo); },
      ghost(o) { op(ghost, o); },
      regions(ofa, onr, ol, drop, oq) {
        const r = regionPaths(drop || 0);
        fa.setAttribute("d", r.fa); nr.setAttribute("d", r.nr);
        op(fa, ofa); op(nr, onr); op(faL, ol); op(nrL, ol); op(quiet, oq || 0);
      },
      cross(o, lo) { op(cross, o); op(crossLab, lo == null ? o : lo); },
      crossEl: cross,
    };
    api.flat(0, 1); api.ceil(G.ceil, 0); api.curve(1, 0, 0); api.ghost(0); api.regions(0, 0, 0, 0, 0); api.cross(0);
    return api;
  }

  /* ================================================================ the eight builds */
  const STAGES = {};

  /* SETUP · the map itself: points, the verification bar, the limit of testing */
  STAGES.setup = {
    steps: 3, durs: [0, 1400, 1500, 2000],
    build(B, fm, sideEl) {
      const pts = [[170, 470], [260, 250], [340, 400], [450, 90], [540, 290], [640, 440], [720, 70], [800, 230], [890, 400]];
      const dots = pts.map(([x, y]) => dot(B.layer, x, y, ""));
      const legs = [].slice.call(sideEl.querySelectorAll(".fm-leg"));
      return (k, p) => {
        const draw = prog(k, p, 2, 0, 0.65), judged = lin(k, p, 2, 0.55, 1) > 0, lab = prog(k, p, 2, 0.6, 1);
        const c = prog(k, p, 3, 0, 0.75), cy1 = lerp(G.yT, G.ceil, c);
        B.flat(k >= 2 ? 1 : 0, draw, lab);
        B.ceil(cy1, k >= 3 ? 1 : 0, 0.6 * (k >= 3 ? 1 : 0), prog(k, p, 3, 0.7, 1));
        dots.forEach((d, i) => {
          const y0 = pts[i][1], y = k >= 3 ? Math.max(y0, cy1 + 20) : y0;
          d.setAttribute("cy", y);
          op(d, prog(k, p, 1, i * 0.07, i * 0.07 + 0.3));
          cls(d, "fm-dot " + (judged ? (y < G.flat ? "gold" : "mute") : ""));
        });
        legs.forEach((l, i) => l.classList.toggle("on", k >= i + 1));
      };
    },
  };

  /* ================================================================ Part 1 figures (viewBox 952 x 588), off the map */
  const FIGS = {};

  /* P1 · the answer key splits (criterial); the inputs outgrow the tests (coverage) */
  FIGS.p1 = {
    steps: 2, durs: [0, 2200, 2800],
    build(svgEl, fm) {
      const g = (p) => s("g", {}, p || svgEl);
      const C = split(fm.crit), V = split(fm.cov), K = split(fm.keys);
      txt(svgEl, 0, 20, C[0] || "", "fm-mono amber"); txt(svgEl, 0, 46, C[1] || "", "fg-sub");
      txt(svgEl, 520, 20, V[0] || "", "fm-mono amber"); txt(svgEl, 520, 46, V[1] || "", "fg-sub");
      const oy = [80, 150, 220, 290, 360], tgt = [112, 112, 242, 372, 372], KX = 262, KW = 190, MX = 178;
      const lines = oy.map((y) => s("line", { x1: 124, y1: y + 22, x2: KX, y2: 242, class: "fg-line" }, svgEl));
      oy.forEach((y) => {
        s("rect", { x: 0, y, width: 124, height: 44, rx: 6, class: "fg-out" }, svgEl);
        s("line", { x1: 14, x2: 98, y1: y + 17, y2: y + 17, class: "fg-ink" }, svgEl);
        s("line", { x1: 14, x2: 70, y1: y + 28, y2: y + 28, class: "fg-ink" }, svgEl);
      });
      const keys = [0, 1, 2].map((i) => {
        const k = g(), r = s("rect", { x: KX, y: 212, width: KW, height: 60, rx: 8, class: "fg-key" }, k), t = txt(k, KX + KW / 2, 248, K[i + 1] || "", "fg-key-t", "middle");
        return { k, r, t };
      });
      const one = txt(svgEl, KX + KW / 2, 248, K[0] || "", "fg-key-t", "middle");
      const marks = oy.map(() => {
        const m = g(), ok = g(m), q = g(m);
        s("circle", { cx: MX, cy: 0, r: 13, class: "fg-ok" }, ok); s("path", { d: `M${MX - 6} 0 l4 5 l8 -10`, class: "fg-okt" }, ok);
        s("circle", { cx: MX, cy: 0, r: 13, class: "fg-q" }, q); txt(q, MX, 6, "?", "fg-qt", "middle");
        return { m, ok, q };
      });
      const CX = 736, CY = 268, SP = 30, dots = [];
      const tested = s("rect", { x: CX - 3 * SP - 15, y: CY - 2 * SP - 15, width: 6 * SP, height: 5 * SP, rx: 10, class: "fg-tested" }, svgEl);
      txt(svgEl, CX - 3 * SP - 15, CY - 2 * SP - 24, fm.tested || "", "fm-mono amber halo");
      for (let r = -6; r <= 6; r++) for (let c = -7; c <= 7; c++) {
        const inner = Math.abs(r) <= 2 && c >= -3 && c <= 2;
        if (r === -3 && c >= -3 && c <= -1) continue;
        const d = s("circle", { cx: CX + c * SP, cy: CY + r * SP, r: 4.5, class: "fg-in" + (inner ? " t" : "") }, svgEl);
        d.inner = inner; d.dist = Math.hypot(r, c + 0.5) / 9.5;
        dots.push(d);
      }
      const asked = txt(svgEl, CX + 7 * SP + 6, CY + 6 * SP + 34, fm.asked || "", "fm-mono halo", "end");
      txt(svgEl, 0, 532, fm.meter || "", "fm-mono");
      s("rect", { x: 0, y: 544, width: 952, height: 22, rx: 11, class: "fg-track" }, svgEl);
      const fill = s("rect", { x: 0, y: 544, width: 952, height: 22, rx: 11, class: "fg-fill" }, svgEl);
      return (k, p) => {
        const a = prog(k, p, 1, 0, 0.6), m = prog(k, p, 1, 0.45, 0.85), b = prog(k, p, 2, 0, 1);
        keys.forEach(({ k: kg, r, t }, i) => {
          const y = lerp(212, [82, 212, 342][i], a);
          r.setAttribute("y", y); t.setAttribute("y", y + 36);
          op(kg, i === 1 ? 1 : a); op(t, i === 1 ? m : a);
        });
        op(one, 1 - m);
        oy.forEach((y, i) => {
          const ey = lerp(242, tgt[i], a);
          lines[i].setAttribute("y2", ey);
          marks[i].m.setAttribute("transform", `translate(0 ${lerp(y + 22, ey, (MX - 124) / (KX - 124))})`);
          op(marks[i].ok, 1 - m); op(marks[i].q, m);
        });
        dots.forEach((d) => { if (!d.inner) op(d, prog(k, p, 2, d.dist * 0.7, d.dist * 0.7 + 0.25)); });
        op(asked, prog(k, p, 2, 0.75, 1));
        fill.setAttribute("width", lerp(lerp(952, 500, prog(k, p, 1, 0.3, 1)), 120, b));
      };
    },
  };

  /* P2 · each tenfold gain in reliability takes ten times the evidence, while fewer people check */
  FIGS.p2 = {
    steps: 2, durs: [0, 3600, 2600],
    build(svgEl, fm) {
      const rungs = (fm.rung || []).map(split), ys = [156, 252, 348, 444], lens = [12, 38, 120, 380], keep = [8, 5, 3, 1];
      txt(svgEl, 0, 84, fm.col_rate || "", "fm-mono"); txt(svgEl, 210, 84, fm.col_cases || "", "fm-mono");
      const wh = txt(svgEl, 712, 84, fm.col_watch || "", "fm-mono");
      s("line", { x1: 0, x2: 952, y1: 100, y2: 100, class: "fg-rule" }, svgEl);
      const rows = rungs.map(([rate, n], i) => {
        const g = s("g", {}, svgEl);
        txt(g, 0, ys[i] + 10, rate, "fg-big");
        const bar = s("rect", { x: 210, y: ys[i] - 15, height: 30, width: 1, rx: 4, class: "fm-cost" }, g);
        const num = txt(g, 222, ys[i] + 8, n, "fg-num");
        if (i) s("line", { x1: 0, x2: 952, y1: ys[i] - 48, y2: ys[i] - 48, class: "fg-rule soft" }, g);
        const people = [];
        for (let j = 0; j < 8; j++) {
          const pg = s("g", { transform: `translate(${722 + j * 29} ${ys[i] - 12})`, class: "fm-person" }, svgEl);
          s("circle", { cx: 0, cy: 0, r: 6 }, pg); s("path", { d: "M-9 22 Q-9 9 0 9 Q9 9 9 22 Z" }, pg);
          people.push(pg);
        }
        return { g, bar, num, len: lens[i], people };
      });
      return (k, p) => {
        rows.forEach((r, i) => {
          const show = prog(k, p, 1, i * 0.22, i * 0.22 + 0.12), grow = prog(k, p, 1, i * 0.22 + 0.05, i * 0.22 + 0.3);
          op(r.g, show);
          r.bar.setAttribute("width", Math.max(1, r.len * grow)); r.num.setAttribute("x", 222 + r.len * grow);
          r.people.forEach((pg, j) => {
            const here = prog(k, p, 2, 0, 0.15), gone = j >= keep[i] ? prog(k, p, 2, 0.2 + i * 0.16 + (j - keep[i]) * 0.03, 0.4 + i * 0.16 + (j - keep[i]) * 0.03) : 0;
            op(pg, here * lerp(1, 0.13, gone));
          });
        });
        op(wh, prog(k, p, 2, 0, 0.15));
      };
    },
  };

  /* P3 · the question cannot be verified, so the audit verifies documents instead; it passes, decoupled */
  FIGS.p3 = {
    steps: 2, durs: [0, 3000, 2200],
    build(svgEl, fm) {
      const g = (p) => s("g", {}, p || svgEl);
      const docs = fm.doc || [], W = 200, H = 168, xs = [16, 250, 484, 718], Y = 244;
      const q = g();
      s("rect", { x: 156, y: 6, width: 640, height: 118, rx: 12, class: "fg-qcard" }, q);
      txt(q, 476, 54, fm.question || "", "fg-qtext", "middle");
      const chip = (label, c) => { const cg = g(q); s("rect", { x: 346, y: 74, width: 260, height: 32, rx: 16, class: "fg-chip " + c }, cg); txt(cg, 476, 95, label, "fm-mono " + c, "middle"); return cg; };
      const chipA = chip(fm.blocked || "", "coral"), chipB = chip(fm.still || "", "coral solid");
      const conn = arrow(svgEl, "conn"); conn.set(476, 132, 476, 226);
      const instead = txt(svgEl, 524, 184, fm.instead || "", "fm-mono amber");
      const brk = g();
      s("path", { d: "M452 170 L500 190 M452 180 L500 200", class: "fg-break" }, brk);
      txt(brk, 436, 191, fm.decoupled || "", "fm-mono coral", "end");
      const cards = xs.map((x, i) => {
        const c = g(), inner = g(c);
        s("path", { d: `M0 8 Q0 0 8 0 H${W - 34} L${W} 34 V${H - 8} Q${W} ${H} ${W - 8} ${H} H8 Q0 ${H} 0 ${H - 8} Z`, class: "fg-doc" }, inner);
        s("path", { d: `M${W - 34} 0 V26 Q${W - 34} 34 ${W - 26} 34 H${W}`, class: "fg-fold" }, inner);
        [34, 54, 74, 94].forEach((yy, j) => s("line", { x1: 22, x2: j === 3 ? 110 : W - 50, y1: yy, y2: yy, class: "fg-ink" }, inner));
        txt(inner, W / 2, H - 22, docs[i] || "", "fg-doc-t", "middle");
        const ck = g(c);
        s("circle", { cx: 0, cy: 0, r: 19, class: "fg-ok" }, ck); s("path", { d: "M-8 0 l6 7 l11 -14", class: "fg-okt big" }, ck);
        return { c, inner, ck, x };
      });
      const under = txt(svgEl, 476, Y + H + 40, fm.checked || "", "fm-mono amber", "middle");
      const pass = stamp(svgEl, 476, Y + 60, fm.pass || "", 330, 64, "fm-stamp-t big");
      return (k, p) => {
        const dec = prog(k, p, 2, 0.45, 0.75);
        op(conn, prog(k, p, 1, 0, 0.14) * lerp(1, 0.25, dec)); op(instead, prog(k, p, 1, 0.06, 0.2) * lerp(1, 0.35, dec));
        cards.forEach(({ c, ck, x }, i) => {
          const a = prog(k, p, 1, 0.15 + i * 0.17, 0.35 + i * 0.17), t = lin(k, p, 1, 0.32 + i * 0.17, 0.46 + i * 0.17);
          op(c, a); c.setAttribute("transform", `translate(${x} ${Y + lerp(18, 0, a)})`);
          op(ck, t > 0 ? 1 : 0); ck.setAttribute("transform", `translate(${W - 6} 6) scale(${t > 0 ? lerp(2.2, 1, pop(t)) : 1})`);
        });
        op(under, prog(k, p, 1, 0.85, 1));
        const st = lin(k, p, 2, 0, 0.3);
        pass.set(st > 0 ? Math.min(1, st * 3) : 0, lerp(2, 1, st > 0 ? pop(st) : 0));
        op(brk, dec);
        const sw = prog(k, p, 2, 0.65, 0.95);
        op(chipA, 1 - sw); op(chipB, sw);
      };
    },
  };

  /* P4 · same evidence, three tasks: each point sinks to what the evidence establishes there */
  STAGES.p4 = {
    steps: 2, durs: [0, 1300, 2200],
    build(B, fm) {
      const xs = [330, 500, 670], Y = 250, truth = [250, 352, 470], uses = fm.use || [];
      const guide = s("line", { x1: xs[0] - 14, x2: xs[2] + 14, y1: Y, y2: Y, class: "fm-guide" }, B.layer);
      const tethers = xs.map((x) => s("line", { x1: x, x2: x, y1: Y, y2: Y, class: "fm-tether teal" }, B.layer));
      const ghosts = xs.map((x) => dot(B.layer, x, Y, "ghost"));
      const dots = xs.map((x) => dot(B.layer, x, Y, "gold"));
      const names = xs.map((x, i) => txt(B.labels, x, Y - 30, uses[i] || "", "fm-name halo", "middle"));
      const l1 = txt(B.labels, xs[0] - 26, Y + 5, fm.credited || "", "fm-mono amber halo", "end");
      const l2 = txt(B.labels, xs[2] + 22, truth[2] + 5, fm.true || "", "fm-mono teal halo");
      return (k, p) => {
        B.flat(1, 1, 1); B.ceil(G.ceil, 0.5, 0.3, 0.5);
        xs.forEach((x, i) => {
          const a = prog(k, p, 1, i * 0.2, 0.5 + i * 0.2), d = prog(k, p, 2, 0.1 + i * 0.12, 0.7 + i * 0.12), y = lerp(Y, truth[i], d);
          op(dots[i], a); op(names[i], a);
          dots[i].setAttribute("cy", y); tethers[i].setAttribute("y2", y);
          op(ghosts[i], k >= 2 ? 1 : 0);
          cls(dots[i], "fm-dot " + (lin(k, p, 2, 0.1, 0.2) > 0 ? "teal" : "gold"));
        });
        op(guide, prog(k, p, 1, 0.6, 1)); op(l1, prog(k, p, 1, 0.7, 1)); op(l2, prog(k, p, 2, 0.8, 1));
      };
    },
  };

  /* P5 · the fixed bar pivots into a bar that rises with stakes; four regions */
  STAGES.p5 = {
    steps: 2, durs: [0, 2200, 1600],
    build(B) {
      const pts = [[150, 440, "gold"], [300, 250, "teal"], [560, 300, "coral"], [920, 206, "coral"], [820, 440, "mute"], [660, 190, "teal"]];
      const dots = pts.map(([x, y]) => dot(B.layer, x, y, ""));
      const ring = s("circle", { cx: XC, cy: G.flat, r: 9, class: "fm-pulse" }, B.layer);
      return (k, p) => {
        const a = prog(k, p, 1, 0.12, 0.9), r = prog(k, p, 2, 0, 0.6);
        B.flat(1, 1, 1); B.ceil(G.ceil, 0.5, 0.3, 0.5);
        B.curve(a, 0, k >= 1 ? 1 : 0, prog(k, p, 1, 0.85, 1));
        B.cross(k >= 1 ? 1 : 0, prog(k, p, 1, 0.75, 1));
        const pu = lin(k, p, 1, 0, 0.35);
        ring.setAttribute("r", lerp(9, 40, pu)); op(ring, k === 1 && pu < 1 ? 1 - pu : 0);
        B.regions(r, r, prog(k, p, 2, 0.35, 0.9), 0, prog(k, p, 2, 0.6, 1));
        dots.forEach((d, i) => cls(d, "fm-dot " + (lin(k, p, 2, 0.3 + i * 0.05, 0.35 + i * 0.05) > 0 ? pts[i][2] : "")));
      };
    },
  };

  /* P6 · a control on file moves nothing; a control that would catch a failure lowers the bar */
  STAGES.p6 = {
    steps: 2, durs: [0, 1400, 2400],
    build(B, fm) {
      const X = 700, Y = 290, DROP = 100;
      const d = dot(B.layer, X, Y, "coral", 11);
      const chip = (y, label, c) => {
        const g = s("g", { class: "fm-chip " + c, transform: `translate(560 ${y})` }, B.top);
        s("rect", { x: 0, y: 0, width: 384, height: 46, rx: 8, class: "bg" }, g);
        s("rect", { x: 14, y: 12, width: 22, height: 22, rx: 4, class: "box" }, g);
        const tick = s("path", { d: "M19 23 L24 29 L33 16", class: "tick" }, g);
        txt(g, 50, 30, label, "fm-chip-t");
        return { g, tick };
      };
      const c1 = chip(408, fm.ctl_exists || "", "amber"), c2 = chip(466, fm.ctl_works || "", "teal");
      const arrows = [600, 780].map((x) => { const a = arrow(B.layer, "teal"); a.x = x; return a; });
      return (k, p) => {
        const t1 = prog(k, p, 1, 0, 0.35), sh = k === 1 ? Math.sin(seg(p, 0.3, 1) * Math.PI * 5) * 7 * (1 - seg(p, 0.3, 1)) : 0;
        const t2 = prog(k, p, 2, 0, 0.22), dr = prog(k, p, 2, 0.2, 0.9) * DROP;
        B.flat(0.55, 1, 0.55); B.ceil(G.ceil, 0.5, 0.3, 0.5); B.cross(0.6, 0);
        B.curve(1, dr + sh, 1, 1); B.ghost(k >= 2 ? 0.55 : 0);
        B.regions(0.8, 0, 0, dr + sh, 0);
        c1.tick.style.strokeDashoffset = 30 * (1 - t1); c2.tick.style.strokeDashoffset = 30 * (1 - t2);
        cls(c1.g, "fm-chip amber" + (t1 > 0 ? " on" : "")); cls(c2.g, "fm-chip teal" + (t2 > 0 ? " on" : ""));
        cls(d, "fm-dot " + (yBar(X, dr) > Y + 4 ? "teal" : "coral"));
        arrows.forEach((a) => { const y0 = yBar(a.x, 0); a.set(a.x, y0 + 8, a.x, Math.max(y0 + 22, yBar(a.x, dr) - 8)); op(a, k >= 2 ? clamp(dr / 40) : 0); });
      };
    },
  };

  /* P7 · a forum outside the map asks the three link questions; an owner can answer, a record cannot */
  STAGES.p7 = {
    steps: 2, durs: [0, 2600, 3000],
    build(B, fm, sideEl) {
      const A = { x: 700, y: 172 }, R = { x: 360, y: 250 }, EX = 1012;
      const rows = [].slice.call(sideEl.querySelectorAll(".fm-fp-r")), panel = sideEl.querySelector(".fm-fp");
      const band = s("line", { x1: R.x, x2: R.x, y1: 66, y2: 528, class: "fm-unknown" }, B.layer);
      const q1 = s("line", { class: "fm-ask" }, B.layer), q2 = s("line", { class: "fm-ask" }, B.layer);
      const from = [[EX, 118], [EX, 182]], to = [[A.x + 14, A.y + 3], [R.x + 14, R.y + 2]];
      [q1, q2].forEach((q, i) => { q.setAttribute("x1", from[i][0]); q.setAttribute("y1", from[i][1]); });
      const ring = s("circle", { cx: A.x, cy: A.y, r: 10, class: "fm-hold" }, B.layer);
      dot(B.layer, A.x, A.y, "teal", 11);
      s("path", { d: `M${A.x} ${A.y - 12} v-30 l22 8 l-22 8`, class: "fm-flag" }, B.layer);
      const rec = dot(B.layer, R.x, R.y, "gold", 11), recQ = s("g", {}, B.layer);
      s("circle", { cx: R.x, cy: R.y, r: 15, class: "fm-dot hollow q" }, recQ); txt(recQ, R.x, R.y + 7, "?", "fm-recq", "middle");
      const st = stamp(B.top, R.x + 74, R.y - 26, T(fm, "stamp", ""), 112, 34);
      const bub = [0, 1].map(() => { const g = s("g", { class: "fm-bub" }, B.top); s("circle", { r: 17 }, g); txt(g, 0, 7, "?", "fm-bub-t", "middle"); return g; });
      txt(B.labels, A.x - 32, A.y - 4, fm.owned || "", "fm-mono teal halo", "end");
      const lh = txt(B.labels, A.x - 32, A.y + 15, fm.holds || "", "fm-mono teal halo", "end");
      txt(B.labels, R.x - 26, R.y + 5, fm.unowned || "", "fm-mono amber halo", "end");
      const lu = txt(B.labels, R.x - 26, R.y + 24, fm.unknown || "", "fm-mono coral halo", "end");
      return (k, p) => {
        B.flat(1, 1, 1); B.ceil(G.ceil, 0.4, 0, 0); B.curve(1, 0, 1, 1); B.cross(0.6, 0);
        if (panel) panel.classList.toggle("on", k >= 1);
        rows.forEach((r, i) => {
          op(r, prog(k, p, 1, 0.1 + i * 0.22, 0.3 + i * 0.22));
          const y = r.querySelector(".yes"), n = r.querySelector(".no");
          const ty = lin(k, p, 2, i * 0.12, i * 0.12 + 0.12), tn = lin(k, p, 2, 0.42 + i * 0.1, 0.54 + i * 0.1);
          y.style.opacity = ty > 0 ? 1 : 0; y.style.transform = `scale(${ty > 0 ? lerp(2, 1, pop(ty)) : 1})`;
          n.style.opacity = tn > 0 ? 1 : 0; n.style.transform = `scale(${tn > 0 ? lerp(2, 1, pop(tn)) : 1})`;
        });
        [q1, q2].forEach((q, i) => {
          const t = prog(k, p, 1, 0.3 + i * 0.12, 0.85 + i * 0.12);
          const x = lerp(from[i][0], to[i][0], t), y = lerp(from[i][1], to[i][1], t);
          q.setAttribute("x2", x); q.setAttribute("y2", y);
          op(q, k >= 1 ? lerp(1, 0.4, prog(k, p, 2, 0.7, 1)) : 0);
          bub[i].setAttribute("transform", `translate(${x} ${y})`);
          op(bub[i], k === 1 && t > 0 ? 1 : k >= 2 ? 1 - prog(k, p, 2, 0, 0.15) : 0);
        });
        const hold = prog(k, p, 2, 0.3, 0.6), lost = prog(k, p, 2, 0.7, 1);
        ring.setAttribute("r", lerp(10, 24, hold)); op(ring, hold); op(lh, hold);
        op(rec, 1 - lost); op(recQ, lost); op(band, lost); op(lu, lost);
        st.set(1 - lost);
      };
    },
  };

  /* READ · the finished map and three questions */
  STAGES.read = {
    steps: 3, durs: [0, 1400, 1400, 2200],
    build(B, fm, sideEl) {
      const cards = [].slice.call(sideEl.querySelectorAll(".fm-q"));
      const ring = s("circle", { cx: XC, cy: G.flat, r: 9, class: "fm-pulse" }, B.layer);
      const D = { x: 600, y: 305 }, DROP = 90;
      const low = s("path", { class: "fm-curve low", d: barPath(1, DROP) }, B.layer);
      const up = arrow(B.layer, "fix"), left = arrow(B.layer, "fix"), down = arrow(B.layer, "fix");
      const d = dot(B.layer, D.x, D.y, "coral", 11);
      return (k, p) => {
        B.flat(1, 1, 1); B.ceil(G.ceil, 0.8, 0.45, 0.8); B.curve(1, 0, 1, 1);
        const q1 = prog(k, p, 1, 0, 1), q2 = prog(k, p, 2, 0, 0.6), q3 = prog(k, p, 3, 0, 0.3);
        B.cross(1, 1);
        const pu = lin(k, p, 1, 0, 0.8);
        ring.setAttribute("r", lerp(9, 54, pu)); op(ring, k === 1 && pu < 1 ? 1 - pu : 0);
        B.crossEl.setAttribute("r", lerp(9, 12, q1));
        B.regions(lerp(0.45, 1, q2), lerp(0.45, 1, q2), 1, 0, 1);
        op(d, q3);
        const a1 = prog(k, p, 3, 0.25, 0.5), a2 = prog(k, p, 3, 0.45, 0.7), a3 = prog(k, p, 3, 0.65, 0.95);
        up.set(D.x, D.y - 14, D.x, lerp(D.y - 14, yBar(D.x, 0) - 14, a1)); op(up, a1 > 0 ? 1 : 0);
        left.set(D.x - 14, D.y, lerp(D.x - 14, 452, a2), D.y); op(left, a2 > 0 ? 1 : 0);
        const bx = 680, by = yBar(bx, 0);
        down.set(bx, by + 8, bx, lerp(by + 8, yBar(bx, DROP) - 8, a3)); op(down, a3 > 0 ? 1 : 0);
        op(low, a3 * 0.9);
        cards.forEach((c, i) => c.classList.toggle("on", k >= i + 1));
      };
    },
  };

  function side(host, fm, isProp) {
    const el = h("div", { class: "fm-side" + (isProp ? " prop" : "") });
    const asks = fm.ask || [];
    if (asks.length) {
      const panel = h("div", { class: "fm-fp" });
      panel.appendChild(h("div", { class: "fm-fp-h" }, h("span", { class: "fm-fp-t" }, fm.forum || ""), h("span", { class: "fm-fp-c teal" }, fm.owned || ""), h("span", { class: "fm-fp-c amber" }, fm.unowned || "")));
      asks.forEach((q) => panel.appendChild(h("div", { class: "fm-fp-r" }, h("span", { class: "fm-fp-q" }, q), h("span", { class: "fm-fp-m yes" }, "✓"), h("span", { class: "fm-fp-m no" }, "✕"))));
      el.appendChild(panel);
    }
    if (fm.adds) el.appendChild(h("div", { class: "fm-adds" }, h("div", { class: "k" }, T(fm, "map.addslabel", "Adds to the map")), h("div", { class: "fm-adds-t", html: Deck.inline(fm.adds) })));
    const cites = (fm.cite || []).map(split);
    if (cites.length) {
      const box = h("div", { class: "fm-cites" }, h("div", { class: "k" }, T(fm, "map.groundlabel", "Grounding")));
      cites.forEach(([who, what]) => box.appendChild(h("div", { class: "fm-cite" }, h("div", { class: "fm-cite-w" }, who), h("div", { class: "fm-cite-t", html: Deck.inline(what || "") }))));
      el.appendChild(box);
    }
    (fm.row || []).map(split).forEach(([tag, text, color]) =>
      el.appendChild(h("div", { class: "fm-row " + (color || "slate") }, h("div", { class: "fm-tag" }, tag), h("div", { class: "fm-row-t", html: Deck.inline(text) }))));
    (fm.legend || []).map(split).forEach(([tag, text]) =>
      el.appendChild(h("div", { class: "fm-leg" }, h("div", { class: "fm-tag" }, tag), h("div", { class: "fm-row-t", html: Deck.inline(text) }))));
    const fixes = (fm.fix || []).map(split);
    (fm.q || []).map(split).forEach(([q, a], i, all) => {
      const card = h("div", { class: "fm-q" }, h("div", { class: "fm-q-n" }, String(i + 1)), h("div", {}, h("div", { class: "fm-q-q" }, q), h("div", { class: "fm-q-a" }, a)));
      if (i === all.length - 1 && fixes.length) card.lastChild.appendChild(h("div", { class: "fm-fixes" }, ...fixes.map(([g, t]) => h("span", {}, h("b", {}, g), t))));
      el.appendChild(card);
    });
    host.appendChild(el);
    return el;
  }

  /* what every proposition slide carries besides its figure: the part's color and rail, the tracker of
     seven propositions in two groups, and the proposition as it would be worded in the paper */
  function chrome(ctx) {
    const fm = ctx.fm, el = ctx.slideEl, n = +fm.pnum, part = n <= 3 ? 1 : 2;
    el.classList.add("prop", "part" + part);
    el.appendChild(h("div", { class: "prail" }));
    const tr = h("div", { class: "ptrack" });
    [[1, [1, 2, 3]], [2, [4, 5, 6, 7]]].forEach(([g, ns]) =>
      tr.appendChild(h("div", { class: "pg g" + g + (g === part ? " cur" : "") }, h("span", { class: "pg-l" }, T(fm, "track" + g, "")), ...ns.map((x) => h("i", { class: x === n ? "now" : "" }, String(x))))));
    el.appendChild(tr);
    el.appendChild(h("div", { class: "pstate" }, h("span", { class: "pstate-l" }, `Proposition ${fm.pnum} (${fm.pname || ""}).`), h("span", { class: "pstate-t", html: " " + Deck.inline(fm.prop || "") })));
  }

  function mountStage(host, ctx, isProp) {
    host.classList.add("fm-host");
    if (isProp) { host.classList.add("prop"); chrome(ctx); }
    else if (ctx.fm.part) { ctx.slideEl.classList.add("part" + ctx.fm.part); ctx.slideEl.appendChild(h("div", { class: "prail" })); }
    const fm = ctx.fm, st = STAGES[fm.stage], fig = FIGS[fm.stage];
    if (!st && !fig) { host.appendChild(h("div", { style: { color: "#B13616", fontSize: "20px" } }, "Unknown stage: " + fm.stage)); return { update() {} }; }
    const box = h("div", { class: "fm-map" + (fig ? " fig" : "") });
    host.appendChild(box);
    const sideEl = side(host, fm, isProp);
    if (fig) return runner(fig.build(Deck.svg(952, 588, box), fm, sideEl), fig.durs, ctx);
    return runner(st.build(base(Deck.svg(1010, 624, box), fm), fm, sideEl), st.durs, ctx);
  }
  const stepsOfStage = (fm) => ((STAGES[fm.stage] || FIGS[fm.stage] || {}).steps) || 0;
  Deck.components.FrontierMap = { steps: stepsOfStage, mount: (host, ctx) => mountStage(host, ctx, false) };
  Deck.components.Proposition = { steps: stepsOfStage, mount: (host, ctx) => mountStage(host, ctx, true) };

  /* ================================================================ background: six facts, four links */
  Deck.components.FactsLinks = {
    steps: 2,
    mount(host, ctx) {
      host.classList.add("fm-host");
      const fm = ctx.fm, facts = (fm.fact || []).map(split), links = (fm.link || []).map(split);
      const W = 230, WR = 270, H = 92, P = [[0, 70], [300, 330], [600, 70], [900, 330], [1186, 70], [1186, 330]];
      const svgEl = s("svg", { viewBox: "0 0 1456 644", width: 1456, height: 644, class: "fl-lines" }, host);
      const frame = s("rect", { x: -24, y: 14, width: 1178, height: 456, rx: 14, class: "fl-frame" }, svgEl);
      const feed = arrow(svgEl, "feed"); feed.set(1158, 116, 1180, 116);
      const frameL = h("div", { class: "fl-lab", style: "left:0;top:26px" }, fm.frame || "");
      const rowT = h("div", { class: "fl-lab soft", style: "right:340px;top:106px;text-align:right" }, fm.row_top || "");
      const rowB = h("div", { class: "fl-lab soft", style: "left:0;top:366px" }, fm.row_bottom || "");
      [frameL, rowT, rowB].forEach((e) => host.appendChild(e));
      const cards = facts.map(([t, d], i) => {
        const c = h("div", { class: "fl-fact", style: `left:${P[i][0]}px;top:${P[i][1]}px;width:${i > 3 ? WR : W}px;height:${H}px` }, h("div", { class: "fl-t" }, t), h("div", { class: "fl-d" }, d), h("div", { class: "fl-check" }, "✓"));
        host.appendChild(c);
        return c;
      });
      const PX = [265, 565, 865, 1321], PW = [250, 250, 250, 250];
      const segs = [
        [[150, 162, 235, 210], [295, 270, 380, 330]],
        [[470, 330, 535, 270], [595, 210, 660, 162]],
        [[750, 162, 835, 210], [895, 270, 980, 330]],
        [[1321, 162, 1321, 210], [1321, 270, 1321, 330]],
      ];
      const lines = segs.map((pair) => pair.map(([x1, y1, x2, y2]) => { const l = s("line", { x1, y1, x2: x1, y2: y1, class: "fl-link" }, svgEl); l.to = [x1, y1, x2, y2]; return l; }));
      const pills = links.map(([t, q], i) => {
        const el = h("div", { class: "fl-pill", style: `left:${PX[i] - PW[i] / 2}px;top:210px;width:${PW[i]}px` }, h("div", { class: "fl-t" }, t), h("div", { class: "fl-d" }, q));
        host.appendChild(el);
        return el;
      });
      const tv = split(fm.tag_v), td = split(fm.tag_d);
      const tagV = h("div", { class: "fl-tag amber", style: "left:0;top:528px" }, h("b", {}, tv[0] || ""), h("span", {}, tv[1] || ""));
      const tagD = h("div", { class: "fl-tag teal", style: "left:700px;top:528px" }, h("b", {}, td[0] || ""), h("span", {}, td[1] || ""));
      host.appendChild(tagV); host.appendChild(tagD);
      const render = (k, p) => {
        cards.forEach((c, i) => {
          const t = lin(k, p, 1, i * 0.12, 0.3 + i * 0.12), ck = c.lastChild;
          ck.style.opacity = t > 0 ? 1 : 0; ck.style.transform = `scale(${t > 0 ? lerp(2.2, 1, pop(t)) : 1})`;
        });
        op(tagV, prog(k, p, 1, 0.7, 1));
        lines.forEach((pair, i) => pair.forEach((l, j) => {
          const t = prog(k, p, 2, i * 0.16 + j * 0.14, i * 0.16 + j * 0.14 + 0.2), [x1, y1, x2, y2] = l.to;
          l.setAttribute("x2", lerp(x1, x2, t)); l.setAttribute("y2", lerp(y1, y2, t)); op(l, k >= 2 ? 1 : 0);
        }));
        pills.forEach((el, i) => { const t = prog(k, p, 2, i * 0.16 + 0.08, i * 0.16 + 0.26); op(el, t); el.style.transform = `translateY(${lerp(10, 0, t)}px)`; });
        const fr = prog(k, p, 2, 0.7, 0.95);
        op(frame, fr); op(feed, fr); op(frameL, fr); op(rowT, fr); op(rowB, fr);
        op(tagD, prog(k, p, 2, 0.8, 1));
      };
      return runner(render, [0, 1700, 2600], ctx);
    },
  };
})();
