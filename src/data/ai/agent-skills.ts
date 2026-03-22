import type { CardData } from "../types";

export const aiAgentSkills: CardData[] = [
  {
    id: "tool-use",
    title: "Tool Use & Function Calling",
    summary:
      "AI agents extend their capabilities by calling external tools and APIs through structured function definitions and standardized protocols like MCP.",
    details: [
      {
        heading: "How it works",
        body: "The model receives a schema describing available tools (name, parameters, types). When a task requires external action, it generates a structured function call instead of plain text. The runtime executes the call and feeds results back to the model. Parallel tool calls let agents batch independent actions in a single turn.",
      },
      {
        heading: "Key concepts",
        body: "Tool schemas define what the agent can do. Parameter validation ensures safe calls. Tool choice constraints (auto, required, specific tool, none) guide model behavior. Deferred schema loading fetches tool definitions only when needed, keeping the initial context lean. Results become conversation context for follow-up reasoning.",
      },
      {
        heading: "Example",
        body: "A coding agent uses a 'read_file' tool to inspect source code, a 'search' tool to find references, and a 'write_file' tool to apply changes. With parallel tool calling, it can read multiple files in a single turn before deciding on edits.",
      },
    ],
  },
  {
    id: "model-context-protocol",
    title: "Model Context Protocol (MCP)",
    summary:
      "MCP is the open standard for connecting AI agents to external tools and data sources, enabling interoperability across models and clients.",
    details: [
      {
        heading: "How it works",
        body: "MCP uses JSON-RPC 2.0 to define a client-server protocol. An MCP server exposes tools (callable functions), resources (readable data), and prompt templates. Any MCP-compatible client (Claude Code, Cursor, ChatGPT) can discover and invoke these capabilities. Transport options include stdio for local processes and HTTP+SSE for remote servers.",
      },
      {
        heading: "Key concepts",
        body: "Tools are model-callable functions with typed parameters. Resources are data the client can read (files, database rows, API responses). Prompts are reusable templates. Sampling lets servers request LLM completions. The protocol separates tool discovery from invocation, so agents dynamically learn what they can do.",
      },
      {
        heading: "Why it matters",
        body: "Before MCP, every AI tool integration was custom-built per model and client. MCP provides a universal interface — build one MCP server for Postgres and it works with Claude Code, Cursor, ChatGPT, and any future client. Hundreds of MCP servers now exist for databases, APIs, browsers, and more.",
      },
    ],
  },
  {
    id: "planning-reasoning",
    title: "Planning & Reasoning",
    summary:
      "Agents break complex tasks into steps using chain-of-thought reasoning, with dedicated reasoning models offering explicit thinking budgets.",
    details: [
      {
        heading: "How it works",
        body: "Given a high-level goal, the agent decomposes it into subtasks, identifies dependencies, and determines an execution order. Reasoning models (Claude with extended thinking, OpenAI o3/o4, Gemini 2.5 with thinking mode) perform explicit chain-of-thought before acting, with configurable thinking budgets that trade latency for accuracy.",
      },
      {
        heading: "Key concepts",
        body: "Task decomposition turns big problems into small ones. 'Think then act' patterns improve accuracy by reasoning before tool calls. Reasoning models expose thinking tokens — visible internal deliberation before the response. Re-planning happens when earlier steps produce unexpected results, adapting the approach mid-task.",
      },
      {
        heading: "Example",
        body: "Asked to 'add user authentication', an agent with extended thinking reasons through the codebase structure, then plans: 1) research existing auth patterns, 2) design schema changes, 3) implement middleware, 4) add routes, 5) write tests — checking results and re-planning at each step.",
      },
    ],
  },
  {
    id: "memory-context",
    title: "Memory & Context Management",
    summary:
      "Agents manage conversation context windows up to 1M+ tokens and use persistent file-based memory for cross-session continuity.",
    details: [
      {
        heading: "How it works",
        body: "Short-term memory lives in the conversation context window, now reaching 200K-1M+ tokens. Long-term memory uses persistent files (like CLAUDE.md and memory directories), vector stores, or databases that the agent reads from and writes to. Prompt caching reduces cost by reusing identical context prefixes across calls.",
      },
      {
        heading: "Key concepts",
        body: "Memory-as-files (CLAUDE.md, .cursorrules) provides simple, version-controlled persistence for project instructions and user preferences. Context compression summarizes older messages to stay within limits. RAG-based memory uses vector stores for semantic retrieval of past interactions. Prompt caching caches system prompts and tool definitions for repeated use.",
      },
      {
        heading: "Example",
        body: "An agent remembers that a user prefers TypeScript and Bun by storing this in a memory file. In future sessions, it reads the memory on startup and applies these preferences automatically — without re-reading old conversations or being told again.",
      },
    ],
  },
  {
    id: "code-generation",
    title: "Code Generation & Editing",
    summary:
      "AI coding agents write, modify, and refactor code using project-aware context, diff-based editing, and test-driven validation loops.",
    details: [
      {
        heading: "How it works",
        body: "The agent reads existing code to understand patterns, then generates new code or edits that match the project's style. Diff-based editing sends only changed portions rather than rewriting entire files. Agents follow a 'plan, code, test, iterate' loop — writing code, running tests, fixing failures, and repeating until all checks pass.",
      },
      {
        heading: "Key concepts",
        body: "Project-level instruction files (CLAUDE.md, .cursorrules) guide code style and conventions. Git-aware agents understand branches, commits, and PRs. Sandbox execution environments protect against destructive actions. Multi-file coordination keeps changes consistent across the codebase.",
      },
      {
        heading: "Example",
        body: "Claude Code reads existing API endpoints for patterns, generates a new route handler matching the project's conventions, runs the test suite to verify, fixes any lint errors flagged by Biome, and presents the complete change set — all without manual intervention.",
      },
      {
        heading: "Why it matters",
        body: "AI coding agents (Claude Code, Cursor, GitHub Copilot, Windsurf) have moved from autocomplete to autonomous task completion. They can be assigned GitHub issues and deliver working PRs, turning coding agents from assistants into collaborators.",
      },
    ],
  },
  {
    id: "autonomous-debugging",
    title: "Autonomous Debugging",
    summary:
      "Agents diagnose and fix bugs by forming hypotheses, inspecting code, running tests, and iterating on solutions in tight feedback loops.",
    details: [
      {
        heading: "How it works",
        body: "Starting from an error or failing test, the agent reads stack traces, searches for related code, forms hypotheses about root causes, applies fixes, and re-runs tests to verify. It iterates until the issue is resolved or exhausts its approach and escalates to the user.",
      },
      {
        heading: "Key concepts",
        body: "Hypothesis-driven debugging narrows down causes systematically. Stack trace parsing extracts file paths, line numbers, and error types for targeted investigation. Lint-fix loops run the linter, read violations, and apply corrections. Test-driven verification confirms fixes don't introduce regressions.",
      },
      {
        heading: "Example",
        body: "Given a failing test, the agent reads the error message, traces it to a null reference in a data transformation, finds that a recent schema change removed a required field, updates the transformation, re-runs the test suite, and confirms all tests pass before presenting the fix.",
      },
    ],
  },
  {
    id: "task-orchestration",
    title: "Multi-Step Task Orchestration",
    summary:
      "Agent frameworks like Claude Agent SDK, OpenAI Agents SDK, and LangGraph coordinate sequences of actions with state management and parallel execution.",
    details: [
      {
        heading: "How it works",
        body: "The agent operates in a loop: observe state, reason about the next action, execute a tool call, observe the result, repeat. Frameworks provide this loop with built-in tool execution, state management, guardrails, and tracing. Independent steps can run in parallel via sub-agents.",
      },
      {
        heading: "Key concepts",
        body: "The agent loop (observe-reason-act) is the core pattern. Handoffs transfer control between specialized agents. Fan-out/fan-in parallelizes independent subtasks. Human-in-the-loop gates require approval before destructive actions. Guardrails validate inputs and outputs at each step.",
      },
      {
        heading: "Example",
        body: "Using the Claude Agent SDK, a release automation agent runs tests in parallel sub-agents, bumps the version, generates a changelog, creates a build artifact, and publishes the package — with guardrails that block the publish step if any test agent reports failures.",
      },
    ],
  },
  {
    id: "multi-agent-systems",
    title: "Multi-Agent Systems",
    summary:
      "Multiple specialized agents collaborate on complex tasks through supervisor delegation, peer-to-peer coordination, or assembly-line handoffs.",
    details: [
      {
        heading: "How it works",
        body: "Instead of one agent doing everything, specialized agents handle different aspects of a task. A supervisor agent delegates subtasks, collects results, and synthesizes the final output. Alternatively, agents hand off to each other in sequence, or negotiate peer-to-peer.",
      },
      {
        heading: "Key concepts",
        body: "The supervisor pattern has one coordinator delegating to specialists. Assembly-line patterns chain agents in sequence. Shared memory or context passing maintains coherence across agents. Frameworks like OpenAI Agents SDK use explicit handoff protocols; Claude Code uses sub-agents with isolated contexts.",
      },
      {
        heading: "Example",
        body: "A code review system uses three agents: a 'security reviewer' checks for vulnerabilities, a 'style reviewer' checks conventions, and a 'logic reviewer' checks correctness. A supervisor agent collects their findings and produces a unified review with prioritized issues.",
      },
    ],
  },
  {
    id: "error-recovery",
    title: "Error Recovery & Self-Correction",
    summary:
      "Agents detect when their actions fail, analyze the error, and adjust their approach automatically rather than repeating the same mistake.",
    details: [
      {
        heading: "How it works",
        body: "After each action, the agent evaluates the result against expectations. If something fails — a command errors, a test breaks, or output looks wrong — it classifies the failure type and selects a recovery strategy: modify parameters, try an alternative approach, or escalate to the user.",
      },
      {
        heading: "Key concepts",
        body: "Result validation checks outputs after each step. Retry with variation avoids repeating the same mistake. Fallback strategies provide alternative paths. Structured error output from tools gives agents actionable information, not just 'failed.' Sandboxed execution catches errors before they cause real damage.",
      },
      {
        heading: "Example",
        body: "An agent tries to install a package and gets a version conflict. Instead of retrying, it reads the error, checks compatible versions, adjusts the version constraint, and tries again. If the agent's code edit breaks a pre-commit hook, it reads the hook output, fixes the issue, and creates a new commit.",
      },
    ],
  },
  {
    id: "knowledge-retrieval",
    title: "Knowledge Retrieval (RAG)",
    summary:
      "Agents fetch relevant information from external sources using hybrid search and agentic retrieval patterns to ground responses in accurate data.",
    details: [
      {
        heading: "How it works",
        body: "Retrieval-Augmented Generation combines the model's reasoning with external knowledge. Modern RAG uses hybrid search — combining vector similarity with keyword/BM25 search — followed by reranking for precision. Agentic RAG lets the model decide when to retrieve, reformulate queries, and synthesize across multiple retrieval rounds.",
      },
      {
        heading: "Key concepts",
        body: "Embedding models convert text to vectors for semantic search. Semantic chunking splits documents by meaning, not just token count. Contextual retrieval prepends document-level context to each chunk for better relevance. GraphRAG combines knowledge graphs with vector search for relationship-aware retrieval.",
      },
      {
        heading: "Example",
        body: "A documentation agent receives a question about an API. Instead of a single retrieval pass, it performs agentic RAG: queries the docs, reads the results, identifies gaps, reformulates its query for missing details, retrieves again, and synthesizes an accurate answer with code examples from the actual docs.",
      },
    ],
  },
  {
    id: "computer-browser-use",
    title: "Computer & Browser Use",
    summary:
      "Agents interact with graphical interfaces by taking screenshots, reasoning about visual layouts, and performing mouse and keyboard actions.",
    details: [
      {
        heading: "How it works",
        body: "Computer use agents take screenshots of the screen, analyze the visual content with multimodal vision capabilities, and issue actions like mouse clicks, typing, and scrolling. Browser use agents navigate web pages — clicking links, filling forms, and extracting data — using tools like Playwright or dedicated browser automation frameworks.",
      },
      {
        heading: "Key concepts",
        body: "Visual-spatial reasoning lets models understand UI layouts from screenshots. Action spaces define what the agent can do (click coordinates, type text, scroll). Browser agents work at a higher abstraction — interacting with DOM elements by selector rather than pixel coordinates. Safety boundaries prevent agents from accessing sensitive pages or making purchases without approval.",
      },
      {
        heading: "Why it matters",
        body: "Computer and browser use unlock tasks that require interacting with applications that have no API — legacy systems, web forms, desktop software. This extends AI agents beyond code and text into the full range of knowledge work, from data entry to application testing.",
      },
    ],
  },
  {
    id: "safety-guardrails",
    title: "Safety, Guardrails & Permissions",
    summary:
      "Production agents need permission systems, execution sandboxes, and validation guardrails to prevent unintended real-world consequences.",
    details: [
      {
        heading: "How it works",
        body: "Permission systems control which tools an agent can use and what actions require human approval. Execution sandboxes restrict filesystem access, network connectivity, and system commands. Guardrails run validation on inputs and outputs at each step, catching unsafe content or policy violations before they reach the tool.",
      },
      {
        heading: "Key concepts",
        body: "Allowlists define permitted operations; everything else is blocked by default. Approval gates pause for human confirmation before destructive actions (force-push, database writes, external messages). Input guardrails validate tool parameters; output guardrails check results. Sandbox modes disable network or limit filesystem access for untrusted code execution.",
      },
      {
        heading: "Why it matters",
        body: "Unlike chatbots, agents take real-world actions — editing files, running commands, sending messages, making API calls. A misconfigured agent can delete data, push broken code, or send unintended communications. Safety-first design with layered permissions and guardrails is essential for production agent deployments.",
      },
    ],
  },
];
