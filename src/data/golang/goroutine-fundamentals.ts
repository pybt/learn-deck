import type { CardData } from "../types";

export const goroutineFundamentals: CardData[] = [
  {
    id: "what-are-goroutines",
    title: "What Are Goroutines?",
    summary:
      "Lightweight user-space threads managed by the Go runtime, created with the go keyword, costing only ~2 KB of stack each.",
    details: [
      {
        heading: "How they work",
        body: 'Goroutines are functions that execute concurrently, scheduled by the Go runtime rather than the OS kernel. Every Go program starts with one goroutine — the main goroutine. Launch new ones with the go keyword:\n\n```\ngo processItem(item)\ngo func() { fmt.Println("anonymous") }()\n```',
      },
      {
        heading: "Goroutines vs OS threads",
        body: "Goroutines start with ~2 KB of stack (growable to ~1 GB) versus 1-8 MB fixed for OS threads. Creation costs microseconds instead of milliseconds. Context switching is ~200 ns in user space versus 1-10 µs through the kernel. You can run millions of goroutines but only thousands of threads.",
      },
      {
        heading: "Key concepts",
        body: "Arguments to the go statement are evaluated immediately in the calling goroutine; execution happens concurrently in the new one. Goroutines have no return values — use channels to communicate results back. The program exits when the main goroutine returns, regardless of other goroutines still running.",
      },
    ],
  },
  {
    id: "go-scheduler",
    title: "The Go Scheduler (GMP Model)",
    summary:
      "The runtime uses an M:N scheduler with three entities — Goroutines, Machines (OS threads), and Processors — to efficiently multiplex millions of goroutines.",
    details: [
      {
        heading: "GMP entities",
        body: "G (Goroutine) holds the stack and instruction pointer. M (Machine) is an actual OS thread — default limit 10,000. P (Processor) is a logical scheduling context with a local run queue of up to 256 goroutines. The number of Ps equals GOMAXPROCS, which defaults to runtime.NumCPU().",
      },
      {
        heading: "Scheduling model",
        body: "Scheduling is cooperative plus preemptive. Goroutines yield at function calls, channel operations, I/O, and memory allocation. Since Go 1.14, asynchronous preemption detects goroutines running longer than 10 ms and sends a SIGURG signal to preempt them — even tight loops get interrupted.",
      },
      {
        heading: "Work stealing",
        body: "When a P's local queue is empty, it steals half of another random P's queue. It also checks the global run queue (every 61st tick to prevent starvation) and the network poller for completed I/O. When a goroutine enters a blocking syscall, the runtime detaches the P and assigns it to another thread.",
      },
    ],
  },
  {
    id: "channels",
    title: "Channels",
    summary:
      "Typed conduits for communication between goroutines — unbuffered for synchronous handoffs, buffered for async queues.",
    details: [
      {
        heading: "Unbuffered vs buffered",
        body: "Unbuffered channels (make(chan T)) are synchronous — the sender blocks until a receiver is ready, creating a rendezvous point. Buffered channels (make(chan T, n)) allow n sends without blocking. The sender only blocks when the buffer is full; the receiver blocks when empty.",
      },
      {
        heading: "Directional channels",
        body: 'Restrict channels at the type level for safety: chan<- T is send-only (arrow into channel), <-chan T is receive-only (arrow out). Bidirectional channels implicitly convert to directional when passed to functions, but not the reverse.\n\n```\nfunc producer(out chan<- string) { out <- "data" }\nfunc consumer(in <-chan string) { msg := <-in }\n```',
      },
      {
        heading: "Closing and ranging",
        body: "Only the sender should close a channel with close(ch). Receivers detect closure with the comma-ok idiom (v, ok := <-ch) or range loops (for v := range ch). Sending to a closed channel panics. Closing a closed channel panics. Receiving from a closed channel returns the zero value immediately.",
      },
    ],
  },
  {
    id: "select-statement",
    title: "Select Statement",
    summary:
      "Multiplexes across multiple channel operations, blocking until one is ready, with pseudo-random selection when multiple are available.",
    details: [
      {
        heading: "How it works",
        body: "Select blocks until at least one case can proceed. If multiple cases are ready, one is chosen pseudo-randomly for fairness. Add a default case to make it non-blocking. An empty select{} blocks forever — useful to keep main alive when servers run in goroutines.\n\n```\nselect {\ncase msg := <-inbox:\n    handle(msg)\ncase <-ctx.Done():\n    return\n}\n```",
      },
      {
        heading: "Timeouts and tickers",
        body: "Use time.After for one-shot timeouts in select. Caution: time.After creates a new timer each call and leaks in loops — use time.NewTimer with explicit Stop()/Reset() instead. For periodic work, use time.NewTicker in a for-select loop.",
      },
      {
        heading: "Nil channel trick",
        body: "A nil channel blocks forever in select, effectively disabling that case. This is idiomatic for dynamically removing channels from a merge — when a channel is closed, set it to nil so select stops checking it. Combine with the comma-ok idiom to detect closure.",
      },
    ],
  },
  {
    id: "sync-package",
    title: "sync Package Essentials",
    summary:
      "WaitGroup for goroutine completion, Mutex for shared state, Once for one-time initialization — the building blocks of safe concurrency.",
    details: [
      {
        heading: "WaitGroup",
        body: "Waits for a collection of goroutines to finish. Call Add() before launching the goroutine (never inside it), Done() when complete, and Wait() to block until all finish. Always use defer wg.Done() to guarantee it runs. Go 1.24+ adds wg.Go(func() { ... }) which handles Add and Done automatically.",
      },
      {
        heading: "Mutex and RWMutex",
        body: "sync.Mutex provides exclusive access — Lock()/Unlock() with defer for safety. sync.RWMutex allows multiple concurrent readers (RLock) but exclusive writers (Lock). Use RWMutex when reads vastly outnumber writes; otherwise plain Mutex may be faster. Never copy sync types — pass by pointer.",
      },
      {
        heading: "Once and atomic",
        body: "sync.Once guarantees a function runs exactly once across all goroutines — ideal for singleton initialization. If the function panics, Once considers it done and won't retry. For simple counters and flags, sync/atomic (Go 1.19+: atomic.Int64, atomic.Bool) is faster than a mutex.",
      },
    ],
  },
  {
    id: "concurrency-patterns",
    title: "Common Concurrency Patterns",
    summary:
      "Pipelines, fan-out/fan-in, and worker pools — composable patterns built from goroutines and channels.",
    details: [
      {
        heading: "Pipeline",
        body: "Chain stages connected by channels, where each stage is a goroutine that receives from upstream, processes, and sends downstream. Each stage owns and closes its output channel. Pipelines compose naturally — sq(sq(gen(2,3))) squares numbers twice.",
      },
      {
        heading: "Fan-out and fan-in",
        body: "Fan-out: multiple goroutines read from the same channel to parallelize CPU-bound work. Fan-in (merge): collect results from multiple channels into one using a goroutine per input channel plus a WaitGroup to close the output when all inputs are drained.",
      },
      {
        heading: "Worker pool and semaphore",
        body: "Worker pools use a fixed number of goroutines consuming from a shared job channel — the sender closes the channel when all jobs are submitted. For simpler concurrency limiting, use a buffered channel as a semaphore:\n\n```\nsem := make(chan struct{}, 5) // max 5 concurrent\nsem <- struct{}{}             // acquire\ndefer func() { <-sem }()     // release\n```",
      },
    ],
  },
  {
    id: "context-package",
    title: "Context for Cancellation",
    summary:
      "The context package propagates deadlines, cancellation signals, and request-scoped values through goroutine call chains.",
    details: [
      {
        heading: "Creating contexts",
        body: "Start with context.Background() (top-level) or context.TODO() (placeholder). Derive with WithCancel for manual cancellation, WithTimeout for duration-based, or WithDeadline for absolute time. Contexts form a tree — canceling a parent cancels all children.",
      },
      {
        heading: "Using cancellation",
        body: "Check ctx.Done() in select statements to respond to cancellation. Always defer cancel() to prevent goroutine and timer leaks. ctx.Err() returns context.Canceled or context.DeadlineExceeded. Go 1.20+ adds WithCancelCause for custom error reasons.\n\n```\nctx, cancel := context.WithTimeout(ctx, 5*time.Second)\ndefer cancel()\n```",
      },
      {
        heading: "Best practices",
        body: "Always pass context.Context as the first parameter, named ctx. Never store contexts in structs. Never pass nil — use context.TODO(). Use WithValue sparingly and only for request-scoped metadata like trace IDs, not business logic. Use unexported key types to avoid collisions.",
      },
    ],
  },
  {
    id: "race-conditions",
    title: "Race Conditions and Detection",
    summary:
      "Data races occur when goroutines access shared memory without synchronization — Go's race detector catches them at runtime.",
    details: [
      {
        heading: "What is a data race",
        body: "Two goroutines access the same variable concurrently with at least one writing and no synchronization. Go's race detector instruments memory accesses at compile time using ThreadSanitizer. Enable it with -race flag:\n\n```\ngo test -race ./...\ngo run -race main.go\n```",
      },
      {
        heading: "Common race patterns",
        body: "Loop variable capture (pre-Go 1.22): goroutines sharing the loop variable. Unsynchronized counter increments — use atomic.AddInt64 or a mutex. Concurrent map writes cause a fatal runtime panic. Accidentally shared err variable in goroutines — use := instead of =.",
      },
      {
        heading: "Limitations",
        body: "The race detector only catches races that actually execute at runtime — it cannot find races in untested code paths. Performance cost is 5-15x CPU slowdown and 5-10x memory overhead, so use it in testing and CI but not production.",
      },
    ],
  },
  {
    id: "goroutine-leaks",
    title: "Goroutine Leak Prevention",
    summary:
      "Leaked goroutines waste memory and CPU indefinitely — prevent them by always planning how every goroutine will stop.",
    details: [
      {
        heading: "Common leak causes",
        body: "Blocked on channel send with no receiver. Blocked on channel receive with no sender or unclosed channel. Missing context cancellation in long-running operations. Infinite loops without exit conditions. Producer-consumer mismatches where one side exits early.",
      },
      {
        heading: "Detection",
        body: "Monitor runtime.NumGoroutine() for steady growth. Use net/http/pprof to inspect goroutine stack traces at /debug/pprof/goroutine. In tests, use Uber's goleak package: defer goleak.VerifyNone(t) catches any goroutines that outlive the test.",
      },
      {
        heading: "Prevention rules",
        body: "Before writing go func(), answer: how and when does this goroutine stop? Always use context.Context for cancellation and select on ctx.Done(). Close channels from the sender side when done. Use sync.WaitGroup to track completion. Set timeouts on all blocking operations. Prefer worker pools over unbounded goroutine creation.",
      },
    ],
  },
  {
    id: "errgroup-pattern",
    title: "errgroup for Structured Concurrency",
    summary:
      "The errgroup package combines WaitGroup-style waiting with first-error propagation and bounded concurrency.",
    details: [
      {
        heading: "How it works",
        body: "Create a group with errgroup.WithContext to get a derived context that cancels on first error. Launch goroutines with g.Go(func() error { ... }). Call g.Wait() to block until all complete — it returns the first non-nil error.\n\n```\ng, ctx := errgroup.WithContext(ctx)\ng.Go(func() error { return fetchUser(ctx) })\ng.Go(func() error { return fetchOrders(ctx) })\nif err := g.Wait(); err != nil { ... }\n```",
      },
      {
        heading: "Bounded concurrency",
        body: "Use g.SetLimit(n) to cap the number of concurrent goroutines. When the limit is reached, g.Go blocks until a slot opens. g.TryGo attempts a non-blocking launch and returns false if the limit is hit. This replaces manual semaphore patterns.",
      },
      {
        heading: "Why it matters",
        body: 'errgroup is the standard answer to "run N things concurrently and collect errors." It handles WaitGroup bookkeeping, error propagation, and context cancellation in one package. It lives in golang.org/x/sync/errgroup and is used extensively in production Go code.',
      },
    ],
  },
];
