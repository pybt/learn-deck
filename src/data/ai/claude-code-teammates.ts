import type { CardData } from "../types";

export const claudeCodeTeammates: CardData[] = [
  {
    id: "what-are-teammates",
    title: "What Are Teammates?",
    summary:
      "Multiple Claude Code instances working together on complex tasks, coordinated through shared task lists and messaging.",
    details: [
      {
        heading: "How it works",
        body: "Agent Teams orchestrate multiple independent Claude Code instances. One session acts as the team lead — it creates the team, spawns teammates, assigns tasks, and synthesizes results. Each teammate has its own context window and can communicate with peers directly.",
      },
      {
        heading: "Teammates vs subagents",
        body: "Subagents (the Agent tool) run within a single session and only report back to the caller. Teammates are fully independent instances that can message each other, share a task list, and self-coordinate. Use subagents for focused tasks; use teammates for complex collaborative work.",
      },
      {
        heading: "Key concepts",
        body: "Teams have a 1:1 correspondence with task lists. Each teammate is a separate Claude instance with its own token budget. Teammates do not inherit the lead's conversation history — all context must be included in the spawn prompt.",
      },
    ],
  },
  {
    id: "enabling-and-creating-teams",
    title: "Enabling and Creating Teams",
    summary:
      "Teams require an experimental flag and are created with TeamCreate, which sets up config and task directories.",
    details: [
      {
        heading: "How to enable",
        body: 'Agent Teams is experimental and disabled by default. Enable it by setting the environment variable in settings.json:\n\n```\n{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }\n```',
      },
      {
        heading: "Creating a team",
        body: "Use TeamCreate with a team_name (required), plus optional description and agent_type. This creates a config file at ~/.claude/teams/{name}/config.json and a task directory at ~/.claude/tasks/{name}/.",
      },
      {
        heading: "Team lifecycle",
        body: "Create the team, populate tasks, spawn teammates, let them work, then shut down teammates with shutdown_request messages. Use TeamDelete to clean up — it fails if teammates are still active, so always shut down first.",
      },
    ],
  },
  {
    id: "spawning-teammates",
    title: "Spawning Teammates",
    summary:
      "Teammates are spawned via the Agent tool with team_name and name parameters, using different agent types for different capabilities.",
    details: [
      {
        heading: "How to spawn",
        body: "Use the Agent tool with team_name to link to an existing team, and name for a unique human-readable identifier. The name is used for all messaging and task assignment. Include detailed context in the prompt since teammates don't inherit conversation history.",
      },
      {
        heading: "Agent types",
        body: "Choose subagent_type based on the work: general-purpose has all tools (read/write/bash), Explore is read-only and fast for codebase search, Plan is read-only for architecture design. You can also define custom agents as Markdown files in .claude/agents/ with specific tools, models, and permissions.",
      },
      {
        heading: "Configuration options",
        body: 'Set model (sonnet, opus, haiku), mode for permissions (default, acceptEdits, bypassPermissions, plan, auto), and isolation: "worktree" for an isolated git worktree copy. Run teammates in the background with run_in_background: true for parallel execution.',
      },
    ],
  },
  {
    id: "task-coordination",
    title: "Task Coordination",
    summary:
      "Teams share a task list that all teammates can access, claim, and update — enabling self-organized parallel work.",
    details: [
      {
        heading: "Core tools",
        body: "TaskCreate adds tasks with subject, description, and optional activeForm (spinner text). TaskUpdate changes status (pending → in_progress → completed), sets owner, and manages dependencies with addBlocks/addBlockedBy. TaskList shows all tasks with status summaries.",
      },
      {
        heading: "Workflow",
        body: "The lead creates tasks upfront, then teammates check TaskList, claim unassigned tasks via TaskUpdate with their name as owner, mark them in_progress while working, and completed when done. Teammates should prefer tasks in ID order since earlier tasks often set up context for later ones.",
      },
      {
        heading: "Best practices",
        body: "Aim for 5-6 tasks per teammate. Each teammate should own distinct files to avoid merge conflicts. Set up task dependencies so blocked work isn't started prematurely. Teammates should check TaskList after completing each task to find the next available work.",
      },
    ],
  },
  {
    id: "messaging-and-communication",
    title: "Messaging and Communication",
    summary:
      "Teammates communicate via SendMessage with direct messages, broadcasts, and structured protocol messages for shutdown and plan approval.",
    details: [
      {
        heading: "How messaging works",
        body: 'Use SendMessage with a to field (teammate name or "*" for broadcast) and a message (plain text or structured object). Messages are delivered automatically — no polling needed. Plain text output is NOT visible to teammates; you must use SendMessage explicitly.',
      },
      {
        heading: "Protocol messages",
        body: "Structured messages handle lifecycle events: shutdown_request asks a teammate to exit (they respond with shutdown_response approving or rejecting). plan_approval_response lets the lead approve or reject a teammate's plan when spawned in plan mode. These cannot be broadcast.",
      },
      {
        heading: "Why it matters",
        body: "Broadcast is expensive — it sends a separate message to every teammate, scaling linearly with team size. Default to direct messages. Only broadcast for critical issues requiring immediate team-wide attention.",
      },
    ],
  },
  {
    id: "idle-state-and-lifecycle",
    title: "Idle State and Lifecycle",
    summary:
      "Teammates go idle after every turn — this is normal. Idle teammates can receive messages and wake up to continue working.",
    details: [
      {
        heading: "How idle works",
        body: "After each turn, teammates automatically go idle and send a notification. This is completely normal — idle means waiting for input, not done or broken. Sending a message to an idle teammate wakes them up immediately.",
      },
      {
        heading: "Display modes",
        body: "In-process mode shows all teammates in the main terminal (Shift+Down to cycle, Ctrl+T for task list). Split-pane mode gives each teammate its own tmux or iTerm2 pane for visual monitoring. Set via teammateMode in settings.json or --teammate-mode CLI flag.",
      },
      {
        heading: "Shutdown",
        body: "Send a shutdown_request to each teammate when work is complete. Teammates finish their current request before shutting down. There's a 5-minute heartbeat timeout before a crashed teammate's tasks can be reclaimed by others.",
      },
    ],
  },
  {
    id: "worktrees-and-isolation",
    title: "Worktrees and Isolation",
    summary:
      "Teammates can work in isolated git worktrees to avoid file conflicts, with changes on separate branches.",
    details: [
      {
        heading: "How it works",
        body: 'Set isolation: "worktree" when spawning a teammate via the Agent tool. This creates a temporary git worktree at .claude/worktrees/ with a new branch based on HEAD, giving the teammate an isolated copy of the repository.',
      },
      {
        heading: "Cleanup behavior",
        body: "Worktrees are automatically cleaned up if the teammate makes no changes. If changes are made, the worktree path and branch name are returned in the result so the lead can merge or review. Dedicated EnterWorktree/ExitWorktree tools also exist for manual control.",
      },
      {
        heading: "When to use",
        body: "Use worktrees when multiple teammates need to edit the same files, when you want to review changes before merging, or when teammates are working on competing approaches to the same problem. Skip worktrees for read-only tasks or when teammates own distinct files.",
      },
    ],
  },
  {
    id: "quality-gates",
    title: "Quality Gates with Hooks",
    summary:
      "Plan approval mode and lifecycle hooks let the lead review teammate work before it takes effect.",
    details: [
      {
        heading: "Plan approval",
        body: 'Spawn a teammate with mode: "plan" to restrict them to read-only exploration. When they call ExitPlanMode, the lead receives a plan_approval_request and can approve (teammate proceeds with implementation) or reject with feedback (teammate revises the plan).',
      },
      {
        heading: "Lifecycle hooks",
        body: "TeammateIdle hook runs when a teammate is about to go idle — exit 0 allows it, exit 2 sends feedback and the teammate continues working. TaskCompleted hook runs when a task is being marked complete — exit 2 blocks completion and sends feedback to the teammate.",
      },
      {
        heading: "Why it matters",
        body: "Quality gates prevent teammates from producing low-quality work without review. Plan mode is especially useful for architectural decisions where the lead wants to validate the approach before code is written.",
      },
    ],
  },
  {
    id: "best-practices",
    title: "Best Practices",
    summary:
      "Start with 3-5 teammates, give them distinct file ownership, include full context in prompts, and use descriptive names.",
    details: [
      {
        heading: "Team sizing",
        body: "Start with 3-5 teammates. Each teammate is a separate Claude instance with its own token cost, so scale thoughtfully. Assign 5-6 tasks per teammate for optimal throughput. Each should own distinct files to avoid merge conflicts.",
      },
      {
        heading: "Context and naming",
        body: 'Include all necessary context in spawn prompts — teammates start fresh with no conversation history. Use descriptive names like "security-reviewer" or "frontend-dev" instead of generic "worker-1". Always refer to teammates by name for messaging and task assignment.',
      },
      {
        heading: "Best use cases",
        body: "Teams excel at parallel research and review, building new modules or features with distinct boundaries, debugging with competing hypotheses, and cross-layer coordination (e.g., frontend, backend, and tests simultaneously). For simple focused tasks, subagents are more cost-effective.",
      },
    ],
  },
  {
    id: "limitations",
    title: "Limitations and Gotchas",
    summary:
      "One team per session, no nested teams, no session resumption, and each teammate is a separate billed instance.",
    details: [
      {
        heading: "Key constraints",
        body: "Only one team per session — clean up before starting another. Teammates cannot spawn their own teams (no nesting). Team leadership cannot be transferred. /resume and /rewind don't restore in-process teammates.",
      },
      {
        heading: "Cost considerations",
        body: "Each teammate is a separate Claude instance — costs scale linearly with team size. Broadcasts send a message to every teammate individually. Use subagents for simpler tasks where only the result matters, not ongoing coordination.",
      },
      {
        heading: "Operational gotchas",
        body: "Teammates sometimes fail to mark tasks completed — monitor TaskList periodically. Shutdown isn't instant — teammates finish their current request first. There's a 5-minute heartbeat timeout before crashed teammates' tasks can be reclaimed.",
      },
    ],
  },
];
