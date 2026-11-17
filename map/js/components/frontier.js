/* Components for the frontier-map deck. Each exports { steps, mount(host, ctx) -> { update(click, animate), destroy } }.
   FactsLinks  : the background slide (six facts, four links).
   FrontierMap : one map, eight builds ("stage:" in slides.md picks one: p1 ... p7, read).
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
  function stamp(p, x, y, label) {
    const g = s("g", { class: "fm-stamp" }, p);
    s("rect", { x: -42, y: -17, width: 84, height: 34, rx: 5 }, g);
    txt(g, 0, 7, label, "fm-stamp-t", "middle");
    g.set = (o, sc, xx, yy) => { g.style.opacity = o; g.setAttribute("transform", `translate(${xx == null ? x : xx} ${yy == null ? y : yy}) rotate(-8) scale(${sc == null ? 1 : sc})`); };
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

  /* P1 · the flat bar, then the limit of testing comes down */
  STAGES.p1 = {
    steps: 2, durs: [0, 1500, 2000],
    build(B) {
      const pts = [[170, 470], [260, 250], [340, 400], [450, 90], [540, 290], [640, 440], [720, 70], [800, 230], [890, 400]];
      const dots = pts.map(([x, y]) => dot(B.layer, x, y, ""));
      return (k, p) => {
        const draw = prog(k, p, 1, 0, 0.65), judged = lin(k, p, 1, 0.55, 1) > 0, lab = prog(k, p, 1, 0.6, 1);
        const c = prog(k, p, 2, 0, 0.75), cy1 = lerp(G.yT, G.ceil, c);
        B.flat(k >= 1 ? 1 : 0, draw, lab);
        B.ceil(cy1, k >= 2 ? 1 : 0, 0.6 * (k >= 2 ? 1 : 0), prog(k, p, 2, 0.7, 1));
        dots.forEach((d, i) => {
          const y0 = pts[i][1], y = k >= 2 ? Math.max(y0, cy1 + 20) : y0;
          d.setAttribute("cy", y);
          cls(d, "fm-dot " + (judged ? (y < G.flat ? "gold" : "mute") : ""));
        });
      };
    },
  };

  /* P2 · each step toward the limit costs ten times the last; the watchers thin out */
  STAGES.p2 = {
    steps: 2, durs: [0, 4600, 2200],
    build(B, fm) {
      const rungs = (fm.rung || []).map(split), ys = [350, 262, 206, 176], lens = [26, 64, 144, 320], X = 300, Y0 = 480;
      s("line", { x1: X, x2: X, y1: Y0, y2: 166, class: "fm-rail" }, B.layer);
      const head = s("g", {}, B.layer);
      txt(head, 334, 404, fm.col_rate || "", "fm-mono"); txt(head, 560, 404, fm.col_cases || "", "fm-mono");
      const rows = rungs.map(([rate, n], i) => {
        const g = s("g", {}, B.layer);
        s("line", { x1: X - 12, x2: X + 12, y1: ys[i], y2: ys[i], class: "fm-rung" }, g);
        txt(g, 334, ys[i] + 6, rate, "fm-rate");
        const bar = s("rect", { x: 560, y: ys[i] - 9, height: 18, width: 1, rx: 3, class: "fm-cost" }, g);
        const num = txt(g, 570, ys[i] + 6, n, "fm-rate num");
        return { g, bar, num, len: lens[i] };
      });
      const climber = dot(B.layer, X, Y0, "gold", 11);
      const wg = s("g", {}, B.layer);
      const wl = txt(wg, 112, 440, fm.watch || "", "fm-mono");
      const people = [];
      for (let i = 0; i < 10; i++) {
        const g = s("g", { transform: `translate(${120 + (i % 5) * 30} ${462 + Math.floor(i / 5) * 34})`, class: "fm-person" }, wg);
        s("circle", { cx: 0, cy: 0, r: 5.5 }, g); s("path", { d: "M-8 20 Q-8 8 0 8 Q8 8 8 20 Z" }, g);
        people.push(g);
      }
      const order = [7, 2, 9, 4, 0, 6, 3, 8];
      const cuts = [0, 0.2, 0.46, 0.72, 1];
      return (k, p) => {
        B.flat(0.4, 1, 0.4); B.ceil(G.ceil, 1, 0.6, 1);
        let y = Y0;
        rows.forEach((r, i) => {
          const hop = prog(k, p, 1, cuts[i], cuts[i + 1] - 0.06), show = prog(k, p, 1, cuts[i + 1] - 0.1, cuts[i + 1]);
          y = lerp(y, ys[i], hop);
          op(r.g, show);
          r.bar.setAttribute("width", Math.max(1, r.len * show));
          r.num.setAttribute("x", 570 + r.len * show);
        });
        climber.setAttribute("cy", y);
        op(head, prog(k, p, 1, 0.1, 0.2));
        people.forEach((g) => op(g, 1));
        order.forEach((idx, j) => op(people[idx], lerp(1, 0.14, prog(k, p, 2, j / 9, (j + 2) / 9))));
        op(wl, 1);
      };
    },
  };

  /* P3 · a reported position rises above the bar; the gap is paperwork */
  STAGES.p3 = {
    steps: 2, durs: [0, 1700, 1500],
    build(B, fm) {
      const real = [[300, 430], [520, 390], [760, 450]], up = [250, 270, 240];
      const tethers = real.map(([x, y]) => s("line", { x1: x, x2: x, y1: y, y2: y, class: "fm-tether gold" }, B.layer));
      real.forEach(([x, y]) => dot(B.layer, x, y, ""));
      const hollow = real.map(([x, y]) => dot(B.layer, x, y, "hollow"));
      const stamps = real.map(([x], i) => stamp(B.top, x + 62, up[i] - 22, T(fm, "stamp", "Pass")));
      const l1 = txt(B.labels, 278, 255, fm.reported || "", "fm-mono amber halo", "end"), l2 = txt(B.labels, 278, 435, fm.real || "", "fm-mono halo", "end");
      const gap = txt(B.labels, 780, 304, fm.gap || "", "fm-mono coral halo");
      return (k, p) => {
        B.flat(1, 1, 1); B.ceil(G.ceil, 0.5, 0.3, 0.5);
        real.forEach(([x, y], i) => {
          const r = prog(k, p, 1, i * 0.18, 0.6 + i * 0.18), yy = lerp(y, up[i], r);
          hollow[i].setAttribute("cy", yy); op(hollow[i], k >= 1 ? 1 : 0);
          tethers[i].setAttribute("y2", yy);
          const st = lin(k, p, 2, i * 0.2, 0.35 + i * 0.2);
          stamps[i].set(st > 0 ? Math.min(1, st * 3) : 0, lerp(2.2, 1, st > 0 ? pop(st) : 0));
        });
        op(l1, prog(k, p, 1, 0.5, 0.8)); op(l2, 1);
        op(gap, prog(k, p, 2, 0.7, 1));
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

  /* P7 · a forum asks why: the position nobody holds falls back, the owned one stands */
  STAGES.p7 = {
    steps: 2, durs: [0, 2000, 2200],
    build(B, fm) {
      const A = { x: 360, real: 430, rep: 250 }, O = { x: 640, y: 200 }, F = { x: 790, y: 440, w: 150, h: 56 };
      const tether = s("line", { x1: A.x, x2: A.x, y1: A.real, y2: A.rep, class: "fm-tether gold" }, B.layer);
      const q1 = s("line", { class: "fm-ask" }, B.layer), q2 = s("line", { class: "fm-ask" }, B.layer);
      dot(B.layer, A.x, A.real, "");
      const rep = dot(B.layer, A.x, A.rep, "hollow");
      const ring = s("circle", { cx: O.x, cy: O.y, r: 10, class: "fm-hold" }, B.layer);
      dot(B.layer, O.x, O.y, "teal", 11);
      const flag = s("path", { d: `M${O.x} ${O.y - 12} v-30 l22 8 l-22 8`, class: "fm-flag" }, B.layer);
      const st = stamp(B.top, A.x + 62, A.rep - 22, T(fm, "stamp", "Pass"));
      const forum = s("g", { class: "fm-forum" }, B.top);
      s("rect", { x: F.x, y: F.y, width: F.w, height: F.h, rx: 10 }, forum); txt(forum, F.x + F.w / 2, F.y + 36, fm.forum || "", "fm-forum-t", "middle");
      const bub = [0, 1].map(() => { const g = s("g", { class: "fm-bub" }, B.top); s("circle", { r: 17 }, g); txt(g, 0, 6, "?", "fm-bub-t", "middle"); return g; });
      const from = [[F.x, F.y + 12], [F.x + 40, F.y]], to = [[A.x + 14, A.rep + 8], [O.x + 12, O.y + 12]];
      [q1, q2].forEach((q, i) => { q.setAttribute("x1", from[i][0]); q.setAttribute("y1", from[i][1]); });
      const lr = txt(B.labels, A.x - 22, A.rep + 5, fm.reported || "", "fm-mono amber halo", "end");
      const ln = txt(B.labels, A.x - 22, A.real + 5, fm.unowned || "", "fm-mono halo", "end");
      const lo = txt(B.labels, O.x + 34, O.y - 26, fm.owned || "", "fm-mono teal halo");
      const lask = txt(B.labels, F.x + F.w / 2, F.y + F.h + 22, fm.ask || "", "fm-mono lilac halo", "middle");
      return (k, p) => {
        B.flat(1, 1, 1); B.ceil(G.ceil, 0.4, 0, 0); B.curve(1, 0, 1, 1); B.cross(0.6, 0);
        op(forum, prog(k, p, 1, 0, 0.25)); op(lask, prog(k, p, 1, 0.15, 0.4));
        [q1, q2].forEach((q, i) => {
          const t = prog(k, p, 1, 0.25 + i * 0.12, 0.8 + i * 0.12);
          const x = lerp(from[i][0], to[i][0], t), y = lerp(from[i][1], to[i][1], t);
          q.setAttribute("x2", x); q.setAttribute("y2", y); op(q, k >= 1 ? 1 : 0);
          bub[i].setAttribute("transform", `translate(${x} ${y})`);
          op(bub[i], k === 1 && t > 0 ? 1 : k >= 2 ? 1 - prog(k, p, 2, 0, 0.2) : 0);
        });
        const fall = prog(k, p, 2, 0.15, 0.7), y = lerp(A.rep, A.real, fall);
        rep.setAttribute("cy", y); tether.setAttribute("y2", y); op(rep, 1 - prog(k, p, 2, 0.62, 0.72));
        if (k >= 1) { q1.setAttribute("x2", lerp(to[0][0], A.x + 14, 1)); if (k >= 2) q1.setAttribute("y2", y + 8); }
        st.set(1 - prog(k, p, 2, 0, 0.22), 1, A.x + 62, y - 22);
        op(lr, 1 - prog(k, p, 2, 0.1, 0.3));
        const hold = prog(k, p, 2, 0.45, 0.9);
        ring.setAttribute("r", lerp(10, 24, hold)); op(ring, hold);
        op(flag, 1); op(ln, 1); op(lo, 1);
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

  function side(host, fm) {
    const el = h("div", { class: "fm-side" });
    if (fm.adds) el.appendChild(h("div", { class: "fm-adds" }, h("div", { class: "k" }, T(fm, "map.addslabel", "Adds to the map")), h("div", { class: "fm-adds-t", html: Deck.inline(fm.adds) })));
    (fm.row || []).map(split).forEach(([tag, text, color]) =>
      el.appendChild(h("div", { class: "fm-row " + (color || "slate") }, h("div", { class: "fm-tag" }, tag), h("div", { class: "fm-row-t", html: Deck.inline(text) }))));
    const fixes = (fm.fix || []).map(split);
    (fm.q || []).map(split).forEach(([q, a], i, all) => {
      const card = h("div", { class: "fm-q" }, h("div", { class: "fm-q-n" }, String(i + 1)), h("div", {}, h("div", { class: "fm-q-q" }, q), h("div", { class: "fm-q-a" }, a)));
      if (i === all.length - 1 && fixes.length) card.lastChild.appendChild(h("div", { class: "fm-fixes" }, ...fixes.map(([g, t]) => h("span", {}, h("b", {}, g), t))));
      el.appendChild(card);
    });
    host.appendChild(el);
    return el;
  }

  Deck.components.FrontierMap = {
    steps: (fm) => (STAGES[fm.stage] || {}).steps || 0,
    mount(host, ctx) {
      host.classList.add("fm-host");
      const fm = ctx.fm, st = STAGES[fm.stage];
      if (!st) { host.appendChild(h("div", { style: { color: "#B13616", fontSize: "20px" } }, "Unknown stage: " + fm.stage)); return { update() {} }; }
      const box = h("div", { class: "fm-map" });
      host.appendChild(box);
      const svgEl = Deck.svg(1010, 624, box);
      const B = base(svgEl, fm);
      const sideEl = side(host, fm);
      return runner(st.build(B, fm, sideEl), st.durs, ctx);
    },
  };

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
