// Local server for the deck. No installs needed (Node 18+).
//   node scripts/serve.mjs          -> http://localhost:5300
//   node scripts/serve.mjs --once   -> only refresh slides.content.js, then exit
// What it does:
//   - serves the deck folder with live reload: saving slides.md, css/ or js/ reloads the open deck
//   - keeps slides.content.js in step with slides.md (the copy used when index.html is opened by double-click,
//     and the copy GitHub Pages serves, since the page fetches slides.md over http first and falls back to it)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = +(process.env.PORT || 5300);
const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".woff2": "font/woff2" };
const clients = new Set();

export function writeContentJs() {
  const md = fs.readFileSync(path.join(root, "slides.md"), "utf8");
  const js = "// Generated from slides.md. Edit slides.md, not this file.\nwindow.SLIDES_MD = " + JSON.stringify(md) + ";\n";
  fs.writeFileSync(path.join(root, "slides.content.js"), js);
}

if (process.argv.includes("--once")) {
  writeContentJs();
  console.log("slides.content.js refreshed");
} else {
  writeContentJs();
  http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/__events") {
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
      res.write("retry: 1000\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }
    let file = path.join(root, url === "/" ? "index.html" : url);
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); return res.end("not found"); }
      res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(buf);
    });
  }).listen(port, () => console.log(`Deck: http://localhost:${port}  (Ctrl+C to stop; edits to slides.md, css/ and js/ reload the deck)`));

  let timer = null;
  const watch = (f) => fs.watch(path.join(root, f), { recursive: f !== "slides.md" }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { writeContentJs(); } catch (e) { console.error(e.message); }
      for (const c of clients) c.write("data: reload\n\n");
    }, 150);
  });
  watch("slides.md");
  for (const d of ["css", "js"]) try { watch(d); } catch (e) {}
}
