import type { CardData } from "../types";

export const helmCreate: CardData[] = [
  {
    id: "helm-create-command",
    title: "helm create — Scaffolding a Chart",
    summary:
      "The helm create command generates a complete chart directory with best-practice defaults you can modify.",
    details: [
      {
        heading: "What it scaffolds",
        body: "Run:\n\n```\nhelm create mychart\n```\n\nHelm produces: Chart.yaml (metadata), values.yaml (defaults), charts/ (dependency tarballs), templates/ (Go template manifests), templates/NOTES.txt (post-install message), templates/_helpers.tpl (reusable named templates), templates/deployment.yaml, service.yaml, serviceaccount.yaml, hpa.yaml, ingress.yaml, templates/tests/test-connection.yaml, and .helmignore.",
      },
      {
        heading: "Directory walkthrough",
        body: "Chart.yaml is the identity card — name, version, dependencies. values.yaml holds every configurable knob with sensible defaults. templates/ contains Go templates that Helm renders into K8s manifests. Files starting with _ (like _helpers.tpl) are partials, never rendered directly. The charts/ directory stores downloaded dependency charts. The optional crds/ directory holds CRDs.",
      },
      {
        heading: "Key behaviors",
        body: "If the target directory doesn't exist, Helm creates it. You can use a starter chart with --starter to scaffold from a custom template instead of the built-in default. The default scaffold targets nginx — you'll replace the image, ports, and probe configuration for your own app.",
      },
      {
        heading: "Gotcha",
        body: "The scaffolded templates are opinionated and verbose. Many teams strip them down to only what they need rather than trying to understand every conditional. Start by reading the generated _helpers.tpl — it defines the naming and labeling conventions used throughout all templates.",
      },
    ],
  },
  {
    id: "chart-yaml-deep-dive",
    title: "Chart.yaml Deep Dive",
    summary:
      "Chart.yaml is the chart's identity file with required and optional fields controlling versioning, dependencies, and compatibility.",
    details: [
      {
        heading: "Required fields",
        body: "Three mandatory fields:\n\n```\napiVersion: v2\nname: mychart\nversion: 1.2.3\n```\n\napiVersion: v2 is required for Helm 3. name must match the directory name. version must follow SemVer 2.0.0. Helm rejects a chart without them.",
      },
      {
        heading: "Important optional fields",
        body: 'type: "application" (default, installable) or "library" (not installable, provides templates). appVersion: the deployed app version — purely informational. kubeVersion: SemVer constraint on K8s version, e.g., ">= 1.27.0". deprecated: boolean marking the chart as deprecated.',
      },
      {
        heading: "Metadata fields",
        body: "description: one-line summary for helm search. keywords: list for discovery. home/sources: project URLs. icon: URL to image. maintainers: list with name, email, url. annotations: freeform key-value pairs. As of Helm 3.3.2, unlisted fields are rejected.",
      },
      {
        heading: "Dependencies block",
        body: 'Listed under dependencies: as an array:\n\n```\ndependencies:\n  - name: postgresql\n    version: "~12.1.0"\n    repository: "oci://registry-1.docker.io/bitnamicharts"\n    condition: postgresql.enabled\n    alias: db\n```\n\nOptional fields: condition (boolean path), tags (group toggling), alias (rename), import-values.\n\n```\nhelm dependency update\n```\n\nThis downloads into charts/ and generates Chart.lock.',
      },
      {
        heading: "Gotcha",
        body: "appVersion is a string, not SemVer — it can be any value like a commit SHA. Don't confuse it with version, which must be SemVer and is what Helm uses for chart comparisons. Bumping appVersion without bumping version means the chart package is identical to Helm.",
      },
    ],
  },
  {
    id: "go-template-syntax",
    title: "Writing Templates — Go Template Basics",
    summary:
      "Helm templates use Go's text/template language with {{ }} delimiters, pipelines, and whitespace control.",
    details: [
      {
        heading: "Actions",
        body: "Everything between {{ and }} is an action. Plain text outside passes through unchanged. Actions can output values, call functions, or control flow:\n\n```\n{{ .Values.name }}\n{{ quote .Values.name }}\n{{ if .Values.enabled }}...{{ end }}\n{{/* comment */}}\n```",
      },
      {
        heading: "Pipelines",
        body: 'Pipelines chain functions with |, passing the previous result as the last argument:\n\n```\n{{ .Values.name | default "app" | quote }}\n```\n\nPipelines are the idiomatic way to compose functions in Helm templates.',
      },
      {
        heading: "Whitespace control",
        body: "{{- trims all whitespace to the left. -}} trims to the right. There must be a space between the dash and the directive. This is critical because the template engine preserves all whitespace outside actions — without trimming, you get blank lines and broken YAML indentation.",
      },
      {
        heading: "Common patterns",
        body: 'Conditionally include a block:\n\n```\n{{- if .Values.tolerations }}\ntolerations:\n{{ toYaml .Values.tolerations | indent 2 }}\n{{- end }}\n```\n\nInclude a named template with proper indentation:\n\n```\n{{ include "mychart.labels" . | nindent 4 }}\n```\n\nUse nindent (not indent) when the include is inline after a key.',
      },
      {
        heading: "Gotcha",
        body: "Aggressive {{- can eat too much whitespace and merge lines. A common bug: {{- end -}} everywhere collapses YAML structure. Be surgical — only trim the side with unwanted whitespace. Use helm template to preview output and verify indentation.",
      },
    ],
  },
  {
    id: "built-in-objects",
    title: "Built-in Objects",
    summary:
      "Helm provides six top-level objects in every template: Release, Values, Chart, Capabilities, Files, and Template.",
    details: [
      {
        heading: "Release",
        body: 'Release object properties:\n\n```\n.Release.Name\n.Release.Namespace\n.Release.IsInstall\n.Release.IsUpgrade\n.Release.Revision\n.Release.Service\n```\n\n.Release.Service is always "Helm". Use Release.Name for resource naming.',
      },
      {
        heading: "Values",
        body: ".Values contains the merged result of defaults, parent overrides, -f files, and --set flags. Access nested values with dot notation:\n\n```\n{{ .Values.image.repository }}\n```\n\nAlways use default or with blocks to guard against nil values for optional nested keys.",
      },
      {
        heading: "Chart",
        body: '.Chart exposes Chart.yaml fields:\n\n```\n{{ .Chart.Name }}\n{{ .Chart.Version }}\n{{ .Chart.AppVersion }}\n```\n\nFields are title-cased when accessed — "name" becomes .Chart.Name. You cannot modify Chart values in templates.',
      },
      {
        heading: "Capabilities and Template",
        body: 'Check cluster capabilities:\n\n```\n{{ .Capabilities.KubeVersion.Version }}\n{{ .Capabilities.APIVersions.Has "batch/v1" }}\n{{ .Template.Name }}\n{{ .Template.BasePath }}\n```\n\n.Template.Name gives the full path like "mychart/templates/deployment.yaml".',
      },
      {
        heading: "Files",
        body: 'Access non-template files:\n\n```\n{{ .Files.Get "config.ini" }}\n{{ .Files.Glob "conf/*.toml" }}\n{{ (.Files.Glob "conf/*").AsConfig }}\n{{ (.Files.Glob "conf/*").AsSecrets }}\n```\n\n.Files.Lines provides line-by-line iteration. Cannot access files in templates/ or excluded by .helmignore.',
      },
    ],
  },
  {
    id: "template-functions",
    title: "Essential Template Functions",
    summary:
      "Helm provides 60+ functions from Go templates and the Sprig library for string manipulation, data conversion, and validation.",
    details: [
      {
        heading: "String and formatting",
        body: 'quote / squote — wrap in quotes. upper / lower — case conversion. replace — substitution. trim / trimPrefix / trimSuffix. contains / hasPrefix / hasSuffix — boolean tests.\n\n```\n{{ printf "%s-%s" .Release.Name .Chart.Name }}\n```',
      },
      {
        heading: "YAML and indentation",
        body: "toYaml converts any object to YAML string. Almost always piped to indent or nindent:\n\n```\n{{ .Values.resources | toYaml | nindent 6 }}\n```\n\nnindent prepends a newline then indents — use when inline after a key. indent adds spaces without a leading newline. toJson / fromJson / fromYaml for format conversion.",
      },
      {
        heading: "Defaults and validation",
        body: 'Fallback values, required fields, and error handling:\n\n```\n{{ .Values.port | default 8080 }}\n{{ required "image.repository is required" .Values.image.repository }}\n{{ coalesce .Values.a .Values.b "fallback" }}\n{{ fail "something went wrong" }}\n```',
      },
      {
        heading: "Advanced functions",
        body: 'Template evaluation and conditional logic:\n\n```\n{{ tpl .Values.myTemplate . }}\n{{ lookup "v1" "ConfigMap" "ns" "name" }}\n{{ ternary "yes" "no" .Values.enabled }}\n{{ include "mychart.labels" . }}\n```\n\ntpl evaluates a string as a template. lookup queries live cluster resources (empty with helm template).',
      },
      {
        heading: "Data structure functions",
        body: "list — create a list. dict — create a dictionary. get / set — dictionary access. merge — combine dicts. keys / values — extract from dict. pick / omit — select or exclude keys. hasKey — check existence. range and index — iterate and access. Essential for building dynamic configuration blocks.",
      },
    ],
  },
  {
    id: "flow-control",
    title: "Flow Control — if, with, range",
    summary:
      "Helm's three control structures generate conditional content, modify scope, and iterate over collections.",
    details: [
      {
        heading: "if/else",
        body: 'Conditional blocks:\n\n```\n{{ if PIPELINE }}...{{ else if PIPELINE }}...{{ else }}...{{ end }}\n```\n\nA pipeline is false for: boolean false, 0, empty string, nil, or empty collection. Operators: eq, ne, lt, gt, le, ge, and, or, not.\n\n```\n{{ if and .Values.ingress.enabled (eq .Values.ingress.className "nginx") }}\n```',
      },
      {
        heading: "with (scope modifier)",
        body: "Sets dot (.) to a new scope:\n\n```\n{{ with .Values.favorite }}\n  drink: {{ .drink }}\n{{ end }}\n```\n\nCritical: you cannot access outer objects with dot — use $ for root: {{ $.Release.Name }}. If the pipeline is empty/nil, the block is skipped (acts like an if).",
      },
      {
        heading: "range (loops)",
        body: 'Iterate over lists and maps:\n\n```\n{{ range .Values.servers }}...{{ end }}\n{{ range $key, $val := .Values.labels }}...{{ end }}\n{{ range tuple "small" "medium" "large" }}...{{ end }}\n```\n\nLike with, range changes dot scope — use $ for root.',
      },
      {
        heading: "Scope and the dollar sign",
        body: "The dot (.) is the current scope — root at top level, changes inside with and range. The $ always points to root and never changes:\n\n```\n{{ range .Values.items }}\nname: {{ $.Release.Name }}-{{ . }}\n{{ end }}\n```\n\nThis is the most common source of confusion in Helm templates.",
      },
      {
        heading: "Gotcha",
        body: 'Empty lines from if/end blocks pollute YAML. Always use {{- if ... }} and {{- end }} to trim whitespace. Another trap: {{ if .Values.foo }} is true for ANY non-empty value including "false". To check a boolean explicitly, use {{ if eq .Values.foo true }}.',
      },
    ],
  },
  {
    id: "named-templates",
    title: "Named Templates — define, template, include",
    summary:
      "Named templates are reusable blocks defined once and invoked anywhere across the chart.",
    details: [
      {
        heading: "Defining templates",
        body: 'Create named templates in _helpers.tpl:\n\n```\n{{/* Generate standard labels */}}\n{{ define "mychart.labels" }}\napp.kubernetes.io/name: {{ .Chart.Name }}\napp.kubernetes.io/instance: {{ .Release.Name }}\n{{ end }}\n```\n\nYou can split helpers across multiple _ files.',
      },
      {
        heading: "template vs include",
        body: 'template inserts output directly — cannot be piped. include returns a string — CAN be piped:\n\n```\n{{ template "mychart.labels" . }}\n{{ include "mychart.labels" . | nindent 4 }}\n```\n\nAlways prefer include over template for indentation control.',
      },
      {
        heading: "Context passing",
        body: 'The second argument sets the scope inside the named template:\n\n```\n{{ include "mychart.labels" . }}\n{{ include "mychart.labels" .Values.app }}\n```\n\nThe first passes full root context. The second passes only that subtree. Forgetting to pass context makes dot nil, causing nil pointer errors.',
      },
      {
        heading: "Naming conventions",
        body: 'Always prefix with the chart name: "mychart.fullname", "mychart.labels". Template names are globally unique across parent and subcharts — without the prefix, name collisions cause silent overwriting (last loaded wins).',
      },
      {
        heading: "_helpers.tpl standard patterns",
        body: "The scaffold defines: mychart.name (chart name, truncated to 63 chars), mychart.fullname (release-name-chart-name), mychart.chart (chart-name-version), mychart.labels (standard app.kubernetes.io/* labels), mychart.selectorLabels (immutable selectors), mychart.serviceAccountName (conditional name). These form the foundation every template references.",
      },
    ],
  },
  {
    id: "values-yaml-design",
    title: "values.yaml Design",
    summary:
      "Well-designed values.yaml makes your chart intuitive to configure with clear naming, documentation, and safe defaults.",
    details: [
      {
        heading: "Naming conventions",
        body: "Start with lowercase. Use camelCase: replicaCount, servicePort. Never use hyphens — invalid in Go templates. Never start with uppercase — conflicts with Helm built-ins. These conventions are enforced by community standards and Artifact Hub.",
      },
      {
        heading: "Flat vs nested",
        body: "Prefer flat when possible — serverName and serverPort is simpler than nesting under server:. Flat values eliminate nil checks. Use nesting only for many related variables where at least one is non-optional, like image.repository and image.tag.",
      },
      {
        heading: "Documenting values",
        body: "Document every property with a comment. This enables documentation generators like helm-docs to auto-generate README tables. Keep descriptions to one line. Always include the type implicitly through the default value.",
      },
      {
        heading: "Type safety",
        body: 'Quote string values to prevent YAML coercion: env: "true" vs env: true (boolean). In templates, use quote to ensure strings stay strings:\n\n```\n{{ .Values.name | quote }}\n```\n\nPort numbers used in env vars should be stored as strings and converted with {{ int }}.',
      },
      {
        heading: "Override-friendly design",
        body: "Prefer maps over lists for values users override — maps work with --set (servers.foo.port=80) while lists require error-prone index notation. Provide empty map {} as default instead of null. Keep values.yaml as a dev-friendly baseline with minimal resources and single replicas.",
      },
    ],
  },
  {
    id: "notes-txt",
    title: "NOTES.txt — Post-Install Instructions",
    summary:
      "templates/NOTES.txt prints user-facing instructions after helm install or upgrade.",
    details: [
      {
        heading: "How it works",
        body: "NOTES.txt in templates/ is processed like any template — all built-in objects and functions are available. The rendered output is displayed after install and upgrade but is NOT sent to Kubernetes. It's purely informational CLI output.",
      },
      {
        heading: "What to include",
        body: "How to access the app (kubectl port-forward, ingress URLs), how to get generated credentials (kubectl get secret), how to check status. Include conditional instructions based on service type and ingress configuration.",
      },
      {
        heading: "Example",
        body: 'A conditional block:\n\n```\n{{- if .Values.ingress.enabled }}\nVisit http://{{ .Values.ingress.host }}\n{{- else }}\nRun:\n  kubectl port-forward svc/{{ include "mychart.fullname" . }} 8080:{{ .Values.service.port }}\nThen visit http://127.0.0.1:8080\n{{- end }}\n```',
      },
      {
        heading: "Gotcha",
        body: "NOTES.txt is validated by helm lint — template errors block linting and installation. Since it runs through the template engine, a broken NOTES.txt can block an otherwise valid install. Test with helm template.",
      },
    ],
  },
  {
    id: "template-validation",
    title: "Template Validation — lint, template, dry-run",
    summary:
      "Three complementary commands catch progressively deeper issues: lint for structure, template for rendering, dry-run for API validation.",
    details: [
      {
        heading: "helm lint",
        body: "Static analysis on chart structure and templates. Reports [ERROR] for install failures and [WARNING] for convention violations.\n\n```\nhelm lint ./mychart -f prod-values.yaml\n```\n\nIntegrate into CI.",
      },
      {
        heading: "helm template",
        body: "Renders all templates locally without a cluster:\n\n```\nhelm template myapp ./mychart --show-only templates/deployment.yaml\nhelm template myapp ./mychart --set replicaCount=3\nhelm template myapp ./mychart --debug\n```\n\nYour primary debugging tool — run constantly while developing.",
      },
      {
        heading: "helm install --dry-run",
        body: "Requires a live cluster. Renders templates AND sends to the K8s API for validation without creating resources:\n\n```\nhelm install --dry-run=server myapp ./mychart\n```\n\nUse --dry-run=server (Helm 3.13+) for server-side validation. Catches invalid fields and wrong API versions.",
      },
      {
        heading: "Recommended workflow",
        body: "Progressive validation:\n\n```\nhelm lint ./mychart\nhelm template myapp ./mychart\nhelm template myapp ./mychart | kubectl apply --dry-run=client -f -\nhelm install --dry-run myapp ./mychart\n```\n\nIn CI, run all four.",
      },
      {
        heading: "Gotcha",
        body: "helm template cannot evaluate lookup functions (no cluster) — they return empty. --dry-run does NOT execute hooks or wait for readiness. A passing dry-run is necessary but not sufficient for catching all runtime issues.",
      },
    ],
  },
  {
    id: "packaging",
    title: "Packaging — helm package and .helmignore",
    summary:
      "helm package creates a versioned .tgz archive, and .helmignore controls excluded files.",
    details: [
      {
        heading: "helm package",
        body: "Produces a versioned archive:\n\n```\nhelm package ./mychart\nhelm package ./mychart --destination ./dist --dependency-update\nhelm package ./mychart --sign --key mykey\n```\n\nThe .tgz can be pushed to OCI registries with helm push.",
      },
      {
        heading: ".helmignore file",
        body: "Works like .gitignore — one pattern per line, placed in the chart root. Controls which files are excluded from the .tgz. Supports glob patterns, directory patterns, and negation.",
      },
      {
        heading: "What to exclude",
        body: "Always exclude: .git/, .gitignore, .vscode/, .idea/, *.swp, .DS_Store, CI config, test fixtures, and files with secrets. The goal is a clean, minimal package.",
      },
      {
        heading: "Gotcha",
        body: ".helmignore doesn't support ** (double-star) for recursive matching. Files starting with _ in templates/ are included in the package (they need to be — _helpers.tpl is essential). The .helmignore file itself is never included.",
      },
    ],
  },
  {
    id: "chart-hooks",
    title: "Chart Hooks",
    summary:
      "Hooks run Kubernetes resources at strategic lifecycle points using annotations for timing, ordering, and cleanup.",
    details: [
      {
        heading: "Hook types",
        body: 'Nine annotations for helm.sh/hook: pre-install, post-install, pre-delete, post-delete, pre-upgrade, post-upgrade, pre-rollback, post-rollback, test. A single resource can declare multiple:\n\n```\nannotations:\n  "helm.sh/hook": pre-install,pre-upgrade\n```',
      },
      {
        heading: "Hook weights and ordering",
        body: 'Execute in ascending order — negative first:\n\n```\nannotations:\n  "helm.sh/hook-weight": "-5"\n```\n\nDefault weight is 0. Use for sequencing: -10 backup, -5 migration, 0 cache warming.',
      },
      {
        heading: "Delete policies",
        body: 'Control hook cleanup:\n\n```\nannotations:\n  "helm.sh/hook-delete-policy": before-hook-creation\n```\n\nOptions: before-hook-creation (default), hook-succeeded, hook-failed. Combine: "hook-succeeded,hook-failed" for always-cleanup. Without a policy, hook resources accumulate.',
      },
      {
        heading: "Example: migration Job",
        body: 'A Job with annotations:\n\n```\nannotations:\n  "helm.sh/hook": pre-upgrade\n  "helm.sh/hook-weight": "-5"\n  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded\n```\n\nRuns migration before app pods update, cleans up on success.',
      },
      {
        heading: "Gotcha",
        body: "Hook resources are NOT managed as part of the release — helm uninstall won't delete them without a delete policy. For Jobs and Pods, Helm waits until completion. If a hook Job fails, the entire install/upgrade fails.",
      },
    ],
  },
  {
    id: "subchart-communication",
    title: "Subchart Communication",
    summary:
      "Parent charts pass values to subcharts through scoped overrides and global values that flow through the entire tree.",
    details: [
      {
        heading: "Value scoping",
        body: "Subcharts only see their own scoped values — they cannot access parent values directly. The template engine filters .Values to only the subchart's section from the parent.",
      },
      {
        heading: "Parent overrides",
        body: "In the parent's values.yaml, nest values under the subchart's name:\n\n```\npostgresql:\n  auth:\n    postgresPassword: secret\n```\n\nThe subchart accesses them normally as .Values.auth.postgresPassword.",
      },
      {
        heading: "Global values",
        body: "Values under the reserved global: key are accessible from ALL charts using .Values.global.*:\n\n```\nglobal:\n  imageRegistry: myregistry.io\n```\n\nGlobals flow down the entire dependency tree.",
      },
      {
        heading: "Shared templates",
        body: "Named templates defined in any chart are globally available. A parent can include a subchart's template and vice versa. This is how library charts work. Always prefix template names with chart name to avoid collisions.",
      },
    ],
  },
  {
    id: "values-schema-json",
    title: "values.schema.json — Input Validation",
    summary:
      "A JSON Schema file validates user-supplied values during install, upgrade, lint, and template operations.",
    details: [
      {
        heading: "How it works",
        body: "Create values.schema.json alongside values.yaml. Helm validates final merged values against this schema during install, upgrade, template, and lint. Failures block the operation with a descriptive error. Uses JSON Schema draft-07.",
      },
      {
        heading: "Common validations",
        body: 'Type enforcement, enums, and ranges:\n\n```\n{\n  "replicaCount": { "type": "integer" },\n  "pullPolicy": { "enum": ["Always", "IfNotPresent", "Never"] },\n  "port": { "minimum": 1, "maximum": 65535 }\n}\n```\n\nAlso supports required fields and string patterns for naming conventions.',
      },
      {
        heading: "Gotcha",
        body: "The schema validates MERGED values, not just overrides — your values.yaml defaults must also pass. Helm won't warn about keys missing from the schema. Subchart schemas are validated independently. Keep schema and values.yaml in sync manually — tools like helm-schema can help automate this.",
      },
    ],
  },
  {
    id: "crds-in-charts",
    title: "CRDs in Charts — the crds/ Directory",
    summary:
      "The crds/ directory holds Custom Resource Definitions installed before other resources, with significant limitations.",
    details: [
      {
        heading: "How it works",
        body: "Place CRD YAML in crds/. During helm install, Helm uploads CRDs first, waits for API registration, then renders the rest. Multiple CRDs can share a file separated by ---.",
      },
      {
        heading: "Critical limitations",
        body: "CRDs in crds/ are NOT templated — plain YAML only. They are NEVER upgraded or deleted by Helm — only installed on first helm install. Subsequent upgrades skip crds/ entirely. Use --skip-crds to skip installation.",
      },
      {
        heading: "Best practices",
        body: "For simple, stable CRDs: use crds/. For CRDs needing templating or lifecycle management: put them in templates/ instead. For shared CRDs: create a separate dedicated CRD chart. Many projects (cert-manager, Prometheus) provide separate CRD charts for this reason.",
      },
      {
        heading: "Gotcha",
        body: "Since Helm won't upgrade CRDs, use:\n\n```\nkubectl apply -f crds/\n```\n\nmanually. This is deliberate — CRDs are cluster-scoped and automatic upgrades could break other releases. The separate CRD chart approach avoids these limitations.",
      },
    ],
  },
  {
    id: "common-patterns",
    title: "Common Patterns — Labels, Naming, ConfigMaps",
    summary:
      "Standard patterns for resource labeling, naming, service accounts, and ConfigMaps make charts consistent and maintainable.",
    details: [
      {
        heading: "Standard labels",
        body: "Every resource should have: app.kubernetes.io/name, app.kubernetes.io/instance, app.kubernetes.io/version, app.kubernetes.io/managed-by, helm.sh/chart. Define in _helpers.tpl as a named template and include everywhere.",
      },
      {
        heading: "Selector labels",
        body: 'Pod selectors must be IMMUTABLE after creation. Use only name + instance for selectors — never version or chart labels that change on upgrade. Define a separate selectorLabels template. Getting this wrong causes "field is immutable" errors.',
      },
      {
        heading: "Resource naming with fullname",
        body: "The fullname helper generates a unique name combining release and chart name, truncated to 63 characters. It supports nameOverride and fullnameOverride. Always use fullname — hardcoded names cause collisions with multiple releases.",
      },
      {
        heading: "ConfigMaps and auto-rollout",
        body: 'Create ConfigMaps from files and trigger pod restart on config changes:\n\n```\ndata:\n  {{ (.Files.Glob "config/*").AsConfig | nindent 2 }}\n```\n\nAdd a pod annotation to force rolling updates:\n\n```\nchecksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}\n```',
      },
    ],
  },
];
