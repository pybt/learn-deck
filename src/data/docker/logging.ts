import type { CardData } from "../types";

export const dockerLogging: CardData[] = [
  {
    id: "logging-architecture",
    title: "Docker Logging Architecture",
    summary:
      "Docker captures stdout and stderr from container processes and routes them through pluggable logging drivers to configurable backends.",
    details: [
      {
        heading: "How it works",
        body: "The Docker daemon intercepts everything a container's PID 1 writes to stdout and stderr. It passes these streams to the configured logging driver, which determines how and where logs are stored. The container itself doesn't need to know about the logging backend.",
      },
      {
        heading: "Key concepts",
        body: "Applications should log to stdout/stderr rather than files — this follows the twelve-factor app methodology and lets Docker handle log routing. The logging driver is the abstraction layer between your container's output and the log storage system. Labels and environment variables can be attached as metadata.",
      },
      {
        heading: "Why it matters",
        body: "Understanding this architecture means you design applications that are logging-driver agnostic. You can switch from local files to a centralized logging system without changing a single line of application code.",
      },
    ],
  },
  {
    id: "docker-logs-command",
    title: "The docker logs Command",
    summary:
      "docker logs retrieves log output from a container, with options for tailing, timestamps, and real-time following.",
    details: [
      {
        heading: "How it works",
        body: "docker logs reads stored log entries from the configured logging driver. It only works with drivers that support reading (json-file, local, and journald). Other drivers like syslog or fluentd forward logs externally and don't support docker logs.",
      },
      {
        heading: "Key concepts",
        body: "Use --follow (-f) to stream logs in real time. Use --tail N to show only the last N lines. --since and --until filter by timestamp. --timestamps prepends each line with a timestamp. These flags combine for targeted debugging.",
      },
      {
        heading: "Example",
        body: "Debug a crashing container:\n\n```\ndocker logs --tail 50 --timestamps myapp\n```\n\nshows the last 50 lines with timestamps. For live monitoring:\n\n```\ndocker logs -f --since 5m myapp\n```\n\nstreams logs from the last 5 minutes onward.",
      },
    ],
  },
  {
    id: "json-file-driver",
    title: "JSON File Logging Driver",
    summary:
      "The default json-file driver stores logs as JSON lines on the host filesystem, with configurable rotation to prevent disk exhaustion.",
    details: [
      {
        heading: "How it works",
        body: "Each log line is stored as a JSON object with 'log', 'stream' (stdout/stderr), and 'time' fields. Files are stored at the following path on the host:\n\n```\n/var/lib/docker/containers/<id>/<id>-json.log\n```\n\nWithout rotation, these files grow unbounded.",
      },
      {
        heading: "Key concepts",
        body: "Configure rotation with max-size (e.g., 10m) and max-file (e.g., 3) options. These can be set per container with --log-opt or globally in daemon.json. The json-file driver supports docker logs, making it good for development and small deployments.",
      },
      {
        heading: "Example",
        body: "Run a container with log rotation configured:\n\n```\ndocker run --log-driver json-file --log-opt max-size=10m --log-opt max-file=5 myapp\n```\n\nThis keeps at most 5 log files of 10MB each, capping storage at 50MB per container. Set this globally in /etc/docker/daemon.json for all containers.",
      },
      {
        heading: "Why it matters",
        body: "Unconfigured json-file logging is the number one cause of Docker hosts running out of disk space. Always set rotation limits — a single verbose container can fill a disk in hours.",
      },
    ],
  },
  {
    id: "local-driver",
    title: "Local Logging Driver",
    summary:
      "The local driver uses a compressed protobuf format that is more efficient than json-file and recommended for production when not using centralized logging.",
    details: [
      {
        heading: "How it works",
        body: "The local driver stores logs in an internal compressed format (protobuf) rather than plain JSON, reducing disk usage and I/O. It supports the same rotation options as json-file (max-size, max-file) and is compatible with docker logs for reading.",
      },
      {
        heading: "Key concepts",
        body: "The local driver is Docker's recommended alternative to json-file for production hosts. It offers better performance and smaller log files through compression. The tradeoff is that log files aren't human-readable on disk — you must use docker logs to read them. Default rotation is 100MB max-size with 5 files.",
      },
      {
        heading: "Why it matters",
        body: "If you don't need external log forwarding and want better performance than json-file, the local driver is the best choice. Set it as the daemon default for production hosts where containers don't use a centralized logging backend.",
      },
    ],
  },
  {
    id: "logging-drivers",
    title: "Logging Driver Options",
    summary:
      "Docker supports multiple logging drivers including syslog, journald, fluentd, awslogs, and gcplogs for different infrastructure needs.",
    details: [
      {
        heading: "How it works",
        body: "Set the driver per container with --log-driver or globally in daemon.json. Each driver has its own --log-opt options for configuration like remote endpoints, tags, and buffer sizes. The 'none' driver disables logging entirely for high-throughput containers.",
      },
      {
        heading: "Key concepts",
        body: "syslog sends to a syslog server. journald integrates with systemd. fluentd and gelf forward to log aggregators. awslogs and gcplogs send directly to cloud logging services. The logentries driver is deprecated. Choose based on your infrastructure — cloud-native drivers reduce overhead; fluentd/gelf provide flexibility for self-hosted stacks.",
      },
      {
        heading: "Example",
        body: "For AWS:\n\n```\n--log-driver=awslogs --log-opt awslogs-group=myapp --log-opt awslogs-region=us-east-1\n```\n\nFor Fluentd:\n\n```\n--log-driver=fluentd --log-opt fluentd-address=localhost:24224\n```\n\nEach driver integrates natively with its target platform.",
      },
      {
        heading: "Why it matters",
        body: "Choosing the right driver determines your logging pipeline's reliability, latency, and cost. Cloud-native drivers reduce infrastructure overhead, while fluentd/gelf provide flexibility for self-hosted aggregation stacks.",
      },
    ],
  },
  {
    id: "log-tags-and-metadata",
    title: "Log Tags & Metadata",
    summary:
      "Docker log tags inject container metadata like name, ID, and image into log entries for identification in aggregated logging systems.",
    details: [
      {
        heading: "How it works",
        body: "The --log-opt tag option accepts Go template syntax to embed container metadata. Templates like {{.Name}}, {{.ID}}, {{.ImageName}}, and {{.DaemonName}} are resolved at container start and included with every log message. Labels and environment variables can be included via --log-opt labels and --log-opt env.",
      },
      {
        heading: "Key concepts",
        body: "Tags are essential when multiple containers send logs to the same destination. Without tags, you can't distinguish which container produced which log line. Adding labels enriches log metadata for filtering and aggregation:\n\n```\n--log-opt labels=app,environment\n```",
      },
      {
        heading: "Example",
        body: 'Run a container with tag and label metadata:\n\n```\ndocker run \\\n  --log-opt tag="{{.Name}}/{{.ID}}" \\\n  --log-opt labels=environment \\\n  --label environment=prod \\\n  --log-driver syslog \\\n  myapp\n```\n\nThis produces syslog entries with the container name, short ID, and environment label for easy filtering.',
      },
    ],
  },
  {
    id: "blocking-vs-nonblocking",
    title: "Blocking vs Non-Blocking Delivery",
    summary:
      "Docker's log delivery mode controls whether a slow logging backend can stall your application or silently drop messages.",
    details: [
      {
        heading: "How it works",
        body: "In blocking mode (default), if the logging driver can't keep up, the container's stdout/stderr writes block — the application pauses until the driver catches up. Non-blocking mode uses a ring buffer; when full, oldest messages are dropped.",
      },
      {
        heading: "Key concepts",
        body: "Set non-blocking mode with:\n\n```\n--log-opt mode=non-blocking --log-opt max-buffer-size=4m\n```\n\nBlocking mode guarantees no log loss but risks application slowdown. Non-blocking prioritizes application performance over log completeness.",
      },
      {
        heading: "Why it matters",
        body: "A network hiccup to your log aggregator shouldn't take down your production API. Non-blocking mode protects application availability, but you must accept potential log gaps. Choose based on whether uptime or audit completeness is more critical.",
      },
    ],
  },
  {
    id: "compose-logging",
    title: "Logging in Docker Compose",
    summary:
      "Docker Compose configures per-service logging drivers and options directly in compose.yaml for consistent multi-container setups.",
    details: [
      {
        heading: "How it works",
        body: "Each service in compose.yaml accepts a logging key with driver and options fields. This applies the logging configuration every time the service starts, ensuring consistency across environments and team members.",
      },
      {
        heading: "Key concepts",
        body: "The logging block sits at the same level as image, ports, and volumes in a service definition. Options mirror --log-opt flags. You can use YAML anchors to share logging config across multiple services and override per-service as needed.",
      },
      {
        heading: "Example",
        body: 'Configure per-service logging in compose.yaml:\n\n```\nservices:\n  web:\n    image: myapp\n    logging:\n      driver: json-file\n      options:\n        max-size: "10m"\n        max-file: "3"\n        tag: "{{.Name}}"\n```\n\nFor a centralized setup, use driver: fluentd with options pointing to your Fluentd service defined in the same Compose file.',
      },
    ],
  },
  {
    id: "centralized-logging",
    title: "Centralized Log Aggregation",
    summary:
      "Production Docker environments route container logs to centralized systems like Loki, ELK, or cloud services for search, alerting, and retention.",
    details: [
      {
        heading: "How it works",
        body: "Containers forward logs via a logging driver or sidecar to an aggregator (Fluent Bit, Fluentd, Logstash, Promtail). The aggregator parses, enriches, and ships logs to a storage backend (Loki, Elasticsearch, CloudWatch) where they're indexed and searchable.",
      },
      {
        heading: "Key concepts",
        body: "Grafana Loki is a lightweight alternative to ELK that indexes labels instead of full text, reducing storage costs significantly. The ELK stack (Elasticsearch, Logstash, Kibana) offers powerful full-text search. Cloud services (CloudWatch, Cloud Logging) reduce operational burden. Fluent Bit is a lighter alternative to Fluentd for resource-constrained environments.",
      },
      {
        heading: "Example",
        body: "A typical Loki stack: containers use the json-file driver, Promtail tails the log files and pushes to Loki, and Grafana provides the query UI. This avoids changing any container logging config — Promtail reads what Docker already writes.",
      },
      {
        heading: "Why it matters",
        body: "Individual docker logs commands don't scale past a handful of containers. Centralized logging gives you cross-service correlation, retention policies, alerting on error patterns, and audit trails required for compliance.",
      },
    ],
  },
  {
    id: "structured-logging",
    title: "Structured Logging in Containers",
    summary:
      "Outputting logs as JSON from your application enables machine parsing, correlation IDs for request tracing, and richer queries in aggregation systems.",
    details: [
      {
        heading: "How it works",
        body: "Instead of plain text, the application writes JSON objects to stdout with consistent fields like level, message, timestamp, and request_id. The log aggregator parses these fields automatically, enabling structured queries and dashboards.",
      },
      {
        heading: "Key concepts",
        body: "Structured logs turn unstructured strings into queryable data. Correlation IDs (request_id, trace_id) follow a request across multiple containers. Consistent field names across services make cross-service queries possible. OpenTelemetry provides a standard for trace and log correlation.",
      },
      {
        heading: "Example",
        body: 'A Node.js app using pino outputs structured JSON:\n\n```\n{"level":30,"time":1234567890,"msg":"request completed","req_id":"abc-123","duration":45}\n```\n\nIn Grafana or Kibana, you can filter by level, graph duration over time, and trace requests by req_id across all services.',
      },
      {
        heading: "Why it matters",
        body: "Plain text logs require regex parsing that breaks when formats change. Structured logging makes logs a first-class data source for observability, enabling automated alerting on error rates, latency percentiles, and business metrics.",
      },
    ],
  },
  {
    id: "daemon-json-config",
    title: "Global Logging Configuration",
    summary:
      "The Docker daemon.json file sets default logging driver, rotation, and metadata options for all containers on a host.",
    details: [
      {
        heading: "How it works",
        body: "Edit /etc/docker/daemon.json to set log-driver and log-opts at the daemon level. These defaults apply to every new container unless overridden at runtime. Changes require restarting the Docker daemon:\n\n```\nsystemctl restart docker\n```",
      },
      {
        heading: "Key concepts",
        body: "Daemon-level defaults ensure no container runs without log rotation. Per-container overrides still work for special cases. Common production defaults: json-file or local driver with max-size of 10-50MB and max-file of 3-5. Adding labels and tag options globally enriches all container logs with metadata.",
      },
      {
        heading: "Example",
        body: 'Configure daemon.json with the local driver and rotation:\n\n```\n{\n  "log-driver": "local",\n  "log-opts": {\n    "max-size": "20m",\n    "max-file": "3"\n  }\n}\n```\n\nThis caps every container at 60MB of logs. Override for verbose debug containers:\n\n```\ndocker run --log-driver json-file --log-opt max-size=100m debugapp\n```',
      },
      {
        heading: "Why it matters",
        body: "Without daemon-level defaults, every container needs explicit log config or risks unbounded log growth. A single misconfigured container can fill a production host's disk, affecting all other containers on that machine.",
      },
    ],
  },
];
