import type { CardData } from "../types";

export const golangQuickStart: CardData[] = [
  {
    id: "project-setup",
    title: "Setting Up a Go Project",
    summary:
      "Every Go project starts with `go mod init` to create a module — this sets up dependency tracking and gives your code an import path.",
    details: [
      {
        heading: "How it works",
        body: "Run `go mod init <module-path>` to create a `go.mod` file that declares your module path and Go version. The module path is typically your repo URL (e.g., `github.com/yourname/myapp`). For local-only projects, any name works. This file, along with the auto-generated `go.sum`, should be committed to version control.",
      },
      {
        heading: "Example",
        body: "Creating and structuring a new project:\n\n```\nmkdir myapp && cd myapp\ngo mod init github.com/yourname/myapp\n\n# Minimal layout:\nmyapp/\n  go.mod\n  main.go\n\n# As it grows:\nmyapp/\n  go.mod\n  cmd/server/main.go   # entry points\n  internal/auth/auth.go # private packages\n  handler/routes.go     # public packages\n```",
      },
      {
        heading: "Key tips",
        body: "Start flat with a single `main.go` — add structure only as complexity grows. Use `internal/` to enforce package privacy (the compiler blocks external imports). Avoid the over-engineered `pkg/` directory unless you're building a library. Keep `cmd/` for multiple binaries in the same repo.",
      },
      {
        heading: "Why it matters",
        body: "Go modules ensure reproducible builds across machines and CI. The module path is your project's identity — all imports are resolved through it. Getting this right from day one prevents painful refactoring later.",
      },
    ],
  },
  {
    id: "first-program",
    title: "Writing & Running Your First Program",
    summary:
      "Go programs start in `package main` with a `func main()` entry point — use `go run` for quick iteration and `go build` to produce a binary.",
    details: [
      {
        heading: "How it works",
        body: "Every executable must be in `package main` with a `func main()`. `go run main.go` compiles and executes in one step — great for development. `go build` produces a standalone binary with no runtime dependencies. The binary includes everything needed to run, making deployment trivial.",
      },
      {
        heading: "Example",
        body: 'A complete Hello World with common patterns:\n\n```\npackage main\n\nimport (\n    "fmt"\n    "os"\n    "time"\n)\n\nfunc main() {\n    name := "World"\n    if len(os.Args) > 1 {\n        name = os.Args[1]\n    }\n    fmt.Printf("Hello, %s! Time: %s\\n",\n        name, time.Now().Format(time.Kitchen))\n}\n```\n\n```\ngo run main.go          # run directly\ngo run main.go Alice    # with args\ngo build -o myapp .     # build binary\n./myapp                 # run binary\n```',
      },
      {
        heading: "Key tips",
        body: "Use `go run .` (with a dot) to run all files in the current package, not just one file. The `:=` short declaration infers types — use it inside functions. `fmt.Printf` uses verbs like `%s` (string), `%d` (int), `%v` (any value), and `%+v` (struct with field names). Run `go fmt` to auto-format your code.",
      },
      {
        heading: "Why it matters",
        body: "Go's fast compilation means `go run` feels almost interpreted, enabling rapid iteration. The single-binary output with zero dependencies is a massive deployment advantage over languages requiring runtimes or interpreters.",
      },
    ],
  },
  {
    id: "json-encoding",
    title: "Working with JSON",
    summary:
      "Go's `encoding/json` package maps JSON to structs using struct tags — `json.Marshal` encodes to JSON, `json.Unmarshal` decodes from JSON.",
    details: [
      {
        heading: "How it works",
        body: "Define a struct with `json` tags to control field names. `json.Marshal` converts Go values to `[]byte` JSON. `json.Unmarshal` parses JSON bytes into Go structs. Fields must be exported (uppercase) to be serialized. Use `omitempty` to skip zero-value fields and `-` to exclude fields entirely.",
      },
      {
        heading: "Example",
        body: 'Encoding and decoding JSON:\n\n```\ntype User struct {\n    ID        int    `json:"id"`\n    Name      string `json:"name"`\n    Email     string `json:"email,omitempty"`\n    Password  string `json:"-"` // never serialize\n}\n\n// Encode\nuser := User{ID: 1, Name: "Alice"}\ndata, err := json.Marshal(user)\n// {"id":1,"name":"Alice"}\n\n// Decode\nvar u User\nerr := json.Unmarshal(data, &u)\n\n// Streaming (for HTTP bodies, files)\nerr := json.NewDecoder(r.Body).Decode(&u)\nerr := json.NewEncoder(w).Encode(u)\n```',
      },
      {
        heading: "Key tips",
        body: "Always pass a pointer to `Unmarshal`. Unknown JSON fields are silently ignored by default. Use `json.RawMessage` to defer parsing of nested objects. For HTTP handlers, prefer `json.NewDecoder`/`NewEncoder` over Marshal/Unmarshal to avoid buffering entire bodies. Struct field matching is case-insensitive in v1, but case-sensitive in the upcoming v2 — always use explicit tags.",
      },
      {
        heading: "Why it matters",
        body: "JSON is the lingua franca of REST APIs and configuration. Go's struct-tag approach gives you type-safe parsing with zero external dependencies. Getting JSON handling right is essential for any API, webhook, or config file work.",
      },
    ],
  },
  {
    id: "http-server",
    title: "HTTP Server Basics",
    summary:
      "Go's `net/http` package includes a production-grade HTTP server — since Go 1.22, the standard `ServeMux` supports method matching and path parameters.",
    details: [
      {
        heading: "How it works",
        body: "Register handler functions on a `ServeMux` with patterns like `GET /users/{id}`. The enhanced routing (Go 1.22+) supports HTTP method prefixes, wildcard path parameters via `r.PathValue()`, and exact path matching with `{$}`. No external router needed for most applications.",
      },
      {
        heading: "Example",
        body: 'A basic REST API server:\n\n```\npackage main\n\nimport (\n    "encoding/json"\n    "log"\n    "net/http"\n)\n\nfunc main() {\n    mux := http.NewServeMux()\n\n    mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {\n        w.Write([]byte("ok"))\n    })\n\n    mux.HandleFunc("GET /users/{id}", func(w http.ResponseWriter, r *http.Request) {\n        id := r.PathValue("id")\n        json.NewEncoder(w).Encode(map[string]string{"id": id})\n    })\n\n    mux.HandleFunc("POST /users", func(w http.ResponseWriter, r *http.Request) {\n        var user map[string]string\n        json.NewDecoder(r.Body).Decode(&user)\n        w.WriteHeader(http.StatusCreated)\n        json.NewEncoder(w).Encode(user)\n    })\n\n    log.Println("Listening on :8080")\n    log.Fatal(http.ListenAndServe(":8080", mux))\n}\n```',
      },
      {
        heading: "Key tips",
        body: "Use `{$}` at the end of a pattern to match only the exact path (e.g., `GET /{$}` matches `/` but not `/anything`). Patterns with methods automatically return 405 for wrong methods. Set `Content-Type` headers before writing the response body. For production, configure timeouts: `&http.Server{ReadTimeout: 5*time.Second, WriteTimeout: 10*time.Second}`.",
      },
      {
        heading: "Why it matters",
        body: "Go's standard HTTP server is used in production by major companies without any wrapper framework. The 1.22+ routing enhancements eliminated the primary reason teams reached for third-party routers like chi or gorilla/mux. Fewer dependencies means less maintenance.",
      },
    ],
  },
  {
    id: "http-client",
    title: "HTTP Client & API Calls",
    summary:
      "Go's `net/http` package provides a full HTTP client with connection pooling — always create a custom client with timeouts instead of using `http.DefaultClient`.",
    details: [
      {
        heading: "How it works",
        body: "Create an `http.Client` with a timeout, build requests with `http.NewRequestWithContext`, and read the response body. The client automatically pools connections for reuse. Always close `resp.Body` with `defer` to prevent resource leaks.",
      },
      {
        heading: "Example",
        body: 'Making a GET and POST request:\n\n```\nclient := &http.Client{Timeout: 10 * time.Second}\n\n// GET request\nresp, err := client.Get("https://api.example.com/users")\nif err != nil {\n    log.Fatal(err)\n}\ndefer resp.Body.Close()\n\nvar users []User\njson.NewDecoder(resp.Body).Decode(&users)\n\n// POST with JSON body\ndata, _ := json.Marshal(User{Name: "Alice"})\nresp, err := client.Post(\n    "https://api.example.com/users",\n    "application/json",\n    bytes.NewReader(data),\n)\ndefer resp.Body.Close()\n\n// With context and custom headers\nctx, cancel := context.WithTimeout(ctx, 5*time.Second)\ndefer cancel()\nreq, _ := http.NewRequestWithContext(ctx, "GET", url, nil)\nreq.Header.Set("Authorization", "Bearer "+token)\nresp, err := client.Do(req)\n```',
      },
      {
        heading: "Key tips",
        body: "The default client has NO timeout — always set one. Reuse a single `http.Client` across your application (it's safe for concurrent use and pools connections). Always check `resp.StatusCode` — non-2xx responses are not returned as errors. Use `context.WithTimeout` for per-request deadlines that respect cancellation chains.",
      },
      {
        heading: "Why it matters",
        body: "Every backend service makes HTTP calls to APIs, databases, and other services. A misconfigured client without timeouts can hang indefinitely, causing cascading failures. Connection pooling and reuse are critical for performance under load.",
      },
    ],
  },
  {
    id: "testing",
    title: "Testing with go test",
    summary:
      "Go has built-in testing via the `testing` package — test files end in `_test.go`, test functions start with `Test`, and table-driven tests are the idiomatic pattern.",
    details: [
      {
        heading: "How it works",
        body: "Place tests in `*_test.go` files alongside the code they test. Test functions take `*testing.T` and use `t.Error`/`t.Fatal` to report failures. Run `go test ./...` to test all packages. Use `t.Run` for subtests and `t.Parallel()` for concurrent execution.",
      },
      {
        heading: "Example",
        body: 'Table-driven test pattern:\n\n```\nfunc Add(a, b int) int { return a + b }\n\nfunc TestAdd(t *testing.T) {\n    tests := []struct {\n        name     string\n        a, b     int\n        expected int\n    }{\n        {"positive", 2, 3, 5},\n        {"negative", -1, -2, -3},\n        {"zero", 0, 0, 0},\n        {"mixed", -1, 5, 4},\n    }\n\n    for _, tt := range tests {\n        t.Run(tt.name, func(t *testing.T) {\n            got := Add(tt.a, tt.b)\n            if got != tt.expected {\n                t.Errorf("Add(%d, %d) = %d, want %d",\n                    tt.a, tt.b, got, tt.expected)\n            }\n        })\n    }\n}\n```\n\n```\ngo test ./...              # all tests\ngo test -v ./...           # verbose output\ngo test -run TestAdd ./... # specific test\ngo test -cover ./...       # with coverage\n```',
      },
      {
        heading: "Key tips",
        body: "No assertion library needed — `if got != want` is idiomatic Go. Use `t.Helper()` in helper functions so errors report the caller's line. Use `t.Cleanup()` for teardown instead of `defer` in subtests. Always include edge cases (nil, empty, zero, boundary values) in table tests. Run `go test -race ./...` to detect data races.",
      },
      {
        heading: "Why it matters",
        body: "Go's test tooling has zero dependencies and runs fast. Table-driven tests make adding new cases trivial — just add a row. The `-race` flag catches concurrency bugs that would be nightmares to debug in production. Built-in coverage means no excuses for untested code.",
      },
    ],
  },
  {
    id: "file-operations",
    title: "Working with Files",
    summary:
      "Use `os.ReadFile`/`os.WriteFile` for simple operations and `os.Open` with `bufio.Scanner` for large files — always `defer` file handles closed.",
    details: [
      {
        heading: "How it works",
        body: "The `os` package provides file operations. `os.ReadFile` reads an entire file into memory. `os.WriteFile` writes bytes atomically. For large files, `os.Open` with `bufio.Scanner` reads line by line. The deprecated `ioutil` package (pre-1.16) has been replaced by `os` and `io` equivalents.",
      },
      {
        heading: "Example",
        body: 'Common file operations:\n\n```\n// Read entire file\ndata, err := os.ReadFile("config.json")\nif err != nil {\n    log.Fatal(err)\n}\n\n// Write file (creates or truncates)\nerr := os.WriteFile("output.txt",\n    []byte("hello"), 0644)\n\n// Read large file line by line\nf, err := os.Open("large.log")\nif err != nil {\n    log.Fatal(err)\n}\ndefer f.Close()\n\nscanner := bufio.NewScanner(f)\nfor scanner.Scan() {\n    line := scanner.Text()\n    fmt.Println(line)\n}\nif err := scanner.Err(); err != nil {\n    log.Fatal(err)\n}\n\n// Check if file exists\nif _, err := os.Stat("file.txt"); errors.Is(err, os.ErrNotExist) {\n    fmt.Println("file does not exist")\n}\n```',
      },
      {
        heading: "Key tips",
        body: "Use `0644` for regular files and `0755` for executables when setting permissions. Always check `scanner.Err()` after the scan loop. For safe writes, write to a temp file first then `os.Rename` — this prevents corruption on crashes. Use `filepath.Join` (not string concatenation) for cross-platform paths.",
      },
      {
        heading: "Why it matters",
        body: "File I/O is fundamental for configs, logs, data processing, and caching. Choosing `ReadFile` vs streaming with `bufio` determines whether your service handles a 2GB log file or runs out of memory. Proper error handling and file closing prevent data loss and resource leaks.",
      },
    ],
  },
  {
    id: "env-config",
    title: "Environment Variables & Config",
    summary:
      "Use `os.Getenv` to read environment variables for configuration following the twelve-factor app methodology — keep secrets out of code.",
    details: [
      {
        heading: "How it works",
        body: "`os.Getenv` returns the value of an env var or an empty string if unset. `os.LookupEnv` distinguishes between unset and empty. For structured configuration, define a config struct and populate it from environment variables at startup. Validate all required config before starting the application.",
      },
      {
        heading: "Example",
        body: 'Config pattern with env vars:\n\n```\ntype Config struct {\n    Port      string\n    DBUrl     string\n    LogLevel  string\n}\n\nfunc LoadConfig() Config {\n    return Config{\n        Port:     getEnv("PORT", "8080"),\n        DBUrl:    mustEnv("DATABASE_URL"),\n        LogLevel: getEnv("LOG_LEVEL", "info"),\n    }\n}\n\nfunc getEnv(key, fallback string) string {\n    if val, ok := os.LookupEnv(key); ok {\n        return val\n    }\n    return fallback\n}\n\nfunc mustEnv(key string) string {\n    val, ok := os.LookupEnv(key)\n    if !ok {\n        log.Fatalf("required env var %s is not set", key)\n    }\n    return val\n}\n```\n\n```\nPORT=3000 DATABASE_URL=postgres://... go run .\n```',
      },
      {
        heading: "Key tips",
        body: 'Use `LookupEnv` over `Getenv` when you need to distinguish "not set" from "set to empty". Create a `mustEnv` helper that fails fast for required variables. For local development, `github.com/joho/godotenv` loads `.env` files but never commit `.env` to version control. Keep all config loading in one place for auditability.',
      },
      {
        heading: "Why it matters",
        body: "Environment-based configuration is the standard for containers, Kubernetes, and cloud platforms. Hardcoded config is a security risk and a deployment nightmare. The twelve-factor app pattern keeps your binary environment-agnostic, deployable anywhere from local dev to production.",
      },
    ],
  },
  {
    id: "building-binaries",
    title: "Building & Cross-Compiling",
    summary:
      "Go compiles to a single static binary — cross-compile for any OS/architecture by setting `GOOS` and `GOARCH` environment variables.",
    details: [
      {
        heading: "How it works",
        body: "Go compiles and links everything into one binary with no external dependencies. Cross-compilation is built into the toolchain — no extra tools needed. Set `GOOS` (operating system) and `GOARCH` (CPU architecture) before `go build`. Use `-ldflags` to embed version info and strip debug symbols.",
      },
      {
        heading: "Example",
        body: 'Building for multiple platforms:\n\n```\n# Build for current platform\ngo build -o myapp .\n\n# Cross-compile for Linux (from macOS/Windows)\nGOOS=linux GOARCH=amd64 go build -o myapp-linux .\n\n# Build for Apple Silicon Mac\nGOOS=darwin GOARCH=arm64 go build -o myapp-mac .\n\n# Build for Windows\nGOOS=windows GOARCH=amd64 go build -o myapp.exe .\n\n# Production build: strip debug info, embed version\ngo build -ldflags="-s -w -X main.version=1.2.3" -o myapp .\n\n# Disable CGO for fully static binary\nCGO_ENABLED=0 go build -o myapp .\n```',
      },
      {
        heading: "Key tips",
        body: 'Set `CGO_ENABLED=0` for truly static binaries that work in `scratch` or `distroless` Docker images. Use `-ldflags="-s -w"` to strip debug symbols and reduce binary size by ~30%. The `-X` linker flag injects build-time values (version, commit hash) without modifying source code. Always test cross-compiled binaries on the target platform.',
      },
      {
        heading: "Why it matters",
        body: "Single-binary deployment is Go's superpower — no runtimes, no dependency managers on servers, no version conflicts. Cross-compilation from a single machine enables CI/CD pipelines that build for Linux, macOS, and Windows simultaneously. Static binaries are ideal for minimal container images.",
      },
    ],
  },
  {
    id: "third-party-packages",
    title: "Using Third-Party Packages",
    summary:
      "Use `go get` to add dependencies and `go mod tidy` to clean them up — Go modules handle versioning and integrity verification automatically.",
    details: [
      {
        heading: "How it works",
        body: "Run `go get <package>@<version>` to add a dependency — this updates `go.mod` and `go.sum`. Import the package in your code and the toolchain resolves it. `go mod tidy` removes unused dependencies and adds missing ones. Since Go 1.24, use `go get -tool` to track CLI tool dependencies in your module.",
      },
      {
        heading: "Example",
        body: 'Adding and using packages:\n\n```\n# Add a package\ngo get github.com/rs/zerolog@latest\n\n# Add a specific version\ngo get github.com/go-chi/chi/v5@v5.1.0\n\n# Add a CLI tool dependency (Go 1.24+)\ngo get -tool golang.org/x/tools/cmd/stringer\n\n# Remove unused dependencies\ngo mod tidy\n\n# Use in code\nimport "github.com/rs/zerolog/log"\n\nfunc main() {\n    log.Info().Str("status", "ready").Msg("server starting")\n}\n```',
      },
      {
        heading: "Popular packages to know",
        body: "Essential ecosystem packages:\n\n- **go-chi/chi** — lightweight router (if you need middleware chains beyond stdlib)\n- **rs/zerolog** or **uber-go/zap** — structured logging\n- **jackc/pgx** — PostgreSQL driver\n- **go-redis/redis** — Redis client\n- **stretchr/testify** — test assertions and mocks\n- **spf13/viper** — configuration management\n- **spf13/cobra** — CLI framework (powers kubectl, Hugo, GitHub CLI)\n- **golang.org/x/** — official extended libraries (sync, crypto, text)",
      },
      {
        heading: "Key tips",
        body: "Always commit both `go.mod` and `go.sum` to version control. Use `go mod tidy` before committing to keep dependencies clean. Pin major versions in imports (e.g., `chi/v5`) per Go's module compatibility convention. The `go.sum` file provides checksum verification — don't manually edit it. Use `go list -m all` to see your full dependency tree.",
      },
    ],
  },
];
