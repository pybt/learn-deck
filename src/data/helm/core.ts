import type { CardData } from "../types";

export const helm: CardData[] = [
  {
    id: "what-is-helm",
    title: "What Is Helm",
    summary:
      "Helm is the package manager for Kubernetes — a CNCF graduated project that packages pre-configured resources into reusable, versioned charts.",
    details: [
      {
        heading: "How it works",
        body: "Helm bundles Kubernetes manifests into units called charts that can be installed, upgraded, and rolled back as a single release. Helm 3 operates as a client-side binary that talks directly to the Kubernetes API using your kubeconfig credentials — no server-side component needed. Current stable versions are in the 3.14-3.16+ range.",
      },
      {
        heading: "Key concepts",
        body: "A chart is a package of K8s resources. A release is a running instance of a chart in a cluster. A revision is a snapshot of a release at a point in time, incremented on each install, upgrade, or rollback. A repository is where charts are stored — either a traditional HTTP server or an OCI-compliant container registry.",
      },
      {
        heading: "Why it matters",
        body: "Without Helm, deploying complex applications means managing dozens of individual YAML files, tracking versions manually, and handling upgrades by hand. Helm solves the copy-paste YAML problem with templating, versioning, dependency management, and release lifecycle control.",
      },
    ],
  },
  {
    id: "chart-structure",
    title: "Chart Structure",
    summary:
      "A Helm chart is a directory with a defined layout including Chart.yaml, templates, and default values.",
    details: [
      {
        heading: "How it works",
        body: "A chart directory contains Chart.yaml (metadata), values.yaml (defaults), a templates/ folder (Go templates that render K8s manifests), and optionally charts/ (dependencies), crds/ (Custom Resource Definitions), and templates/NOTES.txt (post-install instructions).",
      },
      {
        heading: "Key concepts",
        body: "Chart.yaml requires apiVersion: v2, name, and version (SemVer). The appVersion field is informational and tracks the deployed app version. Charts can be type application (default, installable) or library (non-installable, provides shared template helpers). The _helpers.tpl file holds reusable named templates.",
      },
      {
        heading: "Example",
        body: "A typical chart: Chart.yaml with name my-webapp and version 1.0.0, values.yaml with replicaCount: 3 and image settings, templates/deployment.yaml using:\n\n```\n{{ .Values.replicaCount }}\n```\n\nand a templates/service.yaml exposing the app.",
      },
      {
        heading: "Why it matters",
        body: "The standardized structure makes charts portable and shareable. Anyone can inspect values.yaml to see what's configurable, read NOTES.txt for usage instructions, and trust that the layout follows Helm conventions.",
      },
    ],
  },
  {
    id: "helm-cli-commands",
    title: "Essential CLI Commands",
    summary:
      "Helm's CLI covers the full lifecycle: create, install, upgrade, rollback, and inspect releases.",
    details: [
      {
        heading: "How it works",
        body: "Core commands:\n\n```\nhelm install    # deploy\nhelm upgrade    # update\nhelm rollback   # revert\nhelm uninstall  # remove\nhelm create     # scaffold a new chart\nhelm lint       # static analysis\nhelm template   # render manifests locally\n```",
      },
      {
        heading: "Key concepts",
        body: "Override values with --set key=val or --values file.yaml. Use --dry-run --debug to simulate an install. The helm get subcommands (values, manifest, hooks, notes) inspect a live release.\n\n```\nhelm list\nhelm history myapp\n```\n\nhelm list shows all releases, and helm history shows a release's revision timeline.",
      },
      {
        heading: "Example",
        body: "Typical workflow:\n\n```\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo update\nhelm install my-redis bitnami/redis --set auth.password=secret --namespace cache\n```\n\nOr using OCI:\n\n```\nhelm install my-redis oci://registry-1.docker.io/bitnamicharts/redis\n```",
      },
      {
        heading: "Why it matters",
        body: "The CLI provides a consistent interface for managing application deployments across environments. Combined with --values files per environment (dev.yaml, prod.yaml), it enables repeatable, auditable deployments from local dev through CI/CD pipelines.",
      },
    ],
  },
  {
    id: "values-and-templating",
    title: "Values and Templating",
    summary:
      "Helm uses Go templates with a layered values system to generate customized Kubernetes manifests.",
    details: [
      {
        heading: "How it works",
        body: "Templates use Go template syntax with {{ }} delimiters. Values merge in precedence order: chart's values.yaml (lowest), parent chart values, -f values files, and --set flags (highest). Built-in objects like .Release.Name, .Values, .Chart, and .Capabilities are available in every template.",
      },
      {
        heading: "Key concepts",
        body: 'Pipelines chain functions with the | operator:\n\n```\n{{ .Values.name | default "app" | quote }}\n```\n\nKey functions include toYaml, indent/nindent, required (fail if empty), include (render named templates), and tpl (evaluate strings as templates). Use {{- and -}} to trim whitespace.',
      },
      {
        heading: "Example",
        body: 'A deployment template:\n\n```\nreplicas: {{ .Values.replicaCount }}\nimage: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"\nlabels:\n  {{ include "mychart.labels" . | nindent 4 }}\n```\n\nUsers override with:\n\n```\nhelm install --set replicaCount=5\n```',
      },
      {
        heading: "Why it matters",
        body: "Templating eliminates YAML duplication while keeping manifests readable. The values hierarchy lets chart authors provide sensible defaults that consumers override per environment. Adding a values.schema.json file validates user input at install time, catching misconfigurations early.",
      },
    ],
  },
  {
    id: "chart-dependencies",
    title: "Dependencies and Subcharts",
    summary:
      "Charts can declare dependencies on other charts, composing complex applications from reusable components.",
    details: [
      {
        heading: "How it works",
        body: "Dependencies are listed in Chart.yaml under the dependencies key with name, version (SemVer range), and repository URL (or oci:// reference).\n\n```\nhelm dependency update\n```\n\nThis downloads them into the charts/ directory. A Chart.lock file pins exact versions for reproducible builds.",
      },
      {
        heading: "Key concepts",
        body: "Use condition (e.g., postgresql.enabled) to toggle dependencies on/off. Use alias to install the same chart multiple times with different configs. Global values under the global: key are accessible in all charts. Subcharts are standalone — they cannot access parent values, but parents can override subchart values by nesting under the subchart's name.",
      },
      {
        heading: "Example",
        body: 'A web app chart depends on postgresql and redis:\n\n```\ndependencies:\n  - name: postgresql\n    version: "12.x.x"\n    repository: "oci://registry-1.docker.io/bitnamicharts"\n    condition: postgresql.enabled\n```\n\nParent values.yaml sets postgresql.auth.postgresPassword to configure the subchart.',
      },
      {
        heading: "Why it matters",
        body: "Dependencies let you compose applications from battle-tested community charts rather than writing everything from scratch. A single helm install deploys your app and all its infrastructure dependencies together, with coordinated upgrades and rollbacks.",
      },
    ],
  },
  {
    id: "helm-repositories",
    title: "Chart Repositories & OCI",
    summary:
      "Charts are distributed through OCI-compliant container registries (preferred) or traditional HTTP chart repositories.",
    details: [
      {
        heading: "How it works",
        body: "OCI registries (Docker Hub, ECR, GCR, GHCR) are the preferred distribution method since Helm 3.8+. Push charts with helm push and reference them with oci:// URLs. Traditional chart repos use an HTTP server with an index.yaml file; manage them with:\n\n```\nhelm repo add <name> <url>\nhelm repo update\nhelm search repo <keyword>\n```",
      },
      {
        heading: "Key concepts",
        body: "OCI registries eliminate the separate index.yaml, integrate with existing container registry infrastructure and auth, and store charts alongside container images. Artifact Hub (artifacthub.io) is the central search engine for discovering public charts.\n\n```\nhelm search hub <keyword>\nhelm search repo <keyword>\n```\n\nhelm search hub searches Artifact Hub; helm search repo searches locally added repos.",
      },
      {
        heading: "Example",
        body: "OCI workflow:\n\n```\nhelm push mychart-1.0.0.tgz oci://registry.example.com/charts\nhelm install myapp oci://registry.example.com/charts/mychart --version 1.0.0\n```\n\nTraditional:\n\n```\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm install myapp bitnami/mychart\n```",
      },
      {
        heading: "Why it matters",
        body: "OCI registry support means you can store charts alongside container images in the same registry, simplifying infrastructure, access control, and supply chain security for private charts. It's the recommended approach for new projects.",
      },
    ],
  },
  {
    id: "helm-hooks",
    title: "Lifecycle Hooks",
    summary:
      "Hooks run Kubernetes resources at specific points in a release lifecycle, like database migrations before upgrades.",
    details: [
      {
        heading: "How it works",
        body: "Hooks are regular K8s resources (typically Jobs) annotated with helm.sh/hook to specify when they run: pre-install, post-install, pre-upgrade, post-upgrade, pre-delete, post-delete, pre-rollback, post-rollback, or test. Hook weight (helm.sh/hook-weight) controls execution order — lower numbers run first.",
      },
      {
        heading: "Key concepts",
        body: "Hook delete policies control cleanup: before-hook-creation (default), hook-succeeded, and hook-failed. Hook resources are not tracked as part of the release. For Jobs and Pods, Helm waits for completion before proceeding. A single resource can declare multiple hooks.",
      },
      {
        heading: "Example",
        body: 'A database migration hook: a Job with annotations:\n\n```\nannotations:\n  "helm.sh/hook": pre-upgrade\n  "helm.sh/hook-weight": "-5"\n```\n\nThis runs a migration container before the app pods are updated. A post-install hook might notify Slack that the deployment completed.',
      },
      {
        heading: "Why it matters",
        body: "Hooks let you coordinate operations that must happen at specific lifecycle points — schema migrations, cache warming, backups before deletion — without building that logic into your application. They keep deployment orchestration declarative and version-controlled.",
      },
    ],
  },
  {
    id: "release-management",
    title: "Release Management",
    summary:
      "Helm tracks every install, upgrade, and rollback as numbered revisions stored as Secrets in the cluster.",
    details: [
      {
        heading: "How it works",
        body: "Each helm install creates revision 1. Each upgrade increments the revision. Rollbacks also create a new revision. Release metadata — rendered manifests, values, and hooks — is stored as Kubernetes Secrets in the release namespace by default.",
      },
      {
        heading: "Key concepts",
        body: "Helm 3 uses a three-way strategic merge on upgrades, comparing the old manifest, new manifest, and live cluster state. This means manual kubectl edits are detected and handled. The --history-max flag (default 10) limits stored revisions to prevent etcd bloat from accumulated Secrets.",
      },
      {
        heading: "Example",
        body: "After a bad upgrade:\n\n```\nhelm history myapp\nhelm rollback myapp 3\nhelm get values myapp --revision 3\n```\n\nhelm history shows all revisions with status. helm rollback reverts to revision 3's state, creating a new revision. helm get values inspects what values were used in any past revision.",
      },
      {
        heading: "Why it matters",
        body: "Built-in revision history and rollback give you a safety net for every deployment. You can confidently upgrade knowing that reverting is a single command away, with full auditability of what changed between revisions.",
      },
    ],
  },
  {
    id: "chart-testing",
    title: "Chart Testing",
    summary:
      "Helm provides multiple testing layers from static linting to BDD-style unit tests to in-cluster validation.",
    details: [
      {
        heading: "How it works",
        body: "Testing tools:\n\n```\nhelm lint        # static analysis on chart structure\nhelm template    # render manifests locally\nhelm test        # run test-annotated Pods/Jobs against a live release\n```\n\nThe chart-testing (ct) CLI adds git-aware linting and install testing for CI pipelines.",
      },
      {
        heading: "Key concepts",
        body: "Test resources live in templates/tests/ with the annotation helm.sh/hook: test. The helm-unittest plugin enables BDD-style unit tests that validate template output without a cluster — assert on rendered YAML paths and values. A complete strategy layers: lint, unit test, ct install, helm test, then integration tests.",
      },
      {
        heading: "Example",
        body: "A connection test Pod: runs wget against the service with restartPolicy: Never.\n\n```\nhelm install myapp ./mychart\nhelm test myapp\n```\n\nHelm creates the Pod, waits for completion, and reports pass/fail.",
      },
      {
        heading: "Why it matters",
        body: "Testing catches misconfigurations before they reach production. Linting catches syntax errors instantly, unit tests verify template logic, and helm test validates the deployed application actually works. The ct tool integrates all of this into CI.",
      },
    ],
  },
  {
    id: "security-best-practices",
    title: "Security and Best Practices",
    summary:
      "Secure Helm usage involves chart signing, RBAC-scoped credentials, pinned versions, and careful secrets management.",
    details: [
      {
        heading: "How it works",
        body: "Charts can be signed during packaging with:\n\n```\nhelm package --sign\n```\n\nThis produces a .prov provenance file. Consumers verify with:\n\n```\nhelm install --verify\n```\n\nFor OCI-stored charts, Sigstore/cosign provides an alternative signing mechanism. Helm 3 uses your kubeconfig credentials directly — no cluster-admin Tiller risk.",
      },
      {
        heading: "Key concepts",
        body: "Always pin chart versions in production — never use floating tags. Use RBAC-scoped kubeconfig so Helm only has needed permissions. Avoid putting secrets in values.yaml; use Kubernetes Secrets, external secret managers, or the helm-secrets plugin with SOPS encryption. The helm-diff plugin lets you review changes before applying upgrades.",
      },
      {
        heading: "Example",
        body: "In CI/CD:\n\n```\nhelm upgrade --install myapp oci://registry.example.com/charts/myapp \\\n  --version 2.1.0 \\\n  --values prod.yaml \\\n  --history-max 10 \\\n  --namespace prod \\\n  --atomic \\\n  --timeout 5m\n```\n\nThe pinned OCI version, atomic rollback, and namespace scoping ensure a safe, reproducible deployment.",
      },
      {
        heading: "Why it matters",
        body: "Supply chain attacks targeting Helm charts can compromise entire clusters. Signing and verification ensure chart integrity. RBAC scoping limits blast radius. Pinned versions and helm-diff give you auditability and predictability in production.",
      },
    ],
  },
  {
    id: "named-templates-and-helpers",
    title: "Named Templates and Helpers",
    summary:
      "The _helpers.tpl file defines reusable template partials that eliminate duplication across chart templates.",
    details: [
      {
        heading: "How it works",
        body: 'Named templates are defined with:\n\n```\n{{ define "mychart.fullname" }}...{{ end }}\n```\n\nand invoked with:\n\n```\n{{ include "mychart.fullname" . }}\n```\n\nThey live in _helpers.tpl by convention (the underscore means Helm won\'t render it as a manifest). The include function is preferred over template because its output can be piped.',
      },
      {
        heading: "Key concepts",
        body: "Always prefix named templates with the chart name (e.g., mychart.labels) to avoid collisions — template names are global across parent and all subcharts. The dot (.) passed as the second argument sets the template's scope.",
      },
      {
        heading: "Example",
        body: 'Define standard labels once:\n\n```\n{{ define "mychart.labels" }}\napp.kubernetes.io/name: {{ .Chart.Name }}\napp.kubernetes.io/instance: {{ .Release.Name }}\n{{ end }}\n```\n\nThen every resource uses:\n\n```\n{{ include "mychart.labels" . | nindent 4 }}\n```\n\nin metadata.labels.',
      },
      {
        heading: "Why it matters",
        body: "Helpers keep charts DRY and maintainable. When you need to change a naming convention or add a label, you update one definition instead of every template file. helm create scaffolds _helpers.tpl with common patterns.",
      },
    ],
  },
  {
    id: "debugging-templates",
    title: "Debugging Templates",
    summary:
      "Helm provides several tools to inspect, debug, and troubleshoot template rendering issues.",
    details: [
      {
        heading: "How it works",
        body: "Debugging commands:\n\n```\nhelm template ./mychart                      # render locally\nhelm template ./mychart --debug               # full output with computed values\nhelm install --dry-run --debug                # simulate against live cluster\nhelm install --dry-run=server                 # server-side validation (3.13+)\n```",
      },
      {
        heading: "Key concepts",
        body: 'Common issues: YAML indentation errors (fix with nindent), type coercion (quote strings to prevent YAML treating "true" as boolean), and nil pointer errors (use the default function or with blocks). Use --show-only to render a single template file for focused debugging.',
      },
      {
        heading: "Example",
        body: "Debug a specific template:\n\n```\nhelm template myapp ./mychart --show-only templates/deployment.yaml --set replicaCount=3\n```\n\nCompare rendered vs expected on a live release:\n\n```\nhelm get manifest myapp\n```\n\nUse helm diff upgrade to preview what would change.",
      },
      {
        heading: "Why it matters",
        body: "Template bugs can produce valid YAML that deploys broken resources. Local rendering catches issues before they reach the cluster. --dry-run adds API validation for invalid fields. helm-diff shows exactly what an upgrade would change.",
      },
    ],
  },
  {
    id: "helm-plugins",
    title: "Helm Plugins",
    summary:
      "Plugins extend Helm's CLI with commands for diffing, managing secrets, unit testing, and more.",
    details: [
      {
        heading: "How it works",
        body: "Plugins are installed with:\n\n```\nhelm plugin install <url>\n```\n\nand add new subcommands. They're standalone executables that receive Helm environment variables.\n\n```\nhelm plugin list\nhelm plugin update <name>\nhelm plugin uninstall <name>\n```",
      },
      {
        heading: "Key concepts",
        body: "Essential plugins: helm-diff (preview upgrade changes), helm-secrets (encrypt/decrypt values using SOPS or age), helm-unittest (BDD-style template tests), helm-dashboard (web UI for releases). Plugins can also add downloaders for custom protocols.",
      },
      {
        heading: "Example",
        body: "Install and use helm-diff:\n\n```\nhelm plugin install https://github.com/databus23/helm-diff\nhelm diff upgrade myapp ./mychart --values prod.yaml\n```\n\nThis shows a colored diff of what would change, letting you review before committing.",
      },
      {
        heading: "Why it matters",
        body: "Plugins fill gaps in Helm's core functionality without bloating the main binary. helm-diff prevents production incidents by making changes visible. helm-secrets solves storing encrypted values alongside charts in version control.",
      },
    ],
  },
  {
    id: "helm-in-cicd",
    title: "Helm in CI/CD",
    summary:
      "Helm integrates into CI/CD pipelines for automated, repeatable deployments with atomic rollbacks.",
    details: [
      {
        heading: "How it works",
        body: "CI/CD pipelines use helm upgrade --install for idempotent deployments. Combine with --atomic (auto-rollback on failure), --timeout (fail if resources don't become ready), and --wait (block until ready). OCI references with pinned versions ensure reproducibility.",
      },
      {
        heading: "Key concepts",
        body: "Use per-environment values files (values-dev.yaml, values-prod.yaml) with the same chart. Pin chart versions for reproducibility. The --atomic flag ensures failed upgrades don't leave broken releases — Helm automatically rolls back. Use helm diff in CI to preview changes before applying.",
      },
      {
        heading: "Example",
        body: "A GitHub Actions step:\n\n```\nhelm upgrade --install myapp oci://ghcr.io/myorg/charts/myapp \\\n  --version 2.1.0 \\\n  --namespace prod \\\n  --values values-prod.yaml \\\n  --set image.tag=$GITHUB_SHA \\\n  --atomic \\\n  --timeout 5m \\\n  --wait\n```\n\nDeploys the exact commit SHA, waits for readiness, and auto-rolls back on failure.",
      },
      {
        heading: "Why it matters",
        body: "Helm's idempotent upgrade --install, atomic rollbacks, and values hierarchy make it a natural fit for GitOps and CI/CD. Teams get repeatable deployments, environment parity, and automatic recovery from failed deployments.",
      },
    ],
  },
  {
    id: "umbrella-and-library-charts",
    title: "Umbrella and Library Charts",
    summary:
      "Umbrella charts deploy multi-service applications, while library charts share template logic without producing manifests.",
    details: [
      {
        heading: "How it works",
        body: "An umbrella chart has little or no templates — it composes by listing other charts as dependencies. A library chart (type: library in Chart.yaml) cannot be installed directly; it provides named templates that other charts import via {{ include }}.",
      },
      {
        heading: "Key concepts",
        body: "Umbrella charts centralize multi-service deployment — one helm install deploys all services with coordinated lifecycle. Library charts standardize patterns like labels, annotations, and resource naming across an organization without copy-pasting helpers.",
      },
      {
        heading: "Example",
        body: "An e-commerce umbrella chart depends on api, frontend, and worker subcharts. Its values.yaml sets global.imageRegistry and overrides per-service config. A company library chart defines standard-labels and standard-deployment templates that all team charts depend on.",
      },
      {
        heading: "Why it matters",
        body: "Umbrella charts simplify multi-service deployments into a single release with unified versioning and rollback. Library charts enforce organizational standards — when a policy changes, update the library once and all consuming charts pick it up.",
      },
    ],
  },
  {
    id: "values-schema-validation",
    title: "Values Schema Validation",
    summary:
      "A JSON Schema file validates user-supplied values at install and upgrade time, catching misconfigurations early.",
    details: [
      {
        heading: "How it works",
        body: "Place a values.schema.json file in the chart root. Helm validates the final merged .Values against this schema during install, upgrade, lint, and template commands. Validation errors block the operation with a clear message.",
      },
      {
        heading: "Key concepts",
        body: "The schema uses standard JSON Schema (draft-07) and can enforce types, required fields, enums, patterns, min/max values, and custom error messages. Subchart schemas are validated independently. The schema applies to the fully merged values, not just user overrides.",
      },
      {
        heading: "Example",
        body: 'A schema requiring replicaCount as a positive integer and image.repository as a non-empty string:\n\n```\n{\n  "properties": {\n    "replicaCount": { "type": "integer", "minimum": 1 },\n    "image": {\n      "properties": {\n        "repository": { "type": "string", "minLength": 1 }\n      }\n    }\n  }\n}\n```\n\nPassing --set replicaCount=0 gets an immediate validation error.',
      },
      {
        heading: "Why it matters",
        body: "Without schema validation, typos and invalid values silently produce broken manifests. Schemas shift misconfiguration detection left to the earliest possible point and serve as living documentation of what each value expects.",
      },
    ],
  },
  {
    id: "multi-environment-management",
    title: "Multi-Environment Management",
    summary:
      "Helm's values hierarchy and overrides enable deploying the same chart across dev, staging, and production with minimal divergence.",
    details: [
      {
        heading: "How it works",
        body: "Create per-environment values files that override the chart's defaults. Stack multiple -f flags to layer config:\n\n```\nhelm upgrade --install myapp ./chart \\\n  -f values-shared.yaml \\\n  -f values-prod.yaml\n```\n\nLater files take precedence. Use --namespace to isolate environments or deploy to separate clusters via kubeconfig context.",
      },
      {
        heading: "Key concepts",
        body: "Keep values.yaml as a development-friendly baseline. Environment files should only contain deltas — don't duplicate every value. Combine with Helm's schema validation to ensure environment-specific values are valid. Use helm diff to compare what's running vs what you're about to deploy.",
      },
      {
        heading: "Example",
        body: "values.yaml sets dev defaults:\n\n```\nreplicaCount: 1\nresources:\n  limits:\n    memory: 256Mi\n```\n\nvalues-prod.yaml overrides:\n\n```\nreplicaCount: 5\nresources:\n  limits:\n    memory: 1Gi\ningress:\n  hosts:\n    - app.example.com\n```\n\nThe chart template is identical — only values differ.",
      },
      {
        heading: "Why it matters",
        body: "Environment parity through shared charts means the exact template logic tested in staging runs in production. Differences are explicit and reviewable in values files rather than hidden in divergent manifests.",
      },
    ],
  },
  {
    id: "helm-vs-kustomize",
    title: "Helm vs Kustomize",
    summary:
      "Helm uses templating and packaging while Kustomize uses overlay patching — many teams use both together.",
    details: [
      {
        heading: "How it works",
        body: "Helm generates manifests from parameterized templates, packages them as distributable charts, and manages release lifecycle. Kustomize patches plain YAML through overlays — no templating language, just base manifests and strategic merge patches. They combine: helm template renders manifests that Kustomize then patches.",
      },
      {
        heading: "Key concepts",
        body: "Helm excels at packaging reusable applications, dependency management, and release lifecycle tracking. Kustomize excels at customizing third-party manifests without forking and applying environment overlays on plain YAML. Helm's --post-renderer flag enables Kustomize as a post-rendering step.",
      },
      {
        heading: "Example",
        body: "Deploying Redis with Helm:\n\n```\nhelm install redis bitnami/redis\n```\n\ngives you lifecycle management. With Kustomize, write a base deployment.yaml and a prod overlay. With both: use Helm's --post-renderer to pipe rendered manifests through Kustomize for additional patching.",
      },
      {
        heading: "Why it matters",
        body: "Use Helm for distributing reusable applications and when you need release management. Use Kustomize for simple environment overlays on plain YAML. Many teams use both — Helm for third-party charts and Kustomize for in-house services or post-rendering customization.",
      },
    ],
  },
];
