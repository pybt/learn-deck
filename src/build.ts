import { cp, mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { aiAgentSkills } from "./data/ai/agent-skills";
import { buildAgentSkills } from "./data/ai/build-agents";
import { dockerFundamentals } from "./data/docker/fundamentals";
import { dockerLogging } from "./data/docker/logging";
import { helm } from "./data/helm/core";
import { helmCreate } from "./data/helm/create";
import { generateDeckHtml } from "./template";

const DECKS_DIR = join(import.meta.dir, "..", "decks");

const decks = [
  {
    dir: "ai",
    id: "agent-skills",
    title: "AI Agent Skills",
    cards: aiAgentSkills,
  },
  {
    dir: "ai",
    id: "build-agents",
    title: "Build Agent Skills",
    cards: buildAgentSkills,
  },
  {
    dir: "docker",
    id: "fundamentals",
    title: "Docker Fundamentals",
    cards: dockerFundamentals,
  },
  {
    dir: "docker",
    id: "logging",
    title: "Docker Logging",
    cards: dockerLogging,
  },
  {
    dir: "helm",
    id: "core",
    title: "Helm",
    cards: helm,
  },
  {
    dir: "helm",
    id: "create",
    title: "Creating Helm Charts",
    cards: helmCreate,
  },
];

for (const deck of decks) {
  const dir = join(DECKS_DIR, deck.dir);
  await mkdir(dir, { recursive: true });
  const html = generateDeckHtml(deck.title, deck.cards);
  const path = join(dir, `${deck.id}.html`);
  await writeFile(path, html);
  console.log(`Generated: ${path}`);
}

const icloudDir = join(
  homedir(),
  "Library/Mobile Documents/com~apple~CloudDocs/Learn",
);
await cp(DECKS_DIR, icloudDir, { recursive: true });
console.log(`Synced to iCloud: ${icloudDir}`);

console.log(`Done — ${decks.length} deck(s) built.`);
