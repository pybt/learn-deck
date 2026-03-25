import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { aiAgentSkills } from "./data/ai/agent-skills";
import { buildAgentSkills } from "./data/ai/build-agents";
import { claudeCodeTeammates } from "./data/ai/claude-code-teammates";
import { dockerFundamentals } from "./data/docker/fundamentals";
import { dockerLogging } from "./data/docker/logging";
import { goroutineFundamentals } from "./data/golang/goroutine-fundamentals";
import { golangIntroduction } from "./data/golang/introduction";
import { golangQuickStart } from "./data/golang/quick-start";
import { helm } from "./data/helm/core";
import { helmCreate } from "./data/helm/create";
import { qaIntroduction } from "./data/qa/introduction";
import { generateDeckHtml, generateIndexHtml } from "./template";

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
    dir: "ai",
    id: "claude-code-teammates",
    title: "Claude Code Teammates",
    cards: claudeCodeTeammates,
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
  {
    dir: "golang",
    id: "goroutine-fundamentals",
    title: "Go Goroutine Fundamentals",
    cards: goroutineFundamentals,
  },
  {
    dir: "golang",
    id: "introduction",
    title: "Go Introduction",
    cards: golangIntroduction,
  },
  {
    dir: "golang",
    id: "quick-start",
    title: "Go Quick Start",
    cards: golangQuickStart,
  },
  {
    dir: "qa",
    id: "introduction",
    title: "Introduction to Software QA",
    cards: qaIntroduction,
  },
];

try {
  const indexHtml = generateIndexHtml(decks);
  await writeFile(join(DECKS_DIR, "index.html"), indexHtml);
  console.log("Generated: index.html");

  for (const deck of decks) {
    const dir = join(DECKS_DIR, deck.dir);
    await mkdir(dir, { recursive: true });
    const html = generateDeckHtml(deck.title, deck.cards);
    const path = join(dir, `${deck.id}.html`);
    await writeFile(path, html);
    console.log(`Generated: ${path}`);
  }
  console.log(`Done — ${decks.length} deck(s) built.`);
} catch (err) {
  console.error("Build failed:", err);
  process.exit(1);
}
