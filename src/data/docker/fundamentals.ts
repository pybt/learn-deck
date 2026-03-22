import type { CardData } from "../types";

export const dockerFundamentals: CardData[] = [
  {
    id: "containers-vs-vms",
    title: "Containers, VMs & Wasm",
    summary:
      "The isolation spectrum now has three tiers: VMs provide full OS isolation, containers share the host kernel, and Wasm modules offer lightweight sandboxed execution.",
    details: [
      {
        heading: "How it works",
        body: "A VM runs a complete guest OS on emulated hardware via a hypervisor. A container shares the host kernel and uses Linux namespaces and cgroups to isolate processes. Wasm (WebAssembly) containers run sandboxed modules via WASI runtimes like WasmEdge or Wasmtime — lighter than Linux containers with near-instant startup.",
      },
      {
        heading: "Key concepts",
        body: "Containers start in milliseconds vs minutes for VMs, using megabytes instead of gigabytes. Wasm containers are even lighter — microsecond startup, kilobytes of overhead. VMs provide the strongest isolation. Docker supports Wasm via containerd shims (runwasi project), and Wasm artifacts can be stored in standard OCI registries.",
      },
      {
        heading: "Why it matters",
        body: "Understanding this spectrum helps you choose the right tool. Containers excel for microservices and CI/CD. VMs are better for full OS-level isolation or multi-tenant scenarios. Wasm targets edge, serverless, and plugin workloads where cold-start time and binary size matter.",
      },
    ],
  },
  {
    id: "docker-images",
    title: "Docker Images & OCI Spec",
    summary:
      "Images are read-only, layered filesystem snapshots following the OCI Image Spec, which now supports storing non-container artifacts alongside images.",
    details: [
      {
        heading: "How it works",
        body: "An image is built from a series of layers, each representing a filesystem change. Layers are stacked using a union filesystem so the final image appears as a single coherent filesystem. The OCI Image Spec 1.1 adds native support for OCI Artifacts — registries can now store Helm charts, Wasm modules, SBOMs, and signatures alongside images.",
      },
      {
        heading: "Key concepts",
        body: "Layers are cached and shared between images. Multi-platform image manifests (OCI index) are standard practice — a single tag resolves to the right architecture. Images are identified by repository name, optional tag, and a SHA-256 digest for exact reproducibility. Image signing via Sigstore/cosign is increasingly adopted for supply chain security.",
      },
      {
        heading: "Example",
        body: "Pulling node:22-alpine downloads only the layers you don't already have. Multi-platform images mean the same tag works on ARM (Apple Silicon) and AMD64 machines. Docker Scout continuously monitors your images against new CVE databases, not just at build time.",
      },
    ],
  },
  {
    id: "dockerfile",
    title: "Dockerfile & BuildKit",
    summary:
      "Dockerfiles define image build steps using BuildKit as the only builder, with modern features like cache mounts, heredoc syntax, and COPY --link.",
    details: [
      {
        heading: "How it works",
        body: "Each instruction (FROM, RUN, COPY, CMD) creates a new image layer. BuildKit is now the sole builder — the legacy builder is removed as of Engine 27+. Use the syntax directive to access the latest BuildKit features:\n\n```\n# syntax=docker/dockerfile:1\n```",
      },
      {
        heading: "Key concepts",
        body: "RUN --mount=type=cache caches package manager directories across builds, avoiding re-downloads. COPY --link creates layers independent of previous layers for better cache reuse. RUN --mount=type=secret mounts secrets during build without baking them into layers. Heredoc syntax enables multi-line RUN commands without backslash continuations.",
      },
      {
        heading: "Example",
        body: "A modern Node.js Dockerfile using BuildKit features:\n\n```\nFROM node:22-alpine\nCOPY --link package.json package-lock.json ./\nRUN --mount=type=cache,target=/root/.npm npm ci\nCOPY --link . .\n```\n\nEach COPY --link layer caches independently, so changing source code doesn't invalidate the dependency layer.",
      },
      {
        heading: "Why it matters",
        body: "BuildKit-only features like cache mounts and COPY --link dramatically improve build speed and cache efficiency. A well-structured Dockerfile with these features produces smaller, more secure images with faster rebuilds. Docker init can scaffold best-practice Dockerfiles automatically for your language.",
      },
    ],
  },
  {
    id: "container-lifecycle",
    title: "Container Lifecycle",
    summary:
      "Containers move through created, running, paused, stopped, and removed states, with health checks providing readiness signals to orchestrators.",
    details: [
      {
        heading: "How it works",
        body: "docker create makes a container without starting it. docker start begins execution. docker stop sends SIGTERM then SIGKILL after a grace period. docker rm removes stopped containers. docker run combines create and start. HEALTHCHECK instructions in Dockerfiles let containers report their readiness state.",
      },
      {
        heading: "Key concepts",
        body: "Containers are ephemeral by default — data written inside is lost when removed. Health checks are increasingly important as Compose and orchestrators use them for startup ordering and load balancing. The init container pattern (run a setup container to completion before starting the main service) is supported in Compose via depends_on conditions.",
      },
      {
        heading: "Example",
        body: "During development:\n\n```\ndocker run --rm -it myapp\n```\n\nstarts interactively and auto-removes on exit. In production with health checks:\n\n```\nHEALTHCHECK --interval=10s CMD curl -f http://localhost:3000/health\n```\n\nCompose uses condition: service_healthy to start dependent services only after the health check passes.",
      },
    ],
  },
  {
    id: "volumes-and-mounts",
    title: "Volumes & Bind Mounts",
    summary:
      "Volumes and bind mounts persist data beyond a container's lifetime, with VirtioFS providing fast file sharing on macOS and Windows.",
    details: [
      {
        heading: "How it works",
        body: "Docker volumes are managed by Docker and stored in a Docker-controlled directory. Bind mounts map a specific host path into the container. Both survive container removal. On Docker Desktop, VirtioFS is the default file-sharing backend, providing near-native performance for bind mounts on macOS and Windows.",
      },
      {
        heading: "Key concepts",
        body: "Named volumes are the preferred mechanism for production data — portable and backed up with Docker commands. Bind mounts are useful in development for live code editing. tmpfs mounts store sensitive temporary data in memory only. Compose Watch offers an alternative to bind mounts with file sync and hot-reload actions.",
      },
      {
        heading: "Example",
        body: "For a database:\n\n```\ndocker run -v pgdata:/var/lib/postgresql/data postgres\n```\n\ncreates a named volume. For development:\n\n```\ndocker run -v ./src:/app/src myapp\n```\n\nbind-mounts local source. Or use Compose Watch for smarter sync that triggers rebuilds when package.json changes.",
      },
      {
        heading: "Why it matters",
        body: "Without volumes, all data written by a container is lost on removal. Understanding persistence options — named volumes for databases, bind mounts or Compose Watch for development, tmpfs for secrets — is critical for any containerized workload.",
      },
    ],
  },
  {
    id: "networking",
    title: "Docker Networking",
    summary:
      "Docker provides built-in networking that lets containers communicate through different network drivers, with user-defined bridges as the recommended approach.",
    details: [
      {
        heading: "How it works",
        body: "Docker creates a default bridge network where containers get internal IPs. Containers on the same user-defined bridge can reach each other by container name via built-in DNS. Port mapping exposes container ports to the host:\n\n```\ndocker run -p 8080:80 myapp\n```",
      },
      {
        heading: "Key concepts",
        body: "User-defined bridge networks are recommended over the default bridge — they provide DNS resolution, better isolation, and configurable subnets. Host mode removes network isolation (container shares the host's network stack). Overlay networks span multiple Docker hosts for cluster setups.",
      },
      {
        heading: "Example",
        body: "Create a network and run containers on it:\n\n```\ndocker network create myapp\ndocker run --network myapp --name api myapi\ndocker run --network myapp --name db postgres\n```\n\nThe API container connects to the database using hostname 'db'. Compose creates a network automatically for each project.",
      },
    ],
  },
  {
    id: "docker-compose",
    title: "Docker Compose",
    summary:
      "Compose V2 defines multi-container applications in a single YAML file, with features like Watch for development, include for modularity, and profiles for optional services.",
    details: [
      {
        heading: "How it works",
        body: "A compose.yaml file declares services, networks, and volumes. Running docker compose up starts the entire stack. Compose V1 (docker-compose with hyphen) was removed in 2024 — only V2 (docker compose as a CLI plugin) is supported. The include directive lets you compose from multiple files.",
      },
      {
        heading: "Key concepts",
        body: "Compose Watch provides file sync and hot-reload for development with three actions: sync (hot file update), rebuild (recreate container), and sync+restart. Profiles let you define optional services activated with --profile. depends_on with condition: service_healthy enables health-check-aware startup ordering. Run Watch with:\n\n```\ndocker compose watch\n```",
      },
      {
        heading: "Example",
        body: "A web app stack with Watch: the 'web' service syncs src/ changes instantly, rebuilds on package.json changes, and depends on a 'db' service with a health check:\n\n```\nservices:\n  web:\n    build: .\n    develop:\n      watch:\n        - action: sync\n          path: ./src\n          target: /app/src\n        - action: rebuild\n          path: package.json\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgres\n    healthcheck:\n      test: [\"CMD\", \"pg_isready\"]\n```",
      },
      {
        heading: "Why it matters",
        body: "Compose eliminates complex docker run commands and makes development environments reproducible. Watch replaces fragile bind-mount setups. Include enables modular composition of services. A new team member runs one command to get a fully working stack.",
      },
    ],
  },
  {
    id: "multi-stage-builds",
    title: "Multi-Stage Builds",
    summary:
      "Multi-stage builds use multiple FROM statements to separate build tools from runtime, now considered the default approach with cache mount integration.",
    details: [
      {
        heading: "How it works",
        body: "Each FROM starts a new stage. Name stages and copy artifacts between them. Only the final stage becomes the output image. Combine with RUN --mount=type=cache for maximum efficiency:\n\n```\nFROM node:22 AS builder\nCOPY --link package.json .\nRUN --mount=type=cache,target=/root/.npm npm ci\nRUN npm run build\n\nFROM node:22-alpine\nCOPY --link --from=builder /app/dist ./dist\n```",
      },
      {
        heading: "Key concepts",
        body: "Build dependencies (compilers, dev packages) stay in earlier stages. The final stage uses a minimal base image (alpine, distroless) with only production artifacts. COPY --link in the final stage improves cache reuse. Multi-platform build args (TARGETARCH, TARGETOS) are automatically available for cross-compilation.",
      },
      {
        heading: "Example",
        body: "Stage 1: install deps with cache mount and run build. Stage 2: copy only production artifacts:\n\n```\nFROM node:22 AS builder\nRUN --mount=type=cache,target=/root/.npm npm ci\nRUN npm run build\n\nFROM node:22-alpine\nCOPY --link --from=builder /app/dist ./dist\nCOPY --link --from=builder /app/node_modules ./node_modules\n```\n\nThe final image might be 150MB instead of 1GB, with faster rebuilds from cached layers.",
      },
    ],
  },
  {
    id: "image-registries",
    title: "Image Registries",
    summary:
      "Registries store and distribute Docker images and OCI artifacts, with Docker Hub as the default and OCI-compliant registries supporting charts, SBOMs, and signatures.",
    details: [
      {
        heading: "How it works",
        body: "Registries store images by repository name and tag. Layer deduplication means pushing an updated image only transfers changed layers. Push and pull images with:\n\n```\ndocker push myregistry.io/myapp:v1.0\ndocker pull myregistry.io/myapp:v1.0\n```\n\nOCI-compliant registries (Docker Hub, ECR, GCR, ACR, GHCR) store any OCI artifact type alongside images.",
      },
      {
        heading: "Key concepts",
        body: "Docker Hub free tier has rate limits (100 pulls/6h anonymous, 200/6h authenticated). Image tags are mutable — 'latest' can point to different images; use digests for immutability. Image signing via Sigstore/cosign provides supply chain verification. Docker Scout provides continuous vulnerability monitoring for images in registries.",
      },
      {
        heading: "Why it matters",
        body: "Registries are the distribution mechanism for containerized applications. Your CI/CD pipeline builds, signs, and pushes images; deployment systems pull and verify them. OCI Artifacts support means a single registry can store images, Helm charts, Wasm modules, and SBOMs together.",
      },
    ],
  },
  {
    id: "security-best-practices",
    title: "Container Security",
    summary:
      "Secure containers by using minimal base images, running rootless Docker, scanning with Docker Scout, and limiting runtime capabilities.",
    details: [
      {
        heading: "How it works",
        body: "Use minimal base images (alpine, distroless) to reduce attack surface. Create a non-root USER in your Dockerfile. Scan images with Docker Scout for continuous vulnerability analysis:\n\n```\ndocker scout cves myapp\ndocker scout quickview myapp\n```\n\nAt runtime, drop Linux capabilities and use read-only filesystems.",
      },
      {
        heading: "Key concepts",
        body: "Rootless Docker runs the daemon without root privileges, providing an extra isolation layer. Docker Scout generates SBOMs and monitors images against CVE databases continuously — not just at build time. Build-time secrets use RUN --mount=type=secret, never ENV or COPY. The --security-opt=no-new-privileges flag prevents privilege escalation inside containers.",
      },
      {
        heading: "Example",
        body: "In your Dockerfile, create a non-root user:\n\n```\nRUN addgroup -S app && adduser -S app -G app\nUSER app\n```\n\nUse build-time secrets:\n\n```\nRUN --mount=type=secret,id=api_key cat /run/secrets/api_key\n```\n\nAt runtime, lock down the container:\n\n```\ndocker run --read-only --cap-drop=ALL --security-opt=no-new-privileges myapp\n```",
      },
      {
        heading: "Why it matters",
        body: "Containers share a kernel with the host, so vulnerabilities can have outsized impact. Defense in depth — minimal images, non-root users, rootless Docker, capability restrictions, Scout scanning, and artifact signing — significantly reduces risk in production environments.",
      },
    ],
  },
];
