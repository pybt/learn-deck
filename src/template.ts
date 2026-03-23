import type { CardData } from "./data/types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderBody(text: string): string {
  const parts = text.split(/```/);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) {
        return `<pre><code>${escapeHtml(part.trim())}</code></pre>`;
      }
      const trimmed = part.trim();
      return trimmed ? `<p>${escapeHtml(trimmed)}</p>` : "";
    })
    .join("");
}

function renderCard(card: CardData, index: number): string {
  const details = card.details
    .map(
      (d) => `
        <div class="section">
          <h3>${escapeHtml(d.heading)}</h3>
          ${renderBody(d.body)}
        </div>`,
    )
    .join("");

  return `
    <li class="card">
      <details>
        <summary>
          <span class="card-number">${index + 1}</span>
          <div class="card-header">
            <span class="title">${escapeHtml(card.title)}</span>
            <p class="summary">${escapeHtml(card.summary)}</p>
          </div>
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <div class="details">${details}
        </div>
      </details>
    </li>`;
}

interface DeckEntry {
  dir: string;
  id: string;
  title: string;
  cards: CardData[];
}

export function generateIndexHtml(decks: DeckEntry[]): string {
  const grouped = new Map<string, DeckEntry[]>();
  for (const deck of decks) {
    const group = grouped.get(deck.dir) ?? [];
    group.push(deck);
    grouped.set(deck.dir, group);
  }

  const sections = Array.from(grouped.entries())
    .map(
      ([dir, items]) => `
      <div class="topic">
        <h2>${escapeHtml(dir)}</h2>
        <ul class="deck-list">
          ${items
            .map(
              (d) => `
          <li>
            <a href="${encodeURIComponent(d.dir)}/${encodeURIComponent(d.id)}.html">
              <span class="deck-title">${escapeHtml(d.title)}</span>
              <span class="deck-count">${d.cards.length} cards</span>
            </a>
          </li>`,
            )
            .join("")}
        </ul>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Learn Decks</title>
  <style>
    :root {
      --bg: #f8f6f2;
      --bg-card: #ffffff;
      --border: #ddd7ce;
      --text: #2d2a26;
      --text-title: #1a1815;
      --text-muted: #7a746a;
      --accent: #3b6b4f;
      --accent-shadow: rgba(59, 107, 79, 0.1);
      --card-shadow: rgba(0, 0, 0, 0.04);
      --toolbar-bg: #ffffff;
      --toolbar-border: #ddd7ce;
      --btn-bg: #edeae5;
      --btn-hover: #ddd7ce;
    }

    [data-theme="dark"] {
      --bg: #0f172a;
      --bg-card: #1e293b;
      --border: #334155;
      --text: #e2e8f0;
      --text-title: #f1f5f9;
      --text-muted: #64748b;
      --accent: #6ee7a0;
      --accent-shadow: rgba(110, 231, 160, 0.1);
      --card-shadow: rgba(0, 0, 0, 0.2);
      --toolbar-bg: #1e293b;
      --toolbar-border: #334155;
      --btn-bg: #334155;
      --btn-hover: #475569;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: "Charter", "Georgia", "Cambria", "Times New Roman", serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      min-height: 100dvh;
      font-size: 1rem;
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--toolbar-bg);
      border-bottom: 1px solid var(--toolbar-border);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: background 0.3s, border-color 0.3s;
    }

    .toolbar button {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      background: var(--btn-bg);
      color: var(--text);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
      -webkit-tap-highlight-color: transparent;
    }

    .toolbar button:hover { background: var(--btn-hover); }

    .container {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      padding: 2rem 1rem 3rem;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.25rem;
      border-bottom: 2px solid var(--border);
      transition: border-color 0.3s;
    }

    header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-title);
      letter-spacing: -0.01em;
    }

    header p {
      margin-top: 0.35rem;
      font-size: 0.9rem;
      color: var(--text-muted);
      font-style: italic;
    }

    .topic { margin-bottom: 1.5rem; }

    .topic h2 {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--accent);
      margin-bottom: 0.5rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .deck-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .deck-list a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.875rem 1.25rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 0.625rem;
      text-decoration: none;
      color: var(--text);
      transition: border-color 0.2s, box-shadow 0.2s, background 0.3s;
      box-shadow: 0 1px 3px var(--card-shadow);
    }

    .deck-list a:hover {
      border-color: var(--accent);
      box-shadow: 0 2px 8px var(--accent-shadow);
    }

    .deck-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-title);
    }

    .deck-count {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <nav class="toolbar">
    <button type="button" id="theme-toggle" aria-label="Toggle theme">
      <span id="theme-icon">&#9790;</span>
    </button>
  </nav>
  <div class="container">
    <header>
      <h1>Learn Decks</h1>
      <p>${decks.length} decks</p>
    </header>
    ${sections}
  </div>
  <script>
    (() => {
      let dark = localStorage.getItem("index_theme") === "dark";
      const applyTheme = () => {
        document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
        document.getElementById("theme-icon").innerHTML = dark ? "&#9788;" : "&#9790;";
        localStorage.setItem("index_theme", dark ? "dark" : "light");
      };
      document.getElementById("theme-toggle").onclick = () => { dark = !dark; applyTheme(); };
      applyTheme();
    })();
  </script>
</body>
</html>`;
}

export function generateDeckHtml(title: string, cards: CardData[]): string {
  const cardList = cards.map((card, i) => renderCard(card, i)).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — AI Learn</title>
  <style>
    :root {
      --bg: #f8f6f2;
      --bg-card: #ffffff;
      --border: #ddd7ce;
      --border-header: #d4cfc7;
      --text: #2d2a26;
      --text-title: #1a1815;
      --text-muted: #7a746a;
      --text-summary: #5c564c;
      --text-body: #3d3832;
      --accent: #3b6b4f;
      --accent-shadow: rgba(59, 107, 79, 0.1);
      --card-shadow: rgba(0, 0, 0, 0.04);
      --toolbar-bg: #ffffff;
      --toolbar-border: #ddd7ce;
      --btn-bg: #edeae5;
      --btn-hover: #ddd7ce;
    }

    [data-theme="dark"] {
      --bg: #0f172a;
      --bg-card: #1e293b;
      --border: #334155;
      --border-header: #334155;
      --text: #e2e8f0;
      --text-title: #f1f5f9;
      --text-muted: #64748b;
      --text-summary: #94a3b8;
      --text-body: #cbd5e1;
      --accent: #6ee7a0;
      --accent-shadow: rgba(110, 231, 160, 0.1);
      --card-shadow: rgba(0, 0, 0, 0.2);
      --toolbar-bg: #1e293b;
      --toolbar-border: #334155;
      --btn-bg: #334155;
      --btn-hover: #475569;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Charter", "Georgia", "Cambria", "Times New Roman", serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      min-height: 100dvh;
      font-size: 1rem;
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--toolbar-bg);
      border-bottom: 1px solid var(--toolbar-border);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: background 0.3s, border-color 0.3s;
    }

    .toolbar button {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      background: var(--btn-bg);
      color: var(--text);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
      -webkit-tap-highlight-color: transparent;
    }

    .toolbar button:hover {
      background: var(--btn-hover);
    }

    .toolbar .font-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      min-width: 2.5rem;
      text-align: center;
    }

    .toolbar .separator {
      width: 1px;
      height: 1.25rem;
      background: var(--toolbar-border);
      margin: 0 0.25rem;
    }

    .container {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      padding: 2rem 1rem 3rem;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.25rem;
      border-bottom: 2px solid var(--border-header);
      transition: border-color 0.3s;
    }

    header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-title);
      letter-spacing: -0.01em;
    }

    header p {
      margin-top: 0.35rem;
      font-size: 0.9rem;
      color: var(--text-muted);
      font-style: italic;
    }

    .card-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 0.625rem;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.3s;
      box-shadow: 0 1px 3px var(--card-shadow);
    }

    .card:has(details[open]) {
      border-color: var(--accent);
      box-shadow: 0 2px 8px var(--accent-shadow);
    }

    details summary {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      cursor: pointer;
      list-style: none;
      -webkit-tap-highlight-color: transparent;
    }

    details summary::-webkit-details-marker {
      display: none;
    }

    .card-number {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: var(--accent);
      color: #fff;
      font-size: 0.8rem;
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: background 0.3s;
    }

    [data-theme="dark"] .card-number {
      color: #0f172a;
    }

    .card-header {
      flex: 1;
      min-width: 0;
    }

    .title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-title);
      display: block;
    }

    .summary {
      margin-top: 0.3rem;
      font-size: 0.875rem;
      color: var(--text-summary);
      line-height: 1.5;
    }

    .chevron {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      transition: transform 0.2s;
      position: relative;
    }

    .chevron::before,
    .chevron::after {
      content: "";
      position: absolute;
      background: var(--accent);
      border-radius: 1px;
      top: 50%;
      left: 50%;
      transition: background 0.3s;
    }

    .chevron::before {
      width: 14px;
      height: 2px;
      transform: translate(-50%, -50%);
    }

    .chevron::after {
      width: 2px;
      height: 14px;
      transform: translate(-50%, -50%);
      transition: transform 0.2s, background 0.3s;
    }

    details[open] .chevron::after {
      transform: translate(-50%, -50%) scaleY(0);
    }

    .details {
      padding: 0 1.25rem 1.25rem;
      padding-left: calc(1.25rem + 2rem + 0.75rem);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    .section h3 {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--accent);
      margin-bottom: 0.3rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .section p {
      font-size: 0.9rem;
      color: var(--text-body);
      line-height: 1.65;
    }

    .section pre {
      background: var(--btn-bg);
      border-radius: 0.375rem;
      padding: 0.75rem 1rem;
      overflow-x: auto;
      margin: 0.3rem 0 0;
      transition: background 0.3s;
    }

    .section pre code {
      font-family: "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace;
      font-size: 0.8rem;
      line-height: 1.5;
      color: var(--text-body);
      white-space: pre-wrap;
      word-break: break-word;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 480px) {
      .container {
        padding: 1.25rem 0.75rem 2rem;
      }

      .title {
        font-size: 1rem;
      }

      .details {
        padding-left: 1.25rem;
      }
    }
  </style>
</head>
<body>
  <nav class="toolbar">
    <button type="button" id="font-down" aria-label="Decrease font size">A-</button>
    <span class="font-label" id="font-label">18</span>
    <button type="button" id="font-up" aria-label="Increase font size">A+</button>
    <span class="separator"></span>
    <button type="button" id="theme-toggle" aria-label="Toggle theme">
      <span id="theme-icon">&#9790;</span>
    </button>
  </nav>
  <div class="container">
    <header>
      <h1>${escapeHtml(title)}</h1>
      <p>${cards.length} cards</p>
    </header>
    <ul class="card-list">
${cardList}
    </ul>
  </div>
  <script>
    (() => {
      const SIZES = [14, 15, 16, 17, 18, 20];
      const KEY = location.pathname.replace(/[^a-z0-9]/gi, "_");

      const savedSize = parseInt(localStorage.getItem(\`\${KEY}_fs\`), 10);
      let sizeIdx = SIZES.indexOf(savedSize);
      if (sizeIdx < 0) sizeIdx = 4;

      let dark = localStorage.getItem(\`\${KEY}_theme\`) === "dark";

      const apply = () => {
        document.documentElement.style.fontSize = \`\${SIZES[sizeIdx]}px\`;
        document.getElementById("font-label").textContent = SIZES[sizeIdx];
        localStorage.setItem(\`\${KEY}_fs\`, SIZES[sizeIdx]);
      };

      const applyTheme = () => {
        document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
        document.getElementById("theme-icon").innerHTML = dark ? "&#9788;" : "&#9790;";
        localStorage.setItem(\`\${KEY}_theme\`, dark ? "dark" : "light");
      };

      document.getElementById("font-down").onclick = () => {
        if (sizeIdx > 0) { sizeIdx--; apply(); }
      };
      document.getElementById("font-up").onclick = () => {
        if (sizeIdx < SIZES.length - 1) { sizeIdx++; apply(); }
      };
      document.getElementById("theme-toggle").onclick = () => {
        dark = !dark; applyTheme();
      };

      apply();
      applyTheme();
    })();
  </script>
</body>
</html>`;
}
