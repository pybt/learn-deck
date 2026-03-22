---
name: manage-deck
description: Create or update a learning card deck
user_invocable: true
---

# Manage Card Deck

Create a new card deck or update an existing one.

## Usage

- `/manage-deck <topic>` — Create a new deck on the given topic
- `/manage-deck <topic> add <subtopic>` — Add cards to an existing deck
- `/manage-deck <topic> update` — Update/improve existing cards in a deck

## Instructions

### Card Data Format

Each deck is a TypeScript file organized by topic in subdirectories under `src/data/`:

```
src/data/
  types.ts              # Shared CardData interface
  ai/                   # AI & agent topics
    ai-agent-skills.ts
    build-agent-skills.ts
  docker/               # Docker topics
    docker-fundamentals.ts
    docker-logging.ts
  helm/                 # Helm & Kubernetes topics
    helm.ts
    helm-create.ts
```

```typescript
export interface CardData {
  id: string;       // kebab-case unique identifier
  title: string;    // short display title
  summary: string;  // 1-2 sentence overview (shown when collapsed)
  details: { heading: string; body: string }[]; // expanded content sections
}
```

Each card should have 2-4 detail sections. Common section headings:
- **How it works** — mechanism or process explanation
- **Key concepts** — important terms and ideas
- **Example** — concrete real-world scenario
- **Why it matters** — practical significance

### Creating a New Deck

1. **Research the topic** — use web search to gather current, accurate information on the topic before writing cards. This ensures content reflects up-to-date best practices, terminology, and real-world usage.

2. **Choose the right subdirectory** under `src/data/`:
   - Place the deck in an existing topic directory if it fits (ai/, docker/, helm/)
   - Create a new topic directory if the deck doesn't belong in any existing one
   - Import the `CardData` interface relative to the subdirectory: `import type { CardData } from "../types"`

3. **Create the data file** at `src/data/<topic>/<deck-name>.ts`:
   - Export a typed array: `export const deckName: CardData[] = [...]`
   - Use kebab-case for the filename and card ids
   - Generate 6-10 cards covering the key subtopics

4. **Register in build script** — edit `src/build.ts`:
   - Add an import for the new deck data (using the subdirectory path)
   - Add an entry to the `decks` array with these fields:
     - `dir` — topic subdirectory name (e.g., `"ai"`, `"docker"`, `"helm"`)
     - `id` — short, reasonable kebab-case name used as the output HTML filename (e.g., `"agent-skills"`, `"fundamentals"`, `"logging"`). Should be concise but descriptive — avoid redundancy with the directory name (e.g., use `"fundamentals"` not `"docker-fundamentals"` since it's already in the `docker/` directory)
     - `title` — human-readable deck title
     - `cards` — the imported card data array
   - Example: `{ dir: "docker", id: "networking", title: "Docker Networking", cards: dockerNetworking }`
   - Output will be generated at `decks/<dir>/<id>.html`

5. **Build and verify**:
   - Run `bun run build` to generate the HTML
   - Run `bun run lint:fix` to fix any formatting issues
   - Confirm the file was generated in `decks/<dir>/`

### Updating an Existing Deck

1. **Read the existing data file** at `src/data/<topic>/<deck-name>.ts`
2. **Add, modify, or remove cards** as requested
3. **Rebuild**: run `bun run build`
4. **Lint**: run `bun run lint:fix`

### Content Guidelines

- Write card content at a professional level — concise, accurate, practical
- Each summary should stand alone as a useful one-liner
- Detail sections should teach, not just define — include the "why" and "how"
- Examples should be concrete and relatable to software engineering workflows
- Keep body text to 2-3 sentences per section for mobile readability
- **Code blocks**: When a body contains code (shell commands, config, JSON, YAML, etc.), wrap it in triple backticks. The template renders these as styled `<pre><code>` blocks. Keep prose outside the backticks. Example:
  ```typescript
  body: "Create a network:\n\n\`\`\`\ndocker network create myapp\n\`\`\`\n\nThen run containers on it."
  ```

### Important

- The `CardData` interface is defined in `src/data/types.ts` — import it from there for all decks
- Always run `bun run build` after changes to regenerate the HTML output in `decks/`
- Always run `bun run lint:fix` to ensure consistent formatting
