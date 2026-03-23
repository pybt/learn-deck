import type { CardData } from "../types";

export const golangIntroduction: CardData[] = [
  {
    id: "what-is-go",
    title: "What Is Go",
    summary:
      "Go is a statically typed, compiled language created at Google, designed for simplicity, fast compilation, and built-in concurrency — powering infrastructure like Kubernetes, Docker, and Terraform.",
    details: [
      {
        heading: "How it works",
        body: "Go compiles to a single static binary with no runtime dependencies. It features garbage collection, a strong standard library, and a concurrency model based on Communicating Sequential Processes (CSP). The language intentionally omits features like inheritance and exceptions in favor of simplicity.",
      },
      {
        heading: "Key concepts",
        body: "Go sits between Python and C/C++ in performance. It starts fast and deploys easily in containers. The language was designed to solve real problems at scale: slow compile times, complicated dependencies, and overly complex syntax in large codebases.",
      },
      {
        heading: "Why it matters",
        body: "Go is the dominant language for cloud-native infrastructure and DevOps tooling. Its simplicity means teams onboard quickly, and single-binary output simplifies deployment. It's ideal for APIs, microservices, CLIs, and systems programming.",
      },
    ],
  },
  {
    id: "toolchain",
    title: "Go Toolchain",
    summary:
      "Go ships with a comprehensive built-in toolchain for building, testing, formatting, and managing dependencies — no third-party build tools needed.",
    details: [
      {
        heading: "How it works",
        body: "The go command handles everything: `go mod init` and `go mod tidy` manage dependencies, `go build` and `go run` compile and execute, `go test` runs tests, and `go fmt` auto-formats code. No Makefiles or external build systems required.",
      },
      {
        heading: "Example",
        body: "Common toolchain commands:\n\n```\ngo mod init example.com/myapp\ngo get golang.org/x/sync\ngo mod tidy\ngo build -o myapp ./cmd/server\ngo test ./...\ngo vet ./...\n```",
      },
      {
        heading: "Why it matters",
        body: "The all-in-one toolchain enforces consistency across teams. `go fmt` eliminates style debates, `go vet` catches bugs before they ship, and modules provide reproducible dependency management. The `toolchain` directive in go.mod ensures all developers use the same Go version.",
      },
    ],
  },
  {
    id: "packages-modules",
    title: "Packages & Modules",
    summary:
      "Go organizes code into packages (directories of .go files) and modules (collections of packages with versioned dependency management via go.mod).",
    details: [
      {
        heading: "How it works",
        body: "A package is a directory of `.go` files sharing the same `package` declaration. `package main` is the entry point. A module is defined by `go.mod` at the repository root, declaring the module path and Go version. Dependencies are fetched automatically.",
      },
      {
        heading: "Key concepts",
        body: "Exported identifiers start with an uppercase letter — lowercase means package-private. The `internal/` directory prevents external packages from importing your private code. Workspaces (`go.work`) support multi-module development in monorepos.",
      },
      {
        heading: "Example",
        body: 'Project structure with packages:\n\n```\nmyapp/\n  go.mod\n  cmd/server/main.go    // package main\n  internal/auth/auth.go // package auth (private)\n  pkg/client/client.go  // package client (public)\n```\n\nImport with the full module path: `import "example.com/myapp/internal/auth"`.',
      },
    ],
  },
  {
    id: "structs-methods",
    title: "Structs & Methods",
    summary:
      "Structs group related fields and methods define behavior on types — Go's composition-based alternative to classes and inheritance.",
    details: [
      {
        heading: "How it works",
        body: "Structs group named fields of different types. Methods are functions with a receiver that associate behavior with a type. Pointer receivers (`*T`) can modify the original value; value receivers (`T`) work on a copy.",
      },
      {
        heading: "Example",
        body: 'Defining a struct with methods:\n\n```\ntype Server struct {\n    Host string\n    Port int\n}\n\nfunc (s *Server) SetPort(p int) { s.Port = p }\nfunc (s Server) Address() string {\n    return fmt.Sprintf("%s:%d", s.Host, s.Port)\n}\n```',
      },
      {
        heading: "Why it matters",
        body: "Go favors composition over inheritance — embed structs to reuse behavior without class hierarchies. If one method uses a pointer receiver, all methods on that type should too for consistency. Constructor functions (e.g., `NewServer()`) return initialized pointers to prevent nil panics.",
      },
    ],
  },
  {
    id: "interfaces",
    title: "Interfaces",
    summary:
      "Go interfaces are satisfied implicitly — any type implementing the required methods automatically satisfies the interface, with no 'implements' keyword needed.",
    details: [
      {
        heading: "How it works",
        body: "Interfaces define method sets, not data. Keep them small — 1-2 methods is idiomatic. The empty interface `any` (alias for `interface{}`) accepts all types but should be used sparingly. Standard library interfaces like `io.Reader`, `io.Writer`, and `error` are ubiquitous.",
      },
      {
        heading: "Example",
        body: "Implicit interface satisfaction:\n\n```\ntype Writer interface {\n    Write(p []byte) (n int, err error)\n}\n\ntype FileWriter struct{ path string }\n\nfunc (fw FileWriter) Write(p []byte) (int, error) {\n    return len(p), os.WriteFile(fw.path, p, 0644)\n}\n// FileWriter satisfies Writer automatically\n```",
      },
      {
        heading: "Why it matters",
        body: "Implicit interfaces enable loose coupling and easy testing — swap a real database for a mock by satisfying the same interface. The Go proverb is \"accept interfaces, return structs\" to keep APIs flexible. Define interfaces where they're consumed, not where they're implemented.",
      },
    ],
  },
  {
    id: "error-handling",
    title: "Error Handling",
    summary:
      "Go treats errors as values returned from functions rather than using exceptions — every error must be explicitly checked, making failure paths visible.",
    details: [
      {
        heading: "How it works",
        body: 'Functions return `error` as the last value. Callers check `if err != nil` and either handle or propagate. Wrap errors with `fmt.Errorf("context: %w", err)` to build inspectable error chains. Use `errors.Is()` and `errors.As()` to examine wrapped errors.',
      },
      {
        heading: "Example",
        body: 'Error wrapping and inspection:\n\n```\nfunc LoadConfig(path string) (*Config, error) {\n    data, err := os.ReadFile(path)\n    if err != nil {\n        return nil, fmt.Errorf("loading config %s: %w", path, err)\n    }\n    return parse(data)\n}\n\nif errors.Is(err, os.ErrNotExist) {\n    // file missing — use defaults\n}\n```',
      },
      {
        heading: "Why it matters",
        body: "Explicit error handling prevents silent failures common in exception-based languages. Wrapping with `%w` creates chains that aid debugging. Custom error types implement the `error` interface for domain-specific information. Use `log/slog` (standard library) for structured error logging.",
      },
    ],
  },
  {
    id: "goroutines-channels",
    title: "Goroutines & Channels",
    summary:
      "Goroutines are lightweight concurrent functions (~2KB stack) managed by the Go runtime, communicating safely through channels rather than shared memory.",
    details: [
      {
        heading: "How it works",
        body: "Launch a goroutine with `go func()`. Channels (`chan T`) pass data between goroutines — unbuffered channels synchronize sender and receiver, buffered channels allow async sends up to capacity. `select` multiplexes across multiple channels.",
      },
      {
        heading: "Example",
        body: "Concurrent HTTP fetches:\n\n```\nch := make(chan string, len(urls))\nfor _, url := range urls {\n    go func() {\n        resp, _ := http.Get(url)\n        ch <- resp.Status\n    }()\n}\nfor range urls {\n    fmt.Println(<-ch)\n}\n```",
      },
      {
        heading: "Why it matters",
        body: "Go's CSP-based concurrency is its killer feature — thousands of goroutines are normal and cheap. Use `sync.WaitGroup` to wait for completion and `context.Context` for cancellation. Common patterns include fan-out/fan-in, pipelines, and worker pools. Always ensure goroutines can exit to prevent leaks.",
      },
    ],
  },
  {
    id: "slices-maps",
    title: "Slices & Maps",
    summary:
      "Slices are dynamic, variable-length sequences backed by arrays, and maps are built-in hash tables — together they handle most collection needs in Go.",
    details: [
      {
        heading: "How it works",
        body: "Slices have a pointer, length, and capacity. `append()` grows them automatically, potentially allocating a new backing array. Maps are reference types created with `make(map[K]V)` or literals. Iteration order on maps is intentionally randomized.",
      },
      {
        heading: "Example",
        body: 'Working with slices and maps:\n\n```\nnames := []string{"Alice", "Bob"}\nnames = append(names, "Charlie")\n\nids := make([]int, 0, 1000) // pre-allocate\n\nscores := map[string]int{"Alice": 95}\nval, ok := scores["Bob"] // ok=false if missing\n```',
      },
      {
        heading: "Why it matters",
        body: "Pre-allocating with `make([]T, 0, cap)` avoids repeated allocations in hot paths. Maps return the zero value for missing keys — always use the comma-ok idiom (`val, ok := m[key]`) to distinguish missing from zero. `range` iterates both: `for i, v := range slice` and `for k, v := range m`.",
      },
    ],
  },
  {
    id: "pointers",
    title: "Pointers",
    summary:
      "Go has pointers for controlled mutability and efficient data passing, but no pointer arithmetic — safer than C-style pointers with garbage collection.",
    details: [
      {
        heading: "How it works",
        body: "`&x` gets the address of x, `*p` dereferences a pointer to access the value. Go's garbage collector manages memory automatically — no manual malloc/free. Nil pointer dereference causes a panic, so always validate pointers from external sources.",
      },
      {
        heading: "Example",
        body: "Using pointers to modify values:\n\n```\nfunc increment(val *int) {\n    *val++\n}\n\nn := 42\nincrement(&n)\nfmt.Println(n) // 43\n\n// Constructor pattern\nfunc NewServer(host string) *Server {\n    return &Server{Host: host, Port: 8080}\n}\n```",
      },
      {
        heading: "Why it matters",
        body: "Use pointers for method receivers that modify state, optional fields (`*string` distinguishes empty from absent), and avoiding copies of large structs. For small types like `int`, `bool`, and small structs, pass by value. Constructor functions returning initialized pointers are idiomatic.",
      },
    ],
  },
  {
    id: "defer-panic-recover",
    title: "Defer, Panic & Recover",
    summary:
      "defer schedules cleanup to run when a function exits, panic halts execution for unrecoverable errors, and recover catches panics to prevent crashes.",
    details: [
      {
        heading: "How it works",
        body: "Deferred calls execute in LIFO order when the surrounding function returns — even during a panic. `panic` unwinds the stack running all deferred functions. `recover` only works inside a deferred function, returning the panic value or nil.",
      },
      {
        heading: "Example",
        body: "Resource cleanup and panic recovery:\n\n```\nfunc readFile(path string) ([]byte, error) {\n    f, err := os.Open(path)\n    if err != nil {\n        return nil, err\n    }\n    defer f.Close() // guaranteed cleanup\n    return io.ReadAll(f)\n}\n```",
      },
      {
        heading: "Why it matters",
        body: "Use `defer` to eliminate resource leaks for files, locks, database connections, and HTTP response bodies. Avoid `panic` in library code — return errors instead. Use `recover` only at top-level boundaries like HTTP handlers to prevent one bad request from crashing the server.",
      },
    ],
  },
];
