import type { CardData } from "../types";

export const qaIntroduction: CardData[] = [
  {
    id: "what-is-qa",
    title: "What Is Software QA?",
    summary:
      "Quality Assurance is a proactive, process-oriented discipline that ensures software meets defined standards throughout the entire SDLC — not just at the end.",
    details: [
      {
        heading: "How it works",
        body: "QA embeds quality practices into every SDLC phase: requirements review, design inspection, code review, testing, and post-release monitoring. Rather than catching defects after the fact, QA establishes processes, standards, and checkpoints that prevent defects from being introduced. Think of QA as the system of guardrails, not the crash test.",
      },
      {
        heading: "Role in the SDLC",
        body: "During requirements: QA reviews specs for testability and completeness. During design: QA validates architecture against quality attributes. During development: QA enforces coding standards, static analysis, and peer review. During testing: QA designs and executes test strategies. Post-release: QA monitors production metrics, user feedback, and defect trends to drive continuous improvement.",
      },
      {
        heading: "Why it matters",
        body: "Defects found in production cost 10-100x more to fix than those caught during requirements or design. Organizations with mature QA processes report up to 45% faster defect resolution. QA is increasingly a team-wide responsibility — every engineer contributes to quality, with QA specialists focusing on strategy, tooling, and process improvement.",
      },
    ],
  },
  {
    id: "qa-vs-qc-vs-testing",
    title: "QA vs QC vs Testing",
    summary:
      "QA prevents defects through process improvement, QC detects defects in finished work products, and Testing is the execution of tests — three distinct but complementary activities.",
    details: [
      {
        heading: "Quality Assurance (QA)",
        body: "QA is process-oriented and proactive. It focuses on establishing and improving the processes used to create software: coding standards, review checklists, CI/CD pipeline design, and workflow optimization. The analogy: QA is the hygiene rules in a kitchen — preventing contamination before it happens. QA asks: 'Are we building the product the right way?'",
      },
      {
        heading: "Quality Control (QC)",
        body: "QC is product-oriented and reactive. It inspects the work products (code, builds, releases) to verify they meet specifications. QC activities include code reviews, test execution, and build validation. The analogy: QC is the food inspector tasting the final dish. QC asks: 'Does this product meet the requirements?'",
      },
      {
        heading: "Testing",
        body: "Testing is a subset of QC — the specific activity of executing software with the intent of finding defects. It includes writing test cases, running automated suites, exploratory testing, and performance benchmarking. Testing provides evidence about quality but does not by itself improve processes (that is QA's job).",
      },
      {
        heading: "Practical example",
        body: "QA: Establishing a rule that all PRs require automated tests and a peer review before merge. QC: Reviewing a specific PR to confirm it has tests, passes lint, and meets acceptance criteria. Testing: Running the test suite against the PR build to detect regressions. All three work together — QA sets the standard, QC verifies compliance, and Testing provides the data.",
      },
    ],
  },
  {
    id: "types-of-testing",
    title: "Types of Testing",
    summary:
      "The test pyramid organizes testing into layers — unit, integration, system, and acceptance — with additional types like regression and smoke testing serving specific purposes.",
    details: [
      {
        heading: "Unit testing (base of the pyramid)",
        body: "Tests individual functions, methods, or classes in isolation. Fast (milliseconds), cheap to maintain, and should form 70-80% of your test suite. Dependencies are mocked or stubbed. Example: testing that a calculateTax() function returns the correct value for given inputs. Frameworks: Jest, Vitest, pytest, JUnit, Go's testing package.",
      },
      {
        heading: "Integration testing (middle layer)",
        body: "Tests how components work together — API endpoints with databases, services with message queues, or modules with external APIs. Slower than unit tests because they involve real dependencies (or realistic fakes like testcontainers). Should comprise 15-20% of your suite. Example: verifying that a REST endpoint correctly writes to and reads from a PostgreSQL database.",
      },
      {
        heading: "System and acceptance testing (top layer)",
        body: "System testing validates the complete application against requirements in a production-like environment. Acceptance testing (UAT) confirms the system meets business needs from the user's perspective. These are the most expensive to run and maintain — keep them to 5-10% of your suite. Tools: Cypress, Playwright, Selenium for browser-based E2E tests.",
      },
      {
        heading: "Specialized testing types",
        body: "Regression testing: Re-running tests after changes to ensure nothing broke — typically automated in CI. Smoke testing: A quick, broad check that critical paths work after a deployment. Sanity testing: A narrow, focused check on a specific fix or feature. Exploratory testing: Unscripted, human-driven testing guided by experience and intuition — finds edge cases automation misses.",
      },
    ],
  },
  {
    id: "test-automation-fundamentals",
    title: "Test Automation Fundamentals",
    summary:
      "Test automation replaces repetitive manual test execution with scripts that run consistently, enabling fast feedback loops and reliable regression detection at scale.",
    details: [
      {
        heading: "What to automate",
        body: "Automate tests that are: run frequently (regression suites), deterministic (same input = same output), time-consuming manually (data-driven scenarios), or critical path (login, checkout, core workflows). Keep manual: exploratory testing, usability evaluation, edge cases still being understood, and tests that change too frequently to maintain automation ROI.",
      },
      {
        heading: "The test pyramid in practice",
        body: "Follow the pyramid: many fast unit tests, fewer integration tests, minimal E2E tests. Anti-pattern: the 'ice cream cone' where most tests are slow E2E/UI tests and few are unit tests. A healthy ratio might be 70% unit, 20% integration, 10% E2E. This gives fast feedback (unit tests in seconds) while still validating real user workflows (E2E tests in minutes).",
      },
      {
        heading: "Key frameworks and tools",
        body: "Unit: Jest/Vitest (JS/TS), pytest (Python), JUnit (Java), Go testing. Integration: Testcontainers (real databases in Docker), Supertest (HTTP). E2E: Playwright (recommended for new projects — fast, reliable, multi-browser), Cypress. API: Postman/Newman, REST Assured. Mobile: Appium, Detox. All should integrate into CI pipelines for automated execution on every commit.",
      },
      {
        heading: "Best practices",
        body: "Tests should be independent (no shared state), deterministic (no flaky tests), and fast. Use descriptive test names that explain the expected behavior. Follow the Arrange-Act-Assert pattern. Maintain test data factories instead of hardcoded fixtures. Track flaky tests and fix or quarantine them immediately — flaky tests erode team trust in the test suite.",
      },
    ],
  },
  {
    id: "qa-methodologies",
    title: "QA Methodologies: Shift-Left, TDD, BDD",
    summary:
      "Modern QA shifts testing earlier in the SDLC with methodologies like shift-left testing, Test-Driven Development, and Behavior-Driven Development to catch defects when they are cheapest to fix.",
    details: [
      {
        heading: "Shift-left testing",
        body: "Move testing activities earlier in the SDLC — from 'test after code' to 'test during and before code.' Practices include: reviewing requirements for testability, writing tests before or alongside code, running static analysis and security scans in CI, and involving QA in design discussions. By 2026, shift-left has converged with shift-right (production monitoring) for full-lifecycle quality.",
      },
      {
        heading: "Test-Driven Development (TDD)",
        body: "The Red-Green-Refactor cycle: (1) Write a failing test that defines the desired behavior. (2) Write the minimum code to make it pass. (3) Refactor while keeping tests green. TDD produces code with high test coverage by design, makes refactoring safe, and serves as living documentation. It works best for business logic and algorithmic code. Aim for 70-80% coverage of core business logic.",
      },
      {
        heading: "Behavior-Driven Development (BDD)",
        body: "BDD bridges the gap between technical and non-technical stakeholders using a shared language. Tests are written in Given-When-Then format (Gherkin syntax):\n\n```\nGiven a user has items in their cart\nWhen they proceed to checkout\nThen they see an order summary\n```\n\nTools: Cucumber, SpecFlow, behave (Python). BDD scenarios become executable acceptance criteria that both product owners and engineers can read.",
      },
      {
        heading: "Choosing the right approach",
        body: "TDD excels for developer-facing code with clear inputs/outputs. BDD excels when business stakeholders need to validate behavior. Shift-left is an overarching strategy that encompasses both. In practice, most teams combine them: BDD for feature-level acceptance criteria, TDD for implementation-level unit tests, and shift-left principles for integrating security and performance testing early.",
      },
    ],
  },
  {
    id: "test-planning",
    title: "Test Planning and Test Cases",
    summary:
      "A test plan defines the strategy, scope, resources, and schedule for testing, while test cases are the specific steps that verify individual requirements or behaviors.",
    details: [
      {
        heading: "Test plan essentials",
        body: "A test plan answers: What is being tested (scope)? What is not being tested (exclusions)? What types of testing will be performed? What are the entry and exit criteria? What environments, tools, and data are needed? Who is responsible for what? Risk-based testing prioritizes areas with the highest business impact and defect likelihood, focusing effort where it matters most.",
      },
      {
        heading: "Writing effective test cases",
        body: "Each test case should have: a unique ID, a clear title describing the scenario, preconditions, step-by-step actions, expected results, and actual results. Use equivalence partitioning (testing one value per input class) and boundary value analysis (testing at edges) to minimize cases while maximizing coverage. Example: for an age field accepting 18-65, test values 17, 18, 40, 65, and 66.",
      },
      {
        heading: "Modern approaches",
        body: "Agile teams often replace heavyweight test plan documents with lightweight strategies: user stories with acceptance criteria serve as test specifications, BDD scenarios become executable test cases, and test charters guide exploratory sessions. The goal is living documentation that evolves with the codebase, not shelf-ware documents that go stale.",
      },
      {
        heading: "Test management tools",
        body: "TestRail, Xray (Jira plugin), Zephyr, and qTest help teams organize, execute, and report on test cases. For lightweight needs, many teams use Jira tickets or GitHub Issues with checklists. The key is traceability — linking test cases to requirements so you can answer: 'Is this requirement tested?' and 'What does this test verify?'",
      },
    ],
  },
  {
    id: "bug-lifecycle",
    title: "Bug Lifecycle and Defect Management",
    summary:
      "Defects follow a structured lifecycle from discovery to closure, with clear states, ownership transitions, and severity/priority classifications that drive resolution order.",
    details: [
      {
        heading: "Defect lifecycle states",
        body: "New: Tester discovers and logs the defect. Assigned: Triaged and assigned to a developer. Open: Developer begins investigation. Fixed: Developer commits a fix. Retest: QA verifies the fix in the appropriate environment. Closed: Fix confirmed, defect resolved. Additional states include Deferred (fix postponed), Rejected (not a bug or won't fix), and Reopened (fix did not resolve the issue).",
      },
      {
        heading: "Writing effective bug reports",
        body: "A good bug report includes: summary (one-line description), steps to reproduce (numbered, specific), expected vs actual behavior, environment details (OS, browser, version), severity and priority, and supporting evidence (screenshots, logs, video). The most important element is reproducibility — a bug that cannot be reproduced cannot be reliably fixed.",
      },
      {
        heading: "Severity vs priority",
        body: "Severity measures technical impact: Critical (system crash, data loss), Major (feature broken, no workaround), Minor (feature broken, workaround exists), Trivial (cosmetic issue). Priority measures business urgency: how soon it must be fixed. A typo on the homepage is low severity but may be high priority. A crash in a rarely used admin screen is high severity but may be lower priority.",
      },
      {
        heading: "Modern defect management",
        body: "Teams with formal defect processes resolve bugs up to 45% faster. Modern tools include Jira, Linear, GitHub Issues, and Shortcut. Best practices: triage defects regularly (daily or per-sprint), set SLAs by severity (e.g., Critical: 4h response, Major: 24h), track defect escape rate (bugs reaching production), and conduct root cause analysis on recurring defect patterns to improve upstream processes.",
      },
    ],
  },
  {
    id: "cicd-qa-integration",
    title: "CI/CD and QA Integration",
    summary:
      "Integrating QA into CI/CD pipelines provides automated quality gates at every stage — from commit to production — enabling fast, confident releases.",
    details: [
      {
        heading: "CI pipeline quality gates",
        body: "On every commit or PR, the CI pipeline should run: static analysis and linting (seconds), unit tests (seconds to minutes), integration tests (minutes), security scans — SAST for code vulnerabilities, SCA for dependency vulnerabilities. All gates must pass before a merge is allowed. This catches the majority of defects within minutes of introduction.",
      },
      {
        heading: "CD pipeline quality gates",
        body: "Before deployment: run E2E tests against a staging environment, check test coverage thresholds (fail the build if coverage drops), validate infrastructure as code. After deployment: run smoke tests against the live environment, monitor error rates and performance metrics, use canary or blue-green deployments to limit blast radius. Automated rollback triggers if error rates spike.",
      },
      {
        heading: "Pipeline best practices",
        body: "Keep the feedback loop fast — tests should complete in under 10 minutes to preserve developer flow. Parallelize test execution across multiple runners. Use the test pyramid to keep fast tests dominant. Cache dependencies to reduce build times. Run slow tests (E2E, performance) on a scheduled basis or only on the main branch, not on every PR.",
      },
      {
        heading: "Tools and integration",
        body: "CI/CD: GitHub Actions, GitLab CI, Jenkins, CircleCI. Test reporting: Allure, ReportPortal for dashboards and trend analysis. Quality gates: SonarQube for code quality and coverage thresholds. Container testing: Testcontainers for spinning up real databases in CI. The pipeline itself becomes the primary QA enforcement mechanism — no manual gating required for standard releases.",
      },
    ],
  },
  {
    id: "non-functional-testing",
    title: "Non-Functional Testing",
    summary:
      "Non-functional testing evaluates how well software performs under various conditions — covering performance, security, usability, reliability, and accessibility beyond feature correctness.",
    details: [
      {
        heading: "Performance testing",
        body: "Load testing: Simulates expected concurrent users to measure response times and throughput. Stress testing: Pushes beyond normal load to find breaking points. Spike testing: Tests sudden traffic surges. Soak/endurance testing: Runs sustained load over hours to detect memory leaks. Key metrics: response time (p50, p95, p99), throughput (requests/second), error rate, and resource utilization. Tools: k6, JMeter, Gatling, Locust.",
      },
      {
        heading: "Security testing",
        body: "SAST (Static Application Security Testing): Scans source code for vulnerabilities before deployment — catches SQL injection, XSS, hardcoded secrets. DAST (Dynamic Application Security Testing): Tests running applications for exploitable vulnerabilities. SCA (Software Composition Analysis): Scans dependencies for known CVEs. Penetration testing: Simulated attacks by security professionals. Integrate SAST and SCA into CI; run DAST against staging environments.",
      },
      {
        heading: "Usability and accessibility",
        body: "Usability testing: Observing real users completing tasks to identify friction points. Measures task completion rate, time on task, and error rate. Accessibility testing: Ensuring compliance with WCAG 2.2 guidelines — screen reader compatibility, keyboard navigation, color contrast, alt text. Tools: axe-core (automated accessibility scanning), Lighthouse (Chrome DevTools). Automated checks catch about 30-40% of accessibility issues; manual testing is essential for the rest.",
      },
      {
        heading: "Reliability and compatibility",
        body: "Reliability testing: Chaos engineering (intentionally injecting failures) validates that the system degrades gracefully. Tools: Chaos Monkey, Litmus, Gremlin. Compatibility testing: Verifying behavior across browsers (BrowserStack, Playwright multi-browser), devices (mobile, tablet, desktop), and operating systems. Cross-browser testing is especially critical for web applications where rendering differences can break layouts.",
      },
    ],
  },
  {
    id: "qa-metrics",
    title: "QA Metrics and Reporting",
    summary:
      "QA metrics quantify software quality and testing effectiveness, enabling data-driven decisions about release readiness, process improvements, and resource allocation.",
    details: [
      {
        heading: "Core testing metrics",
        body: "Test pass rate: Percentage of tests passing (target: >95% for release). Test coverage: Percentage of code exercised by tests (target: 70-80% for core logic). Defect density: Defects per KLOC (thousand lines of code) — lower is better. Defect detection rate: Percentage of defects found before production. Automation coverage: Percentage of test cases that are automated (mature teams target 60-80%).",
      },
      {
        heading: "Process metrics",
        body: "Defect escape rate: Bugs found in production vs total bugs — the key QA effectiveness metric. Mean Time to Detect (MTTD): How quickly defects are discovered. Mean Time to Resolve (MTTR): How quickly defects are fixed. Defect removal efficiency (DRE): Defects found pre-release divided by total defects (pre + post release). A DRE above 95% indicates a mature QA process.",
      },
      {
        heading: "Business-aligned metrics",
        body: "81% of executives now link software quality directly to customer satisfaction and revenue. Key business metrics: deployment frequency (how often you release), change failure rate (percentage of deployments causing incidents), customer-reported defects per release, and uptime/availability (99.9% = 8.7h downtime/year). The DORA metrics (deployment frequency, lead time, change failure rate, MTTR) bridge engineering quality and business outcomes.",
      },
      {
        heading: "Reporting and dashboards",
        body: "Use real-time dashboards rather than periodic reports — tools like Allure, ReportPortal, TestRail, or Grafana provide trend visualization. Key views: test execution trends over time, defect aging (how long bugs stay open), flaky test tracking, and release readiness scorecards. Report quality trends, not just snapshots — a declining defect escape rate matters more than a single sprint's pass rate.",
      },
    ],
  },
];
