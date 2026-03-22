import type { CardData } from "../types";

export const buildAgentSkills: CardData[] = [
  {
    id: "agent-architecture",
    title: "Agent Architecture Patterns",
    summary:
      "Build agents follow an observe-reason-act loop — reading build output, deciding the next step, and executing tool calls until the build succeeds or the agent escalates.",
    details: [
      {
        heading: "How it works",
        body: "A build agent operates in a ReAct-style loop: observe the current state (error logs, file contents, test results), reason about what action to take, execute a tool call, then observe the result. Frameworks like Claude Agent SDK and OpenAI Agents SDK provide this loop with built-in tool execution, state management, and tracing.",
      },
      {
        heading: "Key concepts",
        body: "The core loop consists of perception (reading files, logs, command output), planning (deciding the next step), and action (running commands, editing files). Agents need clear stopping conditions — either success criteria are met or a maximum iteration count is reached. Guardrails validate each action before execution.",
      },
      {
        heading: "Why it matters",
        body: "Understanding the agent loop helps you design agents that are predictable and debuggable. A well-structured loop with explicit state transitions makes it easy to trace why an agent took a particular action and where it went wrong. Modern tracing tools like LangSmith provide visibility into every step.",
      },
    ],
  },
  {
    id: "tool-design",
    title: "Designing Build Tools",
    summary:
      "Effective build agent tools have clear interfaces, return structured output, and can be exposed as MCP servers for interoperability across different agent clients.",
    details: [
      {
        heading: "How it works",
        body: "Each tool is a function the agent can call with typed parameters. The tool executes an action (run a command, read a file, make an API call) and returns a structured result. Tools can be implemented as MCP servers, making them reusable across any MCP-compatible agent — Claude Code, Cursor, or custom agents.",
      },
      {
        heading: "Key concepts",
        body: "Tools should return both the result and relevant metadata (exit codes, file paths modified, timing). Error responses should include actionable information, not just 'failed.' Idempotent tools are safer — running them twice produces the same result. Structured output (JSON) is preferred over human-readable text for machine consumption.",
      },
      {
        heading: "Example",
        body: "A 'run_tests' MCP tool accepts a file glob, executes the test runner, and returns structured output:\n\n```\n{ passed: 42, failed: 2, failures: [{ test: 'auth.test.ts', error: 'timeout', line: 55 }] }\n```\n\nAny MCP client can invoke this tool and parse the results for next-step reasoning.",
      },
    ],
  },
  {
    id: "context-management",
    title: "Context Window Management",
    summary:
      "Build agents must strategically manage their context window — even with 200K-1M token windows, large codebases and verbose build logs demand selective loading.",
    details: [
      {
        heading: "How it works",
        body: "Rather than loading entire files or full build logs, effective agents read targeted sections — specific line ranges, filtered log output, or summarized results. With context windows now reaching 200K-1M tokens, agents can hold more, but large monorepos and verbose CI logs still demand discipline.",
      },
      {
        heading: "Key concepts",
        body: "Use grep and targeted reads instead of reading whole files. Summarize long command outputs before adding them to context. Prompt caching reuses system prompts and tool definitions across calls, reducing cost. Sub-agents can handle isolated subtasks in their own context, reporting only results back to the parent.",
      },
      {
        heading: "Why it matters",
        body: "Even with 1M token windows, a build agent working on a large monorepo can exhaust context by reading too many files or full build logs. Strategic context management and sub-agent delegation are the difference between an agent that scales to real projects and one that only works on toy examples.",
      },
    ],
  },
  {
    id: "error-recovery",
    title: "Error Recovery Strategies",
    summary:
      "Robust build agents detect, classify, and recover from failures by parsing structured error output, trying alternative approaches, and knowing when to escalate.",
    details: [
      {
        heading: "How it works",
        body: "When a build step fails, the agent parses the error output to classify the failure type (syntax error, missing dependency, test failure, timeout). Based on the classification, it selects a recovery strategy: fix the code, install a package, retry with different parameters, or escalate to the user with a clear explanation.",
      },
      {
        heading: "Key concepts",
        body: "Distinguish between retryable errors (network timeouts, flaky tests) and deterministic failures (syntax errors, missing imports). Set retry limits to avoid infinite loops. Keep a history of attempted fixes to avoid repeating the same failed approach. Structured error output from build tools gives the agent actionable data for recovery.",
      },
      {
        heading: "Example",
        body: "A build fails with:\n\n```\nModule not found: react-query\n```\n\nThe agent recognizes this as a missing dependency, checks package.json to confirm it's not listed, runs the install command, and retries the build. If the pre-commit hook fails after a fix, the agent reads the hook output, addresses the lint error, and creates a new commit rather than amending.",
      },
    ],
  },
  {
    id: "build-orchestration",
    title: "Build Pipeline Orchestration",
    summary:
      "Build agents coordinate multi-step pipelines — installing dependencies, compiling, linting, testing, and packaging — with dependency-aware ordering and parallel execution.",
    details: [
      {
        heading: "How it works",
        body: "The agent maintains a DAG (directed acyclic graph) of build steps. Dependencies must complete before dependents start. Steps without dependencies can run in parallel via sub-agents. The agent monitors each step's status and handles failures according to the pipeline's error policy — fail-fast or fail-tolerant.",
      },
      {
        heading: "Key concepts",
        body: "Common pipeline stages: dependency installation, code generation, compilation, linting, unit tests, integration tests, packaging. Fail-fast stops on the first error. Fail-tolerant continues to collect all errors. Tools like Turborepo and Nx provide task-graph-aware execution for monorepos. GitHub Actions and other CI systems integrate AI agents for autonomous pipeline management.",
      },
      {
        heading: "Why it matters",
        body: "Efficient orchestration dramatically reduces build times. Running lint and unit tests in parallel while integration tests wait for compilation saves minutes per build. AI agents that understand the dependency graph prevent wasted work and confusing error cascades.",
      },
    ],
  },
  {
    id: "caching-strategies",
    title: "Build Caching & Incrementality",
    summary:
      "Smart caching lets build agents skip unchanged work by tracking content hashes, dependency versions, and remote shared caches.",
    details: [
      {
        heading: "How it works",
        body: "Before running a build step, the agent checks if inputs (source files, dependencies, configuration) have changed since the last successful run. If nothing changed, it reuses the cached output. Content hashing is more reliable than timestamps. Remote caches share build artifacts across machines, CI runs, and developers.",
      },
      {
        heading: "Key concepts",
        body: "Layer caching (Docker) reuses unchanged image layers. Dependency caching stores node_modules or pip packages between builds. Turborepo and Nx provide remote caching for monorepo task graphs. Docker Build Cloud offers cloud-based build caching shared across teams. The Dockerfile RUN --mount=type=cache instruction caches package manager directories across builds.",
      },
      {
        heading: "Example",
        body: "An agent building a TypeScript monorepo with Turborepo hashes each package's source files. If only packages/api changed, it fetches cached builds for packages/shared and packages/ui from the remote cache, recompiles only packages/api, and re-links. Build time drops from 3 minutes to 30 seconds.",
      },
    ],
  },
  {
    id: "environment-management",
    title: "Environment & Dependency Management",
    summary:
      "Build agents handle environment setup reliably — installing correct tool versions, resolving dependencies, and ensuring reproducible builds through containers and lockfiles.",
    details: [
      {
        heading: "How it works",
        body: "The agent reads configuration files (package.json, pyproject.toml, .tool-versions) to determine required runtimes and dependencies. It verifies the environment matches requirements, installs missing tools, and resolves dependency conflicts before starting the build. Dev containers provide fully reproducible environments.",
      },
      {
        heading: "Key concepts",
        body: "Lockfiles (bun.lock, package-lock.json, poetry.lock) ensure reproducible dependency resolution. Version managers (mise, nvm, pyenv) handle runtime versions. Dev containers (.devcontainer.json) provide full environment isolation with pre-configured toolchains. Docker init scaffolds best-practice Dockerfiles and compose files for any language.",
      },
      {
        heading: "Why it matters",
        body: "The most common build failure is 'works on my machine' — environment differences between developers and CI. An agent that validates and sets up its environment before building catches these issues immediately instead of producing cryptic errors mid-build.",
      },
    ],
  },
  {
    id: "output-parsing",
    title: "Build Output Parsing",
    summary:
      "Agents extract structured information from build tool output — error locations, warning counts, test results — to drive their decision-making loop.",
    details: [
      {
        heading: "How it works",
        body: "Build tools output errors in predictable formats (file:line:column for compilers, stack traces for test runners). The agent uses pattern matching or structured output modes (--json flags) to extract actionable data like error locations, failure reasons, and suggested fixes.",
      },
      {
        heading: "Key concepts",
        body: "Prefer structured output formats (JSON, TAP) over parsing human-readable text. When parsing is necessary, use the tool's documented error format. Extract file paths, line numbers, and error codes to enable targeted fixes rather than broad re-reads. Modern tools like Biome, ESLint, and TypeScript all support JSON output.",
      },
      {
        heading: "Example",
        body: "TypeScript compiler output:\n\n```\nsrc/api.ts(42,5): error TS2345: Argument of type string is not assignable to parameter of type number.\n```\n\nThe agent extracts file, line, col, and error code, reads that specific location, and applies a type-correct fix.",
      },
    ],
  },
  {
    id: "testing-integration",
    title: "Test Execution & Feedback Loops",
    summary:
      "Build agents run tests to validate changes, using test results as feedback to iteratively fix code until all checks pass.",
    details: [
      {
        heading: "How it works",
        body: "After making a code change, the agent runs the relevant test suite and examines results. Failed tests provide specific feedback — expected vs actual values, stack traces, assertion messages. The agent uses this feedback to refine its changes and re-run tests in a tight change-test-fix loop.",
      },
      {
        heading: "Key concepts",
        body: "Run only affected tests first for fast feedback, then the full suite for confidence. Track which tests were previously passing to detect regressions. Set a maximum number of fix-test iterations to prevent infinite loops on fundamentally broken approaches. SWE-Bench measures how well agents handle this loop on real-world GitHub issues.",
      },
      {
        heading: "Why it matters",
        body: "Tests are the build agent's ground truth. Without test feedback, an agent can only guess whether its changes are correct. The tight loop of change-test-fix is what makes build agents reliable enough for production use — they prove their work is correct.",
      },
    ],
  },
  {
    id: "security-scanning",
    title: "Security & Supply Chain Gates",
    summary:
      "Build agents integrate vulnerability scanning, SBOM generation, and supply chain verification as mandatory pipeline gates before producing final artifacts.",
    details: [
      {
        heading: "How it works",
        body: "The agent runs security tools (Docker Scout, npm audit, Trivy, Snyk) to scan dependencies for known vulnerabilities. Static analysis tools (ESLint security rules, Semgrep, CodeQL) check source code. SBOM (Software Bill of Materials) generation documents every component. These checks block the build if critical issues are found.",
      },
      {
        heading: "Key concepts",
        body: "Shift-left security catches issues during build rather than in production. SLSA (Supply-chain Levels for Software Artifacts) defines provenance requirements. Sigstore/cosign provides keyless signing for artifacts. Docker Scout provides continuous vulnerability monitoring with remediation recommendations. Severity thresholds determine which findings block the build.",
      },
      {
        heading: "Example",
        body: "The agent runs Docker Scout and finds a critical CVE in the base image. It checks Scout's recommendations, updates the base image tag in the Dockerfile, rebuilds, re-scans to confirm the fix, generates an SBOM, signs the artifact with cosign, and continues the pipeline.",
      },
    ],
  },
];
